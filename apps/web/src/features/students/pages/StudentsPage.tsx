import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  Check,
  Copy,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
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
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <Users className="w-3.5 h-3.5 text-brand-700" />
                <span>Padrón Estudiantil</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {totalCount} Registrados
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Gestión 2026 · SIE 81981191
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Directorio General de Estudiantes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Consolidado de filiación oficial, registros únicos RUDE y estado de matrícula por aula para la gestión académica en curso.
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{showForm ? 'Cerrar Ficha' : 'Nuevo Estudiante'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Registro Estudiantil con Doble Bisel */}
      {showForm && canManage && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600" />
                  Ficha de Inscripción y Filiación Estudiantil
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete los datos de identidad según el certificado de nacimiento o cédula de identidad del Estado Plurinacional.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                Ley 070 Avelino Siñani
              </Badge>
            </div>

            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Código RUDE" error={form.formState.errors.rude?.message}>
                  <Input {...form.register('rude')} placeholder="819811912026..." className="font-mono text-xs rounded-xl" />
                </Field>

                <Field label="Cédula de Identidad (C.I.)" error={form.formState.errors.ci?.message}>
                  <Input {...form.register('ci')} placeholder="Ej. 12345678" className="font-mono text-xs rounded-xl" />
                </Field>

                <Field label="Nombres" error={form.formState.errors.firstName?.message}>
                  <Input {...form.register('firstName')} placeholder="Nombres del alumno" className="text-xs rounded-xl" />
                </Field>

                <Field label="Apellidos" error={form.formState.errors.lastName?.message}>
                  <Input {...form.register('lastName')} placeholder="Apellidos paterno y materno" className="text-xs rounded-xl" />
                </Field>

                <Field label="Fecha de Nacimiento" error={form.formState.errors.birthDate?.message}>
                  <Input type="date" {...form.register('birthDate')} className="text-xs rounded-xl" />
                </Field>

                <Field label="Género" error={form.formState.errors.gender?.message}>
                  <select
                    {...form.register('gender')}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 cursor-pointer"
                  >
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                  </select>
                </Field>

                <Field label="Teléfono de Contacto" error={form.formState.errors.phone?.message}>
                  <Input {...form.register('phone')} placeholder="Opcional" className="text-xs rounded-xl" />
                </Field>

                <div className="flex items-end">
                  <Button
                    disabled={createMutation.isPending}
                    type="submit"
                    className="haptic-press w-full h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                  >
                    {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Guardar Estudiante</span>
                  </Button>
                </div>
              </div>

              {createMutation.isError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>No se pudo registrar el estudiante. Verifique que el RUDE o C.I. no estén previamente asentados.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nombre, RUDE o cédula..."
              className="pl-9 pr-9 h-10 text-xs bg-slate-50/60 border-slate-200/90 rounded-xl focus:bg-white transition-all"
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

          <div className="flex items-center justify-end gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium text-slate-500">Filas:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-transparent font-mono font-bold text-slate-800 cursor-pointer focus:outline-none"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={1000}>Todos ({totalCount})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Estudiantes con Doble Bisel Concéntrico */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl shadow-doppelrand-inner overflow-hidden">
          {studentsQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-medium font-mono text-slate-600">
                Sincronizando nómina de estudiantes desde base institucional...
              </span>
            </div>
          ) : studentsQuery.isError ? (
            <div className="p-12 text-center text-xs text-rose-600">
              No se pudo conectar con el servidor institucional para cargar los estudiantes.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3.5">Código RUDE</th>
                    <th className="px-3 py-3.5">Cédula de Identidad</th>
                    <th className="px-3 py-3.5">Curso Matriculado</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">No se encontraron estudiantes</p>
                          <p className="text-xs text-slate-400">Intente modificando los parámetros de búsqueda.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => {
                      const initials = `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase();
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0 shadow-xs">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">
                                  {student.firstName} {student.lastName}
                                </p>
                                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                                  {student.gender === 'MALE' ? 'Varón' : 'Mujer'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3.5 font-mono text-slate-700">
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                              <span className="font-semibold text-slate-800">{student.rude}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyRude(student.rude)}
                                className="haptic-press text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                                title="Copiar RUDE"
                              >
                                {copiedRude === student.rude ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-3.5 font-mono text-slate-600">
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 font-semibold border border-slate-200/60">
                              {student.ci}
                            </span>
                          </td>

                          <td className="px-3 py-3.5">
                            {student.enrollments?.[0]?.course ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200/80 text-[11px] font-semibold">
                                {student.enrollments[0].course.name}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Sin matrícula activa
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 pl-3 pr-5 text-right">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                student.isActive
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  student.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                              />
                              {student.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Controles de Paginación */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/90 text-xs">
                <div className="text-slate-500">
                  Mostrando{' '}
                  <strong className="text-slate-900 font-mono">
                    {totalCount === 0 ? 0 : (page - 1) * pageSize + 1} -{' '}
                    {Math.min(page * pageSize, totalCount)}
                  </strong>{' '}
                  de <strong className="text-slate-900 font-mono">{totalCount}</strong> estudiantes registrados
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="haptic-press inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 shadow-xs cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>

                    <div className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-semibold text-slate-800 shadow-xs">
                      {page} / {totalPages}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="haptic-press inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 shadow-xs cursor-pointer"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
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
