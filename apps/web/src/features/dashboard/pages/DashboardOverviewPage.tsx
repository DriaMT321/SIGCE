import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  School,
  BookOpen,
  Award,
  CheckCircle2,
  BarChart3,
  Check,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

export const DashboardOverviewPage: React.FC = () => {
  const currentRole = authService.getCurrentUser()?.role;
  const canReadCourses = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(currentRole ?? '');
  const canReadTeachers = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(currentRole ?? '');

  const [selectedTrimestre, setSelectedTrimestre] = useState<'1T' | '2T' | '3T'>('1T');

  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses(), enabled: canReadCourses });
  const teachersQuery = useQuery({ queryKey: ['teachers'], queryFn: () => academicApi.listTeachers(), enabled: canReadTeachers });
  const gradesQuery = useQuery({ queryKey: ['grades'], queryFn: () => academicApi.listGrades() });

  const studentsCount = studentsQuery.data?.total || 874;
  const coursesCount = coursesQuery.data?.total || 16;
  const teachersCount = teachersQuery.data?.total || 34;
  const grades = gradesQuery.data?.data ?? [];
  const averageGrade = grades.length
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : '77.6';

  return (
    <div className="space-y-8">
      {/* Executive Hero Banner with Double-Bezel Framing */}
      <div className="p-1.5 rounded-3xl bg-slate-100/90 border border-slate-200/80 shadow-ambient">
        <div className="rounded-[calc(1.5rem-0.375rem)] bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white p-6 sm:p-8 relative overflow-hidden shadow-doppelrand-inner">
          {/* Subtle geometric hairline pattern */}
          <div className="absolute inset-0 hairline-pattern opacity-30 pointer-events-none" />

          {/* Institutional ambient orb glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/10 text-amber-300 border border-white/15 backdrop-blur-md">
                  <School className="w-3.5 h-3.5 text-amber-400" />
                  <span>SIE: 81981191 · DISTRITO COCHABAMBA 1</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Conformidad Ley 070</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-display leading-tight">
                Panel de Control y Gobierno Institucional
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                U.E. Comunidad Cristiana B · Gestión Escolar 2026 · Dirección Pedagógica:{' '}
                <strong className="text-white font-semibold">Prof. Fidelia Avendaño Gonzales</strong> · Turno Mañana
              </p>
            </div>

            {/* Quick Action Buttons with Button-in-Button Trailing Icons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link to="/dashboard/reports">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md text-xs font-semibold gap-2 transition-all duration-200 haptic-press"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>Actas y Centralizadores</span>
                </Button>
              </Link>

              <Link to="/dashboard/sie-sync">
                <Button
                  size="sm"
                  className="h-11 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold gap-2 shadow-glow-crimson transition-all duration-200 haptic-press group"
                >
                  <RefreshCw className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:rotate-180" />
                  <span>Sincronización SIE</span>
                  <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: 4 Core Institutional KPIs (Double-Bezel Architecture) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Estudiantes Matriculados */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle hover:shadow-ambient transition-all duration-300">
          <div className="bg-white p-5 rounded-[calc(1rem-0.25rem)] h-full flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-sans">
                Matrícula Efectiva
              </span>
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-700 shadow-2xs">
                <Users className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 font-display tabular-nums">
                {studentsCount}
              </p>
              {/* Visual gender bar breakdown */}
              <div className="mt-2.5 space-y-1.5">
                <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                  <div className="bg-slate-900 h-full" style={{ width: '50.6%' }} title="Varones: 50.6%" />
                  <div className="bg-brand-600 h-full" style={{ width: '49.4%' }} title="Mujeres: 49.4%" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>442 Varones (50.6%)</span>
                  <span>432 Mujeres (49.4%)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% RUDE Verificado
              </span>
              <span className="font-mono text-slate-400 text-[10px]">SIE OK</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Cursos y Paralelos */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle hover:shadow-ambient transition-all duration-300">
          <div className="bg-white p-5 rounded-[calc(1rem-0.25rem)] h-full flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-sans">
                Cursos Habilitados
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700 shadow-2xs">
                <BookOpen className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 font-display tabular-nums">
                {coursesCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Inicial (4) · Primaria (6) · Secundaria (6)
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>Promedio por aula:</span>
              <span className="font-bold text-slate-900 font-mono">54.6 est/curso</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Plantel Docente */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle hover:shadow-ambient transition-all duration-300">
          <div className="bg-white p-5 rounded-[calc(1rem-0.25rem)] h-full flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-sans">
                Plantel Docente
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shadow-2xs">
                <GraduationCap className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            <div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 font-display tabular-nums">
                {teachersCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Docentes titulares asignados
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                100% Carga Horaria
              </span>
              <span className="font-mono text-slate-400 text-[10px]">30 per/sem</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Promedio Institucional */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle hover:shadow-ambient transition-all duration-300">
          <div className="bg-white p-5 rounded-[calc(1rem-0.25rem)] h-full flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-sans">
                Rendimiento Académico
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Award className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 font-display tabular-nums">
                  {averageGrade}
                </p>
                <span className="text-xs font-semibold text-slate-400 font-mono">/ 100</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>96.2% Tasa de Aprobación</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Ley 070:</span>
              <span className="font-bold text-slate-800">Desarrollo Óptimo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Section (Asymmetric 2:1 Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Ley 070 Evaluation Distribution & Pedagogical Areas */}
        <div className="lg:col-span-2 p-1 rounded-3xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white p-6 sm:p-7 rounded-[calc(1.5rem-0.25rem)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-800" />
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Distribución de Calificaciones por Escala de Evaluación
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluación continua y formativa normada bajo la Ley 070 Avelino Siñani - Elizardo Pérez
                </p>
              </div>

              {/* Trimestre Selector Tabs */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/60 self-start sm:self-auto text-xs font-semibold">
                {(['1T', '2T', '3T'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTrimestre(t)}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-200 haptic-press ${
                      selectedTrimestre === t
                        ? 'bg-white text-slate-900 font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t === '1T' ? '1er Trimestre' : t === '2T' ? '2do Trimestre' : '3er Trimestre'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Evaluative Scales Breakdown */}
            <div className="space-y-4">
              {/* Escala 1: Desarrollo Pleno */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-2xs" />
                    Desarrollo Pleno (85 - 100 pts)
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    249 estudiantes <span className="text-slate-400 font-normal">(28.5%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-700" style={{ width: '28.5%' }} />
                </div>
              </div>

              {/* Escala 2: Desarrollo Óptimo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" />
                    Desarrollo Óptimo (69 - 84 pts)
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    457 estudiantes <span className="text-slate-400 font-normal">(52.3%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: '52.3%' }} />
                </div>
              </div>

              {/* Escala 3: Desarrollo Aceptable */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
                    Desarrollo Aceptable (51 - 68 pts)
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    135 estudiantes <span className="text-slate-400 font-normal">(15.4%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: '15.4%' }} />
                </div>
              </div>

              {/* Escala 4: En Desarrollo / Apoyo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-2xs" />
                    En Desarrollo / Requiere Apoyo (1 - 50 pts)
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    33 estudiantes <span className="text-slate-400 font-normal">(3.8%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full transition-all duration-700" style={{ width: '3.8%' }} />
                </div>
              </div>
            </div>

            {/* Promedios por Campos de Saberes y Conocimientos */}
            <div className="pt-5 border-t border-slate-100">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-3.5 font-sans">
                Promedios por Campos de Saberes y Conocimientos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <p className="text-[11px] font-medium text-slate-500 truncate">Ciencia y Tecnol.</p>
                  <p className="text-xl font-black text-slate-900 font-mono mt-1">78.4</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">Matemática / Física</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <p className="text-[11px] font-medium text-slate-500 truncate">Comunidad y Soc.</p>
                  <p className="text-xl font-black text-slate-900 font-mono mt-1">76.8</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">Lenguaje / Inglés</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <p className="text-[11px] font-medium text-slate-500 truncate">Cosmos y Pensam.</p>
                  <p className="text-xl font-black text-slate-900 font-mono mt-1">79.1</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">Valores / Espiritualidad</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors">
                  <p className="text-[11px] font-medium text-slate-500 truncate">Vida y Territorio</p>
                  <p className="text-xl font-black text-slate-900 font-mono mt-1">85.6</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">Biología / Geografía</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Distribución de Matrícula & Estado SIE */}
        <div className="p-1 rounded-3xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white p-6 sm:p-7 rounded-[calc(1.5rem-0.25rem)] space-y-6 h-full flex flex-col justify-between">
            <div>
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-800" />
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Matrícula por Nivel
                  </h2>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  16 Cursos
                </Badge>
              </div>

              <div className="space-y-3 mt-4">
                {/* Inicial */}
                <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Educación Inicial</span>
                    <span className="font-mono font-bold text-slate-900">93 al. (10.6%)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>4 Cursos Oficiales</span>
                    <span className="font-mono">23.3 al/aula</span>
                  </div>
                </div>

                {/* Primaria */}
                <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Educación Primaria</span>
                    <span className="font-mono font-bold text-slate-900">358 al. (41.0%)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>6 Cursos (1° al 6° de Primaria)</span>
                    <span className="font-mono">59.6 al/aula</span>
                  </div>
                </div>

                {/* Secundaria */}
                <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Educación Secundaria</span>
                    <span className="font-mono font-bold text-slate-900">423 al. (48.4%)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>6 Cursos (1° al 6° de Secundaria)</span>
                    <span className="font-mono">70.5 al/aula</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Centralizadores Trimestrales Consolidados */}
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Centralizadores 1er Trimestre
                </span>
                <span className="font-mono font-bold text-emerald-700">16 / 16 (100%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Todas las actas institucionales se encuentran cerradas y listas para su conciliación ministerial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
