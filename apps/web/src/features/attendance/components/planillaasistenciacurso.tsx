import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCircle2, ChevronDown, Loader2, Sparkles, Users } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import type {
  asistenciaestado,
  asistenciacursoopcion,
  gestionasistencia,
} from '../application/gestionasistencia';

const etiquetas: Record<asistenciaestado, string> = {
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  LATE: 'Atrasado',
  JUSTIFIED: 'Justificado',
};

const MATERIAS_PREDETERMINADAS = [
  'Matemática',
  'Lenguaje y Comunicación',
  'Ciencias Naturales (Biología)',
  'Ciencias Sociales (Historia)',
  'Física',
  'Química',
  'Artes Plásticas y Visuales',
  'Educación Física y Deportes',
  'Educación Musical',
  'Valores, Espiritualidades y Religiones',
  'Lengua Extranjera (Inglés)',
  'Técnica Tecnológica y Computación',
];

function fechaactual(): string {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

export function Planillaasistenciacurso({
  management: gestion,
  courses: cursos,
  isTeacher = false,
}: {
  management: gestionasistencia;
  courses: asistenciacursoopcion[];
  isTeacher?: boolean;
}) {
  const clientedeconsultas = useQueryClient();
  const esDocente = isTeacher;

  const [cursoid, establecercursoid] = useState('');
  const [fecha, establecerfecha] = useState(fechaactual);
  const [materiaNombre, establecermateriaNombre] = useState('');
  const [materiaId, establecermateriaId] = useState<string | undefined>(undefined);
  const [estados, establecerestados] = useState<Record<string, asistenciaestado>>({});
  const [motivos, establecermotivos] = useState<Record<string, string>>({});
  const [mensajeExito, establecermensajeExito] = useState<{
    registrados: number;
    ausencias: number;
  } | null>(null);

  // Auto-select initial course if empty
  useEffect(() => {
    if (cursos.length > 0 && !cursoid) {
      establecercursoid(cursos[0].id);
    }
  }, [cursos, cursoid]);

  // Load students of selected course
  const estudiantesConsulta = useQuery({
    queryKey: ['attendance-sheet-students', cursoid],
    queryFn: () => gestion.listarestudiantes(cursoid),
    enabled: Boolean(cursoid),
  });
  const estudiantes = estudiantesConsulta.data ?? [];

  // Load existing attendances for course + date
  const asistenciasConsulta = useQuery({
    queryKey: ['attendance-sheet-existing', cursoid, fecha],
    queryFn: () => gestion.listarasistenciacursofecha(cursoid, fecha),
    enabled: Boolean(cursoid && fecha),
  });
  const existentes = useMemo(
    () => new Map((asistenciasConsulta.data ?? []).map((r) => [r.studentId, r])),
    [asistenciasConsulta.data],
  );

  // Load curriculum subjects (if teacher, API filters by teacher assignments)
  const materiasConsulta = useQuery({
    queryKey: ['attendance-subjects', cursoid],
    queryFn: () => gestion.listarmaterias(cursoid),
    enabled: Boolean(cursoid),
  });
  const materiasDisponibles = materiasConsulta.data ?? [];

  // Unified subjects list: for teacher only show assigned subjects; for admin fallback to defaults if none defined
  const listaMaterias = useMemo(() => {
    if (materiasDisponibles.length > 0) {
      return materiasDisponibles.map((m) => ({ id: m.id, name: m.name }));
    }
    if (esDocente) {
      return [];
    }
    return MATERIAS_PREDETERMINADAS.map((nombre, idx) => ({ id: `default-${idx}`, name: nombre }));
  }, [materiasDisponibles, esDocente]);

  // Synchronize selected subject when available subjects change
  useEffect(() => {
    if (listaMaterias.length > 0) {
      const actualValido = listaMaterias.find((m) => m.name === materiaNombre || m.id === materiaId);
      if (!actualValido) {
        establecermateriaNombre(listaMaterias[0].name);
        establecermateriaId(listaMaterias[0].id.startsWith('default-') ? undefined : listaMaterias[0].id);
      }
    } else {
      establecermateriaNombre('');
      establecermateriaId(undefined);
    }
  }, [listaMaterias, materiaNombre, materiaId]);

  // Bulk set all to Present
  const marcarTodosPresentes = () => {
    const nuevos: Record<string, asistenciaestado> = {};
    for (const est of estudiantes) {
      nuevos[est.id] = 'PRESENT';
    }
    establecerestados(nuevos);
  };

  // Bulk set all to Absent
  const marcarTodosAusentes = () => {
    const nuevos: Record<string, asistenciaestado> = {};
    for (const est of estudiantes) {
      nuevos[est.id] = 'ABSENT';
    }
    establecerestados(nuevos);
  };

  // Mutation to save class attendance
  const guardarClase = useMutation({
    mutationFn: async () => {
      if (!cursoid) throw new Error('Selecciona un curso.');
      if (!fecha) throw new Error('Selecciona una fecha.');
      if (!estudiantes.length) throw new Error('No hay estudiantes en el curso.');

      const attendances = estudiantes.map((est) => {
        const estado = estados[est.id] ?? existentes.get(est.id)?.status ?? 'PRESENT';
        return {
          studentId: est.id,
          status: estado,
          justification: motivos[est.id] || existentes.get(est.id)?.justification || undefined,
        };
      });

      const respuesta = (await gestion.registrarasistenciaclase({
        courseId: cursoid,
        subjectId: materiaId,
        subjectName: materiaNombre,
        date: fecha,
        attendances,
      })) as { data?: { totalRegistrados?: number; totalAusencias?: number } } | undefined;

      const ausencias = attendances.filter((a) => a.status === 'ABSENT').length;
      return {
        registrados: respuesta?.data?.totalRegistrados ?? attendances.length,
        ausencias: respuesta?.data?.totalAusencias ?? ausencias,
      };
    },
    onSuccess: (res) => {
      establecermensajeExito(res);
      void clientedeconsultas.invalidateQueries({ queryKey: ['attendance'] });
      void clientedeconsultas.invalidateQueries({
        queryKey: ['attendance-sheet-existing', cursoid, fecha],
      });
      void clientedeconsultas.invalidateQueries({ queryKey: ['justifications'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const limpiarseleccion = () => {
    establecerestados({});
    establecermotivos({});
    establecermensajeExito(null);
    guardarClase.reset();
  };

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs"
      aria-labelledby="titulo-planilla-asistencia"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 id="titulo-planilla-asistencia" className="font-bold text-slate-900 text-base">
            Control de Asistencia por Materia y Fecha
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Los alumnos ausentes generarán una notificación push/alerta inmediata al padre de
            familia solicitando comprobante (PDF o imagen).
          </p>
        </div>
        {cursoid && estudiantes.length > 0 && (
          <div className="flex items-center gap-2">
            <Boton
              type="button"
              variant="outline"
              size="sm"
              onClick={marcarTodosPresentes}
              className="text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-200 h-8"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Todos Presentes
            </Boton>
            <Boton
              type="button"
              variant="outline"
              size="sm"
              onClick={marcarTodosAusentes}
              className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200 h-8"
            >
              Todos Ausentes
            </Boton>
          </div>
        )}
      </div>

      {/* Selectors grid: Curso, Fecha, Materia */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
          Curso
          <select
            value={cursoid}
            disabled={guardarClase.isPending}
            onChange={(evento) => {
              limpiarseleccion();
              establecercursoid(evento.target.value);
            }}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Selecciona un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {cursoetiqueta(curso.name)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
          Materia / Asignatura
          <div className="relative">
            <select
              value={materiaNombre}
              disabled={guardarClase.isPending || listaMaterias.length === 0}
              onChange={(evento) => {
                const nombre = evento.target.value;
                establecermateriaNombre(nombre);
                const mat = listaMaterias.find((m) => m.name === nombre);
                establecermateriaId(mat && !mat.id.startsWith('default-') ? mat.id : undefined);
              }}
              className="h-9 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-8 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {listaMaterias.length === 0 ? (
                <option value="">
                  {esDocente ? 'No tienes materias asignadas en este curso' : 'Sin materias disponibles'}
                </option>
              ) : (
                listaMaterias.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </label>

        <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
          Fecha de la Clase
          <input
            type="date"
            value={fecha}
            disabled={guardarClase.isPending}
            onChange={(evento) => {
              limpiarseleccion();
              establecerfecha(evento.target.value);
            }}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </label>
      </div>

      {cursoid && fecha && (estudiantesConsulta.isLoading || asistenciasConsulta.isLoading) && (
        <div role="status" className="mt-4 flex items-center gap-2 text-xs text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> Cargando lista de alumnos y
          asistencias previas...
        </div>
      )}

      {cursoid && (estudiantesConsulta.isError || asistenciasConsulta.isError) && (
        <div role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-800">
          No se pudo cargar la nómina de estudiantes. Vuelva a intentarlo.
          <button
            type="button"
            onClick={() => {
              void estudiantesConsulta.refetch();
              void asistenciasConsulta.refetch();
            }}
            className="ml-2 font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {cursoid && fecha && estudiantesConsulta.isSuccess && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {estudiantes.length} estudiantes matriculados en este curso
            </span>
            <span className="text-slate-400">
              Materia activa: <strong className="text-slate-700">{materiaNombre}</strong>
            </span>
          </div>

          {estudiantes.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <Users className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              No hay estudiantes inscritos activos en este curso.
            </div>
          ) : (
            <div className="mt-3 max-h-96 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[34rem] text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5">Estudiante</th>
                    <th className="p-2.5 w-40">Estado de Asistencia</th>
                    <th className="p-2.5">Observación / Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estudiantes.map((estudiante, idx) => {
                    const existente = existentes.get(estudiante.id);
                    const estado = estados[estudiante.id] ?? existente?.status ?? 'PRESENT';
                    const nombre = `${estudiante.lastName} ${estudiante.firstName}`;

                    let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (estado === 'ABSENT')
                      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                    if (estado === 'LATE')
                      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                    if (estado === 'JUSTIFIED')
                      badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';

                    return (
                      <tr key={estudiante.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-2.5 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 font-medium text-slate-900">
                          {nombre}
                          {existente && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                              Guardado previo
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <select
                            aria-label={`Asistencia de ${nombre}`}
                            value={estado}
                            disabled={guardarClase.isPending}
                            onChange={(evento) =>
                              establecerestados((actuales) => ({
                                ...actuales,
                                [estudiante.id]: evento.target.value as asistenciaestado,
                              }))
                            }
                            className={`h-8 w-full rounded-md border text-xs font-semibold px-2 focus:outline-none focus:ring-1 focus:ring-slate-900 ${badgeColor}`}
                          >
                            {Object.entries(etiquetas).map(([valor, etiqueta]) => (
                              <option key={valor} value={valor}>
                                {etiqueta}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2.5">
                          <input
                            aria-label={`Motivo o nota de ${nombre}`}
                            value={motivos[estudiante.id] ?? existente?.justification ?? ''}
                            onChange={(evento) =>
                              establecermotivos((actuales) => ({
                                ...actuales,
                                [estudiante.id]: evento.target.value,
                              }))
                            }
                            disabled={guardarClase.isPending}
                            maxLength={500}
                            placeholder={
                              estado === 'ABSENT'
                                ? 'Falta (notifica al tutor)'
                                : estado === 'JUSTIFIED'
                                  ? 'Motivo justificado'
                                  : 'Opcional'
                            }
                            className="h-8 w-full rounded-md border border-slate-200 px-2 text-xs placeholder:text-slate-300 focus:outline-none focus:border-slate-400"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {guardarClase.isError && (
            <p role="alert" className="mt-3 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg">
              {guardarClase.error.message}
            </p>
          )}

          {mensajeExito && (
            <div
              role="status"
              className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-900"
            >
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Asistencia de la materia &quot;{materiaNombre}&quot; guardada exitosamente
              </div>
              <p className="mt-1 text-emerald-700">
                Se registraron <strong>{mensajeExito.registrados}</strong> alumnos en fecha {fecha}.
              </p>
              {mensajeExito.ausencias > 0 && (
                <div className="mt-2 flex items-start gap-1.5 p-2 bg-white/80 rounded border border-emerald-300 text-slate-800">
                  <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    🔔 <strong>Notificación automática enviada:</strong> Se enviaron alertas a los
                    padres de los <strong>{mensajeExito.ausencias}</strong> alumnos ausentes con
                    solicitud de justificativo y anexo (PDF o captura).
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {Object.values(estados).filter((s) => s === 'ABSENT').length} faltas marcadas
            </span>
            <Boton
              type="button"
              disabled={!estudiantes.length || !materiaNombre || guardarClase.isPending}
              onClick={() => guardarClase.mutate()}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 shadow-sm"
            >
              {guardarClase.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Guardar Asistencia de {materiaNombre}
            </Boton>
          </div>
        </>
      )}
    </section>
  );
}
