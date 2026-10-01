import type { FormEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import {
  IconBriefcase2,
  IconChalkboard,
  IconId,
  IconKey,
  IconSchool,
  IconUsersGroup,
  IconShieldCheck,
  IconSparkles,
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

const roleOptions: Array<{ value: LoginRole; label: string; subtitle: string }> = [
  { value: 'ADMINISTRATIVE', label: 'Directivo', subtitle: 'Gestión y Control' },
  { value: 'TEACHER', label: 'Docente', subtitle: 'Aula y Registro' },
  { value: 'STUDENT', label: 'Estudiante', subtitle: 'Notas y Horario' },
  { value: 'FAMILY', label: 'Familia', subtitle: 'Seguimiento Tutor' },
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
    <div className="w-full max-w-4xl p-1.5 sm:p-2 rounded-[2.5rem] bg-slate-200/70 border border-slate-300/80 shadow-ambient">
      <div className="rounded-[calc(2.5rem-0.5rem)] overflow-hidden border border-slate-200/90 bg-white grid md:grid-cols-12 shadow-doppelrand-inner">
        {/* Left Column: Rebranded Executive Obsidian World */}
        <div className="md:col-span-5 bg-[#090d16] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
          {/* Subtle Ambient Radial Light Glows (Crimson & Amber without muddy orange) */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-brand-700/25 blur-3xl rounded-full" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/15 blur-3xl rounded-full" />
          <div className="pointer-events-none absolute inset-0 hairline-pattern opacity-10" />

          {/* Top Brand Identity */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-glow-amber shrink-0">
                <IconSparkles className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white font-display leading-tight">
                  SIGCE
                </h1>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Sistema de Gestión y Control Educativo
                </p>
              </div>
            </div>

            {/* Central Statement */}
            <div className="pt-6 sm:pt-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-amber-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Gestión Escolar 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display leading-snug">
                Excelencia, innovación y control en cada aula.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs">
                Plataforma unificada para el seguimiento pedagógico, evaluación académica y comunicación fluida en toda la comunidad escolar.
              </p>
            </div>
          </div>

          {/* Bottom Minimalist Footer */}
          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-sans">
            <span className="font-semibold text-slate-300">U.E. Comunidad Cristiana B</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
              <IconShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conexión Segura</span>
            </span>
          </div>
        </div>

        {/* Right Column: Tactile Access Console */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans">
                Acceso Institucional
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display mt-0.5">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Selecciona tu perfil para ingresar con tus credenciales asignadas.
              </p>
            </div>

            {/* Compact Rebranded Role Selector Tiles */}
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Seleccionar rol">
              {roleOptions.map((option) => {
                const isSelected = option.value === role;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onRoleChange(option.value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 haptic-press cursor-pointer ${
                      isSelected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-elevated ring-1 ring-amber-400/30'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-amber-400' : 'bg-white text-slate-600 border border-slate-200/80'
                      }`}
                    >
                      <RoleIcon role={option.value} className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">{option.label}</p>
                      <p className={`text-[10px] leading-tight mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {option.subtitle}
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
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-800 shadow-2xs animate-in fade-in"
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
              className="w-full h-12 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs tracking-wide rounded-xl shadow-elevated transition-all duration-200 haptic-press flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5 text-amber-400" />
                  <span>Verificando credenciales...</span>
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

            <p className="text-center text-[10px] text-slate-400 font-medium">
              Plataforma Institucional SIGCE · Conexión Cifrada SSL
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
