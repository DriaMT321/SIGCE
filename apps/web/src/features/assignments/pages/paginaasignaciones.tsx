import { useState, useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type { gestionasignacion, asignacionregistro } from '../application/gestionasignacion';
import { cursoetiqueta, turnoetiqueta } from '../../../lib/cursoetiqueta';
import { materiacorrespondealgrado } from '../../../lib/materiaspornivel';

const asignacionformularioesquema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  type: z.enum(['TAREA', 'EXAMEN', 'TRABAJO_PRACTICO', 'PROYECTO', 'CONTROL_LECTURA']),
  courseId: z.string().min(1, 'Selecciona un curso'),
  subjectId: z.string().min(1, 'Selecciona una materia'),
  dueDate: z.string().min(1, 'La fecha límite es obligatoria'),
  maxScore: z.coerce.number().min(1, 'Mínimo 1').max(100, 'Máximo 100'),
  description: z.string().optional(),
});

type asignacionformulariodatos = z.infer<typeof asignacionformularioesquema>;

const constantetipoconfiguracion = {
  TAREA: {
    label: 'Tarea',
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium',
  },
  EXAMEN: {
    label: 'Examen',
    badge: 'bg-brand-50 text-brand-800 border-brand-200/90 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-900 font-semibold',
  },
  TRABAJO_PRACTICO: {
    label: 'Trabajo Práctico',
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium',
  },
  PROYECTO: {
    label: 'Proyecto',
    badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-medium',
  },
  CONTROL_LECTURA: {
    label: 'Control de Lectura',
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium',
  },
} as const;

function formatorelativovencimiento(vencimientofechacadena: string) {
  const vencimiento = new Date(vencimientofechacadena);
  const ahora = new Date();
  const vencimientodia = new Date(
    vencimiento.getFullYear(),
    vencimiento.getMonth(),
    vencimiento.getDate(),
  ).getTime();
  const hoydia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
  const diferenciadias = Math.round((vencimientodia - hoydia) / (1000 * 60 * 60 * 24));

  const horacadena = vencimiento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diferenciadias === 0) return { text: `Hoy ${horacadena}`, urgent: true, overdue: false };
  if (diferenciadias === 1) return { text: `Mañana ${horacadena}`, urgent: true, overdue: false };
  if (diferenciadias > 1 && diferenciadias <= 3)
    return { text: `En ${diferenciadias} días`, urgent: true, overdue: false };
  if (diferenciadias > 3)
    return {
      text: `En ${diferenciadias} días`,
      urgent: false,
      overdue: false,
    };
  return { text: `Venció hace ${Math.abs(diferenciadias)} d`, urgent: false, overdue: true };
}

