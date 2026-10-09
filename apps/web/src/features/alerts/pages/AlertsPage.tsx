import { useState } from 'react';
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
import { Button } from '../../../components/ui/button';
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

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  OPEN: { label: 'Abierta', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  IN_PROGRESS: { label: 'En atención', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  RESOLVED: { label: 'Resuelta', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
};

export function AlertsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'UNREAD' | 'URGENT'>('ALL');

  const alertsQuery = useQuery({
    queryKey: ['alerts'],
    queryFn: () => academicApi.listAlerts(),
  });

  const markRead = useMutation({
    mutationFn: academicApi.markAlertRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' }) =>
      academicApi.updateAlertStatus(id, status),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const alerts = alertsQuery.data?.data ?? [];
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const openCount = alerts.filter((a) => (a.status ?? 'OPEN') === 'OPEN').length;

  const filteredAlerts = alerts.filter((alert) => {
    const status = alert.status ?? 'OPEN';
    if (filter === 'OPEN') return status === 'OPEN';
    if (filter === 'IN_PROGRESS') return status === 'IN_PROGRESS';
    if (filter === 'RESOLVED') return status === 'RESOLVED';
    if (filter === 'UNREAD') return !alert.isRead;
    if (filter === 'URGENT') return alert.severity === 'DANGER' || alert.severity === 'WARNING';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bandeja de Alertas Tempranas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {openCount > 0 ? `${openCount} alertas abiertas que requieren intervención` : 'Todas las alertas atendidas'}
            {unreadCount > 0 && ` (${unreadCount} sin leer)`}
          </p>
        </div>

        <div className="flex flex-wrap items-center rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('OPEN')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filter === 'OPEN'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Abiertas ({openCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filter === 'IN_PROGRESS'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En atención
          </button>
          <button
            type="button"
            onClick={() => setFilter('RESOLVED')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filter === 'RESOLVED'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resueltas
          </button>
          <button
            type="button"
            onClick={() => setFilter('URGENT')}
            className={`px-2.5 py-1.5 rounded-md transition-colors ${
              filter === 'URGENT'
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
        {alertsQuery.isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Cargando alertas...</span>
          </div>
        ) : alertsQuery.isError ? (
          <div className="p-8 text-center text-sm text-rose-600 bg-white rounded-xl border border-rose-200">
            No se pudieron obtener las alertas.
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">Sin alertas en este filtro</p>
            <p className="text-sm text-slate-400">No hay notificaciones que coincidan con la vista seleccionada.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = severityConfig[alert.severity] ?? severityConfig.INFO;
            const currentStatus = (alert.status ?? 'OPEN') as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
            const sConf = statusConfig[currentStatus] ?? statusConfig.OPEN;
            const Icon = config.icon;

            return (
              <article
                key={alert.id}
                className={`bg-white rounded-xl border p-4 transition-colors ${
                  currentStatus === 'RESOLVED'
                    ? 'border-slate-200 bg-slate-50/50 opacity-80'
                    : alert.isRead
                    ? 'border-slate-200'
                    : 'border-brand-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        config.variant === 'info' ? 'bg-blue-50 text-blue-700' :
                        config.variant === 'warning' ? 'bg-amber-50 text-amber-700' :
                        config.variant === 'danger' ? 'bg-rose-50 text-rose-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>

                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${sConf.bg} ${sConf.text} ${sConf.border}`}>
                        {sConf.label}
                      </span>

                      {!alert.isRead && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          Nuevo
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(alert.createdAt).toLocaleString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h2 className="text-sm font-semibold text-slate-900">
                      {alert.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
                    {currentStatus === 'OPEN' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: alert.id, status: 'IN_PROGRESS' })}
                        disabled={updateStatus.isPending}
                        className="h-8 text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Atender
                      </Button>
                    )}

                    {currentStatus !== 'RESOLVED' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: alert.id, status: 'RESOLVED' })}
                        disabled={updateStatus.isPending}
                        className="h-8 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolver
                      </Button>
                    )}

                    {currentStatus === 'RESOLVED' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: alert.id, status: 'OPEN' })}
                        disabled={updateStatus.isPending}
                        className="h-8 text-xs gap-1.5 text-slate-500 hover:text-slate-800"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reabrir
                      </Button>
                    )}

                    {!alert.isRead && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => markRead.mutate(alert.id)}
                        disabled={markRead.isPending}
                        className="h-8 text-xs gap-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Leída
                      </Button>
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
