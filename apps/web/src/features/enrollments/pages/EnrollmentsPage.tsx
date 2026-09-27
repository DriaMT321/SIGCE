import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SelectHTMLAttributes } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ClipboardList, Loader2, Plus, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
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

const statusVariants: Record<EnrollmentStatus, 'success' | 'secondary' | 'info' | 'brand' | 'danger'> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  TRANSFERRED: 'info',
  GRADUATED: 'brand',
  WITHDRAWN: 'danger',
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
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <ClipboardList className="w-3.5 h-3.5 text-brand-700" />
              <span>Registro de Inscripciones</span>
            </span>
            <Badge variant="outline" className="font-mono">
              {enrollments.length} registradas
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Matrículas Escolares
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Asignación de estudiantes a cursos, paralelos y control del ciclo de vida de inscripción.
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
                <span>Registrar Matrícula</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Formulario de Alta de Matrícula */}
      {showForm && canManage && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Formulario de Matrícula
            </h2>
            <p className="text-xs text-slate-500">
              Vincule al alumno con su curso y la gestión escolar correspondiente.
            </p>
          </div>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                <option value="">Seleccione estudiante</option>
                {(studentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName} {item.lastName} · {item.rude}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Curso / Paralelo" error={form.formState.errors.courseId?.message} {...form.register('courseId')}>
                <option value="">Seleccione curso</option>
                {(coursesQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.shift === 'MORNING' ? 'Mañana' : 'Tarde'})
                  </option>
                ))}
              </SelectField>

              <SelectField label="Gestión Académica" error={form.formState.errors.academicYearId?.message} {...form.register('academicYearId')}>
                <option value="">Seleccione gestión</option>
                {(yearsQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectField>

              <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                <span>Observaciones</span>
                <input
                  {...form.register('remarks')}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                  placeholder="Opcional (traslado, beca, etc.)"
                />
                {form.formState.errors.remarks && (
                  <span className="text-[10px] font-normal text-red-600">
                    {form.formState.errors.remarks.message}
                  </span>
                )}
              </label>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Registrar Matrícula</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por estudiante, RUDE o curso..."
          className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-900 focus:border-slate-400 focus:outline-none shadow-2xs"
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

      {/* Tabla de Matrículas */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        {enrollmentsQuery.isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
            <span className="text-xs font-medium">Cargando matrículas escolares...</span>
          </div>
        ) : enrollmentsQuery.isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            No se pudieron cargar las matrículas del servidor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Curso Asignado</th>
                  <th className="px-3 py-3">Gestión</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Actualizar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <ClipboardList className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No hay matrículas registradas</p>
                        <p className="text-xs text-slate-400">Verifique los filtros o registre una matrícula.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((item) => {
                    const parsedStatus = statusSchema.parse(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-5 pr-3">
                          <p className="font-semibold text-slate-900 leading-tight">
                            {item.student.firstName} {item.student.lastName}
                          </p>
                          <span className="text-[11px] text-slate-500 font-mono leading-tight">
                            RUDE: {item.student.rude}
                          </span>
                        </td>

                        <td className="px-3 py-3.5">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200">
                            {item.course.name}
                          </span>
                        </td>

                        <td className="px-3 py-3.5 text-slate-600 font-mono">
                          {item.academicYear.name}
                        </td>

                        <td className="px-3 py-3.5">
                          <Badge variant={statusVariants[parsedStatus]}>
                            {statusLabels[parsedStatus]}
                          </Badge>
                        </td>

                        <td className="py-3.5 pl-3 pr-5 text-right">
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
                              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
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
  <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
    <span>{label}</span>
    <select
      {...props}
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
    >
      {children}
    </select>
    {error && <span className="text-[10px] font-normal text-red-600">{error}</span>}
  </label>
);
