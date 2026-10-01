import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Award, BookOpen, Loader2, Plus, Search, X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
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

function getLey070Scale(value: number): { label: string; badgeClass: string } {
  if (value >= 85) return { label: 'Desarrollo Pleno (DP)', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  if (value >= 69) return { label: 'Desarrollo Óptimo (DO)', badgeClass: 'bg-blue-50 text-blue-800 border-blue-200' };
  if (value >= 51) return { label: 'Desarrollo Aceptable (DA)', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' };
  return { label: 'En Desarrollo (ED)', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' };
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
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <Award className="w-3.5 h-3.5 text-brand-700" />
                <span>Evaluación Cuantitativa</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {grades.length} Notas Asentadas
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Escala Normativa Ley 070 (1 a 100 Pts)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Centralizador Oficial de Calificaciones
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Registro y ponderación pedagógica por áreas curriculares y periodos trimestrales conforme a las disposiciones del Ministerio de Educación.
            </p>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{showForm ? 'Cerrar Registro' : 'Asentar Calificación'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Escala Cualitativa Ley 070 con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-lg border border-emerald-200/80 bg-emerald-50/40 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Desarrollo Pleno (DP)</span>
            <p className="text-sm font-black font-mono text-emerald-950 tabular-nums">85 - 100 pts</p>
            <p className="text-[10px] text-emerald-700">Competencias sobresalientes</p>
          </div>
          <div className="p-3 rounded-lg border border-blue-200/80 bg-blue-50/40 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Desarrollo Óptimo (DO)</span>
            <p className="text-sm font-black font-mono text-blue-950 tabular-nums">69 - 84 pts</p>
            <p className="text-[10px] text-blue-700">Objetivos alcanzados con solidez</p>
          </div>
          <div className="p-3 rounded-lg border border-amber-200/80 bg-amber-50/40 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Desarrollo Aceptable (DA)</span>
            <p className="text-sm font-black font-mono text-amber-950 tabular-nums">51 - 68 pts</p>
            <p className="text-[10px] text-amber-700">Nivel de aprobación reglamentario</p>
          </div>
          <div className="p-3 rounded-lg border border-rose-200/80 bg-rose-50/40 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">En Desarrollo (ED)</span>
            <p className="text-sm font-black font-mono text-rose-950 tabular-nums">1 - 50 pts</p>
            <p className="text-[10px] text-rose-700">Requiere refuerzo pedagógico</p>
          </div>
        </div>
      </div>

      {/* Formulario de Asiento de Calificación con Doble Bisel */}
      {showForm && canEdit && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  Asiento de Calificación Trimestral
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingrese el valor cuantitativo (1-100 pts) correspondiente al estudiante y área evaluada.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                Gestión 2026
              </Badge>
            </div>

            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField label="Matrícula de Curso" error={form.formState.errors.enrollmentId?.message} {...form.register('enrollmentId')}>
                  <option value="">Seleccione matrícula...</option>
                  {(enrollmentsQuery.data?.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.student.firstName} {item.student.lastName} · {item.course.name}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                  <option value="">Seleccione estudiante...</option>
                  {(studentsQuery.data?.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.firstName} {item.lastName} (RUDE: {item.rude})
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Asignatura / Área" error={form.formState.errors.subjectId?.message} {...form.register('subjectId')}>
                  <option value="">Seleccione materia...</option>
                  {(subjectsQuery.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Periodo Escolar" error={form.formState.errors.periodId?.message} {...form.register('periodId')}>
                  <option value="">Seleccione periodo...</option>
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

                <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                  <Button
                    disabled={createMutation.isPending}
                    type="submit"
                    className="haptic-press h-10 px-5 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                  >
                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Guardar Calificación en Acta</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buscador con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por estudiante, materia o periodo..."
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/60 pl-9 pr-8 text-xs text-slate-900 focus:bg-white focus:outline-none transition-all"
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
          <span className="text-xs text-slate-500 font-mono">
            Mostrando <strong className="text-slate-900">{filteredGrades.length}</strong> registros
          </span>
        </div>
      </div>

      {/* Tabla de Calificaciones con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl shadow-doppelrand-inner overflow-hidden">
          {gradesQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-medium font-mono text-slate-600">
                Sincronizando centralizador de calificaciones...
              </span>
            </div>
          ) : gradesQuery.isError ? (
            <div className="p-12 text-center text-xs text-rose-600">
              No se pudieron obtener las calificaciones desde la base central.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3.5">Materia / Área</th>
                    <th className="px-3 py-3.5">Periodo</th>
                    <th className="px-3 py-3.5 text-center">Nota (1-100)</th>
                    <th className="px-3 py-3.5 text-center">Escala Ley 070</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Actualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrades.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">No hay calificaciones registradas</p>
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
                              RUDE: {grade.student.rude ?? 'S/R'}
                            </span>
                          </td>

                          <td className="px-3 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                              {grade.subject.name}
                            </span>
                          </td>

                          <td className="px-3 py-3.5 font-medium text-slate-600 font-mono text-[11px]">
                            {grade.period.name}
                          </td>

                          <td className="px-3 py-3.5 text-center font-mono">
                            <span
                              className={`text-base font-black tabular-nums ${
                                isPassing ? 'text-slate-950' : 'text-rose-600'
                              }`}
                            >
                              {grade.value}
                            </span>
                          </td>

                          <td className="px-3 py-3.5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scale.badgeClass}`}>
                              {scale.label}
                            </span>
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
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 cursor-pointer"
    >
      {children}
    </select>
    {error && <span className="text-[10px] font-normal text-rose-600">{error}</span>}
  </label>
);
