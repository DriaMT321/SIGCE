import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gestionusoautenticacion } from '../../features/auth/presentation/contextodeautenticacion';
import { LogOut, Bell, Palette } from 'lucide-react';
import { usotema } from '../../lib/tema';
import { gestionusoalertas } from '../../features/alerts/presentation/contextodealertas';

type alertaheader = {
  id: string;
  title: string;
  message: string;
  severity: string;
  status?: string;
  isRead: boolean;
  createdAt: string;
};

export const Barranavegacion: React.FC = () => {
  const autenticacion = gestionusoautenticacion();
  const usuario = autenticacion.obtenerusuarioactual();
  const { isInstitutional: esinstitucional, toggleTheme: alternartema } = usotema();
  const gestionalertas = gestionusoalertas();
  const [mostraralertas, establecermostraralertas] = useState(false);
  const [alertanueva, estableceralertanueva] = useState<alertaheader | null>(null);
  const alertasvistas = useRef<Set<string> | null>(null);
  const alertasconsulta = useQuery({
    queryKey: ['alerts', 'header'],
    queryFn: () => (gestionalertas ? gestionalertas.listaralertas() : Promise.resolve([])),
    enabled: Boolean(usuario) && Boolean(gestionalertas),
    staleTime: 0,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });
  const alertas = alertasconsulta.data ?? [];
  const sinleer = alertas.filter((alerta) => !alerta.isRead).length;
  const ultimasalertas = alertas.filter((alerta) => !alerta.isRead).slice(0, 5);

  useEffect(() => {
    if (!alertasconsulta.data) return;
    const identificadores = alertasconsulta.data.map((alerta) => alerta.id);
    if (alertasvistas.current === null) {
      alertasvistas.current = new Set(identificadores);
      return;
    }
    const nuevas = alertasconsulta.data.filter(
      (alerta) => !alertasvistas.current?.has(alerta.id) && !alerta.isRead,
    );
    identificadores.forEach((id) => alertasvistas.current?.add(id));
    if (nuevas.length) {
      estableceralertanueva(nuevas[0]);
      establecermostraralertas(true);
    }
  }, [alertasconsulta.data]);

  useEffect(() => {
    if (!alertanueva) return;
    const temporizador = window.setTimeout(() => estableceralertanueva(null), 8000);
    return () => window.clearTimeout(temporizador);
  }, [alertanueva]);
  const iniciales =
    `${usuario?.firstName?.[0] ?? ''}${usuario?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Page context */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-medium text-slate-900">Gestión 2026</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={alternartema}
          aria-label={esinstitucional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'}
          title={esinstitucional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'}
          className={`p-2 rounded-lg transition-colors ${
            esinstitucional
              ? 'text-brand-600 hover:bg-brand-50'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => establecermostraralertas((visible) => !visible)}
            aria-label={sinleer > 0 ? `Notificaciones: ${sinleer} sin leer` : 'Notificaciones'}
            aria-expanded={mostraralertas}
            aria-haspopup="true"
            title={sinleer > 0 ? `${sinleer} notificaciones sin leer` : 'Notificaciones'}
            className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell aria-hidden="true" className="h-4 w-4" />
            {sinleer > 0 && <span className="insignia-notificacion absolute right-0 top-0 min-w-4 rounded-full bg-brand-600 px-1 text-center text-[10px] leading-4 text-white">{sinleer > 9 ? '9+' : sinleer}</span>}
          </button>

          {mostraralertas && (
            <section aria-label="Notificaciones recientes" className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">Notificaciones</h2>
                <span className="text-xs text-slate-500">{sinleer} sin leer</span>
              </div>
              {alertasconsulta.isError ? (
                <p role="alert" className="px-4 py-5 text-sm text-rose-700">No se pudieron cargar las notificaciones.</p>
              ) : ultimasalertas.length ? (
                <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {ultimasalertas.map((alerta) => (
                    <li key={alerta.id}>
                      <Link to={`/dashboard/alerts?alertId=${encodeURIComponent(alerta.id)}`} onClick={() => establecermostraralertas(false)} className="block px-4 py-3 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-700">
                        <span className="block text-sm font-medium text-slate-900">{alerta.title}</span>
                        <span className="mt-1 line-clamp-2 block text-xs text-slate-600">{alerta.message}</span>
                        <span className="mt-1.5 block text-[11px] text-slate-400">{new Date(alerta.createdAt).toLocaleString('es-BO')}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-sm text-slate-500">No tienes notificaciones nuevas.</p>
              )}
              <Link to="/dashboard/alerts" onClick={() => establecermostraralertas(false)} className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-medium text-brand-700 hover:bg-brand-50">Ver todas</Link>
            </section>
          )}
          {alertanueva && mostraralertas && <p role="status" className="sr-only">Nueva notificación: {alertanueva.title}</p>}
        </div>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold">
            {iniciales}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {usuario?.firstName}
          </span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => void autenticacion.cerrarsesion()}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
