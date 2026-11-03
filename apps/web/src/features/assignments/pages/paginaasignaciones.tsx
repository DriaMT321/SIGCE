import { useState, useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
  Award,
  Check,
  MessageSquare,
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
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
  },
  EXAMEN: {
    label: 'Examen / Evaluación',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    iconColor: 'text-rose-600',
  },
  TRABAJO_PRACTICO: {
    label: 'Trabajo Práctico',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
  },
  PROYECTO: {
    label: 'Proyecto',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  CONTROL_LECTURA: {
    label: 'Control de Lectura',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
  },
} as const;

function formatorelativovencimiento(vencimientofechacadena: string) {
  const vencimiento = new Date(vencimientofechacadena);
  const ahora = new Date();
  // normalize to midnight for day comparison
  const vencimientodia = new Date(
    vencimiento.getFullYear(),
    vencimiento.getMonth(),
    vencimiento.getDate(),
  ).getTime();
  const hoydia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
  const diferenciadias = Math.round((vencimientodia - hoydia) / (1000 * 60 * 60 * 24));

  const horacadena = vencimiento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diferenciadias === 0) return { text: `Hoy (${horacadena})`, urgent: true, overdue: false };
  if (diferenciadias === 1) return { text: `Mañana (${horacadena})`, urgent: true, overdue: false };
  if (diferenciadias > 1 && diferenciadias <= 3)
    return { text: `En ${diferenciadias} días`, urgent: true, overdue: false };
  if (diferenciadias > 3)
    return {
      text: `En ${diferenciadias} días (${vencimiento.toLocaleDateString()})`,
      urgent: false,
      overdue: false,
    };
  return { text: `Venció hace ${Math.abs(diferenciadias)} días`, urgent: false, overdue: true };
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
      setMensajeExitoCalificacion('¡Calificaciones y retroalimentación guardadas con éxito!');
      void clientedeconsultas.invalidateQueries({ queryKey: ['assignments'] });
      void clientedeconsultas.invalidateQueries({
        queryKey: ['assignment-submissions', asignacionParaCalificar?.id],
      });
      setTimeout(() => setMensajeExitoCalificacion(null), 3500);
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

  // Filtered list
  const filtrado = asignaciones.filter((elemento) => {
    if (seleccionadotipo !== 'ALL' && elemento.type !== seleccionadotipo) return false;
    if (seleccionadoestado !== 'ALL' && elemento.status !== seleccionadoestado) return false;
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

  // Metrics
  const totalcantidad = asignaciones.length;
  const examencantidad = asignaciones.filter((a) => a.type === 'EXAMEN').length;
  const pendientecantidad = asignaciones.filter((a) => a.status === 'PENDIENTE').length;
  const completadocantidad = asignaciones.filter((a) => a.status === 'FINALIZADO').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Tareas y Exámenes</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              Agenda Académica
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {rol === 'PARENT'
              ? 'Consulta las tareas, evaluaciones y fechas de entrega de tus hijos a cargo.'
              : rol === 'TEACHER'
                ? 'Publica y gestiona tareas, exámenes y proyectos para tus cursos asignados.'
                : 'Seguimiento y control de deberes, evaluaciones y actividades académicas.'}
          </p>
        </div>

        {puedecrear && (
          <button
            type="button"
            onClick={() => establecermostrarformulario((anterior) => !anterior)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mostrarformulario ? 'Cerrar' : 'Nueva Tarea / Examen'}
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Actividades</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalcantidad}</p>
        </div>
        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200/80 shadow-xs">
          <span className="text-xs font-semibold text-rose-700">Exámenes Programados</span>
          <p className="text-2xl font-bold text-rose-900 mt-1">{examencantidad}</p>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 shadow-xs">
          <span className="text-xs font-semibold text-blue-700">Entregas Pendientes</span>
          <p className="text-2xl font-bold text-blue-900 mt-1">{pendientecantidad}</p>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Finalizadas</span>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{completadocantidad}</p>
        </div>
      </div>

      {/* Formulario de Creación */}
      {mostrarformulario && puedecrear && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Programar Nueva Actividad o Evaluación
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingresa el nombre, tipo, materia, curso y fecha de entrega. Estudiantes y padres la
                verán inmediatamente.
              </p>
            </div>
            <button
              type="button"
              onClick={() => establecermostrarformulario(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={formulario.handleSubmit((datos) => crearmutacion.mutate(datos))}
            className="space-y-4"
          >
            {(cursosconsulta.isError || materiasconsulta.isError) && (
              <p role="alert" className="text-sm text-rose-700">
                No se pudieron cargar cursos o materias para la actividad.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Título */}
              <div className="lg:col-span-2">
                <Campo
                  label="Nombre / Título de la Tarea o Examen"
                  error={formulario.formState.errors.title?.message}
                >
                  <Entrada
                    {...formulario.register('title')}
                    placeholder="Ej. Examen Trimestral: Leyes de Newton / Tarea #2: Ejercicios de Geometría"
                    className="h-10 text-sm font-medium"
                  />
                </Campo>
              </div>

              {/* Tipo */}
              <Campo label="Tipo de Actividad" error={formulario.formState.errors.type?.message}>
                <select
                  {...formulario.register('type')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="TAREA">Tarea / Deber Escolar</option>
                  <option value="EXAMEN">Examen / Evaluación</option>
                  <option value="TRABAJO_PRACTICO">Trabajo Práctico</option>
                  <option value="PROYECTO">Proyecto de Aula</option>
                  <option value="CONTROL_LECTURA">Control de Lectura</option>
                </select>
              </Campo>

              <div>
                <span className="text-sm font-medium text-slate-700">Cursos y paralelos</span>
                <input type="hidden" {...formulario.register('courseId')} />
                <div className="mt-1 max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                  {(cursosconsulta.data ?? []).map((curso) => (
                    <label key={curso.id} className="flex items-center gap-2 rounded px-1 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      <input type="checkbox" checked={cursosseleccionados.includes(curso.id)} onChange={(evento) => {
                        const siguientes = evento.target.checked ? [...cursosseleccionados, curso.id] : cursosseleccionados.filter((id) => id !== curso.id);
                        const cursosnuevos = (cursosconsulta.data ?? []).filter((curso) => siguientes.includes(curso.id));
                        const materiasvalidas = materiasseleccionadas.filter((id) => {
                          const materia = (materiasconsulta.data ?? []).find((opcion) => opcion.id === id);
                          return materia && cursosnuevos.every((curso) => materiacorrespondealgrado(materia.code, curso.gradeLevel));
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
                {formulario.formState.errors.courseId && <p className="mt-1 text-xs text-rose-700">Selecciona al menos un curso.</p>}
              </div>

              <div>
                <span className="text-sm font-medium text-slate-700">Materias</span>
                <input type="hidden" {...formulario.register('subjectId')} />
                <div className="mt-1 max-h-36 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                  {cursosmarcados.length > 0 && materiascompatibles.length === 0 && (
                    <p className="px-1 py-2 text-xs text-amber-800">Los cursos seleccionados no comparten materias. Elige cursos del mismo nivel.</p>
                  )}
                  {materiascompatibles.map((materia) => (
                    <label key={materia.id} className="flex items-center gap-2 rounded px-1 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      <input type="checkbox" checked={materiasseleccionadas.includes(materia.id)} onChange={(evento) => {
                        const siguientes = evento.target.checked ? [...materiasseleccionadas, materia.id] : materiasseleccionadas.filter((id) => id !== materia.id);
                        establecermateriasseleccionadas(siguientes);
                        formulario.setValue('subjectId', siguientes[0] ?? '', { shouldValidate: true });
                      }} />
                      {materia.name}
                    </label>
                  ))}
                </div>
                {formulario.formState.errors.subjectId && <p className="mt-1 text-xs text-rose-700">Selecciona al menos una materia.</p>}
              </div>

              {/* Fecha Límite */}
              <Campo
                label="Fecha y Hora de Entrega o Examen"
                error={formulario.formState.errors.dueDate?.message}
              >
                <Entrada
                  type="datetime-local"
                  {...formulario.register('dueDate')}
                  className="h-10 text-sm font-mono"
                />
              </Campo>

              {/* Puntaje Máximo */}
              <Campo
                label="Ponderación / Puntaje (pts)"
                error={formulario.formState.errors.maxScore?.message}
              >
                <Entrada
                  type="number"
                  min={1}
                  max={100}
                  {...formulario.register('maxScore')}
                  placeholder="35 o 100"
                  className="h-10 text-sm font-mono"
                />
              </Campo>
            </div>

            {/* Instrucciones / Descripción */}
            <Campo
              label="Instrucciones, Temario o Indicaciones (Opcional)"
              error={formulario.formState.errors.description?.message}
            >
              <textarea
                {...formulario.register('description')}
                rows={3}
                placeholder="Indique los temas a evaluar, páginas de lectura, formato de entrega (hojas membretadas, bolígrafo) o criterios de calificación..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </Campo>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Boton
                type="button"
                variant="outline"
                onClick={() => establecermostrarformulario(false)}
                className="h-10 text-sm"
              >
                Cancelar
              </Boton>
              <Boton
                disabled={crearmutacion.isPending}
                type="submit"
                className="h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2 px-6"
              >
                {crearmutacion.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Publicar en {cursosseleccionados.length * materiasseleccionadas.length || 0} combinaciones
              </Boton>
            </div>

            {crearmutacion.isError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Entrada
            value={buscar}
            onChange={(e) => establecerbuscar(e.target.value)}
            aria-label="Buscar actividades por título, materia o curso"
            placeholder="Buscar por título, materia o curso..."
            className="pl-9 h-10 text-sm"
          />
          {buscar && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => establecerbuscar('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chips de filtro */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={cursofiltro}
            onChange={(e) => {
              establecercursofiltro(e.target.value);
              establecerparalelofiltro('');
            }}
            aria-label="Filtrar por curso"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700"
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
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700"
          >
            <option value="">Todos los paralelos</option>
            {paralelos.map((paralelo) => <option key={paralelo} value={paralelo}>{paralelo}</option>)}
          </select>

          <select
            value={seleccionadotipo}
            onChange={(e) => establecerseleccionadotipo(e.target.value)}
            aria-label="Filtrar por tipo de tarea"
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700"
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
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700"
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
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {erroroperacion.message || 'No se pudo actualizar la actividad.'}
        </p>
      )}
      {asignacionesconsulta.isLoading ? (
        <div
          role="status"
          className="flex items-center justify-center p-16 text-slate-500 gap-3 bg-white rounded-2xl border border-slate-200"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando actividades académicas...</span>
        </div>
      ) : asignacionesconsulta.isError ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          No se pudieron cargar las tareas y evaluaciones.
        </p>
      ) : filtrado.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-800">No se encontraron tareas ni exámenes</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {buscar || seleccionadotipo !== 'ALL' || seleccionadoestado !== 'ALL'
              ? 'Prueba modificando los filtros o el término de búsqueda.'
              : 'No hay actividades programadas en este momento.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtrado.map((elemento) => {
            const configuracion =
              constantetipoconfiguracion[elemento.type] ?? constantetipoconfiguracion.TAREA;
            const vencimientoinformacion = formatorelativovencimiento(elemento.dueDate);
            const esexpandido = expandidoid === elemento.id;
            const escompletado = elemento.status === 'FINALIZADO';

            return (
              <div
                key={elemento.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  elemento.type === 'EXAMEN'
                    ? 'border-rose-200/80 hover:border-rose-300'
                    : 'border-slate-200 hover:border-slate-300'
                } ${escompletado ? 'opacity-70 bg-slate-50/50' : ''}`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${configuracion.badge}`}
                    >
                      {configuracion.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vencimientoinformacion.overdue
                          ? 'bg-rose-100 text-rose-800 font-semibold'
                          : vencimientoinformacion.urgent
                            ? 'bg-amber-100 text-amber-800 font-semibold'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {vencimientoinformacion.text}
                    </span>
                  </div>

                  {/* Subject & Course */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    <span className="font-semibold text-slate-800">
                      {elemento.subject?.name ?? 'Materia'}
                    </span>
                    <span>·</span>
                    <span>{elemento.course?.name ?? 'Curso'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                    {elemento.title}
                  </h3>

                  {/* Student tag if parent viewing */}
                  {elemento.student && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium mb-3">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>
                        Para: {elemento.student.firstName} {elemento.student.lastName}
                      </span>
                    </div>
                  )}

                  {/* Calificación individual y retroalimentación (para estudiante y familia) */}
                  {elemento.submission && (
                    <div className="mt-2.5 mb-3 p-3 rounded-xl border bg-gradient-to-r from-amber-50/60 via-white to-brand-50/30 border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-brand-600" />
                          Nota del Estudiante:
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            elemento.submission.score !== null && elemento.submission.score !== undefined
                              ? elemento.submission.score >= 51
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {elemento.submission.score !== null && elemento.submission.score !== undefined
                            ? `${elemento.submission.score} / ${elemento.maxScore ?? 100} pts`
                            : 'Sin calificar'}
                        </span>
                      </div>
                      {elemento.submission.feedback && (
                        <div className="mt-2.5 pt-2 border-t border-amber-100 text-xs text-slate-700">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                            <span>Comentario del profesor:</span>
                          </div>
                          <p className="italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 text-slate-800 leading-relaxed">
                            "{elemento.submission.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description / Instructions */}
                  {elemento.description && (
                    <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                      <p className={esexpandido ? '' : 'line-clamp-2'}>{elemento.description}</p>
                      {elemento.description.length > 90 && (
                        <button
                          type="button"
                          onClick={() => establecerexpandidoid(esexpandido ? null : elemento.id)}
                          className="mt-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                        >
                          {esexpandido ? 'Ver menos' : 'Leer instrucciones completas'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details & actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">
                      {elemento.maxScore ?? 100}
                    </span>
                    <span>pts</span>
                    {elemento.teacher && (
                      <span className="text-slate-400 ml-1">
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
                          title="Calificar individualmente a cada alumno y dejar retroalimentación"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors border border-brand-200 shadow-2xs mr-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Calificar</span>
                          {elemento.gradedCount !== undefined && elemento.gradedCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-brand-200/80 text-[10px] text-brand-900 font-bold">
                              {elemento.gradedCount}
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
                          className={`p-1.5 rounded-lg transition-colors ${
                            escompletado
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Status badge for students/parents */}
                    {!puedecrear && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          escompletado
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {escompletado ? 'Concluida' : 'Pendiente'}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-100 text-brand-700 rounded-lg">
                    <Award className="w-4 h-4" />
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    Calificar: {asignacionParaCalificar.title}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {asignacionParaCalificar.course?.name} · {asignacionParaCalificar.subject?.name} · Ponderación máxima:{' '}
                  <strong className="text-slate-800">{asignacionParaCalificar.maxScore ?? 100} pts</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAsignacionParaCalificar(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Table */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {mensajeExitoCalificacion && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{mensajeExitoCalificacion}</span>
                </div>
              )}

              {planillaConsulta.isLoading ? (
                <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Cargando lista de alumnos del curso...</span>
                </div>
              ) : planillaConsulta.isError ? (
                <div className="p-6 bg-rose-50 text-rose-800 text-sm rounded-xl">
                  No se pudo cargar la lista de alumnos.
                </div>
              ) : (planillaConsulta.data?.students ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No hay estudiantes matriculados activos en este curso.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Estudiantes matriculados ({planillaConsulta.data?.students.length ?? 0}):</span>
                    <span>Introduce la nota numérica y un comentario u observación opcional</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    {planillaConsulta.data?.students.map((estudiante, idx) => {
                      const estData = calificacionesForm[estudiante.id] || { score: '', feedback: '' };
                      const tieneNota = estData.score.trim() !== '';

                      return (
                        <div
                          key={estudiante.id}
                          className="p-3.5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          {/* Student Info */}
                          <div className="min-w-0 md:w-1/3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {estudiante.lastName}, {estudiante.firstName}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  RUDE: {estudiante.rude || 'S/R'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Score Input */}
                          <div className="flex items-center gap-1.5 md:w-1/4">
                            <label htmlFor={`score-${estudiante.id}`} className="text-xs font-semibold text-slate-600 shrink-0">
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
                              className="w-20 h-9 rounded-lg border border-slate-200 px-2.5 text-center text-xs font-bold text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            />
                            <span className="text-xs text-slate-400 font-medium">pts</span>
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
                              placeholder="Observación o retroalimentación (opcional)..."
                              className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[11px] text-slate-500">
                Al guardar, la nota y la retroalimentación serán visibles inmediatamente para el estudiante y sus tutores.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAsignacionParaCalificar(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  disabled={guardarCalificacionesMutacion.isPending}
                  onClick={() => guardarCalificacionesMutacion.mutate()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 shadow-xs"
                >
                  {guardarCalificacionesMutacion.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Guardar Calificaciones</span>
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
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span className="flex items-center justify-between text-xs">
        <span>{etiqueta}</span>
        {error && <span className="text-rose-600 font-normal">{error}</span>}
      </span>
      {hijos}
    </label>
  );
}
