import { useEffect, useState } from 'react';
import type {
  siesincronizacion,
  siesincronizacionelemento,
} from '../application/esquemasincronizacionsie';
import type { siesincronizacionlistarfiltros } from '../application/esquemasincronizacionsie';
import {
  eventoetiqueta,
  origenetiqueta,
  estadoetiquetas,
  estadogrupoetiquetas,
  tipoetiqueta,
} from '../etiquetassincronizacionsie';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import { Boton } from '../../../components/ui/boton';
import { Download } from 'lucide-react';

function csvcelda(valor: string | number | null): string {
  const texto = String(valor ?? '');
  const seguro = /^[\s]*[=+@-]/.test(texto) ? `'${texto}` : texto;
  return `"${seguro.replaceAll('"', '""')}"`;
}

function descargarpendientecalificaciones(sincronizacion: siesincronizacion): void {
  const pendiente = sincronizacion.items.filter((elemento) =>
    ['PENDING', 'QUEUED', 'PROCESSING', 'AUTH_REQUIRED', 'FAILED'].includes(elemento.status),
  );
  if (pendiente.length === 0) return;
  const filas: (string | number | null)[][] = [
    ['RUDE', 'Estudiante', 'Curso', 'Asignatura', 'Período', 'Nota SIGCE', 'Estado', 'Observación'],
    ...pendiente.map((elemento) => [
      elemento.student.rude,
      `${elemento.student.firstName} ${elemento.student.lastName}`,
      elemento.course ? cursoetiqueta(elemento.course.name) : '',
      elemento.subject.name,
      elemento.period.name,
      elemento.localValue,
      estadoetiquetas[elemento.status] ?? 'Estado desconocido',
      elemento.errorMessage,
    ]),
  ];
  const csv = `\uFEFF${filas.map((fila) => fila.map(csvcelda).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `sigce-pendientes-sie-${sincronizacion.id.slice(0, 8)}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);
}

interface colacantidades {
  verified: number;
  discrepancy: number;
  openGroups: number;
  authRequired: number;
  failed: number;
  pending: number;
}

