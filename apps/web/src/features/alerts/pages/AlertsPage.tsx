import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Info,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { academicApi } from '../../../lib/academic-api';

const severityConfig: Record<
  string,
  { label: string; variant: 'info' | 'warning' | 'danger' | 'success'; icon: typeof Info }
> = {
  INFO: { label: 'Informativo', variant: 'info', icon: Info },
  WARNING: { label: 'Advertencia', variant: 'warning', icon: AlertTriangle },
  DANGER: { label: 'Urgente', variant: 'danger', icon: AlertCircle },
  SUCCESS: { label: 'Confirmación', variant: 'success', icon: CheckCircle2 },
};

export function AlertsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');

  const alertsQuery = useQuery({
    queryKey: ['alerts'],
    queryFn: academicApi.listAlerts,
  });

  const markRead = useMutation({
    mutationFn: academicApi.markAlertRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const alerts = alertsQuery.data?.data ?? [];
  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'UNREAD') return !alert.isRead;
    if (filter === 'URGENT') return alert.severity === 'DANGER' || alert.severity === 'WARNING';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <Bell className="w-3.5 h-3.5 text-brand-700" />
              <span>Bandeja de Comunicaciones</span>
            </span>
            {unreadCount > 0 ? (
              <Badge variant="brand" className="font-mono text-[10px]">
                {unreadCount} sin leer
              </Badge>
            ) : (
              <Badge variant="outline" className="font-mono text-[10px]">
                Al día
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Avisos y Notificaciones del Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Comunicaciones institucionales, recordatorios de cierre de notas e incidencias operativas.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/60 text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'UNREAD'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            No leídas ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('URGENT')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === 'URGENT'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prioritarias
          </button>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-3">
        {alertsQuery.isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-slate-400" />
            <span className="text-xs font-medium">Cargando avisos y notificaciones...</span>
          </div>
        ) : alertsQuery.isError ? (
          <div className="p-8 text-center text-xs text-red-600 rounded-2xl border border-red-200 bg-red-50">
            No se pudieron obtener las alertas del servidor.
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">Bandeja de avisos al día</p>
            <p className="text-xs text-slate-400">No hay notificaciones pendientes en esta vista.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity] ?? severityConfig.INFO;
            const Icon = config.icon;

            return (
              <article
                key={alert.id}
                className={`rounded-2xl border bg-white p-5 transition-all shadow-[0_1px_3px_0_rgba(15,23,42,0.02)] ${
                  alert.isRead
                    ? 'border-slate-200/80 opacity-85'
                    : 'border-slate-300 shadow-sm ring-1 ring-slate-900/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={config.variant} className="gap-1 font-semibold text-[10px]">
                        <Icon className="w-3 h-3" />
                        <span>{config.label}</span>
                      </Badge>
                      {!alert.isRead && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          Nuevo
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(alert.createdAt).toLocaleString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                      {alert.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {alert.message}
                    </p>
                  </div>

                  {!alert.isRead && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => markRead.mutate(alert.id)}
                      disabled={markRead.isPending}
                      className="h-8 text-xs gap-1.5 shrink-0 self-start text-slate-700 hover:text-slate-900"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Marcar como leída</span>
                    </Button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
