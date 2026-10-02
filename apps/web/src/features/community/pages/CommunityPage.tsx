import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  ContactRound,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  UsersRound,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const teacherFormSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La clave debe tener al menos 6 caracteres'),
  ci: z.string().min(1, 'La cédula es requerida'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  specialty: z.string().min(1, 'La especialidad es requerida'),
  phone: z.string().optional(),
  itemNumber: z.string().optional(),
});

const parentFormSchema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La clave debe tener al menos 6 caracteres'),
  ci: z.string().min(1, 'La cédula es requerida'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherFormSchema>;
type ParentFormData = z.infer<typeof parentFormSchema>;

export function CommunityPage({ mode }: { mode: 'teachers' | 'parents' }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const canManage = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(authService.getCurrentUser()?.role ?? '');
  const canRead =
    mode === 'teachers'
      ? ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(authService.getCurrentUser()?.role ?? '')
      : canManage;

  const teachersQuery = useQuery({
    queryKey: ['teachers', search],
    queryFn: () => academicApi.listTeachers(search),
    enabled: mode === 'teachers' && canRead,
  });

  const parentsQuery = useQuery({
    queryKey: ['parents', search],
    queryFn: () => academicApi.listParents(search),
    enabled: mode === 'parents' && canRead,
  });

  const teacherForm = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      email: '',
      password: '',
      ci: '',
      firstName: '',
      lastName: '',
      specialty: '',
      phone: '',
      itemNumber: '',
    },
  });

  const parentForm = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      email: '',
      password: '',
      ci: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      occupation: '',
    },
  });

  const createTeacher = useMutation({
    mutationFn: academicApi.createTeacher,
    onSuccess: () => {
      teacherForm.reset();
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  const createParent = useMutation({
    mutationFn: academicApi.createParent,
    onSuccess: () => {
      parentForm.reset();
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });

  const title = mode === 'teachers' ? 'Docentes' : 'Padres y Tutores';
  const Icon = mode === 'teachers' ? ContactRound : UsersRound;
  const isLoading = mode === 'teachers' ? teachersQuery.isLoading : parentsQuery.isLoading;
  const isError = mode === 'teachers' ? teachersQuery.isError : parentsQuery.isError;
  const dataCount = mode === 'teachers' ? teachersQuery.data?.total ?? teachersQuery.data?.data?.length ?? 0 : parentsQuery.data?.total ?? parentsQuery.data?.data?.length ?? 0;

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{dataCount} registros</p>
        </div>

        {canManage && (
          <Button
            onClick={() => setShowForm((prev) => !prev)}
            className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Nuevo</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Form - Simplified */}
      {showForm && canManage && mode === 'teachers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Docente</h2>

          <form onSubmit={teacherForm.handleSubmit((data) => createTeacher.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Correo" error={teacherForm.formState.errors.email?.message}>
                <Input type="email" {...teacherForm.register('email')} placeholder="docente@ue.edu.bo" />
              </Field>

              <Field label="Contraseña" error={teacherForm.formState.errors.password?.message}>
                <Input type="password" {...teacherForm.register('password')} placeholder="Mínimo 6 caracteres" />
              </Field>

              <Field label="C.I." error={teacherForm.formState.errors.ci?.message}>
                <Input {...teacherForm.register('ci')} placeholder="12345678" />
              </Field>

              <Field label="Ítem">
                <Input {...teacherForm.register('itemNumber')} placeholder="ITEM-012" />
              </Field>

              <Field label="Nombres" error={teacherForm.formState.errors.firstName?.message}>
                <Input {...teacherForm.register('firstName')} placeholder="Nombres" />
              </Field>

              <Field label="Apellidos" error={teacherForm.formState.errors.lastName?.message}>
                <Input {...teacherForm.register('lastName')} placeholder="Apellidos" />
              </Field>

              <Field label="Especialidad" error={teacherForm.formState.errors.specialty?.message}>
                <Input {...teacherForm.register('specialty')} placeholder="Matemáticas, Lenguaje..." />
              </Field>

              <Field label="Teléfono">
                <Input {...teacherForm.register('phone')} placeholder="70012345" />
              </Field>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <Button
                  disabled={createTeacher.isPending}
                  type="submit"
                  className="h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-1.5"
                >
                  {createTeacher.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showForm && canManage && mode === 'parents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Familiar</h2>

          <form onSubmit={parentForm.handleSubmit((data) => createParent.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Correo" error={parentForm.formState.errors.email?.message}>
                <Input type="email" {...parentForm.register('email')} placeholder="tutor@gmail.com" />
              </Field>

              <Field label="Contraseña" error={parentForm.formState.errors.password?.message}>
                <Input type="password" {...parentForm.register('password')} placeholder="Mínimo 6 caracteres" />
              </Field>

              <Field label="C.I." error={parentForm.formState.errors.ci?.message}>
                <Input {...parentForm.register('ci')} placeholder="12345678" />
              </Field>

              <Field label="Teléfono" error={parentForm.formState.errors.phone?.message}>
                <Input {...parentForm.register('phone')} placeholder="70012345" />
              </Field>

              <Field label="Nombres" error={parentForm.formState.errors.firstName?.message}>
                <Input {...parentForm.register('firstName')} placeholder="Nombres" />
              </Field>

              <Field label="Apellidos" error={parentForm.formState.errors.lastName?.message}>
                <Input {...parentForm.register('lastName')} placeholder="Apellidos" />
              </Field>

              <Field label="Dirección">
                <Input {...parentForm.register('address')} placeholder="Zona / Calle" />
              </Field>

              <Field label="Ocupación">
                <Input {...parentForm.register('occupation')} placeholder="Opcional" />
              </Field>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <Button
                  disabled={createParent.isPending}
                  type="submit"
                  className="h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-1.5"
                >
                  {createParent.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search - Single row */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Buscar ${mode === 'teachers' ? 'docente' : 'familiar'}...`}
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

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Cargando...</span>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-sm text-rose-600">
            No se pudo obtener la información.
          </div>
        ) : mode === 'teachers' ? (
          <TeacherTable data={teachersQuery.data?.data ?? []} />
        ) : (
          <ParentTable data={parentsQuery.data?.data ?? []} />
        )}
      </div>
    </div>
  );
}

function TeacherTable({
  data,
}: {
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    itemNumber: string | null;
    specialty: string;
    email: string;
  }>;
}) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-medium text-slate-700">No se encontraron docentes</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <th className="py-3 pl-5 pr-3">Docente</th>
            <th className="px-3 py-3">Ítem</th>
            <th className="px-3 py-3">Especialidad</th>
            <th className="py-3 pl-3 pr-5 text-right">Correo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => {
            const initials = `${item.firstName[0] ?? ''}${item.lastName[0] ?? ''}`.toUpperCase();
            return (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                      {initials}
                    </div>
                    <span className="font-medium text-slate-900">
                      {item.firstName} {item.lastName}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3 font-mono text-slate-700">
                  {item.itemNumber || <span className="text-slate-400">—</span>}
                </td>

                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {item.specialty}
                  </span>
                </td>

                <td className="py-3 pl-3 pr-5 text-right font-mono text-slate-600 text-xs">
                  {item.email}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ParentTable({
  data,
}: {
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    students: Array<{ firstName: string; lastName: string }>;
  }>;
}) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <UsersRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-medium text-slate-700">No se encontraron familiares</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <th className="py-3 pl-5 pr-3">Familiar</th>
            <th className="px-3 py-3">C.I.</th>
            <th className="px-3 py-3">Teléfono</th>
            <th className="py-3 pl-3 pr-5 text-right">Estudiantes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => {
            const initials = `${item.firstName[0] ?? ''}${item.lastName[0] ?? ''}`.toUpperCase();
            return (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                      {initials}
                    </div>
                    <span className="font-medium text-slate-900">
                      {item.firstName} {item.lastName}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3 font-mono text-slate-700">
                  {item.ci}
                </td>

                <td className="px-3 py-3 font-mono text-slate-600 text-xs">
                  {item.phone}
                </td>

                <td className="py-3 pl-3 pr-5 text-right">
                  {item.students && item.students.length > 0 ? (
                    <div className="flex flex-wrap justify-end gap-1">
                      {item.students.map((st, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {st.firstName} {st.lastName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">Sin estudiantes</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}
