import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Award, Loader2, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const gradeFormSchema = z.object({
  enrollmentId: z.string().uuid('Selecciona una matrícula'),
  studentId: z.string().uuid('Selecciona un estudiante'),
  subjectId: z.string().uuid('Selecciona una materia'),
  periodId: z.string().uuid('Selecciona un periodo'),
  value: z.coerce.number().min(0).max(100),
  remarks: z.string().optional(),
});
type GradeFormData = z.infer<typeof gradeFormSchema>;

export const GradesPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const canEdit = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(authService.getCurrentUser()?.role ?? '');
  const gradesQuery = useQuery({ queryKey: ['grades'], queryFn: () => academicApi.listGrades() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const enrollmentsQuery = useQuery({ queryKey: ['enrollments'], queryFn: () => academicApi.listEnrollments() });
  const subjectsQuery = useQuery({ queryKey: ['subjects'], queryFn: () => academicApi.listSubjects() });
  const periodsQuery = useQuery({ queryKey: ['periods'], queryFn: () => academicApi.listPeriods() });
  const form = useForm<GradeFormData>({ resolver: zodResolver(gradeFormSchema), defaultValues: { enrollmentId: '', studentId: '', subjectId: '', periodId: '', value: 0, remarks: '' } });
  const createMutation = useMutation({ mutationFn: academicApi.createGrade, onSuccess: () => { form.reset(); setShowForm(false); void queryClient.invalidateQueries({ queryKey: ['grades'] }); } });
  const grades = gradesQuery.data?.data ?? [];

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center"><div><h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><Award className="h-6 w-6 text-[#F8C311]" />Registro de calificaciones</h1><p className="mt-1 text-sm text-slate-600">Registra y consulta notas por estudiante, materia y periodo.</p></div>{canEdit && <Button onClick={() => setShowForm((value) => !value)} className="bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white"><Plus className="h-4 w-4" />{showForm ? 'Cerrar formulario' : 'Registrar calificación'}</Button>}</div>
    {showForm && canEdit && <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"><SelectField label="Matrícula" error={form.formState.errors.enrollmentId?.message} {...form.register('enrollmentId')}><option value="">Seleccionar matrícula</option>{(enrollmentsQuery.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.student.firstName} {item.student.lastName} · {item.course.name}</option>)}</SelectField><SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}><option value="">Seleccionar estudiante</option>{(studentsQuery.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.firstName} {item.lastName}</option>)}</SelectField><SelectField label="Materia" error={form.formState.errors.subjectId?.message} {...form.register('subjectId')}><option value="">Seleccionar materia</option>{(subjectsQuery.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField><SelectField label="Periodo" error={form.formState.errors.periodId?.message} {...form.register('periodId')}><option value="">Seleccionar periodo</option>{(periodsQuery.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField><Field label="Nota (0-100)" error={form.formState.errors.value?.message}><input type="number" min="0" max="100" step="0.1" {...form.register('value')} className="h-10 rounded-md border border-input px-3 text-sm" /></Field><Field label="Observaciones"><input {...form.register('remarks')} className="h-10 rounded-md border border-input px-3 text-sm" /></Field><div className="md:col-span-2"><Button disabled={createMutation.isPending} type="submit" className="bg-[#B91329] text-white">{createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Guardar calificación</Button></div></form>}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{gradesQuery.isLoading ? <div className="flex justify-center p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando calificaciones...</div> : gradesQuery.isError ? <p className="p-10 text-center text-[#B91329]">No se pudieron cargar las calificaciones.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">Materia</th><th className="px-5 py-3">Periodo</th><th className="px-5 py-3">Nota</th><th className="px-5 py-3">Actualizado</th></tr></thead><tbody className="divide-y divide-slate-100">{grades.map((grade) => <tr key={grade.id} className="hover:bg-[#fff9e5]"><td className="px-5 py-4 font-semibold text-slate-900">{grade.student.firstName} {grade.student.lastName}</td><td className="px-5 py-4 text-slate-600">{grade.subject.name}</td><td className="px-5 py-4 text-slate-600">{grade.period.name}</td><td className="px-5 py-4"><span className={`font-bold ${grade.value >= 51 ? 'text-emerald-700' : 'text-[#B91329]'}`}>{grade.value}</span></td><td className="px-5 py-4 text-xs text-slate-500">{new Date(grade.updatedAt).toLocaleDateString('es-BO')}</td></tr>)}</tbody></table>{grades.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay calificaciones registradas.</p>}</div>}</div>
  </div>;
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}{children}{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>; }
function SelectField({ label, error, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) { return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}<select {...props} className="h-10 rounded-md border border-input bg-white px-3 text-sm">{children}</select>{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>; }
