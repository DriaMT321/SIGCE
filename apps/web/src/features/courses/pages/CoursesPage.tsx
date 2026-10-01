import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BookOpen, Loader2, Plus, Search, Users, X, Sparkles, School } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const courseFormSchema = z.object({
  academicYearId: z.string().uuid('Selecciona una gestión'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  gradeLevel: z.coerce.number().int().min(1).max(20),
  section: z.string().min(1, 'La sección es obligatoria'),
  shift: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  maxCapacity: z.coerce.number().int().min(1).max(100),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

export const CoursesPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const canManage = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(authService.getCurrentUser()?.role ?? '');
  const coursesQuery = useQuery({
    queryKey: ['courses', search],
    queryFn: () => academicApi.listCourses(search),
  });
  const yearsQuery = useQuery({
    queryKey: ['academic-years'],
    queryFn: academicApi.listAcademicYears,
  });

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      academicYearId: '',
      name: '',
      gradeLevel: 1,
      section: 'A',
      shift: 'MORNING',
      maxCapacity: 35,
    },
  });

  const createMutation = useMutation({
    mutationFn: academicApi.createCourse,
    onSuccess: () => {
      form.reset();
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA'>('ALL');

  const courses = (coursesQuery.data?.data ?? []).filter((c) => {
    if (levelFilter === 'INICIAL') return c.gradeLevel <= 4;
    if (levelFilter === 'PRIMARIA') return c.gradeLevel >= 5 && c.gradeLevel <= 10;
    if (levelFilter === 'SECUNDARIA') return c.gradeLevel >= 11;
    return true;
  });
  const totalCount = (coursesQuery.data?.data ?? []).length;
  const totalStudents = (coursesQuery.data?.data ?? []).reduce((acc, curr) => acc + (curr.enrollmentCount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <BookOpen className="w-3.5 h-3.5 text-brand-700" />
                <span>Estructura Oficial Institucional</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {totalCount} Cursos Habilitados
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-amber-400">
                {totalStudents} Matriculados
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              16 Aulas y Cursos Institucionales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Organización académica oficial: 4 cursos de Educación Inicial (Pollito, Nidito, Pre Kinder, Kinder), 6 de Primaria y 6 de Secundaria Comunitaria Productiva.
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{showForm ? 'Cerrar Registro' : 'Nuevo Curso'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Creación de Curso con Doble Bisel */}
      {showForm && canManage && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  Alta de Curso y Paralelo Escolar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Asigne el grado, turno y capacidad máxima para el periodo lectivo vigente.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                Gestión 2026
              </Badge>
            </div>

            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Gestión Académica" error={form.formState.errors.academicYearId?.message}>
                  <select
                    {...form.register('academicYearId')}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 cursor-pointer"
                  >
                    <option value="">Seleccione una gestión...</option>
                    {yearsQuery.data?.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.name} ({y.year})
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Nombre del Curso" error={form.formState.errors.name?.message}>
                  <Input {...form.register('name')} placeholder="Ej. 1º de Secundaria" className="text-xs rounded-xl" />
                </Field>

                <Field label="Nivel Numérico (1 al 16)" error={form.formState.errors.gradeLevel?.message}>
                  <Input type="number" {...form.register('gradeLevel')} className="text-xs rounded-xl font-mono" />
                </Field>

                <Field label="Paralelo / Sección" error={form.formState.errors.section?.message}>
                  <Input {...form.register('section')} placeholder="A" className="text-xs rounded-xl font-mono uppercase" />
                </Field>

                <Field label="Turno" error={form.formState.errors.shift?.message}>
                  <select
                    {...form.register('shift')}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 cursor-pointer"
                  >
                    <option value="MORNING">Mañana</option>
                    <option value="AFTERNOON">Tarde</option>
                    <option value="EVENING">Noche</option>
                  </select>
                </Field>

                <Field label="Capacidad Máxima de Aula" error={form.formState.errors.maxCapacity?.message}>
                  <Input type="number" {...form.register('maxCapacity')} className="text-xs rounded-xl font-mono" />
                </Field>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="haptic-press h-10 px-5 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Registrar Curso Oficial</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barra de Filtros por Nivel y Búsqueda con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Level Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            {[
              { id: 'ALL', label: `Todos los Niveles (${totalCount})` },
              { id: 'INICIAL', label: 'Inicial (4)' },
              { id: 'PRIMARIA', label: 'Primaria (6)' },
              { id: 'SECUNDARIA', label: 'Secundaria (6)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLevelFilter(tab.id as any)}
                className={`haptic-press px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  levelFilter === tab.id
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar curso o grado..."
              className="pl-9 pr-9 h-10 text-xs bg-slate-50/60 border-slate-200/90 rounded-xl focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Cursos con Doble Bisel */}
      {coursesQuery.isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          <span className="text-xs font-medium font-mono text-slate-600">
            Cargando estructura institucional de cursos...
          </span>
        </div>
      ) : coursesQuery.isError ? (
        <div className="p-12 text-center text-xs text-rose-600">
          No se pudieron sincronizar los cursos escolares desde el servidor institucional.
        </div>
      ) : courses.length === 0 ? (
        <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-16 text-center text-slate-500 space-y-2 shadow-doppelrand-inner">
            <School className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800 text-sm">No hay cursos registrados con los filtros actuales</p>
            <p className="text-xs text-slate-400">Intente modificando el término de búsqueda o el nivel seleccionado.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const count = course.enrollmentCount ?? 0;
            const capacity = course.maxCapacity || 35;
            const percentage = Math.min(100, Math.round((count / capacity) * 100));
            const isFull = count >= capacity;

            // Determinación de color por nivel
            const isInicial = course.gradeLevel <= 4;
            const isPrimaria = course.gradeLevel >= 5 && course.gradeLevel <= 10;
            const levelLabel = isInicial ? 'Inicial' : isPrimaria ? 'Primaria' : 'Secundaria';
            const levelColor = isInicial ? 'text-sky-700 bg-sky-50 border-sky-200' : isPrimaria ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

            return (
              <div
                key={course.id}
                className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle hover:shadow-ambient hover:border-slate-300 transition-all group"
              >
                <article className="bg-white rounded-xl p-5 shadow-doppelrand-inner space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${levelColor}`}>
                            {levelLabel} · Grado {course.gradeLevel}
                          </span>
                        </div>
                        <h2 className="font-bold text-slate-900 text-base font-display group-hover:text-brand-900 transition-colors">
                          {course.name}
                        </h2>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {course.academicYear.name} · {course.shift === 'MORNING' ? 'Turno Mañana' : course.shift === 'AFTERNOON' ? 'Turno Tarde' : 'Turno Noche'}
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm font-mono shadow-xs shrink-0">
                        {course.section}
                      </div>
                    </div>

                    {/* Capacidad y Barra de Ocupación */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ocupación de Aula</span>
                        </span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {count} <span className="text-slate-400 font-normal">/ {capacity}</span> ({percentage}%)
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull
                              ? 'bg-rose-600'
                              : percentage > 85
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                    <span className="font-mono text-slate-600">Paralelo {course.section}</span>
                    <span
                      className={`font-semibold ${
                        isFull ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {isFull ? 'Cupo Completo' : `${capacity - count} plazas disponibles`}
                    </span>
                  </div>
                </article>
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
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-[10px] font-normal text-rose-600">{error}</span>}
    </label>
  );
}
