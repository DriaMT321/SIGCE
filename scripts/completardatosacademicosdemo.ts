import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import {
  obtenerfranjasperiodosdiarios,
  type turnoacademico,
} from '@academic/academic-domain';
import type {
  bloqueocupadodocente,
} from '../apps/api/src/modules/schedules/domain/services/generarhorariosemanal';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

type Materia = { id: string; name: string; code: string };
type Docente = {
  id: string;
  firstName: string;
  lastName: string;
  ci: string;
  specialty: string;
};

type familiaacademica = 'INICIAL' | 'LENGUAJES' | 'MATEMATICA' | 'CIENCIAS' | 'SOCIALES' | 'TECNOLOGIA' | 'ARTES' | 'EDUCACION_FISICA';

const cuposporfamilia: Record<familiaacademica, number> = {
  INICIAL: 5,
  LENGUAJES: 8,
  MATEMATICA: 5,
  CIENCIAS: 4,
  SOCIALES: 5,
  TECNOLOGIA: 2,
  ARTES: 3,
  EDUCACION_FISICA: 2,
};

const nombresfamilia: Record<familiaacademica, string> = {
  INICIAL: 'Desarrollo Integral Infantil',
  LENGUAJES: 'Comunicación y Lenguajes',
  MATEMATICA: 'Matemática',
  CIENCIAS: 'Ciencias Naturales',
  SOCIALES: 'Ciencias Sociales y Humanidades',
  TECNOLOGIA: 'Técnica Tecnológica General',
  ARTES: 'Artes Plásticas y Educación Musical',
  EDUCACION_FISICA: 'Educación Física y Deportes',
};

function familiaespecialidad(especialidad: string): familiaacademica | null {
  if (/desarrollo integral infantil|educaci[oó]n inicial/i.test(especialidad)) return 'INICIAL';
  if (/lengua|comunicaci[oó]n/i.test(especialidad)) return 'LENGUAJES';
  if (/matem[aá]tica/i.test(especialidad)) return 'MATEMATICA';
  if (/educaci[oó]n f[ií]sica/i.test(especialidad)) return 'EDUCACION_FISICA';
  if (/ciencias naturales|biolog[ií]a|f[ií]sica|qu[ií]mica/i.test(especialidad)) return 'CIENCIAS';
  if (/ciencias sociales|cosmovisiones|valores.*espiritualidad|espiritualidad.*religiones/i.test(especialidad)) return 'SOCIALES';
  if (/t[eé]cnica tecnol[oó]gica/i.test(especialidad)) return 'TECNOLOGIA';
  if (/artes pl[aá]sticas|educaci[oó]n musical/i.test(especialidad)) return 'ARTES';
  return null;
}

function familiamateria(materia: Materia): familiaacademica {
  const familia = familiaespecialidad(`${materia.name} ${materia.code}`);
  if (!familia) throw new Error(`No se definió una familia académica para ${materia.name}.`);
  return familia;
}

function puededictarmateria(familia: familiaacademica, familiasAsignadas: ReadonlySet<familiaacademica> | undefined): boolean {
  return familiasAsignadas?.has(familia) ?? false;
}

