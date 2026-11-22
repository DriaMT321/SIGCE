import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { obtenierniveleducativoregular } from '@academic/academic-domain';
import {
  BookOpen,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  RefreshCw,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type { tableroresumen } from '../application/resumendepanel';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';

interface metricatarjetapropiedades {
  title: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
  link: string;
  linkLabel: string;
  tone?: 'brand' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'orange';
}

function FiltroGrafico({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 min-w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-2xs"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

const filtrosnivel = [
  { value: 'ALL', label: 'Todos los niveles' },
  { value: 'INITIAL', label: 'Inicial' },
  { value: 'PRIMARY', label: 'Primaria' },
  { value: 'SECONDARY', label: 'Secundaria' },
];
const filtrosturno = [
  { value: 'ALL', label: 'Todos los turnos' },
  { value: 'MORNING', label: 'Mañana' },
  { value: 'AFTERNOON', label: 'Tarde' },
  { value: 'EVENING', label: 'Noche' },
];

const toneStyles: Record<
  'brand' | 'emerald' | 'amber' | 'orange' | 'indigo' | 'purple',
  { iconBg: string; iconColor: string; accentBorder: string; linkColor: string }
> = {
  brand: {
    iconBg: 'bg-brand-50 border-brand-100',
    iconColor: 'text-brand-700',
    accentBorder: 'hover:border-brand-300',
    linkColor: 'text-brand-700 hover:text-brand-800',
  },
  emerald: {
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-600',
    accentBorder: 'hover:border-emerald-300',
    linkColor: 'text-emerald-700 hover:text-emerald-800',
  },
  amber: {
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
    accentBorder: 'hover:border-amber-300',
    linkColor: 'text-amber-700 hover:text-amber-800',
  },
  orange: {
    iconBg: 'bg-orange-50 border-orange-100',
    iconColor: 'text-orange-600',
    accentBorder: 'hover:border-orange-300',
    linkColor: 'text-orange-700 hover:text-orange-800',
  },
  indigo: {
    iconBg: 'bg-brand-50 border-brand-100',
    iconColor: 'text-brand-700',
    accentBorder: 'hover:border-brand-300',
    linkColor: 'text-brand-700 hover:text-brand-800',
  },
  purple: {
    iconBg: 'bg-orange-50 border-orange-100',
    iconColor: 'text-orange-600',
    accentBorder: 'hover:border-orange-300',
    linkColor: 'text-orange-700 hover:text-orange-800',
  },
};

const MetricaTarjeta: React.FC<metricatarjetapropiedades> = ({
  title: titulo,
  value: valor,
  detail: detalle,
  icon: Icono,
  link: enlace,
  linkLabel: enlaceetiqueta,
  tone = 'brand',
}) => {
  const currentTone = toneStyles[tone];
  return (
    <div
      data-panel-card
      className={`group relative rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-md ${currentTone.accentBorder}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold text-slate-600">{titulo}</h2>
        <div className={`grid h-8 w-8 place-items-center rounded-lg border ${currentTone.iconBg}`}>
          <Icono className={`h-4 w-4 ${currentTone.iconColor}`} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">{valor}</p>
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
        <span className="truncate">{detalle}</span>
        <Link className={`shrink-0 font-medium ${currentTone.linkColor}`} to={enlace}>
          {enlaceetiqueta}
        </Link>
      </div>
    </div>
  );
};

function cantidadetiqueta(
  total: number | undefined,
  espendiente: boolean,
  eserror: boolean,
  habilitado = true,
): number | string {
  if (!habilitado) return 'Sin acceso';
  if (eserror) return 'No disponible';
  if (espendiente) return 'Cargando…';
  return total ?? 'Sin datos';
}

export const TableroResumenPagina: React.FC<{
  overview: tableroresumen;
  currentRole?: string;
}> = ({ overview: resumen, currentRole: actualrol }) => {
  const panelref = useRef<HTMLDivElement>(null);
  const [filtros, establecerfiltros] = useState({
    turnoEstudiantes: 'ALL',
    nivelOcupacion: 'ALL',
    nivelCursos: 'ALL',
    turnoCursos: 'ALL',
    turnoGrado: 'ALL',
    turnoCapacidad: 'ALL',
    nivelTurno: 'ALL',
    nivelParalelo: 'ALL',
    turnoParalelo: 'ALL',
  });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tarjetas = panelref.current?.querySelectorAll('[data-panel-card]');
    if (!tarjetas?.length) return;
    const animacion = gsap.fromTo(tarjetas, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.045, ease: 'power2.out',
    });
    return () => { animacion.kill(); };
  }, []);
  const rol = actualrol;
  const puedeleercursos = ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'].includes(rol ?? '');
  const puedeleerdocentes = ['ADMINISTRATIVE', 'SECRETARY'].includes(rol ?? '');

  const estudiantesconsulta = useQuery({
    queryKey: ['students', 'count'],
    queryFn: () => resumen.cantidadestudiantes(),
  });
  const cursosconsulta = useQuery({
    queryKey: ['courses', 'count'],
    queryFn: () => resumen.cantidadcursos(),
    enabled: puedeleercursos,
  });
  const docentesconsulta = useQuery({
    queryKey: ['teachers', 'count'],
    queryFn: () => resumen.cantidaddocentes(),
    enabled: puedeleerdocentes,
  });
  const asignacionesconsulta = useQuery({
    queryKey: ['assignments', 'count'],
    queryFn: () => resumen.cantidadasignaciones(),
  });
  const curriculoconsulta = useQuery({
    queryKey: ['curriculum-stats'],
    queryFn: () => resumen.obtenercurriculoresumen(),
    enabled: puedeleercursos,
  });
  const cursosdetalleconsulta = useQuery({
    queryKey: ['courses', 'dashboard-chart'],
    queryFn: () => resumen.obtenercursos(),
    enabled: puedeleercursos,
  });

  const curriculo = curriculoconsulta.data;
  const tienecurriculo = curriculo !== undefined && curriculo.totalTopics > 0;
  const cursosdetalle = cursosdetalleconsulta.data ?? [];
  const cursosestudiantes = cursosdetalle.filter((curso) => filtros.turnoEstudiantes === 'ALL' || curso.shift === filtros.turnoEstudiantes);
  const cursosocupacion = cursosdetalle.filter((curso) => filtros.nivelOcupacion === 'ALL' || obtenierniveleducativoregular(curso.gradeLevel) === filtros.nivelOcupacion);
  const cursostop = cursosdetalle.filter((curso) =>
    (filtros.nivelCursos === 'ALL' || obtenierniveleducativoregular(curso.gradeLevel) === filtros.nivelCursos)
    && (filtros.turnoCursos === 'ALL' || curso.shift === filtros.turnoCursos),
  );
  const cursosgrado = cursosdetalle.filter((curso) => filtros.turnoGrado === 'ALL' || curso.shift === filtros.turnoGrado);
  const cursoscapacidad = cursosdetalle.filter((curso) => filtros.turnoCapacidad === 'ALL' || curso.shift === filtros.turnoCapacidad);
  const cursosporfiltroturno = cursosdetalle.filter((curso) => filtros.nivelTurno === 'ALL' || obtenierniveleducativoregular(curso.gradeLevel) === filtros.nivelTurno);
  const cursosporgrafoparalelo = cursosdetalle.filter((curso) =>
    (filtros.nivelParalelo === 'ALL' || obtenierniveleducativoregular(curso.gradeLevel) === filtros.nivelParalelo)
    && (filtros.turnoParalelo === 'ALL' || curso.shift === filtros.turnoParalelo),
  );
  const nivelesbase = [
    { label: 'Inicial', nivel: 'INITIAL', color: '#d97706' },
    { label: 'Primaria', nivel: 'PRIMARY', color: '#ea580c' },
    { label: 'Secundaria', nivel: 'SECONDARY', color: '#be123c' },
  ];
  const agregarporNivel = (cursos: typeof cursosdetalle) => nivelesbase.map((grupo) => {
    const cursosdelnivel = cursos.filter(
      (curso) => obtenierniveleducativoregular(curso.gradeLevel) === grupo.nivel,
    );
    return {
      ...grupo,
      total: cursosdelnivel.reduce((suma, curso) => suma + curso.enrollmentCount, 0),
      capacidad: cursosdelnivel.reduce((suma, curso) => suma + curso.maxCapacity, 0),
      cursos: cursosdelnivel.length,
    };
  });
  const estudiantespornivel = agregarporNivel(cursosestudiantes);
  const totalestudiantesgrafico = cursosestudiantes.reduce((suma, curso) => suma + curso.enrollmentCount, 0);
  const matriculados = cursosocupacion.reduce((suma, curso) => suma + curso.enrollmentCount, 0);
  const capacidad = cursosocupacion.reduce((suma, curso) => suma + curso.maxCapacity, 0);
  const ocupacion = capacidad > 0 ? Math.min(100, Math.round((matriculados / capacidad) * 100)) : 0;
  const cursosordenados = [...cursostop]
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 6);
  const maximocurso = Math.max(1, ...cursosordenados.map((curso) => curso.enrollmentCount));
  const cursosporturno = [
    { codigo: 'MORNING', label: 'Mañana' },
    { codigo: 'AFTERNOON', label: 'Tarde' },
    { codigo: 'EVENING', label: 'Noche' },
  ].map((turno) => ({
    ...turno,
    total: cursosporfiltroturno.filter((curso) => curso.shift === turno.codigo).length,
  })).filter((turno) => turno.total > 0);
  const maxturno = Math.max(1, ...cursosporturno.map((turno) => turno.total));
  const matriculasporgrado = Array.from(
    cursosgrado.reduce((grupos, curso) => {
      const grupo = grupos.get(curso.gradeLevel) ?? {
        gradeLevel: curso.gradeLevel,
        label: curso.name
          .replace(/\s*(?:-|–)\s*[A-C]$/i, '')
          .replace(/\s+[A-C]$/i, '')
          .trim(),
        total: 0,
        capacidad: 0,
      };
      grupo.total += curso.enrollmentCount;
      grupo.capacidad += curso.maxCapacity;
      grupos.set(curso.gradeLevel, grupo);
      return grupos;
    }, new Map<number, { gradeLevel: number; label: string; total: number; capacidad: number }>()),
  ).map(([, grupo]) => grupo).sort((a, b) => a.gradeLevel - b.gradeLevel);
  const maxmatriculasgrado = Math.max(1, ...matriculasporgrado.map((grupo) => grupo.total));
  const capacidadpornivel = agregarporNivel(cursoscapacidad);
  const matriculasporparalelo = [...cursosporgrafoparalelo.reduce((grupos, curso) => {
    const key = `${curso.gradeLevel}:${curso.section ?? curso.name.slice(-1)}`;
    const grupo = grupos.get(key) ?? {
      key,
      label: `${cursoetiqueta(curso.name.replace(/\s*(?:-|–)\s*[A-C]$/i, '').replace(/\s+[A-C]$/i, '').trim())} · Paralelo ${curso.section ?? curso.name.slice(-1)}`,
      total: 0,
      capacidad: 0,
    };
    grupo.total += curso.enrollmentCount;
    grupo.capacidad += curso.maxCapacity;
    grupos.set(key, grupo);
    return grupos;
  }, new Map<string, { key: string; label: string; total: number; capacidad: number }>()).values()];
  const paralelosordenados = matriculasporparalelo.sort((a, b) => b.total - a.total).slice(0, 8);
  const maxparalelo = Math.max(1, ...paralelosordenados.map((grupo) => grupo.total));
  const establecerfiltro = (campo: keyof typeof filtros) => (valor: string) => establecerfiltros((actual) => ({ ...actual, [campo]: valor }));

  return (
    <div ref={panelref} className="space-y-6">
      {/* Header institucional */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              1er Trimestre Vigente
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">Gestión Escolar 2026</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel académico institucional</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Resumen centralizado de matrículas, carga docente y avance curricular según normativa Ley 070.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard/reports">
            <Boton variant="outline" size="sm" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Centralizadores
            </Boton>
          </Link>
          {['ADMINISTRATIVE', 'SECRETARY'].includes(rol ?? '') && (
            <Link to="/dashboard/sie-sync">
              <Boton variant="outline" size="sm" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs">
                <RefreshCw className="h-4 w-4 text-brand-700" /> Sincronización SIE
              </Boton>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricaTarjeta
          title="Estudiantes matriculados"
          value={cantidadetiqueta(
            estudiantesconsulta.data,
            estudiantesconsulta.isPending,
            estudiantesconsulta.isError,
          )}
          detail="Registros de alumnos activos"
          icon={Users}
          link="/dashboard/students"
          linkLabel="Ver lista"
          tone="brand"
        />
        <MetricaTarjeta
          title="Cursos habilitados"
          value={cantidadetiqueta(
            cursosconsulta.data,
            cursosconsulta.isPending,
            cursosconsulta.isError,
            puedeleercursos,
          )}
          detail="Inicial, Primaria y Secundaria"
          icon={GraduationCap}
          link="/dashboard/courses"
          linkLabel="Ver cursos"
          tone="amber"
        />
        <MetricaTarjeta
          title="Docentes en Magisterio"
          value={cantidadetiqueta(
            docentesconsulta.data,
            docentesconsulta.isPending,
            docentesconsulta.isError,
            puedeleerdocentes,
          )}
          detail="Expediente RDA y Escalafón"
          icon={BookOpen}
          link="/dashboard/teachers"
          linkLabel="Ver docentes"
          tone="orange"
        />
        <MetricaTarjeta
          title="Actividades y evaluaciones"
          value={cantidadetiqueta(
            asignacionesconsulta.data,
            asignacionesconsulta.isPending,
            asignacionesconsulta.isError,
          )}
          detail="Tareas y exámenes vigentes"
          icon={ClipboardList}
          link="/dashboard/assignments"
          linkLabel="Ver actividades"
          tone="emerald"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-slate-900">Estudiantes por nivel</h2>
              <p className="mt-1 text-xs text-slate-500">Matrículas visibles por nivel educativo</p></div>
            <FiltroGrafico label="Turno" value={filtros.turnoEstudiantes} options={filtrosturno} onChange={establecerfiltro('turnoEstudiantes')} />
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando distribución…</p>
          ) : cursosdetalleconsulta.isError ? (
            <p className="mt-5 text-sm text-rose-700">No se pudo cargar la distribución.</p>
          ) : cursosdetalle.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">Todavía no hay cursos registrados.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {estudiantespornivel.map((grupo) => (
                <div key={grupo.nivel}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{grupo.label}</span>
                    <span className="tabular-nums text-slate-900">{grupo.total}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                      style={{
                        width: `${totalestudiantesgrafico ? (grupo.total / totalestudiantesgrafico) * 100 : 0}%`,
                        backgroundColor: grupo.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-slate-900">Ocupación de plazas</h2>
              <p className="mt-1 text-xs text-slate-500">Matrículas frente a capacidad configurada</p></div>
            <FiltroGrafico label="Nivel" value={filtros.nivelOcupacion} options={filtrosnivel} onChange={establecerfiltro('nivelOcupacion')} />
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando ocupación…</p>
          ) : cursosdetalleconsulta.isError ? (
            <p className="mt-5 text-sm text-rose-700">No se pudo cargar la ocupación.</p>
          ) : capacidad === 0 ? (
            <p className="mt-5 text-sm text-slate-500">No hay plazas configuradas.</p>
          ) : (
            <div className="mt-5 flex items-center gap-6">
              <div
                className="grid h-32 w-32 shrink-0 place-items-center rounded-full"
                style={{ background: `conic-gradient(#a63b4b ${ocupacion}%, #e8edf2 0)` }}
                role="img"
                aria-label={`${ocupacion}% de plazas ocupadas`}
              >
                <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-2xl font-bold tabular-nums text-slate-900">
                  {ocupacion}%
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong className="tabular-nums text-slate-900">{matriculados}</strong> matrículas</p>
                <p><strong className="tabular-nums text-slate-900">{capacidad}</strong> plazas</p>
                <p className="text-xs text-slate-500">Capacidad configurada; no equivale a asistencia.</p>
              </div>
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-slate-900">Cursos con más matrículas</h2>
              <p className="mt-1 text-xs text-slate-500">Hasta seis grupos para comparar</p></div>
            <div className="flex flex-wrap gap-2">
              <FiltroGrafico label="Nivel" value={filtros.nivelCursos} options={filtrosnivel} onChange={establecerfiltro('nivelCursos')} />
              <FiltroGrafico label="Turno" value={filtros.turnoCursos} options={filtrosturno} onChange={establecerfiltro('turnoCursos')} />
            </div>
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando cursos…</p>
          ) : cursosordenados.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">Sin cursos para comparar.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {cursosordenados.map((curso) => (
                <div key={curso.id} className="grid grid-cols-[minmax(0,1fr)_minmax(5rem,1fr)_2rem] items-center gap-3 text-xs">
                  <span className="truncate text-slate-700" title={curso.name}>{cursoetiqueta(curso.name)}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-slate-700" style={{ width: `${(curso.enrollmentCount / maximocurso) * 100}%` }} />
                  </div>
                  <span className="text-right font-semibold tabular-nums text-slate-900">{curso.enrollmentCount}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-slate-900">Matrícula por grado</h2>
              <p className="mt-1 text-xs text-slate-500">Suma las secciones de cada grado</p></div>
            <FiltroGrafico label="Turno" value={filtros.turnoGrado} options={filtrosturno} onChange={establecerfiltro('turnoGrado')} />
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando grados…</p>
          ) : cursosdetalleconsulta.isError ? (
            <p className="mt-5 text-sm text-rose-700">No se pudo cargar la matrícula por grado.</p>
          ) : matriculasporgrado.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">Todavía no hay grados registrados.</p>
          ) : (
            <div className="mt-4 grid max-h-96 gap-x-6 gap-y-3 overflow-y-auto pr-2 sm:grid-cols-2">
              {matriculasporgrado.map((grupo) => (
                <div key={grupo.gradeLevel} className="min-w-0">
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium text-slate-700" title={cursoetiqueta(grupo.label)}>{cursoetiqueta(grupo.label)}</span>
                    <span className="shrink-0 tabular-nums text-slate-900">{grupo.total}<span className="text-slate-400">/{grupo.capacidad}</span></span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${cursoetiqueta(grupo.label)}: ${grupo.total} matrículas de ${grupo.capacidad} plazas`}>
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(100, (grupo.total / maxmatriculasgrado) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-slate-900">Capacidad por nivel</h2>
              <p className="mt-1 text-xs text-slate-500">Compara matrículas y plazas disponibles</p></div>
            <FiltroGrafico label="Turno" value={filtros.turnoCapacidad} options={filtrosturno} onChange={establecerfiltro('turnoCapacidad')} />
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando capacidad…</p>
          ) : cursosdetalle.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">No hay cursos para comparar.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {capacidadpornivel.map((grupo) => (
                <div key={grupo.nivel}>
                  <div className="mb-1 flex justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-700">{grupo.label}</span>
                    <span className="tabular-nums text-slate-700">{grupo.total} de {grupo.capacidad}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${grupo.label}: ${grupo.total} matrículas de ${grupo.capacidad} plazas`}>
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${grupo.capacidad ? Math.min(100, (grupo.total / grupo.capacidad) * 100) : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-slate-900">Cursos por turno</h2>
              <p className="mt-1 text-xs text-slate-500">Cantidad de grupos registrados por jornada</p></div>
            <FiltroGrafico label="Nivel" value={filtros.nivelTurno} options={filtrosnivel} onChange={establecerfiltro('nivelTurno')} />
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando turnos…</p>
          ) : cursosporturno.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">No hay turnos configurados.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {cursosporturno.map((turno) => (
                <div key={turno.codigo} className="grid grid-cols-[5rem_1fr_2rem] items-center gap-3 text-xs">
                  <span className="text-slate-700">{turno.label}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-slate-700" style={{ width: `${(turno.total / maxturno) * 100}%` }} />
                  </div>
                  <span className="text-right font-semibold tabular-nums text-slate-900">{turno.total}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <div><h2 className="text-sm font-semibold text-slate-900">Matrícula por paralelo</h2>
                <p className="mt-1 text-xs text-slate-500">Grupos con mayor cantidad de estudiantes</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <FiltroGrafico label="Nivel" value={filtros.nivelParalelo} options={filtrosnivel} onChange={establecerfiltro('nivelParalelo')} />
              <FiltroGrafico label="Turno" value={filtros.turnoParalelo} options={filtrosturno} onChange={establecerfiltro('turnoParalelo')} />
            </div>
          </div>
          {cursosdetalleconsulta.isPending ? (
            <p className="mt-5 text-sm text-slate-500">Cargando paralelos…</p>
          ) : paralelosordenados.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">No hay paralelos para mostrar con estos filtros.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {paralelosordenados.map((grupo) => (
                <div key={grupo.key} className="grid grid-cols-[minmax(0,1fr)_minmax(5rem,1fr)_2rem] items-center gap-3 text-xs">
                  <span className="truncate text-slate-700" title={grupo.label}>{grupo.label}</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${grupo.label}: ${grupo.total} estudiantes`}>
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${(grupo.total / maxparalelo) * 100}%` }} />
                  </div>
                  <span className="text-right font-semibold tabular-nums text-slate-900">{grupo.total}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-slate-900">Avance curricular</h2>
          </div>
          {!puedeleercursos ? (
            <p className="mt-3 text-sm text-slate-500">
              Esta información no está disponible para su rol.
            </p>
          ) : curriculoconsulta.isPending ? (
            <p className="mt-3 text-sm text-slate-500">Cargando datos…</p>
          ) : curriculoconsulta.isError ? (
            <p className="mt-3 text-sm text-slate-500">
              No se pudo consultar el avance curricular.
            </p>
          ) : !tienecurriculo ? (
            <p className="mt-3 text-sm text-slate-500">
              Todavía no hay temas curriculares registrados.
            </p>
          ) : (
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              <p>
                <strong className="text-xl text-slate-900">{curriculo.averageProgress}%</strong> de
                avance medio en {curriculo.totalTopics} temas registrados.
              </p>
              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Avance curricular medio"
                aria-valuenow={curriculo.averageProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-brand-600"
                  style={{ width: `${Math.min(100, Math.max(0, curriculo.averageProgress))}%` }}
                />
              </div>
              <p>
                {curriculo.completed} completados, {curriculo.inProgress} en desarrollo y{' '}
                {curriculo.planned} planificados.
              </p>
              <div className="flex h-4 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${curriculo.completed} temas completados, ${curriculo.inProgress} en desarrollo y ${curriculo.planned} planificados`}>
                <div className="bg-emerald-600" style={{ width: `${(curriculo.completed / curriculo.totalTopics) * 100}%` }} />
                <div className="bg-amber-500" style={{ width: `${(curriculo.inProgress / curriculo.totalTopics) * 100}%` }} />
                <div className="bg-slate-300" style={{ width: `${(curriculo.planned / curriculo.totalTopics) * 100}%` }} />
              </div>
            </div>
          )}
          <Link
            to="/dashboard/curriculum"
            className="mt-4 inline-block text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Ver planificación
          </Link>
        </section>

        <section data-panel-card className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-slate-900">Notas y asistencia</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Consulte los registros individuales o el reporte del curso. El promedio institucional y
            la tasa de asistencia requieren un cálculo consolidado de todos los registros; este
            panel no los muestra mientras ese cálculo no esté disponible.
          </p>
          <div className="mt-4 flex gap-4 text-xs font-medium">
            <Link to="/dashboard/grades" className="text-brand-600 hover:text-brand-700">
              Ver calificaciones
            </Link>
            <Link to="/dashboard/attendance" className="text-brand-600 hover:text-brand-700">
              Ver asistencia
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
