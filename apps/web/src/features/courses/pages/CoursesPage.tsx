import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { BookOpen, Loader2, Plus, Search } from 'lucide-react';
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
  const coursesQuery = useQuery({ queryKey: ['courses', search], queryFn: () => academicApi.listCourses(search) });
  const yearsQuery = useQuery({ queryKey: ['academic-years'], queryFn: academicApi.listAcademicYears });
  const form = useForm<CourseFormData>({ resolver: zodResolver(courseFormSchema), defaultValues: { academicYearId: '', name: '', gradeLevel: 1, section: 'A', shift: 'MORNING', maxCapacity: 35 } });
  const createMutation = useMutation({ mutationFn: academicApi.createCourse, onSuccess: () => { form.reset(); setShowForm(false); void queryClient.invalidateQueries({ queryKey: ['courses'] }); } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div><h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><BookOpen className="h-6 w-6 text-[#F37022]" />Cursos y materias</h1><p className="mt-1 text-sm text-slate-600">Gestiona grados, secciones, turnos y capacidad por gestión académica.</p></div>
        {canManage && <Button onClick={() => setShowForm((value) => !value)} className="bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white"><Plus className="h-4 w-4" />{showForm ? 'Cerrar formulario' : 'Registrar curso'}</Button>}
      </div>
      {showForm && canManage && <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700 md:col-span-3">Gestión académica<select {...form.register('academicYearId')} className="h-10 rounded-md border border-input bg-white px-3 text-sm"><option value="">Seleccionar gestión</option>{(yearsQuery.data ?? []).map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}</select>{form.formState.errors.academicYearId && <span className="text-xs font-normal text-[#B91329]">{form.formState.errors.academicYearId.message}</span>}</label>
        <Field label="Nombre del curso" error={form.formState.errors.name?.message}><Input {...form.register('name')} placeholder="1ro de Secundaria A" /></Field>
        <Field label="Nivel" error={form.formState.errors.gradeLevel?.message}><Input type="number" {...form.register('gradeLevel')} /></Field>
        <Field label="Sección" error={form.formState.errors.section?.message}><Input {...form.register('section')} /></Field>
        <Field label="Turno" error={form.formState.errors.shift?.message}><select {...form.register('shift')} className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"><option value="MORNING">Mañana</option><option value="AFTERNOON">Tarde</option><option value="EVENING">Noche</option></select></Field>
        <Field label="Capacidad máxima" error={form.formState.errors.maxCapacity?.message}><Input type="number" {...form.register('maxCapacity')} /></Field>
        <div className="flex items-end"><Button disabled={createMutation.isPending} type="submit" className="bg-[#B91329] text-white">{createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Guardar curso</Button></div>
      </form>}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Search className="h-4 w-4 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar curso..." className="border-0 shadow-none focus-visible:ring-0" /></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coursesQuery.isLoading ? <div className="col-span-full flex justify-center p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando cursos...</div> : coursesQuery.isError ? <p className="col-span-full p-10 text-center text-[#B91329]">No se pudieron cargar los cursos.</p> : (coursesQuery.data?.data ?? []).map((course) => <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-bold text-slate-900">{course.name}</h2><p className="mt-1 text-xs text-slate-500">{course.academicYear.name} · {course.shift === 'MORNING' ? 'Mañana' : course.shift === 'AFTERNOON' ? 'Tarde' : 'Noche'}</p></div><span className="rounded-lg bg-[#fff9e5] px-2 py-1 text-xs font-bold text-[#B91329]">Nivel {course.gradeLevel}</span></div><div className="mt-5 flex justify-between border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">Sección {course.section}</span><span className="font-semibold text-slate-700">{course.enrollmentCount}/{course.maxCapacity} inscritos</span></div></article>)}
      </div>
      {coursesQuery.data?.data.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No hay cursos registrados.</p>}
    </div>
  );
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}{children}{error && <span className="text-xs font-normal text-[#B91329]">{error}</span>}</label>; }
