import { useState, type ReactNode } from 'react';
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
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const assignmentFormSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  type: z.enum(['TAREA', 'EXAMEN', 'TRABAJO_PRACTICO', 'PROYECTO', 'CONTROL_LECTURA']),
  courseId: z.string().min(1, 'Selecciona un curso'),
  subjectId: z.string().min(1, 'Selecciona una materia'),
  dueDate: z.string().min(1, 'La fecha límite es obligatoria'),
  maxScore: z.coerce.number().min(1, 'Mínimo 1').max(100, 'Máximo 100'),
  description: z.string().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentFormSchema>;

const TYPE_CONFIG = {
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

function formatRelativeDue(dueDateString: string) {
  const due = new Date(dueDateString);
  const now = new Date();
  // normalize to midnight for day comparison
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.round((dueDay - todayDay) / (1000 * 60 * 60 * 24));

  const timeStr = due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return { text: `Hoy (${timeStr})`, urgent: true, overdue: false };
  if (diffDays === 1) return { text: `Mañana (${timeStr})`, urgent: true, overdue: false };
  if (diffDays > 1 && diffDays <= 3) return { text: `En ${diffDays} días`, urgent: true, overdue: false };
  if (diffDays > 3) return { text: `En ${diffDays} días (${due.toLocaleDateString()})`, urgent: false, overdue: false };
  return { text: `Venció hace ${Math.abs(diffDays)} días`, urgent: false, overdue: true };
}

export const AssignmentsPage = () => {
  const queryClient = useQueryClient();
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role;

  const canCreate = role === 'TEACHER' || role === 'ADMIN' || role === 'DIRECTOR';

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Queries
  const assignmentsQuery = useQuery({
    queryKey: ['assignments'],
    queryFn: () => academicApi.listAssignments(),
  });

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicApi.listCourses(),
    enabled: canCreate,
  });

  const subjectsQuery = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicApi.listSubjects(),
    enabled: canCreate,
  });

  // Form setup
  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: '',
      type: 'TAREA',
      courseId: '',
      subjectId: '',
      dueDate: defaultDueDate(),
      maxScore: 35,
      description: '',
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: academicApi.createAssignment,
    onSuccess: () => {
      form.reset({
        title: '',
        type: 'TAREA',
        courseId: '',
        subjectId: '',
        dueDate: defaultDueDate(),
        maxScore: 35,
        description: '',
      });
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'FINALIZADO' | 'PENDIENTE' }) =>
      academicApi.updateAssignment(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicApi.deleteAssignment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const assignments = assignmentsQuery.data?.data ?? [];

  // Filtered list
  const filtered = assignments.filter((item) => {
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchSubject = item.subject?.name.toLowerCase().includes(q);
      const matchCourse = item.course?.name.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSubject || matchCourse;
    }
    return true;
  });

  // Metrics
  const totalCount = assignments.length;
  const examCount = assignments.filter((a) => a.type === 'EXAMEN').length;
  const pendingCount = assignments.filter((a) => a.status === 'PENDIENTE').length;
  const completedCount = assignments.filter((a) => a.status === 'FINALIZADO').length;

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
            {role === 'PARENT'
              ? 'Consulta las tareas, evaluaciones y fechas de entrega de tus hijos a cargo.'
              : role === 'TEACHER'
              ? 'Publica y gestiona tareas, exámenes y proyectos para tus cursos asignados.'
              : 'Seguimiento y control de deberes, evaluaciones y actividades académicas.'}
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cerrar' : 'Nueva Tarea / Examen'}
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Actividades</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200/80 shadow-xs">
          <span className="text-xs font-semibold text-rose-700">Exámenes Programados</span>
          <p className="text-2xl font-bold text-rose-900 mt-1">{examCount}</p>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 shadow-xs">
          <span className="text-xs font-semibold text-blue-700">Entregas Pendientes</span>
          <p className="text-2xl font-bold text-blue-900 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Finalizadas</span>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Formulario de Creación */}
      {showForm && canCreate && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Programar Nueva Actividad o Evaluación</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingresa el nombre, tipo, materia, curso y fecha de entrega. Estudiantes y padres la verán inmediatamente.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={form.handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Título */}
              <div className="lg:col-span-2">
                <Field label="Nombre / Título de la Tarea o Examen" error={form.formState.errors.title?.message}>
                  <Input
                    {...form.register('title')}
                    placeholder="Ej. Examen Trimestral: Leyes de Newton / Tarea #2: Ejercicios de Geometría"
                    className="h-10 text-sm font-medium"
                  />
                </Field>
              </div>

              {/* Tipo */}
              <Field label="Tipo de Actividad" error={form.formState.errors.type?.message}>
                <select
                  {...form.register('type')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="TAREA">Tarea / Deber Escolar</option>
                  <option value="EXAMEN">Examen / Evaluación</option>
                  <option value="TRABAJO_PRACTICO">Trabajo Práctico</option>
                  <option value="PROYECTO">Proyecto de Aula</option>
                  <option value="CONTROL_LECTURA">Control de Lectura</option>
                </select>
              </Field>

              {/* Curso */}
              <Field label="Curso / Paralelo" error={form.formState.errors.courseId?.message}>
                <select
                  {...form.register('courseId')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">-- Seleccionar Curso --</option>
                  {(coursesQuery.data?.data ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.shift})
                    </option>
                  ))}
                </select>
              </Field>

              {/* Materia */}
              <Field label="Materia / Área" error={form.formState.errors.subjectId?.message}>
                <select
                  {...form.register('subjectId')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">-- Seleccionar Materia --</option>
                  {(subjectsQuery.data ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </Field>

              {/* Fecha Límite */}
              <Field label="Fecha y Hora de Entrega o Examen" error={form.formState.errors.dueDate?.message}>
                <Input
                  type="datetime-local"
                  {...form.register('dueDate')}
                  className="h-10 text-sm font-mono"
                />
              </Field>

              {/* Puntaje Máximo */}
              <Field label="Ponderación / Puntaje (pts)" error={form.formState.errors.maxScore?.message}>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  {...form.register('maxScore')}
                  placeholder="35 o 100"
                  className="h-10 text-sm font-mono"
                />
              </Field>
            </div>

            {/* Instrucciones / Descripción */}
            <Field label="Instrucciones, Temario o Indicaciones (Opcional)" error={form.formState.errors.description?.message}>
              <textarea
                {...form.register('description')}
                rows={3}
                placeholder="Indique los temas a evaluar, páginas de lectura, formato de entrega (hojas membretadas, bolígrafo) o criterios de calificación..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </Field>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="h-10 text-sm"
              >
                Cancelar
              </Button>
              <Button
                disabled={createMutation.isPending}
                type="submit"
                className="h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2 px-6"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Publicar Tarea / Examen
              </Button>
            </div>

            {createMutation.isError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No se pudo guardar la actividad. Verifique los datos ingresados.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, materia o curso..."
            className="pl-9 h-10 text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chips de filtro */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-700"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="FINALIZADO">Finalizadas</option>
          </select>
        </div>
      </div>

      {/* Listado de Actividades */}
      {assignmentsQuery.isLoading ? (
        <div className="flex items-center justify-center p-16 text-slate-500 gap-3 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando actividades académicas...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-800">No se encontraron tareas ni exámenes</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {search || selectedType !== 'ALL' || selectedStatus !== 'ALL'
              ? 'Prueba modificando los filtros o el término de búsqueda.'
              : 'No hay actividades programadas en este momento.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.TAREA;
            const dueInfo = formatRelativeDue(item.dueDate);
            const isExpanded = expandedId === item.id;
            const isCompleted = item.status === 'FINALIZADO';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  item.type === 'EXAMEN'
                    ? 'border-rose-200/80 hover:border-rose-300'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isCompleted ? 'opacity-70 bg-slate-50/50' : ''}`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.badge}`}
                    >
                      {cfg.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dueInfo.overdue
                          ? 'bg-rose-100 text-rose-800 font-semibold'
                          : dueInfo.urgent
                          ? 'bg-amber-100 text-amber-800 font-semibold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {dueInfo.text}
                    </span>
                  </div>

                  {/* Subject & Course */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    <span className="font-semibold text-slate-800">
                      {item.subject?.name ?? 'Materia'}
                    </span>
                    <span>·</span>
                    <span>{item.course?.name ?? 'Curso'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                    {item.title}
                  </h3>

                  {/* Student tag if parent viewing */}
                  {item.student && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium mb-3">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Para: {item.student.firstName} {item.student.lastName}</span>
                    </div>
                  )}

                  {/* Description / Instructions */}
                  {item.description && (
                    <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                      <p className={isExpanded ? '' : 'line-clamp-2'}>{item.description}</p>
                      {item.description.length > 90 && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="mt-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                        >
                          {isExpanded ? 'Ver menos' : 'Leer instrucciones completas'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer details & actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">{item.maxScore ?? 100}</span>
                    <span>pts</span>
                    {item.teacher && (
                      <span className="text-slate-400 ml-1">
                        · Prof. {item.teacher.lastName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botón marcar finalizada para profesores */}
                    {canCreate && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: item.id,
                              status: isCompleted ? 'PENDIENTE' : 'FINALIZADO',
                            })
                          }
                          title={isCompleted ? 'Reabrir actividad' : 'Marcar como finalizada'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCompleted
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
                              deleteMutation.mutate(item.id);
                            }
                          }}
                          title="Eliminar actividad"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Status badge for students/parents */}
                    {!canCreate && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isCompleted ? 'Concluida' : 'Pendiente'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span className="flex items-center justify-between text-xs">
        <span>{label}</span>
        {error && <span className="text-rose-600 font-normal">{error}</span>}
      </span>
      {children}
    </label>
  );
}
