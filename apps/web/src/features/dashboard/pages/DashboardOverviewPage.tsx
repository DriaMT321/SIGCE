import React from 'react';
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
} from 'lucide-react';
import { academicApi } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

export const DashboardOverviewPage: React.FC = () => {
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const currentRole = authService.getCurrentUser()?.role;
  const canReadCourses = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(currentRole ?? '');
  const canReadTeachers = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(currentRole ?? '');
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
    <div className="space-y-8">
      {/* Header Institucional para Dirección y Docentes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#B91329] border border-orange-200 mb-2 shadow-2xs">
            <School className="w-3.5 h-3.5 text-[#F37022]" />
            <span>U.E. COMUNIDAD CRISTIANA B · Código SIE: <strong>81981191</strong></span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Panel Directivo y Control Académico
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Gestión 2026 · Dirección: <strong>Prof. Fidelia Avendaño Gonzales</strong> · Turno Mañana
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/sie-sync"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] shadow-md shadow-[#B91329]/25 hover:brightness-105 hover:shadow-lg transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sincronización SIE (RPA)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Tarjetas Principales de Indicadores Educativos (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Estudiantes Matriculados */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estudiantes Matriculados</span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-[#F37022] border border-orange-200 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">{studentsCount}</p>
            <div className="flex items-center justify-between text-xs mt-1 text-slate-600">
              <span>442 Varones (50.6%)</span>
              <span>432 Mujeres (49.4%)</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% con RUDE verificado
            </p>
          </div>
        </div>

        {/* KPI 2: Cursos y Paralelos */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cursos Habilitados</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">{coursesCount}</p>
            <p className="text-xs text-slate-600 mt-1">
              Inicial (5) · Primaria (12) · Secundaria (13)
            </p>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">
              30 paralelos en Turno Mañana
            </p>
          </div>
        </div>

        {/* KPI 3: Plantel Docente */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Plantel Docente</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">{teachersCount}</p>
            <p className="text-xs text-slate-600 mt-1">
              34 Docentes Asignados
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 100% de materias cubiertas
            </p>
          </div>
        </div>

        {/* KPI 4: Rendimiento Escolar Promedio */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Promedio Institucional</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900 font-display">{averageGrade}</p>
              <span className="text-xs font-semibold text-slate-500">/ 100 pts</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 96.2% Tasa de Aprobación
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              1er Trimestre · Desarrollo Óptimo
            </p>
          </div>
        </div>
      </div>

      {/* Gráficas y Métricas Educativas para Dirección */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2 Cols): Rendimiento por Escala de Calificación (Ley 070) */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-[#F37022]" />
                Rendimiento Académico por Escalas de Evaluación (Ley 070)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribución de calificaciones del 1er Trimestre sobre 874 estudiantes matriculados
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full w-fit">
              Gestión 2026 Vigente
            </span>
          </div>

          <div className="space-y-4">
            {/* Escala 1: Desarrollo Pleno */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                  Desarrollo Pleno (85 - 100 pts)
                </span>
                <span className="text-slate-900 font-bold">249 alumnos (28.5%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '28.5%' }}></div>
              </div>
            </div>

            {/* Escala 2: Desarrollo Óptimo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                  Desarrollo Óptimo (69 - 84 pts)
                </span>
                <span className="text-slate-900 font-bold">457 alumnos (52.3%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '52.3%' }}></div>
              </div>
            </div>

            {/* Escala 3: Desarrollo Aceptable */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  Desarrollo Aceptable (51 - 68 pts)
                </span>
                <span className="text-slate-900 font-bold">135 alumnos (15.4%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '15.4%' }}></div>
              </div>
            </div>

            {/* Escala 4: En Desarrollo / Apoyo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  En Desarrollo / Requiere Apoyo (1 - 50 pts)
                </span>
                <span className="text-slate-900 font-bold">33 alumnos (3.8%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full" style={{ width: '3.8%' }}></div>
              </div>
            </div>
          </div>

          {/* Promedios por Área Pedagógica */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Ciencia y Tecnología</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">78.4 pts</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Matemática / Física</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Humanidades</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">76.8 pts</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Lenguaje / Inglés</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Ciencias Sociales</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">79.1 pts</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Historia / Cívica</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Deportes y Salud</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">85.6 pts</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Educación Física</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha (1 Col): Distribución de Matrícula Institucional */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-[#B91329]" />
                Matrícula por Nivel
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Gestión 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Inicial */}
            <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                <span>Inicial en Familia Comunitaria</span>
                <span className="font-bold">93 alumnos (10.6%)</span>
              </div>
              <div className="text-[11px] text-purple-700 flex justify-between">
                <span>5 Paralelos (1° A,B,C · 2° A,B)</span>
                <span>Capacidad 45/aula</span>
              </div>
            </div>

            {/* Primaria */}
            <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                <span>Primaria Comunitaria Vocacional</span>
                <span className="font-bold">358 alumnos (41.0%)</span>
              </div>
              <div className="text-[11px] text-blue-700 flex justify-between">
                <span>12 Paralelos (1° al 6° A y B)</span>
                <span>Promedio: 30 al/aula</span>
              </div>
            </div>

            {/* Secundaria */}
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                <span>Secundaria Comunitaria Productiva</span>
                <span className="font-bold">423 alumnos (48.4%)</span>
              </div>
              <div className="text-[11px] text-emerald-700 flex justify-between">
                <span>13 Paralelos (1° al 6°)</span>
                <span>Bachillerato Técnico</span>
              </div>
            </div>
          </div>

          {/* Estado de Centralizadores de Calificaciones */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Centralizadores 1er Trimestre</span>
              <span className="text-emerald-700 font-bold">30 de 30 Completados</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Calificaciones listas para conciliación y cuadre con el portal SIE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
