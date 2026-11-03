import { useState, type FormEvent } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import { Etiqueta } from '../../../components/ui/etiqueta';
import { gestionusoautenticacion } from '../presentation/contextodeautenticacion';

export function EstudianteActivacionPagina() {
  const navegar = useNavigate();
  const autenticacion = gestionusoautenticacion();
  const [activaciontoken, estableceractivaciontoken] = useState(() => {
    const codigo = new URLSearchParams(window.location.hash.slice(1)).get('codigo') ?? '';
    if (codigo) window.history.replaceState(null, '', window.location.pathname);
    return codigo;
  });
  const [contrasena, establecercontrasena] = useState('');
  const [confirmacion, establecerconfirmacion] = useState('');
  const [error, establecererror] = useState<string | null>(null);
  const [activado, estableceractivado] = useState(false);
  const [esenviando, estableceresenviando] = useState(false);

  const manejarenviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    establecererror(null);

    if (contrasena !== confirmacion) {
      establecererror('Las claves no coinciden.');
      return;
    }
    if (
      !/\P{White_Space}/u.test(contrasena) ||
      [...contrasena].length < 12 ||
      new TextEncoder().encode(contrasena).length > 72
    ) {
      establecererror(
        'La clave no puede contener solo espacios y debe tener al menos 12 caracteres, sin superar 72 bytes UTF-8.',
      );
      return;
    }

    estableceresenviando(true);
    try {
      await autenticacion.activarestudiantecuenta({
        activationToken: activaciontoken.trim(),
        newPassword: contrasena,
      });
      estableceractivado(true);
      estableceractivaciontoken('');
      establecercontrasena('');
      establecerconfirmacion('');
    } catch (causa: unknown) {
      establecererror(
        causa instanceof Error
          ? causa.message
          : 'No se pudo activar la cuenta. Verifica el código e inténtalo nuevamente.',
      );
    } finally {
      estableceresenviando(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="activation-title"
      >
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo-sf.png" alt="Logo Colegio Comunidad Cristiana" className="h-11 w-auto object-contain shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900">SIGCE</p>
            <p className="text-xs text-slate-500">U.E. Comunidad Cristiana B</p>
          </div>
        </div>

        <div className="mb-6">
          <h1 id="activation-title" className="text-2xl font-bold tracking-tight text-slate-950">
            Activar cuenta estudiantil
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ingresa el código entregado por la institución y crea una clave personal.
          </p>
        </div>

        {activado ? (
          <div role="status" className="space-y-4">
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Cuenta activada.</p>
              <p className="mt-1">Ya puedes ingresar con tu RUDE o cédula y la nueva clave.</p>
            </div>
            <Boton type="button" onClick={() => navegar('/login')} className="w-full">
              Ir al inicio de sesión
            </Boton>
          </div>
        ) : (
          <form onSubmit={manejarenviar} className="space-y-4">
            <div className="space-y-1.5">
              <Etiqueta htmlFor="activation-token">Código de activación</Etiqueta>
              <Entrada
                id="activation-token"
                autoComplete="one-time-code"
                spellCheck={false}
                value={activaciontoken}
                onChange={(evento) => estableceractivaciontoken(evento.target.value)}
                required
                minLength={32}
                maxLength={100}
                aria-describedby="activation-help"
              />
              <p id="activation-help" className="text-xs leading-5 text-slate-600">
                El código vence siete días después de su emisión y solo se puede usar una vez.
              </p>
            </div>

            <div className="space-y-1.5">
              <Etiqueta htmlFor="new-password">Nueva clave</Etiqueta>
              <Entrada
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={contrasena}
                onChange={(evento) => establecercontrasena(evento.target.value)}
                required
                minLength={12}
                maxLength={72}
              />
            </div>

            <div className="space-y-1.5">
              <Etiqueta htmlFor="confirm-password">Repetir nueva clave</Etiqueta>
              <Entrada
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmacion}
                onChange={(evento) => establecerconfirmacion(evento.target.value)}
                required
                minLength={12}
                maxLength={72}
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-700">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
              <p>
                Elige una clave que no uses en otros servicios. El código no vuelve a mostrarse
                después de activar la cuenta.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800"
              >
                {error}
              </p>
            )}

            <Boton
              type="submit"
              disabled={esenviando || !activaciontoken.trim()}
              className="w-full gap-2"
            >
              <KeyRound aria-hidden="true" className="h-4 w-4" />
              {esenviando ? 'Activando…' : 'Guardar clave y activar'}
            </Boton>
            <button
              type="button"
              onClick={() => navegar('/login')}
              className="w-full rounded-md py-2 text-sm font-medium text-slate-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
