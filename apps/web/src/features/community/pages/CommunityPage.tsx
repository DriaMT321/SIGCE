import React, { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  GraduationCap,
  Loader2,
  Plus,
  Search,
  UsersRound,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
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

interface EditTeacherState {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  itemNumber: string;
}

interface EditParentState {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  occupation: string;
}

interface DeleteItemState {
  type: 'teacher' | 'parent';
  id: string;
  name: string;
}

export function CommunityPage({ mode }: { mode: 'teachers' | 'parents' }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // Modals state for Edit and Delete
  const [editingTeacher, setEditingTeacher] = useState<EditTeacherState | null>(null);
  const [editingParent, setEditingParent] = useState<EditParentState | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeleteItemState | null>(null);

  const currentRole = authService.getCurrentUser()?.role;
  const canManage = currentRole === 'ADMIN' || currentRole === 'DIRECTOR';
  const canRead =
    mode === 'teachers'
      ? ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(currentRole ?? '')
      : ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(currentRole ?? '');

  const teachersQuery = useQuery({
    queryKey: ['teachers', search],
    queryFn: () => academicApi.listTeachers(search),
    enabled: mode === 'teachers' && canRead,
  });

  const parentsQuery = useQuery({
    queryKey: ['parents', search],
    queryFn: () => academicApi.listParents(search, 300),
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

  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditTeacherState> }) =>
      academicApi.updateTeacher(id, data),
    onSuccess: () => {
      setEditingTeacher(null);
      void queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => academicApi.deleteTeacher(id),
    onSuccess: () => {
      setDeletingItem(null);
      void queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  const updateParentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditParentState> }) =>
      academicApi.updateParent(id, data),
    onSuccess: () => {
      setEditingParent(null);
      void queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });

  const deleteParentMutation = useMutation({
    mutationFn: (id: string) => academicApi.deleteParent(id),
    onSuccess: () => {
      setDeletingItem(null);
      void queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });

  const title = mode === 'teachers' ? 'Docentes' : 'Padres y Tutores';
  const isLoading = mode === 'teachers' ? teachersQuery.isLoading : parentsQuery.isLoading;
  const isError = mode === 'teachers' ? teachersQuery.isError : parentsQuery.isError;
  const dataCount =
    mode === 'teachers'
      ? teachersQuery.data?.total ?? teachersQuery.data?.data?.length ?? 0
      : parentsQuery.data?.total ?? parentsQuery.data?.data?.length ?? 0;

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'teacher') {
      deleteTeacherMutation.mutate(deletingItem.id);
    } else {
      deleteParentMutation.mutate(deletingItem.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{dataCount} registros activos</p>
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

      {/* Form - Create Teacher */}
      {showForm && canManage && mode === 'teachers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Docente</h2>

          <form onSubmit={teacherForm.handleSubmit((data) => createTeacher.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Correo" error={teacherForm.formState.errors.email?.message}>
                <Input type="email" {...teacherForm.register('email')} placeholder="docente@ue.edu.bo" />
              </Field>

              <Field label="Contraseña" error={teacherForm.formState.errors.password?.message}>
                <Input type="password" {...teacherForm.register('password')} placeholder="••••••••" />
              </Field>

              <Field label="C.I." error={teacherForm.formState.errors.ci?.message}>
                <Input {...teacherForm.register('ci')} placeholder="6849204" />
              </Field>

              <Field label="Nombres" error={teacherForm.formState.errors.firstName?.message}>
                <Input {...teacherForm.register('firstName')} placeholder="Carlos" />
              </Field>

              <Field label="Apellidos" error={teacherForm.formState.errors.lastName?.message}>
                <Input {...teacherForm.register('lastName')} placeholder="Mamani Flores" />
              </Field>

              <Field label="Especialidad" error={teacherForm.formState.errors.specialty?.message}>
                <Input {...teacherForm.register('specialty')} placeholder="Matemáticas" />
              </Field>

              <Field label="Teléfono" error={teacherForm.formState.errors.phone?.message}>
                <Input {...teacherForm.register('phone')} placeholder="71234567" />
              </Field>

              <Field label="Número de Ítem" error={teacherForm.formState.errors.itemNumber?.message}>
                <Input {...teacherForm.register('itemNumber')} placeholder="IT-4029" />
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createTeacher.isPending} className="bg-slate-900 hover:bg-slate-800 text-white">
                {createTeacher.isPending ? 'Guardando...' : 'Crear Docente'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Form - Create Parent */}
      {showForm && canManage && mode === 'parents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Padre / Tutor</h2>

          <form onSubmit={parentForm.handleSubmit((data) => createParent.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Correo" error={parentForm.formState.errors.email?.message}>
                <Input type="email" {...parentForm.register('email')} placeholder="familiar@correo.com" />
              </Field>

              <Field label="Contraseña" error={parentForm.formState.errors.password?.message}>
                <Input type="password" {...parentForm.register('password')} placeholder="••••••••" />
              </Field>

              <Field label="C.I." error={parentForm.formState.errors.ci?.message}>
                <Input {...parentForm.register('ci')} placeholder="5938102" />
              </Field>

              <Field label="Nombres" error={parentForm.formState.errors.firstName?.message}>
                <Input {...parentForm.register('firstName')} placeholder="María" />
              </Field>

              <Field label="Apellidos" error={parentForm.formState.errors.lastName?.message}>
                <Input {...parentForm.register('lastName')} placeholder="Quispe Choque" />
              </Field>

              <Field label="Teléfono" error={parentForm.formState.errors.phone?.message}>
                <Input {...parentForm.register('phone')} placeholder="79876543" />
              </Field>

              <Field label="Dirección" error={parentForm.formState.errors.address?.message}>
                <Input {...parentForm.register('address')} placeholder="Av. Blanco Galindo Km 4" />
              </Field>

              <Field label="Ocupación" error={parentForm.formState.errors.occupation?.message}>
                <Input {...parentForm.register('occupation')} placeholder="Comerciante" />
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createParent.isPending} className="bg-slate-900 hover:bg-slate-800 text-white">
                {createParent.isPending ? 'Guardando...' : 'Crear Familiar'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Buscar ${mode === 'teachers' ? 'docente' : 'familiar'}...`}
          className="pl-9 h-9 text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
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
          <TeacherTable
            data={teachersQuery.data?.data ?? []}
            canManage={canManage}
            onEdit={(teacher) =>
              setEditingTeacher({
                id: teacher.id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                specialty: teacher.specialty,
                phone: teacher.phone || '',
                itemNumber: teacher.itemNumber || '',
              })
            }
            onDelete={(teacher) =>
              setDeletingItem({
                type: 'teacher',
                id: teacher.id,
                name: `${teacher.firstName} ${teacher.lastName}`,
              })
            }
          />
        ) : (
          <ParentTable
            data={parentsQuery.data?.data ?? []}
            canManage={canManage}
            onEdit={(parent) =>
              setEditingParent({
                id: parent.id,
                firstName: parent.firstName,
                lastName: parent.lastName,
                phone: parent.phone,
                address: parent.address || '',
                occupation: parent.occupation || '',
              })
            }
            onDelete={(parent) =>
              setDeletingItem({
                type: 'parent',
                id: parent.id,
                name: `${parent.firstName} ${parent.lastName}`,
              })
            }
          />
        )}
      </div>

      {/* MODAL: EDITAR DOCENTE */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Editar Docente</h3>
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTeacherMutation.mutate({
                  id: editingTeacher.id,
                  data: {
                    firstName: editingTeacher.firstName,
                    lastName: editingTeacher.lastName,
                    specialty: editingTeacher.specialty,
                    phone: editingTeacher.phone,
                    itemNumber: editingTeacher.itemNumber,
                  },
                });
              }}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombres *</label>
                  <Input
                    value={editingTeacher.firstName}
                    onChange={(e) =>
                      setEditingTeacher({ ...editingTeacher, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos *</label>
                  <Input
                    value={editingTeacher.lastName}
                    onChange={(e) =>
                      setEditingTeacher({ ...editingTeacher, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Especialidad *</label>
                <Input
                  value={editingTeacher.specialty}
                  onChange={(e) =>
                    setEditingTeacher({ ...editingTeacher, specialty: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                  <Input
                    value={editingTeacher.phone}
                    onChange={(e) =>
                      setEditingTeacher({ ...editingTeacher, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nº de Ítem</label>
                  <Input
                    value={editingTeacher.itemNumber}
                    onChange={(e) =>
                      setEditingTeacher({ ...editingTeacher, itemNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setEditingTeacher(null)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateTeacherMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {updateTeacherMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR FAMILIAR */}
      {editingParent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Editar Familiar / Tutor</h3>
              <button
                type="button"
                onClick={() => setEditingParent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateParentMutation.mutate({
                  id: editingParent.id,
                  data: {
                    firstName: editingParent.firstName,
                    lastName: editingParent.lastName,
                    phone: editingParent.phone,
                    address: editingParent.address,
                    occupation: editingParent.occupation,
                  },
                });
              }}
              className="space-y-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombres *</label>
                  <Input
                    value={editingParent.firstName}
                    onChange={(e) =>
                      setEditingParent({ ...editingParent, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos *</label>
                  <Input
                    value={editingParent.lastName}
                    onChange={(e) =>
                      setEditingParent({ ...editingParent, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono *</label>
                <Input
                  value={editingParent.phone}
                  onChange={(e) =>
                    setEditingParent({ ...editingParent, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección</label>
                  <Input
                    value={editingParent.address}
                    onChange={(e) =>
                      setEditingParent({ ...editingParent, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ocupación</label>
                  <Input
                    value={editingParent.occupation}
                    onChange={(e) =>
                      setEditingParent({ ...editingParent, occupation: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setEditingParent(null)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateParentMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {updateParentMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR BAJA LÓGICA (SOFT DELETE) */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              ¿Eliminar {deletingItem.type === 'teacher' ? 'Docente' : 'Familiar'}?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Está a punto de dar de baja a <strong className="text-slate-900">{deletingItem.name}</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-xs text-amber-800 leading-relaxed">
              <strong>Baja Lógica (Soft Delete):</strong> El registro quedará archivado y la cuenta de usuario vinculada será desactivada automáticamente, preservando la integridad del historial académico.
            </div>

            <div className="flex items-center justify-end gap-2 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingItem(null)}
                disabled={deleteTeacherMutation.isPending || deleteParentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteTeacherMutation.isPending || deleteParentMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteTeacherMutation.isPending || deleteParentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Eliminando...
                  </>
                ) : (
                  'Confirmar Eliminación'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherTable({
  data,
  canManage,
  onEdit,
  onDelete,
}: {
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    itemNumber: string | null;
    specialty: string;
    email: string;
    phone?: string | null;
  }>;
  canManage: boolean;
  onEdit: (teacher: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    phone?: string | null;
    itemNumber?: string | null;
  }) => void;
  onDelete: (teacher: { id: string; firstName: string; lastName: string }) => void;
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
            <th className="px-3 py-3">Correo</th>
            {canManage && <th className="py-3 pl-3 pr-5 text-right">Acciones</th>}
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

                <td className="px-3 py-3 font-mono text-slate-600 text-xs">
                  {item.email}
                </td>

                {canManage && (
                  <td className="py-3 pl-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar docente"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar docente (Baja lógica)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
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
  canManage,
  onEdit,
  onDelete,
}: {
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    address?: string | null;
    occupation?: string | null;
    students: Array<{ firstName: string; lastName: string }>;
  }>;
  canManage: boolean;
  onEdit: (parent: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    address?: string | null;
    occupation?: string | null;
  }) => void;
  onDelete: (parent: { id: string; firstName: string; lastName: string }) => void;
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
            <th className="px-3 py-3">Estudiantes</th>
            {canManage && <th className="py-3 pl-3 pr-5 text-right">Acciones</th>}
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

                <td className="px-3 py-3">
                  {item.students && item.students.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
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

                {canManage && (
                  <td className="py-3 pl-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar familiar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar familiar (Baja lógica)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
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
