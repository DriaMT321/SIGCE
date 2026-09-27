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
  UserCheck,
  UsersRound,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
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

  const title = mode === 'teachers' ? 'Plantel Docente' : 'Padres y Tutores de Familia';
  const Icon = mode === 'teachers' ? ContactRound : UsersRound;
  const isLoading = mode === 'teachers' ? teachersQuery.isLoading : parentsQuery.isLoading;
  const isError = mode === 'teachers' ? teachersQuery.isError : parentsQuery.isError;
  const dataCount = mode === 'teachers' ? teachersQuery.data?.total ?? teachersQuery.data?.data?.length ?? 0 : parentsQuery.data?.total ?? parentsQuery.data?.data?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <Icon className="w-3.5 h-3.5 text-brand-700" />
              <span>Comunidad Educativa</span>
            </span>
            <Badge variant="outline" className="font-mono">
              {dataCount} registros
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {mode === 'teachers'
              ? 'Administración de credenciales docentes, especialidades e ítems pedagógicos.'
              : 'Directorio de representantes legales, datos de contacto y vinculación con estudiantes.'}
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
                <span>{mode === 'teachers' ? 'Nuevo Docente' : 'Nuevo Familiar'}</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Formulario de Alta de Docente */}
      {showForm && canManage && mode === 'teachers' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Alta de Docente en el Sistema
            </h2>
            <p className="text-xs text-slate-500">
              Crea la cuenta de acceso institucional y asocia la especialidad pedagógica.
            </p>
          </div>

          <form onSubmit={teacherForm.handleSubmit((data) => createTeacher.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Correo Institucional" error={teacherForm.formState.errors.email?.message}>
                <Input type="email" {...teacherForm.register('email')} placeholder="docente@ue-cristiana.edu.bo" className="text-xs" />
              </Field>

              <Field label="Contraseña Temporal" error={teacherForm.formState.errors.password?.message}>
                <Input type="password" {...teacherForm.register('password')} placeholder="Mínimo 6 caracteres" className="text-xs font-mono" />
              </Field>

              <Field label="Cédula de Identidad (C.I.)" error={teacherForm.formState.errors.ci?.message}>
                <Input {...teacherForm.register('ci')} placeholder="Ej. 4589210" className="text-xs font-mono" />
              </Field>

              <Field label="Código / Ítem Docente">
                <Input {...teacherForm.register('itemNumber')} placeholder="Ej. ITEM-012" className="text-xs font-mono" />
              </Field>

              <Field label="Nombres" error={teacherForm.formState.errors.firstName?.message}>
                <Input {...teacherForm.register('firstName')} placeholder="Nombres" className="text-xs" />
              </Field>

              <Field label="Apellidos" error={teacherForm.formState.errors.lastName?.message}>
                <Input {...teacherForm.register('lastName')} placeholder="Apellidos" className="text-xs" />
              </Field>

              <Field label="Especialidad / Asignatura" error={teacherForm.formState.errors.specialty?.message}>
                <Input {...teacherForm.register('specialty')} placeholder="Ej. Matemáticas, Lenguaje..." className="text-xs" />
              </Field>

              <Field label="Teléfono Celular">
                <Input {...teacherForm.register('phone')} placeholder="Ej. 70012345" className="text-xs font-mono" />
              </Field>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <Button
                  disabled={createTeacher.isPending}
                  type="submit"
                  className="h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  {createTeacher.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Registrar Docente</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Formulario de Alta de Familiar */}
      {showForm && canManage && mode === 'parents' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Alta de Representante / Tutor
            </h2>
            <p className="text-xs text-slate-500">
              Registra los datos del tutor responsable de los estudiantes matriculados.
            </p>
          </div>

          <form onSubmit={parentForm.handleSubmit((data) => createParent.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Correo de Notificaciones" error={parentForm.formState.errors.email?.message}>
                <Input type="email" {...parentForm.register('email')} placeholder="tutor@gmail.com" className="text-xs" />
              </Field>

              <Field label="Contraseña de Acceso" error={parentForm.formState.errors.password?.message}>
                <Input type="password" {...parentForm.register('password')} placeholder="Mínimo 6 caracteres" className="text-xs font-mono" />
              </Field>

              <Field label="Cédula de Identidad (C.I.)" error={parentForm.formState.errors.ci?.message}>
                <Input {...parentForm.register('ci')} placeholder="Ej. 7845120" className="text-xs font-mono" />
              </Field>

              <Field label="Teléfono Celular" error={parentForm.formState.errors.phone?.message}>
                <Input {...parentForm.register('phone')} placeholder="Ej. 71234567" className="text-xs font-mono" />
              </Field>

              <Field label="Nombres" error={parentForm.formState.errors.firstName?.message}>
                <Input {...parentForm.register('firstName')} placeholder="Nombres" className="text-xs" />
              </Field>

              <Field label="Apellidos" error={parentForm.formState.errors.lastName?.message}>
                <Input {...parentForm.register('lastName')} placeholder="Apellidos" className="text-xs" />
              </Field>

              <Field label="Dirección de Domicilio">
                <Input {...parentForm.register('address')} placeholder="Zona / Calle" className="text-xs" />
              </Field>

              <Field label="Ocupación / Profesión">
                <Input {...parentForm.register('occupation')} placeholder="Opcional" className="text-xs" />
              </Field>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <Button
                  disabled={createParent.isPending}
                  type="submit"
                  className="h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  {createParent.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Registrar Familiar</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Buscar ${mode === 'teachers' ? 'docente por nombre o especialidad' : 'familiar por nombre o C.I.'}...`}
          className="pl-9 h-10 text-xs bg-white"
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

      {/* Tabla de Datos */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
            <span className="text-xs font-medium">Cargando {title.toLowerCase()}...</span>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            No se pudo obtener la información de la comunidad educativa.
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
        <p className="font-semibold text-slate-700 text-sm">No se encontraron docentes</p>
        <p className="text-xs text-slate-400">Verifique los filtros o registre un nuevo docente.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <th className="py-3 pl-5 pr-3">Docente Titular</th>
            <th className="px-3 py-3">Código / Ítem</th>
            <th className="px-3 py-3">Especialidad Curricular</th>
            <th className="py-3 pl-3 pr-5 text-right">Correo Electrónico</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => {
            const initials = `${item.firstName[0] ?? ''}${item.lastName[0] ?? ''}`.toUpperCase();
            return (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">
                        {item.firstName} {item.lastName}
                      </p>
                      <span className="text-[10px] text-slate-400">Docente</span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3.5 font-mono text-slate-700">
                  {item.itemNumber ? (
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                      {item.itemNumber}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>

                <td className="px-3 py-3.5">
                  <Badge variant="brand" className="font-medium">
                    {item.specialty}
                  </Badge>
                </td>

                <td className="py-3.5 pl-3 pr-5 text-right font-mono text-slate-600">
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {item.email}
                  </span>
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
        <p className="font-semibold text-slate-700 text-sm">No se encontraron tutores o familiares</p>
        <p className="text-xs text-slate-400">Verifique los filtros o registre un nuevo tutor.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <th className="py-3 pl-5 pr-3">Familiar / Tutor</th>
            <th className="px-3 py-3">Cédula (C.I.)</th>
            <th className="px-3 py-3">Teléfono Celular</th>
            <th className="py-3 pl-3 pr-5 text-right">Estudiantes a su Cargo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => {
            const initials = `${item.firstName[0] ?? ''}${item.lastName[0] ?? ''}`.toUpperCase();
            return (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">
                        {item.firstName} {item.lastName}
                      </p>
                      <span className="text-[10px] text-slate-400">Representante Legal</span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3.5 font-mono text-slate-700">
                  {item.ci}
                </td>

                <td className="px-3 py-3.5 font-mono text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {item.phone}
                  </span>
                </td>

                <td className="py-3.5 pl-3 pr-5 text-right">
                  {item.students && item.students.length > 0 ? (
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {item.students.map((st, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium"
                        >
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          {st.firstName} {st.lastName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Sin estudiantes asociados</span>
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
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-[10px] font-normal text-red-600">{error}</span>}
    </label>
  );
}
