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
import { Badge } from '../../../components/ui/badge';
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

  // Credenciales dinámicas para el Director
  const [sieUsername, setSieUsername] = useState('2967609');
  const [siePassword, setSiePassword] = useState('Olaa@mar123*');
  const [showPassword, setShowPassword] = useState(false);
  const [visualMode, setVisualMode] = useState(true);
  const [courseFilter, setCourseFilter] = useState('Quinto');
  const [maxCourses, setMaxCourses] = useState(4);

  // Filtros de tabla
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DISCREPANCIAS' | 'COINCIDENCIAS' | 'SOLO_SIGCE'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentComparisonResult | null>(null);
  const [copiedRude, setCopiedRude] = useState<string | null>(null);

  // Queue state
  const [activeId, setActiveId] = useState<string>();
  const [liveStatus, setLiveStatus] = useState('EN ESPERA');

  // Query de Auditoría
  const auditQuery = useQuery({
    queryKey: ['sie-audit-latest'],
    queryFn: async () => {
      const res = await apiClient.get('/sie-sync/audit/latest');
      return res.data?.data as AuditResponseData;
    },
    refetchInterval: false,
  });

  // Mutación de Auditoría en Vivo
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

  // Queue query
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
    <div className="space-y-6">
      {/* Encabezado Superior Institucional */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Módulo RPA & Cuadre SIE</span>
            </span>
            <Badge variant="success" className="gap-1 font-semibold">
              <Lock className="w-3 h-3" />
              Auditoría Segura (Solo Lectura)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Conciliación y Cuadre de Calificaciones SIE
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Inspección automatizada de actas oficiales en el portal ministerial y contraste directo contra el repositorio SIGCE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenSieWindow}
            className="h-9 gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Ventana Paralela SIE</span>
          </Button>

          {auditData?.hasData && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="h-9 gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar Reporte (.md)</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => executeAuditMutation.mutate()}
            disabled={isAuditing || !sieUsername.trim() || !siePassword.trim()}
            className="h-9 bg-brand-800 hover:bg-brand-900 text-white gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Escrapeando Portal SIE...' : 'Iniciar Auditoría en Vivo'}</span>
          </Button>
        </div>
      </div>

      {/* Banner de Garantía Estricta de Solo Lectura */}
      <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/60 p-4 flex items-start gap-3 text-emerald-950">
        <div className="rounded-xl bg-emerald-700 p-2 text-white shadow-2xs shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-emerald-900 text-sm">Garantía de Integridad: Auditoría de Solo Lectura</p>
          <p className="text-emerald-800/90 leading-relaxed">
            El robot RPA únicamente lee el modal oficial de notas (<code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[11px]">/estudiante_notas/</code>) del portal ministerial. No se emite ninguna orden de modificación ni cambio sobre los registros del SIE ni sobre la base de datos de SIGCE.
          </p>
        </div>
      </div>

      {/* Segmented Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Auditoría de Calificaciones (SIE vs SIGCE)</span>
          {summary && (
            <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'audit' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
            }`}>
              {summary.totalStudents}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Cola Asíncrona de Tareas RPA</span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {liveStatus}
          </span>
        </button>
      </div>

      {activeTab === 'audit' ? (
        <div className="space-y-6">
          {/* Panel de Configuración de Acceso */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-display">
                    Parámetros de Navegación y Credenciales SIE
                  </h2>
                  <p className="text-xs text-slate-500">
                    Credenciales temporales en memoria para iniciar sesión y navegar en academico.sie.gob.bo.
                  </p>
                </div>
              </div>
              {summary?.auditedAt && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                  Corte: {new Date(summary.auditedAt).toLocaleTimeString()}
                </span>
              )}
            </div>

            <div className="grid gap-3.5 sm:grid-cols-4">
              {/* Usuario */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Usuario SIE (C.I.)</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={sieUsername}
                    onChange={(e) => setSieUsername(e.target.value)}
                    placeholder="2967609"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2 pl-9 pr-3 text-xs font-mono font-semibold text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Contraseña SIE</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={siePassword}
                    onChange={(e) => setSiePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2 pl-9 pr-9 text-xs font-mono font-semibold text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
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

              {/* Filtro de Curso */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Filtro de Curso</label>
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    placeholder="Ej. Quinto, Sexto, Primaria..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Límite de Cursos */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Alcance de Cursos</label>
                <select
                  value={maxCourses}
                  onChange={(e) => setMaxCourses(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2 px-3 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
                >
                  <option value={1}>1 Curso (Muestra rápida)</option>
                  <option value={4}>4 Cursos (Recomendado)</option>
                  <option value={10}>10 Cursos</option>
                  <option value={30}>30 Cursos (Gestión completa)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={visualMode}
                  onChange={(e) => setVisualMode(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Ejecutar navegador en pantalla visible para supervisión visual</span>
              </label>

              <button
                type="button"
                onClick={handleExportJSON}
                disabled={!auditData?.hasData}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
              >
                Descargar Dataset (.json)
              </button>
            </div>
          </div>

          {/* Tarjetas de Métricas de Resumen */}
          {summary && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Alumnos Auditados
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 font-display tabular-nums">
                    {summary.totalStudents}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">en {summary.auditedCoursesCount} cursos</span>
                </div>
                <p className="text-[11px] text-slate-500">Cotejados asignatura por asignatura</p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Coincidencias 100%
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-emerald-700 font-display tabular-nums">
                    {summary.totalExactMatches}
                  </span>
                  <Badge variant="success" className="font-mono">
                    {summary.matchPercentage}%
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">Idéntica nota oficial en ambas fuentes</p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Con Discrepancias
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-rose-700 font-display tabular-nums">
                    {summary.totalWithDiscrepancies}
                  </span>
                  <Badge variant="danger" className="font-mono">
                    Revisar
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">Diferencias de transcripción o redondeo</p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Promedios Comparados
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">SIE</span>
                    <span className="text-xl font-bold text-slate-900 font-mono">{summary.sieAverage}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">SIGCE</span>
                    <span className="text-xl font-bold text-slate-900 font-mono">{summary.sigceAverage}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">DELTA</span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {(summary.sieAverage - summary.sigceAverage).toFixed(1)} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar & Filter Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, código RUDE o curso..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-slate-400 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Todos ({students.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('DISCREPANCIAS')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  statusFilter === 'DISCREPANCIAS'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                Discrepancias ({summary?.totalWithDiscrepancies ?? 0})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('COINCIDENCIAS')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  statusFilter === 'COINCIDENCIAS'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                Coincidencias ({summary?.totalExactMatches ?? 0})
              </button>
            </div>
          </div>

          {/* Tabla de Resultados de Auditoría */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3">Curso / Nivel</th>
                    <th className="px-3 py-3 text-center">Prom. SIE</th>
                    <th className="px-3 py-3 text-center">Prom. SIGCE</th>
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
                            <Loader2 className="w-6 h-6 animate-spin text-brand-700" />
                            <p className="font-semibold text-slate-800 text-sm">Escrapeando notas oficiales desde el portal SIE...</p>
                            <p className="text-xs text-slate-400">Verificando cada RUDE de forma segura sin escrituras.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <GraduationCap className="w-8 h-8 text-slate-300" />
                            <p className="font-semibold text-slate-700 text-sm">No hay registros de auditoría</p>
                            <p className="text-xs text-slate-400">Presione "Iniciar Auditoría en Vivo" para cotejar notas.</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const diff = Math.round((st.sieAverage - st.sigceAverage) * 10) / 10;
                      return (
                        <tr key={st.rude} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 pl-5 pr-3">
                            <div className="font-bold text-slate-900">{st.studentName}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                              <span>RUDE: {st.rude}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyRude(st.rude)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Copiar código RUDE"
                              >
                                {copiedRude === st.rude ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-3.5">
                            <span className="inline-block max-w-[200px] truncate text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              {st.courseName}
                            </span>
                          </td>

                          <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-900">
                            {st.sieAverage > 0 ? `${st.sieAverage}` : '—'}
                          </td>

                          <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-900">
                            {st.sigceAverage > 0 ? `${st.sigceAverage}` : '—'}
                          </td>

                          <td className="px-3 py-3.5 text-center font-mono">
                            {st.sieAverage > 0 && st.sigceAverage > 0 ? (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                  diff === 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : diff > 0
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {diff > 0 ? `+${diff}` : `${diff}`}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="px-3 py-3.5 text-center">
                            {st.overallMatch ? (
                              <Badge variant="success" className="gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> Coincide
                              </Badge>
                            ) : st.totalDiscrepancies > 0 ? (
                              <Badge variant="danger" className="gap-1 font-semibold">
                                <AlertTriangle className="w-3 h-3" /> {st.totalDiscrepancies} Discrep.
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-mono">
                                Registrado
                              </Badge>
                            )}
                          </td>

                          <td className="py-3.5 pl-3 pr-5 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(st)}
                              className="h-7 text-xs px-2.5"
                            >
                              <BookOpen className="w-3 h-3 mr-1 text-slate-500" />
                              Ver Materias
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

          {/* Modal de Detalle Materia por Materia */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
              <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {selectedStudent.studentName}
                      </h3>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>RUDE: <strong className="font-mono text-slate-700">{selectedStudent.rude}</strong></span>
                      <span>·</span>
                      <span>Curso: <strong className="text-slate-700">{selectedStudent.courseName}</strong></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Resumen de Notas en Modal */}
                <div className="my-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Promedio SIE</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{selectedStudent.sieAverage} pts</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Promedio SIGCE</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{selectedStudent.sigceAverage} pts</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Discrepancias</span>
                    <span className={`text-xl font-bold font-mono ${selectedStudent.totalDiscrepancies > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedStudent.totalDiscrepancies}
                    </span>
                  </div>
                </div>

                {/* Desglose Materia por Materia */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-2.5 pl-3.5 pr-2">Asignatura (SIE)</th>
                        <th className="px-2 py-2.5">Materia Mapeada (SIGCE)</th>
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
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="py-2.5 pl-3.5 pr-2 font-semibold text-slate-800">{c.sieSubject}</td>
                            <td className="px-2 py-2.5 text-slate-600">{c.sigceSubject || '—'}</td>
                            <td className="px-2 py-2.5 text-center font-mono font-bold text-slate-900">
                              {c.sieGrade1T ?? '—'}
                            </td>
                            <td className="px-2 py-2.5 text-center font-mono font-bold text-slate-900">
                              {c.sigceGrade1T ?? '—'}
                            </td>
                            <td className="px-2 py-2.5 text-center font-mono">
                              {c.diff !== undefined ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
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
                            <td className="py-2.5 pl-2 pr-3.5 text-right font-semibold">
                              {c.status === 'COINCIDE' ? (
                                <span className="text-emerald-700">✓ Coincide</span>
                              ) : c.status === 'DISCREPANCIA' ? (
                                <span className="text-rose-600">⚠️ Discrepancia</span>
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
                    Cerrar Detalle
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pestaña de Cola BullMQ */
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">En Cola / Procesando</span>
              <div className="mt-2 text-3xl font-bold font-mono text-amber-600 tabular-nums">{queueCounters.pending}</div>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verificadas Exitosas</span>
              <div className="mt-2 text-3xl font-bold font-mono text-emerald-600 tabular-nums">{queueCounters.verified}</div>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fallidas</span>
              <div className="mt-2 text-3xl font-bold font-mono text-rose-600 tabular-nums">{queueCounters.failed}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-display">Historial de Sincronizaciones RPA</h3>
              <Badge variant="outline" className="font-mono text-[10px]">BullMQ Redis</Badge>
            </div>
            <div className="mt-3 divide-y divide-slate-100">
              {synchronizations.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">No hay ejecuciones de sincronización registradas.</p>
              ) : (
                synchronizations.map((sync) => (
                  <div key={sync.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 text-xs font-mono">ID: {sync.id.slice(0, 8)}...</div>
                      <div className="text-[11px] text-slate-400">Tipo: {sync.syncType} · Estado: {sync.status}</div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{new Date(sync.createdAt).toLocaleString()}</span>
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
