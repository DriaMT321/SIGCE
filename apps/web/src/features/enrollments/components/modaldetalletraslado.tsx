import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  ShieldCheck,
  Calendar,
  Send,
  FileCheck2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { SolicitudTrasladoEstudiantil, dtoactualizarfasetraslado } from '@academic/shared-types';
import { fasetraslado, estadotraslado } from '@academic/shared-types';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import { FormularioTrasladoOficialModal } from './formulariotrasladooficialmodal';
import type { gestioninscripcion } from '../application/gestionmatricula';

interface Props {
  traslado: SolicitudTrasladoEstudiantil;
  gestion: gestioninscripcion;
  puedeGestionar: boolean;
  onActualizado: () => void;
  onCerrar: () => void;
}

export function ModalDetalleTraslado({
  traslado,
  gestion,
  puedeGestionar,
  onActualizado,
  onCerrar,
}: Props) {
  const [mostrarImpresion, setMostrarImpresion] = useState(false);
  const [resolucionDistrital, setResolucionDistrital] = useState(traslado.distritalResolution || '');
  const [fechaDistrital, setFechaDistrital] = useState(
    traslado.distritalApprovalDate
      ? new Date(traslado.distritalApprovalDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  );
  const [folioSie, setFolioSie] = useState(traslado.sieFolioNumber || '');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fasesInfo = [
    {
      id: fasetraslado.CONFIRMAR_VACANCIA,
      numero: 1,
      titulo: 'Confirmar Vacancia',
      descripcion: 'Verificar cupo disponible en el colegio de destino.',
    },
    {
      id: fasetraslado.SOLICITAR_RETIRO,
      numero: 2,
      titulo: 'Solicitar Retiro y Formulario',
      descripcion: 'Nota a Dirección, emisión de Formulario y boletín de notas.',
    },
    {
      id: fasetraslado.AUTORIZACION_DISTRITAL,
      numero: 3,
      titulo: 'Autorización Distrital',
      descripcion: 'Aprobación del Director Distrital de Educación.',
    },
    {
      id: fasetraslado.REGISTRO_SIE,
      numero: 4,
      titulo: 'Actualización RUDE en SIE',
      descripcion: 'Plazo legal perentorio: 5 días hábiles.',
    },
  ];

  const indiceFaseActual = fasesInfo.findIndex((f) => f.id === traslado.phase);
  const estaCompletado =
    traslado.phase === fasetraslado.COMPLETADO || traslado.status === estadotraslado.REGISTRADO_SIE;

  // Cálculo de días restantes de plazo legal SIE
  const calcularPlazo = () => {
    if (!traslado.sieSyncDeadline) return null;
    const ahora = new Date();
    const limite = new Date(traslado.sieSyncDeadline);
    const diffMs = limite.getTime() - ahora.getTime();
    const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return dias;
  };

  const diasRestantesSie = calcularPlazo();

  const handleAvanzarFase = async (siguienteFase: fasetraslado, datosExtra: Partial<dtoactualizarfasetraslado> = {}) => {
    try {
      setCargando(true);
      setErrorMsg(null);
      await gestion.actualizarfasetraslado(traslado.id, {
        phase: siguienteFase,
        ...datosExtra,
      });
      onActualizado();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al actualizar la fase del traslado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-6 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-700 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  Trámite de Traslado Estudiantil · ID {traslado.id.slice(0, 8).toUpperCase()}
                </h3>
                <p className="text-xs text-slate-300">
                  {traslado.direction === 'SALIENTE' ? 'Traslado Saliente (Retiro)' : 'Traslado Entrante (Recepción)'} ·{' '}
                  {traslado.transferType === 'REGULAR' ? 'Modalidad Regular' : 'Modalidad Excepcional (R.M. 0001)'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Boton
                type="button"
                onClick={() => setMostrarImpresion(true)}
                className="bg-brand-700 hover:bg-brand-800 text-white font-medium gap-1.5 shadow-xs text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Ver / Imprimir Formulario Oficial</span>
              </Boton>
              <button
                type="button"
                onClick={onCerrar}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 text-xs sm:text-sm text-slate-800">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Banner Plazo Legal SIE 5 días hábiles */}
            <div className="rounded-xl border p-4 bg-gradient-to-r from-brand-50/70 via-white to-amber-50/50 border-brand-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-700 text-white rounded-lg mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Plazo Legal en Plataforma SIE (R.M. 0001/2026)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Todo el proceso de traslado y actualización del RUDE en el sistema no debe superar los{' '}
                      <strong>5 días hábiles</strong>.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right sm:border-l sm:border-brand-200 sm:pl-4">
                  {estaCompletado ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Sincronizado en SIE</span>
                    </span>
                  ) : diasRestantesSie !== null ? (
                    diasRestantesSie >= 0 ? (
                      <div>
                        <span className="text-xl font-extrabold text-brand-900">
                          {diasRestantesSie} {diasRestantesSie === 1 ? 'día' : 'días'}
                        </span>
                        <p className="text-[10px] font-semibold text-brand-700 uppercase">
                          Restantes de plazo legal
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Vencido hace {Math.abs(diasRestantesSie)} días</span>
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">5 días hábiles al aprobar</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper de 4 Fases Oficiales */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                Flujo Oficial del Trámite (4 Fases R.M. 0001)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {fasesInfo.map((f, idx) => {
                  const completada = estaCompletado || idx < indiceFaseActual;
                  const actual = !estaCompletado && idx === indiceFaseActual;
                  return (
                    <div
                      key={f.id}
                      className={`p-3 rounded-xl border transition-all ${
                        completada
                          ? 'border-emerald-300 bg-emerald-50/50 text-slate-900'
                          : actual
                          ? 'border-brand-700 bg-brand-50/70 text-brand-950 ring-2 ring-brand-700/20'
                          : 'border-slate-200 bg-slate-50/50 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            completada
                              ? 'bg-emerald-600 text-white'
                              : actual
                              ? 'bg-brand-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {completada ? '✓' : f.numero}
                        </span>
                        {actual && (
                          <span className="text-[10px] font-bold text-brand-800 uppercase px-1.5 py-0.5 bg-brand-100 rounded">
                            En curso
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs">{f.titulo}</p>
                      <p className="text-[10px] mt-0.5 line-clamp-2">{f.descripcion}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Datos del Trámite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 uppercase">Estudiante y Causal</h5>
                <div className="space-y-1 text-xs">
                  <p>
                    <strong>Estudiante:</strong> {traslado.student?.lastName} {traslado.student?.firstName}
                  </p>
                  <p>
                    <strong>Código RUDE:</strong>{' '}
                    <span className="font-mono font-semibold">{traslado.student?.rude || 'S/R'}</span> ·{' '}
                    <strong>C.I.:</strong> {traslado.student?.ci || 'S/N'}
                  </p>
                  <p>
                    <strong>Causal:</strong> <span className="font-semibold text-brand-900">{traslado.causal}</span>
                  </p>
                  <p className="text-slate-600 italic bg-slate-50 p-2 rounded text-[11px]">
                    "{traslado.causalDetails}"
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3.5 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 uppercase">Unidades Educativas</h5>
                <div className="space-y-1 text-xs">
                  <p>
                    <strong>Origen:</strong> {traslado.originSchool} (SIE: {traslado.originSieCode || 'N/D'})
                  </p>
                  <p>
                    <strong>Destino:</strong> {traslado.destinationSchool} (SIE: {traslado.destinationSieCode || 'N/D'})
                  </p>
                  <p>
                    <strong>Distrito / Dpto:</strong> {traslado.destinationDistrict || 'Distrito Educativo'} ·{' '}
                    {traslado.destinationDepartment || 'Bolivia'}
                  </p>
                  <p>
                    <strong>Curso solicitado:</strong> {traslado.targetGradeCourse || 'Regular'}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones de Avance de Fase (Sólo Administrativo / Secretaría) */}
            {puedeGestionar && !estaCompletado && (
              <div className="rounded-xl border-2 border-brand-200 bg-brand-50/30 p-4 space-y-4">
                <h4 className="font-bold text-xs text-brand-950 uppercase">
                  Gestión Operativa de Fases (R.M. 0001)
                </h4>

                {/* Si está en Fase 1: Pasar a Fase 2 */}
                {traslado.phase === fasetraslado.CONFIRMAR_VACANCIA && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs">¿Vacancia confirmada en colegio de destino?</p>
                      <p className="text-[11px] text-slate-600">
                        Pase a la Fase 2 para emitir el Formulario de Retiro y boletín de calificaciones.
                      </p>
                    </div>
                    <Boton
                      type="button"
                      disabled={cargando}
                      onClick={() => handleAvanzarFase(fasetraslado.SOLICITAR_RETIRO)}
                      className="bg-brand-700 hover:bg-brand-800 text-white text-xs gap-1.5"
                    >
                      <span>Avanzar a Solicitud de Retiro</span>
                      <ChevronRight className="w-4 h-4" />
                    </Boton>
                  </div>
                )}

                {/* Si está en Fase 2: Pasar a Fase 3 (Autorización Distrital) */}
                {traslado.phase === fasetraslado.SOLICITAR_RETIRO && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-xs">Paso 3: Registrar Autorización de la Dirección Distrital</p>
                      <p className="text-[11px] text-slate-600">
                        Ingrese el código o número de Resolución Distrital firmado por el Director Distrital para habilitar el registro SIE.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700">N° Resolución / Autorización Distrital</label>
                        <Entrada
                          value={resolucionDistrital}
                          onChange={(e) => setResolucionDistrital(e.target.value)}
                          placeholder="Ej. AUT-DIST-045/2026"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700">Fecha de Aprobación Distrital</label>
                        <Entrada
                          type="date"
                          value={fechaDistrital}
                          onChange={(e) => setFechaDistrital(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <Boton
                        type="button"
                        disabled={cargando || !resolucionDistrital.trim()}
                        onClick={() =>
                          handleAvanzarFase(fasetraslado.REGISTRO_SIE, {
                            distritalResolution: resolucionDistrital.trim(),
                            distritalApprovalDate: new Date(fechaDistrital),
                            status: estadotraslado.AUTORIZADO_DISTRITAL,
                          })
                        }
                        className="bg-brand-700 hover:bg-brand-800 text-white text-xs gap-1.5"
                      >
                        <span>Registrar Autorización y Activar Plazo 5 Días SIE</span>
                        <ChevronRight className="w-4 h-4" />
                      </Boton>
                    </div>
                  </div>
                )}

                {/* Si está en Fase 3/4: Finalizar registro SIE */}
                {(traslado.phase === fasetraslado.AUTORIZACION_DISTRITAL ||
                  traslado.phase === fasetraslado.REGISTRO_SIE) && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-xs text-brand-950">
                        Paso 4: Formalizar Inscripción y Actualizar RUDE en SIE
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Ingrese el número de comprobante/folio generado en la plataforma SIE para dar por concluido el trámite.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Entrada
                          value={folioSie}
                          onChange={(e) => setFolioSie(e.target.value)}
                          placeholder="N° Folio o Comprobante SIE (Ej. SIE-RUDE-89402)"
                        />
                      </div>
                      <Boton
                        type="button"
                        disabled={cargando || !folioSie.trim()}
                        onClick={() =>
                          handleAvanzarFase(fasetraslado.COMPLETADO, {
                            sieFolioNumber: folioSie.trim(),
                            sieSyncCompleted: true,
                            status: estadotraslado.REGISTRADO_SIE,
                          })
                        }
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Concluir Traslado en SIE</span>
                      </Boton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end">
            <Boton type="button" variant="outline" onClick={onCerrar}>
              Cerrar
            </Boton>
          </div>
        </div>
      </div>

      {mostrarImpresion && (
        <FormularioTrasladoOficialModal
          traslado={traslado}
          onCerrar={() => setMostrarImpresion(false)}
        />
      )}
    </>
  );
}
