import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  GraduationCap,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { academicApi } from '../../../lib/academic-api';
import { apiClient } from '../../../lib/api-client';
import { getSocket } from '../../../lib/socket';
import { sieSyncStatusEventSchema } from '../schemas/sie-sync.schema';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  QUEUED: 'En cola',
  PROCESSING: 'Procesando',
  VERIFIED: 'Verificada',
  FAILED: 'Fallida',
  CANCELLED: 'Cancelada',
};

export interface SubjectGradeComparison {
  sieSubject: string;
  sigceSubject?: string;
  sieGrade1T?: number | null;
  sigceGrade1T?: number | null;
  sieGrade2T?: number | null;
  status: 'COINCIDE' | 'DISCREPANCIA' | 'SOLO_EN_SIE' | 'SOLO_EN_SIGCE';
  diff?: number;
}

export interface StudentComparisonResult {
  rude: string;
  studentName: string;
  courseName: string;
  level?: string;
  grade?: string;
  parallel?: string;
  turn?: string;
  comparisons: SubjectGradeComparison[];
  overallMatch: boolean;
  totalSubjectsMatched: number;
  totalDiscrepancies: number;
  sieAverage: number;
  sigceAverage: number;
}

export interface AuditSummary {
  totalStudents: number;
  totalExactMatches: number;
  totalWithDiscrepancies: number;
  matchPercentage: number;
  sieAverage: number;
  sigceAverage: number;
  auditedCoursesCount: number;
  auditedAt: string;
}

export interface AuditResponseData {
  hasData: boolean;
  summary: AuditSummary | null;
  students: StudentComparisonResult[];
  auditedAt?: string;
  reportFile?: string;
}

