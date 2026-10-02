import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SelectHTMLAttributes } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ClipboardList, Loader2, Plus, Search, X } from 'lucide-react';
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

const statusConfig: Record<EnrollmentStatus, { label: string; badgeClass: string; dotClass: string }> = {
  ACTIVE: {
    label: 'Activa',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Inactiva',
    badgeClass: 'bg-slate-100 text-slate-600',
    dotClass: 'bg-slate-400',
  },
  TRANSFERRED: {
    label: 'Trasladada',
    badgeClass: 'bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500',
  },
  GRADUATED: {
    label: 'Graduada',
    badgeClass: 'bg-purple-50 text-purple-700',
    dotClass: 'bg-purple-500',
  },
  WITHDRAWN: {
    label: 'Retirada',
    badgeClass: 'bg-rose-50 text-rose-700',
    dotClass: 'bg-rose-500',
  },
};

export function EnrollmentsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const canManage = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(authService.getCurrentUser()?.role ?? '');
  const enrollmentsQuery = useQuery({ queryKey: ['enrollments'], queryFn: () => academicApi.listEnrollments() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents(), enabled: canManage });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses(), enabled: canManage });
  const yearsQuery = useQuery({ queryKey: ['academic-years'], queryFn: academicApi.listAcademicYears, enabled: canManage });

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: { studentId: '', courseId: '', academicYearId: '', remarks: '' },
  });

  const createMutation = useMutation({
    mutationFn: academicApi.createEnrollment,
    onSuccess: () => {
      form.reset();
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnrollmentStatus }) =>
      academicApi.updateEnrollment(id, { status }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['enrollments'] }),
  });

  const enrollments = enrollmentsQuery.data?.data ?? [];
  const filteredEnrollments = enrollments.filter((item) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      item.student.firstName.toLowerCase().includes(term) ||
      item.student.lastName.toLowerCase().includes(term) ||
      item.student.rude.includes(term) ||
      item.course.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Matrículas</h1>
          <p className="text-sm text-slate-500 mt-0.5">{enrollments.length} inscripciones</p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cerrar' : 'Registrar Matrícula'}
          </button>
        )}
      </div>

      {/* Form - Simplified */}
      {showForm && canManage && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Matrícula</h2>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                <option value="">Seleccione...</option>
                {(studentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName} {item.lastName}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Curso" error={form.formState.errors.courseId?.message} {...form.register('courseId')}>
                <option value="">Seleccione...</option>
                {(coursesQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </SelectField>

              <SelectField label="Gestión" error={form.formState.errors.academicYearId?.message} {...form.register('academicYearId')}>
                <option value="">Seleccione...</option>
                {(yearsQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </SelectField>

              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                <span>Observaciones</span>
                <input
                  {...form.register('remarks')}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Opcional"
                />
              </label>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2"
                >
                  {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search - Single row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por estudiante, RUDE o curso..."
            className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
        <span className="text-sm text-slate-500">
          {filteredEnrollments.length} matrículas
        </span>
      </div>

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {enrollmentsQuery.isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando matrículas...</span>
          </div>
        ) : enrollmentsQuery.isError ? (
          <div className="p-12 text-center text-sm text-rose-600">
            No se pudieron cargar las matrículas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Curso</th>
                  <th className="px-3 py-3">Gestión</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Actualizar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-700">No hay matrículas</p>
                        <p className="text-sm text-slate-400">Registre una nueva matrícula.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((item) => {
                    const parsedStatus = statusSchema.parse(item.status);
                    const config = statusConfig[parsedStatus];
                    const initials = `${item.student.firstName[0] ?? ''}${item.student.lastName[0] ?? ''}`.toUpperCase();

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {item.student.firstName} {item.student.lastName}
                              </p>
                              <span className="text-xs text-slate-400 font-mono">
                                RUDE: {item.student.rude}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {item.course.name}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-slate-600 font-mono text-xs">
                          {item.academicYear.name}
                        </td>

                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                            {config.label}
                          </span>
                        </td>

                        <td className="py-3 pl-3 pr-5 text-right">
                          {canManage && (
                            <select
                              defaultValue={item.status}
                              disabled={updateMutation.isPending}
                              onChange={(event) =>
                                updateMutation.mutate({
                                  id: item.id,
                                  status: statusSchema.parse(event.target.value),
                                })
                              }
                              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            >
                              <option value="ACTIVE">Activa</option>
                              <option value="INACTIVE">Inactiva</option>
                              <option value="TRANSFERRED">Trasladada</option>
                              <option value="GRADUATED">Graduada</option>
                              <option value="WITHDRAWN">Retirada</option>
                            </select>
                          )}
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
  );
}

const SelectField = ({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => (
  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
    <span>{label}</span>
    <select
      {...props}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      {children}
    </select>
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>
);
