import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BookOpen, Loader2, Plus, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
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

function getLey070Scale(value: number): { label: string; badgeClass: string } {
  if (value >= 85) return { label: 'Desarrollo Pleno', badgeClass: 'bg-emerald-50 text-emerald-700' };
  if (value >= 69) return { label: 'Desarrollo Óptimo', badgeClass: 'bg-blue-50 text-blue-700' };
  if (value >= 51) return { label: 'Desarrollo Aceptable', badgeClass: 'bg-amber-50 text-amber-700' };
  return { label: 'En Desarrollo', badgeClass: 'bg-rose-50 text-rose-700' };
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
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Calificaciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">{grades.length} notas asentadas · Escala Ley 070</p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cerrar' : 'Asentar Nota'}
          </button>
        )}
      </div>

      {/* Ley 070 Scale - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Desarrollo Pleno', range: '85-100', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Desarrollo Óptimo', range: '69-84', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Desarrollo Aceptable', range: '51-68', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'En Desarrollo', range: '1-50', color: 'bg-rose-50 text-rose-700 border-rose-200' },
        ].map((item) => (
          <div key={item.label} className={`p-3 rounded-lg border ${item.color}`}>
            <span className="text-xs font-semibold">{item.label}</span>
            <p className="text-sm font-bold font-mono mt-0.5">{item.range} pts</p>
          </div>
        ))}
      </div>

      {/* Form - Simplified */}
      {showForm && canEdit && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Asentar Calificación</h2>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SelectField label="Matrícula" error={form.formState.errors.enrollmentId?.message} {...form.register('enrollmentId')}>
                <option value="">Seleccione...</option>
                {(enrollmentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.student.firstName} {item.student.lastName} · {item.course.name}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                <option value="">Seleccione...</option>
                {(studentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName} {item.lastName}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Asignatura" error={form.formState.errors.subjectId?.message} {...form.register('subjectId')}>
                <option value="">Seleccione...</option>
                {(subjectsQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </SelectField>

              <SelectField label="Periodo" error={form.formState.errors.periodId?.message} {...form.register('periodId')}>
                <option value="">Seleccione...</option>
                {(periodsQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </SelectField>

              <Field label="Nota (0-100)" error={form.formState.errors.value?.message}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  {...form.register('value')}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </Field>

              <Field label="Observación">
                <input
                  {...form.register('remarks')}
                  placeholder="Opcional"
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </Field>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search - Single row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por estudiante, materia o periodo..."
            className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
        <span className="text-sm text-slate-500">
          {filteredGrades.length} registros
        </span>
      </div>

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {gradesQuery.isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando calificaciones...</span>
          </div>
        ) : gradesQuery.isError ? (
          <div className="p-12 text-center text-sm text-rose-600">
            No se pudieron cargar las calificaciones.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Materia</th>
                  <th className="px-3 py-3">Periodo</th>
                  <th className="px-3 py-3 text-center">Nota</th>
                  <th className="px-3 py-3 text-center">Escala</th>
                  <th className="py-3 pl-3 pr-5 text-right">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-700">No hay calificaciones</p>
                        <p className="text-sm text-slate-400">Comience asentando notas.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((grade) => {
                    const scale = getLey070Scale(grade.value);
                    const isPassing = grade.value >= 51;

                    return (
                      <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-5 pr-3">
                          <p className="font-medium text-slate-900">
                            {grade.student.firstName} {grade.student.lastName}
                          </p>
                          <span className="text-xs text-slate-400 font-mono">
                            RUDE: {grade.student.rude ?? 'S/R'}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {grade.subject.name}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-slate-600 font-mono text-xs">
                          {grade.period.name}
                        </td>

                        <td className="px-3 py-3 text-center font-mono">
                          <span className={`text-base font-bold tabular-nums ${isPassing ? 'text-slate-900' : 'text-rose-600'}`}>
                            {grade.value}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${scale.badgeClass}`}>
                            {scale.label}
                          </span>
                        </td>

                        <td className="py-3 pl-3 pr-5 text-right font-mono text-slate-400 text-xs">
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
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}

const SelectField = ({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => (
  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
    <span>{label}</span>
    <select
      {...props}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      {children}
    </select>
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>
);
