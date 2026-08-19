import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Clock3, Database, Loader2, RefreshCw, Server, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { academicApi } from '../../../lib/academic-api';
import { apiClient } from '../../../lib/api-client';
import { getSocket } from '../../../lib/socket';
import { sieSyncStatusEventSchema, sieSyncTriggerResponseSchema } from '../schemas/sie-sync.schema';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente', QUEUED: 'En cola', PROCESSING: 'Procesando', VERIFIED: 'Verificada', FAILED: 'Fallida', CANCELLED: 'Cancelada',
};

export function SieSyncDashboardPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string>();
  const [liveStatus, setLiveStatus] = useState('EN ESPERA');
  const syncQuery = useQuery({ queryKey: ['sie-sync'], queryFn: academicApi.listSieSynchronizations, refetchInterval: 5000 });
  const synchronizations = syncQuery.data?.data ?? [];
  const selected = synchronizations.find((item) => item.id === activeId) ?? synchronizations[0];
  const items = selected?.items ?? [];
  const counters = useMemo(() => ({
    verified: items.filter((item) => item.status === 'VERIFIED').length,
    failed: items.filter((item) => item.status === 'FAILED').length,
    pending: items.filter((item) => ['PENDING', 'QUEUED', 'PROCESSING'].includes(item.status)).length,
  }), [items]);

  useEffect(() => {
    if (!activeId && synchronizations[0]) setActiveId(synchronizations[0].id);
  }, [activeId, synchronizations]);

  useEffect(() => {
    const socket = getSocket();
    const refresh = (rawData: unknown) => {
      const parsed = sieSyncStatusEventSchema.safeParse(rawData);
      if (parsed.success) {
        setLiveStatus(statusLabels[parsed.data.status] ?? parsed.data.status);
        void queryClient.invalidateQueries({ queryKey: ['sie-sync'] });
      }
    };
    const eventNames = ['sie.sync.queued', 'sie.sync.started', 'sie.sync.progress', 'sie.sync.verified', 'sie.sync.failed'];
    eventNames.forEach((eventName) => socket.on(eventName, refresh));
    return () => eventNames.forEach((eventName) => socket.off(eventName, refresh));
  }, [queryClient]);

  const triggerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/sie-sync/trigger', { syncType: 'GRADES' });
      return sieSyncTriggerResponseSchema.parse(response.data);
    },
    onSuccess: (result) => {
      setLiveStatus('En cola');
      setActiveId(result.data.synchronizationId);
      void queryClient.invalidateQueries({ queryKey: ['sie-sync'] });
    },
  });

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center"><div><h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><RefreshCw className="h-6 w-6 text-[#F37022]" />Verificación académica local</h1><p className="mt-1 text-sm text-slate-600">Flujo de cola y auditoría preparado para el SIE. La conexión estatal real permanece desactivada.</p></div><Button type="button" onClick={() => triggerMutation.mutate()} disabled={triggerMutation.isPending} className="bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white"><RefreshCw className={triggerMutation.isPending ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />{triggerMutation.isPending ? 'Encolando...' : 'Ejecutar verificación local'}</Button></div>
    {triggerMutation.isError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-[#B91329]">No se pudo encolar la verificación. Verifica que existan calificaciones locales y que Redis esté disponible.</p>}
    <div className="grid gap-4 sm:grid-cols-4"><Metric icon={<ShieldCheck />} label="Estado actual" value={selected ? statusLabels[selected.status] : liveStatus} /><Metric icon={<CheckCircle2 />} label="Verificadas" value={String(counters.verified)} tone="green" /><Metric icon={<AlertTriangle />} label="Fallidas" value={String(counters.failed)} tone="red" /><Metric icon={<Clock3 />} label="Pendientes" value={String(counters.pending)} tone="amber" /></div>
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><Database className="h-4 w-4 text-[#F37022]" />Historial de ejecuciones</h2>{syncQuery.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400" /> : synchronizations.length ? <div className="space-y-2">{synchronizations.map((sync) => <button key={sync.id} type="button" onClick={() => setActiveId(sync.id)} className={`w-full rounded-xl border p-3 text-left transition ${selected?.id === sync.id ? 'border-[#F37022] bg-[#fff9e5]' : 'border-slate-200 hover:border-[#F8C311]'}`}><p className="text-sm font-semibold text-slate-900">{new Date(sync.createdAt).toLocaleString('es-BO')}</p><p className="mt-1 text-xs text-slate-500">{sync.totalItems} elementos · {statusLabels[sync.status]}</p></button>)}</div> : <p className="text-sm text-slate-500">Todavía no hay ejecuciones.</p>}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3"><div><h2 className="font-bold text-slate-900">Datos locales y resultado simulado</h2><p className="text-xs text-slate-500">Worker BullMQ + Puppeteer sobre HTML controlado</p></div><Server className="h-5 w-5 text-emerald-600" /></div>{selected && items.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Estudiante</th><th className="px-4 py-3">Materia</th><th className="px-4 py-3">Local</th><th className="px-4 py-3">Resultado</th><th className="px-4 py-3">Estado</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={item.id} className="hover:bg-[#fff9e5]"><td className="px-4 py-3 font-semibold text-slate-900">{item.student.firstName} {item.student.lastName}<span className="block font-mono text-xs font-normal text-slate-500">{item.student.rude}</span></td><td className="px-4 py-3 text-slate-600">{item.subject.name}<span className="block text-xs text-slate-400">{item.period.name}</span></td><td className="px-4 py-3 font-bold text-[#F37022]">{item.localValue}</td><td className="px-4 py-3 font-bold text-emerald-700">{item.sieValue ?? '—'}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : item.status === 'FAILED' ? 'bg-red-50 text-[#B91329]' : 'bg-amber-50 text-amber-700'}`}>{statusLabels[item.status]}</span></td></tr>)}</tbody></table></div> : <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">Crea calificaciones desde el módulo académico y ejecuta una verificación local.</div>}</section>
    </div>
  </div>;
}

function Metric({ icon, label, value, tone = 'orange' }: { icon: ReactNode; label: string; value: string; tone?: 'orange' | 'green' | 'red' | 'amber' }) {
  const colors = { orange: 'text-[#F37022] bg-[#fff9e5]', green: 'text-emerald-600 bg-emerald-50', red: 'text-[#B91329] bg-red-50', amber: 'text-amber-600 bg-amber-50' };
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><span className={`rounded-lg p-2 ${colors[tone]}`}>{icon}</span></div><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p></div>;
}
