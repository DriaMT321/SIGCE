import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Boton } from '../../../components/ui/boton';
import type { gestionalertas } from '../application/gestionalertas';
import { AlertaReglasPanel } from '../components/panelreglasalerta';

const severidadconfiguracion: Record<
  string,
  { label: string; variant: 'info' | 'warning' | 'danger' | 'success'; icon: typeof Info }
> = {
  INFO: { label: 'Informativo', variant: 'info', icon: Info },
  WARNING: { label: 'Advertencia', variant: 'warning', icon: AlertTriangle },
  DANGER: { label: 'Urgente', variant: 'danger', icon: AlertCircle },
  SUCCESS: { label: 'Confirmación', variant: 'success', icon: CheckCircle2 },
};

const estadoconfiguracion: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  OPEN: { label: 'Abierta', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  IN_PROGRESS: {
    label: 'En atención',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  RESOLVED: {
    label: 'Resuelta',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
};

export function AlertasPagina({
  management: gestion,
  currentRole: actualrol,
}: {
  management: gestionalertas;
  currentRole?: string;
}) {
  const clientedeconsultas = useQueryClient();
  const [parametros, establecerparametros] = useSearchParams();
  const alertaidobjetivo = parametros.get('alertId');
  const puedeconfigurarreglas = actualrol === 'ADMINISTRATIVE';
  const [filtro, establecerfiltro] = useState<
    'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'UNREAD' | 'URGENT'
  >('ALL');

  const alertasconsulta = useQuery({
    queryKey: ['alerts'],
    queryFn: () => gestion.listaralertas(),
  });

  const marcarleer = useMutation({
    mutationFn: (alertaid: string) => gestion.marcaralertaleer(alertaid),
    onSuccess: () => void clientedeconsultas.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const actualizarestado = useMutation({
    mutationFn: ({
      id,
      status: estado,
    }: {
      id: string;
      status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
    }) => gestion.actualizaralertaestado(id, estado),
    onSuccess: () => void clientedeconsultas.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const alertas = alertasconsulta.data ?? [];

  useEffect(() => {
    if (!alertaidobjetivo || !alertas.length) return;
    const alerta = alertas.find((elemento) => elemento.id === alertaidobjetivo);
    if (!alerta) return;
    requestAnimationFrame(() => {
      document.getElementById(`alerta-${alerta.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    if (!alerta.isRead) marcarleer.mutate(alerta.id);
    establecerparametros((anteriores) => {
      const siguientes = new URLSearchParams(anteriores);
      siguientes.delete('alertId');
      return siguientes;
    }, { replace: true });
  }, [alertaidobjetivo, alertas, marcarleer, establecerparametros]);
  const sinleercantidad = alertas.filter((a) => !a.isRead).length;
  const abrircantidad = alertas.filter((a) => (a.status ?? 'OPEN') === 'OPEN').length;

  const filtradoalertas = alertas.filter((alerta) => {
    const estado = alerta.status ?? 'OPEN';
    if (filtro === 'OPEN') return estado === 'OPEN';
    if (filtro === 'IN_PROGRESS') return estado === 'IN_PROGRESS';
    if (filtro === 'RESOLVED') return estado === 'RESOLVED';
    if (filtro === 'UNREAD') return !alerta.isRead;
    if (filtro === 'URGENT') return alerta.severity === 'DANGER' || alerta.severity === 'WARNING';
    return true;
  });

  return (
    <div className="space-y-5">
      {puedeconfigurarreglas && <AlertaReglasPanel management={gestion} />}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bandeja de Alertas Tempranas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {abrircantidad > 0
              ? `${abrircantidad} alertas abiertas que requieren intervención`
              : 'Todas las alertas atendidas'}
            {sinleercantidad > 0 && ` (${sinleercantidad} sin leer)`}
          </p>
        </div>

        <div className="flex flex-wrap items-center rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => establecerfiltro('ALL')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filtro === 'ALL'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({alertas.length})
          </button>
          <button
            type="button"
            onClick={() => establecerfiltro('OPEN')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filtro === 'OPEN'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Abiertas ({abrircantidad})
          </button>
          <button
            type="button"
            onClick={() => establecerfiltro('IN_PROGRESS')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filtro === 'IN_PROGRESS'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En atención
          </button>
          <button
            type="button"
            onClick={() => establecerfiltro('RESOLVED')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filtro === 'RESOLVED'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resueltas
          </button>
          <button
            type="button"
            onClick={() => establecerfiltro('URGENT')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filtro === 'URGENT'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prioritarias
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {(marcarleer.isError || actualizarestado.isError) && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
          >
            {(marcarleer.error ?? actualizarestado.error)?.message ||
              'No se pudo actualizar la alerta. Vuelva a intentarlo.'}
          </p>
        )}
        {alertasconsulta.isLoading ? (
          <div
            role="status"
            className="flex items-center justify-center p-12 text-slate-500 bg-white rounded-xl border border-slate-200"
          >
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Cargando alertas...</span>
          </div>
        ) : alertasconsulta.isError ? (
          <div
            role="alert"
            className="p-8 text-center text-sm text-rose-600 bg-white rounded-xl border border-rose-200"
          >
            No se pudieron obtener las alertas.
          </div>
        ) : filtradoalertas.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">Sin alertas en este filtro</p>
            <p className="text-sm text-slate-400">
              No hay notificaciones que coincidan con la vista seleccionada.
            </p>
          </div>
        ) : (
          filtradoalertas.map((alerta) => {
            const configuracion =
              severidadconfiguracion[alerta.severity] ?? severidadconfiguracion.INFO;
            const actualestado = (alerta.status ?? 'OPEN') as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
            const sconfiguracion = estadoconfiguracion[actualestado] ?? estadoconfiguracion.OPEN;
            const Icono = configuracion.icon;

            return (
              <article
                key={alerta.id}
                id={`alerta-${alerta.id}`}
                className={`bg-white rounded-xl border p-4 transition-colors ${alerta.id === alertaidobjetivo ? 'ring-2 ring-brand-500' : ''} ${
                  actualestado === 'RESOLVED'
                    ? 'border-slate-200 bg-slate-50/50 opacity-80'
                    : alerta.isRead
                      ? 'border-slate-200'
                      : 'border-brand-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          configuracion.variant === 'info'
                            ? 'bg-blue-50 text-blue-700'
                            : configuracion.variant === 'warning'
                              ? 'bg-amber-50 text-amber-700'
                              : configuracion.variant === 'danger'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <Icono className="w-3 h-3" />
                        {configuracion.label}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${sconfiguracion.bg} ${sconfiguracion.text} ${sconfiguracion.border}`}
                      >
                        {sconfiguracion.label}
                      </span>

                      {!alerta.isRead && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          Nuevo
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(alerta.createdAt).toLocaleString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h2 className="text-sm font-semibold text-slate-900">{alerta.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{alerta.message}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
                    {actualestado === 'OPEN' && (
                      <Boton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          actualizarestado.mutate({ id: alerta.id, status: 'IN_PROGRESS' })
                        }
                        disabled={actualizarestado.isPending}
                        className="h-8 text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Atender
                      </Boton>
                    )}

                    {actualestado !== 'RESOLVED' && (
                      <Boton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          actualizarestado.mutate({ id: alerta.id, status: 'RESOLVED' })
                        }
                        disabled={actualizarestado.isPending}
                        className="h-8 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolver
                      </Boton>
                    )}

                    {actualestado === 'RESOLVED' && (
                      <Boton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => actualizarestado.mutate({ id: alerta.id, status: 'OPEN' })}
                        disabled={actualizarestado.isPending}
                        className="h-8 text-xs gap-1.5 text-slate-500 hover:text-slate-800"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reabrir
                      </Boton>
                    )}

                    {!alerta.isRead && (
                      <Boton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => marcarleer.mutate(alerta.id)}
                        disabled={marcarleer.isPending}
                        className="h-8 text-xs gap-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Leída
                      </Boton>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
