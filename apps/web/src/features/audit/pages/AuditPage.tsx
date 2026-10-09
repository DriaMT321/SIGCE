import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  RefreshCw,
  Download,
  Copy,
  Check,
  ChevronRight,
  X,
  FileCode,
  Clock,
  User,
  AlertTriangle,
  PlusCircle,
  Edit3,
  Trash2,
  Database,
} from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';
import { Button } from '../../../components/ui/button';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string | null;
  reason?: string | null;
  correlationId?: string | null;
  previousValue: unknown | null;
  newValue: unknown | null;
  createdAt: string;
}

export const AuditPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const auditQuery = useQuery({
    queryKey: ['audit'],
    queryFn: () => academicApi.listAudit(),
    refetchInterval: 30000,
  });

  const logs: AuditLog[] = useMemo(() => {
    return (auditQuery.data?.data ?? []) as AuditLog[];
  }, [auditQuery.data]);

  const availableEntities = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.entity) set.add(log.entity);
    });
    return Array.from(set).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'ALL' || log.action.toUpperCase() === actionFilter;
      const matchesEntity = entityFilter === 'ALL' || log.entity === entityFilter;

      if (!matchesAction || !matchesEntity) return false;

      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const entityMatch = log.entity?.toLowerCase().includes(query);
      const entityIdMatch = log.entityId?.toLowerCase().includes(query);
      const actionMatch = log.action?.toLowerCase().includes(query);
      const userMatch = (log.userId ?? 'sistema').toLowerCase().includes(query);
      const payloadMatch =
        JSON.stringify(log.newValue ?? '').toLowerCase().includes(query) ||
        JSON.stringify(log.previousValue ?? '').toLowerCase().includes(query);

      return entityMatch || entityIdMatch || actionMatch || userMatch || payloadMatch;
    });
  }, [logs, actionFilter, entityFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = logs.length;
    const creates = logs.filter((l) => l.action.toUpperCase().includes('CREATE') || l.action.toUpperCase().includes('INSERT')).length;
    const updates = logs.filter((l) => l.action.toUpperCase().includes('UPDATE') || l.action.toUpperCase().includes('PATCH')).length;
    const deletes = logs.filter((l) => l.action.toUpperCase().includes('DELETE') || l.action.toUpperCase().includes('REMOVE')).length;
    const syncs = logs.filter((l) => l.action.toUpperCase().includes('SYNC')).length;
    return { total, creates, updates, deletes, syncs };
  }, [logs]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (!logs.length) return;

    const headers = ['ID', 'Fecha_Hora', 'Accion', 'Entidad', 'Entidad_ID', 'Usuario_ID', 'Motivo', 'Correlation_ID', 'Valor_Anterior', 'Nuevo_Valor'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toISOString()}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.entityId}"`,
      `"${l.userId ?? 'SYSTEM'}"`,
      `"${(l.reason ?? '').replace(/"/g, '""')}"`,
      `"${(l.correlationId ?? '').replace(/"/g, '""')}"`,
      `"${JSON.stringify(l.previousValue ?? '').replace(/"/g, '""')}"`,
      `"${JSON.stringify(l.newValue ?? '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sigce_auditoria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderActionBadge = (action: string) => {
    const upper = action.toUpperCase();
    if (upper.includes('CREATE') || upper.includes('INSERT')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <PlusCircle className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (upper.includes('UPDATE') || upper.includes('PATCH') || upper.includes('EDIT')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          <Edit3 className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (upper.includes('DELETE') || upper.includes('REMOVE')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
          <Trash2 className="w-3 h-3" />
          {action}
        </span>
      );
    }
    if (upper.includes('SYNC')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          <RefreshCw className="w-3 h-3" />
          {action}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
        {action}
      </span>
    );
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Hace unos segundos';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      return `Hace ${diffDays} días`;
    } catch {
      return 'Reciente';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Auditoría</h1>
          <p className="text-sm text-slate-500 mt-0.5">Bitácora de trazabilidad y control de integridad</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => auditQuery.refetch()}
            disabled={auditQuery.isFetching}
            className="gap-2 text-sm text-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${auditQuery.isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>

          <Button
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Stats - Clean */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-900' },
          { label: 'Altas', value: stats.creates, color: 'text-emerald-600' },
          { label: 'Cambios', value: stats.updates, color: 'text-amber-600' },
          { label: 'Bajas', value: stats.deletes, color: 'text-rose-600' },
          { label: 'Sincronías', value: stats.syncs, color: 'text-blue-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</span>
            <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por entidad, ID, usuario o contenido..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="ALL">Todas las acciones</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="SYNC">SYNC</option>
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="ALL">Todas las entidades</option>
              {availableEntities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {auditQuery.isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Cargando registros...</span>
          </div>
        ) : auditQuery.isError ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="font-medium text-slate-900">No se pudo cargar la bitácora</p>
            <p className="text-sm text-slate-500 mt-1">Ocurrió un error al contactar al servicio.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => auditQuery.refetch()}
              className="mt-4 gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Acción</th>
                  <th className="px-5 py-3">Entidad</th>
                  <th className="px-5 py-3">Operador</th>
                  <th className="px-5 py-3">Resumen</th>
                  <th className="px-5 py-3 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const dateObj = new Date(log.createdAt);
                  const isCopied = copiedId === log.entityId;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-mono text-xs font-medium text-slate-800 tabular-nums">
                              {dateObj.toLocaleDateString('es-BO', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}{' '}
                              <span className="text-slate-500">
                                {dateObj.toLocaleTimeString('es-BO', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">
                              {formatRelativeTime(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {renderActionBadge(log.action)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 text-xs">
                            {log.entity}
                          </span>
                          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                            <span className="max-w-[130px] truncate" title={log.entityId}>
                              {log.entityId}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(log.entityId, log.entityId);
                              }}
                              className="text-slate-400 hover:text-slate-600"
                              title="Copiar ID"
                            >
                              {isCopied ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            {log.userId ? (
                              <User className="w-3.5 h-3.5" />
                            ) : (
                              <Database className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-700">
                              {log.userId ? 'Usuario' : 'Sistema'}
                            </p>
                            <span className="font-mono text-xs text-slate-400">
                              {log.userId ? log.userId.slice(0, 12) + '...' : 'Automático'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <div className="space-y-1">
                          {log.reason && (
                            <div className="text-xs text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 font-medium truncate border border-amber-200" title={log.reason}>
                              Motivo: {log.reason}
                            </div>
                          )}
                          <div className="text-xs text-slate-600 truncate font-mono bg-slate-50 rounded-md px-2 py-1 border border-slate-100">
                            {log.newValue ? (
                              JSON.stringify(log.newValue)
                            ) : log.previousValue ? (
                              <span className="text-rose-600">Eliminado: {JSON.stringify(log.previousValue)}</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </div>
                          {log.correlationId && (
                            <span className="inline-block text-[10px] font-mono text-slate-400 truncate max-w-[150px]" title={`CID: ${log.correlationId}`}>
                              CID: {log.correlationId.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end text-slate-400">
                          <span className="text-xs font-medium mr-1 opacity-0 group-hover:opacity-100">
                            Ver
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <Search className="w-8 h-8 text-slate-300 mb-2" />
                <p className="font-medium text-slate-800">No se encontraron eventos</p>
                <p className="text-sm text-slate-500 max-w-sm mt-1">
                  Ningún registro coincide con la búsqueda o filtros.
                </p>
                {(searchTerm || actionFilter !== 'ALL' || entityFilter !== 'ALL') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setActionFilter('ALL');
                      setEntityFilter('ALL');
                    }}
                    className="mt-3 text-sm"
                  >
                    Restablecer filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-500">
          <span>
            Mostrando <strong className="font-semibold text-slate-800">{filteredLogs.length}</strong> de{' '}
            <strong className="font-semibold text-slate-800">{logs.length}</strong> eventos
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Inspección de Transacción
                    {renderActionBadge(selectedLog.action)}
                  </h2>
                  <p className="text-xs font-mono text-slate-500">
                    ID: {selectedLog.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Entidad</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">{selectedLog.entity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">ID Recurso</span>
                  <span className="font-mono text-slate-700 mt-0.5 block truncate">{selectedLog.entityId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Operador</span>
                  <span className="font-mono text-slate-700 mt-0.5 block truncate">
                    {selectedLog.userId ?? 'Sistema'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Fecha</span>
                  <span className="font-mono text-slate-700 mt-0.5 block">
                    {new Date(selectedLog.createdAt).toLocaleString('es-BO')}
                  </span>
                </div>
              </div>

              {selectedLog.reason && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
                  <span className="font-bold block uppercase tracking-wide text-amber-800 mb-0.5">
                    Motivo / Justificación Registrada:
                  </span>
                  <p className="leading-relaxed font-medium">{selectedLog.reason}</p>
                </div>
              )}

              {selectedLog.correlationId && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
                  <span className="text-slate-500 font-medium">Correlation ID (Trazabilidad):</span>
                  <div className="flex items-center gap-2 font-mono text-slate-700">
                    <span>{selectedLog.correlationId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedLog.correlationId!, 'cid')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copiedId === 'cid' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Comparativa de Carga Útil
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(
                        JSON.stringify(
                          {
                            previous: selectedLog.previousValue,
                            new: selectedLog.newValue,
                          },
                          null,
                          2
                        ),
                        'full-diff'
                      )
                    }
                    className="h-7 text-xs gap-1.5 font-mono"
                  >
                    {copiedId === 'full-diff' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    Copiar JSON
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Estado Anterior
                      </span>
                    </div>
                    <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-3.5 max-h-64 overflow-y-auto font-mono text-xs text-rose-950">
                      {selectedLog.previousValue ? (
                        <pre className="whitespace-pre-wrap break-all leading-relaxed">
                          {JSON.stringify(selectedLog.previousValue, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-400 italic">No había estado previo.</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Nuevo Estado
                      </span>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-3.5 max-h-64 overflow-y-auto font-mono text-xs text-emerald-950">
                      {selectedLog.newValue ? (
                        <pre className="whitespace-pre-wrap break-all leading-relaxed">
                          {JSON.stringify(selectedLog.newValue, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-400 italic">El recurso fue eliminado.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
