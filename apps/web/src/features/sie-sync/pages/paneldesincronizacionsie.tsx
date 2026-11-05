import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Wifi,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type { gestionsiesincronizacion } from '../application/gestionsincronizacionsie';
import type { sieauditoriarespuestadatos } from '../application/esquemasincronizacionsie';
import type {
  siesincronizacionelemento,
  siesincronizacionlistarfiltros,
} from '../application/esquemasincronizacionsie';
import { Paneliniciosincronizacionsie } from '../components/paneliniciosincronizacionsie';
import { Panelcolasincronizacionsie } from '../components/panelcolasincronizacionsie';

type resultadoestructura = Awaited<ReturnType<gestionsiesincronizacion['comprobarreplicalocal']>>;
type resultadoacceso = Awaited<ReturnType<gestionsiesincronizacion['comprobaracceso']>>;

type dialogooperacion =
  | { tipo: 'resolver'; elemento?: siesincronizacionelemento; grupoId?: string }
  | { tipo: 'reintentar'; elemento: siesincronizacionelemento }
  | { tipo: 'reanudar'; sincronizacionId: string }
  | null;

function errormensaje(error: unknown, alternativa: string): string {
  return error instanceof Error ? error.message : alternativa;
}

export function Paneldesincronizacionsie({
  management: gestion,
  currentRole: rolactual,
  realSieAuditEnabled: sieoficialhabilitado,
}: {
  management: gestionsiesincronizacion;
  currentRole?: string;
  realSieAuditEnabled: boolean;
}) {
  const clientedeconsultas = useQueryClient();
  const [resultado, establecerresultado] = useState<resultadoestructura | null>(null);
  const [usuarioSie, establecerusuarioSie] = useState('');
  const [contrasenaSie, establecercontrasenaSie] = useState('');
  const [mostrarcontrasena, establecermostrarcontrasena] = useState(false);
  const [navegacionvisible, establecernavegacionvisible] = useState(false);
  const [resultadoacceso, establecerresultadoacceso] = useState<resultadoacceso | null>(null);
  const [filtros, establecerfiltros] = useState<siesincronizacionlistarfiltros>({});
  const [seleccionid, establecerseleccionid] = useState<string>();
  const [dialogo, establecerdialogo] = useState<dialogooperacion>(null);
  const [decision, establecerdecision] = useState<'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE'>(
    'KEEP_SIGCE',
  );
  const [motivo, establecerMotivo] = useState('');

  const permitidogestion = ['ADMINISTRATIVE', 'SECRETARY'].includes(rolactual ?? '');
  const auditoriaconsulta = useQuery<sieauditoriarespuestadatos>({
    queryKey: ['sie-audit-latest'],
    queryFn: () => gestion.obtenerultimoauditoria(),
    enabled: permitidogestion && sieoficialhabilitado,
    retry: false,
  });
  const colaconsulta = useQuery({
    queryKey: ['sie-sync', filtros],
    queryFn: () => gestion.listarsincronizaciones(filtros),
    refetchInterval: 5_000,
  });
  const sincronizaciones = colaconsulta.data ?? [];
  const seleccionadacola =
    sincronizaciones.find((item) => item.id === seleccionid) ?? sincronizaciones[0];

  useEffect(() => {
    const cancelar = gestion.suscribirseaestado(() => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['sie-sync'] });
    });
    return cancelar;
  }, [clientedeconsultas, gestion]);

  const contadores = useMemo(() => {
    const elementos = sincronizaciones.flatMap((sincronizacion) => sincronizacion.items);
    return {
      verified: elementos.filter((elemento) => elemento.status === 'VERIFIED').length,
      discrepancy: elementos.filter((elemento) => elemento.status === 'DISCREPANCY').length,
      openGroups: new Set(
        elementos
          .filter(
            (elemento) =>
              elemento.discrepancyGroup && elemento.discrepancyGroup.status !== 'RESOLVED',
          )
          .map((elemento) => elemento.discrepancyGroup!.id),
      ).size,
      authRequired: elementos.filter((elemento) => elemento.status === 'AUTH_REQUIRED').length,
      failed: elementos.filter((elemento) => elemento.status === 'FAILED').length,
      pending: elementos.filter((elemento) =>
        ['PENDING', 'QUEUED', 'PROCESSING'].includes(elemento.status),
      ).length,
    };
  }, [sincronizaciones]);

  const revisarlocal = useMutation({
    mutationFn: () => gestion.comprobarreplicalocal(),
    onSuccess: establecerresultado,
  });

  const verificaracceso = useMutation({
    mutationFn: () => {
      if (!usuarioSie.trim() || !contrasenaSie.trim()) {
        throw new Error('Ingresa el usuario y la contraseña entregados por el SIE.');
      }
      return gestion.comprobaracceso({ username: usuarioSie, password: contrasenaSie });
    },
    onSuccess: establecerresultadoacceso,
  });
  const ejecutarauditoria = useMutation({
    mutationFn: async () => {
      if (!resultadoacceso?.loginSuccess)
        throw new Error('Primero verifica el acceso al SIE oficial.');
      await gestion.ejecutarauditoria({
        courseFilter: '',
        maxCourses: 20,
        visualMode: navegacionvisible,
        username: usuarioSie,
        password: contrasenaSie,
      });
    },
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['sie-audit-latest'] });
      establecercontrasenaSie('');
      establecerresultadoacceso(null);
    },
  });

  const resolver = useMutation({
    mutationFn: async () => {
      if (dialogo?.tipo !== 'resolver') throw new Error('Selecciona una discrepancia.');
      return gestion.resolverdiscrepancia({
        ...(dialogo.grupoId ? { groupId: dialogo.grupoId } : { itemId: dialogo.elemento?.id }),
        decision,
        reason: motivo,
      });
    },
    onSuccess: () => {
      establecerdialogo(null);
      establecerMotivo('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['sie-sync'] });
    },
  });
  const reintentar = useMutation({
    mutationFn: () => {
      if (dialogo?.tipo !== 'reintentar') throw new Error('Selecciona un registro fallido.');
      return gestion.reintentarelemento(dialogo.elemento, motivo);
    },
    onSuccess: ({ synchronizationId }) => {
      establecerseleccionid(synchronizationId);
      establecerdialogo(null);
      establecerMotivo('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['sie-sync'] });
    },
  });
  const reanudar = useMutation({
    mutationFn: () => {
      if (dialogo?.tipo !== 'reanudar') throw new Error('Selecciona un lote pausado.');
      return gestion.reanudarsincronizacion(dialogo.sincronizacionId, motivo);
    },
    onSuccess: ({ synchronizationId }) => {
      establecerseleccionid(synchronizationId);
      establecerdialogo(null);
      establecerMotivo('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['sie-sync'] });
    },
  });

  const erroroperacion = resolver.error ?? reintentar.error ?? reanudar.error;
  const operacionpendiente = resolver.isPending || reintentar.isPending || reanudar.isPending;
  const confirmardialogo = () => {
    if (dialogo?.tipo === 'resolver') resolver.mutate();
    else if (dialogo?.tipo === 'reintentar') reintentar.mutate();
    else if (dialogo?.tipo === 'reanudar') reanudar.mutate();
  };
  const cerrardialogo = () => {
    establecerdialogo(null);
    establecerMotivo('');
    establecerdecision('KEEP_SIGCE');
    resolver.reset();
    reintentar.reset();
    reanudar.reset();
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <p className="text-sm font-medium text-brand-700">Herramientas académicas</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Sincronización SIE
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Conecta con el portal oficial para comprobar el acceso y revisar las calificaciones. La
          réplica local queda disponible solo como herramienta opcional de prueba.
        </p>
      </header>

      <section
        aria-labelledby="sie-oficial-heading"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 id="sie-oficial-heading" className="font-semibold text-slate-900">
                Conectar al SIE oficial
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Portal configurado:{' '}
                <span className="font-medium text-slate-800">academico.sie.gob.bo</span>. Ingresa
                las credenciales institucionales para comprobar el acceso.
              </p>
            </div>
          </div>
          <span
            className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Acceso oficial habilitado
          </span>
        </div>

        {!permitidogestion ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            La conexión oficial está disponible para Dirección y Secretaría.
          </p>
        ) : (
          <>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Usuario SIE
                <span className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    autoComplete="username"
                    value={usuarioSie}
                    onChange={(evento) => {
                      establecerusuarioSie(evento.target.value);
                      establecerresultadoacceso(null);
                      verificaracceso.reset();
                    }}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 font-mono text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Usuario institucional"
                  />
                </span>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Contraseña SIE
                <span className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    autoComplete="current-password"
                    type={mostrarcontrasena ? 'text' : 'password'}
                    value={contrasenaSie}
                    onChange={(evento) => {
                      establecercontrasenaSie(evento.target.value);
                      establecerresultadoacceso(null);
                      verificaracceso.reset();
                    }}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-11 font-mono text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Contraseña institucional"
                  />
                  <button
                    type="button"
                    onClick={() => establecermostrarcontrasena((visible) => !visible)}
                    aria-label={mostrarcontrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  >
                    {mostrarcontrasena ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </span>
              </label>
              <Boton
                type="button"
                disabled={
                  !usuarioSie.trim() ||
                  !contrasenaSie.trim() ||
                  verificaracceso.isPending
                }
                onClick={() => verificaracceso.mutate()}
                className="h-11 shrink-0"
              >
                {verificaracceso.isPending ? <Loader2 className="animate-spin" /> : <Wifi />}
                Conectar al SIE
              </Boton>
            </div>
            <div className="mt-3 flex flex-col gap-3 rounded-lg bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-3xl text-xs leading-5 text-slate-600">
                Las credenciales permanecen solo en esta pantalla y se envían al servidor cuando
                conectas o ejecutas la auditoría; SIGCE no las guarda.
              </p>
              <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={navegacionvisible}
                  onChange={(evento) => establecernavegacionvisible(evento.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                Mostrar navegador durante la auditoría
              </label>
            </div>

            {verificaracceso.isError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {errormensaje(
                  verificaracceso.error,
                  'No se pudo verificar el acceso al SIE oficial.',
                )}
              </p>
            )}
            {resultadoacceso && (
              <div
                aria-live="polite"
                className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${resultadoacceso.loginSuccess ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}
              >
                {resultadoacceso.loginSuccess ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
                )}
                <div>
                  <p className="font-medium text-slate-900">
                    {resultadoacceso.loginSuccess
                      ? 'Acceso al SIE oficial comprobado'
                      : 'No se pudo validar el acceso al SIE oficial'}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{resultadoacceso.message}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(resultadoacceso.checkedAt).toLocaleString('es-BO')}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-slate-900">
                  Auditoría de calificaciones oficiales
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Compara registros del portal oficial con SIGCE, sin modificar notas. La revisión
                  no aplica filtro de curso.
                </p>
              </div>
              <Boton
                type="button"
                variant="outline"
                disabled={
                  !resultadoacceso?.loginSuccess ||
                  ejecutarauditoria.isPending
                }
                onClick={() => ejecutarauditoria.mutate()}
                className="shrink-0"
              >
                {ejecutarauditoria.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                Iniciar auditoría oficial
              </Boton>
            </div>
            {ejecutarauditoria.isError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {errormensaje(
                  ejecutarauditoria.error,
                  'No se pudo completar la auditoría oficial.',
                )}
              </p>
            )}
            {auditoriaconsulta.isError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                No se pudo cargar el último resultado de auditoría.
              </p>
            )}
            {auditoriaconsulta.data?.summary && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: 'Estudiantes revisados',
                      value: auditoriaconsulta.data.summary.totalStudents,
                    },
                    {
                      label: 'Coincidencias',
                      value: `${auditoriaconsulta.data.summary.matchPercentage}%`,
                    },
                    {
                      label: 'Con diferencias',
                      value: auditoriaconsulta.data.summary.totalWithDiscrepancies,
                    },
                    {
                      label: 'Promedio SIE / SIGCE',
                      value: `${auditoriaconsulta.data.summary.sieAverage} / ${auditoriaconsulta.data.summary.sigceAverage}`,
                    },
                  ].map((dato) => (
                    <div
                      key={dato.label}
                      className="rounded-lg border border-slate-200 bg-white p-3"
                    >
                      <p className="text-xs text-slate-500">{dato.label}</p>
                      <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
                        {dato.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Estudiante / RUDE</th>
                        <th className="px-3 py-2">Curso</th>
                        <th className="px-3 py-2 text-center">Promedio SIE</th>
                        <th className="px-3 py-2 text-center">Promedio SIGCE</th>
                        <th className="px-3 py-2 text-center">Diferencias</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditoriaconsulta.data.students.map((estudiante) => (
                        <tr key={estudiante.rude}>
                          <td className="px-3 py-2">
                            <span className="font-medium text-slate-900">
                              {estudiante.studentName}
                            </span>
                            <span className="block font-mono text-xs text-slate-500">
                              {estudiante.rude}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-700">{estudiante.courseName}</td>
                          <td className="px-3 py-2 text-center tabular-nums">
                            {estudiante.sieAverage}
                          </td>
                          <td className="px-3 py-2 text-center tabular-nums">
                            {estudiante.sigceAverage}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {estudiante.totalDiscrepancies ? (
                              <span className="font-semibold text-rose-700">
                                {estudiante.totalDiscrepancies}
                              </span>
                            ) : (
                              <span className="text-emerald-700">0</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {permitidogestion && (
        <details className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-slate-900">
            <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Wifi aria-hidden="true" className="h-4 w-4" />
            </span>
            Pruebas locales y cola del trabajador
          </summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Estas herramientas procesan una réplica local para validar el flujo del trabajador. No
            inician sesión ni envían calificaciones al portal oficial.
          </p>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-medium text-slate-900">Comprobar la réplica local</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Revisa si el archivo de prueba configurado en el servidor conserva la estructura que
              espera el lector.
            </p>
            <Boton
              type="button"
              variant="outline"
              disabled={revisarlocal.isPending}
              onClick={() => revisarlocal.mutate()}
              className="mt-3"
            >
              {revisarlocal.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              Comprobar réplica local
            </Boton>
            {revisarlocal.isError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {errormensaje(revisarlocal.error, 'No se pudo comprobar la réplica local.')}
              </p>
            )}
            {resultado && (
              <div
                aria-live="polite"
                className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${resultado.structureRecognized ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}
              >
                {resultado.structureRecognized ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                )}
                <div>
                  <p className="font-medium text-slate-900">
                    {resultado.structureRecognized
                      ? 'Réplica local lista'
                      : 'No se reconoció la estructura de prueba'}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{resultado.message}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Revisado {new Date(resultado.checkedAt).toLocaleString('es-BO')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Paneliniciosincronizacionsie
              management={gestion}
              onEnqueued={(id) => {
                establecerseleccionid(id);
                void clientedeconsultas.invalidateQueries({ queryKey: ['sie-sync'] });
              }}
            />

            <section aria-labelledby="sie-queue-heading" className="mt-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="sie-queue-heading" className="text-lg font-semibold text-slate-900">
                    Lotes y resultados
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Consulta notas procesadas, fallas y diferencias pendientes de revisión.
                  </p>
                </div>
                <Boton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void colaconsulta.refetch()}
                  disabled={colaconsulta.isFetching}
                >
                  <RefreshCw className={colaconsulta.isFetching ? 'animate-spin' : ''} /> Actualizar
                </Boton>
              </div>
              {colaconsulta.isError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
                >
                  No se pudieron cargar los lotes.{' '}
                  {errormensaje(colaconsulta.error, 'Comprueba la conexión con el servidor.')}
                </p>
              ) : colaconsulta.isPending ? (
                <p className="text-sm text-slate-500">Cargando sincronizaciones…</p>
              ) : sincronizaciones.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  Todavía no hay lotes de comparación. Selecciona un trimestre cerrado para preparar
                  uno.
                </p>
              ) : (
                <Panelcolasincronizacionsie
                  synchronizations={sincronizaciones}
                  selectedQueue={seleccionadacola}
                  queueCounters={contadores}
                  canResolve={permitidogestion}
                  canRetry={permitidogestion}
                  canResume={permitidogestion}
                  onResolve={(elemento) => establecerdialogo({ tipo: 'resolver', elemento })}
                  onResolveGroup={(grupoId) => establecerdialogo({ tipo: 'resolver', grupoId })}
                  onRetry={(elemento) => establecerdialogo({ tipo: 'reintentar', elemento })}
                  onResume={(sincronizacionId) =>
                    establecerdialogo({ tipo: 'reanudar', sincronizacionId })
                  }
                  filters={filtros}
                  onFiltersChange={establecerfiltros}
                  onSelect={establecerseleccionid}
                />
              )}
            </section>
          </div>
        </details>
      )}

      {dialogo && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) cerrardialogo();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="sie-operation-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h2 id="sie-operation-title" className="text-lg font-semibold text-slate-900">
              {dialogo.tipo === 'resolver'
                ? 'Registrar decisión sobre la diferencia'
                : dialogo.tipo === 'reintentar'
                  ? 'Reintentar registro'
                  : 'Reanudar lote'}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {dialogo.tipo === 'resolver'
                ? 'La decisión queda en el historial y no cambia automáticamente la nota de SIGCE.'
                : 'El motivo se guardará junto con la operación.'}
            </p>
            {dialogo.tipo === 'resolver' && (
              <label className="mt-4 grid gap-1.5 text-sm font-medium text-slate-700">
                Decisión
                <select
                  value={decision}
                  onChange={(evento) => establecerdecision(evento.target.value as typeof decision)}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-3"
                >
                  <option value="KEEP_SIGCE">Mantener la calificación de SIGCE</option>
                  <option value="KEEP_SIE_AS_REFERENCE">
                    Conservar el valor del SIE como referencia
                  </option>
                </select>
              </label>
            )}
            <label className="mt-4 grid gap-1.5 text-sm font-medium text-slate-700">
              Motivo
              <textarea
                value={motivo}
                onChange={(evento) => establecerMotivo(evento.target.value)}
                rows={3}
                minLength={8}
                maxLength={500}
                className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
                placeholder="Describe brevemente por qué se realiza esta acción"
              />
            </label>
            {erroroperacion && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {errormensaje(erroroperacion, 'No se pudo completar la operación.')}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Boton
                type="button"
                variant="outline"
                onClick={cerrardialogo}
                disabled={operacionpendiente}
              >
                Cancelar
              </Boton>
              <Boton
                type="button"
                onClick={confirmardialogo}
                disabled={operacionpendiente || motivo.trim().length < 8}
              >
                {operacionpendiente && <Loader2 className="animate-spin" />}
                Confirmar
              </Boton>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
