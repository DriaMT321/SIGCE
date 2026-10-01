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
  { value: 'STUDENT', label: 'Estudiante', description: 'Consulta de notas y horario' },
  { value: 'FAMILY', label: 'Padre / Tutor', description: 'Seguimiento escolar integral' },
];

function RoleIcon({ role, className }: { role: LoginRole; className?: string }) {
  if (role === 'STUDENT') return <IconSchool className={className} />;
  if (role === 'TEACHER') return <IconChalkboard className={className} />;
  if (role === 'FAMILY') return <IconUsersGroup className={className} />;
  return <IconBriefcase2 className={className} />;
}

function getIdentifierLabel(role: LoginRole) {
  if (role === 'STUDENT') return 'Código RUDE o Cédula de Identidad';
  if (role === 'TEACHER') return 'Código, ítem o correo institucional';
  if (role === 'FAMILY') return 'Cédula de identidad del tutor (C.I.)';
  return 'Código o correo institucional';
}

function getIdentifierPlaceholder(role: LoginRole) {
  if (role === 'STUDENT') return 'Ej. 819814402020006 o 16157592';
  if (role === 'TEACHER') return 'Ej. 4258830 o docente@sigce.edu.bo';
  if (role === 'FAMILY') return 'Ej. 5489210';
  return 'admin@sigce.edu.bo';
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
    <div className="w-full max-w-4xl p-1.5 sm:p-2 rounded-[2.5rem] bg-slate-200/60 border border-slate-300/80 shadow-ambient">
      <div className="rounded-[calc(2.5rem-0.5rem)] overflow-hidden border border-slate-200/90 bg-white grid md:grid-cols-12 shadow-doppelrand-inner">
        {/* Left Column: Prestigious Institutional Brand World */}
        <div className="md:col-span-5 bg-institutional-radial p-8 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-red-950/30 shadow-inner">
          {/* Semi-transparent dark scrim for contrast and geometric hairline pattern */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          <div className="absolute inset-0 hairline-pattern opacity-10 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-amber-300 shadow-glow-amber">
                <IconSchool className="w-7 h-7 stroke-[1.75]" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white font-display leading-tight drop-shadow-xs">
                  SIGCE
                </p>
                <p className="text-[11px] text-amber-200 font-mono font-bold">
                  SIE: 81981191
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-black/35 backdrop-blur-xs text-amber-200 border border-amber-300/30">
                <IconShieldLock className="w-3.5 h-3.5 text-amber-300" />
                <span>Portal Educativo Oficial</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display leading-snug drop-shadow-sm">
                U.E. Comunidad Cristiana B
              </h2>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                Sistema integrado de control académico, registro de calificaciones y conciliación automatizada con el Sistema de Información Educativa (SIE).
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-white/15">
              <div className="flex items-center gap-2.5 text-xs text-white/90">
                <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Conformidad con Ley 070 (Avelino Siñani)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/90">
                <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Conciliación automática RPA ministerial</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/90">
                <IconCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>Gestión Escolar Vigente 2026</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/15 text-[11px] text-white/70 font-mono flex items-center justify-between">
            <span>Distrito Cochabamba 1</span>
            <span className="px-2 py-0.5 rounded bg-black/30 border border-white/10 font-bold">Turno Mañana</span>
          </div>
        </div>

        {/* Right Column: Tactile Access Console */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700 font-sans">
                Control de Autenticación
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display mt-0.5">
                Ingreso al Sistema
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Seleccione su rol institucional para ingresar con sus credenciales autorizadas.
              </p>
            </div>

            {/* Role selector tiles */}
            <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Seleccionar rol">
              {roleOptions.map((option) => {
                const isSelected = option.value === role;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onRoleChange(option.value)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 haptic-press cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-elevated ring-1 ring-amber-400/25'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <RoleIcon
                      role={option.value}
                      className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">{option.label}</p>
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
                className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-800 shadow-2xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="identifier" className="text-xs font-bold text-slate-700">
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
                    className="pl-10 h-11 border-slate-200 bg-slate-50/60 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 shadow-2xs font-medium"
                    aria-invalid={Boolean(errors.identifier)}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-[11px] text-red-600 font-semibold">{errors.identifier.message}</p>
                )}
              </div>

              {usesSecondaryIdentifier && (
                <div className="space-y-1.5">
                  <Label htmlFor="secondaryIdentifier" className="text-xs font-bold text-slate-700">
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
                      className="pl-10 h-11 border-slate-200 bg-slate-50/60 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 shadow-2xs font-medium"
                      aria-invalid={Boolean(errors.secondaryIdentifier)}
                    />
                  </div>
                  {errors.secondaryIdentifier && (
                    <p className="text-[11px] text-red-600 font-semibold">
                      {errors.secondaryIdentifier.message}
                    </p>
                  )}
                </div>
              )}

              {usesSecret && (
                <div className="space-y-1.5">
                  <Label htmlFor="secret" className="text-xs font-bold text-slate-700">
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
                      className="pl-10 h-11 border-slate-200 bg-slate-50/60 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-slate-900 shadow-2xs font-medium"
                      aria-invalid={Boolean(errors.secret)}
                    />
                  </div>
                  {errors.secret && (
                    <p className="text-[11px] text-red-600 font-semibold">{errors.secret.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Action with Button-in-Button Trailing Icon */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide rounded-xl shadow-elevated transition-all duration-200 haptic-press flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5 text-amber-400" />
                  <span>Verificando credenciales oficiales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a la Plataforma</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              U.E. Comunidad Cristiana B · Plataforma Oficial de Gestión Académica 2026
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