export function SieSyncDashboardPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'audit' | 'queue'>('audit');

  const [sieUsername, setSieUsername] = useState('2967609');
  const [siePassword, setSiePassword] = useState('Olaa@mar123*');
  const [showPassword, setShowPassword] = useState(false);
  const [visualMode, setVisualMode] = useState(true);
  const [courseFilter, setCourseFilter] = useState('Quinto');
  const [maxCourses, setMaxCourses] = useState(4);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DISCREPANCIAS' | 'COINCIDENCIAS' | 'SOLO_SIGCE'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentComparisonResult | null>(null);
  const [copiedRude, setCopiedRude] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<string>();
  const [liveStatus, setLiveStatus] = useState('EN ESPERA');

  const auditQuery = useQuery({
    queryKey: ['sie-audit-latest'],
    queryFn: async () => {
      const res = await apiClient.get('/sie-sync/audit/latest');
      return res.data?.data as AuditResponseData;
    },
    refetchInterval: false,
  });

  const executeAuditMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/sie-sync/audit/execute', {
        courseFilter,
        maxCourses: Number(maxCourses),
        visualMode,
        username: sieUsername,
        password: siePassword,
      });
      return res.data?.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sie-audit-latest'] });
    },
  });

  const syncQuery = useQuery({
    queryKey: ['sie-sync'],
    queryFn: academicApi.listSieSynchronizations,
    refetchInterval: 5000,
  });

  const synchronizations = syncQuery.data?.data ?? [];
  const selectedQueue = synchronizations.find((item) => item.id === activeId) ?? synchronizations[0];
  const queueItems = selectedQueue?.items ?? [];

  const queueCounters = useMemo(
    () => ({
      verified: queueItems.filter((item) => item.status === 'VERIFIED').length,
      failed: queueItems.filter((item) => item.status === 'FAILED').length,
      pending: queueItems.filter((item) => ['PENDING', 'QUEUED', 'PROCESSING'].includes(item.status)).length,
    }),
    [queueItems],
  );

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

  const handleOpenSieWindow = () => {
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const halfWidth = Math.floor(screenWidth / 2);

    const windowFeatures = [
      `left=${halfWidth}`,
      `top=0`,
      `width=${halfWidth}`,
      `height=${screenHeight}`,
      `menubar=yes`,
      `toolbar=yes`,
      `location=yes`,
      `status=yes`,
      `resizable=yes`,
      `scrollbars=yes`,
    ].join(',');

    const parallelWin = window.open('https://academico.sie.gob.bo/acceso/principal/', 'SieParallelPortal', windowFeatures);
    if (parallelWin) parallelWin.focus();
  };

  const handleCopyRude = (rude: string) => {
    navigator.clipboard.writeText(rude);
    setCopiedRude(rude);
    setTimeout(() => setCopiedRude(null), 2000);
  };

  const handleExportJSON = () => {
    if (!auditQuery.data?.students) return;
    const blob = new Blob([JSON.stringify(auditQuery.data.students, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_calificaciones_sie_sigce_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!auditQuery.data?.students || !auditQuery.data?.summary) return;
    const s = auditQuery.data.summary;
    let md = `# Reporte de Auditoría de Calificaciones: SIE vs SIGCE\n\n`;
    md += `**Fecha**: ${new Date().toLocaleString()}\n`;
    md += `**Total Alumnos**: ${s.totalStudents}\n`;
    md += `**Coincidencias Exactas**: ${s.totalExactMatches} (${s.matchPercentage}%)\n`;
    md += `**Con Discrepancias**: ${s.totalWithDiscrepancies}\n\n`;
    md += `| RUDE | Estudiante | Curso | Promedio SIE | Promedio SIGCE | Discrepancias | Estado |\n`;
    md += `|---|---|---|---|---|---|---|\n`;
    for (const c of auditQuery.data.students) {
      const st = c.overallMatch ? 'COINCIDE' : c.totalDiscrepancies > 0 ? `DISCREPANCIA (${c.totalDiscrepancies})` : 'SOLO_SIE';
      md += `| ${c.rude} | ${c.studentName} | ${c.courseName} | ${c.sieAverage} pts | ${c.sigceAverage} pts | ${c.totalDiscrepancies} | ${st} |\n`;
    }
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_calificaciones_sie_sigce_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const auditData = auditQuery.data;
  const summary = auditData?.summary;
  const students = auditData?.students ?? [];

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !searchTerm.trim() ||
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rude.includes(searchTerm) ||
        s.courseName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter === 'DISCREPANCIAS') return s.totalDiscrepancies > 0;
      if (statusFilter === 'COINCIDENCIAS') return s.overallMatch;
      if (statusFilter === 'SOLO_SIGCE') return s.sieAverage === 0 && s.sigceAverage > 0;

      return true;
    });
  }, [students, searchTerm, statusFilter]);

  const isAuditing = executeAuditMutation.isPending;

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Sincronización SIE</h1>
          <p className="text-sm text-slate-500 mt-0.5">Conciliación y cuadre de calificaciones</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenSieWindow}
            className="gap-1.5 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Ventana SIE
          </Button>

          {auditData?.hasData && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="gap-1.5 text-sm"
            >
              <Download className="w-4 h-4" />
              Reporte
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => executeAuditMutation.mutate()}
            disabled={isAuditing || !sieUsername.trim() || !siePassword.trim()}
            className="gap-1.5 text-sm bg-brand-600 hover:bg-brand-700"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Ejecutando...' : 'Iniciar Auditoría'}
          </Button>
        </div>
      </div>

      {/* Read-only Banner - Simplified */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-emerald-900">Auditoría de Solo Lectura</p>
          <p className="text-emerald-700">
            El robot RPA únicamente lee las notas del portal ministerial. No se emiten modificaciones.
          </p>
        </div>
      </div>

      {/* Tabs - Clean */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Auditoría
          {summary && (
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-mono ${
              activeTab === 'audit' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {summary.totalStudents}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'queue'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          Cola RPA
          <span className="ml-1 text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {liveStatus}
          </span>
        </button>
      </div>

      {activeTab === 'audit' ? (
        <div className="space-y-5">
          {/* Configuration Panel - Clean */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Configuración</h2>
                  <p className="text-xs text-slate-500">Credenciales y parámetros de navegación</p>
                </div>
              </div>
              {summary?.auditedAt && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Clock3 className="w-3.5 h-3.5" />
                  Corte: {new Date(summary.auditedAt).toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Usuario SIE</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={sieUsername}
                    onChange={(e) => setSieUsername(e.target.value)}
                    placeholder="2967609"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-mono font-medium text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={siePassword}
                    onChange={(e) => setSiePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm font-mono font-medium text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Filtro de Curso</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    placeholder="Ej. Quinto, Sexto..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-medium text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Alcance</label>
                <select
                  value={maxCourses}
                  onChange={(e) => setMaxCourses(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-sm font-medium text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                >
                  <option value={1}>1 Curso</option>
                  <option value={4}>4 Cursos</option>
                  <option value={10}>10 Cursos</option>
                  <option value={30}>30 Cursos</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visualMode}
                  onChange={(e) => setVisualMode(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                Navegador visible
              </label>

              <button
                type="button"
                onClick={handleExportJSON}
                disabled={!auditData?.hasData}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                Descargar JSON
              </button>
            </div>
          </div>

          {/* Summary Cards - Clean */}
          {summary && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Auditados', value: summary.totalStudents, sub: `${summary.auditedCoursesCount} cursos`, color: 'text-slate-900' },
                { label: 'Coincidencias', value: summary.totalExactMatches, sub: `${summary.matchPercentage}%`, color: 'text-emerald-600' },
                { label: 'Discrepancias', value: summary.totalWithDiscrepancies, sub: 'Revisar', color: 'text-rose-600' },
                { label: 'Promedio SIE', value: summary.sieAverage, sub: `SIGCE: ${summary.sigceAverage}`, color: 'text-slate-900' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</span>
                  <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search and Filters - Clean */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, RUDE o curso..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-sm">
              {[
                { id: 'ALL' as const, label: 'Todos' },
                { id: 'DISCREPANCIAS' as const, label: 'Discrepancias' },
                { id: 'COINCIDENCIAS' as const, label: 'Coincidencias' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Table - Clean */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    <th className="py-3 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3">Curso</th>
                    <th className="px-3 py-3 text-center">SIE</th>
                    <th className="px-3 py-3 text-center">SIGCE</th>
                    <th className="px-3 py-3 text-center">Delta</th>
                    <th className="px-3 py-3 text-center">Estado</th>
                    <th className="py-3 pl-3 pr-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        {isAuditing ? (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                            <p className="font-medium text-slate-800">Ejecutando auditoría...</p>
                            <p className="text-sm text-slate-400">Verificando notas del portal SIE.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <GraduationCap className="w-8 h-8 text-slate-300" />
                            <p className="font-medium text-slate-700">No hay registros</p>
                            <p className="text-sm text-slate-400">Inicie una auditoría para cotejar notas.</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const diff = Math.round((st.sieAverage - st.sigceAverage) * 10) / 10;
                      return (
                        <tr key={st.rude} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 pl-5 pr-3">
                            <div className="font-semibold text-slate-900">{st.studentName}</div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-0.5">
                              <span>RUDE: {st.rude}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyRude(st.rude)}
                                className="text-slate-400 hover:text-slate-600"
                                title="Copiar RUDE"
                              >
                                {copiedRude === st.rude ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-3">
                            <span className="inline-block max-w-[200px] truncate text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                              {st.courseName}
                            </span>
                          </td>

                          <td className="px-3 py-3 text-center font-mono font-semibold text-slate-900">
                            {st.sieAverage > 0 ? st.sieAverage : '—'}
                          </td>

                          <td className="px-3 py-3 text-center font-mono font-semibold text-slate-900">
                            {st.sigceAverage > 0 ? st.sigceAverage : '—'}
                          </td>

                          <td className="px-3 py-3 text-center font-mono">
                            {st.sieAverage > 0 && st.sigceAverage > 0 ? (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${
                                  diff === 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : diff > 0
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="px-3 py-3 text-center">
                            {st.overallMatch ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                <CheckCircle2 className="w-3 h-3" />
                                Coincide
                              </span>
                            ) : st.totalDiscrepancies > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                                <AlertTriangle className="w-3 h-3" />
                                {st.totalDiscrepancies} Discrep.
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                Registrado
                              </span>
                            )}
                          </td>

                          <td className="py-3 pl-3 pr-5 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(st)}
                              className="h-7 text-xs px-2.5"
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Modal - Clean */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl border border-slate-200">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        {selectedStudent.studentName}
                      </h3>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <span>RUDE: <strong className="font-mono text-slate-700">{selectedStudent.rude}</strong></span>
                      <span>·</span>
                      <span>Curso: <strong className="text-slate-700">{selectedStudent.courseName}</strong></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-xs font-medium text-slate-400 block uppercase">Promedio SIE</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{selectedStudent.sieAverage}</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-xs font-medium text-slate-400 block uppercase">Promedio SIGCE</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{selectedStudent.sigceAverage}</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-xs font-medium text-slate-400 block uppercase">Discrepancias</span>
                    <span className={`text-xl font-bold font-mono ${selectedStudent.totalDiscrepancies > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedStudent.totalDiscrepancies}
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wide">
                        <th className="py-2.5 pl-3.5 pr-2">Asignatura SIE</th>
                        <th className="px-2 py-2.5">Materia SIGCE</th>
                        <th className="px-2 py-2.5 text-center">Nota SIE</th>
                        <th className="px-2 py-2.5 text-center">Nota SIGCE</th>
                        <th className="px-2 py-2.5 text-center">Delta</th>
                        <th className="py-2.5 pl-2 pr-3.5 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedStudent.comparisons.map((c, i) => {
                        const diffStr = c.diff !== undefined ? (c.diff > 0 ? `+${c.diff}` : `${c.diff}`) : '—';
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2.5 pl-3.5 pr-2 font-medium text-slate-800">{c.sieSubject}</td>
                            <td className="px-2 py-2.5 text-slate-600">{c.sigceSubject || '—'}</td>
                            <td className="px-2 py-2.5 text-center font-mono font-semibold text-slate-900">
                              {c.sieGrade1T ?? '—'}
                            </td>
                            <td className="px-2 py-2.5 text-center font-mono font-semibold text-slate-900">
                              {c.sigceGrade1T ?? '—'}
                            </td>
                            <td className="px-2 py-2.5 text-center font-mono">
                              {c.diff !== undefined ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                    c.diff === 0
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : c.diff > 0
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-rose-50 text-rose-700'
                                  }`}
                                >
                                  {diffStr}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-2.5 pl-2 pr-3.5 text-right font-medium">
                              {c.status === 'COINCIDE' ? (
                                <span className="text-emerald-700">Coincide</span>
                              ) : c.status === 'DISCREPANCIA' ? (
                                <span className="text-rose-600">Discrepancia</span>
                              ) : (
                                <span className="text-slate-500">Solo en SIE</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button type="button" size="sm" onClick={() => setSelectedStudent(null)} className="bg-slate-900 text-white">
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Queue Tab - Clean */
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'En Cola', value: queueCounters.pending, color: 'text-amber-600' },
              { label: 'Verificadas', value: queueCounters.verified, color: 'text-emerald-600' },
              { label: 'Fallidas', value: queueCounters.failed, color: 'text-rose-600' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</span>
                <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Historial de Sincronizaciones</h3>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">BullMQ</span>
            </div>
            <div className="mt-3 divide-y divide-slate-100">
              {synchronizations.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No hay ejecuciones registradas.</p>
              ) : (
                synchronizations.map((sync) => (
                  <div key={sync.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm font-mono">ID: {sync.id.slice(0, 8)}...</div>
                      <div className="text-xs text-slate-400">Tipo: {sync.syncType} · Estado: {sync.status}</div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{new Date(sync.createdAt).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
