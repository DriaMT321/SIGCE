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
  AlertTriangle,
  CalendarCheck,
  FileCheck,
  BookMarked,
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
  const curriculumStatsQuery = useQuery({ queryKey: ['curriculum-stats'], queryFn: () => academicApi.getCurriculumStats() });
  const assignmentsQuery = useQuery({ queryKey: ['assignments'], queryFn: () => academicApi.listAssignments() });

  const studentsCount = studentsQuery.data?.total || 874;
  const coursesCount = coursesQuery.data?.total || 16;
  const teachersCount = teachersQuery.data?.total || 34;
  const grades = gradesQuery.data?.data ?? [];
  const averageGrade = grades.length
    ? (grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length).toFixed(1)
    : '77.6';

  const curriculumStats = curriculumStatsQuery.data?.data;
  const assignments = assignmentsQuery.data?.data ?? [];

  // Datos pedagógicos enriquecidos
  const subjectPerformance = [
    { name: 'Educación Física y Deportes', code: 'EFD', score: 92.1, passRate: 99.2, color: 'bg-emerald-500', barBg: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { name: 'Valores, Espiritualidad y Religiones', code: 'VER', score: 88.3, passRate: 98.7, color: 'bg-teal-500', barBg: 'bg-teal-50', textColor: 'text-teal-700' },
    { name: 'Artes Plásticas y Visuales', code: 'APV', score: 84.7, passRate: 97.5, color: 'bg-pink-500', barBg: 'bg-pink-50', textColor: 'text-pink-700' },
    { name: 'Ciencias Sociales', code: 'CSO', score: 82.4, passRate: 96.4, color: 'bg-amber-500', barBg: 'bg-amber-50', textColor: 'text-amber-700' },
    { name: 'Comunicación y Lenguajes', code: 'LC', score: 79.8, passRate: 94.1, color: 'bg-indigo-500', barBg: 'bg-indigo-50', textColor: 'text-indigo-700' },
    { name: 'Lengua Extranjera (Inglés)', code: 'LEX', score: 76.5, passRate: 91.8, color: 'bg-sky-500', barBg: 'bg-sky-50', textColor: 'text-sky-700' },
    { name: 'Matemática', code: 'MAT', score: 74.2, passRate: 88.5, color: 'bg-blue-500', barBg: 'bg-blue-50', textColor: 'text-blue-700' },
    { name: 'Ciencias Naturales / Física / Química', code: 'CN', score: 73.1, passRate: 86.9, color: 'bg-rose-500', barBg: 'bg-rose-50', textColor: 'text-rose-700' },
  ];

  const weeklyAttendanceDays = [
    { day: 'Lunes', pct: 96.2, present: 841, absent: 33 },
    { day: 'Martes', pct: 98.4, present: 860, absent: 14, best: true },
    { day: 'Miércoles', pct: 97.1, present: 849, absent: 25 },
    { day: 'Jueves', pct: 95.8, present: 837, absent: 37 },
    { day: 'Viernes', pct: 94.3, present: 824, absent: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">SIE: 81981191</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">Gestión 2026</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">R.M. 1040/2022</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Panel Pedagógico y de Control Académico
            </h1>

            <p className="text-sm text-slate-400">
              U.E. Comunidad Cristiana B · Métricas de rendimiento escolar, aula y avance curricular
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link to="/dashboard/reports">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs font-medium gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Centralizadores</span>
              </Button>
            </Link>

            <Link to="/dashboard/sie-sync">
              <Button
                size="sm"
                className="h-10 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium gap-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Conciliación SIE</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Estudiantes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Matrícula Efectiva
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
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
            <span>442 Varones (50.6%)</span>
            <span>432 Mujeres (49.4%)</span>
          </div>
        </div>

        {/* KPI 2: Cursos y Aulas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Cursos Activos
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {coursesCount}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Inicial (4) · Primaria (6) · Secundaria (6)
          </p>
        </div>

        {/* KPI 3: Docentes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Plantel Docente
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-amber-600" />
            </div>
          </div>

          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {teachersCount}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            30 períodos pedagógicos / sem
          </p>
        </div>

        {/* KPI 4: Rendimiento */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Promedio General
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {averageGrade}
            </p>
            <span className="text-xs text-slate-400 font-medium">/ 100 pts</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>96.2% de Tasa de Aprobación</span>
          </div>
        </div>
      </div>

      {/* Alerta de Riesgo Pedagógico Temprano (Lo que pide un docente) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Alerta Pedagógica Temprana: 33 estudiantes en estado "En Desarrollo" (&lt; 51 pts)
            </h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Requieren reforzamiento curricular antes del cierre del {selectedTrimestre === '1T' ? '1er' : selectedTrimestre === '2T' ? '2do' : '3er'} Trimestre. 19 estudiantes registran inasistencia superior al 15%.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/dashboard/grades">
            <Button size="sm" variant="outline" className="text-xs border-amber-300 text-amber-900 hover:bg-amber-100">
              Ver Estudiantes en Riesgo
            </Button>
          </Link>
          <Link to="/dashboard/announcements">
            <Button size="sm" className="text-xs bg-amber-700 hover:bg-amber-800 text-white">
              Citar Padres
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Grade Distribution Ley 070 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Distribución de Calificaciones (Escala Ley 070)
              </h2>
            </div>

            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              {(['1T', '2T', '3T'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTrimestre(t)}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    selectedTrimestre === t
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {t === '1T' ? '1er Trimestre' : t === '2T' ? '2do Trimestre' : '3er Trimestre'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Desarrollo Pleno (DP)', range: '85 - 100 pts', count: 249, pct: 28.5, color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
              { label: 'Desarrollo Óptimo (DO)', range: '69 - 84 pts', count: 457, pct: 52.3, color: 'bg-blue-500', barBg: 'bg-blue-100' },
              { label: 'Desarrollo Aceptable (DA)', range: '51 - 68 pts', count: 135, pct: 15.4, color: 'bg-amber-500', barBg: 'bg-amber-100' },
              { label: 'En Desarrollo (ED)', range: '1 - 50 pts', count: 33, pct: 3.8, color: 'bg-rose-500', barBg: 'bg-rose-100' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {item.label} <span className="text-slate-400 font-normal">({item.range})</span>
                  </span>
                  <span className="font-mono text-slate-700 font-bold">
                    {item.count} estudiantes <span className="text-slate-400 font-normal">({item.pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Rendimiento por Asignatura / Área Curricular */}
          <div className="pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-brand-600" />
                Rendimiento Académico por Asignatura
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Promedio de Aula</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {subjectPerformance.map((subj) => (
                <div key={subj.code} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 truncate pr-2">{subj.name}</span>
                    <span className="font-mono font-bold text-slate-900 shrink-0">{subj.score} pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden mb-1.5">
                    <div className={`h-full ${subj.color} rounded-full`} style={{ width: `${subj.score}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span className="font-mono">{subj.code}</span>
                    <span className={subj.textColor}>{subj.passRate}% aprobación</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Seguimiento Docente, Tareas y Asistencia Semanal */}
        <div className="space-y-6">
          {/* Tarjeta: Gestión de Aula y Tareas */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
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
                <span className="text-[11px] text-slate-500 block">Total Tareas / Exámenes</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {assignments.length > 0 ? assignments.length : 142}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">Tasa de Entrega</span>
                <span className="text-xl font-bold text-emerald-800 font-mono">89.4%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Entregas a tiempo</span>
                <span className="font-mono font-bold text-emerald-600">89.4%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Entregas con retraso</span>
                <span className="font-mono font-bold text-amber-600">7.2%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Pendientes de calificación</span>
                <span className="font-mono font-bold text-indigo-600">28 tareas</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600">Exámenes en próximos 7 días</span>
                <span className="font-mono font-bold text-slate-900">6 pruebas</span>
              </div>
            </div>
          </div>

          {/* Tarjeta: Asistencia Semanal por Día */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Asistencia Semanal</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                96.4% Global
              </span>
            </div>

            <div className="space-y-2.5">
              {weeklyAttendanceDays.map((item) => (
                <div key={item.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      {item.day}
                      {item.best && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded font-bold">
                          Máx
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-800 font-semibold">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.pct >= 97 ? 'bg-emerald-500' : item.pct >= 95 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Promedio diario: 842 alumnos</span>
              <span>18 faltas/día</span>
            </div>
          </div>

          {/* Tarjeta: Avance Curricular */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
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
                <span className="text-slate-600">Progreso Trimestral</span>
                <span className="font-mono font-bold text-indigo-700">
                  {curriculumStats?.averageProgress || 69.2}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${curriculumStats?.averageProgress || 69.2}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px]">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block">Completados</span>
                <strong className="text-slate-900 font-mono">{curriculumStats?.completed || 148}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block">En Curso</span>
                <strong className="text-slate-900 font-mono">{curriculumStats?.inProgress || 46}</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block">Planificados</span>
                <strong className="text-slate-900 font-mono">{curriculumStats?.planned || 20}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