function distribuirfamilias(docentes: Docente[]): Map<string, familiaacademica> {
  const asignadas = new Map<string, familiaacademica>();
  const orden: familiaacademica[] = ['INICIAL', 'LENGUAJES', 'MATEMATICA', 'CIENCIAS', 'SOCIALES', 'TECNOLOGIA', 'ARTES', 'EDUCACION_FISICA'];
  const candidatos = new Map<familiaacademica, Docente[]>(orden.map((familia) => [
    familia,
    docentes.filter((docente) => familiaespecialidad(docente.specialty) === familia),
  ]));
  const usados = new Set<string>();
  for (const familia of orden) {
    for (const docente of candidatos.get(familia)!.slice(0, cuposporfamilia[familia])) {
      asignadas.set(docente.id, familia);
      usados.add(docente.id);
    }
  }
  const excedentes = docentes.filter((docente) => !usados.has(docente.id));
  const donantes = [
    ...excedentes.filter((docente) => familiaespecialidad(docente.specialty) === 'LENGUAJES'),
    ...excedentes.filter((docente) => familiaespecialidad(docente.specialty) === 'MATEMATICA'),
    ...excedentes.filter((docente) => familiaespecialidad(docente.specialty) === 'INICIAL'),
    ...excedentes.filter((docente) => familiaespecialidad(docente.specialty) === 'SOCIALES'),
  ];
  for (const familia of orden) {
    const actuales = [...asignadas.values()].filter((valor) => valor === familia).length;
    const faltan = cuposporfamilia[familia] - actuales;
    for (const docente of donantes.splice(0, faltan)) asignadas.set(docente.id, familia);
  }
  if (asignadas.size !== docentes.length || orden.some((familia) => [...asignadas.values()].filter((valor) => valor === familia).length !== cuposporfamilia[familia])) {
    throw new Error('La distribución de docentes por área no coincide con las cargas académicas previstas.');
  }
  return asignadas;
}

type FlujoArista = {
  hasta: number;
  reversa: number;
  capacidad: number;
  capacidadInicial: number;
  costo: number;
};

function agregararistaflujo(
  grafo: FlujoArista[][],
  desde: number,
  hasta: number,
  capacidad: number,
  costo = 0,
): FlujoArista {
  const directa: FlujoArista = {
    hasta,
    reversa: grafo[hasta].length,
    capacidad,
    capacidadInicial: capacidad,
    costo,
  };
  const inversa: FlujoArista = {
    hasta: desde,
    reversa: grafo[desde].length,
    capacidad: 0,
    capacidadInicial: 0,
    costo: -costo,
  };
  grafo[desde].push(directa);
  grafo[hasta].push(inversa);
  return directa;
}

