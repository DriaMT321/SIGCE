import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  CalendarCheck,
  Loader2,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
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

const statusConfig: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  PRESENT: {
    label: 'Presente',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  ABSENT: {
    label: 'Ausente',
    badgeClass: 'bg-rose-50 text-rose-700',
    dotClass: 'bg-rose-500',
  },
  LATE: {
    label: 'Atrasado',
    badgeClass: 'bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-500',
  },
  JUSTIFIED: {
    label: 'Justificado',
    badgeClass: 'bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500',
  },
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
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asistencia</h1>
          <p className="text-sm text-slate-500 mt-0.5">{records.length} partes registrados</p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cerrar' : 'Registrar Asistencia'}
          </button>
        )}
      </div>

      {/* Summary Cards - Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Partes', value: records.length, color: 'text-slate-900' },
          { label: 'Presentes', value: presentCount, color: 'text-emerald-600' },
          { label: 'Inasistencias', value: absentCount, color: 'text-rose-600' },
          { label: 'Atrasos/Justif.', value: lateCount, color: 'text-amber-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</span>
            <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Form - Simplified */}
      {showForm && canEdit && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Asistencia</h2>

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

              <Field label="Fecha" error={form.formState.errors.date?.message}>
                <input
                  type="date"
                  {...form.register('date')}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </Field>

              <SelectField label="Estado" error={form.formState.errors.status?.message} {...form.register('status')}>
                <option value="PRESENT">Presente</option>
                <option value="ABSENT">Ausente</option>
                <option value="LATE">Atrasado</option>
                <option value="JUSTIFIED">Justificado</option>
              </SelectField>

              <div className="sm:col-span-2 lg:col-span-3">
                <Field label="Justificación">
                  <input
                    {...form.register('justification')}
                    placeholder="Ej. Cita médica, permiso de tutor..."
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </Field>
              </div>

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
            placeholder="Buscar por estudiante o curso..."
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
          {filteredRecords.length} partes
        </span>
      </div>

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {attendanceQuery.isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando asistencia...</span>
          </div>
        ) : attendanceQuery.isError ? (
          <div className="p-12 text-center text-sm text-rose-600">
            No se pudieron cargar los registros.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="py-3 pl-5 pr-3">Fecha</th>
                  <th className="px-3 py-3">Estudiante</th>
                  <th className="px-3 py-3">Curso</th>
                  <th className="px-3 py-3 text-center">Estado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-700">No hay registros</p>
                        <p className="text-sm text-slate-400">Registre un nuevo parte de asistencia.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => {
                    const config = statusConfig[record.status] ?? {
                      label: record.status,
                      badgeClass: 'bg-slate-100 text-slate-600',
                      dotClass: 'bg-slate-400',
                    };
                    const initials = `${record.student.firstName[0] ?? ''}${record.student.lastName[0] ?? ''}`.toUpperCase();

                    return (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-5 pr-3 font-mono text-slate-700">
                          {new Date(record.date).toLocaleDateString('es-BO', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                          })}
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                            <span className="font-medium text-slate-900">
                              {record.student.firstName} {record.student.lastName}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {record.course.name}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                            {config.label}
                          </span>
                        </td>

                        <td className="py-3 pl-3 pr-5 text-right text-slate-500 text-xs">
                          {record.justification || <span className="text-slate-300">—</span>}
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
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
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
