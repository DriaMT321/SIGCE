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
import { Boton } from '@/components/ui/boton';
import { Entrada } from '@/components/ui/entrada';
import { Etiqueta } from '@/components/ui/etiqueta';
import type { sesionformulariodatos, sesionrol } from '../schemas/esquemadeautenticacion';

interface sesion04formulariopropiedades {
  role: sesionrol;
  register: UseFormRegister<sesionformulariodatos>;
  errors: FieldErrors<sesionformulariodatos>;
  onRoleChange: (rol: sesionrol) => void;
  onSubmit: (evento: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  errorMessage: string | null;
  onActivateStudent: () => void;
}

const rolopciones: Array<{ value: sesionrol; label: string; subtitle: string }> = [
  {
    value: 'ADMINISTRATIVE',
    label: 'Administración y Dirección',
    subtitle: 'Gestión y supervisión institucional',
  },
  { value: 'TEACHER', label: 'Docente', subtitle: 'Aula y Registro' },
  { value: 'STUDENT', label: 'Estudiante', subtitle: 'Notas y Horario' },
  { value: 'FAMILY', label: 'Familia', subtitle: 'Seguimiento Tutor' },
];

function RolIcono({ role: rol, className: clasenombre }: { role: sesionrol; className?: string }) {
  if (rol === 'STUDENT') return <IconSchool className={clasenombre} />;
  if (rol === 'TEACHER') return <IconChalkboard className={clasenombre} />;
  if (rol === 'FAMILY') return <IconUsersGroup className={clasenombre} />;
  return <IconBriefcase2 className={clasenombre} />;
}

function obteneridentificadoretiqueta(rol: sesionrol) {
  if (rol === 'STUDENT') return 'Código RUDE o Cédula de Identidad';
  if (rol === 'TEACHER') return 'Código, ítem o correo institucional';
  if (rol === 'FAMILY') return 'Cédula de identidad del tutor (C.I.)';
  return 'Código o correo institucional';
}

function obteneridentificadorprovisional(rol: sesionrol) {
  if (rol === 'STUDENT') return 'Ingrese su RUDE o C.I.';
  if (rol === 'TEACHER') return 'Ingrese su correo, código o ítem';
  if (rol === 'FAMILY') return 'Ingrese su C.I.';
  return 'Ingrese su correo o código institucional';
}

export function Sesion04Formulario({
  role: rol,
  register: registrar,
  errors: errores,
  onRoleChange: onrolcambio,
  onSubmit: onenviar,
  isLoading: escarga,
  errorMessage: errormensaje,
  onActivateStudent: onactivarestudiante,
}: sesion04formulariopropiedades) {
  return (
    <div className="mx-auto w-full max-w-[360px] space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#292820] sm:text-3xl">
          Iniciar sesión
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[#706e64] sm:text-sm">
          Seleccione el tipo de acceso e introduzca sus datos.
        </p>
      </div>

      <form onSubmit={onenviar} className="space-y-5">
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Seleccionar rol">
          {rolopciones.map((opcion) => {
            const esseleccionado = opcion.value === rol;
            return (
              <button
                key={opcion.value}
                type="button"
                onClick={() => onrolcambio(opcion.value)}
                aria-pressed={esseleccionado}
                className={`flex min-h-[62px] items-start gap-2 rounded-md border p-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  esseleccionado
                    ? 'border-primary bg-secondary text-secondary-foreground'
                    : 'border-[#8c897e] bg-white text-[#292820] hover:border-[#706e64] hover:bg-[#fbfaf6]'
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                    esseleccionado
                      ? 'border-[#d4c476] bg-white text-[#806719]'
                      : 'border-[#e7e4da] bg-[#fbfaf6] text-[#706e64]'
                  }`}
                >
                  <RolIcono role={opcion.value} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="whitespace-normal text-xs font-bold leading-tight">
                    {opcion.label}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] leading-tight text-[#706e64]">
                    {opcion.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {errormensaje && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-[#efd3cf] bg-[#f8ecea] p-3 text-xs text-[#9b4038]"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="font-medium leading-relaxed">{errormensaje}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Etiqueta htmlFor="identifier" className="text-xs font-bold text-[#292820]">
              {obteneridentificadoretiqueta(rol)}
            </Etiqueta>
            <div className="relative">
              <IconId
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706e64]"
              />
              <Entrada
                {...registrar('identifier')}
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder={obteneridentificadorprovisional(rol)}
                className="h-11 rounded-md border-[#8c897e] bg-[#fbfaf6] pl-10 text-xs font-medium text-[#292820] placeholder:text-[#706e64] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
                aria-invalid={Boolean(errores.identifier)}
                aria-describedby={errores.identifier ? 'error-identificador' : undefined}
              />
            </div>
            {errores.identifier && (
              <p id="error-identificador" className="text-[11px] font-semibold text-[#9b4038]">
                {errores.identifier.message}
              </p>
            )}
          </div>

          {rol === 'FAMILY' && (
            <div className="space-y-1.5">
              <Etiqueta htmlFor="secondaryIdentifier" className="text-xs font-bold text-[#292820]">
                Número de teléfono celular
              </Etiqueta>
              <div className="relative">
                <IconUsersGroup
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706e64]"
                />
                <Entrada
                  {...registrar('secondaryIdentifier')}
                  id="secondaryIdentifier"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Ingrese su número de teléfono"
                  className="h-11 rounded-md border-[#8c897e] bg-[#fbfaf6] pl-10 text-xs font-medium text-[#292820] placeholder:text-[#706e64] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
                  aria-invalid={Boolean(errores.secondaryIdentifier)}
                  aria-describedby={
                    errores.secondaryIdentifier ? 'error-identificador-secundario' : undefined
                  }
                />
              </div>
              {errores.secondaryIdentifier && (
                <p
                  id="error-identificador-secundario"
                  className="text-[11px] font-semibold text-[#9b4038]"
                >
                  {errores.secondaryIdentifier.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Etiqueta htmlFor="secret" className="text-xs font-bold text-[#292820]">
              Contraseña de acceso
            </Etiqueta>
            <div className="relative">
              <IconKey
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#706e64]"
              />
              <Entrada
                {...registrar('secret')}
                id="secret"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="h-11 rounded-md border-[#8c897e] bg-[#fbfaf6] pl-10 text-xs font-medium text-[#292820] placeholder:text-[#706e64] focus-visible:border-primary focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
                aria-invalid={Boolean(errores.secret)}
                aria-describedby={errores.secret ? 'error-clave' : undefined}
              />
            </div>
            {errores.secret && (
              <p id="error-clave" className="text-[11px] font-semibold text-[#9b4038]">
                {errores.secret.message}
              </p>
            )}
          </div>
        </div>

        <Boton
          type="submit"
          disabled={escarga}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-xs font-bold tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-70 sm:text-sm"
        >
          {escarga ? (
            <>
              <Loader2 aria-hidden="true" className="mr-1.5 h-4 w-4 animate-spin text-[#d9c56a]" />
              <span>Verificando datos de acceso...</span>
            </>
          ) : (
            <>
              <span>Ingresar al sistema</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4 text-primary-foreground" />
            </>
          )}
        </Boton>

        {rol === 'STUDENT' && (
          <button
            type="button"
            onClick={onactivarestudiante}
            className="w-full rounded-md px-3 py-2 text-sm font-semibold text-[#706e64] underline-offset-4 hover:text-[#292820] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Activar mi cuenta estudiantil
          </button>
        )}

        <div className="border-t border-[#e7e4da] pt-3 text-center text-[11px] font-medium text-[#706e64]">
          <span>U.E. Comunidad Cristiana B</span>
        </div>
      </form>
    </div>
  );
}
