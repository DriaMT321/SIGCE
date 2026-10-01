import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  GraduationCap,
  Layers,
  ChevronRight,
  BarChart3,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { academicApi, CurriculumTopicItem } from '../../../lib/academic-api';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const TRIMESTRES = [
  { id: 0, label: 'Todos los Trimestres' },
  { id: 1, label: '1er Trimestre' },
  { id: 2, label: '2do Trimestre' },
  { id: 3, label: '3er Trimestre' },
];

const NIVELES = [
  { id: 'ALL', label: 'Todos los Niveles' },
  { id: 'INICIAL', label: 'Inicial (4 Cursos)' },
  { id: 'PRIMARIA', label: 'Primaria (1º a 6º)' },
  { id: 'SECUNDARIA', label: 'Secundaria (1º a 6º)' },
];

const GRADE_NAMES: Record<number, string> = {
  1: 'Pollito (Inicial)',
  2: 'Nidito (Inicial)',
  3: 'Pre Kinder (Inicial)',
  4: 'Kinder (Inicial)',
  5: '1º de Primaria',
  6: '2º de Primaria',
  7: '3º de Primaria',
  8: '4º de Primaria',
  9: '5º de Primaria',
  10: '6º de Primaria',
  11: '1º de Secundaria',
  12: '2º de Secundaria',
  13: '3º de Secundaria',
  14: '4º de Secundaria',
  15: '5º de Secundaria',
  16: '6º de Secundaria',
};

const CAMPO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Comunidad y Sociedad': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Ciencia, Tecnología y Producción': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'Vida Tierra Territorio': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  'Cosmos y Pensamiento': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'Desarrollo Infantil': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
};

