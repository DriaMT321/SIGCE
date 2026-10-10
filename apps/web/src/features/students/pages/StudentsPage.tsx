import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  Loader2,
  Plus,
  Search,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const studentFormSchema = z.object({
  rude: z.string().min(1, 'El código RUDE es obligatorio'),
  ci: z.string().min(1, 'La cédula de identidad es obligatoria'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  gender: z.enum(['MALE', 'FEMALE']),
  phone: z.string().optional(),
  parentId: z.string().optional(),
  relationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'TUTOR', 'OTHER']).optional(),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

export const StudentsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [showForm, setShowForm] = useState(false);
  const [copiedRude, setCopiedRude] = useState<string | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<{ id: string; name: string } | null>(null);

  const currentRole = authService.getCurrentUser()?.role;
  const canManage = currentRole === 'ADMIN' || currentRole === 'DIRECTOR' || currentRole === 'SECRETARY';

  const studentsQuery = useQuery({
    queryKey: ['students', search, page, pageSize],
    queryFn: () => academicApi.listStudents(search, pageSize, (page - 1) * pageSize),
  });

  const parentsQuery = useQuery({
    queryKey: ['parents', 'lookup-options'],
    queryFn: () => academicApi.listParents(undefined, 300),
    enabled: canManage,
  });

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      rude: '',
      ci: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'MALE',
      phone: '',
      parentId: '',
      relationship: 'TUTOR',
    },
  });

  const createMutation = useMutation({
    mutationFn: academicApi.createStudent,
    onSuccess: () => {
      form.reset();
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['students'] });
      void queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academicApi.deleteStudent(id),
    onSuccess: () => {
      setDeletingStudent(null);
      void queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleCopyRude = (rude: string) => {
    navigator.clipboard.writeText(rude);
    setCopiedRude(rude);
    setTimeout(() => setCopiedRude(null), 2000);
  };

  const students = studentsQuery.data?.data ?? [];
  const totalCount = studentsQuery.data?.total ?? students.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-5">
      {/* Header - Clean and minimal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Estudiantes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalCount} registrados</p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cerrar' : 'Nuevo Estudiante'}
          </button>
        )}
      </div>

      {/* Form - Simplified */}
      {showForm && canManage && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Registrar Estudiante</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete los datos del alumno y, opcionalmente, vincúlelo a un familiar o tutor registrado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              title="Cerrar formulario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={form.handleSubmit((data) => {
              const payload = {
                ...data,
                parentId: data.parentId && data.parentId.trim() !== '' ? data.parentId : undefined,
                relationship: data.parentId && data.parentId.trim() !== '' ? data.relationship || 'TUTOR' : undefined,
              };
              createMutation.mutate(payload);
            })}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Código RUDE" error={form.formState.errors.rude?.message}>
                <Input {...form.register('rude')} placeholder="819811912026..." className="font-mono text-sm" />
              </Field>

              <Field label="C.I." error={form.formState.errors.ci?.message}>
                <Input {...form.register('ci')} placeholder="12345678" className="font-mono text-sm" />
              </Field>

              <Field label="Nombres" error={form.formState.errors.firstName?.message}>
                <Input {...form.register('firstName')} placeholder="Nombres del alumno" />
              </Field>

              <Field label="Apellidos" error={form.formState.errors.lastName?.message}>
                <Input {...form.register('lastName')} placeholder="Apellidos" />
              </Field>

              <Field label="Fecha de Nacimiento" error={form.formState.errors.birthDate?.message}>
                <Input type="date" {...form.register('birthDate')} />
              </Field>

              <Field label="Género" error={form.formState.errors.gender?.message}>
                <select
                  {...form.register('gender')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                </select>
              </Field>

              <Field label="Teléfono de Contacto" error={form.formState.errors.phone?.message}>
                <Input {...form.register('phone')} placeholder="Opcional" />
              </Field>
            </div>

            {/* Parent Association Section */}
            <div className="pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      Emparentar con Familiar / Tutor
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                      Opcional
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {parentsQuery.isLoading ? 'Cargando familiares...' : `${parentsQuery.data?.data?.length ?? 0} familiares disponibles`}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Field label="Familiar / Tutor Registrado" error={form.formState.errors.parentId?.message}>
                    <select
                      {...form.register('parentId')}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      <option value="">-- Sin vincular (registrar sin familiar por ahora) --</option>
                      {(parentsQuery.data?.data ?? []).map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.lastName} {parent.firstName} — C.I.: {parent.ci} {parent.phone ? `(${parent.phone})` : ''}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Parentesco con el Estudiante" error={form.formState.errors.relationship?.message}>
                    <select
                      {...form.register('relationship')}
                      disabled={!form.watch('parentId')}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="TUTOR">Tutor / Apoderado General</option>
                      <option value="PADRE">Padre</option>
                      <option value="MADRE">Madre</option>
                      <option value="GUARDIAN">Tutor Legal / Apoderado</option>
                      <option value="OTHER">Otro Familiar</option>
                    </select>
                  </Field>
                </div>

                <p className="text-xs text-slate-500">
                  Al asociar un familiar, este podrá consultar en tiempo real las calificaciones, el horario y la asistencia de su hijo desde su cuenta de familiar.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="h-10 text-sm"
              >
                Cancelar
              </Button>
              <Button
                disabled={createMutation.isPending}
                type="submit"
                className="h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2 px-6"
              >
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar Estudiante
              </Button>
            </div>

            {createMutation.isError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No se pudo registrar. Verifique que el RUDE o C.I. no existan.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Search and Filters - Single row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, RUDE o cédula..."
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

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Mostrar:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={1000}>Todos</option>
          </select>
        </div>
      </div>

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {studentsQuery.isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando estudiantes...</span>
          </div>
        ) : studentsQuery.isError ? (
          <div className="p-12 text-center text-sm text-rose-600">
            No se pudo conectar con el servidor.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    <th className="py-3 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3">RUDE</th>
                    <th className="px-3 py-3">C.I.</th>
                    <th className="px-3 py-3">Curso</th>
                    <th className="px-3 py-3">Familiar / Tutor</th>
                    <th className="px-3 py-3">Estado</th>
                    {canManage && <th className="py-3 pl-3 pr-5 text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="font-medium text-slate-700">No se encontraron estudiantes</p>
                          <p className="text-sm text-slate-400">Intente con otros términos de búsqueda.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => {
                      const initials = `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase();
                      return (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs">
                                {initials}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {student.firstName} {student.lastName}
                                </p>
                                <span className="text-xs text-slate-400">
                                  {student.gender === 'MALE' ? 'Varón' : 'Mujer'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-mono text-slate-700">{student.rude}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyRude(student.rude)}
                                className="text-slate-400 hover:text-slate-600"
                                title="Copiar RUDE"
                              >
                                {copiedRude === student.rude ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-3 font-mono text-slate-600">
                            {student.ci}
                          </td>

                          <td className="px-3 py-3">
                            {student.enrollments?.[0]?.course ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                {student.enrollments[0].course.name}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Sin matrícula</span>
                            )}
                          </td>

                          <td className="px-3 py-3">
                            {student.parents && student.parents.length > 0 ? (
                              <div>
                                <p className="font-medium text-slate-800 text-xs">
                                  {student.parents[0].parent.lastName} {student.parents[0].parent.firstName}
                                </p>
                                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                  {student.parents[0].relationship === 'FATHER' || student.parents[0].relationship === 'PADRE'
                                    ? 'Padre'
                                    : student.parents[0].relationship === 'MOTHER' || student.parents[0].relationship === 'MADRE'
                                    ? 'Madre'
                                    : student.parents[0].relationship === 'GUARDIAN'
                                    ? 'Apoderado'
                                    : student.parents[0].relationship === 'TUTOR'
                                    ? 'Tutor'
                                    : 'Familiar'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Sin vincular</span>
                            )}
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                student.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${student.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              {student.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                          {canManage && (
                            <td className="py-3 pl-3 pr-5 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setDeletingStudent({
                                    id: student.id,
                                    name: `${student.firstName} ${student.lastName}`,
                                  })
                                }
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar estudiante (Baja lógica)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 text-sm">
              <span className="text-slate-500">
                Mostrando <strong className="text-slate-900">{totalCount === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)}</strong> de <strong className="text-slate-900">{totalCount}</strong>
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm font-mono font-medium text-slate-700">
                    {page} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium disabled:opacity-40 hover:bg-slate-50"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL: CONFIRMAR BAJA LÓGICA (SOFT DELETE) */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              ¿Eliminar Estudiante?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Está a punto de dar de baja al estudiante <strong className="text-slate-900">{deletingStudent.name}</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-xs text-amber-800 leading-relaxed">
              <strong>Baja Lógica (Soft Delete):</strong> El registro quedará archivado y la cuenta de usuario vinculada será desactivada automáticamente, garantizando la preservación del historial de calificaciones y asistencias.
            </div>

            <div className="flex items-center justify-end gap-2 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingStudent(null)}
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => deleteMutation.mutate(deletingStudent.id)}
                disabled={deleteMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteMutation.isPending ? (
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
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}
