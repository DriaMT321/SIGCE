import {
  obtenerfranjasperiodosdiarios,
  diaslectivospasemana,
  type turnoacademico,
} from '@academic/academic-domain';

export type diasemanahorario = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';

export interface asignaciondocente {
  subject: { id: string; name: string; code: string };
  teacher: { id: string; firstName: string; lastName: string };
  periodsPerWeek?: number | null;
}

export interface bloqueocupadodocente {
  teacherId: string;
  dayOfWeek: string;
  periodIndex: number;
  startTime?: string;
}

export interface bloquehorariogenerado {
  subjectId: string;
  teacherId: string;
  dayOfWeek: diasemanahorario;
  periodIndex: number;
  startTime: string;
  endTime: string;
}

export interface distribucionmaterias extends asignaciondocente {
  periods: number;
}

export class errorgeneracionhorario extends Error {
  constructor(
    mensaje: string,
    readonly code: 'NO_ASSIGNMENTS' | 'TOO_MANY_ASSIGNMENTS' | 'WEEKLY_PERIODS_MISMATCH' | 'CONFLICT',
  ) {
    super(mensaje);
    this.name = 'ScheduleGenerationError';
  }
}

const constantedias: readonly diasemanahorario[] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
];

function clavebloquedocente(iddocente: string, dia: string, periodo: number) {
  return `${iddocente}_${dia}_${periodo}`;
}