function resolverflujominimocoste(
  grafo: FlujoArista[][],
  fuente: number,
  destino: number,
  requerido: number,
): number {
  let enviado = 0;
  while (enviado < requerido) {
    const distancias = Array<number>(grafo.length).fill(Number.POSITIVE_INFINITY);
    const nodos = Array<number>(grafo.length).fill(-1);
    const aristas = Array<number>(grafo.length).fill(-1);
    const enCola = Array<boolean>(grafo.length).fill(false);
    const cola: number[] = [fuente];
    distancias[fuente] = 0;
    enCola[fuente] = true;

    for (let indice = 0; indice < cola.length; indice += 1) {
      const nodo = cola[indice];
      enCola[nodo] = false;
      for (let indiceArista = 0; indiceArista < grafo[nodo].length; indiceArista += 1) {
        const arista = grafo[nodo][indiceArista];
        if (arista.capacidad <= 0 || distancias[arista.hasta] <= distancias[nodo] + arista.costo) continue;
        distancias[arista.hasta] = distancias[nodo] + arista.costo;
        nodos[arista.hasta] = nodo;
        aristas[arista.hasta] = indiceArista;
        if (!enCola[arista.hasta]) {
          cola.push(arista.hasta);
          enCola[arista.hasta] = true;
        }
      }
    }

    if (nodos[destino] === -1) break;
    let cantidad = requerido - enviado;
    for (let nodo = destino; nodo !== fuente; nodo = nodos[nodo]) {
      cantidad = Math.min(cantidad, grafo[nodos[nodo]][aristas[nodo]].capacidad);
    }
    for (let nodo = destino; nodo !== fuente; nodo = nodos[nodo]) {
      const anterior = nodos[nodo];
      const arista = grafo[anterior][aristas[nodo]];
      arista.capacidad -= cantidad;
      grafo[nodo][arista.reversa].capacidad += cantidad;
    }
    enviado += cantidad;
  }
  return enviado;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index++) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function periodosporasignatura(materias: Materia[], nivel: number): Map<string, number> {
  const disponibles = nivel <= 2 ? 25 : 30;
  if (nivel <= 2) return new Map(materias.map((materia) => [materia.id, disponibles]));

  const base = materias.map((materia) => {
    const codigo = materia.code.toUpperCase();
    let periodos = 2;
    if (/^(MAT|MAT-SEC|LC|LEN-SEC)$/.test(codigo)) periodos = nivel <= 8 ? 5 : 4;
    else if (/^(CNA|CSO|BIO-SEC|HIS-SEC)$/.test(codigo)) periodos = nivel <= 8 ? 3 : 2;
    else if (/^(LO|VER-SEC)$/.test(codigo)) periodos = 1;
    return { id: materia.id, code: codigo, periods: periodos };
  });

  const prioridad = (codigo: string) =>
    /^(MAT|MAT-SEC|LC|LEN-SEC)$/.test(codigo) ? 3 : /^(CNA|CSO)$/.test(codigo) ? 2 : 1;
  let suma = base.reduce((total, materia) => total + materia.periods, 0);
  while (suma > disponibles) {
    const reducible = base
      .filter((materia) => materia.periods > 1)
      .sort((a, b) => prioridad(a.code) - prioridad(b.code) || b.periods - a.periods || b.code.localeCompare(a.code))[0];
    if (!reducible) throw new Error(`No se pudo distribuir la carga semanal del nivel ${nivel}.`);
    reducible.periods -= 1;
    suma -= 1;
  }
  while (suma < disponibles) {
    const principal = base
      .filter((materia) => prioridad(materia.code) === 3)
      .sort((a, b) => a.periods - b.periods || a.code.localeCompare(b.code))[0]
      ?? base.sort((a, b) => a.periods - b.periods || a.code.localeCompare(b.code))[0];
    if (!principal) throw new Error(`El nivel ${nivel} no tiene materias asignadas.`);
    principal.periods += 1;
    suma += 1;
  }
  return new Map(base.map((materia) => [materia.id, materia.periods]));
}

