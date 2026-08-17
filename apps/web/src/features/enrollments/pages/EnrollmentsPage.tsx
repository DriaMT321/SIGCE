import { useForm } from 'react-hook-form';
import type { SelectHTMLAttributes } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ClipboardList, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const enrollmentFormSchema = z.object({
  studentId: z.string().uuid('Selecciona un estudiante'),
  courseId: z.string().uuid('Selecciona un curso'),
  academicYearId: z.string().uuid('Selecciona una gestión'),
  remarks: z.string().max(300).optional(),
});

const statusSchema = z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED', 'WITHDRAWN']);
type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;
type EnrollmentStatus = z.infer<typeof statusSchema>;

const statusLabels: Record<EnrollmentStatus, string> = {
  ACTIVE: 'Activa',
  INACTIVE: 'Inactiva',
  TRANSFERRED: 'Trasladada',
  GRADUATED: 'Graduada',
  WITHDRAWN: 'Retirada',
};

export function EnrollmentsPage() {
  const queryClient = useQueryClient();
  const canManage = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(authService.getCurrentUser()?.role ?? '');
  const enrollmentsQuery = useQuery({ queryKey: ['enrollments'], queryFn: () => academicApi.listEnrollments() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents(), enabled: canManage });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses(), enabled: canManage });
  const yearsQuery = useQuery({ queryKey: ['academic-years'], queryFn: academicApi.listAcademicYears, enabled: canManage });
  const form = useForm<EnrollmentFormData>({ resolver: zodResolver(enrollmentFormSchema), defaultValues: { studentId: '', courseId: '', academicYearId: '', remarks: '' } });
  const createMutation = useMutation({ mutationFn: academicApi.createEnrollment, onSuccess: () => { form.reset(); void queryClient.invalidateQueries({ queryKey: ['enrollments'] }); } });
  const updateMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: EnrollmentStatus }) => academicApi.updateEnrollment(id, { status }), onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['enrollments'] }) });
  const enrollments = enrollmentsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><ClipboardList className="h-6 w-6 text-[#F37022]" />Matrículas</h1>
        <p className="mt-1 text-sm text-slate-600">Asigna estudiantes a cursos y mantén el estado de su inscripción.</p>
      </div>

      {canManage && <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
        <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}><option value="">Seleccionar estudiante</option>{(studentsQuery.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.firstName} {item.lastName} · {item.rude}</option>)}</SelectField>
        <SelectField label="Curso" error={form.formState.errors.courseId?.message} {...form.register('courseId')}><option value="">Seleccionar curso</option>{(coursesQuery.data?.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name} · {item.academicYear.year}</option>)}</SelectField>
        <SelectField label="Gestión académica" error={form.formState.errors.academicYearId?.message} {...form.register('academicYearId')}><option value="">Seleccionar gestión</option>{(yearsQuery.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Observaciones<input {...form.register('remarks')} className="h-10 rounded-md border border-input px-3 text-sm" placeholder="Opcional" />{form.formState.errors.remarks && <span className="text-xs font-normal text-[#B91329]">{form.formState.errors.remarks.message}</span>}</label>
        <div className="md:col-span-4"><Button disabled={createMutation.isPending} type="submit" className="bg-[#B91329] text-white">{createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Registrar matrícula</Button></div>
      </form>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {enrollmentsQuery.isLoading ? <div className="flex justify-center p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando matrículas...</div> : enrollmentsQuery.isError ? <p className="p-10 text-center text-[#B91329]">No se pudieron cargar las matrículas.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">Curso</th><th className="px-5 py-3">Gestión</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3">Acción</th></tr></thead><tbody className="divide-y divide-slate-100">{enrollments.map((item) => <tr key={item.id} className="hover:bg-[#fff9e5]"><td className="px-5 py-4 font-semibold text-slate-900">{item.student.firstName} {item.student.lastName}<span className="block font-mono text-xs font-normal text-slate-500">{item.student.rude}</span></td><td className="px-5 py-4 text-slate-600">{item.course.name}</td><td className="px-5 py-4 text-slate-600">{item.academicYear.name}</td><td className="px-5 py-4"><span className="rounded-full bg-[#fff9e5] px-2.5 py-1 text-xs font-semibold text-[#B91329]">{statusLabels[statusSchema.parse(item.status)]}</span></td><td className="px-5 py-4">{canManage && <select defaultValue={item.status} disabled={updateMutation.isPending} onChange={(event) => updateMutation.mutate({ id: item.id, status: statusSchema.parse(event.target.value) })} className="h-9 rounded-md border border-input bg-white px-2 text-xs"><option value="ACTIVE">Activa</option><option value="INACTIVE">Inactiva</option><option value="TRANSFERRED">Trasladada</option><option value="GRADUATED">Graduada</option><option value="WITHDRAWN">Retirada</option></select>}</td></tr>)}</tbody></table>{enrollments.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay matrículas registradas.</p>}</div>}
      </div>
    </div>
  );
}

const SelectField = ({ label, error, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}<select {...props} className="h-10 rounded-md border border-input bg-white px-3 text-sm">{children}</select>{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>;
