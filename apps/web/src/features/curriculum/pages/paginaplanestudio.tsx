import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Search, Filter, Loader2, GraduationCap, Plus, X } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import { obtenierniveleducativoregular } from '@academic/academic-domain';
import type { curriculoplanificacion, curriculotema } from '../application/planificacioncurricular';

const constantetrimestres = [
  { id: 0, label: 'Todos' },
  { id: 1, label: '1er Trimestre' },
  { id: 2, label: '2do Trimestre' },
  { id: 3, label: '3er Trimestre' },
];

const constanteniveles = [
  { id: 'ALL', label: 'Todos' },
  { id: 'INICIAL', label: 'Inicial' },
  { id: 'PRIMARIA', label: 'Primaria' },
  { id: 'SECUNDARIA', label: 'Secundaria' },
];

const constantecalificacionnombres: Record<number, string> = {
  1: '1º Inicial',
  2: '2º Inicial',
  3: '1º Primaria',
  4: '2º Primaria',
  5: '3º Primaria',
  6: '4º Primaria',
  7: '5º Primaria',
  8: '6º Primaria',
  9: '1º Secundaria',
  10: '2º Secundaria',
  11: '3º Secundaria',
  12: '4º Secundaria',
  13: '5º Secundaria',
  14: '6º Secundaria',
};

