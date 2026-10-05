import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BookOpen, Loader2, Plus, Search, Users, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
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
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cursos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalCount} cursos · {totalStudents} matriculados</p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cerrar' : 'Nuevo Curso'}
          </button>
        )}
      </div>

      {/* Form - Simplified */}
      {showForm && canManage && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Curso</h2>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Gestión" error={form.formState.errors.academicYearId?.message}>
                <select
                  {...form.register('academicYearId')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Seleccione...</option>
                  {yearsQuery.data?.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} ({y.year})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Nombre" error={form.formState.errors.name?.message}>
                <Input {...form.register('name')} placeholder="Ej. 1º de Secundaria" />
              </Field>

              <Field label="Grado (1-16)" error={form.formState.errors.gradeLevel?.message}>
                <Input type="number" {...form.register('gradeLevel')} className="font-mono" />
              </Field>

              <Field label="Sección" error={form.formState.errors.section?.message}>
                <Input {...form.register('section')} placeholder="A" className="font-mono uppercase" />
              </Field>

              <Field label="Turno" error={form.formState.errors.shift?.message}>
                <select
                  {...form.register('shift')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="MORNING">Mañana</option>
                  <option value="AFTERNOON">Tarde</option>
                  <option value="EVENING">Noche</option>
                </select>
              </Field>

              <Field label="Capacidad" error={form.formState.errors.maxCapacity?.message}>
                <Input type="number" {...form.register('maxCapacity')} className="font-mono" />
              </Field>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                disabled={createMutation.isPending}
                type="submit"
                className="h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters - Single row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {[
            { id: 'ALL', label: `Todos (${totalCount})` },
            { id: 'INICIAL', label: 'Inicial' },
            { id: 'PRIMARIA', label: 'Primaria' },
            { id: 'SECUNDARIA', label: 'Secundaria' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLevelFilter(tab.id as 'ALL' | 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA')}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                levelFilter === tab.id
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar curso..."
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
      </div>

      {/* Course Grid - Clean cards */}
      {coursesQuery.isLoading ? (
        <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando cursos...</span>
        </div>
      ) : coursesQuery.isError ? (
        <div className="p-12 text-center text-sm text-rose-600">
          No se pudieron cargar los cursos.
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-700">No hay cursos con estos filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const count = course.enrollmentCount ?? 0;
            const capacity = course.maxCapacity || 35;
            const percentage = Math.min(100, Math.round((count / capacity) * 100));
            const isFull = count >= capacity;

            const isInicial = course.gradeLevel <= 4;
            const isPrimaria = course.gradeLevel >= 5 && course.gradeLevel <= 10;
            const levelLabel = isInicial ? 'Inicial' : isPrimaria ? 'Primaria' : 'Secundaria';

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 mb-1.5">
                      {levelLabel} · Grado {course.gradeLevel}
                    </span>
                    <h2 className="font-semibold text-slate-900">{course.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.shift === 'MORNING' ? 'Mañana' : course.shift === 'AFTERNOON' ? 'Tarde' : 'Noche'}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm font-mono shrink-0">
                    {course.section}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Ocupación
                    </span>
                    <span className="font-mono font-medium text-slate-900">
                      {count} / {capacity}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFull ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100 text-slate-500">
                  <span>Paralelo {course.section}</span>
                  <span className={`font-medium ${isFull ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isFull ? 'Completo' : `${capacity - count} plazas`}
                  </span>
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
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}
