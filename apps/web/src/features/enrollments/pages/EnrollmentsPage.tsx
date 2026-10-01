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

const statusConfig: Record<EnrollmentStatus, { label: string; badgeClass: string; dotClass: string }> = {
  ACTIVE: {
    label: 'Activa',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Inactiva',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  },
  TRANSFERRED: {
    label: 'Trasladada',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  GRADUATED: {
    label: 'Graduada',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    dotClass: 'bg-purple-500',
  },
  WITHDRAWN: {
    label: 'Retirada',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
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
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <ClipboardList className="w-3.5 h-3.5 text-brand-700" />
                <span>Libro de Matrículas</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {enrollments.length} Inscripciones Activas
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Gestión 2026 · Registro Oficial
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Matrículas y Asignación Escolar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Asignación oficial de estudiantes a cursos y paralelos, verificación de cupos y control del ciclo de vida de matrícula institucional.
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{showForm ? 'Cerrar Registro' : 'Registrar Matrícula'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Alta de Matrícula con Doble Bisel */}
      {showForm && canManage && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  Asiento de Matrícula Institucional
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vincule al alumno con su curso y la gestión escolar correspondiente.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                Gestión 2026
              </Badge>
            </div>

            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                  <option value="">Seleccione estudiante...</option>
                  {(studentsQuery.data?.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.firstName} {item.lastName} · {item.rude}
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Curso / Paralelo" error={form.formState.errors.courseId?.message} {...form.register('courseId')}>
                  <option value="">Seleccione curso...</option>
                  {(coursesQuery.data?.data ?? []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.shift === 'MORNING' ? 'Mañana' : 'Tarde'})
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Gestión Académica" error={form.formState.errors.academicYearId?.message} {...form.register('academicYearId')}>
                  <option value="">Seleccione gestión...</option>
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
                    <span className="text-[10px] font-normal text-rose-600">
                      {form.formState.errors.remarks.message}
                    </span>
                  )}
                </label>

                <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                  <Button
                    disabled={createMutation.isPending}
                    type="submit"
                    className="haptic-press h-10 px-5 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                  >
                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Registrar Matrícula</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buscador con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por estudiante, RUDE o curso..."
              className="w-full h-10 rounded-xl border border-slate-200/90 bg-slate-50/60 pl-9 pr-8 text-xs text-slate-900 focus:bg-white focus:outline-none transition-all"
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
          <span className="text-xs text-slate-500 font-mono">
            Mostrando <strong className="text-slate-900">{filteredEnrollments.length}</strong> matrículas
          </span>
        </div>
      </div>

      {/* Tabla de Matrículas con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl shadow-doppelrand-inner overflow-hidden">
          {enrollmentsQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-medium font-mono text-slate-600">
                Cargando libro de matrículas escolares...
              </span>
            </div>
          ) : enrollmentsQuery.isError ? (
            <div className="p-12 text-center text-xs text-rose-600">
              No se pudieron cargar las matrículas del servidor institucional.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3.5">Curso Asignado</th>
                    <th className="px-3 py-3.5">Gestión</th>
                    <th className="px-3 py-3.5">Estado</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <ClipboardList className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">No hay matrículas registradas</p>
                          <p className="text-xs text-slate-400">Verifique los filtros o registre una matrícula.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEnrollments.map((item) => {
                      const parsedStatus = statusSchema.parse(item.status);
                      const config = statusConfig[parsedStatus];
                      const initials = `${item.student.firstName[0] ?? ''}${item.student.lastName[0] ?? ''}`.toUpperCase();

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 pl-5 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 font-extrabold text-[10px] font-mono flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">
                                  {item.student.firstName} {item.student.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono leading-tight">
                                  RUDE: {item.student.rude}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200">
                              {item.course.name}
                            </span>
                          </td>

                          <td className="px-3 py-3.5 text-slate-600 font-mono text-[11px]">
                            {item.academicYear.name}
                          </td>

                          <td className="px-3 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${config.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                              {config.label}
                            </span>
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
                                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
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
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 cursor-pointer"
    >
      {children}
    </select>
    {error && <span className="text-[10px] font-normal text-rose-600">{error}</span>}
  </label>
);
