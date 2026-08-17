import { useForm } from 'react-hook-form';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const attendanceFormSchema = z.object({
  studentId: z.string().uuid('Selecciona un estudiante'),
  courseId: z.string().uuid('Selecciona un curso'),
  date: z.string().min(1, 'Selecciona una fecha'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
  justification: z.string().optional(),
});
type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

export const AttendancePage = () => {
  const queryClient = useQueryClient();
  const canEdit = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(authService.getCurrentUser()?.role ?? '');
  const attendanceQuery = useQuery({ queryKey: ['attendance'], queryFn: () => academicApi.listAttendance() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses() });
  const form = useForm<AttendanceFormData>({ resolver: zodResolver(attendanceFormSchema), defaultValues: { studentId: '', courseId: '', date: new Date().toISOString().slice(0, 10), status: 'PRESENT', justification: '' } });
  const createMutation = useMutation({ mutationFn: academicApi.createAttendance, onSuccess: () => { form.reset({ studentId: '', courseId: '', date: new Date().toISOString().slice(0, 10), status: 'PRESENT', justification: '' }); void queryClient.invalidateQueries({ queryKey: ['attendance'] }); } });
  const records = attendanceQuery.data?.data ?? [];

  return <div className="space-y-6">
    <div className="border-b border-slate-200 pb-5"><h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><CalendarCheck className="h-6 w-6 text-[#F37022]" />Control de asistencia estudiantil</h1><p className="mt-1 text-sm text-slate-600">Registra presencia, atrasos, faltas y justificaciones.</p></div>
    {canEdit && <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4"><SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}><option value="">Seleccionar estudiante</option>{(studentsQuery.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.firstName} {item.lastName}</option>)}</SelectField><SelectField label="Curso" error={form.formState.errors.courseId?.message} {...form.register('courseId')}><option value="">Seleccionar curso</option>{(coursesQuery.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField><Field label="Fecha" error={form.formState.errors.date?.message}><input type="date" {...form.register('date')} className="h-10 rounded-md border border-input px-3 text-sm" /></Field><SelectField label="Estado" error={form.formState.errors.status?.message} {...form.register('status')}><option value="PRESENT">Presente</option><option value="ABSENT">Ausente</option><option value="LATE">Atrasado</option><option value="JUSTIFIED">Justificado</option></SelectField><Field label="Justificación" error={form.formState.errors.justification?.message}><input {...form.register('justification')} className="h-10 rounded-md border border-input px-3 text-sm" /></Field><div className="flex items-end"><Button disabled={createMutation.isPending} type="submit" className="bg-[#B91329] text-white">{createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Registrar</Button></div></form>}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{attendanceQuery.isLoading ? <div className="flex justify-center p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando asistencia...</div> : attendanceQuery.isError ? <p className="p-10 text-center text-[#B91329]">No se pudo cargar la asistencia.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">Curso</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3">Justificación</th></tr></thead><tbody className="divide-y divide-slate-100">{records.map((record) => <tr key={record.id} className="hover:bg-[#fff9e5]"><td className="px-5 py-4 text-slate-600">{new Date(record.date).toLocaleDateString('es-BO')}</td><td className="px-5 py-4 font-semibold text-slate-900">{record.student.firstName} {record.student.lastName}</td><td className="px-5 py-4 text-slate-600">{record.course.name}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : record.status === 'ABSENT' ? 'bg-red-50 text-[#B91329]' : 'bg-amber-50 text-amber-700'}`}>{statusLabel(record.status)}</span></td><td className="px-5 py-4 text-slate-500">{record.justification ?? '—'}</td></tr>)}</tbody></table>{records.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay registros de asistencia.</p>}</div>}</div>
  </div>;
};

function statusLabel(status: string) { return ({ PRESENT: 'Presente', ABSENT: 'Ausente', LATE: 'Atrasado', JUSTIFIED: 'Justificado' } as Record<string, string>)[status] ?? status; }
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}{children}{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>; }
function SelectField({ label, error, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) { return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}<select {...props} className="h-10 rounded-md border border-input bg-white px-3 text-sm">{children}</select>{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>; }
