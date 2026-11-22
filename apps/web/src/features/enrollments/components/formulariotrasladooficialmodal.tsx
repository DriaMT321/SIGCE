import React from 'react';
import { Printer, X, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import type { SolicitudTrasladoEstudiantil } from '@academic/shared-types';
import { Boton } from '../../../components/ui/boton';

interface Props {
  traslado: SolicitudTrasladoEstudiantil;
  onCerrar: () => void;
}

export function FormularioTrasladoOficialModal({ traslado, onCerrar }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const nombreEstudiante = traslado.student
    ? `${traslado.student.lastName} ${traslado.student.firstName}`
    : 'Estudiante Registrado';

  const causalLabels: Record<string, string> = {
    DOMICILIO: 'Cambio de Domicilio de la Familia',
    LABORAL: 'Motivos Laborales de los Padres/Tutores',
    SALUD: 'Situación de Salud o Tratamiento Médico Justificado',
    ECONOMICA: 'Situación Socio-Económica Familiar',
    VIOLENCIA: 'Protección Integral ante Situaciones de Violencia o Vulnerabilidad',
    CAMBIO_GESTION: 'Traslado Regular al Concluir el Periodo Académico',
    OTRO: 'Causal Excepcional Debidamente Fundamentada',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-8 overflow-hidden print:m-0 print:border-none print:shadow-none print:rounded-none">
        {/* Header no imprimible */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-700 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Formulario Oficial de Traslado Estudiantil</h3>
              <p className="text-xs text-slate-300">
                Formato regulatorio conforme a la Resolución Ministerial N° 0001/2026 y Ley 070
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Boton
              type="button"
              onClick={handlePrint}
              className="bg-brand-700 hover:bg-brand-800 text-white font-medium gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Formulario</span>
            </Boton>
            <button
              type="button"
              onClick={onCerrar}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CUERPO OFICIAL DEL DOCUMENTO (Apto para Impresión) */}
        <div className="p-8 sm:p-12 text-slate-800 text-xs sm:text-sm font-sans space-y-6 print:p-6 print:text-black">
          {/* Encabezado Oficial del Estado Plurinacional */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              Estado Plurinacional de Bolivia · Ministerio de Educación
            </p>
            <p className="text-[10px] font-semibold text-slate-600 uppercase">
              Viceministerio de Educación Regular · Subsistema de Educación Regular
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-950 pt-1">
              Formulario Único de Traslado Estudiantil
            </h1>
            <p className="text-xs font-semibold text-brand-900">
              Regulación R.M. 0001/2026 · Plazo Legal Máximo de Registro SIE: 5 Días Hábiles
            </p>
            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 px-2">
              <span><strong>Trámite ID:</strong> {traslado.id.slice(0, 8).toUpperCase()}</span>
              <span><strong>Fecha Emisión:</strong> {new Date(traslado.createdAt).toLocaleDateString('es-BO')}</span>
              <span>
                <strong>Modalidad:</strong>{' '}
                <span className="font-bold text-slate-900">
                  {traslado.transferType === 'REGULAR' ? 'TRASLADO REGULAR' : 'TRASLADO EXCEPCIONAL'}
                </span>
              </span>
            </div>
          </div>

          {/* Sección I: Datos de Unidades Educativas */}
          <div className="border border-slate-300 rounded-lg p-3.5 space-y-2 bg-slate-50/50 print:bg-transparent">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>I. Unidades Educativas (Origen y Destino)</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {traslado.direction === 'SALIENTE' ? 'Traslado Saliente' : 'Traslado Entrante'}
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-semibold">U.E. de Origen</p>
                <p className="font-bold text-slate-900">{traslado.originSchool}</p>
                <p className="text-slate-600">
                  <strong>Código SIE:</strong> {traslado.originSieCode || 'Registrado en sistema'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-semibold">U.E. de Destino</p>
                <p className="font-bold text-slate-900">{traslado.destinationSchool}</p>
                <p className="text-slate-600">
                  <strong>Código SIE:</strong> {traslado.destinationSieCode || 'En proceso de recepción'}
                </p>
                <p className="text-slate-600">
                  <strong>Distrito:</strong> {traslado.destinationDistrict || 'Distrito Educativo Central'} ·{' '}
                  <strong>Dpto:</strong> {traslado.destinationDepartment || 'Bolivia'}
                </p>
              </div>
            </div>
          </div>

          {/* Sección II: Datos del Estudiante */}
          <div className="border border-slate-300 rounded-lg p-3.5 space-y-2 bg-slate-50/50 print:bg-transparent">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">
              II. Datos Oficiales del Estudiante
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Apellidos y Nombres</p>
                <p className="font-bold text-slate-900">{nombreEstudiante}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Código RUDE (SIE)</p>
                <p className="font-mono font-bold text-slate-900">
                  {traslado.student?.rude || 'RUDE-REGISTRADO'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Cédula de Identidad (C.I.)</p>
                <p className="font-mono font-bold text-slate-900">{traslado.student?.ci || 'S/N'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase">Curso / Año de Escolaridad</p>
                <p className="font-bold text-slate-900">{traslado.targetGradeCourse || 'Regular 2026'}</p>
              </div>
            </div>
          </div>

          {/* Sección III: Causal y Justificación */}
          <div className="border border-slate-300 rounded-lg p-3.5 space-y-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">
              III. Causal y Justificación Normada (R.M. 0001)
            </h2>
            <div className="space-y-1.5 text-xs">
              <p>
                <strong>Causal Declarada:</strong>{' '}
                <span className="font-semibold text-brand-900">
                  {causalLabels[traslado.causal] || traslado.causal}
                </span>
              </p>
              <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-200 print:bg-transparent">
                "{traslado.causalDetails || 'Traslado ordinario tramitado conforme a las normas generales de la gestión educativa.'}"
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <p>
                  <strong>Solicitante:</strong> {traslado.solicitanteNombre || 'Padre / Madre / Tutor Legal'} (
                  {traslado.solicitanteParentesco || 'Tutor'})
                </p>
                <p>
                  <strong>C.I. Solicitante:</strong> {traslado.solicitanteCi || 'Cotejado en secretaría'} ·{' '}
                  <strong>Tel:</strong> {traslado.solicitanteTelefono || 'Registrado'}
                </p>
              </div>
            </div>
          </div>

          {/* Sección IV: Récord Académico / Calificaciones Centralizadas */}
          <div className="border border-slate-300 rounded-lg p-3.5 space-y-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>IV. Calificaciones Oficiales del Periodo Cursado</span>
              <span className="text-[10px] font-normal text-slate-500">
                Trimestre cursado al momento del retiro: T{traslado.currentTrimester}
              </span>
            </h2>
            {traslado.gradesSnapshot && traslado.gradesSnapshot.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 print:bg-transparent font-bold">
                      <th className="p-1.5">Área / Asignatura</th>
                      <th className="p-1.5 text-center">1er Trimestre</th>
                      <th className="p-1.5 text-center">2do Trimestre</th>
                      <th className="p-1.5 text-center">3er Trimestre</th>
                      <th className="p-1.5 text-center">Promedio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {traslado.gradesSnapshot.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-1.5 font-medium">{item.subjectName}</td>
                        <td className="p-1.5 text-center font-mono">{item.firstTrimester ?? '-'}</td>
                        <td className="p-1.5 text-center font-mono">{item.secondTrimester ?? '-'}</td>
                        <td className="p-1.5 text-center font-mono">{item.thirdTrimester ?? '-'}</td>
                        <td className="p-1.5 text-center font-mono font-bold">
                          {item.average ?? item.firstTrimester ?? '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic p-2">
                Documentación académica y libreta escolar adjunta en físico en el legajo del estudiante.
              </p>
            )}
          </div>

          {/* Sección V: Autorización Distrital de Educación y Plazo SIE */}
          <div className="border-2 border-brand-800 rounded-lg p-3.5 space-y-2 bg-brand-50/30 print:bg-transparent">
            <h2 className="text-xs font-bold text-brand-950 uppercase tracking-wide border-b border-brand-200 pb-1 flex items-center justify-between">
              <span>V. Dictamen y Autorización de la Dirección Distrital de Educación</span>
              <span className="text-[10px] bg-brand-700 text-white px-2 py-0.5 rounded font-bold">
                Plazo SIE: 5 Días Hábiles
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-600 text-[10px] uppercase">N° Autorización / Resolución Distrital</p>
                <p className="font-bold text-slate-900 font-mono">
                  {traslado.distritalResolution || 'En trámite distrital'}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-[10px] uppercase">Fecha de Autorización Distrital</p>
                <p className="font-semibold text-slate-900">
                  {traslado.distritalApprovalDate
                    ? new Date(traslado.distritalApprovalDate).toLocaleDateString('es-BO')
                    : 'Pendiente de firma distrital'}
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-[10px] uppercase">Plazo Legal Límite Registro SIE</p>
                <p className="font-bold text-rose-800 font-mono">
                  {traslado.sieSyncDeadline
                    ? new Date(traslado.sieSyncDeadline).toLocaleDateString('es-BO')
                    : '5 días hábiles a partir de la autorización'}
                </p>
              </div>
            </div>
            {traslado.sieFolioNumber && (
              <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                Actualización RUDE en plataforma SIE formalizada bajo Folio / Comprobante N°: {traslado.sieFolioNumber}
              </p>
            )}
          </div>

          {/* Sección VI: Garantía de Derechos del Estudiante (R.M. 0001) */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-3 text-[11px] text-amber-950 flex items-start gap-2.5 print:bg-transparent print:border-slate-400">
            <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Garantía de Derechos del Estudiante (R.M. 0001 / Ley 070):</strong> Las autoridades educativas y
              direcciones de las unidades educativas firmantes certifican que el presente traslado responde a causales
              legítimas y en ningún caso ha sido forzado u obligado a cambio de la aprobación del año escolar, ni por
              motivos de indisciplina o bajo rendimiento académico, garantizando plenamente el derecho constitucional
              a la educación sin discriminación.
            </p>
          </div>

          {/* Sección VII: Firmas y Sellos Reglamentarios */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-[10px]">
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Director(a) U.E. Origen</p>
              <p className="text-slate-500">Firma y Sello Oficial</p>
            </div>
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Padre, Madre o Tutor</p>
              <p className="text-slate-500">Firma del Solicitante</p>
            </div>
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Director(a) Distrital</p>
              <p className="text-slate-500">Sello y Firma de Autorización</p>
            </div>
            <div className="border-t border-slate-400 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">Director(a) U.E. Destino</p>
              <p className="text-slate-500">Recepción e Inscripción SIE</p>
            </div>
          </div>
        </div>

        {/* Footer no imprimible */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Este documento digital cuenta con trazabilidad y registro de auditoría en SIGCE.</span>
          <Boton type="button" variant="outline" onClick={onCerrar}>
            Cerrar
          </Boton>
        </div>
      </div>
    </div>
  );
}
