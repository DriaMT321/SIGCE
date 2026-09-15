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

  // Filtrado de estudiantes para la tabla
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
      {/* Encabezado Superior */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900">
              <RefreshCw className="h-6 w-6 text-[#F37022]" />
              Auditoría y Cuadre de Calificaciones SIE
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              SOLO LECTURA
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Escrapeo seguro de notas oficiales en el portal SIE y contrastación en tiempo real contra la base de datos de SIGCE.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenSieWindow}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ventana Paralela SIE
          </Button>

          {auditData?.hasData && (
            <Button
              type="button"
              variant="outline"
              onClick={handleExportMarkdown}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Reporte (.md)
            </Button>
          )}

          <Button
            type="button"
            onClick={() => executeAuditMutation.mutate()}
            disabled={isAuditing || !sieUsername.trim() || !siePassword.trim()}
            className="bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white shadow-md transition hover:opacity-95"
          >
            <RefreshCw className={isAuditing ? 'mr-2 h-4 w-4 animate-spin' : 'mr-2 h-4 w-4'} />
            {isAuditing ? 'Escrapeando y Comparando...' : 'Iniciar Auditoría en Vivo'}
          </Button>
        </div>
      </div>

      {/* Banner de Garantía Estricta de Solo Lectura */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm flex items-start gap-3.5 text-emerald-900">
        <div className="rounded-xl bg-emerald-600 p-2 text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex-1 text-xs">
          <p className="font-bold text-emerald-950 text-sm">Garantía de Integridad: Prohibido Modificar Notas</p>
          <p className="mt-0.5 text-emerald-800 leading-relaxed">
            Este sistema únicamente lee el modal oficial de calificaciones (<code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">/estudiante_notas/</code>) del portal ministerial. No se envía ninguna orden de actualización, mutación ni cambio hacia el SIE ni hacia la base de datos de SIGCE.
          </p>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            activeTab === 'audit'
              ? 'bg-[#F37022] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Auditoría de Calificaciones (SIE vs SIGCE)
          {summary && (
            <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {summary.totalStudents}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            activeTab === 'queue'
              ? 'bg-[#F37022] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server className="h-4 w-4" />
          Cola Asíncrona BullMQ / RPA
          <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
            {liveStatus}
          </span>
        </button>
      </div>

      {activeTab === 'audit' ? (
        <div className="space-y-6">
          {/* Panel de Configuración de la Auditoría */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-[#F37022]">
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Parámetros de Auditoría y Acceso Ministerial</h2>
                  <p className="text-xs text-slate-500">Credenciales temporales en memoria para iniciar sesión y navegar al SIE.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                {summary?.auditedAt && (
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                    Último corte: {new Date(summary.auditedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              {/* Usuario */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Usuario SIE (C.I.)</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={sieUsername}
                    onChange={(e) => setSieUsername(e.target.value)}
                    placeholder="2967609"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 pl-9 pr-3 text-sm font-semibold text-slate-900 focus:border-[#F37022] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Contraseña SIE</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={siePassword}
                    onChange={(e) => setSiePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 pl-9 pr-9 text-sm font-semibold text-slate-900 focus:border-[#F37022] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Filtro de Curso */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Filtro de Curso</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Filter className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    placeholder="Ej. Quinto, Sexto, Primaria..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 pl-9 pr-3 text-sm font-semibold text-slate-900 focus:border-[#F37022] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              {/* Máximo de Cursos */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Límite de Cursos</label>
                <div className="relative mt-1.5">
                  <select
                    value={maxCourses}
                    onChange={(e) => setMaxCourses(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-sm font-semibold text-slate-900 focus:border-[#F37022] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value={1}>1 Curso (Rápido)</option>
                    <option value={4}>4 Cursos (Recomendado)</option>
                    <option value={10}>10 Cursos</option>
                    <option value={30}>Todos los Cursos (Completo)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={visualMode}
                  onChange={(e) => setVisualMode(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#F37022] focus:ring-[#F37022]"
                />
                Ejecutar en ventana visible (Edge / Chrome en pantalla dividida)
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleExportJSON()}
                  disabled={!auditData?.hasData}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
                >
                  Exportar JSON
                </button>
              </div>
            </div>
          </div>

          {/* Tarjetas de Métricas de Resumen */}
          {summary && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alumnos Auditados</span>
                  <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{summary.totalStudents}</span>
                  <span className="text-xs font-medium text-slate-500">en {summary.auditedCoursesCount} cursos</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Cotejados materia por materia</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Coincidencias 100%</span>
                  <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-600">{summary.totalExactMatches}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {summary.matchPercentage}%
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Misma nota exacta en todas las materias</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Con Discrepancias</span>
                  <span className="rounded-lg bg-rose-50 p-2 text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-rose-600">{summary.totalWithDiscrepancies}</span>
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    Diferencias 1T
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Presentan diferencias puntuales en el SIE</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Comparativa Promedios</span>
                  <span className="rounded-lg bg-purple-50 p-2 text-purple-600">
                    <Award className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">PROM. SIE</span>
                    <span className="text-2xl font-black text-sky-600">{summary.sieAverage}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">PROM. SIGCE</span>
                    <span className="text-2xl font-black text-emerald-600">{summary.sigceAverage}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Diferencia neta:</span>
                  <span className={`font-bold ${summary.sieAverage >= summary.sigceAverage ? 'text-sky-600' : 'text-rose-600'}`}>
                    {(summary.sieAverage - summary.sigceAverage).toFixed(1)} pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Barra de Búsqueda y Filtros de Estado */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, RUDE o curso..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-[#F37022] focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Todos ({students.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('DISCREPANCIAS')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'DISCREPANCIAS'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                Con Discrepancias ({summary?.totalWithDiscrepancies ?? 0})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('COINCIDENCIAS')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === 'COINCIDENCIAS'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                Coincidencias ({summary?.totalExactMatches ?? 0})
              </button>
            </div>
          </div>

          {/* Tabla de Resultados de Auditoría */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 pl-6 pr-3">Estudiante</th>
                    <th className="px-3 py-3.5">Curso / Grado</th>
                    <th className="px-3 py-3.5 text-center">Prom. SIE (1T)</th>
                    <th className="px-3 py-3.5 text-center">Prom. SIGCE (1T)</th>
                    <th className="px-3 py-3.5 text-center">Diferencia</th>
                    <th className="px-3 py-3.5 text-center">Estado Auditoría</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        {isAuditing ? (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-[#F37022]" />
                            <p className="font-semibold text-slate-700">Escrapeando notas oficiales desde el portal ministerial...</p>
                            <p className="text-xs text-slate-400">Cotejando cada estudiante contra PostgreSQL de forma segura.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <GraduationCap className="h-8 w-8 text-slate-300" />
                            <p className="font-semibold text-slate-700">No hay registros para mostrar</p>
                            <p className="text-xs text-slate-400">Inicia una auditoría pulsando el botón superior.</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const diff = Math.round((st.sieAverage - st.sigceAverage) * 10) / 10;
                      return (
                        <tr key={st.rude} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 pl-6 pr-3">
                            <div className="font-bold text-slate-900">{st.studentName}</div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-0.5">
                              <span>RUDE: {st.rude}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyRude(st.rude)}
                                className="text-slate-400 hover:text-slate-600"
                                title="Copiar RUDE"
                              >
                                {copiedRude === st.rude ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-3.5">
                            <span className="inline-block max-w-[220px] truncate text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {st.courseName}
                            </span>
                          </td>

                          <td className="px-3 py-3.5 text-center font-bold text-sky-700">
                            {st.sieAverage > 0 ? `${st.sieAverage} pts` : '—'}
                          </td>

                          <td className="px-3 py-3.5 text-center font-bold text-emerald-700">
                            {st.sigceAverage > 0 ? `${st.sigceAverage} pts` : '—'}
                          </td>

                          <td className="px-3 py-3.5 text-center">
                            {st.sieAverage > 0 && st.sigceAverage > 0 ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-extrabold ${
                                  diff === 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : diff > 0
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {diff > 0 ? `+${diff}` : `${diff}`} pts
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>

                          <td className="px-3 py-3.5 text-center">
                            {st.overallMatch ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3" /> Coincide
                              </span>
                            ) : st.totalDiscrepancies > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                                <AlertTriangle className="h-3 w-3" /> {st.totalDiscrepancies} Discrepancias
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                Registrado
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 pl-3 pr-6 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStudent(st)}
                              className="border-slate-200 hover:bg-slate-100 text-xs font-semibold"
                            >
                              <BookOpen className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-orange-100 p-1.5 text-[#F37022]">
                        <BookOpen className="h-4 w-4" />
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{selectedStudent.studentName}</h3>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>RUDE: <b className="font-mono text-slate-700">{selectedStudent.rude}</b></span>
                      <span>•</span>
                      <span>Curso: <b className="text-slate-700">{selectedStudent.courseName}</b></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Resumen en Modal */}
                <div className="my-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-500 block">Promedio SIE (1T)</span>
                    <span className="text-xl font-black text-sky-600">{selectedStudent.sieAverage} pts</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-500 block">Promedio SIGCE (1T)</span>
                    <span className="text-xl font-black text-emerald-600">{selectedStudent.sigceAverage} pts</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-500 block">Discrepancias</span>
                    <span className={`text-xl font-black ${selectedStudent.totalDiscrepancies > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedStudent.totalDiscrepancies}
                    </span>
                  </div>
                </div>

                {/* Desglose Materia por Materia */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600">
                        <th className="py-2.5 pl-4 pr-2">Asignatura (SIE)</th>
                        <th className="px-2 py-2.5">Materia Mapeada (SIGCE)</th>
                        <th className="px-2 py-2.5 text-center">Nota SIE (1T)</th>
                        <th className="px-2 py-2.5 text-center">Nota SIGCE (1T)</th>
                        <th className="px-2 py-2.5 text-center">Diferencia</th>
                        <th className="py-2.5 pl-2 pr-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedStudent.comparisons.map((c, i) => {
                        const diffStr = c.diff !== undefined ? (c.diff > 0 ? `+${c.diff}` : `${c.diff}`) : '—';
                        return (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-2.5 pl-4 pr-2 font-semibold text-slate-800">{c.sieSubject}</td>
                            <td className="px-2 py-2.5 text-slate-600">{c.sigceSubject || '—'}</td>
                            <td className="px-2 py-2.5 text-center font-bold text-sky-700">
                              {c.sieGrade1T ?? '—'}
                            </td>
                            <td className="px-2 py-2.5 text-center font-bold text-emerald-700">
                              {c.sigceGrade1T ?? '—'}
                            </td>
                            <td className="px-2 py-2.5 text-center">
                              {c.diff !== undefined ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    c.diff === 0
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : c.diff > 0
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {diffStr}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-2.5 pl-2 pr-4 text-right font-bold">
                              {c.status === 'COINCIDE' ? (
                                <span className="text-emerald-700">✓ Coincide</span>
                              ) : c.status === 'DISCREPANCIA' ? (
                                <span className="text-rose-600">⚠️ Diferencia</span>
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
                  <Button type="button" onClick={() => setSelectedStudent(null)} className="bg-slate-900 text-white">
                    Cerrar Detalle
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pestaña de Cola BullMQ (Historial existente) */
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase text-slate-500">En Cola / Procesando</span>
              <div className="mt-2 text-3xl font-extrabold text-amber-600">{queueCounters.pending}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase text-slate-500">Verificadas Exitosas</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600">{queueCounters.verified}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase text-slate-500">Fallidas</span>
              <div className="mt-2 text-3xl font-extrabold text-rose-600">{queueCounters.failed}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Historial de Sincronizaciones</h3>
            <div className="mt-4 divide-y divide-slate-100">
              {synchronizations.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">No hay ejecuciones de sincronización registradas.</p>
              ) : (
                synchronizations.map((sync) => (
                  <div key={sync.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Sincronización ID: {sync.id.slice(0, 8)}...</div>
                      <div className="text-xs text-slate-400">Tipo: {sync.syncType} • Estado: {sync.status}</div>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(sync.createdAt).toLocaleString()}</span>
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
