import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  Shield,
  Search,
  Filter,
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
  Layers,
  Lock,
} from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string | null;
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
    queryFn: academicApi.listAudit,
    refetchInterval: 30000, // Background polling every 30s for security dashboard
  });

  const logs: AuditLog[] = useMemo(() => {
    return (auditQuery.data?.data ?? []) as AuditLog[];
  }, [auditQuery.data]);

  // Unique entities for filtering
  const availableEntities = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((log) => {
      if (log.entity) set.add(log.entity);
    });
    return Array.from(set).sort();
  }, [logs]);

  // Filtered logs
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

  // Statistics
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

    const headers = ['ID', 'Fecha_Hora', 'Accion', 'Entidad', 'Entidad_ID', 'Usuario_ID', 'Valor_Anterior', 'Nuevo_Valor'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toISOString()}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.entityId}"`,
      `"${l.userId ?? 'SYSTEM'}"`,
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
        <Badge variant="success" className="gap-1 font-mono text-[11px] font-semibold">
          <PlusCircle className="h-3 w-3" />
          {action}
        </Badge>
      );
    }
    if (upper.includes('UPDATE') || upper.includes('PATCH') || upper.includes('EDIT')) {
      return (
        <Badge variant="warning" className="gap-1 font-mono text-[11px] font-semibold">
          <Edit3 className="h-3 w-3" />
          {action}
        </Badge>
      );
    }
    if (upper.includes('DELETE') || upper.includes('REMOVE')) {
      return (
        <Badge variant="danger" className="gap-1 font-mono text-[11px] font-semibold">
          <Trash2 className="h-3 w-3" />
          {action}
        </Badge>
      );
    }
    if (upper.includes('SYNC')) {
      return (
        <Badge variant="info" className="gap-1 font-mono text-[11px] font-semibold">
          <RefreshCw className="h-3 w-3" />
          {action}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1 font-mono text-[11px] font-semibold">
        <Layers className="h-3 w-3" />
        {action}
      </Badge>
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/10 text-brand-crimson ring-1 ring-brand-crimson/20">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  Bitácora de Auditoría y Trazabilidad
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono text-slate-600 bg-slate-50 border-slate-200">
                  <Lock className="h-3 w-3 mr-1 text-slate-400" />
                  Registro Inmutable
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Auditoría forense de transacciones, modificaciones de calificaciones, matrículas y sincronizaciones SIE.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => auditQuery.refetch()}
            disabled={auditQuery.isFetching}
            className="gap-2 text-slate-700 hover:text-slate-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${auditQuery.isFetching ? 'animate-spin text-brand-crimson' : ''}`} />
            <span>Actualizar</span>
          </Button>

          <Button
            variant="brand"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="gap-2 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </div>

      {/* Normative Security Notice */}
      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-amber-50/40 to-white p-4 text-xs text-slate-700 shadow-xs flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800 shrink-0 mt-0.5">
          <Shield className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">
            Mecanismo de No-Repudio y Control de Integridad Académica
          </p>
          <p className="text-slate-600 leading-relaxed">
            Conforme a la normativa ministerial de gestión de datos educativos, cada mutación de datos en el sistema
            registra obligatoriamente la identidad del operador (Docente, Secretaría o Dirección), la estampa de tiempo sincronizada,
            el estado anterior del recurso y la nueva carga útil generada para fines de fiscalización institucional.
          </p>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Eventos</span>
            <Database className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-display tabular-nums">
            {stats.total}
          </p>
          <span className="text-[11px] text-slate-400 font-mono">En bitácora activa</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700">Altas (CREATE)</span>
            <PlusCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700 font-display tabular-nums">
            {stats.creates}
          </p>
          <span className="text-[11px] text-emerald-600 font-mono">Nuevas inserciones</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700">Cambios (UPDATE)</span>
            <Edit3 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-700 font-display tabular-nums">
            {stats.updates}
          </p>
          <span className="text-[11px] text-amber-600 font-mono">Ediciones de registro</span>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700">Bajas (DELETE)</span>
            <Trash2 className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-rose-700 font-display tabular-nums">
            {stats.deletes}
          </p>
          <span className="text-[11px] text-rose-600 font-mono">Eliminaciones críticas</span>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sky-700">Sincronías (RPA)</span>
            <RefreshCw className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-sky-700 font-display tabular-nums">
            {stats.syncs}
          </p>
          <span className="text-[11px] text-sky-600 font-mono">Integraciones SIE</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por entidad, ID, usuario o contenido de carga útil..."
            className="h-10 w-full rounded-xl border border-input bg-slate-50/50 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-brand-crimson focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-crimson"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Acción:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-brand-crimson focus:outline-hidden"
            >
              <option value="ALL">Todas las acciones</option>
              <option value="CREATE">CREATE (Altas)</option>
              <option value="UPDATE">UPDATE (Modificaciones)</option>
              <option value="DELETE">DELETE (Bajas)</option>
              <option value="SYNC">SYNC (Sincronizaciones)</option>
            </select>
          </div>

          {/* Entity Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Entidad:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-brand-crimson focus:outline-hidden"
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

      {/* Main Audit Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xs">
        {auditQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-crimson mb-3" />
            <p className="text-sm font-medium text-slate-700">Cargando registros de auditoría...</p>
            <p className="text-xs text-slate-400 mt-1">Verificando firma criptográfica e integridad de bitácora.</p>
          </div>
        ) : auditQuery.isError ? (
          <div className="p-12 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
            <p className="font-semibold text-slate-900">No se pudo cargar la bitácora</p>
            <p className="text-xs text-slate-500 mt-1">Ocurrió un error al contactar al servicio de auditoría.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => auditQuery.refetch()}
              className="mt-4 gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reintentar
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-border">
                <tr>
                  <th className="px-5 py-3.5">Estampa de Tiempo</th>
                  <th className="px-5 py-3.5">Acción</th>
                  <th className="px-5 py-3.5">Entidad Afectada</th>
                  <th className="px-5 py-3.5">Operador Responsable</th>
                  <th className="px-5 py-3.5">Resumen de Cambio</th>
                  <th className="px-5 py-3.5 text-right">Detalle</th>
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
                      className="cursor-pointer transition-colors hover:bg-slate-50/80 group"
                    >
                      {/* Timestamp */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-2.5">
                          <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
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
                            <span className="text-[11px] text-slate-400">
                              {formatRelativeTime(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {renderActionBadge(log.action)}
                      </td>

                      {/* Entity */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 text-xs">
                            {log.entity}
                          </span>
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                            <span className="max-w-[130px] truncate" title={log.entityId}>
                              {log.entityId}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(log.entityId, log.entityId);
                              }}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                              title="Copiar ID"
                            >
                              {isCopied ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Operator / User */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-semibold">
                            {log.userId ? (
                              <User className="h-3.5 w-3.5 text-slate-600" />
                            ) : (
                              <Shield className="h-3.5 w-3.5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-700">
                              {log.userId ? 'Usuario Autenticado' : 'Sistema Automático'}
                            </p>
                            <span className="font-mono text-[11px] text-slate-400">
                              {log.userId ? log.userId.slice(0, 12) + '...' : 'SIE/Cron Task'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Summary of changes */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="text-xs text-slate-600 truncate font-mono bg-slate-50 rounded-md px-2 py-1 border border-slate-100">
                          {log.newValue ? (
                            JSON.stringify(log.newValue)
                          ) : log.previousValue ? (
                            <span className="text-rose-600">Eliminado: {JSON.stringify(log.previousValue)}</span>
                          ) : (
                            <span className="text-slate-400">— Sin payload —</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end text-slate-400 group-hover:text-brand-crimson transition-colors">
                          <span className="text-xs font-medium mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Inspeccionar
                          </span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <Search className="h-8 w-8 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-800">No se encontraron eventos</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Ningún registro coincide con el término de búsqueda o filtros seleccionados.
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
                    className="mt-3 text-xs"
                  >
                    Restablecer filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer with counts */}
        <div className="flex items-center justify-between border-t border-border bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
          <span>
            Mostrando <strong className="font-semibold text-slate-800">{filteredLogs.length}</strong> de{' '}
            <strong className="font-semibold text-slate-800">{logs.length}</strong> eventos registrados
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            ISO/IEC 27001 Audit Ready
          </span>
        </div>
      </div>

      {/* Inspector Modal (JSON Diff Viewer) */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-crimson/10 text-brand-crimson">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                    Inspección de Transacción
                    {renderActionBadge(selectedLog.action)}
                  </h2>
                  <p className="text-xs font-mono text-slate-500">
                    ID Transacción: {selectedLog.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Metadata Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-border bg-slate-50/60 p-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Entidad</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedLog.entity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">ID del Recurso</span>
                  <span className="font-mono text-slate-700 mt-0.5 block truncate" title={selectedLog.entityId}>
                    {selectedLog.entityId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Operador</span>
                  <span className="font-mono text-slate-700 mt-0.5 block truncate">
                    {selectedLog.userId ?? 'Sistema (Automático)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fecha y Hora</span>
                  <span className="font-mono text-slate-700 mt-0.5 block tabular-nums">
                    {new Date(selectedLog.createdAt).toLocaleString('es-BO')}
                  </span>
                </div>
              </div>

              {/* Diff View */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span>Comparativa de Carga Útil (Diff)</span>
                  </h3>
                  <div className="flex items-center gap-2">
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
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Copiar JSON</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Previous State */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-700 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Estado Anterior (Previous)
                      </span>
                      {selectedLog.previousValue ? (
                        <span className="text-[11px] text-slate-400 font-mono">Modificado</span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Nulo / Creación</span>
                      )}
                    </div>
                    <div className="rounded-xl border border-rose-200/80 bg-rose-50/30 p-3.5 max-h-64 overflow-y-auto font-mono text-xs text-rose-950">
                      {selectedLog.previousValue ? (
                        <pre className="whitespace-pre-wrap break-all leading-relaxed">
                          {JSON.stringify(selectedLog.previousValue, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-400 italic">No había estado previo registrado.</span>
                      )}
                    </div>
                  </div>

                  {/* New State */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Nuevo Estado (New Value)
                      </span>
                      {selectedLog.newValue ? (
                        <span className="text-[11px] text-emerald-600 font-mono">Aplicado</span>
                      ) : (
                        <span className="text-[11px] text-rose-500 font-mono">Eliminado</span>
                      )}
                    </div>
                    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3.5 max-h-64 overflow-y-auto font-mono text-xs text-emerald-950">
                      {selectedLog.newValue ? (
                        <pre className="whitespace-pre-wrap break-all leading-relaxed">
                          {JSON.stringify(selectedLog.newValue, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-slate-400 italic">El recurso fue dado de baja.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative Security Stamp */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 flex items-center gap-2 font-mono">
                <Shield className="h-4 w-4 text-brand-crimson shrink-0" />
                <span>
                  Registro criptográficamente indexado en el clúster de base de datos de SIGCE con aislamiento multi-inquilino.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border bg-slate-50/80 px-6 py-3.5">
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
