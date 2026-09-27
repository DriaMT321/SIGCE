import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { CalendarCheck, Loader2, Plus, Search, UserCheck, Users, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const attendanceFormSchema = z.object({
  studentId: z.string().uuid('Selecciona un estudiante'),
  courseId: z.string().uuid('Selecciona un curso'),
  date: z.string().min(1, 'Selecciona una fecha'),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED']),
  justification: z.string().optional(),
});
type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

const statusConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' }> = {
  PRESENT: { label: 'Presente', variant: 'success' },
  ABSENT: { label: 'Ausente', variant: 'danger' },
  LATE: { label: 'Atrasado', variant: 'warning' },
  JUSTIFIED: { label: 'Justificado', variant: 'info' },
};

export const AttendancePage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const canEdit = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(authService.getCurrentUser()?.role ?? '');
  const attendanceQuery = useQuery({ queryKey: ['attendance'], queryFn: () => academicApi.listAttendance() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses() });

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'PRESENT',
      justification: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: academicApi.createAttendance,
    onSuccess: () => {
      form.reset({
        studentId: '',
        courseId: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'PRESENT',
        justification: '',
      });
      setShowForm(false);
      void queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  const records = attendanceQuery.data?.data ?? [];
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE' || r.status === 'JUSTIFIED').length;

  const filteredRecords = records.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.student.firstName.toLowerCase().includes(term) ||
      r.student.lastName.toLowerCase().includes(term) ||
      r.course.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <CalendarCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>Control de Asistencia</span>
            </span>
            <Badge variant="outline" className="font-mono">
              {records.length} partes registrados
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Control de Asistencia Escolar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Registro diario de puntualidad, atrasos, faltas y justificaciones por paralelo.
          </p>
        </div>

        {canEdit && (
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
                <span>Registrar Asistencia</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tarjetas de Resumen de Asistencia */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Partes</span>
          <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{records.length}</p>
          <p className="text-[11px] text-slate-500">Gestión en curso</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Presentes</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">{presentCount}</p>
          <p className="text-[11px] text-emerald-600">Asistencia puntual</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Inasistencias</span>
          <p className="text-2xl font-bold font-mono text-rose-700 tabular-nums">{absentCount}</p>
          <p className="text-[11px] text-rose-600">Faltas no justificadas</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Atrasos / Justific.</span>
          <p className="text-2xl font-bold font-mono text-amber-700 tabular-nums">{lateCount}</p>
          <p className="text-[11px] text-amber-600">Permisos y licencias</p>
        </div>
      </div>

      {/* Formulario de Asistencia */}
      {showForm && canEdit && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Registro de Novedad de Asistencia
            </h2>
            <p className="text-xs text-slate-500">
              Asiente la condición de presencia del alumno en la fecha seleccionada.
            </p>
          </div>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                <option value="">Seleccione estudiante</option>
                {(studentsQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.firstName} {item.lastName}
                  </option>
                ))}
              </SelectField>

              <SelectField label="Curso / Paralelo" error={form.formState.errors.courseId?.message} {...form.register('courseId')}>
                <option value="">Seleccione curso</option>
                {(coursesQuery.data?.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </SelectField>

              <Field label="Fecha del Registro" error={form.formState.errors.date?.message}>
                <input
                  type="date"
                  {...form.register('date')}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                />
              </Field>

              <SelectField label="Estado de Asistencia" error={form.formState.errors.status?.message} {...form.register('status')}>
                <option value="PRESENT">Presente</option>
                <option value="ABSENT">Ausente</option>
                <option value="LATE">Atrasado</option>
                <option value="JUSTIFIED">Justificado</option>
              </SelectField>

              <Field label="Justificación o Motivo" error={form.formState.errors.justification?.message}>
                <input
                  {...form.register('justification')}
                  placeholder="Ej. Cita médica, licencia de tutor..."
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 sm:col-span-2 lg:col-span-3"
                />
              </Field>

              <div className="flex items-end">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="w-full h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Registrar Asistencia</span>
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
          placeholder="Buscar por estudiante o curso..."
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

      {/* Tabla de Asistencia */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        {attendanceQuery.isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
            <span className="text-xs font-medium">Cargando registros de asistencia...</span>
          </div>
        ) : attendanceQuery.isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            No se pudieron obtener los registros de asistencia.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 pl-5 pr-3">Fecha</th>
                  <th className="px-3 py-3">Estudiante</th>
                  <th className="px-3 py-3">Curso / Paralelo</th>
                  <th className="px-3 py-3 text-center">Estado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Observación / Justificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No hay partes de asistencia</p>
                        <p className="text-xs text-slate-400">Verifique los filtros o registre una asistencia.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => {
                    const config = statusConfig[record.status] ?? { label: record.status, variant: 'secondary' as const };
                    const initials = `${record.student.firstName[0] ?? ''}${record.student.lastName[0] ?? ''}`.toUpperCase();

                    return (
                      <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-5 pr-3 font-mono text-slate-700">
                          {new Date(record.date).toLocaleDateString('es-BO', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                          })}
                        </td>

                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] font-mono flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <span className="font-semibold text-slate-900">
                              {record.student.firstName} {record.student.lastName}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3.5">
                          <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                            {record.course.name}
                          </span>
                        </td>

                        <td className="px-3 py-3.5 text-center">
                          <Badge variant={config.variant} className="text-[10px]">
                            {config.label}
                          </Badge>
                        </td>

                        <td className="py-3.5 pl-3 pr-5 text-right text-slate-500 text-[11px]">
                          {record.justification ? (
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              <UserCheck className="w-3 h-3 text-slate-400" />
                              {record.justification}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
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
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-[10px] font-normal text-red-600">{error}</span>}
    </label>
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
