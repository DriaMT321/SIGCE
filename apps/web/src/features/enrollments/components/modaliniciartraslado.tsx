import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  School,
  UserCheck,
  Calendar,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type {
  gestioninscripcion,
  inscripcionestudianteopcion,
  inscripcioncursoopcion,
  inscripcionacademicogestionopcion,
} from '../application/gestionmatricula';
import {
  tipotraslado,
  direcciontraslado,
  causaltraslado,
  type dtocreartraslado,
} from '@academic/shared-types';

interface Props {
  gestion: gestioninscripcion;
  estudiantes: inscripcionestudianteopcion[];
  cursos: inscripcioncursoopcion[];
  gestiones: inscripcionacademicogestionopcion[];
  estudianteInicial?: { studentId: string; enrollmentId?: string; courseName?: string };
  onExito: () => void;
  onCerrar: () => void;
}

export function ModalIniciarTraslado({
  gestion,
  estudiantes,
  cursos,
  gestiones,
  estudianteInicial,
  onExito,
  onCerrar,
}: Props) {
  const [direccion, setDireccion] = useState<direcciontraslado>(direcciontraslado.SALIENTE);
  const [tipo, setTipo] = useState<tipotraslado>(tipotraslado.REGULAR);
  const [causal, setCausal] = useState<causaltraslado>(causaltraslado.DOMICILIO);
  const [estudianteId, setEstudianteId] = useState(estudianteInicial?.studentId || '');
  const [busquedaEstudiante, setBusquedaEstudiante] = useState('');
  const [gestionId, setGestionId] = useState(gestiones[0]?.id || '');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Document checklist state
  const [checklist, setChecklist] = useState({
    formularioTrasladoFirmado: false,
    certificadoNacimiento: true,
    cedulaIdentidadEstudiante: true,
    cedulaIdentidadTutor: true,
    libretaEscolarBoletin: true,
    formularioRudeTransferencia: false,
    carnetVacunas: false,
    respaldoJustificativo: true,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<{
    originSchool: string;
    originSieCode: string;
    destinationSchool: string;
    destinationSieCode: string;
    destinationDistrict: string;
    destinationDepartment: string;
    targetGradeCourse: string;
    causalDetails: string;
    solicitanteNombre: string;
    solicitanteCi: string;
    solicitanteParentesco: string;
    solicitanteTelefono: string;
    antiCoercionCertified: boolean;
  }>({
    defaultValues: {
      originSchool: direccion === direcciontraslado.SALIENTE ? 'Unidad Educativa Central SIGCE' : '',
      originSieCode: direccion === direcciontraslado.SALIENTE ? '80730001' : '',
      destinationSchool: direccion === direcciontraslado.ENTRANTE ? 'Unidad Educativa Central SIGCE' : '',
      destinationSieCode: direccion === direcciontraslado.ENTRANTE ? '80730001' : '',
      destinationDistrict: 'Distrito Educativo 1',
      destinationDepartment: 'La Paz',
      targetGradeCourse: estudianteInicial?.courseName || '',
      causalDetails: 'Cambio de domicilio familiar documentado con contrato y servicios básicos.',
      solicitanteNombre: '',
      solicitanteCi: '',
      solicitanteParentesco: 'Padre',
      solicitanteTelefono: '',
      antiCoercionCertified: true,
    },
  });

  const estudiantesFiltrados = estudiantes.filter((e) => {
    if (!busquedaEstudiante.trim()) return true;
    const q = busquedaEstudiante.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      (e.rude && e.rude.toLowerCase().includes(q))
    );
  });

  const estudianteSeleccionado = estudiantes.find((e) => e.id === estudianteId);

  const onSubmit = async (valores: any) => {
    if (!estudianteId) {
      setErrorMsg('Debes seleccionar un estudiante para iniciar el trámite.');
      return;
    }
    if (!gestionId) {
      setErrorMsg('Debes seleccionar la gestión académica correspondiente.');
      return;
    }
    if (!valores.antiCoercionCertified) {
      setErrorMsg('Debes certificar formalmente la cláusula de garantía de derechos (R.M. 0001/2026).');
      return;
    }

    try {
      setCargando(true);
      setErrorMsg(null);

      const payload: dtocreartraslado = {
        studentId: estudianteId,
        enrollmentId: estudianteInicial?.enrollmentId,
        academicYearId: gestionId,
        direction: direccion,
        transferType: tipo,
        causal,
        causalDetails: valores.causalDetails,
        originSchool: valores.originSchool,
        originSieCode: valores.originSieCode || undefined,
        destinationSchool: valores.destinationSchool,
        destinationSieCode: valores.destinationSieCode || undefined,
        destinationDistrict: valores.destinationDistrict,
        destinationDepartment: valores.destinationDepartment,
        targetGradeCourse: valores.targetGradeCourse,
        currentTrimester: 1,
        documentsChecklist: checklist,
        antiCoercionCertified: Boolean(valores.antiCoercionCertified),
        solicitanteNombre: valores.solicitanteNombre,
        solicitanteCi: valores.solicitanteCi,
        solicitanteParentesco: valores.solicitanteParentesco,
        solicitanteTelefono: valores.solicitanteTelefono,
      };

      await gestion.creartraslado(payload);
      onExito();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar el trámite de traslado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl my-6 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-700 rounded-lg text-white">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Iniciar Trámite de Traslado Estudiantil</h3>
              <p className="text-xs text-slate-300">
                Normativa Oficial R.M. N° 0001/2026 · Plazo Legal SIE: 5 Días Hábiles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 text-sm">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Dirección del Traslado */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              1. Sentido del Traslado
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDireccion(direcciontraslado.SALIENTE)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  direccion === direcciontraslado.SALIENTE
                    ? 'border-brand-700 bg-brand-50/70 text-brand-950 ring-2 ring-brand-700/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-xs">Traslado Saliente (Retiro)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  El estudiante se retira de esta Unidad Educativa hacia otro colegio.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setDireccion(direcciontraslado.ENTRANTE)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  direccion === direcciontraslado.ENTRANTE
                    ? 'border-brand-700 bg-brand-50/70 text-brand-950 ring-2 ring-brand-700/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-xs">Traslado Entrante (Recepción)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  El estudiante proviene de otra U.E. y formalizará inscripción aquí.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Tipo de Traslado y Causal Normada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Modalidad de Traslado</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as tipotraslado)}
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-brand-700"
              >
                <option value={tipotraslado.REGULAR}>
                  Traslado Regular (Hasta inicio del 2do trimestre)
                </option>
                <option value={tipotraslado.EXCEPTIONAL}>
                  Traslado Excepcional (A mitad de trimestre o fuera de plazo)
                </option>
              </select>
              <p className="text-[10px] text-slate-500">
                {tipo === tipotraslado.REGULAR
                  ? 'Se efectiviza al finalizar el trimestre para asentar notas; máx 5 días hábiles en SIE.'
                  : 'Requiere justificación documental de una causal autorizada por la R.M. 0001.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Causal Justificada (R.M. 0001)</label>
              <select
                value={causal}
                onChange={(e) => setCausal(e.target.value as causaltraslado)}
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-brand-700"
              >
                <option value={causaltraslado.DOMICILIO}>1. Cambio de Domicilio Familiar</option>
                <option value={causaltraslado.LABORAL}>2. Motivos Laborales de Padres o Tutores</option>
                <option value={causaltraslado.SALUD}>3. Situación de Salud o Tratamiento Médico</option>
                <option value={causaltraslado.ECONOMICA}>4. Situación Económica Familiar</option>
                <option value={causaltraslado.VIOLENCIA}>5. Protección ante Situaciones de Violencia</option>
                <option value={causaltraslado.CAMBIO_GESTION}>6. Fin de Periodo / Cierre Académico</option>
                <option value={causaltraslado.OTRO}>7. Otra Causal Extraordinaria Justificada</option>
              </select>
            </div>
          </div>

          {/* 3. Selección de Estudiante y Gestión */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">Estudiante a Trasladar</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <input
                  type="text"
                  placeholder="Buscar estudiante por nombre, apellido o RUDE..."
                  value={busquedaEstudiante}
                  onChange={(e) => setBusquedaEstudiante(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-300 px-3 text-xs"
                />
                <select
                  value={estudianteId}
                  onChange={(e) => setEstudianteId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-brand-700"
                >
                  <option value="">-- Seleccione estudiante ({estudiantesFiltrados.length}) --</option>
                  {estudiantesFiltrados.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.lastName} {e.firstName} (RUDE: {e.rude || 'S/R'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Gestión Académica</label>
                <select
                  value={gestionId}
                  onChange={(e) => setGestionId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white"
                >
                  {gestiones.map((g) => (
                    <option key={g.id} value={g.id}>
                      Gestión {g.year} ({g.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Unidades Educativas (Origen y Destino) */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">Unidades Educativas</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-semibold">U.E. de Origen *</label>
                <Entrada
                  {...register('originSchool', { required: true })}
                  placeholder="Nombre de la U.E. de origen"
                />
                <Entrada
                  {...register('originSieCode')}
                  placeholder="Código SIE U.E. Origen (Ej. 80730001)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-semibold">U.E. de Destino *</label>
                <Entrada
                  {...register('destinationSchool', { required: true })}
                  placeholder="Nombre de la U.E. de destino"
                />
                <Entrada
                  {...register('destinationSieCode')}
                  placeholder="Código SIE U.E. Destino (Ej. 80730045)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <label className="text-[11px] text-slate-600">Distrito Destino</label>
                <Entrada {...register('destinationDistrict')} placeholder="Ej. Distrito 1 La Paz" />
              </div>
              <div>
                <label className="text-[11px] text-slate-600">Departamento Destino</label>
                <Entrada {...register('destinationDepartment')} placeholder="Ej. La Paz" />
              </div>
              <div>
                <label className="text-[11px] text-slate-600">Curso / Grado Destino</label>
                <Entrada {...register('targetGradeCourse')} placeholder="Ej. 3ro de Secundaria A" />
              </div>
            </div>
          </div>

          {/* 5. Causal Details */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">
              Detalle Circunstanciado de la Justificación *
            </label>
            <textarea
              {...register('causalDetails', { required: true })}
              rows={2}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
              placeholder="Describa el motivo del traslado y los documentos de respaldo presentados..."
            />
          </div>

          {/* 6. Solicitante */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700">Datos del Padre / Madre / Tutor Solicitante</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <Entrada {...register('solicitanteNombre')} placeholder="Nombre completo del tutor" />
              </div>
              <div>
                <Entrada {...register('solicitanteCi')} placeholder="C.I. del solicitante" />
              </div>
              <div>
                <Entrada {...register('solicitanteTelefono')} placeholder="Teléfono de contacto" />
              </div>
            </div>
          </div>

          {/* 7. Checklist Documental Requerido */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-brand-700" />
              <span>Documentos Requeridos por Secretaría (R.M. 0001/2026)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.formularioTrasladoFirmado}
                  onChange={(e) =>
                    setChecklist({ ...checklist, formularioTrasladoFirmado: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Formulario de Traslado debidamente firmado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.certificadoNacimiento}
                  onChange={(e) =>
                    setChecklist({ ...checklist, certificadoNacimiento: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Certificado de Nacimiento del estudiante</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.cedulaIdentidadEstudiante}
                  onChange={(e) =>
                    setChecklist({ ...checklist, cedulaIdentidadEstudiante: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Cédula de Identidad del estudiante (fotocopia)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.cedulaIdentidadTutor}
                  onChange={(e) =>
                    setChecklist({ ...checklist, cedulaIdentidadTutor: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Cédula de Identidad del tutor (fotocopia)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.libretaEscolarBoletin}
                  onChange={(e) =>
                    setChecklist({ ...checklist, libretaEscolarBoletin: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Libreta escolar / Boletín de calificaciones al día</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.formularioRudeTransferencia}
                  onChange={(e) =>
                    setChecklist({ ...checklist, formularioRudeTransferencia: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Formulario RUDE de transferencia</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.carnetVacunas}
                  onChange={(e) =>
                    setChecklist({ ...checklist, carnetVacunas: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Carnet de vacunas (en nivel inicial)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.respaldoJustificativo}
                  onChange={(e) =>
                    setChecklist({ ...checklist, respaldoJustificativo: e.target.checked })
                  }
                  className="rounded text-brand-700 focus:ring-brand-700"
                />
                <span>Respaldo de causal (alquiler, trabajo, médico, etc.)</span>
              </label>
            </div>
          </div>

          {/* 8. Garantía de no coacción R.M. 0001 (OBLIGATORIA) */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Garantía Legal de Derechos del Estudiante (R.M. 0001 / Ley 070)</p>
                <p className="text-[11px] leading-relaxed mt-0.5">
                  La Resolución Ministerial N° 0001 prohíbe terminantemente a las unidades educativas obligar o
                  condicionar el traslado de un estudiante a cambio de la aprobación del año escolar, o por motivos de
                  indisciplina o bajo rendimiento académico.
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-brand-950">
              <input
                type="checkbox"
                {...register('antiCoercionCertified', { required: true })}
                className="rounded text-brand-700 focus:ring-brand-700 w-4 h-4"
              />
              <span>Certifico bajo juramento que este traslado NO es condicionado por rendimiento ni disciplina escolar</span>
            </label>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              Al guardar se generará el Formulario Oficial con plazo de 5 días hábiles para el SIE.
            </p>
            <div className="flex items-center gap-2">
              <Boton type="button" variant="outline" onClick={onCerrar}>
                Cancelar
              </Boton>
              <Boton
                type="submit"
                disabled={cargando}
                className="bg-brand-700 hover:bg-brand-800 text-white font-medium shadow-xs"
              >
                {cargando ? 'Registrando Trámite...' : 'Registrar Trámite de Traslado'}
              </Boton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
