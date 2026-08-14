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
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  { value: 'STUDENT', label: 'Estudiante', description: 'Código de alumno' },
  { value: 'TEACHER', label: 'Docente', description: 'Código y clave' },
  { value: 'FAMILY', label: 'Familiar', description: 'CI y celular' },
  { value: 'ADMINISTRATIVE', label: 'Administrativo', description: 'Código y clave' },
];

function RoleIcon({ role, className }: { role: LoginRole; className?: string }) {
  if (role === 'STUDENT') return <IconSchool className={className} />;
  if (role === 'TEACHER') return <IconChalkboard className={className} />;
  if (role === 'FAMILY') return <IconUsersGroup className={className} />;
  return <IconBriefcase2 className={className} />;
}

function getIdentifierLabel(role: LoginRole) {
  if (role === 'STUDENT') return 'Código de alumno';
  if (role === 'TEACHER') return 'Código de docente';
  if (role === 'FAMILY') return 'Cédula de identidad';
  return 'Código de administrador';
}

function getIdentifierPlaceholder(role: LoginRole) {
  if (role === 'STUDENT') return 'Ej. RUDE-000123';
  if (role === 'TEACHER') return 'Ej. DOC-000123';
  if (role === 'FAMILY') return 'Ej. 1234567';
  return 'Correo institucional asignado';
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
    <Card className="w-full max-w-5xl overflow-hidden border-white/70 bg-white shadow-2xl shadow-black/25">
      <CardContent className="grid p-0 md:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={onSubmit} className="p-6 text-slate-900 sm:p-8">
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F8C311] via-[#F37022] to-[#B91329] shadow-lg">
                <IconId className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Selecciona tu acceso</h1>
              <p className="mt-2 text-sm text-slate-500">Elige tu rol e ingresa los datos asignados por la institución.</p>
            </div>

            <div className="grid grid-cols-2 gap-3" aria-label="Tipo de acceso">
              {roleOptions.map((option) => {
                const isSelected = option.value === role;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    aria-pressed={isSelected}
                    onClick={() => onRoleChange(option.value)}
                    className={isSelected
                      ? 'h-auto min-h-16 justify-start border-[#B91329] bg-[#B91329] px-3 py-2 text-left text-white hover:bg-[#961021] hover:text-white'
                      : 'h-auto min-h-16 justify-start border-slate-200 bg-white px-3 py-2 text-left text-slate-700 hover:border-[#F37022] hover:bg-[#fff9e5] hover:text-[#B91329]'}
                  >
                    <RoleIcon role={option.value} className="h-5 w-5 shrink-0" />
                    <span className="flex min-w-0 flex-col items-start">
                      <span className="font-semibold">{option.label}</span>
                      <span className={isSelected ? 'text-xs text-white/75' : 'text-xs text-slate-500'}>{option.description}</span>
                    </span>
                  </Button>
                );
              })}
            </div>

            {errorMessage && (
              <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#B91329]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="identifier">{getIdentifierLabel(role)}</Label>
              <div className="relative">
                <IconId className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B91329]" />
                <Input
                  {...register('identifier')}
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder={getIdentifierPlaceholder(role)}
                  className="border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#F37022]"
                  aria-invalid={Boolean(errors.identifier)}
                />
              </div>
              {errors.identifier && <p className="text-xs text-[#B91329]">{errors.identifier.message}</p>}
            </div>

            {usesSecondaryIdentifier && (
              <div className="grid gap-2">
                <Label htmlFor="secondaryIdentifier">Número de celular</Label>
                <div className="relative">
                  <IconUsersGroup className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B91329]" />
                  <Input
                    {...register('secondaryIdentifier')}
                    id="secondaryIdentifier"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Ej. 70000000"
                    className="border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#F37022]"
                    aria-invalid={Boolean(errors.secondaryIdentifier)}
                  />
                </div>
                {errors.secondaryIdentifier && <p className="text-xs text-[#B91329]">{errors.secondaryIdentifier.message}</p>}
              </div>
            )}

            {usesSecret && (
              <div className="grid gap-2">
                <Label htmlFor="secret">Clave</Label>
                <div className="relative">
                  <IconKey className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B91329]" />
                  <Input
                    {...register('secret')}
                    id="secret"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#F37022]"
                    aria-invalid={Boolean(errors.secret)}
                  />
                </div>
                {errors.secret && <p className="text-xs text-[#B91329]">{errors.secret.message}</p>}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="h-11 w-full bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white shadow-lg shadow-[#B91329]/25 hover:brightness-105">
              {isLoading ? 'Validando acceso...' : 'Ingresar al sistema'}
            </Button>
          </div>
        </form>

        <div className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-[#F8C311] via-[#F37022] to-[#B91329] md:block">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#B91329]/30 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between p-8 text-white drop-shadow-md">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <ShieldCheck className="h-4 w-4" />
              Acceso seguro
            </div>
            <div>
              <p className="text-3xl font-semibold leading-tight">Un acceso para cada integrante de la comunidad educativa.</p>
              <p className="mt-4 text-sm leading-6 text-white/90">Selecciona tu rol y utiliza el código o las credenciales asignadas por tu institución.</p>
            </div>
            <p className="text-xs text-white/75">Plataforma de Gestión Académica</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