export const AsignacionesPagina = ({
  management: gestion,
  currentRole: actualrol,
}: {
  management: gestionasignacion;
  currentRole?: string;
}) => {
  const clientedeconsultas = useQueryClient();
  const rol = actualrol;

  const puedecrear = rol === 'TEACHER' || rol === 'ADMINISTRATIVE';

  const [buscar, establecerbuscar] = useState('');
  const [seleccionadotipo, establecerseleccionadotipo] = useState<string>('ALL');
  const [seleccionadoestado, establecerseleccionadoestado] = useState<string>('ALL');
  const [cursofiltro, establecercursofiltro] = useState('');
  const [paralelofiltro, establecerparalelofiltro] = useState('');
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [cursosseleccionados, establecercursosseleccionados] = useState<string[]>([]);
  const [materiasseleccionadas, establecermateriasseleccionadas] = useState<string[]>([]);
  const [expandidoid, establecerexpandidoid] = useState<string | null>(null);

  // Estados para Calificación individual de alumnos
  const [asignacionParaCalificar, setAsignacionParaCalificar] = useState<asignacionregistro | null>(null);
  const [calificacionesForm, setCalificacionesForm] = useState<Record<string, { score: string; feedback: string }>>({});
  const [mensajeExitoCalificacion, setMensajeExitoCalificacion] = useState<string | null>(null);

  const planillaConsulta = useQuery({
    queryKey: ['assignment-submissions', asignacionParaCalificar?.id],
    queryFn: () => (asignacionParaCalificar ? gestion.obtenerplanilla(asignacionParaCalificar.id) : null),
    enabled: Boolean(asignacionParaCalificar),
  });

  useEffect(() => {
    if (planillaConsulta.data?.students) {
      const initial: Record<string, { score: string; feedback: string }> = {};
      planillaConsulta.data.students.forEach((est) => {
        initial[est.id] = {
          score: est.score !== null && est.score !== undefined ? String(est.score) : '',
          feedback: est.feedback || '',
        };
      });
      setCalificacionesForm(initial);
    }
  }, [planillaConsulta.data]);

  const guardarCalificacionesMutacion = useMutation({
    mutationFn: async () => {
      if (!asignacionParaCalificar) return;
      const payload = Object.entries(calificacionesForm).map(([studentId, data]) => ({
        studentId,
        score: data.score.trim() !== '' ? Number(data.score) : null,
        feedback: data.feedback.trim() || null,
      }));
      await gestion.guardarcalificaciones(asignacionParaCalificar.id, payload);
    },
    onSuccess: () => {
      setMensajeExitoCalificacion('Calificaciones guardadas correctamente.');
      void clientedeconsultas.invalidateQueries({ queryKey: ['assignments'] });
      void clientedeconsultas.invalidateQueries({
        queryKey: ['assignment-submissions', asignacionParaCalificar?.id],
      });
      setTimeout(() => setMensajeExitoCalificacion(null), 3000);
    },
  });

  // Queries
  const asignacionesconsulta = useQuery({
    queryKey: ['assignments'],
    queryFn: () => gestion.listarasignaciones(),
  });

  const cursosconsulta = useQuery({
    queryKey: ['courses'],
    queryFn: () => gestion.listarcursos(),
    enabled: Boolean(rol),
  });

  const materiasconsulta = useQuery({
    queryKey: ['subjects'],
    queryFn: () => gestion.listarmaterias(),
    enabled: puedecrear,
  });

  // Form setup
  const predeterminadovencimientofecha = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const formulario = useForm<asignacionformulariodatos>({
    resolver: zodResolver(asignacionformularioesquema),
    defaultValues: {
      title: '',
      type: 'TAREA',
      courseId: '',
      subjectId: '',
      dueDate: predeterminadovencimientofecha(),
      maxScore: 35,
      description: '',
    },
  });
  const cursosmarcados = (cursosconsulta.data ?? []).filter((curso) =>
    cursosseleccionados.includes(curso.id),
  );
  const materiascompatibles = (materiasconsulta.data ?? []).filter((materia) =>
    cursosmarcados.length === 0 || cursosmarcados.every((curso) =>
      materiacorrespondealgrado(materia.code, curso.gradeLevel),
    ),
  );

  // Mutations
  const crearmutacion = useMutation({
    mutationFn: async (entrada: asignacionformulariodatos) => {
      if (materiasseleccionadas.some((id) => !materiascompatibles.some((materia) => materia.id === id))) {
        throw new Error('Una materia seleccionada no corresponde a todos los cursos elegidos.');
      }
      let publicadas = 0;
      for (const cursoid of cursosseleccionados) {
        for (const materiaid of materiasseleccionadas) {
          try {
            await gestion.crearasignacion({ ...entrada, courseId: cursoid, subjectId: materiaid });
            publicadas += 1;
          } catch (error) {
            void clientedeconsultas.invalidateQueries({ queryKey: ['assignments'] });
            throw new Error(`Se publicaron ${publicadas} actividades antes del error: ${error instanceof Error ? error.message : 'no se pudo continuar'}`);
          }
        }
      }
    },
    onSuccess: () => {
      establecercursosseleccionados([]);
      establecermateriasseleccionadas([]);
      formulario.reset({
        title: '',
        type: 'TAREA',
        courseId: '',
        subjectId: '',
        dueDate: predeterminadovencimientofecha(),
        maxScore: 35,
        description: '',
      });
      establecermostrarformulario(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const actualizarestadomutacion = useMutation({
    mutationFn: ({ id, status: estado }: { id: string; status: 'FINALIZADO' | 'PENDIENTE' }) =>
      gestion.actualizarestado(id, estado),
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const eliminarmutacion = useMutation({
    mutationFn: (id: string) => gestion.eliminarasignacion(id),
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const erroroperacion = [actualizarestadomutacion, eliminarmutacion].find(
    (mutacion) => mutacion.isError,
  )?.error;

  const asignaciones = asignacionesconsulta.data ?? [];
  const cursosparafiltro = cursosconsulta.data?.length
    ? cursosconsulta.data
    : asignaciones.flatMap((asignacion) => asignacion.course ? [asignacion.course] : []);
  const niveles = [...new Map(cursosparafiltro.map((curso) => [curso.gradeLevel, curso])).entries()]
    .sort(([nivelA], [nivelB]) => nivelA - nivelB);
  const paralelos = [...new Set(
    cursosparafiltro
      .filter((curso) => !cursofiltro || curso.gradeLevel === Number(cursofiltro))
      .map((curso) => curso.section),
  )].sort();

  // Filtered list: si el estudiante ya tiene nota, cuenta como Finalizada/Calificada
  const filtrado = asignaciones.filter((elemento) => {
    if (seleccionadotipo !== 'ALL' && elemento.type !== seleccionadotipo) return false;
    const tieneNota = elemento.submission?.score !== null && elemento.submission?.score !== undefined;
    const esFinalizada = elemento.status === 'FINALIZADO' || tieneNota;

    if (seleccionadoestado === 'PENDIENTE' && esFinalizada) return false;
    if (seleccionadoestado === 'FINALIZADO' && !esFinalizada) return false;
    if (cursofiltro && elemento.course?.gradeLevel !== Number(cursofiltro)) return false;
    if (paralelofiltro && elemento.course?.section !== paralelofiltro) return false;
    if (buscar.trim()) {
      const q = buscar.toLowerCase();
      const coincidenciatitulo = elemento.title.toLowerCase().includes(q);
      const coincidenciadescripcion = elemento.description?.toLowerCase().includes(q);
      const coincidenciamateria = elemento.subject?.name.toLowerCase().includes(q);
      const coincidenciacurso = elemento.course?.name.toLowerCase().includes(q);
      return (
        coincidenciatitulo || coincidenciadescripcion || coincidenciamateria || coincidenciacurso
      );
    }
    return true;
  });

  // Metrics: reflejan el estado del estudiante si tiene nota asignada
  const totalcantidad = asignaciones.length;
  const examencantidad = asignaciones.filter((a) => a.type === 'EXAMEN').length;
  const pendientecantidad = asignaciones.filter((a) => {
    const tieneNota = a.submission?.score !== null && a.submission?.score !== undefined;
    return a.status !== 'FINALIZADO' && !tieneNota;
  }).length;
  const completadocantidad = asignaciones.filter((a) => {
    const tieneNota = a.submission?.score !== null && a.submission?.score !== undefined;
    return a.status === 'FINALIZADO' || tieneNota;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tareas y Exámenes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {rol === 'PARENT'
              ? 'Consulta las tareas, evaluaciones y fechas de entrega de tus hijos a cargo.'
              : rol === 'TEACHER'
                ? 'Publica y gestiona tareas, exámenes y notas formativas de tus cursos.'
                : 'Seguimiento y control de tareas, exámenes y actividades académicas.'}
          </p>
        </div>

        {puedecrear && (
          <button
            type="button"
            onClick={() => establecermostrarformulario((anterior) => !anterior)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{mostrarformulario ? 'Cerrar' : 'Nueva Actividad'}</span>
          </button>
        )}
      </div>

      {/* Metrics Cards - Sober, uniform architecture */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Actividades</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{totalcantidad}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Exámenes</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{examencantidad}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pendientes</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{pendientecantidad}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Finalizadas</span>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{completadocantidad}</p>
        </div>
      </div>

      {/* Formulario de Creación */}
      {mostrarformulario && puedecrear && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Programar Actividad o Evaluación
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ingresa los datos para registrar la tarea o examen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => establecermostrarformulario(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={formulario.handleSubmit((datos) => crearmutacion.mutate(datos))}
            className="space-y-4"
          >
            {(cursosconsulta.isError || materiasconsulta.isError) && (
              <p role="alert" className="text-xs text-rose-700 dark:text-rose-400">
                No se pudieron cargar cursos o materias para la actividad.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Título */}
              <div className="lg:col-span-2">
                <Campo label="Título de la Actividad" error={formulario.formState.errors.title?.message}>
                  <Entrada
                    {...formulario.register('title')}
                    placeholder="Ej. Tarea #2: Ecuaciones / Examen Trimestral"
                    className="h-9 text-xs font-medium"
                  />
                </Campo>
              </div>

              {/* Tipo */}
              <Campo label="Tipo" error={formulario.formState.errors.type?.message}>
                <select
                  {...formulario.register('type')}
                  className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="TAREA">Tarea</option>
                  <option value="EXAMEN">Examen</option>
                  <option value="TRABAJO_PRACTICO">Trabajo Práctico</option>
                  <option value="PROYECTO">Proyecto</option>
                  <option value="CONTROL_LECTURA">Control de Lectura</option>
                </select>
              </Campo>

              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Cursos y paralelos</span>
                <input type="hidden" {...formulario.register('courseId')} />
                <div className="mt-1 max-h-32 space-y-1 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 p-2">
                  {(cursosconsulta.data ?? []).map((curso) => (
                    <label key={curso.id} className="flex items-center gap-2 rounded px-1 py-0.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input type="checkbox" checked={cursosseleccionados.includes(curso.id)} onChange={(evento) => {
                        const siguientes = evento.target.checked ? [...cursosseleccionados, curso.id] : cursosseleccionados.filter((id) => id !== curso.id);
                        const cursosnuevos = (cursosconsulta.data ?? []).filter((c) => siguientes.includes(c.id));
                        const materiasvalidas = materiasseleccionadas.filter((id) => {
                          const materia = (materiasconsulta.data ?? []).find((opcion) => opcion.id === id);
                          return materia && cursosnuevos.every((c) => materiacorrespondealgrado(materia.code, c.gradeLevel));
                        });
                        establecercursosseleccionados(siguientes);
                        establecermateriasseleccionadas(materiasvalidas);
                        formulario.setValue('courseId', siguientes[0] ?? '', { shouldValidate: true });
                        formulario.setValue('subjectId', materiasvalidas[0] ?? '', { shouldValidate: true });
                      }} />
                      {cursoetiqueta(curso.name)} ({turnoetiqueta(curso.shift)})
                    </label>
                  ))}
                </div>
                {formulario.formState.errors.courseId && <p className="mt-1 text-xs text-rose-600">Selecciona al menos un curso.</p>}
              </div>

              <div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Materias</span>
                <input type="hidden" {...formulario.register('subjectId')} />
                <div className="mt-1 max-h-32 space-y-1 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 p-2">
                  {cursosmarcados.length > 0 && materiascompatibles.length === 0 && (
                    <p className="px-1 py-1 text-xs text-amber-700 dark:text-amber-400">Los cursos seleccionados no comparten materias.</p>
                  )}
                  {materiascompatibles.map((materia) => (
                    <label key={materia.id} className="flex items-center gap-2 rounded px-1 py-0.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input type="checkbox" checked={materiasseleccionadas.includes(materia.id)} onChange={(evento) => {
                        const siguientes = evento.target.checked ? [...materiasseleccionadas, materia.id] : materiasseleccionadas.filter((id) => id !== materia.id);
                        establecermateriasseleccionadas(siguientes);
                        formulario.setValue('subjectId', siguientes[0] ?? '', { shouldValidate: true });
                      }} />
                      <span>{materia.name}</span>
                    </label>
                  ))}
                </div>
                {formulario.formState.errors.subjectId && <p className="mt-1 text-xs text-rose-600">Selecciona al menos una materia.</p>}
              </div>

              {/* Fecha Límite */}
              <Campo label="Fecha y Hora de Entrega" error={formulario.formState.errors.dueDate?.message}>
                <Entrada
                  type="datetime-local"
                  {...formulario.register('dueDate')}
                  className="h-9 text-xs"
                />
              </Campo>

              {/* Puntaje Máximo */}
              <Campo label="Puntaje Máximo (pts)" error={formulario.formState.errors.maxScore?.message}>
                <Entrada
                  type="number"
                  min="1"
                  max="100"
                  {...formulario.register('maxScore')}
                  className="h-9 text-xs font-mono font-medium"
                />
              </Campo>

              {/* Descripción */}
              <div className="sm:col-span-2 lg:col-span-3">
                <Campo label="Instrucciones / Descripción (opcional)">
                  <textarea
                    {...formulario.register('description')}
                    rows={2}
                    placeholder="Instrucciones claras para la entrega..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                  />
                </Campo>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Boton
                type="button"
                variant="outline"
                onClick={() => establecermostrarformulario(false)}
                className="h-8 text-xs px-3"
              >
                Cancelar
              </Boton>
              <Boton
                disabled={crearmutacion.isPending}
                type="submit"
                className="h-8 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium gap-1.5 px-4"
              >
                {crearmutacion.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Publicar
              </Boton>
            </div>

            {crearmutacion.isError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-900"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{crearmutacion.error.message}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Entrada
            value={buscar}
            onChange={(e) => establecerbuscar(e.target.value)}
            aria-label="Buscar actividades por título, materia o curso"
            placeholder="Buscar actividad, materia o curso..."
            className="pl-8 h-9 text-xs"
          />
          {buscar && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => establecerbuscar('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros compactos */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={cursofiltro}
            onChange={(e) => {
              establecercursofiltro(e.target.value);
              establecerparalelofiltro('');
            }}
            aria-label="Filtrar por curso"
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="">Todos los cursos</option>
            {niveles.map(([nivel, curso]) => (
              <option key={nivel} value={nivel}>
                {curso.name.replace(new RegExp(`(?:\\s+|-)${curso.section}$`, 'i'), '').trim()}
              </option>
            ))}
          </select>

          <select
            value={paralelofiltro}
            onChange={(e) => establecerparalelofiltro(e.target.value)}
            aria-label="Filtrar por paralelo"
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="">Todos los paralelos</option>
            {paralelos.map((paralelo) => <option key={paralelo} value={paralelo}>{paralelo}</option>)}
          </select>

          <select
            value={seleccionadotipo}
            onChange={(e) => establecerseleccionadotipo(e.target.value)}
            aria-label="Filtrar por tipo de tarea"
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="TAREA">Tareas</option>
            <option value="EXAMEN">Exámenes</option>
            <option value="TRABAJO_PRACTICO">Trabajos Prácticos</option>
            <option value="PROYECTO">Proyectos</option>
            <option value="CONTROL_LECTURA">Controles de Lectura</option>
          </select>

          <select
            value={seleccionadoestado}
            onChange={(e) => establecerseleccionadoestado(e.target.value)}
            aria-label="Filtrar por estado"
            className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="FINALIZADO">Finalizadas</option>
          </select>
        </div>
      </div>

      {/* Listado de Actividades */}
      {erroroperacion && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs text-rose-800 dark:text-rose-300"
        >
          {erroroperacion.message || 'No se pudo actualizar la actividad.'}
        </p>
      )}

      {asignacionesconsulta.isLoading ? (
        <div
          role="status"
          className="flex items-center justify-center p-12 text-slate-500 gap-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Cargando actividades académicas...</span>
        </div>
      ) : asignacionesconsulta.isError ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-800 dark:text-rose-300"
        >
          No se pudieron cargar las tareas y evaluaciones.
        </p>
      ) : filtrado.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">No se encontraron actividades</p>
          <p className="text-xs text-slate-400 mt-1">
            {buscar || seleccionadotipo !== 'ALL' || seleccionadoestado !== 'ALL'
              ? 'Prueba modificando los filtros aplicados.'
              : 'No hay actividades programadas.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtrado.map((elemento) => {
            const configuracion =
              constantetipoconfiguracion[elemento.type] ?? constantetipoconfiguracion.TAREA;
            const vencimientoinformacion = formatorelativovencimiento(elemento.dueDate);
            const esexpandido = expandidoid === elemento.id;
            const tieneNotaIndividual =
              elemento.submission?.score !== null && elemento.submission?.score !== undefined;
            const escompletado = elemento.status === 'FINALIZADO' || tieneNotaIndividual;

            return (
              <div
                key={elemento.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-colors shadow-2xs flex flex-col justify-between ${
                  escompletado ? 'opacity-80 bg-slate-50/50 dark:bg-slate-900/60' : ''
                }`}
              >
                <div>
                  {/* Top: Type badge & due date */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] border ${configuracion.badge}`}
                    >
                      {configuracion.label}
                    </span>

                    <span
                      className={`text-[11px] font-mono ${
                        vencimientoinformacion.overdue
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : vencimientoinformacion.urgent
                            ? 'text-amber-600 dark:text-amber-400 font-medium'
                            : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {vencimientoinformacion.text}
                    </span>
                  </div>

                  {/* Subject & Course */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {elemento.subject?.name ?? 'Materia'}
                    </span>
                    <span className="mx-1 text-slate-300 dark:text-slate-700">·</span>
                    <span>{elemento.course?.name ?? 'Curso'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2">
                    {elemento.title}
                  </h3>

                  {/* Student label (for parent) */}
                  {elemento.student && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Estudiante:{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {elemento.student.firstName} {elemento.student.lastName}
                      </span>
                    </p>
                  )}

                  {/* Individual Grade and Feedback */}
                  {elemento.submission && (
                    <div className="mt-2.5 mb-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          Calificación obtenida:
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
                          {elemento.submission.score !== null && elemento.submission.score !== undefined
                            ? `${elemento.submission.score} / ${elemento.maxScore ?? 100} pts`
                            : 'Sin calificar'}
                        </span>
                      </div>
                      {elemento.submission.feedback && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-0.5">
                            Observación docente:
                          </span>
                          <p className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            "{elemento.submission.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description / Instructions */}
                  {elemento.description && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 mb-2.5 border border-slate-100 dark:border-slate-800">
                      <p className={esexpandido ? '' : 'line-clamp-2'}>{elemento.description}</p>
                      {elemento.description.length > 90 && (
                        <button
                          type="button"
                          onClick={() => establecerexpandidoid(esexpandido ? null : elemento.id)}
                          className="mt-1 text-[11px] font-medium text-slate-800 dark:text-slate-200 underline"
                        >
                          {esexpandido ? 'Ver menos' : 'Leer instrucciones completas'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details & actions */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {elemento.maxScore ?? 100}
                    </span>
                    <span>pts</span>
                    {elemento.teacher && (
                      <span className="text-slate-400 dark:text-slate-500 ml-1">
                        · Prof. {elemento.teacher.lastName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botón calificar y marcar finalizada para profesores */}
                    {puedecrear && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setAsignacionParaCalificar(elemento);
                            setMensajeExitoCalificacion(null);
                          }}
                          title="Calificar individualmente a cada alumno"
                          className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          Calificar
                          {elemento.gradedCount !== undefined && elemento.gradedCount > 0 && (
                            <span className="ml-1 text-[10px] font-mono text-slate-400 dark:text-slate-400">
                              ({elemento.gradedCount})
                            </span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            actualizarestadomutacion.mutate({
                              id: elemento.id,
                              status: escompletado ? 'PENDIENTE' : 'FINALIZADO',
                            })
                          }
                          title={escompletado ? 'Reabrir actividad' : 'Marcar como finalizada'}
                          aria-label={`${escompletado ? 'Reabrir' : 'Finalizar'} actividad ${elemento.title}`}
                          className={`p-1.5 rounded-md transition-colors ${
                            escompletado
                              ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('¿Seguro que deseas eliminar esta tarea/examen?')) {
                              eliminarmutacion.mutate(elemento.id);
                            }
                          }}
                          title="Eliminar actividad"
                          aria-label={`Eliminar actividad ${elemento.title}`}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Status badge for students/parents */}
                    {!puedecrear && (
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          tieneNotaIndividual
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80'
                            : elemento.status === 'FINALIZADO'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {tieneNotaIndividual ? 'Finalizada' : (elemento.status === 'FINALIZADO' ? 'Concluida' : 'Pendiente')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Calificar Estudiantes */}
      {asignacionParaCalificar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Calificar: {asignacionParaCalificar.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {asignacionParaCalificar.course?.name} · {asignacionParaCalificar.subject?.name} · Puntaje máximo:{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{asignacionParaCalificar.maxScore ?? 100} pts</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAsignacionParaCalificar(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                title="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Table */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {mensajeExitoCalificacion && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{mensajeExitoCalificacion}</span>
                </div>
              )}

              {planillaConsulta.isLoading ? (
                <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Cargando nómina del curso...</span>
                </div>
              ) : planillaConsulta.isError ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs rounded-lg">
                  No se pudo cargar la lista de alumnos.
                </div>
              ) : (planillaConsulta.data?.students ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No hay estudiantes matriculados activos en este curso.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Estudiantes inscritos ({planillaConsulta.data?.students.length ?? 0}):</span>
                    <span>Puntaje numérico y comentario docente</span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
                    {planillaConsulta.data?.students.map((estudiante, idx) => {
                      const estData = calificacionesForm[estudiante.id] || { score: '', feedback: '' };
                      const tieneCalificacion = estData.score.trim() !== '';

                      return (
                        <div
                          key={estudiante.id}
                          className="p-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          {/* Student Info with Status Badge */}
                          <div className="min-w-0 md:w-1/3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-medium shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {estudiante.lastName}, {estudiante.firstName}
                                  </p>
                                  <span
                                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                                      tieneCalificacion
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                    }`}
                                  >
                                    {tieneCalificacion ? 'Finalizado' : 'Pendiente'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                  RUDE: {estudiante.rude || 'S/R'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Score Input */}
                          <div className="flex items-center gap-1.5 md:w-1/4">
                            <label htmlFor={`score-${estudiante.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400 shrink-0">
                              Nota:
                            </label>
                            <input
                              id={`score-${estudiante.id}`}
                              type="number"
                              min="0"
                              max={asignacionParaCalificar.maxScore ?? 100}
                              value={estData.score}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCalificacionesForm((prev) => ({
                                  ...prev,
                                  [estudiante.id]: {
                                    score: val,
                                    feedback: prev[estudiante.id]?.feedback || '',
                                  },
                                }));
                              }}
                              placeholder={`0 - ${asignacionParaCalificar.maxScore ?? 100}`}
                              className="w-20 h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-center text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                            />
                            <span className="text-xs text-slate-400 font-mono">pts</span>
                          </div>

                          {/* Feedback Input */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={estData.feedback}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCalificacionesForm((prev) => ({
                                  ...prev,
                                  [estudiante.id]: {
                                    score: prev[estudiante.id]?.score || '',
                                    feedback: val,
                                  },
                                }));
                              }}
                              placeholder="Observación opcional..."
                              className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Visible inmediatamente para el estudiante y sus tutores.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAsignacionParaCalificar(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  disabled={guardarCalificacionesMutacion.isPending}
                  onClick={() => guardarCalificacionesMutacion.mutate()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {guardarCalificacionesMutacion.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Guardar Notas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Campo({
  label: etiqueta,
  error,
  children: hijos,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
      <span className="flex items-center justify-between">
        <span>{etiqueta}</span>
        {error && <span className="text-rose-600 dark:text-rose-400 font-normal">{error}</span>}
      </span>
      {hijos}
    </label>
  );
}
