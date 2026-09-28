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
  'Comunidad y Sociedad': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Ciencia, Tecnología y Producción': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Vida Tierra Territorio': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Cosmos y Pensamiento': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Desarrollo Infantil': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
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
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Planes y Programas Oficiales</span>
            </span>
            <Badge variant="outline" className="font-mono text-slate-700 bg-white">
              R.M. 1040/2022 (4095.pdf & 4096.pdf)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Avance Curricular Institucional
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Monitoreo pedagógico en tiempo real por campos de saberes, unidades temáticas y trimestres oficiales.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avance General
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {stats?.averageProgress ?? 0}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
            {stats?.completed ?? 0}/{stats?.totalTopics ?? 0}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Topics */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Temas Totales</span>
            <BookOpen className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {stats?.totalTopics ?? 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">Planificados para la gestión 2026</div>
        </div>

        {/* Inicial */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nivel Inicial</span>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
              4 Cursos
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {stats?.byLevel?.inicial?.avgProgress ?? 0}%
            </div>
            <div className="text-xs text-slate-500">
              {stats?.byLevel?.inicial?.completed ?? 0} de {stats?.byLevel?.inicial?.total ?? 0} completados
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats?.byLevel?.inicial?.avgProgress ?? 0}%` }}
            />
          </div>
        </div>

        {/* Primaria */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nivel Primaria</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              1º a 6º
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {stats?.byLevel?.primaria?.avgProgress ?? 0}%
            </div>
            <div className="text-xs text-slate-500">
              {stats?.byLevel?.primaria?.completed ?? 0} de {stats?.byLevel?.primaria?.total ?? 0} completados
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats?.byLevel?.primaria?.avgProgress ?? 0}%` }}
            />
          </div>
        </div>

        {/* Secundaria */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nivel Secundaria</span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              1º a 6º
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {stats?.byLevel?.secundaria?.avgProgress ?? 0}%
            </div>
            <div className="text-xs text-slate-500">
              {stats?.byLevel?.secundaria?.completed ?? 0} de {stats?.byLevel?.secundaria?.total ?? 0} completados
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats?.byLevel?.secundaria?.avgProgress ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tema, unidad temática o contenido curricular..."
              className="pl-9 h-10 text-xs sm:text-sm bg-slate-50/70 border-slate-200 rounded-xl"
            />
          </div>

          {/* Trimester Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            {TRIMESTRES.map((trim) => (
              <button
                key={trim.id}
                onClick={() => setSelectedTrimestre(trim.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTrimestre === trim.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {trim.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Nivel:
            </span>
            {NIVELES.map((niv) => (
              <button
                key={niv.id}
                onClick={() => setSelectedNivel(niv.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedNivel === niv.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {niv.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="PLANIFICADO">Planificado</option>
              <option value="EN_DESARROLLO">En Desarrollo</option>
              <option value="COMPLETADO">Completado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
          <span>Mostrando {filteredTopics.length} contenidos curriculares</span>
          <span>Basado en R.M. 1040/2022 del Ministerio de Educación</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Cargando temas del avance curricular...
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            No se encontraron temas con los filtros seleccionados.
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
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Topic Metadata & Details */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-900 text-white">
                        {GRADE_NAMES[topic.gradeLevel] || `Grado ${topic.gradeLevel}`}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${campoColor.bg} ${campoColor.text} ${campoColor.border}`}
                      >
                        {topic.subject?.name} ({topic.subject?.code})
                      </span>

                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {topic.periodNumber}º Trimestre
                      </span>

                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
                        {topic.campo}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {topic.unitTitle}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {topic.title}
                      </h3>
                      {topic.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Controls & Status */}
                  <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {topic.status}
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {topic.progressPercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isInProgress
                            ? 'bg-blue-600'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${topic.progressPercent}%` }}
                      />
                    </div>

                    {/* Action Buttons for quick progress update */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdvance(topic, -25)}
                        disabled={topic.progressPercent <= 0 || updateMutation.isPending}
                        className="h-7 px-2 text-[10px] font-bold text-slate-600"
                      >
                        -25%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAdvance(topic, 25)}
                        disabled={topic.progressPercent >= 100 || updateMutation.isPending}
                        className="h-7 px-2 text-[10px] font-bold text-blue-700 bg-blue-50/50 border-blue-200"
                      >
                        +25%
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAdvance(topic, 100)}
                        disabled={isCompleted || updateMutation.isPending}
                        className="h-7 px-2 text-[10px] font-bold flex-1 bg-slate-900 text-amber-400 hover:bg-slate-800"
                      >
                        Completar
                      </Button>
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
