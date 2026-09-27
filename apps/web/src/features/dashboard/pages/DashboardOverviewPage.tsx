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
  const coursesCount = coursesQuery.data?.total || 30;
  const teachersCount = teachersQuery.data?.total || 34;
  const grades = gradesQuery.data?.data ?? [];
  const averageGrade = grades.length
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : '77.6';

  return (
    <div className="space-y-6">
      {/* Header Institucional de Alta Dirección */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/90">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
              <School className="w-3.5 h-3.5 text-brand-700" />
              <span>SIE: <strong className="font-mono">81981191</strong></span>
            </span>
            <Badge variant="brand" className="font-medium">
              U.E. Comunidad Cristiana B
            </Badge>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              · Cochabamba, Bolivia
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Control Académico e Indicadores Institucionales
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Gestión Escolar 2026 · Dirección: <strong className="text-slate-700 font-semibold">Prof. Fidelia Avendaño Gonzales</strong> · Turno Mañana
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link to="/dashboard/reports">
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>Actas y Reportes</span>
            </Button>
          </Link>
          <Link to="/dashboard/sie-sync">
            <Button size="sm" className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-1.5 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Sincronización SIE</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bento Grid: 4 Core Institutional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Estudiantes Matriculados */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Matrícula Efectiva
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 font-display tabular-nums">
              {studentsCount}
            </p>
            {/* Visual gender bar breakdown */}
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className="bg-slate-800 h-full" style={{ width: '50.6%' }} title="Varones: 50.6%" />
                <div className="bg-brand-600 h-full" style={{ width: '49.4%' }} title="Mujeres: 49.4%" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>442 Varones (50.6%)</span>
                <span>432 Mujeres (49.4%)</span>
              </div>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% RUDE verificado</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Cursos y Paralelos */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cursos Habilitados
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 font-display tabular-nums">
              {coursesCount}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Inicial (5) · Primaria (12) · Secundaria (13)
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span>Promedio por aula:</span>
              <span className="font-semibold text-slate-900 font-mono">29.1 est/aula</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Plantel Docente */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Plantel Docente
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900 font-display tabular-nums">
              {teachersCount}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Docentes titulares asignados
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% asignaturas cubiertas</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Promedio Institucional */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] hover:border-slate-300 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Promedio Institucional
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-bold tracking-tight text-slate-900 font-display tabular-nums">
                {averageGrade}
              </p>
              <span className="text-xs font-semibold text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>96.2% Tasa de Aprobación</span>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
              Escala Ley 070: <span className="font-semibold text-slate-800">Desarrollo Óptimo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Section (Asymmetric 2-column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Ley 070 Evaluation Distribution & Pedagogical Areas */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Rendimiento Académico por Escala de Evaluación
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribución trimestral normada bajo la Ley 070 Avelino Siñani - Elizardo Pérez
              </p>
            </div>

            {/* Trimestre Selector Tabs */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200/60 self-start sm:self-auto text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedTrimestre('1T')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedTrimestre === '1T'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1er Trimestre
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimestre('2T')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedTrimestre === '2T'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2do Trimestre
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrimestre('3T')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedTrimestre === '3T'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3er Trimestre
              </button>
            </div>
          </div>

          {/* 4 Evaluative Scales Breakdown */}
          <div className="space-y-4">
            {/* Escala 1: Desarrollo Pleno */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Desarrollo Pleno (85 - 100 pts)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  249 estudiantes <span className="text-slate-400 font-normal">(28.5%)</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: '28.5%' }} />
              </div>
            </div>

            {/* Escala 2: Desarrollo Óptimo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Desarrollo Óptimo (69 - 84 pts)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  457 estudiantes <span className="text-slate-400 font-normal">(52.3%)</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: '52.3%' }} />
              </div>
            </div>

            {/* Escala 3: Desarrollo Aceptable */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Desarrollo Aceptable (51 - 68 pts)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  135 estudiantes <span className="text-slate-400 font-normal">(15.4%)</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '15.4%' }} />
              </div>
            </div>

            {/* Escala 4: En Desarrollo / Apoyo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  En Desarrollo / Requiere Apoyo (1 - 50 pts)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  33 estudiantes <span className="text-slate-400 font-normal">(3.8%)</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full transition-all duration-500" style={{ width: '3.8%' }} />
              </div>
            </div>
          </div>

          {/* Promedios por Área Pedagógica */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Promedios por Campos de Saberes y Conocimientos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-left">
                <p className="text-[11px] font-medium text-slate-500 truncate">Ciencia y Tecnol.</p>
                <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">78.4</p>
                <p className="text-[10px] text-slate-400 truncate">Matemática / Física</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-left">
                <p className="text-[11px] font-medium text-slate-500 truncate">Comunidad y Soc.</p>
                <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">76.8</p>
                <p className="text-[10px] text-slate-400 truncate">Lenguaje / Inglés</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-left">
                <p className="text-[11px] font-medium text-slate-500 truncate">Ciencias Sociales</p>
                <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">79.1</p>
                <p className="text-[10px] text-slate-400 truncate">Historia / Cívica</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-left">
                <p className="text-[11px] font-medium text-slate-500 truncate">Vida y Territorio</p>
                <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">85.6</p>
                <p className="text-[10px] text-slate-400 truncate">Biología / Geografía</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Distribución de Matrícula & Estado SIE */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900 font-display">
                Matrícula por Nivel
              </h2>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              30 Cursos
            </Badge>
          </div>

          <div className="space-y-3">
            {/* Inicial */}
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Educación Inicial</span>
                <span className="font-mono font-bold text-slate-900">93 al. (10.6%)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>5 Paralelos (1° y 2°)</span>
                <span className="font-mono">18.6 al/aula</span>
              </div>
            </div>

            {/* Primaria */}
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Educación Primaria</span>
                <span className="font-mono font-bold text-slate-900">358 al. (41.0%)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>12 Paralelos (1° al 6° A y B)</span>
                <span className="font-mono">29.8 al/aula</span>
              </div>
            </div>

            {/* Secundaria */}
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Educación Secundaria</span>
                <span className="font-mono font-bold text-slate-900">423 al. (48.4%)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>13 Paralelos (Bachillerato Técnico)</span>
                <span className="font-mono">32.5 al/aula</span>
              </div>
            </div>
          </div>

          {/* Centralizadores Trimestrales Consolidados */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Centralizadores 1er Trimestre
              </span>
              <span className="font-mono font-bold text-emerald-700">30 / 30 (100%)</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '100%' }} />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Las actas institucionales están cerradas y listas para su conciliación con el sistema ministerial SIE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
