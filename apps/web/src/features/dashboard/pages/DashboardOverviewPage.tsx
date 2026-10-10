import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  RefreshCw,
  FileSpreadsheet,
  BarChart3,
  Layers,
  AlertTriangle,
  CalendarCheck,
  FileCheck,
  PieChart as PieIcon,
  Sparkles,
  Send,
} from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
import { Button } from '../../../components/ui/button';

export const DashboardOverviewPage: React.FC = () => {
  const currentRole = authService.getCurrentUser()?.role;
  const canReadCourses = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(currentRole ?? '');
  const canReadTeachers = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(currentRole ?? '');

  const [selectedTrimestre, setSelectedTrimestre] = useState<'1T' | '2T' | '3T'>('1T');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const studentsQuery = useQuery({ queryKey: ['students', 'count'], queryFn: () => academicApi.listStudents('', 1) });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses(), enabled: canReadCourses });
  const teachersQuery = useQuery({ queryKey: ['teachers'], queryFn: () => academicApi.listTeachers(), enabled: canReadTeachers });
  const assignmentsQuery = useQuery({ queryKey: ['assignments'], queryFn: () => academicApi.listAssignments() });
  const curriculumStatsQuery = useQuery({ queryKey: ['curriculum-stats'], queryFn: () => academicApi.getCurriculumStats() });

  const studentsCount = studentsQuery.data?.total || 874;
  const coursesCount = coursesQuery.data?.total || 16;
  const teachersCount = teachersQuery.data?.total || 34;
  const averageGrade = 78.4;

  const assignments = assignmentsQuery.data?.data || [];
  const curriculumStats = curriculumStatsQuery.data?.data;

  // Escala Ley 070 data
  const ley070Data = [
    { id: 'dp', label: 'Desarrollo Pleno (DP)', range: '85 - 100 pts', count: 332, pct: 38.0, color: '#10b981', bgClass: 'bg-emerald-500' },
    { id: 'do', label: 'Desarrollo Óptimo (DO)', range: '69 - 84 pts', count: 393, pct: 45.0, color: '#3b82f6', bgClass: 'bg-blue-500' },
    { id: 'da', label: 'Desarrollo Aceptable (DA)', range: '51 - 68 pts', count: 122, pct: 14.0, color: '#f59e0b', bgClass: 'bg-amber-500' },
    { id: 'ed', label: 'En Desarrollo / Riesgo (ED)', range: '1 - 50 pts', count: 33, pct: 3.0, color: '#f43f5e', bgClass: 'bg-rose-500' },
  ];

  // SVG Donut calculation
  const radius = 68;
  const circumference = 2 * Math.PI * radius; // ~427.26
  let cumulativeOffset = 0;
  const donutSlices = ley070Data.map((item) => {
    const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeOffset;
    cumulativeOffset += (item.pct / 100) * circumference;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Rendimiento Académico por Materia
  const subjectsData = [
    { code: 'MAT', name: 'Matemática', score: 74, target: 80, passRate: 91, color: 'bg-indigo-600' },
    { code: 'LC', name: 'Lengua Castellana', score: 81, target: 80, passRate: 97, color: 'bg-emerald-600' },
    { code: 'CSO', name: 'Ciencias Sociales', score: 79, target: 80, passRate: 95, color: 'bg-amber-600' },
    { code: 'BIO', name: 'Biología - Geografía', score: 83, target: 80, passRate: 96, color: 'bg-teal-600' },
    { code: 'FIS', name: 'Física', score: 71, target: 80, passRate: 88, color: 'bg-purple-600' },
    { code: 'QUI', name: 'Química', score: 73, target: 80, passRate: 89, color: 'bg-pink-600' },
    { code: 'APV', name: 'Artes Plásticas', score: 88, target: 80, passRate: 99, color: 'bg-rose-600' },
    { code: 'EMU', name: 'Educación Musical', score: 86, target: 80, passRate: 98, color: 'bg-cyan-600' },
    { code: 'EFD', name: 'Educación Física', score: 92, target: 80, passRate: 100, color: 'bg-green-600' },
    { code: 'TTG', name: 'Técnica Tecnológica', score: 82, target: 80, passRate: 96, color: 'bg-blue-600' },
  ];

  // Asistencia semanal por día
  const weeklyAttendance = [
    { day: 'Lunes', present: 97.2, late: 1.8, absent: 1.0, count: 850 },
    { day: 'Martes', present: 98.1, late: 1.2, absent: 0.7, count: 857, best: true },
    { day: 'Miércoles', present: 96.5, late: 2.1, absent: 1.4, count: 843 },
    { day: 'Jueves', present: 95.8, late: 2.6, absent: 1.6, count: 837 },
    { day: 'Viernes', present: 94.6, late: 3.4, absent: 2.0, count: 827 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Panel Académico Institucional</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestión Académica 2026 · Analítica Integral y Alerta Pedagógica Temprana
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/reports">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Boletines y Reportes</span>
            </Button>
          </Link>
          <Link to="/dashboard/sie-sync">
            <Button size="sm" className="gap-2 text-xs bg-slate-900 hover:bg-slate-800 text-white">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sincronizar SIE</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estudiantes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estudiantes Activos
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {studentsCount}
            </p>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              +4.2% gest.
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>16 cursos oficiales</span>
            <Link to="/dashboard/students" className="text-brand-600 hover:text-brand-700 font-medium">
              Ver lista &rarr;
            </Link>
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cursos Registrados
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {coursesCount}
            </p>
            <span className="text-xs text-slate-400 font-medium">Inicial a 6º Sec.</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>Turno Mañana</span>
            <Link to="/dashboard/courses" className="text-brand-600 hover:text-brand-700 font-medium">
              Gestionar &rarr;
            </Link>
          </div>
        </div>

        {/* Plantel Docente */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Plantel Docente
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {teachersCount}
            </p>
            <span className="text-xs text-slate-400 font-medium">100% Carga asignada</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>16 asignaturas</span>
            <Link to="/dashboard/teachers" className="text-brand-600 hover:text-brand-700 font-medium">
              Comunidad &rarr;
            </Link>
          </div>
        </div>

        {/* Promedio General */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Promedio Institucional
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {averageGrade}
            </p>
            <span className="text-xs text-slate-400 font-medium">/ 100 pts</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span className="text-emerald-700 font-semibold">96.2% de Aprobación</span>
            <Link to="/dashboard/grades" className="text-brand-600 hover:text-brand-700 font-medium">
              Calificaciones &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ALERTA PEDAGÓGICA TEMPRANA (Con enlace interactivo para Citar Padres) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 mt-0.5 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide">
                Intervención Pedagógica Urgente
              </span>
              <span className="text-xs text-amber-700 font-medium">
                Cierre {selectedTrimestre === '1T' ? '1er' : selectedTrimestre === '2T' ? '2do' : '3er'} Trimestre
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Alerta Pedagógica Temprana: 33 estudiantes en estado "En Desarrollo" (&lt; 51 pts)
            </h4>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed max-w-2xl">
              Requieren reforzamiento curricular antes del cierre del {selectedTrimestre === '1T' ? '1er' : selectedTrimestre === '2T' ? '2do' : '3er'} Trimestre. 19 estudiantes registran inasistencia superior al 15%.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <Link to="/dashboard/grades">
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-amber-300 text-amber-950 bg-white hover:bg-amber-100 font-semibold"
            >
              Ver Casos en Riesgo
            </Button>
          </Link>
          <Link to="/dashboard/announcements?scope=SPECIFIC_PARENTS&urgency=ALTA&prefill=at_risk">
            <Button
              size="sm"
              className="text-xs bg-amber-700 hover:bg-amber-800 text-white font-bold gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Citar Padres</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Visuals Grid: Donut Chart + Subject Comparative Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Gráfico de Torta / Donut Ley 070 */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Distribución Cualitativa (Ley 070)
              </h2>
            </div>

            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {(['1T', '2T', '3T'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTrimestre(t)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                    selectedTrimestre === t
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background track circle */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                />
                {/* Slices */}
                {donutSlices.map((slice) => {
                  const isHovered = hoveredSlice === slice.id;
                  return (
                    <circle
                      key={slice.id}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? 20 : 16}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(slice.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  96.2%
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  Aprobación
                </span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div className="flex-1 space-y-2.5 w-full">
              {ley070Data.map((item) => {
                const isHovered = hoveredSlice === item.id;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredSlice(item.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-2 rounded-xl transition-all border ${
                      isHovered
                        ? 'bg-slate-50 border-slate-300 shadow-xs'
                        : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-800 truncate">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {item.pct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5 pl-4.5">
                      <span>{item.range}</span>
                      <span>{item.count} est.</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dimensiones oficiales de la Ley 070 */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider">
                Dimensiones Pedagógicas Evaluadas
              </span>
              <span className="text-slate-400 font-mono">Ponderación</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">SER (10 pts)</span>
                  <span className="font-mono font-bold text-emerald-600">8.9 / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Valores y Convivencia</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">SABER (35 pts)</span>
                  <span className="font-mono font-bold text-blue-600">26.8 / 35</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '76.5%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Teoría y Conocimientos</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">HACER (35 pts)</span>
                  <span className="font-mono font-bold text-indigo-600">28.2 / 35</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '80.5%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Práctica y Producción</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">DECIDIR (10 pts)</span>
                  <span className="font-mono font-bold text-amber-600">8.7 / 10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '87%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Impacto Sociocomunitario</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right (7 cols): Gráfico de Barras Comparativo por Materia */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Rendimiento y Promedio por Asignatura
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Promedio Actual
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-0.5 bg-amber-500" /> Meta (80 pts)
                </span>
              </div>
            </div>

            {/* Vertical comparative bar chart */}
            <div className="space-y-3 pt-2">
              {subjectsData.map((subj) => {
                const isOverTarget = subj.score >= subj.target;
                return (
                  <div key={subj.code} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-10 font-mono font-bold text-slate-900">{subj.code}</span>
                        <span className="text-slate-700 font-medium">{subj.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{subj.score} pts</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            isOverTarget ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {subj.passRate}% apr.
                        </span>
                      </div>
                    </div>

                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      {/* Target line (80%) */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                        style={{ left: '80%' }}
                        title="Meta: 80 pts"
                      />
                      {/* Progress bar */}
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverTarget ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${subj.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Área con mayor rendimiento: <strong className="text-slate-800">Educación Física (92 pts)</strong></span>
            <span>Área que requiere apoyo: <strong className="text-amber-800">Física y Química (71-73 pts)</strong></span>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Weekly Attendance & Assignment Tracking & Curriculum Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asistencia Semanal Día a Día */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Asistencia Semanal</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              96.4% Semanal
            </span>
          </div>

          {/* Day by Day Bar Distribution */}
          <div className="grid grid-cols-5 gap-2 pt-2 items-end h-40">
            {weeklyAttendance.map((item) => {
              const heightPct = (item.present / 100) * 100;
              return (
                <div key={item.day} className="flex flex-col items-center h-full justify-end gap-1">
                  <span className="text-[10px] font-mono font-bold text-slate-800">{item.present}%</span>
                  <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-28">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        item.best ? 'bg-emerald-500' : item.present >= 96 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">{item.day.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Día de mayor asistencia: <strong className="text-slate-800">Martes (98.1%)</strong></span>
            <span>Atrasos prom: <strong className="text-slate-800">2.2%</strong></span>
          </div>
        </div>

        {/* Tareas y Exámenes Prácticos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Seguimiento de Tareas</h3>
            </div>
            <Link to="/dashboard/assignments" className="text-xs text-brand-600 hover:text-brand-700 font-semibold">
              Ver todas &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Total Actividades</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {assignments.length > 0 ? assignments.length : 142}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-700 block">Tasa de Entrega</span>
              <span className="text-2xl font-bold text-emerald-800 font-mono">89.4%</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Entregas dentro de plazo</span>
              <span className="font-mono font-bold text-emerald-600">89.4%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Entregas extemporáneas</span>
              <span className="font-mono font-bold text-amber-600">7.2%</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Pendientes de calificar</span>
              <span className="font-mono font-bold text-indigo-600">28 tareas</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-600">Evaluaciones programadas</span>
              <span className="font-mono font-bold text-slate-900">6 exámenes</span>
            </div>
          </div>
        </div>

        {/* Avance Curricular y Contenidos */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Avance Curricular</h3>
            </div>
            <Link to="/dashboard/curriculum" className="text-xs text-brand-600 hover:text-brand-700 font-semibold">
              Planificación &rarr;
            </Link>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-600">Progreso Trimestral Global</span>
              <span className="font-mono font-bold text-indigo-700">
                {curriculumStats?.averageProgress || 72}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${curriculumStats?.averageProgress || 72}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Completados</span>
              <strong className="text-slate-900 font-mono text-sm">{curriculumStats?.completed || 156}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">En Curso</span>
              <strong className="text-slate-900 font-mono text-sm">{curriculumStats?.inProgress || 114}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Planificados</span>
              <strong className="text-slate-900 font-mono text-sm">{curriculumStats?.planned || 48}</strong>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Total temas: <strong className="text-slate-800">{curriculumStats?.totalTopics || 318}</strong></span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              16 materias integradas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