export function generarhorariosemanal(
  nivelacademico: number,
  turno: turnoacademico,
  asignaciones: asignaciondocente[],
  ocupadobloques: bloqueocupadodocente[],
): { slots: bloquehorariogenerado[]; distribution: distribucionmaterias[] } {
  const horariosperiodo = obtenerfranjasperiodosdiarios(nivelacademico, turno);
  const periodospordia = horariosperiodo.length;
  const periodossemanales = diaslectivospasemana * periodospordia;
  if (asignaciones.length === 0) {
    throw new errorgeneracionhorario(
      'Asigna al menos una materia y un docente al curso antes de generar el horario.',
      'NO_ASSIGNMENTS',
    );
  }
  const gruposmateria = Array.from(
    asignaciones.reduce((grupos, asignacion) => {
      const grupo = grupos.get(asignacion.subject.id) ?? [];
      grupo.push(asignacion);
      grupos.set(asignacion.subject.id, grupo);
      return grupos;
    }, new Map<string, asignaciondocente[]>()).values(),
  );
  if (gruposmateria.length > periodossemanales) {
    throw new errorgeneracionhorario(
      'El curso tiene más materias asignadas que sesiones semanales disponibles.',
      'TOO_MANY_ASSIGNMENTS',
    );
  }

  const cargaconfigurada = asignaciones.reduce(
    (total, asignacion) => total + (asignacion.periodsPerWeek ?? 0),
    0,
  );
  if (cargaconfigurada > periodossemanales) {
    throw new errorgeneracionhorario(
      `Las sesiones configuradas suman ${cargaconfigurada}, pero el curso dispone de ${periodossemanales} por semana.`,
      'WEEKLY_PERIODS_MISMATCH',
    );
  }

  const cargasinconfigurar = asignaciones.filter((asignacion) => asignacion.periodsPerWeek == null);
  if (cargasinconfigurar.length === 0 && cargaconfigurada !== periodossemanales) {
    throw new errorgeneracionhorario(
      `Configura ${periodossemanales} sesiones semanales entre las materias; ahora suman ${cargaconfigurada}.`,
      'WEEKLY_PERIODS_MISMATCH',
    );
  }

  const periodosporasignacion = new Map<asignaciondocente, number>();
  if (cargasinconfigurar.length === asignaciones.length) {
    const baseporgrado = Math.floor(periodossemanales / gruposmateria.length);
    const sobrantesporgrado = periodossemanales % gruposmateria.length;
    gruposmateria.forEach((grupo, indicegrupo) => {
      const sesionesmateria = baseporgrado + (indicegrupo < sobrantesporgrado ? 1 : 0);
      const basepordocente = Math.floor(sesionesmateria / grupo.length);
      const sobrantespordocente = sesionesmateria % grupo.length;
      grupo.forEach((asignacion, indice) => {
        periodosporasignacion.set(asignacion, basepordocente + (indice < sobrantespordocente ? 1 : 0));
      });
    });
  } else {
    const restantes = periodossemanales - cargaconfigurada;
    const basependiente = Math.floor(restantes / cargasinconfigurar.length);
    const sobrantespendientes = restantes % cargasinconfigurar.length;
    let indicependiente = 0;
    for (const asignacion of asignaciones) {
      if (asignacion.periodsPerWeek != null) {
        periodosporasignacion.set(asignacion, asignacion.periodsPerWeek);
      } else {
        periodosporasignacion.set(
          asignacion,
          basependiente + (indicependiente < sobrantespendientes ? 1 : 0),
        );
        indicependiente += 1;
      }
    }
  }

  const distribucion = asignaciones
    .map((tarea) => ({ ...tarea, periods: periodosporasignacion.get(tarea) ?? 0 }))
    .filter((asignacion) => asignacion.periods > 0);
  const ocupado = new Set(
    ocupadobloques.map((bloque) =>
      clavebloquedocente(bloque.teacherId, bloque.dayOfWeek, bloque.periodIndex),
    ),
  );
  const bloquessemanales = constantedias.flatMap((diasemana) =>
    Array.from({ length: periodospordia }, (_, indice) => ({
      dayOfWeek: diasemana,
      periodIndex: indice + 1,
    })),
  );
  const bloquesdisponiblesporasignacion = distribucion.map((asignacion) =>
    bloquessemanales.flatMap((bloque, indicebloque) =>
      ocupado.has(clavebloquedocente(asignacion.teacher.id, bloque.dayOfWeek, bloque.periodIndex))
        ? []
        : [indicebloque],
    ),
  );

  // Match every required session to a distinct weekly slot. A greedy choice can
  // consume the only remaining slot for another teacher and report a false conflict.
  const requeridosesiones = distribucion.flatMap((asignacion, indiceasignacion) =>
    Array.from({ length: asignacion.periods }, () => indiceasignacion),
  );
  requeridosesiones.sort(
    (restante, derecha) =>
      bloquesdisponiblesporasignacion[restante].length -
        bloquesdisponiblesporasignacion[derecha].length || restante - derecha,
  );
  const asignacionporbloque = Array<number>(bloquessemanales.length).fill(-1);

  const asignarsesion = (indicesesion: number, bloquesvisitados: Set<number>): boolean => {
    const indiceasignacion = requeridosesiones[indicesesion];
    for (const indicebloque of bloquesdisponiblesporasignacion[indiceasignacion]) {
      if (bloquesvisitados.has(indicebloque)) continue;
      bloquesvisitados.add(indicebloque);
      const sesionanterior = asignacionporbloque[indicebloque];
      if (sesionanterior === -1 || asignarsesion(sesionanterior, bloquesvisitados)) {
        asignacionporbloque[indicebloque] = indicesesion;
        return true;
      }
    }
    return false;
  };

  for (let indicesesion = 0; indicesesion < requeridosesiones.length; indicesesion++) {
    if (!asignarsesion(indicesesion, new Set())) {
      const bloque = bloquessemanales.find((candidato) =>
        distribucion.every((asignacion) =>
          ocupado.has(
            clavebloquedocente(asignacion.teacher.id, candidato.dayOfWeek, candidato.periodIndex),
          ),
        ),
      );
      const diasemana = bloque?.dayOfWeek ?? constantedias[0];
      const indiceperiodo = bloque?.periodIndex ?? 1;
      throw new errorgeneracionhorario(
        `No se puede completar el horario: todos los docentes asignados tienen conflicto o no existe una distribución compatible con sus disponibilidades (${diasemana}, período ${indiceperiodo}).`,
        'CONFLICT',
      );
    }
  }

  const bloques: bloquehorariogenerado[] = bloquessemanales.map((bloque, indicebloque) => {
    const indiceasignacion = requeridosesiones[asignacionporbloque[indicebloque]];
    const asignacion = distribucion[indiceasignacion];
    const hora = horariosperiodo[bloque.periodIndex - 1];
    return {
      subjectId: asignacion.subject.id,
      teacherId: asignacion.teacher.id,
      dayOfWeek: bloque.dayOfWeek,
      periodIndex: bloque.periodIndex,
      startTime: hora.horainicio,
      endTime: hora.horafin,
    };
  });

  return {
    slots: bloques,
    distribution: distribucion,
  };
}
