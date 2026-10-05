import type { FormEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import {
  IconBriefcase2,
  IconChalkboard,
  IconId,
  IconKey,
  IconSchool,
  IconUsersGroup,
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
  { value: 'ADMINISTRATIVE', label: 'Directivo', subtitle: 'Dirección y Control' },
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
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Form Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
          Ingreso al Sistema
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Selecciona tu perfil institucional para ingresar con tus credenciales asignadas.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Selector de Roles con Diseño Táctil y Colores Institucionales */}
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
                    ? 'border-slate-950 bg-slate-950 text-white shadow-elevated ring-2 ring-[#f37022]/40'
                    : 'border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/90 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#ffc54c] to-[#f37022] text-slate-950 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <RoleIcon role={option.value} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight truncate">{option.label}</p>
                  <p
                    className={`text-[10px] leading-tight mt-0.5 truncate ${
                      isSelected ? 'text-amber-200/90' : 'text-slate-400'
                    }`}
                  >
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
            className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-800 shadow-2xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
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
                className="pl-10 h-12 border-slate-200 bg-slate-50/70 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#b91329] focus-visible:border-[#b91329] shadow-2xs font-medium transition-all"
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
                  className="pl-10 h-12 border-slate-200 bg-slate-50/70 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#b91329] focus-visible:border-[#b91329] shadow-2xs font-medium transition-all"
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
                  className="pl-10 h-12 border-slate-200 bg-slate-50/70 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#b91329] focus-visible:border-[#b91329] shadow-2xs font-medium transition-all"
                  aria-invalid={Boolean(errors.secret)}
                />
              </div>
              {errors.secret && (
                <p className="text-[11px] text-red-600 font-semibold">{errors.secret.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Action con Botón de Alto Perfil */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-elevated transition-all duration-200 haptic-press flex items-center justify-center gap-2 group cursor-pointer"
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
                <ArrowRight className="w-3.5 h-3.5 text-[#ffc54c]" />
              </div>
            </>
          )}
        </Button>

        {/* Footer Institucional */}
        <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100 font-medium">
          <span>U.E. Comunidad Cristiana B</span>
        </div>
      </form>
    </div>
  );
}