export const CurriculumPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTrimestre, setSelectedTrimestre] = useState<number>(0);
  const [selectedNivel, setSelectedNivel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch Curriculum Stats
  const { data: statsData } = useQuery({
    queryKey: ['curriculum', 'stats'],
    queryFn: academicApi.getCurriculumStats,
  });
  const stats = statsData?.data;

  // Fetch Curriculum Topics
  const { data: topicsData, isLoading } = useQuery({
    queryKey: ['curriculum', 'list', selectedTrimestre, searchTerm],
    queryFn: () =>
      academicApi.listCurriculum({
        periodNumber: selectedTrimestre > 0 ? selectedTrimestre : undefined,
        search: searchTerm || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string; progressPercent?: number } }) =>
      academicApi.updateCurriculumProgress(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['curriculum'] });
    },
  });

  const allTopics = topicsData?.data ?? [];

  // Filter topics by nivel and status
  const filteredTopics = allTopics.filter((t) => {
    if (selectedNivel === 'INICIAL' && t.gradeLevel > 4) return false;
    if (selectedNivel === 'PRIMARIA' && (t.gradeLevel < 5 || t.gradeLevel > 10)) return false;
    if (selectedNivel === 'SECUNDARIA' && t.gradeLevel < 11) return false;
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
    return true;
  });

  const handleAdvance = (topic: CurriculumTopicItem, increment: number) => {
    const newProgress = Math.min(100, Math.max(0, topic.progressPercent + increment));
    let newStatus = topic.status;
    if (newProgress === 100) newStatus = 'COMPLETADO';
    else if (newProgress > 0) newStatus = 'EN_DESARROLLO';
    else newStatus = 'PLANIFICADO';

    updateMutation.mutate({
      id: topic.id,
      data: { progressPercent: newProgress, status: newStatus },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Planes y Programas Oficiales</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                R.M. 1040/2022
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Ministerio de Educación de Bolivia
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Avance Curricular Institucional
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Monitoreo pedagógico y cumplimiento temático en tiempo real estructurado por campos de saberes, unidades de aprendizaje y trimestres reglamentarios.
            </p>
          </div>

          {/* Global Progress Pill */}
          <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle self-start md:self-auto shrink-0">
            <div className="bg-white rounded-xl p-3.5 shadow-doppelrand-inner flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Avance Global
                </div>
                <div className="text-2xl font-black text-slate-950 font-mono tabular-nums">
                  {stats?.averageProgress ?? 0}%
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex flex-col items-center justify-center font-bold text-xs font-mono shadow-xs">
                <span>{stats?.completed ?? 0}</span>
                <span className="text-[9px] text-slate-400 font-normal">/{stats?.totalTopics ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Tarjetas de Métricas con Doble Bisel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temas Totales */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-2 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Temas Totales</span>
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                {stats?.totalTopics ?? 0}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Planificados gestión 2026</div>
            </div>
          </div>
        </div>

        {/* Nivel Inicial */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-2 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">Educación Inicial</span>
              <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                4 Cursos
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {stats?.byLevel?.inicial?.avgProgress ?? 0}%
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {stats?.byLevel?.inicial?.completed ?? 0} / {stats?.byLevel?.inicial?.total ?? 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats?.byLevel?.inicial?.avgProgress ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nivel Primaria */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-2 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Educación Primaria</span>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                1º a 6º
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {stats?.byLevel?.primaria?.avgProgress ?? 0}%
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {stats?.byLevel?.primaria?.completed ?? 0} / {stats?.byLevel?.primaria?.total ?? 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats?.byLevel?.primaria?.avgProgress ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nivel Secundaria */}
        <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
          <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-2 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Educación Secundaria</span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1º a 6º
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {stats?.byLevel?.secundaria?.avgProgress ?? 0}%
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {stats?.byLevel?.secundaria?.completed ?? 0} / {stats?.byLevel?.secundaria?.total ?? 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stats?.byLevel?.secundaria?.avgProgress ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tema, unidad temática o contenido curricular..."
                className="pl-9 pr-4 h-10 text-xs bg-slate-50/60 border-slate-200/90 rounded-xl focus:bg-white transition-all"
              />
            </div>

            {/* Trimester Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
              {TRIMESTRES.map((trim) => (
                <button
                  key={trim.id}
                  onClick={() => setSelectedTrimestre(trim.id)}
                  className={`haptic-press px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedTrimestre === trim.id
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {trim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Nivel:
              </span>
              {NIVELES.map((niv) => (
                <button
                  key={niv.id}
                  onClick={() => setSelectedNivel(niv.id)}
                  className={`haptic-press px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedNivel === niv.id
                      ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {niv.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Estado:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-8 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="PLANIFICADO">Planificado</option>
                <option value="EN_DESARROLLO">En Desarrollo</option>
                <option value="COMPLETADO">Completado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Contenidos Curriculares */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
          <span>Mostrando <strong className="text-slate-900 font-mono">{filteredTopics.length}</strong> contenidos curriculares</span>
          <span className="font-mono text-[11px] text-slate-400">R.M. 1040/2022</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <span className="text-xs font-medium font-mono text-slate-600">
              Cargando matriz de avance curricular...
            </span>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
            <div className="bg-white rounded-xl p-16 text-center text-slate-500 space-y-2 shadow-doppelrand-inner">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">No se encontraron temas con los filtros seleccionados</p>
              <p className="text-xs text-slate-400">Intente modificando el término de búsqueda o el nivel seleccionado.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredTopics.map((topic) => {
              const campoColor =
                CAMPO_COLORS[topic.campo] || {
                  bg: 'bg-slate-50',
                  text: 'text-slate-700',
                  border: 'border-slate-200',
                };

              const isCompleted = topic.status === 'COMPLETADO';
              const isInProgress = topic.status === 'EN_DESARROLLO';

              return (
                <div
                  key={topic.id}
                  className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle hover:border-slate-300 transition-all group"
                >
                  <div className="bg-white rounded-xl p-4 shadow-doppelrand-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Metadata & Details */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-900 text-white">
                          {GRADE_NAMES[topic.gradeLevel] || `Grado ${topic.gradeLevel}`}
                        </span>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${campoColor.bg} ${campoColor.text} ${campoColor.border}`}
                        >
                          {topic.subject?.name} ({topic.subject?.code})
                        </span>

                        <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {topic.periodNumber}º Trimestre
                        </span>

                        <span className="text-[11px] font-medium text-slate-400 truncate max-w-[200px]">
                          {topic.campo}
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          {topic.unitTitle}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-brand-900 transition-colors">
                          {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {topic.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Controls */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {topic.status}
                        </span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {topic.progressPercent}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : isInProgress
                              ? 'bg-blue-600'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${topic.progressPercent}%` }}
                        />
                      </div>

                      {/* Tactile Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAdvance(topic, -25)}
                          disabled={topic.progressPercent <= 0 || updateMutation.isPending}
                          className="haptic-press h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                        >
                          -25%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvance(topic, 25)}
                          disabled={topic.progressPercent >= 100 || updateMutation.isPending}
                          className="haptic-press h-7 px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                        >
                          +25%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvance(topic, 100)}
                          disabled={isCompleted || updateMutation.isPending}
                          className="haptic-press h-7 px-2.5 rounded-lg bg-slate-950 text-amber-400 hover:bg-slate-900 text-[10px] font-bold flex-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                        >
                          Completar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
