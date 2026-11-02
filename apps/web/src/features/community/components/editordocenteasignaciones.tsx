import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Check, Loader2, Search } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import { materiacorrespondealgrado } from '../../../lib/materiaspornivel';
import type { docenteasignacion, gestioncomunidad } from '../application/gestioncomunidad';

interface editordocenteasignacionespropiedades {
  teacherId: string;
  assignments: docenteasignacion[];
  subjects: Array<{ id: string; code: string; name: string; area?: string | null }>;
  management: gestioncomunidad;
  onAssignmentsChanged: (courseId: string, assignments: docenteasignacion[]) => void;
}

export function Editordocenteasignaciones({
  teacherId: iddocente,
  assignments: asignaciones,
  subjects: materias,
  management: gestion,
  onAssignmentsChanged: cambiarasignaciones,
}: editordocenteasignacionespropiedades) {
  const clientedeconsultas = useQueryClient();
  const [courseId, establecercursoid] = useState('');
  const [subjectIds, establecermateriasids] = useState<string[]>([]);
  const [busquedacurso, establecerbusquedacurso] = useState('');
  const [busquedamateria, establecerbusquedamateria] = useState('');
  const [solomarcadas, establecersolomarcadas] = useState(false);
  const [feedback, establecerfeedback] = useState('');

  const gestionesconsulta = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => gestion.listaracademicogestiones(),
  });
  const gestionactiva = gestionesconsulta.data?.find((g) => g.isActive);
  const cursosconsulta = useQuery({
    queryKey: ['courses', 'teacher-assignment-editor', gestionactiva?.id],
    queryFn: async () => {
      const resultado = await gestion.listarcursos();
      return resultado.filter((curso) => curso.academicYearId === gestionactiva?.id);
    },
    enabled: Boolean(gestionactiva?.id),
  });
  const cursos = useMemo(
    () =>
      [...(cursosconsulta.data ?? [])].sort(
        (a, b) => a.gradeLevel - b.gradeLevel || a.section.localeCompare(b.section),
      ),
    [cursosconsulta.data],
  );
  const cursosfiltrados = useMemo(() => {
    const termino = busquedacurso.trim().toLocaleLowerCase('es');
    return cursos.filter((curso) =>
      `${curso.name} ${curso.gradeLevel} ${curso.section}`
        .toLocaleLowerCase('es')
        .includes(termino),
    );
  }, [busquedacurso, cursos]);
  const cursoseleccionado = cursos.find((curso) => curso.id === courseId);
  const materiasasignadascurso = useMemo(
    () => asignaciones.filter((asignacion) => asignacion.courseId === courseId),
    [asignaciones, courseId],
  );
  const materiasactualesids = useMemo(
    () => materiasasignadascurso.map((asignacion) => asignacion.subjectId).sort(),
    [materiasasignadascurso],
  );

  const materiasdelcurso = useMemo(() => {
    if (!cursoseleccionado) return [];
    const curriculares = materias.filter((materia) =>
      materiacorrespondealgrado(materia.code, cursoseleccionado.gradeLevel),
    );
    const idsvisibles = new Set(curriculares.map((materia) => materia.id));
    const asignadasactuales = materias.filter(
      (materia) => !idsvisibles.has(materia.id) && materiasactualesids.includes(materia.id),
    );
    return [...curriculares, ...asignadasactuales].sort((a, b) =>
      a.name.localeCompare(b.name, 'es'),
    );
  }, [cursoseleccionado, materias, materiasactualesids]);

  const materiasfiltradas = useMemo(() => {
    const termino = busquedamateria.trim().toLocaleLowerCase('es');
    return materiasdelcurso.filter((materia) => {
      const coincide =
        !termino ||
        `${materia.name} ${materia.code} ${materia.area ?? ''}`
          .toLocaleLowerCase('es')
          .includes(termino);
      return coincide && (!solomarcadas || subjectIds.includes(materia.id));
    });
  }, [busquedamateria, materiasdelcurso, solomarcadas, subjectIds]);

  const seleccionidsordenados = useMemo(() => [...subjectIds].sort(), [subjectIds]);
  const haycambios =
    materiasactualesids.length !== seleccionidsordenados.length ||
    materiasactualesids.some((id, indice) => id !== seleccionidsordenados[indice]);
  const asignacionesporcurso = useMemo(
    () =>
      asignaciones.reduce((conteo, asignacion) => {
        conteo.set(asignacion.courseId, (conteo.get(asignacion.courseId) ?? 0) + 1);
        return conteo;
      }, new Map<string, number>()),
    [asignaciones],
  );

  useEffect(() => {
    if (cursos.length === 0) {
      establecercursoid('');
      return;
    }
    if (!cursos.some((curso) => curso.id === courseId)) establecercursoid(cursos[0].id);
  }, [courseId, cursos]);

  useEffect(() => {
    establecermateriasids(materiasactualesids);
    establecerbusquedamateria('');
    establecersolomarcadas(false);
    establecerfeedback('');
  }, [courseId, materiasactualesids]);

  const guardarmaterias = useMutation({
    mutationFn: () => {
      if (!courseId) throw new Error('Selecciona un curso de la gestión activa.');
      return gestion.reemplazarmateriasdocente({
        courseId,
        teacherId: iddocente,
        subjectIds,
      });
    },
    onSuccess: (respuesta) => {
      const actualizadas: docenteasignacion[] = respuesta.assignments;
      cambiarasignaciones(courseId, actualizadas);
      establecerfeedback(
        `Cambios guardados: ${respuesta.added} vínculos añadidos y ${respuesta.removed} quitados.`,
      );
      void clientedeconsultas.invalidateQueries({ queryKey: ['teachers'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  const alternarmateria = (materiaid: string) => {
    establecermateriasids((actuales) =>
      actuales.includes(materiaid)
        ? actuales.filter((id) => id !== materiaid)
        : [...actuales, materiaid],
    );
    establecerfeedback('');
    guardarmaterias.reset();
  };

  const seleccionartodaslasvisibles = () => {
    establecermateriasids((actuales) => [
      ...new Set([...actuales, ...materiasfiltradas.map((materia) => materia.id)]),
    ]);
    establecerfeedback('');
    guardarmaterias.reset();
  };

  const quitartodaslasvisibles = () => {
    const visibles = new Set(materiasfiltradas.map((materia) => materia.id));
    establecermateriasids((actuales) => actuales.filter((id) => !visibles.has(id)));
    establecerfeedback('');
    guardarmaterias.reset();
  };

  const materiasdistintas = new Set(asignaciones.map((asignacion) => asignacion.subjectId)).size;
  const cursosdistintos = new Set(asignaciones.map((asignacion) => asignacion.courseId)).size;

  return (
    <section
      aria-labelledby="asignaciones-docente-heading"
      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <span className="rounded-lg bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200">
            <BookOpen aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h4 id="asignaciones-docente-heading" className="font-semibold text-slate-900">
              Materias por curso
            </h4>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">
              Revisa y modifica las materias que imparte este docente en cada curso de la gestión
              activa.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center" aria-label="Resumen de carga docente">
          <div className="min-w-[5.25rem] rounded-lg border border-slate-200 bg-white px-3 py-2">
            <strong className="block text-lg tabular-nums leading-5 text-slate-900">
              {asignaciones.length}
            </strong>
            <span className="mt-1 block text-[11px] leading-4 text-slate-600">vínculos</span>
          </div>
          <div className="min-w-[5.25rem] rounded-lg border border-slate-200 bg-white px-3 py-2">
            <strong className="block text-lg tabular-nums leading-5 text-slate-900">
              {materiasdistintas}
            </strong>
            <span className="mt-1 block text-[11px] leading-4 text-slate-600">materias</span>
          </div>
          <div className="min-w-[5.25rem] rounded-lg border border-slate-200 bg-white px-3 py-2">
            <strong className="block text-lg tabular-nums leading-5 text-slate-900">
              {cursosdistintos}
            </strong>
            <span className="mt-1 block text-[11px] leading-4 text-slate-600">cursos</span>
          </div>
        </div>
      </div>

      {gestionesconsulta.isError || cursosconsulta.isError ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          No se pudieron cargar la gestión activa y sus cursos. Actualiza el formulario para volver
          a intentarlo.
        </p>
      ) : gestionesconsulta.isLoading || cursosconsulta.isLoading ? (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Cargando cursos de la gestión activa…
        </p>
      ) : cursos.length === 0 ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          No hay cursos en una gestión activa para asignar materias.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Cursos
                </h5>
                <span className="text-xs tabular-nums text-slate-500">{cursos.length}</span>
              </div>
              <label className="relative block">
                <span className="sr-only">Buscar curso</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={busquedacurso}
                  onChange={(evento) => establecerbusquedacurso(evento.target.value)}
                  placeholder="Filtrar cursos"
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </label>
              <nav
                aria-label="Elegir curso"
                className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1"
              >
                {cursosfiltrados.map((curso) => {
                  const activa = curso.id === courseId;
                  const cantidad = asignacionesporcurso.get(curso.id) ?? 0;
                  return (
                    <button
                      key={curso.id}
                      type="button"
                      aria-pressed={activa}
                      disabled={guardarmaterias.isPending}
                      onClick={() => establecercursoid(curso.id)}
                      className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:opacity-60 ${activa ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <span className="min-w-0 truncate">{cursoetiqueta(curso.name)}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 tabular-nums ${activa ? 'bg-white/15 text-white' : cantidad ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {cantidad}
                      </span>
                    </button>
                  );
                })}
                {cursosfiltrados.length === 0 && (
                  <p className="px-2 py-3 text-xs text-slate-500">No hay cursos con ese nombre.</p>
                )}
              </nav>
              <p className="mt-2 border-t border-slate-100 pt-2 text-[11px] leading-4 text-slate-500">
                El número indica vínculos materia–curso en la gestión activa.
              </p>
            </aside>

            <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">Curso seleccionado</p>
                  <h5 className="mt-0.5 truncate text-base font-semibold text-slate-900">
                    {cursoseleccionado
                      ? cursoetiqueta(cursoseleccionado.name)
                      : 'Selecciona un curso'}
                  </h5>
                  <p className="mt-1 text-xs text-slate-600">
                    {subjectIds.length} materias seleccionadas
                    {gestionactiva ? ` · ${gestionactiva.year}` : ''}
                  </p>
                </div>
                <label className="relative block w-full sm:max-w-xs">
                  <span className="sr-only">Buscar materia</span>
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={busquedamateria}
                    onChange={(evento) => establecerbusquedamateria(evento.target.value)}
                    placeholder="Buscar materia, código o área"
                    className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 py-3">
                <p className="text-xs text-slate-600">
                  {materiasfiltradas.length} de {materiasdelcurso.length} materias visibles
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => establecersolomarcadas((actual) => !actual)}
                    aria-pressed={solomarcadas}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${solomarcadas ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {solomarcadas ? 'Ver todas' : 'Ver seleccionadas'}
                  </button>
                  <button
                    type="button"
                    onClick={seleccionartodaslasvisibles}
                    disabled={
                      materiasfiltradas.length === 0 ||
                      materiasfiltradas.every((materia) => subjectIds.includes(materia.id))
                    }
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Marcar visibles
                  </button>
                  <button
                    type="button"
                    onClick={quitartodaslasvisibles}
                    disabled={
                      materiasfiltradas.length === 0 ||
                      materiasfiltradas.every((materia) => !subjectIds.includes(materia.id))
                    }
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Quitar visibles
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/60">
                {materiasfiltradas.length === 0 ? (
                  <p className="p-5 text-sm text-slate-600">
                    {solomarcadas
                      ? 'No hay materias seleccionadas que coincidan. Cambia el filtro o muestra todas las materias.'
                      : 'No hay materias que coincidan con la búsqueda para este nivel.'}
                  </p>
                ) : (
                  <ul className="grid gap-2 p-2 sm:grid-cols-2">
                    {materiasfiltradas.map((materia) => {
                      const marcada = subjectIds.includes(materia.id);
                      const nohabitual = !materiacorrespondealgrado(
                        materia.code,
                        cursoseleccionado?.gradeLevel ?? 0,
                      );
                      return (
                        <li key={materia.id}>
                          <label
                            className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 transition-colors hover:border-slate-300 ${marcada ? 'border-emerald-300 bg-emerald-50/70' : 'border-slate-200 bg-white'}`}
                          >
                            <input
                              type="checkbox"
                              checked={marcada}
                              onChange={() => alternarmateria(materia.id)}
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium leading-5 text-slate-900">
                                {materia.name}
                              </span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
                                <span>{materia.code}</span>
                                {materia.area && <span>· {materia.area}</span>}
                                {nohabitual && (
                                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                                    asignación actual fuera del nivel
                                  </span>
                                )}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-xs leading-5 text-slate-600">
                  Quitar una materia no borra sus bloques de horario. Si ya aparece en el horario
                  del curso, primero habrá que reasignar o quitar ese bloque.
                </p>
                <Boton
                  type="button"
                  disabled={!haycambios || guardarmaterias.isPending}
                  onClick={() => guardarmaterias.mutate()}
                  className="shrink-0"
                >
                  {guardarmaterias.isPending ? (
                    <Loader2 aria-hidden="true" className="animate-spin" />
                  ) : (
                    <Check aria-hidden="true" />
                  )}
                  Guardar materias del curso
                </Boton>
              </div>
              {guardarmaterias.isError && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
                >
                  {guardarmaterias.error.message ||
                    'No se pudieron actualizar las materias del curso.'}
                </p>
              )}
              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-sm font-medium text-emerald-800"
                >
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
