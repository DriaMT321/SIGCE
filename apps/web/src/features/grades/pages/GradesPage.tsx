import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Award, BookOpen, Loader2, Plus, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const gradeFormSchema = z.object({
  enrollmentId: z.string().uuid('Selecciona una matrícula'),
  studentId: z.string().uuid('Selecciona un estudiante'),
  subjectId: z.string().uuid('Selecciona una materia'),
  periodId: z.string().uuid('Selecciona un periodo'),
  value: z.coerce.number().min(0, 'Mínimo 0').max(100, 'Máximo 100'),
  remarks: z.string().optional(),
});
type GradeFormData = z.infer<typeof gradeFormSchema>;

function getLey070Scale(value: number): { label: string; variant: 'success' | 'info' | 'warning' | 'danger' } {
  if (value >= 85) return { label: 'Desarrollo Pleno', variant: 'success' };
  if (value >= 69) return { label: 'Desarrollo Óptimo', variant: 'info' };
  if (value >= 51) return { label: 'Desarrollo Aceptable', variant: 'warning' };
  return { label: 'En Desarrollo', variant: 'danger' };
}

export const GradesPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const canEdit = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(authService.getCurrentUser()?.role ?? '');
  const gradesQuery = useQuery({ queryKey: ['grades'], queryFn: () => academicApi.listGrades() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const enrollmentsQuery = useQuery({ queryKey: ['enrollments'], queryFn: () => academicApi.listEnrollments() });
  const subjectsQuery = useQuery({ queryKey: ['subjects'], queryFn: () => academicApi.listSubjects() });
  const periodsQuery = useQuery({ queryKey: ['periods'], queryFn: () => academicApi.listPeriods() });

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: { enrollmentId: '', studentId: '', subjectId: '', periodId: '', value: 0, remarks: '' },
  });

  const createMutation = useMutation({
    mutationFn: academicApi.createGrade,
    onSuccess: () => {
      form.reset();
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });

  const grades = gradesQuery.data?.data ?? [];
  const filteredGrades = grades.filter((g) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      g.student.firstName.toLowerCase().includes(term) ||
      g.student.lastName.toLowerCase().includes(term) ||
      g.subject.name.toLowerCase().includes(term) ||
      g.period.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <Award className="w-3.5 h-3.5 text-brand-700" />
              <span>Evaluación Cuantitativa</span>
            </span>
            <Badge variant="outline" className="font-mono">
              {grades.length} notas asentadas
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Centralizador de Calificaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Evaluación pedagógica bajo la escala normativa de 1 a 100 puntos (Ley 070).
          </p>
        </div>

        {canEdit && (
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
                <span>Registrar Calificación</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Ley 070 Scales Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 space-y-0.5">
          <p className="font-bold text-emerald-900">Desarrollo Pleno</p>
          <p className="text-[11px] text-emerald-700 font-mono">85 - 100 puntos</p>
        </div>
        <div className="p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 space-y-0.5">
          <p className="font-bold text-blue-900">Desarrollo Óptimo</p>
          <p className="text-[11px] text-blue-700 font-mono">69 - 84 puntos</p>
        </div>
        <div className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/50 space-y-0.5">
          <p className="font-bold text-amber-900">Desarrollo Aceptable</p>
          <p className="text-[11px] text-amber-700 font-mono">51 - 68 puntos</p>
        </div>
        <div className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/50 space-y-0.5">
          <p className="font-bold text-rose-900">En Desarrollo</p>
          <p className="text-[11px] text-rose-700 font-mono">1 - 50 puntos (Apoyo)</p>
        </div>
      </div>

      {/* Formulario de Asiento de Calificación */}
      {showForm && canEdit && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Asiento de Nota Trimestral
            </h2>
            <p className="text-xs text-slate-500">
              Ingrese la calificación evaluativa correspondiente al periodo curricular.
            </p>
          </div>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SelectField label="Matrícula de Curso" error={form.formState.errors.enrollmentId?.message} {...form.register('enrollmentId')}>
                <option value="">Seleccione matrícula</option>
                {(enrollmentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.student.firstName} {item.student.lastName} · {item.course.name}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                <option value="">Seleccione estudiante</option>
                {(studentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName} {item.lastName}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Asignatura / Campo" error={form.formState.errors.subjectId?.message} {...form.register('subjectId')}>
                <option value="">Seleccione materia</option>
                {(subjectsQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Periodo Escolar" error={form.formState.errors.periodId?.message} {...form.register('periodId')}>
                <option value="">Seleccione periodo</option>
                {(periodsQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectField>

              <Field label="Nota Numérica (0 a 100 pts)" error={form.formState.errors.value?.message}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  {...form.register('value')}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                />
              </Field>

              <Field label="Observación Pedagógica">
                <input
                  {...form.register('remarks')}
                  placeholder="Opcional"
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                />
              </Field>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar Calificación</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por estudiante, materia o periodo..."
          className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-900 focus:border-slate-400 focus:outline-none shadow-2xs"
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

      {/* Tabla de Calificaciones */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        {gradesQuery.isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
            <span className="text-xs font-medium">Cargando centralizador de notas...</span>
          </div>
        ) : gradesQuery.isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            No se pudieron obtener las calificaciones.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Materia / Campo</th>
                  <th className="px-3 py-3">Periodo</th>
                  <th className="px-3 py-3 text-center">Nota (1-100)</th>
                  <th className="px-3 py-3 text-center">Escala Ley 070</th>
                  <th className="py-3 pl-3 pr-5 text-right">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No hay calificaciones registradas</p>
                        <p className="text-xs text-slate-400">Comience asentando notas mediante el formulario superior.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((grade) => {
                    const scale = getLey070Scale(grade.value);
                    const isPassing = grade.value >= 51;

                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-5 pr-3">
                          <p className="font-semibold text-slate-900 leading-tight">
                            {grade.student.firstName} {grade.student.lastName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {grade.studentId.slice(0, 8)}
                          </span>
                        </td>

                        <td className="px-3 py-3.5">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                            {grade.subject.name}
                          </span>
                        </td>

                        <td className="px-3 py-3.5 font-medium text-slate-600">
                          {grade.period.name}
                        </td>

                        <td className="px-3 py-3.5 text-center font-mono">
                          <span className={`text-base font-extrabold ${isPassing ? 'text-slate-900' : 'text-rose-600'}`}>
                            {grade.value}
                          </span>
                        </td>

                        <td className="px-3 py-3.5 text-center">
                          <Badge variant={scale.variant} className="text-[10px]">
                            {scale.label}
                          </Badge>
                        </td>

                        <td className="py-3.5 pl-3 pr-5 text-right font-mono text-slate-400 text-[11px]">
                          {new Date(grade.updatedAt).toLocaleDateString('es-BO')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
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

const SelectField = ({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => (
  <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
    <span>{label}</span>
    <select
      {...props}
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
    >
      {children}
    </select>
    {error && <span className="text-[10px] font-normal text-red-600">{error}</span>}
  </label>
);
