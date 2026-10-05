import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  ContactRound,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const userFormSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  role: z.enum(['DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'], {
    errorMap: () => ({ message: 'Seleccione un rol válido' }),
  }),
  ci: z.string().optional(),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  itemNumber: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

const ROLE_TABS = [
  { id: 'ALL', label: 'Todos los Roles' },
  { id: 'DIRECTOR', label: 'Directores' },
  { id: 'SECRETARY', label: 'Secretaría' },
  { id: 'TEACHER', label: 'Docentes' },
  { id: 'PARENT', label: 'Padres / Tutores' },
];

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();
  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'DIRECTOR';

  const usersQuery = useQuery({
    queryKey: ['users', roleFilter, search],
    queryFn: () => academicApi.listUsers({
      role: roleFilter !== 'ALL' ? roleFilter : undefined,
      search: search || undefined,
      limit: 100,
    }),
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'TEACHER',
      ci: '',
      phone: '',
      specialty: '',
      itemNumber: '',
      address: '',
      occupation: '',
    },
  });

  const selectedRole = form.watch('role');

  const createMutation = useMutation({
    mutationFn: academicApi.createUser,
    onSuccess: () => {
      form.reset();
      setShowForm(false);
      setErrorMessage(null);
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      void queryClient.invalidateQueries({ queryKey: ['teachers'] });
      void queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
    onError: (err: unknown) => {
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = errObj.response?.data?.message || errObj.message || 'No se pudo crear el usuario';
      setErrorMessage(msg);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      academicApi.updateUser(id, { isActive }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const usersList = usersQuery.data?.data ?? [];
  const totalCount = usersQuery.data?.total ?? usersList.length;

  const roleStyles: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
    ADMIN: { label: 'Administrador Global', badgeClass: 'bg-slate-900 text-amber-400 border-slate-900', dotClass: 'bg-amber-400' },
    DIRECTOR: { label: 'Personal Directivo', badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/90', dotClass: 'bg-amber-500' },
    SECRETARY: { label: 'Secretaría / Adm.', badgeClass: 'bg-blue-50 text-blue-900 border-blue-200/90', dotClass: 'bg-blue-500' },
    TEACHER: { label: 'Docente Titular', badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/90', dotClass: 'bg-emerald-500' },
    PARENT: { label: 'Padre / Tutor', badgeClass: 'bg-purple-50 text-purple-900 border-purple-200/90', dotClass: 'bg-purple-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Gestión de Personal y Cuentas</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {totalCount} Usuarios Activos
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Control de Roles Institucionales
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Personal y Roles Institucionales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Alta y administración de perfiles autorizados: Directores, Secretaría, Docentes y Padres de Familia con asignación de credenciales.
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm((prev) => !prev);
                  setErrorMessage(null);
                }}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{showForm ? 'Cerrar Ficha' : 'Nuevo Personal / Usuario'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Alta con Selección de Rol (Exceptuando Administrador) */}
      {showForm && canManage && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-700" />
                  Alta de Nuevo Personal Institucional
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seleccione el rol correspondiente y complete los datos requeridos. La cuenta se habilitará de forma inmediata.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-slate-500">
                Rol Administrador Restringido
              </Badge>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-5">
              {/* Selector de Rol */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Seleccionar Rol a Asignar *</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Excluye rol Administrador del sistema)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'DIRECTOR', label: 'Director', desc: 'Personal Directivo', icon: ShieldCheck },
                    { id: 'SECRETARY', label: 'Secretaría', desc: 'Gestión y Admisiones', icon: ContactRound },
                    { id: 'TEACHER', label: 'Docente Titular', desc: 'Aula y Registro Pedagógico', icon: GraduationCap },
                    { id: 'PARENT', label: 'Padre / Tutor', desc: 'Familiar y Apoderado', icon: UsersRound },
                  ].map((item) => {
                    const isSelected = selectedRole === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => form.setValue('role', item.id as UserFormData['role'])}
                        className={`p-3 rounded-xl border text-left transition-all haptic-press cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#f37022]/40'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{item.label}</p>
                          <p className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campos Generales */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 border-t border-slate-100">
                <Field label="Nombres *" error={form.formState.errors.firstName?.message}>
                  <Input {...form.register('firstName')} placeholder="Nombres completos" className="text-xs rounded-xl" />
                </Field>

                <Field label="Apellidos *" error={form.formState.errors.lastName?.message}>
                  <Input {...form.register('lastName')} placeholder="Apellidos paterno y materno" className="text-xs rounded-xl" />
                </Field>

                <Field label="Correo Electrónico Institucional *" error={form.formState.errors.email?.message}>
                  <Input type="email" {...form.register('email')} placeholder="usuario@sigce.edu.bo" className="text-xs rounded-xl" />
                </Field>

                <Field label="Cédula de Identidad (C.I.)" error={form.formState.errors.ci?.message}>
                  <Input {...form.register('ci')} placeholder="Ej. 6840192" className="text-xs rounded-xl font-mono" />
                </Field>

                <Field label="Contraseña Inicial *" error={form.formState.errors.password?.message}>
                  <Input type="password" {...form.register('password')} placeholder="Mínimo 6 caracteres" className="text-xs rounded-xl font-mono" />
                </Field>

                <Field label="Teléfono / Celular de Contacto" error={form.formState.errors.phone?.message}>
                  <Input {...form.register('phone')} placeholder="Ej. 76401234" className="text-xs rounded-xl font-mono" />
                </Field>

                {/* Campos Específicos para Docentes */}
                {selectedRole === 'TEACHER' && (
                  <>
                    <Field label="Especialidad o Área *" error={form.formState.errors.specialty?.message}>
                      <Input {...form.register('specialty')} placeholder="Ej. Matemáticas, Lenguaje, Primaria..." className="text-xs rounded-xl" />
                    </Field>
                    <Field label="Nro. de Ítem Ministerial" error={form.formState.errors.itemNumber?.message}>
                      <Input {...form.register('itemNumber')} placeholder="Ej. 14" className="text-xs rounded-xl font-mono" />
                    </Field>
                  </>
                )}

                {/* Campos Específicos para Padres */}
                {selectedRole === 'PARENT' && (
                  <>
                    <Field label="Dirección de Domicilio" error={form.formState.errors.address?.message}>
                      <Input {...form.register('address')} placeholder="Zona, calle o avenida" className="text-xs rounded-xl" />
                    </Field>
                    <Field label="Ocupación o Profesión" error={form.formState.errors.occupation?.message}>
                      <Input {...form.register('occupation')} placeholder="Opcional" className="text-xs rounded-xl" />
                    </Field>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="h-10 text-xs rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="haptic-press h-10 px-6 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Crear y Registrar Perfil</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Role Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`haptic-press px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="pl-9 pr-8 h-10 text-xs bg-slate-50/60 border-slate-200/90 rounded-xl focus:bg-white transition-all"
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
        </div>
      </div>

      {/* Tabla de Usuarios Institucionales */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl shadow-doppelrand-inner overflow-hidden">
          {usersQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-medium font-mono text-slate-600">
                Cargando directorio de personal y cuentas...
              </span>
            </div>
          ) : usersQuery.isError ? (
            <div className="p-12 text-center text-xs text-rose-600">
              No se pudo obtener la lista de usuarios desde el servidor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Usuario / Personal</th>
                    <th className="px-3 py-3.5">Correo Electrónico</th>
                    <th className="px-3 py-3.5">Rol Institucional</th>
                    <th className="px-3 py-3.5">Estado</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Fecha de Alta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="font-bold text-slate-800 text-sm">No se encontraron usuarios</p>
                          <p className="text-xs text-slate-400">Intente modificando el término de búsqueda o el rol seleccionado.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    usersList.map((user) => {
                      const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U';
                      const config = roleStyles[user.role] ?? {
                        label: user.role,
                        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                        dotClass: 'bg-slate-400',
                      };

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0 shadow-xs">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">
                                  {user.firstName} {user.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {user.id.slice(0, 8)}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3.5 font-mono text-slate-600">
                            {user.email}
                          </td>

                          <td className="px-3 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${config.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                              {config.label}
                            </span>
                          </td>

                          <td className="px-3 py-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (user.role === 'ADMIN') return;
                                toggleStatusMutation.mutate({ id: user.id, isActive: !user.isActive });
                              }}
                              disabled={user.role === 'ADMIN' || !canManage || toggleStatusMutation.isPending}
                              title={user.role === 'ADMIN' ? 'El estado del administrador no puede modificarse' : 'Haga clic para cambiar estado'}
                              className={`haptic-press inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer disabled:cursor-not-allowed ${
                                user.isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              <span>{user.isActive ? 'Activo' : 'Inactivo'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 pl-3 pr-5 text-right font-mono text-slate-400 text-[11px]">
                            {new Date(user.createdAt).toLocaleDateString('es-BO')}
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
