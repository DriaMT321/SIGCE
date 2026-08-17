import { useQuery } from '@tanstack/react-query';
import { History, Loader2, Shield } from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';

export const AuditPage = () => {
  const auditQuery = useQuery({ queryKey: ['audit'], queryFn: academicApi.listAudit });
  const logs = auditQuery.data?.data ?? [];

  return <div className="space-y-6">
    <div className="border-b border-slate-200 pb-5"><h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900"><History className="h-6 w-6 text-[#B91329]" />Bitácora de auditoría</h1><p className="mt-1 text-sm text-slate-600">Trazabilidad de cambios académicos, autenticación y sincronizaciones.</p></div>
    <div className="flex items-center gap-3 rounded-2xl border border-[#F8C311]/40 bg-[#fff9e5] p-4 text-sm text-slate-700"><Shield className="h-5 w-5 text-[#B91329]" />Los cambios se registran desde la capa de aplicación con usuario, acción, entidad y valores anteriores/nuevos.</div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{auditQuery.isLoading ? <div className="flex justify-center p-10 text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando bitácora...</div> : auditQuery.isError ? <p className="p-10 text-center text-[#B91329]">No se pudo cargar la bitácora.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Acción</th><th className="px-5 py-3">Entidad</th><th className="px-5 py-3">Usuario</th><th className="px-5 py-3">Detalle</th></tr></thead><tbody className="divide-y divide-slate-100">{logs.map((log) => <tr key={log.id} className="hover:bg-[#fff9e5]"><td className="px-5 py-4 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString('es-BO')}</td><td className="px-5 py-4"><span className="rounded-md bg-[#fff5eb] px-2 py-1 text-xs font-bold text-[#B91329]">{log.action}</span></td><td className="px-5 py-4 font-semibold text-slate-800">{log.entity}<span className="block font-mono text-xs font-normal text-slate-400">{log.entityId.slice(0, 8)}</span></td><td className="px-5 py-4 font-mono text-xs text-slate-500">{log.userId?.slice(0, 8) ?? 'Sistema'}</td><td className="max-w-sm truncate px-5 py-4 text-xs text-slate-500">{log.newValue ? JSON.stringify(log.newValue) : '—'}</td></tr>)}</tbody></table>{logs.length === 0 && <p className="p-10 text-center text-sm text-slate-500">No hay eventos de auditoría.</p>}</div>}</div>
  </div>;
};
