import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Eye, Loader2, Send } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { gestionsiesincronizacion } from '../application/gestionsincronizacionsie';
import type { siesincronizacionvistaprevia } from '../application/esquemasincronizacionsie';

function errormensaje(error: unknown, alternativa: string): string {
  return error instanceof Error ? error.message : alternativa;
}

interface siesincronizacionlanzamientopanelpropiedades {
  management: gestionsiesincronizacion;
  onEnqueued: (id: string) => void;
}

export function Paneliniciosincronizacionsie({
  management: gestion,
  onEnqueued: onencolado,
}: siesincronizacionlanzamientopanelpropiedades) {
  const clientedeconsultas = useQueryClient();
  const gestionesconsulta = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => gestion.listaracademicogestiones(),
  });
  const activogestion = gestionesconsulta.data?.find((gestion) => gestion.isActive);
  const periodosconsulta = useQuery({
    queryKey: ['periods', activogestion?.id],
    queryFn: () => gestion.listarperiodos(activogestion?.id),
    enabled: Boolean(activogestion?.id),
  });
  const cursosconsulta = useQuery({
    queryKey: ['courses'],
    queryFn: () => gestion.listarcursos(),
  });
  const materiasconsulta = useQuery({
    queryKey: ['subjects'],
    queryFn: () => gestion.listarmaterias(),
  });

  const [numeroperiodo, establecerperiodonumero] = useState('');
  const [cursoid, establecercursoid] = useState('');
  const [materiaid, establecermateriaid] = useState('');
  const [vistaprevia, establecervistaprevia] = useState<siesincronizacionvistaprevia | null>(null);
  const [confirmado, establecerconfirmado] = useState(false);
  const claveidempotencia = useRef<string | null>(null);

  const cerradoperiodos = useMemo(
    () => (periodosconsulta.data ?? []).filter((periodo) => periodo.isClosed),
    [periodosconsulta.data],
  );
  const actualgestioncursos = useMemo(
    () => (cursosconsulta.data ?? []).filter((curso) => curso.academicYearId === activogestion?.id),
    [activogestion?.id, cursosconsulta.data],
  );
  const seleccionadoperiodo = cerradoperiodos.find(
    (periodo) => String(periodo.number) === numeroperiodo,
  );
  const filtros = {
    academicYearId: activogestion?.id ?? '',
    periodNumber: Number(numeroperiodo),
    ...(cursoid ? { courseId: cursoid } : {}),
    ...(materiaid ? { subjectId: materiaid } : {}),
  };

  const vistapreviamutacion = useMutation({
    mutationFn: () => gestion.vistaprevia(filtros),
    onSuccess: (resultado) => {
      establecervistaprevia(resultado);
      establecerconfirmado(false);
      claveidempotencia.current = globalThis.crypto.randomUUID();
    },
  });
  const disparadormutacion = useMutation({
    mutationFn: () => {
      if (!vistaprevia) throw new Error('Genere un resumen antes de confirmar.');
      if (!claveidempotencia.current)
        throw new Error('Genere un resumen nuevo antes de confirmar.');
      return gestion.encolar({
        ...filtros,
        confirmSend: true,
        expectedFingerprint: vistaprevia.fingerprint,
        expectedGradeCount: vistaprevia.totalGrades,
        idempotencyKey: claveidempotencia.current,
      });
    },
    onSuccess: (resultado) => {
      establecervistaprevia(null);
      establecerconfirmado(false);
      claveidempotencia.current = null;
      void clientedeconsultas.invalidateQueries({ queryKey: ['sie-sync'] });
      onencolado(resultado.synchronizationId);
    },
    onError: () => establecerconfirmado(true),
  });

  const limpiarvistaprevia = () => {
    establecervistaprevia(null);
    establecerconfirmado(false);
    claveidempotencia.current = null;
    vistapreviamutacion.reset();
    disparadormutacion.reset();
  };

  return (
    <section
      aria-labelledby="sie-sync-launch-title"
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-700" aria-hidden="true">
          <Send className="h-4 w-4" />
        </div>
        <div>
          <h3 id="sie-sync-launch-title" className="text-sm font-semibold text-slate-900">
            Preparar lote de comparación
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Solo se incluyen notas de un período cerrado del año activo y matrículas vigentes. El
            origen de cada resultado aparece en el historial de comparaciones.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="sie-sync-period">
          Período cerrado
          <select
            id="sie-sync-period"
            value={numeroperiodo}
            onChange={(evento) => {
              establecerperiodonumero(evento.target.value);
              limpiarvistaprevia();
            }}
            disabled={!activogestion || periodosconsulta.isLoading}
            className="mt-1 block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Selecciona un período</option>
            {cerradoperiodos.map((periodo) => (
              <option key={periodo.id} value={periodo.number}>
                {periodo.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700" htmlFor="sie-sync-course">
          Curso <span className="font-normal text-slate-500">(opcional)</span>
          <select
            id="sie-sync-course"
            value={cursoid}
            onChange={(evento) => {
              establecercursoid(evento.target.value);
              limpiarvistaprevia();
            }}
            disabled={!activogestion || cursosconsulta.isLoading}
            className="mt-1 block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Todos los cursos activos</option>
            {actualgestioncursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700" htmlFor="sie-sync-subject">
          Asignatura <span className="font-normal text-slate-500">(opcional)</span>
          <select
            id="sie-sync-subject"
            value={materiaid}
            onChange={(evento) => {
              establecermateriaid(evento.target.value);
              limpiarvistaprevia();
            }}
            disabled={materiasconsulta.isLoading}
            className="mt-1 block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Todas las asignaturas</option>
            {(materiasconsulta.data ?? []).map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!activogestion && !gestionesconsulta.isLoading && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
        >
          No hay un año académico activo para preparar el lote.
        </p>
      )}
      {activogestion && cerradoperiodos.length === 0 && !periodosconsulta.isLoading && (
        <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          El año {activogestion.year} aún no tiene períodos cerrados disponibles para comparar.
        </p>
      )}
      {(gestionesconsulta.isError ||
        periodosconsulta.isError ||
        cursosconsulta.isError ||
        materiasconsulta.isError) && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          No se pudieron cargar los filtros. Actualiza la página e inténtalo de nuevo.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Boton
          type="button"
          variant="outline"
          disabled={
            !seleccionadoperiodo || vistapreviamutacion.isPending || disparadormutacion.isPending
          }
          onClick={() => {
            limpiarvistaprevia();
            vistapreviamutacion.mutate();
          }}
        >
          {vistapreviamutacion.isPending ? <Loader2 className="animate-spin" /> : <Eye />}
          Revisar notas locales
        </Boton>
        {vistapreviamutacion.isError && (
          <p role="alert" className="text-sm text-rose-700">
            {errormensaje(vistapreviamutacion.error, 'No se pudo generar el resumen.')}
          </p>
        )}
      </div>

      {vistaprevia && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4" aria-live="polite">
          <h4 className="text-sm font-semibold text-slate-900">Resumen del lote</h4>
          <p className="mt-1 text-xs text-slate-600">
            {activogestion?.name} · {seleccionadoperiodo?.name} · {vistaprevia.totalGrades} notas ·
            máximo {vistaprevia.maxBatchSize} por lote
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-slate-500">Estudiantes</dt>
              <dd className="font-semibold text-slate-900">{vistaprevia.studentCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Cursos</dt>
              <dd className="font-semibold text-slate-900">{vistaprevia.courseCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Asignaturas</dt>
              <dd className="font-semibold text-slate-900">{vistaprevia.subjectCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Año</dt>
              <dd className="font-semibold text-slate-900">
                {vistaprevia.academicYears.join(', ') || activogestion?.year}
              </dd>
            </div>
          </dl>
          {vistaprevia.courses.length > 0 && (
            <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 text-sm">
              {vistaprevia.courses.map((curso) => (
                <li key={curso.id} className="flex justify-between gap-3 py-2">
                  <span>{curso.name}</span>
                  <span className="font-mono tabular-nums">{curso.gradeCount} notas</span>
                </li>
              ))}
            </ul>
          )}
          {vistaprevia.totalGrades === 0 ? (
            <p className="mt-3 text-sm text-slate-600">
              No hay calificaciones elegibles en este período.
            </p>
          ) : vistaprevia.totalGrades > vistaprevia.maxBatchSize ? (
            <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              Este lote supera el límite operativo. Selecciona un curso o una asignatura para
              preparar lotes pequeños.
            </p>
          ) : (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={confirmado}
                  onChange={(evento) => establecerconfirmado(evento.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
                Confirmo que revisé las notas y autorizo esta comparación de prueba.
              </label>
              <Boton
                type="button"
                className="mt-3"
                disabled={!confirmado || disparadormutacion.isPending}
                onClick={() => disparadormutacion.mutate()}
              >
                {disparadormutacion.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle2 />
                )}
                Iniciar comparación de {vistaprevia.totalGrades} notas
              </Boton>
            </div>
          )}
          {disparadormutacion.isError && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {errormensaje(
                disparadormutacion.error,
                'Las notas cambiaron o no se pudo iniciar la comparación. Revisa las notas de nuevo.',
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
