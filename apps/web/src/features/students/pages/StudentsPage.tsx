import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { AlertCircle, Loader2, Plus, Search, Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const studentFormSchema = z.object({
  rude: z.string().min(1, 'El RUDE es obligatorio'),
  ci: z.string().min(1, 'La cédula es obligatoria'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  gender: z.enum(['MALE', 'FEMALE']),
  phone: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

export const StudentsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const currentRole = authService.getCurrentUser()?.role;
  const canManage = currentRole === 'ADMIN' || currentRole === 'DIRECTOR' || currentRole === 'SECRETARY';
  const studentsQuery = useQuery({ queryKey: ['students', search], queryFn: () => academicApi.listStudents(search) });
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: { rude: '', ci: '', firstName: '', lastName: '', birthDate: '', gender: 'MALE', phone: '' },
  });
  const createMutation = useMutation({
    mutationFn: academicApi.createStudent,
    onSuccess: () => { form.reset(); setShowForm(false); void queryClient.invalidateQueries({ queryKey: ['students'] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><Users className="h-6 w-6 text-[#F37022]" />Gestión de Estudiantes</h1>
          <p className="mt-1 text-sm text-slate-600">Registro, actualización de datos personales, RUDE y vinculación académica.</p>
        </div>
        {canManage && <Button onClick={() => setShowForm((value) => !value)} className="bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white"><Plus className="h-4 w-4" />{showForm ? 'Cerrar formulario' : 'Registrar estudiante'}</Button>}
      </div>

      {showForm && canManage && (
        <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
          <Field label="RUDE" error={form.formState.errors.rude?.message}><Input {...form.register('rude')} placeholder="Registro Único de Estudiante" /></Field>
          <Field label="Cédula de identidad" error={form.formState.errors.ci?.message}><Input {...form.register('ci')} /></Field>
          <Field label="Nombre" error={form.formState.errors.firstName?.message}><Input {...form.register('firstName')} /></Field>
          <Field label="Apellido" error={form.formState.errors.lastName?.message}><Input {...form.register('lastName')} /></Field>
          <Field label="Fecha de nacimiento" error={form.formState.errors.birthDate?.message}><Input type="date" {...form.register('birthDate')} /></Field>
          <Field label="Género" error={form.formState.errors.gender?.message}><select {...form.register('gender')} className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"><option value="MALE">Masculino</option><option value="FEMALE">Femenino</option></select></Field>
          <Field label="Teléfono" error={form.formState.errors.phone?.message}><Input {...form.register('phone')} /></Field>
          <div className="flex items-end md:col-span-2"><Button disabled={createMutation.isPending} type="submit" className="bg-[#B91329] text-white">{createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Guardar estudiante</Button></div>
          {createMutation.isError && <p className="flex items-center gap-2 text-sm text-[#B91329] md:col-span-3"><AlertCircle className="h-4 w-4" />No se pudo registrar el estudiante.</p>}
        </form>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Search className="h-4 w-4 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, RUDE o cédula..." className="border-0 shadow-none focus-visible:ring-0" /></div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {studentsQuery.isLoading ? <div className="flex items-center justify-center p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando estudiantes...</div> : studentsQuery.isError ? <div className="p-10 text-center text-[#B91329]">No se pudieron cargar los estudiantes.</div> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Estudiante</th><th className="px-5 py-3">RUDE</th><th className="px-5 py-3">C.I.</th><th className="px-5 py-3">Curso activo</th><th className="px-5 py-3">Estado</th></tr></thead><tbody className="divide-y divide-slate-100">{(studentsQuery.data?.data ?? []).map((student) => <tr key={student.id} className="hover:bg-[#fff9e5]"><td className="px-5 py-4 font-semibold text-slate-900">{student.firstName} {student.lastName}</td><td className="px-5 py-4 font-mono text-slate-600">{student.rude}</td><td className="px-5 py-4 text-slate-600">{student.ci}</td><td className="px-5 py-4 text-slate-600">{student.enrollments[0]?.course.name ?? 'Sin matrícula'}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{student.isActive ? 'Activo' : 'Inactivo'}</span></td></tr>)}</tbody></table>{studentsQuery.data?.data.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay estudiantes registrados.</p>}</div>
        )}
      </div>
    </div>
  );
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}{children}{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>;
}
