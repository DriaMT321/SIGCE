import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Search,
  Filter,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { academicApi, CurriculumTopicItem } from '../../../lib/academic-api';
import { Input } from '../../../components/ui/input';

const TRIMESTRES = [
  { id: 0, label: 'Todos' },
  { id: 1, label: '1er Trimestre' },
  { id: 2, label: '2do Trimestre' },
  { id: 3, label: '3er Trimestre' },
];

const NIVELES = [
  { id: 'ALL', label: 'Todos' },
  { id: 'INICIAL', label: 'Inicial' },
  { id: 'PRIMARIA', label: 'Primaria' },
  { id: 'SECUNDARIA', label: 'Secundaria' },
];

const GRADE_NAMES: Record<number, string> = {
  1: 'Pollito',
  2: 'Nidito',
  3: 'Pre Kinder',
  4: 'Kinder',
  5: '1º Primaria',
  6: '2º Primaria',
  7: '3º Primaria',
  8: '4º Primaria',
  9: '5º Primaria',
  10: '6º Primaria',
  11: '1º Secundaria',
  12: '2º Secundaria',
  13: '3º Secundaria',
  14: '4º Secundaria',
  15: '5º Secundaria',
  16: '6º Secundaria',
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [selectedNivel, setSelectedNivel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicApi.listCourses(),
  });
  const courses = coursesData?.data ?? [];

  const { data: statsData } = useQuery({
    queryKey: ['curriculum', 'stats'],
    queryFn: academicApi.getCurriculumStats,
  });
  const stats = statsData?.data;

  const { data: topicsData, isLoading } = useQuery({
    queryKey: ['curriculum', 'list', selectedTrimestre, selectedCourseId, searchTerm],
    queryFn: () =>
      academicApi.listCurriculum({
        periodNumber: selectedTrimestre > 0 ? selectedTrimestre : undefined,
        courseId: selectedCourseId !== 'ALL' ? selectedCourseId : undefined,
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
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Avance Curricular</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {stats?.totalTopics ?? 0} temas · {stats?.averageProgress ?? 0}% avance global
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Avance Global</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {stats?.averageProgress ?? 0}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex flex-col items-center justify-center font-bold text-xs font-mono">
            <span>{stats?.completed ?? 0}</span>
            <span className="text-[9px] text-slate-400 font-normal">/{stats?.totalTopics ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Level Progress - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Inicial', stats: stats?.byLevel?.inicial, color: 'bg-sky-500' },
          { label: 'Primaria', stats: stats?.byLevel?.primaria, color: 'bg-blue-500' },
          { label: 'Secundaria', stats: stats?.byLevel?.secundaria, color: 'bg-emerald-500' },
        ].map((level) => (
          <div key={level.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{level.label}</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {level.stats?.avgProgress ?? 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${level.color} rounded-full`}
                style={{ width: `${level.stats?.avgProgress ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {level.stats?.completed ?? 0} / {level.stats?.total ?? 0} temas
            </p>
          </div>
        ))}
      </div>

      {/* Filters - Single row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tema o contenido..."
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {TRIMESTRES.map((trim) => (
              <button
                key={trim.id}
                onClick={() => setSelectedTrimestre(trim.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTrimestre === trim.id
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {trim.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Nivel:
            </span>
            {NIVELES.map((niv) => (
              <button
                key={niv.id}
                onClick={() => setSelectedNivel(niv.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedNivel === niv.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {niv.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Curso:
              </span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">Todos los Cursos</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Estado:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
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

      {/* Topics List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando <strong className="text-slate-900">{filteredTopics.length}</strong> contenidos</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando contenidos...</span>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No se encontraron temas</p>
            <p className="text-sm text-slate-400">Intente con otros filtros.</p>
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
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {topic.course?.name || GRADE_NAMES[topic.gradeLevel] || `Grado ${topic.gradeLevel}`}
                        </span>

                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md border ${campoColor.bg} ${campoColor.text} ${campoColor.border}`}
                        >
                          {topic.subject?.name} ({topic.subject?.code})
                        </span>

                        <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {topic.periodNumber}º Trimestre
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                          {topic.unitTitle}
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                          {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {topic.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-mono font-semibold px-2 py-0.5 rounded-full text-xs uppercase tracking-wide ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {topic.status}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {topic.progressPercent}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted
                              ? 'bg-emerald-500'
                              : isInProgress
                              ? 'bg-blue-500'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${topic.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAdvance(topic, -25)}
                          disabled={topic.progressPercent <= 0 || updateMutation.isPending}
                          className="h-7 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        >
                          -25%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvance(topic, 25)}
                          disabled={topic.progressPercent >= 100 || updateMutation.isPending}
                          className="h-7 px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                        >
                          +25%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvance(topic, 100)}
                          disabled={isCompleted || updateMutation.isPending}
                          className="h-7 px-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex-1 disabled:opacity-40"
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
