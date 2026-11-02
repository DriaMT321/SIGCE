import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import {
  gestioncalificacion,
  type calificacionperiodoopcion,
  type calificacionregistro,
} from '../application/gestioncalificaciones';

interface calificacioncorreccionespanelpropiedades {
  management: gestioncalificacion;
  grades: calificacionregistro[];
  periods: calificacionperiodoopcion[];
  canRequest: boolean;
  canApprove: boolean;
}

export function CalificacionCorreccionesPanel({
  management: gestion,
  grades: calificaciones,
  periods: periodos,
  canRequest: puedesolicitar,
  canApprove: puedeaprobar,
}: calificacioncorreccionespanelpropiedades) {
  const clientedeconsultas = useQueryClient();
  const [seleccionadocalificacion, establecerseleccionadocalificacion] =
    useState<calificacionregistro | null>(null);
  const [valorpropuesto, establecerpropuestovalor] = useState('');
  const [motivo, establecermotivo] = useState('');
  const [referenciaevidencia, establecerevidenciareferencia] = useState('');
  const [decisionmotivos, establecerdecisionmotivos] = useState<Record<string, string>>({});
  const [retroalimentacion, establecerretroalimentacion] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const correccionesconsulta = useQuery({
    queryKey: ['grade-corrections', 'PENDING'],
    queryFn: () => gestion.listarpendientecorrecciones(),
    enabled: puedesolicitar || puedeaprobar,
  });

  const enviarmutacion = useMutation({
    mutationFn: (entrada: {
      gradeId: string;
      proposedValue: number;
      reason: string;
      evidenceReference: string;
    }) => gestion.enviarcorreccion(entrada),
    onSuccess: () => {
      establecerseleccionadocalificacion(null);
      establecerpropuestovalor('');
      establecermotivo('');
      establecerevidenciareferencia('');
      establecerretroalimentacion({
        type: 'success',
        message: 'Solicitud enviada con su motivo y respaldo.',
      });
      void clientedeconsultas.invalidateQueries({ queryKey: ['grade-corrections'] });
    },
    onError: (error: unknown) => {
      establecerretroalimentacion({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo enviar la solicitud.',
      });
    },
  });

  const decisionmutacion = useMutation({
    mutationFn: ({
      id,
      approve: aprobar,
      decisionReason: motivodecision,
    }: {
      id: string;
      approve: boolean;
      decisionReason: string;
    }) => gestion.decidircorreccion({ id, approve: aprobar, decisionReason: motivodecision }),
    onSuccess: (_resultado, variables) => {
      establecerdecisionmotivos((actual) => ({ ...actual, [variables.id]: '' }));
      establecerretroalimentacion({
        type: 'success',
        message: variables.approve
          ? 'Corrección aprobada y ejecutada.'
          : 'Solicitud rechazada con decisión registrada.',
      });
      void clientedeconsultas.invalidateQueries({ queryKey: ['grade-corrections'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error: unknown) => {
      establecerretroalimentacion({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo resolver la solicitud.',
      });
    },
  });

  const calificacionescerradas = calificaciones.filter((calificacion) =>
    periodos.some((periodo) => periodo.id === calificacion.periodId && periodo.isClosed),
  );
  const pendientesolicitudes = correccionesconsulta.data ?? [];

  if (!puedesolicitar && !puedeaprobar) return null;

  return (
    <section
      aria-labelledby="grade-corrections-title"
      className="rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="grade-corrections-title" className="text-sm font-semibold text-slate-900">
            Correcciones de períodos cerrados
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            Toda modificación requiere solicitud, motivo, respaldo y decisión de Dirección.
          </p>
        </div>
        <span className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-800">
          {pendientesolicitudes.length} pendientes
        </span>
      </div>

      {retroalimentacion && (
        <p
          role={retroalimentacion.type === 'error' ? 'alert' : 'status'}
          className={`mx-4 mt-4 rounded-lg border p-3 text-sm ${retroalimentacion.type === 'error' ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-emerald-300 bg-emerald-50 text-emerald-900'}`}
        >
          {retroalimentacion.type === 'error' ? (
            <AlertTriangle className="mr-2 inline h-4 w-4" />
          ) : (
            <CheckCircle2 className="mr-2 inline h-4 w-4" />
          )}
          {retroalimentacion.message}
        </p>
      )}

      {correccionesconsulta.isLoading && (
        <p role="status" className="p-4 text-sm text-slate-700">
          Cargando solicitudes pendientes…
        </p>
      )}
      {correccionesconsulta.isError && (
        <p role="alert" className="p-4 text-sm text-rose-800">
          No se pudieron cargar las solicitudes. Actualiza la página para volver a intentar.
        </p>
      )}

      {pendientesolicitudes.length > 0 && (
        <div className="grid gap-3 p-4">
          {pendientesolicitudes.map((solicitud) => (
            <article
              key={solicitud.id}
              className="rounded-lg border border-amber-300 bg-amber-50/70 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1 text-sm text-slate-800">
                  <h3 className="font-semibold text-slate-950">
                    {solicitud.grade.student.lastName}, {solicitud.grade.student.firstName} ·{' '}
                    {solicitud.grade.subject.name}
                  </h3>
                  <p>
                    {solicitud.grade.period.name}: {solicitud.previousValue} →{' '}
                    {solicitud.proposedValue} puntos
                  </p>
                  <p>
                    <span className="font-medium">Solicitó:</span> {solicitud.requestedBy.firstName}{' '}
                    {solicitud.requestedBy.lastName}
                  </p>
                  <p className="break-words">
                    <span className="font-medium">Motivo:</span> {solicitud.reason}
                  </p>
                  <p className="flex items-start gap-2 break-all">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="font-medium">Respaldo:</span> {solicitud.evidenceReference}
                    </span>
                  </p>
                </div>
                {puedeaprobar && (
                  <div className="grid w-full shrink-0 gap-2 sm:max-w-xs">
                    <label className="grid gap-1 text-sm font-medium text-slate-800">
                      Motivo de la decisión
                      <textarea
                        value={decisionmotivos[solicitud.id] ?? ''}
                        onChange={(evento) =>
                          establecerdecisionmotivos((actual) => ({
                            ...actual,
                            [solicitud.id]: evento.target.value,
                          }))
                        }
                        maxLength={1000}
                        rows={2}
                        className="min-h-20 rounded-lg border border-slate-400 bg-white p-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Boton
                        type="button"
                        className="min-h-11 flex-1 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                        disabled={
                          decisionmutacion.isPending ||
                          (decisionmotivos[solicitud.id] ?? '').trim().length < 5
                        }
                        onClick={() =>
                          decisionmutacion.mutate({
                            id: solicitud.id,
                            approve: true,
                            decisionReason: decisionmotivos[solicitud.id] ?? '',
                          })
                        }
                      >
                        {decisionmutacion.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Aprobar y ejecutar
                      </Boton>
                      <Boton
                        type="button"
                        variant="outline"
                        className="min-h-11 flex-1 border-slate-500 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                        disabled={
                          decisionmutacion.isPending ||
                          (decisionmotivos[solicitud.id] ?? '').trim().length < 5
                        }
                        onClick={() =>
                          decisionmutacion.mutate({
                            id: solicitud.id,
                            approve: false,
                            decisionReason: decisionmotivos[solicitud.id] ?? '',
                          })
                        }
                      >
                        Rechazar
                      </Boton>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {puedesolicitar && (
        <details className="border-t border-slate-100">
          <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900">
            Iniciar una solicitud ({calificacionescerradas.length} calificaciones en períodos
            cerrados)
          </summary>
          {seleccionadocalificacion ? (
            <form
              className="grid gap-4 border-t border-slate-100 bg-slate-50 p-4"
              onSubmit={(evento) => {
                evento.preventDefault();
                enviarmutacion.mutate({
                  gradeId: seleccionadocalificacion.id,
                  proposedValue: Number(valorpropuesto),
                  reason: motivo,
                  evidenceReference: referenciaevidencia,
                });
              }}
            >
              <div className="text-sm text-slate-800">
                <p className="font-semibold text-slate-950">
                  {seleccionadocalificacion.student.lastName},{' '}
                  {seleccionadocalificacion.student.firstName} ·{' '}
                  {seleccionadocalificacion.subject.name}
                </p>
                <p>
                  {seleccionadocalificacion.period.name}: nota registrada{' '}
                  {seleccionadocalificacion.value}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-slate-800">
                  Nota propuesta (0 a 100)
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={valorpropuesto}
                    onChange={(evento) => establecerpropuestovalor(evento.target.value)}
                    className="min-h-11 rounded-lg border border-slate-400 bg-white px-3 text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-800">
                  Referencia del documento de respaldo
                  <input
                    required
                    maxLength={1000}
                    value={referenciaevidencia}
                    onChange={(evento) => establecerevidenciareferencia(evento.target.value)}
                    placeholder="Acta, informe o identificador de archivo"
                    className="min-h-11 rounded-lg border border-slate-400 bg-white px-3 text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-800 sm:col-span-2">
                  Motivo de la corrección
                  <textarea
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={3}
                    value={motivo}
                    onChange={(evento) => establecermotivo(evento.target.value)}
                    className="min-h-24 rounded-lg border border-slate-400 bg-white p-3 text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Boton
                  type="submit"
                  className="min-h-11 bg-slate-900 text-white hover:bg-slate-800"
                  disabled={
                    enviarmutacion.isPending ||
                    motivo.trim().length < 10 ||
                    !referenciaevidencia.trim()
                  }
                >
                  {enviarmutacion.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Enviar a Dirección
                </Boton>
                <Boton
                  type="button"
                  variant="outline"
                  className="min-h-11 border-slate-500 text-slate-900"
                  onClick={() => establecerseleccionadocalificacion(null)}
                >
                  Cancelar
                </Boton>
              </div>
            </form>
          ) : (
            <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {calificacionescerradas.map((calificacion) => (
                <article
                  key={calificacion.id}
                  className="flex min-w-0 flex-col gap-2 rounded-lg border border-slate-300 p-3"
                >
                  <p className="break-words text-sm font-semibold text-slate-950">
                    {calificacion.student.lastName}, {calificacion.student.firstName}
                  </p>
                  <p className="text-sm text-slate-800">
                    {calificacion.subject.name} · {calificacion.period.name} · {calificacion.value}{' '}
                    puntos
                  </p>
                  <Boton
                    type="button"
                    variant="outline"
                    className="min-h-11 border-slate-500 text-slate-900"
                    onClick={() => {
                      establecerseleccionadocalificacion(calificacion);
                      establecerpropuestovalor(String(calificacion.value));
                    }}
                  >
                    Solicitar corrección
                  </Boton>
                </article>
              ))}
              {calificacionescerradas.length === 0 && (
                <p className="text-sm text-slate-700">
                  No hay calificaciones cerradas en esta lista.
                </p>
              )}
            </div>
          )}
        </details>
      )}
    </section>
  );
}
