import { Bell, Check, Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { academicApi } from '../../../lib/academic-api';

const severityLabels: Record<string, string> = { INFO: 'Información', WARNING: 'Advertencia', DANGER: 'Importante', SUCCESS: 'Correcto' };

export function AlertsPage() {
  const queryClient = useQueryClient();
  const alertsQuery = useQuery({ queryKey: ['alerts'], queryFn: academicApi.listAlerts });
  const markRead = useMutation({ mutationFn: academicApi.markAlertRead, onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['alerts'] }) });
  const alerts = alertsQuery.data?.data ?? [];

  return <div className="space-y-6">
    <div className="border-b border-slate-200 pb-5"><h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><Bell className="h-6 w-6 text-[#F37022]" />Alertas</h1><p className="mt-1 text-sm text-slate-600">Avisos académicos y comunicaciones dirigidas a tu cuenta.</p></div>
    <div className="grid gap-4">{alertsQuery.isLoading ? <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando alertas...</div> : alertsQuery.isError ? <p className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-[#B91329]">No se pudieron cargar las alertas.</p> : alerts.map((alert) => <article key={alert.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${alert.isRead ? 'border-slate-200' : 'border-[#F37022]/50 shadow-[#F37022]/10'}`}><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="rounded-full bg-[#fff9e5] px-2.5 py-1 text-xs font-semibold text-[#B91329]">{severityLabels[alert.severity] ?? alert.severity}</span>{!alert.isRead && <span className="text-xs font-semibold text-[#F37022]">Nueva</span>}</div><h2 className="mt-3 font-bold text-slate-900">{alert.title}</h2><p className="mt-1 text-sm text-slate-600">{alert.message}</p><p className="mt-3 text-xs text-slate-400">{new Date(alert.createdAt).toLocaleString('es-BO')}</p></div>{!alert.isRead && <button type="button" onClick={() => markRead.mutate(alert.id)} className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#F37022] hover:text-[#B91329]"><Check className="h-3.5 w-3.5" />Marcar leída</button>}</div></article>)}{!alerts.length && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No tienes alertas.</p>}</div>
  </div>;
}
