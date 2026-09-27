import type { FormEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import {
  IconBriefcase2,
  IconChalkboard,
  IconId,
  IconKey,
  IconSchool,
  IconUsersGroup,
  IconShieldLock,
  IconCheck,
} from '@tabler/icons-react';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LoginFormData, LoginRole } from '../schemas/auth.schema';

interface Login04FormProps {
  role: LoginRole;
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  onRoleChange: (role: LoginRole) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const roleOptions: Array<{ value: LoginRole; label: string; description: string }> = [
  { value: 'ADMINISTRATIVE', label: 'Directivo / Admin', description: 'Dirección y Secretaría' },
  { value: 'TEACHER', label: 'Docente Titular', description: 'Registro pedagógico' },
  { value: 'STUDENT', label: 'Estudiante', description: 'Consulta de notas' },
  { value: 'FAMILY', label: 'Padre / Tutor', description: 'Seguimiento escolar' },
];

function RoleIcon({ role, className }: { role: LoginRole; className?: string }) {
  if (role === 'STUDENT') return <IconSchool className={className} />;
  if (role === 'TEACHER') return <IconChalkboard className={className} />;
  if (role === 'FAMILY') return <IconUsersGroup className={className} />;
  return <IconBriefcase2 className={className} />;
}

function getIdentifierLabel(role: LoginRole) {
  if (role === 'STUDENT') return 'Código RUDE de estudiante';
  if (role === 'TEACHER') return 'Código o ítem de docente';
  if (role === 'FAMILY') return 'Cédula de identidad (C.I.)';
  return 'Código o correo institucional';
}

function getIdentifierPlaceholder(role: LoginRole) {
  if (role === 'STUDENT') return 'Ej. 81981191202401';
  if (role === 'TEACHER') return 'Ej. DOC-2967609';
  if (role === 'FAMILY') return 'Ej. 5489210';
  return 'admin@ue-comunidadcristiana.edu.bo';
}

export function Login04Form({
  role,
  register,
  errors,
  onRoleChange,
  onSubmit,
  isLoading,
  errorMessage,
}: Login04FormProps) {
  const usesSecret = role === 'TEACHER' || role === 'ADMINISTRATIVE';
  const usesSecondaryIdentifier = role === 'FAMILY';

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.04)] grid md:grid-cols-12">
      {/* Left Column: Prestigious Institutional Brand World */}
      <div className="md:col-span-5 bg-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
        {/* Subtle geometric hairline pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
              <IconSchool className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-white font-display leading-tight">
                SIGCE
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                SIE: 81981191
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <IconShieldLock className="w-3.5 h-3.5" />
              Portal Educativo Oficial
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-display leading-snug">
              U.E. Comunidad Cristiana B
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistema integral de control académico, registro de calificaciones y conciliación automatizada con el Sistema de Información Educativa (SIE).
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Conformidad con Ley 070 (Avelino Siñani)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Auditoría biométrica y trazabilidad RPA</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gestión Escolar Vigente 2026</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
          Distrito Educativo Cochabamba · Turno Mañana
        </div>
      </div>

      {/* Right Column: Tactile Access Console */}
      <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
              Control de Autenticación
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display mt-0.5">
              Ingreso al Sistema
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Seleccione su rol asignado para ingresar con sus credenciales institucionales.
            </p>
          </div>

          {/* Role selector tiles */}
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Seleccionar rol">
            {roleOptions.map((option) => {
              const isSelected = option.value === role;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRoleChange(option.value)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <RoleIcon
                    role={option.value}
                    className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight truncate">{option.label}</p>
                    <p className={`text-[10px] leading-tight mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-800"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Inputs */}
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-xs font-semibold text-slate-700">
                {getIdentifierLabel(role)}
              </Label>
              <div className="relative">
                <IconId className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  {...register('identifier')}
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder={getIdentifierPlaceholder(role)}
                  className="pl-10 h-10 border-slate-200 bg-slate-50/40 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:bg-white"
                  aria-invalid={Boolean(errors.identifier)}
                />
              </div>
              {errors.identifier && (
                <p className="text-[11px] text-red-600 font-medium">{errors.identifier.message}</p>
              )}
            </div>

            {usesSecondaryIdentifier && (
              <div className="space-y-1.5">
                <Label htmlFor="secondaryIdentifier" className="text-xs font-semibold text-slate-700">
                  Número de teléfono celular
                </Label>
                <div className="relative">
                  <IconUsersGroup className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    {...register('secondaryIdentifier')}
                    id="secondaryIdentifier"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Ej. 76401234"
                    className="pl-10 h-10 border-slate-200 bg-slate-50/40 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:bg-white"
                    aria-invalid={Boolean(errors.secondaryIdentifier)}
                  />
                </div>
                {errors.secondaryIdentifier && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {errors.secondaryIdentifier.message}
                  </p>
                )}
              </div>
            )}

            {usesSecret && (
              <div className="space-y-1.5">
                <Label htmlFor="secret" className="text-xs font-semibold text-slate-700">
                  Contraseña de acceso
                </Label>
                <div className="relative">
                  <IconKey className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    {...register('secret')}
                    id="secret"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="pl-10 h-10 border-slate-200 bg-slate-50/40 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:bg-white"
                    aria-invalid={Boolean(errors.secret)}
                  />
                </div>
                {errors.secret && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.secret.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide shadow-xs active:scale-[0.98] transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <span>Ingresar a la Plataforma</span>
                <ArrowRight className="w-4 h-4 ml-1.5 text-amber-400" />
              </>
            )}
          </Button>

          <p className="text-center text-[11px] text-slate-400">
            ¿Dudas sobre su código o acceso? Contacte a Secretaría General.
          </p>
        </form>
      </div>
    </div>
  );
}