export function Panelcolasincronizacionsie({
  synchronizations: sincronizaciones,
  selectedQueue: seleccionadocola,
  queueCounters: colacontadores,
  canResolve: puederesolver,
  canRetry: puedereintentar,
  canResume: puedereanudar,
  onResolve: onresolver,
  onResolveGroup: onresolvergrupo,
  onRetry: onreintentar,
  onResume: onreanudar,
  filters: filtros,
  onFiltersChange: onfiltroscambio,
  onSelect: onseleccionar,
}: {
  synchronizations: siesincronizacion[];
  selectedQueue?: siesincronizacion;
  queueCounters: colacantidades;
  canResolve: boolean;
  canRetry: boolean;
  canResume: boolean;
  onResolve: (elemento: siesincronizacionelemento) => void;
  onResolveGroup: (grupoid: string) => void;
  onRetry: (elemento: siesincronizacionelemento) => void;
  onResume: (id: string) => void;
  filters: siesincronizacionlistarfiltros;
  onFiltersChange: (filtros: siesincronizacionlistarfiltros) => void;
  onSelect: (id: string) => void;
}) {
  const [borrador, establecerborrador] = useState({
    academicYear: filtros.academicYear?.toString() ?? '',
    periodNumber: filtros.periodNumber?.toString() ?? '',
    courseName: filtros.courseName ?? '',
    studentRude: filtros.studentRude ?? '',
    status: filtros.status ?? '',
  });
  useEffect(() => {
    establecerborrador({
      academicYear: filtros.academicYear?.toString() ?? '',
      periodNumber: filtros.periodNumber?.toString() ?? '',
      courseName: filtros.courseName ?? '',
      studentRude: filtros.studentRude ?? '',
      status: filtros.status ?? '',
    });
  }, [filtros]);

  const aplicarfiltros = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    onfiltroscambio({
      ...(borrador.academicYear ? { academicYear: Number(borrador.academicYear) } : {}),
      ...(borrador.periodNumber ? { periodNumber: Number(borrador.periodNumber) } : {}),
      ...(borrador.courseName.trim() ? { courseName: borrador.courseName.trim() } : {}),
      ...(borrador.studentRude.trim() ? { studentRude: borrador.studentRude.trim() } : {}),
      ...(borrador.status
        ? { status: borrador.status as NonNullable<siesincronizacionlistarfiltros['status']> }
        : {}),
    });
  };

  const limpiarfiltros = () => {
    establecerborrador({
      academicYear: '',
      periodNumber: '',
      courseName: '',
      studentRude: '',
      status: '',
    });
    onfiltroscambio({});
  };

  const discrepanciagrupos = new Map<
    string,
    {
      group: siesincronizacionelemento['discrepancyGroup'];
      items: siesincronizacionelemento[];
    }
  >();
  for (const elemento of seleccionadocola?.items ?? []) {
    if (elemento.status !== 'DISCREPANCY') continue;
    const clave =
      elemento.discrepancyGroup?.id ??
      `${elemento.course?.id ?? 'legacy'}:${elemento.subjectId}:${elemento.periodId}`;
    const actual = discrepanciagrupos.get(clave) ?? { group: elemento.discrepancyGroup, items: [] };
    actual.items.push(elemento);
    discrepanciagrupos.set(clave, actual);
  }

  return (
    <div className="space-y-5">
      {seleccionadocola && (
        <p className="text-xs text-slate-600">
          Origen de la ejecución: {origenetiqueta(seleccionadocola.source)}.
        </p>
      )}
      {seleccionadocola?.status === 'PAUSED' && (
        <section className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-amber-950">Sincronización pausada</h3>
            <p className="mt-1 text-sm text-amber-900">
              {seleccionadocola.pausedReason ??
                'El porcentaje de discrepancias superó el umbral configurado.'}
            </p>
            {seleccionadocola.pausedAt && (
              <p className="mt-1 text-xs text-amber-800">
                Pausado el {new Date(seleccionadocola.pausedAt).toLocaleString()}.
              </p>
            )}
          </div>
          {puedereanudar && (
            <Boton type="button" variant="outline" onClick={() => onreanudar(seleccionadocola.id)}>
              Reanudar lote
            </Boton>
          )}
        </section>
      )}
      {seleccionadocola?.timeline && seleccionadocola.timeline.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">Línea de tiempo</h3>
          <ol className="mt-3 space-y-3 border-l border-slate-200 pl-4">
            {seleccionadocola.timeline.map((evento, indice) => (
              <li key={`${evento.createdAt}-${indice}`} className="relative text-sm">
                <span
                  className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-500"
                  aria-hidden="true"
                />
                <p className="font-medium text-slate-800">
                  {eventoetiqueta(evento.event)}
                  {evento.status
                    ? ` · ${estadoetiquetas[evento.status] ?? 'Estado desconocido'}`
                    : ''}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {new Date(evento.createdAt).toLocaleString()}
                  {evento.actorId ? ` · Usuario ${evento.actorId.slice(0, 8)}` : ''}
                </p>
              </li>
            ))}
          </ol>
          {seleccionadocola.timelineHasMore && (
            <p className="mt-3 text-xs text-slate-500">
              Se muestran los 100 eventos más recientes de este lote.
            </p>
          )}
        </section>
      )}
      <form onSubmit={aplicarfiltros} className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Filtrar sincronizaciones</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="text-xs font-medium text-slate-600">
            Gestión
            <input
              inputMode="numeric"
              pattern="[0-9]{4}"
              value={borrador.academicYear}
              onChange={(evento) =>
                establecerborrador({ ...borrador, academicYear: evento.target.value })
              }
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-slate-900"
              placeholder="2026"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Período
            <select
              value={borrador.periodNumber}
              onChange={(evento) =>
                establecerborrador({ ...borrador, periodNumber: evento.target.value })
              }
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900"
            >
              <option value="">Todos</option>
              <option value="1">1.º trimestre</option>
              <option value="2">2.º trimestre</option>
              <option value="3">3.º trimestre</option>
            </select>
          </label>
          <label className="text-xs font-medium text-slate-600">
            Curso
            <input
              value={borrador.courseName}
              onChange={(evento) =>
                establecerborrador({ ...borrador, courseName: evento.target.value })
              }
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-slate-900"
              placeholder="Nombre del curso"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Estudiante (RUDE)
            <input
              value={borrador.studentRude}
              onChange={(evento) =>
                establecerborrador({ ...borrador, studentRude: evento.target.value })
              }
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-2 text-sm text-slate-900"
              placeholder="Código RUDE"
            />
          </label>
          <label className="text-xs font-medium text-slate-600">
            Estado
            <select
              value={borrador.status}
              onChange={(evento) =>
                establecerborrador({
                  ...borrador,
                  status: evento.target.value as typeof borrador.status,
                })
              }
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900"
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="QUEUED">En cola</option>
              <option value="PROCESSING">Procesando</option>
              <option value="PAUSED">Pausada</option>
              <option value="VERIFIED">Verificado</option>
              <option value="DISCREPANCY">Discrepancia</option>
              <option value="AUTH_REQUIRED">Requiere autenticación SIE</option>
              <option value="FAILED">Fallido</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <Boton type="button" size="sm" variant="outline" onClick={limpiarfiltros}>
            Limpiar
          </Boton>
          <Boton type="submit" size="sm">
            Filtrar
          </Boton>
        </div>
      </form>
      {discrepanciagrupos.size > 0 && (
        <section className="rounded-xl border border-orange-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">Revisión de discrepancias</h3>
          <div className="mt-3 space-y-3">
            {[...discrepanciagrupos.entries()].map(([grupoid, entrada]) => {
              const primerelemento = entrada.items[0];
              return (
                <section
                  key={grupoid}
                  className="rounded-lg border border-orange-100 bg-orange-50/50 p-3"
                >
                  <div className="flex flex-col gap-1 border-b border-orange-100 pb-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {primerelemento.course
                          ? cursoetiqueta(primerelemento.course.name)
                          : 'Curso sin identificar'}{' '}
                        · {primerelemento.subject.name} · {primerelemento.period.name}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {entrada.items.length} discrepancia{entrada.items.length === 1 ? '' : 's'} ·
                        Grupo{' '}
                        {entrada.group
                          ? (estadogrupoetiquetas[entrada.group.status] ?? 'sin estado')
                          : 'sin asignar'}
                      </p>
                    </div>
                    {entrada.group && (
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xs text-slate-600">
                          Responsable: {entrada.group.assignedTo.firstName}{' '}
                          {entrada.group.assignedTo.lastName} · Plazo:{' '}
                          {new Date(entrada.group.dueAt).toLocaleDateString()}
                        </p>
                        {puederesolver && entrada.group.status !== 'RESOLVED' && (
                          <Boton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onresolvergrupo(entrada.group!.id)}
                          >
                            Resolver grupo
                          </Boton>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="divide-y divide-orange-100">
                    {entrada.items.map((elemento) => (
                      <article
                        key={elemento.id}
                        className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {elemento.student.firstName} {elemento.student.lastName} · RUDE{' '}
                            {elemento.student.rude}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            SIGCE: <strong>{elemento.localValue}</strong> · SIE:{' '}
                            <strong>{elemento.sieValue ?? 'Sin dato'}</strong>
                          </p>
                          {elemento.discrepancyResolvedAt ? (
                            <div className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                              Revisada por{' '}
                              {elemento.discrepancyResolvedBy
                                ? `${elemento.discrepancyResolvedBy.firstName} ${elemento.discrepancyResolvedBy.lastName}`
                                : 'usuario registrado'}{' '}
                              el {new Date(elemento.discrepancyResolvedAt).toLocaleString()}.
                              <p className="mt-1 font-medium">
                                Decisión:{' '}
                                {elemento.discrepancyDecision === 'KEEP_SIGCE'
                                  ? 'mantener la calificación SIGCE'
                                  : 'conservar el valor SIE como referencia'}
                                .
                              </p>
                              <p className="mt-1">{elemento.discrepancyResolutionReason}</p>
                            </div>
                          ) : (
                            <p className="mt-1 text-xs text-orange-700">
                              Pendiente de revisión manual.
                            </p>
                          )}
                        </div>
                        {puederesolver && !elemento.discrepancyResolvedAt && (
                          <Boton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onresolver(elemento)}
                          >
                            Registrar revisión
                          </Boton>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            La revisión deja constancia de la decisión; no modifica automáticamente las
            calificaciones de SIGCE.
          </p>
        </section>
      )}
      {puedereintentar &&
        seleccionadocola &&
        seleccionadocola.items.some((elemento) => elemento.status === 'FAILED') && (
          <section className="rounded-xl border border-rose-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Trabajos fallidos</h3>
            <div className="mt-3 divide-y divide-slate-100">
              {seleccionadocola.items
                .filter((elemento) => elemento.status === 'FAILED')
                .map((elemento) => (
                  <article
                    key={elemento.id}
                    className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {elemento.student.firstName} {elemento.student.lastName} ·{' '}
                        {elemento.subject.name} · {elemento.period.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {elemento.course?.name ?? 'Curso sin identificar'} · Nota SIGCE{' '}
                        {elemento.localValue}
                      </p>
                      {elemento.errorMessage && (
                        <p className="mt-1 text-xs text-rose-700">{elemento.errorMessage}</p>
                      )}
                    </div>
                    <Boton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onreintentar(elemento)}
                    >
                      Reintentar manualmente
                    </Boton>
                  </article>
                ))}
            </div>
          </section>
        )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          { label: 'En Cola', value: colacontadores.pending, color: 'text-amber-600' },
          { label: 'Comparadas', value: colacontadores.verified, color: 'text-emerald-600' },
          {
            label: 'Con discrepancia',
            value: colacontadores.discrepancy,
            color: 'text-orange-700',
          },
          { label: 'Grupos abiertos', value: colacontadores.openGroups, color: 'text-orange-700' },
          {
            label: 'Requiere autenticación',
            value: colacontadores.authRequired,
            color: 'text-amber-700',
          },
          { label: 'Fallidas', value: colacontadores.failed, color: 'text-rose-600' },
        ].map((elemento) => (
          <div key={elemento.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {elemento.label}
            </span>
            <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${elemento.color}`}>
              {elemento.value}
            </p>
          </div>
        ))}
      </div>

      {seleccionadocola &&
        seleccionadocola.items.some((elemento) =>
          ['PENDING', 'QUEUED', 'PROCESSING', 'AUTH_REQUIRED', 'FAILED'].includes(elemento.status),
        ) && (
          <section className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-amber-950">Carga asistida</h3>
              <p className="mt-1 text-sm text-amber-900">
                Descarga las notas pendientes agrupables por curso y asignatura para registrarlas
                manualmente si falla la automatización local.
              </p>
            </div>
            <Boton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => descargarpendientecalificaciones(seleccionadocola)}
            >
              <Download /> Descargar CSV de pendientes
            </Boton>
          </section>
        )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-900">Historial de comparaciones</h3>
          <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
            Procesamiento de notas
          </span>
        </div>
        <div className="mt-3 divide-y divide-slate-100">
          {sincronizaciones.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No hay ejecuciones registradas.
            </p>
          ) : (
            sincronizaciones.map((sincronizacion) => (
              <button
                key={sincronizacion.id}
                type="button"
                onClick={() => onseleccionar(sincronizacion.id)}
                className={`flex w-full items-center justify-between gap-3 py-3 text-left ${seleccionadocola?.id === sincronizacion.id ? 'rounded-lg bg-slate-50 px-3' : ''}`}
                aria-pressed={seleccionadocola?.id === sincronizacion.id}
              >
                <div>
                  <div className="font-mono text-sm font-medium text-slate-900">
                    ID: {sincronizacion.id.slice(0, 8)}...
                  </div>
                  <div className="text-xs text-slate-500">
                    Tipo: {tipoetiqueta(sincronizacion.syncType)} · Estado:{' '}
                    {estadoetiquetas[sincronizacion.status] ?? 'Estado desconocido'} ·{' '}
                    {origenetiqueta(sincronizacion.source)}
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-500">
                  {new Date(sincronizacion.createdAt).toLocaleString()}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
