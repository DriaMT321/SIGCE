import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BookOpen, Loader2, Plus, Search, Users, X } from 'lucide-react';
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
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-brand-700" />
              <span>Estructura Oficial Institucional</span>
            </span>
            <Badge variant="outline" className="font-mono bg-white">
              {totalCount} cursos oficiales
            </Badge>
            <Badge className="bg-slate-900 text-amber-400 font-mono">
              {totalStudents} estudiantes matriculados
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            16 Cursos Institucionales
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Distribución oficial: 4 cursos de Inicial (Pollito, Nidito, Pre Kinder, Kinder), 6 de Primaria y 6 de Secundaria.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={() => setShowForm((prev) => !prev)}
            className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-1.5 shadow-xs"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Nuevo Curso</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Level Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Level Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          {[
            { id: 'ALL', label: `Todos (${totalCount})` },
            { id: 'INICIAL', label: '🌱 Inicial (4)' },
            { id: 'PRIMARIA', label: '📘 Primaria (6)' },
            { id: 'SECUNDARIA', label: '🎓 Secundaria (6)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLevelFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                levelFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative max-w-xs w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar curso o grado..."
            className="pl-9 h-9 text-xs bg-white rounded-xl"
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

      {/* Grid de Cursos */}
      {coursesQuery.isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
          <span className="text-xs font-medium">Cargando cursos habilitados...</span>
        </div>
      ) : coursesQuery.isError ? (
        <div className="p-12 text-center text-xs text-red-600">
          No se pudieron cargar los cursos escolares.
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-sm">No hay cursos registrados</p>
          <p className="text-xs text-slate-400">Comience agregando el primer curso o gestión.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const count = course.enrollmentCount ?? 0;
            const capacity = course.maxCapacity || 35;
            const percentage = Math.min(100, Math.round((count / capacity) * 100));
            const isFull = count >= capacity;

            return (
              <article
                key={course.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base font-display">
                      {course.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.academicYear.name} · {course.shift === 'MORNING' ? 'Turno Mañana' : course.shift === 'AFTERNOON' ? 'Turno Tarde' : 'Turno Noche'}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Nivel {course.gradeLevel}
                  </Badge>
                </div>

                {/* Capacidad y Barra de Ocupación */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Ocupación del aula:
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {count} / {capacity} <span className="text-slate-400 font-normal">({percentage}%)</span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <span>Paralelo: <strong className="text-slate-700 font-mono">{course.section}</strong></span>
                  <span className={isFull ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
                    {isFull ? 'Cupo completo' : `${capacity - count} cupos disponibles`}
                  </span>
                </div>
              </article>
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
      {error && <span className="text-[10px] font-normal text-red-600">{error}</span>}
    </label>
  );
}
