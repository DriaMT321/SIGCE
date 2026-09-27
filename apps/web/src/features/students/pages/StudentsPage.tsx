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
  const [showForm, setShowForm] = useState(false);
  const [copiedRude, setCopiedRude] = useState<string | null>(null);

  const currentRole = authService.getCurrentUser()?.role;
  const canManage = currentRole === 'ADMIN' || currentRole === 'DIRECTOR' || currentRole === 'SECRETARY';

  const studentsQuery = useQuery({
    queryKey: ['students', search],
    queryFn: () => academicApi.listStudents(search),
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

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <Users className="w-3.5 h-3.5 text-brand-700" />
              <span>Padrón Estudiantil</span>
            </span>
            <Badge variant="outline" className="font-mono">
              {totalCount} registrados
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Directorio de Estudiantes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Gestión de datos de filiación, registro único de estudiante (RUDE) y estado de matrícula.
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
                <span>Nuevo Estudiante</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Formulario de Registro Estudiantil */}
      {showForm && canManage && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Ficha de Inscripción y Filiación Estudiantil
            </h2>
            <p className="text-xs text-slate-500">
              Complete los datos obligatorios según el certificado de nacimiento o cédula de identidad.
            </p>
          </div>

          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Código RUDE" error={form.formState.errors.rude?.message}>
                <Input {...form.register('rude')} placeholder="819811912026..." className="font-mono text-xs" />
              </Field>

              <Field label="Cédula de Identidad (C.I.)" error={form.formState.errors.ci?.message}>
                <Input {...form.register('ci')} placeholder="Ej. 12345678" className="font-mono text-xs" />
              </Field>

              <Field label="Nombres" error={form.formState.errors.firstName?.message}>
                <Input {...form.register('firstName')} placeholder="Nombres del alumno" className="text-xs" />
              </Field>

              <Field label="Apellidos" error={form.formState.errors.lastName?.message}>
                <Input {...form.register('lastName')} placeholder="Apellidos paterno y materno" className="text-xs" />
              </Field>

              <Field label="Fecha de Nacimiento" error={form.formState.errors.birthDate?.message}>
                <Input type="date" {...form.register('birthDate')} className="text-xs" />
              </Field>

              <Field label="Género" error={form.formState.errors.gender?.message}>
                <select
                  {...form.register('gender')}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                </select>
              </Field>

              <Field label="Teléfono de Contacto" error={form.formState.errors.phone?.message}>
                <Input {...form.register('phone')} placeholder="Opcional" className="text-xs" />
              </Field>

              <div className="flex items-end">
                <Button
                  disabled={createMutation.isPending}
                  type="submit"
                  className="w-full h-10 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar Estudiante</span>
                </Button>
              </div>
            </div>

            {createMutation.isError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No se pudo registrar el estudiante. Verifique que el RUDE o C.I. no estén duplicados.</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Barra de Búsqueda */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, RUDE o cédula..."
          className="pl-9 h-10 text-xs bg-white"
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

      {/* Tabla de Estudiantes */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        {studentsQuery.isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
            <span className="text-xs font-medium">Cargando directorio de estudiantes...</span>
          </div>
        ) : studentsQuery.isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            No se pudo conectar con el servidor para cargar los estudiantes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Código RUDE</th>
                  <th className="px-3 py-3">Cédula de Identidad</th>
                  <th className="px-3 py-3">Curso Matriculado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <GraduationCap className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No se encontraron estudiantes</p>
                        <p className="text-xs text-slate-400">Intente con otro término de búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const initials = `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase();
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 leading-tight">
                                {student.firstName} {student.lastName}
                              </p>
                              <span className="text-[10px] text-slate-400 leading-tight">
                                {student.gender === 'MALE' ? 'Varón' : 'Mujer'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3.5 font-mono text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <span>{student.rude}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyRude(student.rude)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              title="Copiar RUDE"
                            >
                              {copiedRude === student.rude ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="px-3 py-3.5 font-mono text-slate-600">
                          {student.ci}
                        </td>

                        <td className="px-3 py-3.5">
                          {student.enrollments?.[0]?.course ? (
                            <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                              {student.enrollments[0].course.name}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Sin matrícula activa
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 pl-3 pr-5 text-right">
                          <Badge variant={student.isActive ? 'success' : 'secondary'} className="font-mono text-[10px]">
                            {student.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
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
