import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  Check,
  Copy,
  Loader2,
  Plus,
  Search,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
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
});

type StudentFormData = z.infer<typeof studentFormSchema>;

export const StudentsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [showForm, setShowForm] = useState(false);
  const [copiedRude, setCopiedRude] = useState<string | null>(null);

  const currentRole = authService.getCurrentUser()?.role;
  const canManage = currentRole === 'ADMIN' || currentRole === 'DIRECTOR' || currentRole === 'SECRETARY';

  const studentsQuery = useQuery({
    queryKey: ['students', search, page, pageSize],
    queryFn: () => academicApi.listStudents(search, pageSize, (page - 1) * pageSize),
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
    },
  });

  const createMutation = useMutation({
    mutationFn: academicApi.createStudent,
    onSuccess: () => {
      form.reset();
      setShowForm(false);
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
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Estudiante</h2>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
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

              <Field label="Teléfono" error={form.formState.errors.phone?.message}>
                <Input {...form.register('phone')} placeholder="Opcional" />
              </Field>

              <div className="flex items-end">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
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
                    <th className="py-3 pl-3 pr-5 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">
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

                          <td className="py-3 pl-3 pr-5 text-right">
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
