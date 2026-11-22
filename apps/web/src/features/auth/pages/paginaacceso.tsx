import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Sesion04Formulario } from '../components/formularioacceso04';
import {
  sesionesquema,
  type sesionformulariodatos,
  type sesionrol,
} from '../schemas/esquemadeautenticacion';
import { gestionusoautenticacion } from '../presentation/contextodeautenticacion';
import { usotema } from '../../../lib/tema';

export const SesionPagina = () => {
  const navegar = useNavigate();
  const autenticacion = gestionusoautenticacion();
  const { isInstitutional: esinstitucional, toggleTheme: alternartema } = usotema();
  const [seleccionadorol, establecerseleccionadorol] = useState<sesionrol>('ADMINISTRATIVE');
  const [errormensaje, establecererrormensaje] = useState<string | null>(null);
  const [escarga, establecerescarga] = useState(false);

  const {
    register: registrar,
    handleSubmit: manejarenviar,
    setValue: establecervalor,
    clearErrors: limpiarerrores,
    formState: { errors: errores },
  } = useForm<sesionformulariodatos>({
    resolver: zodResolver(sesionesquema),
    defaultValues: {
      role: 'ADMINISTRATIVE',
      identifier: '',
      secret: '',
      secondaryIdentifier: '',
    },
  });

  const manejarrolcambio = (rol: sesionrol) => {
    establecerseleccionadorol(rol);
    establecervalor('role', rol);
    limpiarerrores();
    establecererrormensaje(null);
  };

  const onenviar = async (datos: sesionformulariodatos) => {
    establecerescarga(true);
    establecererrormensaje(null);

    try {
      const sesion = await autenticacion.sesion(datos);
      navegar(sesion.user.role === 'STUDENT' ? '/dashboard/schedules' : '/dashboard');
    } catch (error: unknown) {
      establecererrormensaje(
        error instanceof Error
          ? error.message
          : 'Las credenciales no son válidas o no se pudo conectar con el servidor',
      );
    } finally {
      establecerescarga(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      {/* SECCIÓN IZQUIERDA: HERO INSTITUCIONAL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1c0508] via-[#2d0910] to-[#0f172a] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 shadow-2xl">
        {/* Glow ambiental con los tonos institucionales (carmesí y oro/ámbar) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-0 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Encabezado con Escudo y Gestión */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src="/logo-sf.png"
                alt="Logo Colegio Comunidad Cristiana"
                className="h-12 w-auto object-contain drop-shadow-md"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1c0508]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">SIGCE</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">U.E. Comunidad Cristiana B</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
              Gestión Escolar 2026
            </span>
          </div>
        </div>

        {/* Mensaje Central y Propósito Institucional */}
        <div className="relative z-10 my-10 max-w-xl lg:my-auto lg:py-12 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-amber-200 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Sistema Integral Acreditado · Ley 070</span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl text-white">
            Control académico, expediente docente y comunidad en tiempo real.
          </h2>

          <p className="text-sm leading-relaxed text-slate-200 max-w-lg">
            Plataforma oficial para la centralización de notas trimestrales, asistencia biométrica,
            administración del legajo docente (RDA y Escalafón) y comunicación con las familias.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xs">
              <p className="text-[11px] font-semibold text-amber-300">Normativa SIE</p>
              <p className="text-xs text-slate-200 mt-0.5">Compatible con Ministerio de Educación</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xs">
              <p className="text-[11px] font-semibold text-rose-300">Expediente RDA</p>
              <p className="text-xs text-slate-200 mt-0.5">Legajo docente digitalizado</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xs">
              <p className="text-[11px] font-semibold text-amber-300">Seguimiento</p>
              <p className="text-xs text-slate-200 mt-0.5">Acceso a notas y asistencia</p>
            </div>
          </div>
        </div>

        {/* Pie de la columna izquierda */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <span>Estado Plurinacional de Bolivia</span>
          <span className="font-mono text-[11px] text-slate-400">America/La_Paz (UTC-4)</span>
        </div>
      </section>

      {/* SECCIÓN DERECHA: FORMULARIO DE ACCESO ELEVADO */}
      <section className="flex min-h-screen flex-col bg-white p-6 sm:p-10 lg:justify-center lg:p-12 xl:p-16">
        <div className="mb-6 flex justify-end lg:absolute lg:right-8 lg:top-8">
          <button
            type="button"
            onClick={alternartema}
            title={esinstitucional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'}
            aria-label={
              esinstitucional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'
            }
            className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer shadow-2xs"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-700" />
            <span>
              {esinstitucional ? 'Modo Institucional' : 'Modo Ejecutivo'}
            </span>
          </button>
        </div>

        <div className="my-auto w-full py-4 max-w-md mx-auto">
          <Sesion04Formulario
            role={seleccionadorol}
            register={registrar}
            errors={errores}
            onRoleChange={manejarrolcambio}
            onSubmit={manejarenviar(onenviar)}
            isLoading={escarga}
            errorMessage={errormensaje}
            onActivateStudent={() => navegar('/student/activate')}
          />
        </div>
      </section>
    </div>
  );
};
