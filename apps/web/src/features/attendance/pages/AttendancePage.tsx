import { useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Search,
  UserCheck,
  Users,
  X,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
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

const statusConfig: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  PRESENT: {
    label: 'Presente',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  ABSENT: {
    label: 'Ausente',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500',
  },
  LATE: {
    label: 'Atrasado',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  JUSTIFIED: {
    label: 'Justificado',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
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
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <CalendarCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Control de Asistencia</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {records.length} Partes Registrados
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Gestión 2026 · Parte Diario Escolar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Control Diario de Asistencia Escolar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Consolidado de puntualidad, inasistencias y justificaciones por aula y turno escolar con seguimiento para padres de familia y docentes.
            </p>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{showForm ? 'Cerrar Registro' : 'Registrar Asistencia'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Tarjetas de Resumen con Doble Bisel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Partes</span>
            <p className="text-2xl font-black font-mono text-slate-950 tabular-nums">{records.length}</p>
            <p className="text-[11px] text-slate-500">Gestión en curso</p>
          </div>
        </div>

        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Presentes</span>
            <p className="text-2xl font-black font-mono text-emerald-700 tabular-nums">{presentCount}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Asistencia puntual</p>
          </div>
        </div>

        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Inasistencias</span>
            <p className="text-2xl font-black font-mono text-rose-700 tabular-nums">{absentCount}</p>
            <p className="text-[11px] text-rose-600 font-medium">Faltas no justificadas</p>
          </div>
        </div>

        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Atrasos / Justific.</span>
            <p className="text-2xl font-black font-mono text-amber-700 tabular-nums">{lateCount}</p>
            <p className="text-[11px] text-amber-600 font-medium">Licencias con respaldo</p>
          </div>
        </div>
      </div>

      {/* Formulario de Asistencia con Doble Bisel */}
      {showForm && canEdit && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  Registro de Novedad de Asistencia
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Asiente la condición de presencia del alumno en la fecha seleccionada.
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
                      {item.firstName} {item.lastName} (RUDE: {item.rude})
                    </option>
                  ))}
                </SelectField>

                <SelectField label="Curso / Paralelo" error={form.formState.errors.courseId?.message} {...form.register('courseId')}>
                  <option value="">Seleccione curso...</option>
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
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 cursor-pointer"
                  />
                </Field>

                <SelectField label="Estado de Asistencia" error={form.formState.errors.status?.message} {...form.register('status')}>
                  <option value="PRESENT">Presente</option>
                  <option value="ABSENT">Ausente</option>
                  <option value="LATE">Atrasado</option>
                  <option value="JUSTIFIED">Justificado</option>
                </SelectField>

                <div className="sm:col-span-2 lg:col-span-3">
                  <Field label="Justificación o Motivo" error={form.formState.errors.justification?.message}>
                    <input
                      {...form.register('justification')}
                      placeholder="Ej. Cita médica acreditada, permiso de tutor..."
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                    />
                  </Field>
                </div>

                <div className="flex items-end">
                  <Button
                    disabled={createMutation.isPending}
                    type="submit"
                    className="haptic-press w-full h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                  >
                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Registrar Asistencia</span>
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
              placeholder="Buscar por estudiante o curso..."
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
            Mostrando <strong className="text-slate-900">{filteredRecords.length}</strong> partes
          </span>
        </div>
      </div>

      {/* Tabla de Asistencia con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl shadow-doppelrand-inner overflow-hidden">
          {attendanceQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-medium font-mono text-slate-600">
                Cargando registros de asistencia diaria...
              </span>
            </div>
          ) : attendanceQuery.isError ? (
            <div className="p-12 text-center text-xs text-rose-600">
              No se pudieron obtener los registros de asistencia desde la base central.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Fecha</th>
                    <th className="px-3 py-3.5">Estudiante</th>
                    <th className="px-3 py-3.5">Curso / Paralelo</th>
                    <th className="px-3 py-3.5 text-center">Estado</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Observación / Justificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <Users className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">No hay partes de asistencia registrados</p>
                          <p className="text-xs text-slate-400">Verifique los filtros o registre un nuevo parte escolar.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => {
                      const config = statusConfig[record.status] ?? {
                        label: record.status,
                        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                        dotClass: 'bg-slate-400',
                      };
                      const initials = `${record.student.firstName[0] ?? ''}${record.student.lastName[0] ?? ''}`.toUpperCase();

                      return (
                        <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 pl-5 pr-3 font-mono text-slate-700">
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 font-semibold text-[11px]">
                              {new Date(record.date).toLocaleDateString('es-BO', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                              })}
                            </span>
                          </td>

                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 font-extrabold text-[10px] font-mono flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <span className="font-semibold text-slate-900">
                                {record.student.firstName} {record.student.lastName}
                              </span>
                            </div>
                          </td>

                          <td className="px-3 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                              {record.course.name}
                            </span>
                          </td>

                          <td className="px-3 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${config.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                              {config.label}
                            </span>
                          </td>

                          <td className="py-3.5 pl-3 pr-5 text-right text-slate-500 text-[11px]">
                            {record.justification ? (
                              <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                                {record.justification}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono">—</span>
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