async function main(): Promise<void> {
  assertLocalDemoDatabaseTarget();

  const year = await prisma.academicYear.findUnique({
    where: { year: 2026 },
    select: { id: true },
  });
  if (!year) throw new Error('No se encontró la gestión académica 2026.');
  const reconstruirhorarios = process.env.SIGCE_REBUILD_DEMO_SCHEDULES === 'true';

  const [courses, teachers, enrollments, existingSchedules, activeStudents, admin] = await Promise.all([
    prisma.course.findMany({
      where: { academicYearId: year.id },
      include: {
        teacherSubjects: { include: { subject: true, teacher: true } },
        _count: { select: { schedules: true } },
      },
      orderBy: [{ gradeLevel: 'asc' }, { section: 'asc' }],
    }),
    prisma.teacher.findMany({
      where: { deletedAt: null, user: { isActive: true, deletedAt: null } },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    }),
    prisma.enrollment.findMany({
      where: {
        academicYearId: year.id,
        status: 'ACTIVE',
        student: { isActive: true, deletedAt: null },
      },
      select: { studentId: true, courseId: true },
    }),
    prisma.classSchedule.findMany({
      where: { academicYearId: year.id },
      select: { teacherId: true, dayOfWeek: true, periodIndex: true, startTime: true },
    }),
    prisma.student.findMany({
      where: { isActive: true, deletedAt: null },
      select: {
        id: true,
        documentReferences: { where: { documentType: 'BIRTH_CERTIFICATE' }, select: { id: true }, take: 1 },
      },
    }),
    prisma.user.findFirst({
      where: { role: 'ADMINISTRATIVE', isActive: true, deletedAt: null },
      select: { id: true },
    }),
  ]);
  if (!teachers.length || !admin) throw new Error('Se necesita personal activo y una cuenta administrativa.');
  const familiasdocentes = distribuirfamilias(teachers);
  const habilitacionesdocentes = new Map<string, Set<familiaacademica>>(
    [...familiasdocentes].map(([docenteId, familia]) => [docenteId, new Set([familia])]),
  );
  const docenteArtesTecnologia = teachers.find((docente) => familiasdocentes.get(docente.id) === 'TECNOLOGIA');
  if (!docenteArtesTecnologia) throw new Error('No se encontró un docente de Técnica Tecnológica para cubrir el bloque artístico integrado.');
  habilitacionesdocentes.get(docenteArtesTecnologia.id)!.add('ARTES');
  const maxsesionesdocente = reconstruirhorarios ? 38 : 30;
  const asignacionesduplicadas: string[] = [];
  for (const course of courses) {
    const grupos = new Map<string, typeof course.teacherSubjects>();
    for (const row of course.teacherSubjects) {
      const grupo = grupos.get(row.subjectId) ?? [];
      grupo.push(row);
      grupos.set(row.subjectId, grupo);
    }
    const unicas: typeof course.teacherSubjects = [];
    for (const grupo of grupos.values()) {
      const familia = familiamateria(grupo[0].subject as Materia);
      const conservar = grupo.find((row) => familiasdocentes.get(row.teacherId) === familia) ?? grupo[0];
      unicas.push(conservar);
      asignacionesduplicadas.push(...grupo.filter((row) => row.id !== conservar.id).map((row) => row.id));
    }
    course.teacherSubjects = unicas;
  }

  const cargas = new Map<string, number>(teachers.map((docente) => [docente.id, 0]));
  const horariosprevios = reconstruirhorarios ? [] : existingSchedules;
  for (const bloque of horariosprevios) cargas.set(bloque.teacherId, (cargas.get(bloque.teacherId) ?? 0) + 1);

  const coursesToSchedule = reconstruirhorarios ? courses : courses.filter((course) => course._count.schedules === 0);
  const demandaPorFamilia = new Map<familiaacademica, number>();
  for (const course of coursesToSchedule) {
    const materias = [...new Map(course.teacherSubjects.map((row) => [row.subjectId, row.subject as Materia])).values()];
    const cuotas = periodosporasignatura(materias, course.gradeLevel);
    for (const materia of materias) {
      const familia = familiamateria(materia);
      demandaPorFamilia.set(familia, (demandaPorFamilia.get(familia) ?? 0) + (cuotas.get(materia.id) ?? 0));
    }
  }
  console.log(JSON.stringify({
    demandaSemanalPorArea: Object.fromEntries([...demandaPorFamilia].map(([familia, sesiones]) => [nombresfamilia[familia], sesiones])),
    capacidadPorArea: Object.fromEntries(Object.entries(cuposporfamilia).map(([familia, docentes]) => [nombresfamilia[familia as familiaacademica], (docentes + (familia === 'ARTES' ? 1 : 0)) * maxsesionesdocente])),
    coberturaCompartida: `${docenteArtesTecnologia.firstName} ${docenteArtesTecnologia.lastName}: Técnica Tecnológica y apoyo de Artes en secundaria`,
  }));
  const actualizaciones: Array<{
    id: string;
    teacherId: string;
    weeklyPeriods: number;
    courseId: string;
    subjectId: string;
    subject: Materia;
  }> = [];
  const nuevasasignaciones: Array<{
    teacherId: string;
    subjectId: string;
    courseId: string;
    academicYearId: string;
    weeklyPeriods: number;
  }> = [];
  const ocupados: bloqueocupadodocente[] = [...horariosprevios];
  const schedulesToCreate: Array<{
    courseId: string;
    subjectId: string;
    teacherId: string;
    academicYearId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    periodIndex: number;
    classroom: string;
  }> = [];

  for (const course of coursesToSchedule) {
    const porMateria = new Map<string, typeof course.teacherSubjects>();
    for (const row of course.teacherSubjects) {
      const grupo = porMateria.get(row.subjectId) ?? [];
      grupo.push(row);
      porMateria.set(row.subjectId, grupo);
    }
    if (!porMateria.size) throw new Error(`${course.name}: no tiene materias asignadas.`);
    if ([...porMateria.values()].some((grupo) => grupo.length !== 1)) {
      throw new Error(`${course.name}: hay materias con más de una asignación; se requiere revisar antes de generar el horario.`);
    }

    const materias = [...porMateria.values()].map((grupo) => grupo[0].subject as Materia);
    const cuotas = periodosporasignatura(materias, course.gradeLevel);
    const materiasCurso = [...porMateria.entries()].map(([subjectId, grupo]) => ({
      subjectId,
      subject: grupo[0].subject as Materia,
      existingAssignment: grupo[0],
      periods: cuotas.get(subjectId) ?? 0,
    }));
    const franjas = obtenerfranjasperiodosdiarios(course.gradeLevel, course.shift as turnoacademico);
    const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'] as const;
    const bloquesCurso = dias.flatMap((dayOfWeek) =>
      franjas.map((period, index) => ({
        dayOfWeek,
        periodIndex: index + 1,
        startTime: period.horainicio,
        endTime: period.horafin,
      })),
    );
    const requerido = materiasCurso.reduce((total, materia) => total + materia.periods, 0);
    if (requerido !== bloquesCurso.length) {
      throw new Error(`${course.name}: las materias suman ${requerido} sesiones y hay ${bloquesCurso.length} bloques semanales.`);
    }

    let nodo = 0;
    const fuente = nodo++;
    const nodoMateria = new Map(materiasCurso.map((materia) => [materia.subjectId, nodo++]));
    const nodoDocenteEntrada = new Map(teachers.map((teacher) => [teacher.id, nodo++]));
    const nodoDocenteSalida = new Map(teachers.map((teacher) => [teacher.id, nodo++]));
    const nodoDocenteBloque = new Map<string, number>();
    for (const teacher of teachers) {
      for (let index = 0; index < bloquesCurso.length; index += 1) {
        nodoDocenteBloque.set(`${teacher.id}:${index}`, nodo++);
      }
    }
    const nodoBloqueCurso = bloquesCurso.map(() => nodo++);
    const destino = nodo++;
    const grafo: FlujoArista[][] = Array.from({ length: nodo }, () => []);
    const aristasMateriaDocente = new Map<string, FlujoArista>();
    const aristasDocenteBloque = new Map<string, FlujoArista>();
    const aristasBloqueDocenteHorario = new Map<string, FlujoArista>();
    const bloquesOcupados = new Set(ocupados.map((block) => `${block.teacherId}:${block.dayOfWeek}:${block.startTime ?? block.periodIndex}`));

    for (const materia of materiasCurso) {
      agregararistaflujo(grafo, fuente, nodoMateria.get(materia.subjectId)!, materia.periods);
      const familia = familiamateria(materia.subject);
      for (const teacher of teachers) {
        if (!puededictarmateria(familia, habilitacionesdocentes.get(teacher.id))) continue;
        const disponibilidad = bloquesCurso.filter((block, index) =>
          !bloquesOcupados.has(`${teacher.id}:${block.dayOfWeek}:${block.startTime}`)
          && nodoDocenteBloque.has(`${teacher.id}:${index}`),
        ).length;
        const capacidadDocente = Math.min(disponibilidad, Math.max(0, maxsesionesdocente - (cargas.get(teacher.id) ?? 0)));
        if (!capacidadDocente) continue;
        const assignment = materia.existingAssignment;
        const cost = (cargas.get(teacher.id) ?? 0) * 100
          + (teacher.id === assignment.teacherId ? 0 : 1)
          + (hash(`${course.id}:${materia.subjectId}:${teacher.id}`) % 7);
        const edge = agregararistaflujo(
          grafo,
          nodoMateria.get(materia.subjectId)!,
          nodoDocenteEntrada.get(teacher.id)!,
          materia.periods,
          cost,
        );
        aristasMateriaDocente.set(`${materia.subjectId}:${teacher.id}`, edge);
      }
    }
    for (const teacher of teachers) {
      const teacherIn = nodoDocenteEntrada.get(teacher.id)!;
      const teacherOut = nodoDocenteSalida.get(teacher.id)!;
      const freeIndexes = bloquesCurso
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => !bloquesOcupados.has(`${teacher.id}:${block.dayOfWeek}:${block.startTime}`));
      const capacity = Math.min(freeIndexes.length, Math.max(0, maxsesionesdocente - (cargas.get(teacher.id) ?? 0)));
      agregararistaflujo(grafo, teacherIn, teacherOut, capacity);
      for (const { block, index } of freeIndexes) {
        const teacherSlot = nodoDocenteBloque.get(`${teacher.id}:${index}`)!;
        agregararistaflujo(grafo, teacherOut, teacherSlot, 1);
        const link = agregararistaflujo(grafo, teacherSlot, nodoBloqueCurso[index], 1);
        aristasBloqueDocenteHorario.set(`${teacher.id}:${index}`, link);
      }
    }
    for (const blockNode of nodoBloqueCurso) agregararistaflujo(grafo, blockNode, destino, 1);

    const sesionesEnviadas = resolverflujominimocoste(grafo, fuente, destino, requerido);
    if (sesionesEnviadas !== requerido) {
      console.log(JSON.stringify({ cursoSinTodosLosBloques: course.name, materiasConSesiones: materiasCurso.map((materia) => ({
        materia: materia.subject.name,
        familia: nombresfamilia[familiamateria(materia.subject)],
        requeridas: materia.periods,
        asignadas: teachers.reduce((total, teacher) => {
          const arista = aristasMateriaDocente.get(`${materia.subjectId}:${teacher.id}`);
          return total + (arista ? arista.capacidadInicial - arista.capacidad : 0);
        }, 0),
      })).filter((materia) => materia.asignadas < materia.requeridas) }));
      throw new Error(`${course.name}: solo fue posible ubicar ${sesionesEnviadas} de ${requerido} bloques semanales sin cruces.`);
    }

    const porMateriaYDocente = new Map<string, number>();
    for (const materia of materiasCurso) {
      for (const teacher of teachers) {
        const edge = aristasMateriaDocente.get(`${materia.subjectId}:${teacher.id}`);
        const assigned = edge ? edge.capacidadInicial - edge.capacidad : 0;
        if (assigned > 0) porMateriaYDocente.set(`${materia.subjectId}:${teacher.id}`, assigned);
      }
    }

    const bloquesPorDocente = new Map<string, number[]>();
    for (const teacher of teachers) {
      for (let index = 0; index < bloquesCurso.length; index += 1) {
        const edge = aristasBloqueDocenteHorario.get(`${teacher.id}:${index}`);
        if (edge && edge.capacidadInicial - edge.capacidad > 0) {
          const indexes = bloquesPorDocente.get(teacher.id) ?? [];
          indexes.push(index);
          bloquesPorDocente.set(teacher.id, indexes);
        }
      }
    }

    const asignacionesPorDocente = new Map<string, Array<{ subjectId: string; periods: number }>>();
    for (const materia of materiasCurso) {
      const asignacionesMateria = teachers
        .map((teacher) => ({ teacher, periods: porMateriaYDocente.get(`${materia.subjectId}:${teacher.id}`) ?? 0 }))
        .filter((entry) => entry.periods > 0)
        .sort((a, b) => b.periods - a.periods || (cargas.get(a.teacher.id) ?? 0) - (cargas.get(b.teacher.id) ?? 0));
      if (!asignacionesMateria.length) throw new Error(`${course.name}: ${materia.subject.name} quedó sin docente.`);
      const principal = asignacionesMateria[0];
      actualizaciones.push({
        id: materia.existingAssignment.id,
        teacherId: principal.teacher.id,
        weeklyPeriods: principal.periods,
        courseId: course.id,
        subjectId: materia.subjectId,
        subject: materia.subject,
      });
      for (const extra of asignacionesMateria.slice(1)) {
        nuevasasignaciones.push({
          teacherId: extra.teacher.id,
          subjectId: materia.subjectId,
          courseId: course.id,
          academicYearId: year.id,
          weeklyPeriods: extra.periods,
        });
      }
      for (const assignment of asignacionesMateria) {
        const teacherAssignments = asignacionesPorDocente.get(assignment.teacher.id) ?? [];
        teacherAssignments.push({ subjectId: materia.subjectId, periods: assignment.periods });
        asignacionesPorDocente.set(assignment.teacher.id, teacherAssignments);
      }
    }

    for (const teacher of teachers) {
      const indexes = bloquesPorDocente.get(teacher.id) ?? [];
      const assignments = asignacionesPorDocente.get(teacher.id) ?? [];
      let indexOffset = 0;
      for (const assignment of assignments) {
        for (let count = 0; count < assignment.periods; count += 1) {
          const blockIndex = indexes[indexOffset++];
          if (blockIndex === undefined) throw new Error(`${course.name}: no se pudo completar el horario de ${teacher.firstName}.`);
          const block = bloquesCurso[blockIndex];
          schedulesToCreate.push({
            courseId: course.id,
            subjectId: assignment.subjectId,
            teacherId: teacher.id,
            academicYearId: year.id,
            dayOfWeek: block.dayOfWeek,
            startTime: block.startTime,
            endTime: block.endTime,
            periodIndex: block.periodIndex,
            classroom: `Aula ${course.section}`,
          });
          ocupados.push({ teacherId: teacher.id, dayOfWeek: block.dayOfWeek, periodIndex: block.periodIndex, startTime: block.startTime });
        }
      }
      if (indexOffset !== indexes.length) throw new Error(`${course.name}: hay bloques sin materia asignada para ${teacher.firstName}.`);
    }
    for (const [teacherId, assignments] of asignacionesPorDocente) {
      const periods = assignments.reduce((total, assignment) => total + assignment.periods, 0);
      cargas.set(teacherId, (cargas.get(teacherId) ?? 0) + periods);
    }
  }

  const fechaInicio = new Date(Date.UTC(2026, 9, 19));
  const fechas: Date[] = [];
  for (let offset = 0; offset < 12; offset += 1) {
    const fecha = new Date(fechaInicio);
    fecha.setUTCDate(fecha.getUTCDate() + offset);
    if (fecha.getUTCDay() >= 1 && fecha.getUTCDay() <= 5) fechas.push(fecha);
  }
  const asistencias = enrollments.flatMap((enrollment) =>
    fechas.map((date) => {
      const mark = hash(`${enrollment.studentId}:${date.toISOString().slice(0, 10)}`) % 100;
      const status = mark < 4 ? 'ABSENT' : mark < 8 ? 'LATE' : 'PRESENT';
      return {
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        registeredById: admin.id,
        date,
        status,
      };
    }),
  );

  const pendingBirthCertificates = activeStudents
    .filter((student) => student.documentReferences.length === 0)
    .map((student) => ({
      studentId: student.id,
      documentType: 'BIRTH_CERTIFICATE',
      reference: `MUESTRA FICTICIA CN-2026-${student.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`,
      notes: 'Dato inventado para demostración local. No representa un certificado válido ni una copia digital adjunta.',
      createdById: admin.id,
    }));

  const docentesActualizados = teachers.map((docente) => {
    const familia = familiasdocentes.get(docente.id)!;
    const especialidad = familia === 'TECNOLOGIA' && habilitacionesdocentes.get(docente.id)?.has('ARTES')
      ? `${nombresfamilia.TECNOLOGIA} y apoyo de ${nombresfamilia.ARTES}`
      : nombresfamilia[familia];
    return {
      id: docente.id,
      specialty: `${/primaria/i.test(docente.specialty) ? 'Docente generalista de primaria · ' : ''}${especialidad}`,
    };
  });

  console.log(JSON.stringify({
    cursosPendientes: coursesToSchedule.length,
    distribucionDocentePorArea: Object.fromEntries(Object.entries(cuposporfamilia).map(([familia, cantidad]) => [nombresfamilia[familia as familiaacademica], cantidad + (familia === 'ARTES' ? 1 : 0)])),
    horariosPreviosAReemplazar: reconstruirhorarios ? existingSchedules.length : 0,
    asignacionesDuplicadasAConsolidar: asignacionesduplicadas.length,
    horariosPorCrear: schedulesToCreate.length,
    asignacionesDocentesActualizadas: actualizaciones.length,
    asignacionesDocentesAñadidas: nuevasasignaciones.length,
    docentesActualizados: docentesActualizados.length,
    asistenciasPorRegistrar: asistencias.length,
    referenciasFicticiasDeNacimiento: pendingBirthCertificates.length,
    fechasAsistencia: fechas.map((date) => date.toISOString().slice(0, 10)),
    cargaSemanalMaximaDocente: Math.max(...cargas.values()),
    limiteSemanalDocente: maxsesionesdocente,
  }));

  await prisma.$transaction(async (transaction) => {
    if (reconstruirhorarios) {
      await transaction.classSchedule.deleteMany({ where: { academicYearId: year.id } });
    }
    if (asignacionesduplicadas.length) {
      await transaction.teacherSubject.deleteMany({ where: { id: { in: asignacionesduplicadas } } });
    }
    for (const update of actualizaciones) {
      await transaction.teacherSubject.update({
        where: { id: update.id },
        data: { teacherId: update.teacherId, weeklyPeriods: update.weeklyPeriods },
      });
    }
    if (nuevasasignaciones.length) {
      await transaction.teacherSubject.createMany({ data: nuevasasignaciones, skipDuplicates: true });
    }
    for (const teacher of docentesActualizados) {
      await transaction.teacher.update({ where: { id: teacher.id }, data: { specialty: teacher.specialty } });
    }
    if (schedulesToCreate.length) {
      await transaction.classSchedule.createMany({ data: schedulesToCreate });
    }
    for (const update of actualizaciones) {
      await transaction.assignment.updateMany({
        where: { courseId: update.courseId, subjectId: update.subjectId },
        data: { teacherId: update.teacherId },
      });
    }
    if (asistencias.length) {
      await transaction.attendance.createMany({ data: asistencias, skipDuplicates: true });
    }
    if (pendingBirthCertificates.length) {
      await transaction.studentDocumentReference.createMany({ data: pendingBirthCertificates });
    }
  }, { timeout: 120_000 });

  const [totalSchedules, totalAttendance, totalDemoCertificates] = await Promise.all([
    prisma.classSchedule.count({ where: { academicYearId: year.id } }),
    prisma.attendance.count({ where: { course: { academicYearId: year.id } } }),
    prisma.studentDocumentReference.count({ where: { documentType: 'BIRTH_CERTIFICATE', reference: { startsWith: 'MUESTRA FICTICIA CN-2026-' } } }),
  ]);
  console.log(JSON.stringify({
    horariosGestion2026: totalSchedules,
    asistenciasGestion2026: totalAttendance,
    referenciasFicticiasNacimiento: totalDemoCertificates,
    nota: 'Las referencias son datos ficticios locales, no certificados reales ni archivos digitales adjuntos.',
  }));
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
