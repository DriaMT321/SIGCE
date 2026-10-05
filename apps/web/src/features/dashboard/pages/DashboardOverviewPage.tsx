import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  BarChart3,
  Layers,
} from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
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
    <div className="space-y-6">
      {/* Hero Banner - Clean and focused */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">SIE: 81981191</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">Gestión 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Panel de Control
            </h1>

            <p className="text-sm text-slate-400">
              U.E. Comunidad Cristiana B · Dirección Pedagógica
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard/reports">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs font-medium gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Actas</span>
              </Button>
            </Link>

            <Link to="/dashboard/sie-sync">
              <Button
                size="sm"
                className="h-10 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Sincronización SIE</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Grid - Clean cards without double bezel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Estudiantes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Matrícula
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-600" />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {studentsCount}
          </p>

          <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 rounded-full" style={{ width: '50.6%' }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
            <span>442 Varones</span>
            <span>432 Mujeres</span>
          </div>
        </div>

        {/* KPI 2: Cursos */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Cursos
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {coursesCount}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Inicial (4) · Primaria (6) · Secundaria (6)
          </p>
        </div>

        {/* KPI 3: Docentes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Docentes
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-amber-600" />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {teachersCount}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            30 períodos/sem
          </p>
        </div>

        {/* KPI 4: Rendimiento */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Rendimiento
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {averageGrade}
            </p>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>96.2% Aprobación</span>
          </div>
        </div>
      </div>

      {/* Main Content - Simplified */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Grade Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-semibold text-slate-900">
                Distribución de Calificaciones
              </h2>
            </div>

            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
              {(['1T', '2T', '3T'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTrimestre(t)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedTrimestre === t
                      ? 'bg-white text-slate-900 font-semibold shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t === '1T' ? '1er' : t === '2T' ? '2do' : '3er'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Desarrollo Pleno', range: '85-100', count: 249, pct: 28.5, color: 'bg-emerald-500' },
              { label: 'Desarrollo Óptimo', range: '69-84', count: 457, pct: 52.3, color: 'bg-blue-500' },
              { label: 'Desarrollo Aceptable', range: '51-68', count: 135, pct: 15.4, color: 'bg-amber-500' },
              { label: 'En Desarrollo', range: '1-50', count: 33, pct: 3.8, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    {item.label} <span className="text-slate-400">({item.range})</span>
                  </span>
                  <span className="font-mono text-slate-600">
                    {item.count} <span className="text-slate-400">({item.pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Campos de Saberes - Compact */}
          <div className="pt-5 mt-5 border-t border-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Ciencia y Tecnología', score: '78.4' },
                { name: 'Comunidad y Sociedad', score: '76.8' },
                { name: 'Cosmos y Pensamiento', score: '79.1' },
                { name: 'Vida y Territorio', score: '85.6' },
              ].map((campo) => (
                <div key={campo.name} className="p-3 rounded-lg bg-slate-50">
                  <p className="text-[11px] text-slate-500 truncate">{campo.name}</p>
                  <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{campo.score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Matrícula por Nivel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">
              Matrícula por Nivel
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { level: 'Inicial', count: 93, pct: '10.6%', courses: 4 },
              { level: 'Primaria', count: 358, pct: '41.0%', courses: 6 },
              { level: 'Secundaria', count: 423, pct: '48.4%', courses: 6 },
            ].map((item) => (
              <div key={item.level} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{item.level}</span>
                  <span className="font-mono text-slate-700">{item.count} <span className="text-slate-400">({item.pct})</span></span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.courses} cursos</p>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-600 font-medium">Centralizadores</span>
              <span className="font-mono font-semibold text-emerald-600">16/16</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