const constantecampocolores: Record<string, { bg: string; text: string; border: string }> = {
  'Comunidad y Sociedad': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  'Ciencia, Tecnología y Producción': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  'Vida Tierra Territorio': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  'Cosmos y Pensamiento': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  'Desarrollo Infantil': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

export const CurriculoPagina: React.FC<{ planning: curriculoplanificacion }> = ({
  planning: planificacion,
}) => {
  const clientedeconsultas = useQueryClient();
  const [seleccionadotrimestre, establecerseleccionadotrimestre] = useState<number>(0);
  const [seleccionadocursoid, establecerseleccionadocursoid] = useState<string>('ALL');
  const [seleccionadomateriaid, establecerseleccionadomateriaid] = useState<string>('ALL');
  const [seleccionadacurricular, establecerseleccionadacurricular] = useState<string>('ALL');
  const [seleccionadonivel, establecerseleccionadonivel] = useState<string>('ALL');
  const [seleccionadoestado, establecerseleccionadoestado] = useState<string>('ALL');
  const [buscartermino, establecerbuscartermino] = useState<string>('');
  const [mostrarcrearmateria, establecermostrarcrearmateria] = useState<boolean>(false);
  const [materianombre, establecermaterianombre] = useState<string>('');
  const [materiacodigo, establecermateriacodigo] = useState<string>('');
  const [materiaarea, establecermateriaarea] = useState<string>('Comunidad y Sociedad');
  const [materiadescripcion, establecermateriadescripcion] = useState<string>('');
  const [materiaerror, establecermateriaerror] = useState<string | null>(null);

  const { data: cursosdatos } = useQuery({
    queryKey: ['curriculum-courses'],
    queryFn: () => planificacion.listarcursos(),
  });
  const cursos = cursosdatos ?? [];

  const { data: estadisticasdatos } = useQuery({
    queryKey: ['curriculum', 'stats'],
    queryFn: () => planificacion.obtenerestadisticas(),
  });
  const estadisticas = estadisticasdatos;

  const crearmateriamutacion = useMutation({
    mutationFn: async () => {
      establecermateriaerror(null);
      if (!materiacodigo.trim()) throw new Error('El código de materia es requerido.');
      if (!materianombre.trim()) throw new Error('El nombre de materia es requerido.');
      return planificacion.crearmateria({
        code: materiacodigo.trim(),
        name: materianombre.trim(),
        area: materiaarea.trim() || undefined,
        description: materiadescripcion.trim() || undefined,
      });
    },
    onSuccess: () => {
      establecermostrarcrearmateria(false);
      establecermaterianombre('');
      establecermateriacodigo('');
      establecermateriadescripcion('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['curriculum'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (error: unknown) => {
      establecermateriaerror(
        error instanceof Error ? error.message : 'Error al registrar la materia.',
      );
    },
  });

  const { data: temasdatos, isLoading: escarga } = useQuery({
    queryKey: ['curriculum', 'list', seleccionadotrimestre, seleccionadocursoid, buscartermino],
    queryFn: () =>
      planificacion.listartemas({
        periodNumber: seleccionadotrimestre > 0 ? seleccionadotrimestre : undefined,
        courseId: seleccionadocursoid !== 'ALL' ? seleccionadocursoid : undefined,
        search: buscartermino || undefined,
      }),
  });

  const actualizarmutacion = useMutation({
    mutationFn: ({
      topic: tema,
      increment: incremento,
    }: {
      topic: curriculotema;
      increment: number;
    }) => planificacion.avanzaravance(tema, incremento),
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['curriculum'] });
    },
  });

  const todostemas = temasdatos ?? [];

  const filtradotemas = todostemas.filter((t) => {
    const nivel = obtenierniveleducativoregular(t.gradeLevel);
    if (seleccionadonivel === 'INICIAL' && nivel !== 'INITIAL') return false;
    if (seleccionadonivel === 'PRIMARIA' && nivel !== 'PRIMARY') return false;
    if (seleccionadonivel === 'SECUNDARIA' && nivel !== 'SECONDARY') return false;
    if (seleccionadomateriaid !== 'ALL' && t.subject?.id !== seleccionadomateriaid) return false;
    if (seleccionadacurricular !== 'ALL' && (t.subject?.area ?? t.campo) !== seleccionadacurricular) return false;
    if (seleccionadoestado !== 'ALL' && t.status !== seleccionadoestado) return false;
    return true;
  });
  const areasdisponibles = [...new Set(
    todostemas.map((tema) => tema.subject?.area ?? tema.campo).filter((area): area is string => Boolean(area)),
  )].sort((a, b) => a.localeCompare(b, 'es'));
  const materiasdisponibles = [...new Map(
    todostemas
      .filter((tema) => tema.subject)
      .map((tema) => [tema.subject!.id, tema.subject!] as const),
  ).values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const manejaravanzar = (tema: curriculotema, incremento: number) => {
    actualizarmutacion.mutate({ topic: tema, increment: incremento });
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Avance Curricular</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {estadisticas?.totalTopics ?? 0} temas · {estadisticas?.averageProgress ?? 0}% avance
            global
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Boton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => establecermostrarcrearmateria(true)}
            className="gap-1.5"
            title="Registrar una nueva asignatura (RF-15)"
          >
            <Plus className="w-4 h-4" />
            Nueva Materia
          </Boton>
          <div className="text-right">
            <div className="text-xs text-slate-500">Avance Global</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {estadisticas?.averageProgress ?? 0}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex flex-col items-center justify-center font-bold text-xs font-mono">
            <span>{estadisticas?.completed ?? 0}</span>
            <span className="text-[9px] text-slate-400 font-normal">
              /{estadisticas?.totalTopics ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Level Progress - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Inicial', stats: estadisticas?.byLevel?.inicial, color: 'bg-sky-500' },
          { label: 'Primaria', stats: estadisticas?.byLevel?.primaria, color: 'bg-blue-500' },
          {
            label: 'Secundaria',
            stats: estadisticas?.byLevel?.secundaria,
            color: 'bg-emerald-500',
          },
        ].map((nivel) => (
          <div key={nivel.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{nivel.label}</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {nivel.stats?.avgProgress ?? 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${nivel.color} rounded-full`}
                style={{ width: `${nivel.stats?.avgProgress ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {nivel.stats?.completed ?? 0} / {nivel.stats?.total ?? 0} temas
            </p>
          </div>
        ))}
      </div>

      {/* Filters - Single row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Entrada
              value={buscartermino}
              onChange={(e) => establecerbuscartermino(e.target.value)}
              placeholder="Buscar tema o contenido..."
              className="pl-9 h-10 text-sm"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {constantetrimestres.map((recortar) => (
              <button
                key={recortar.id}
                onClick={() => establecerseleccionadotrimestre(recortar.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  seleccionadotrimestre === recortar.id
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {recortar.label}
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
            {constanteniveles.map((nivel) => (
              <button
                key={nivel.id}
                onClick={() => establecerseleccionadonivel(nivel.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  seleccionadonivel === nivel.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {nivel.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Área:</span>
              <select
                value={seleccionadacurricular}
                onChange={(e) => establecerseleccionadacurricular(e.target.value)}
                className="h-8 max-w-64 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
                aria-label="Filtrar por área curricular"
              >
                <option value="ALL">Todas las áreas</option>
                {areasdisponibles.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Materia:</span>
              <select
                value={seleccionadomateriaid}
                onChange={(e) => establecerseleccionadomateriaid(e.target.value)}
                className="h-8 max-w-64 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">Todas las materias</option>
                {materiasdisponibles.map((materia) => (
                  <option key={materia.id} value={materia.id}>{materia.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Curso:
              </span>
              <select
                value={seleccionadocursoid}
                onChange={(e) => establecerseleccionadocursoid(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">Todos los Cursos</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Estado:</span>
              <select
                value={seleccionadoestado}
                onChange={(e) => establecerseleccionadoestado(e.target.value)}
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
        {actualizarmutacion.isError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
          >
            {actualizarmutacion.error.message || 'No se pudo actualizar el avance curricular.'}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Mostrando <strong className="text-slate-900">{filtradotemas.length}</strong> contenidos
          </span>
        </div>

        {escarga ? (
          <div role="status" className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando contenidos...</span>
          </div>
        ) : filtradotemas.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No se encontraron temas</p>
            <p className="text-sm text-slate-400">Intente con otros filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtradotemas.map((tema) => {
              const campocolor = constantecampocolores[tema.campo] || {
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                border: 'border-slate-200',
              };

              const escompletado = tema.status === 'COMPLETADO';
              const esenavance = tema.status === 'EN_DESARROLLO';

              return (
                <div
                  key={tema.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {tema.course?.name ||
                            constantecalificacionnombres[tema.gradeLevel] ||
                            `Grado ${tema.gradeLevel}`}
                        </span>

                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md border ${campocolor.bg} ${campocolor.text} ${campocolor.border}`}
                        >
                          {tema.subject?.name} ({tema.subject?.code})
                        </span>

                        <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {tema.periodNumber}º Trimestre
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                          {tema.unitTitle}
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                          {tema.title}
                        </h3>
                        {tema.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {tema.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-mono font-semibold px-2 py-0.5 rounded-full text-xs uppercase tracking-wide ${
                            escompletado
                              ? 'bg-emerald-50 text-emerald-700'
                              : esenavance
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tema.status}
                        </span>
                        <span className="font-mono font-semibold text-slate-900">
                          {tema.progressPercent}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            escompletado
                              ? 'bg-emerald-500'
                              : esenavance
                                ? 'bg-blue-500'
                                : 'bg-slate-300'
                          }`}
                          style={{ width: `${tema.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => manejaravanzar(tema, -25)}
                          disabled={tema.progressPercent <= 0 || actualizarmutacion.isPending}
                          className="h-7 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        >
                          -25%
                        </button>
                        <button
                          type="button"
                          onClick={() => manejaravanzar(tema, 25)}
                          disabled={tema.progressPercent >= 100 || actualizarmutacion.isPending}
                          className="h-7 px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                        >
                          +25%
                        </button>
                        <button
                          type="button"
                          onClick={() => manejaravanzar(tema, 100)}
                          disabled={escompletado || actualizarmutacion.isPending}
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

      {/* Modal: Nueva Asignatura / Materia (RF-15) */}
      {mostrarcrearmateria && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-crear-materia"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="titulo-crear-materia" className="text-base font-bold text-slate-900">
                Nueva Asignatura (RF-15)
              </h2>
              <button
                type="button"
                onClick={() => establecermostrarcrearmateria(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                crearmateriamutacion.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Código de Materia
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. MAT, CS-SOC, ART-PLAS"
                  value={materiacodigo}
                  onChange={(e) => establecermateriacodigo(e.target.value.toUpperCase())}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <span className="text-[11px] text-slate-400">
                  Admite letras, números, punto y guiones.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre de la Asignatura
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Matemática y Razonamiento Lógico"
                  value={materianombre}
                  onChange={(e) => establecermaterianombre(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Área de Conocimiento / Campo
                </label>
                <select
                  value={materiaarea}
                  onChange={(e) => establecermateriaarea(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="Comunidad y Sociedad">Comunidad y Sociedad</option>
                  <option value="Ciencia, Tecnología y Producción">Ciencia, Tecnología y Producción</option>
                  <option value="Vida Tierra Territorio">Vida Tierra Territorio</option>
                  <option value="Cosmos y Pensamiento">Cosmos y Pensamiento</option>
                  <option value="Desarrollo Infantil">Desarrollo Infantil</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contenidos clave o alcances pedagógicos..."
                  value={materiadescripcion}
                  onChange={(e) => establecermateriadescripcion(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {materiaerror && (
                <p role="alert" className="text-xs text-rose-700">
                  {materiaerror}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => establecermostrarcrearmateria(false)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  size="sm"
                  disabled={crearmateriamutacion.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {crearmateriamutacion.isPending ? 'Creando…' : 'Crear Asignatura'}
                </Boton>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
