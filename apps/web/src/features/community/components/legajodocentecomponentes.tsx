import React, { useState, useRef } from 'react';
import {
  FileText,
  GraduationCap,
  Award,
  CreditCard,
  Building2,
  Upload,
  X,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Camera,
  Printer,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';

export interface RequisitosDocenteDatos {
  fotoPerfil?: string;
  rda: {
    archivoUrl?: string;
    nombreArchivo?: string;
    numeroRda: string;
    categoriaEscalafon: string;
    anosServicio: number | string;
    formacionAcademica: string;
    cargaHoraria: string;
    unidadEducativaDistrito: string;
  };
  tituloProvisionNacional: {
    archivoUrl?: string;
    nombreArchivo?: string;
    tieneTitulo: boolean;
    numeroTitulo: string;
    institucionEmisora: string;
    anoEmision: number | string;
    especialidadMencion: string;
  };
  resolucionEscalafon: {
    archivoUrl?: string;
    nombreArchivo?: string;
    numeroResolucion: string;
    fechaResolucion: string;
    libroRegistro: string;
    folioRegistro: string;
    categoriaIngreso: string;
  };
  boletaPago: {
    archivoUrl?: string;
    nombreArchivo?: string;
    aplicaBoleta: boolean;
    numeroItem: string;
    periodoBoleta: string;
    distritoFiscal: string;
    bonosPercibidos: string;
  };
  titularPorAntiguedad: {
    archivoUrl?: string;
    nombreArchivo?: string;
    esTitularPorAntiguedad: boolean;
    numeroResolucionSuprema: string;
    fechaResolucion: string;
    anosAcreditados: number | string;
    profesionOrigen: string;
  };
}

export const CATEGORIAS_ESCALAFON = [
  'Quinta Categoría (Inicio)',
  'Cuarta Categoría',
  'Tercera Categoría',
  'Segunda Categoría',
  'Primera Categoría',
  'Categoría Cero',
  'Categoría Mérito',
  'Interino / Sin Categoría',
];

export const requisitosDocentePredeterminados: RequisitosDocenteDatos = {
  fotoPerfil: '',
  rda: {
    archivoUrl: '',
    nombreArchivo: '',
    numeroRda: '',
    categoriaEscalafon: 'Quinta Categoría (Inicio)',
    anosServicio: '',
    formacionAcademica: '',
    cargaHoraria: '',
    unidadEducativaDistrito: '',
  },
  tituloProvisionNacional: {
    archivoUrl: '',
    nombreArchivo: '',
    tieneTitulo: true,
    numeroTitulo: '',
    institucionEmisora: '',
    anoEmision: '',
    especialidadMencion: '',
  },
  resolucionEscalafon: {
    archivoUrl: '',
    nombreArchivo: '',
    numeroResolucion: '',
    fechaResolucion: '',
    libroRegistro: '',
    folioRegistro: '',
    categoriaIngreso: 'Quinta Categoría (Inicio)',
  },
  boletaPago: {
    archivoUrl: '',
    nombreArchivo: '',
    aplicaBoleta: true,
    numeroItem: '',
    periodoBoleta: '',
    distritoFiscal: '',
    bonosPercibidos: '',
  },
  titularPorAntiguedad: {
    archivoUrl: '',
    nombreArchivo: '',
    esTitularPorAntiguedad: false,
    numeroResolucionSuprema: '',
    fechaResolucion: '',
    anosAcreditados: '',
    profesionOrigen: '',
  },
};

export function normalizarRequisitosDocente(docente: {
  rdaNumber?: string | null;
  escalafonCategory?: string | null;
  yearsOfService?: number | null;
  photoUrl?: string | null;
  itemNumber?: string | null;
  specialty?: string | null;
  documents?: any;
}): RequisitosDocenteDatos {
  const docs = (typeof docente.documents === 'object' && docente.documents !== null) ? docente.documents : {};
  return {
    fotoPerfil: docente.photoUrl || docs.fotoPerfil || '',
    rda: {
      archivoUrl: docs.rda?.archivoUrl || '',
      nombreArchivo: docs.rda?.nombreArchivo || '',
      numeroRda: docente.rdaNumber || docs.rda?.numeroRda || '',
      categoriaEscalafon: docente.escalafonCategory || docs.rda?.categoriaEscalafon || 'Quinta Categoría (Inicio)',
      anosServicio: docente.yearsOfService ?? docs.rda?.anosServicio ?? '',
      formacionAcademica: docs.rda?.formacionAcademica || '',
      cargaHoraria: docs.rda?.cargaHoraria || '',
      unidadEducativaDistrito: docs.rda?.unidadEducativaDistrito || '',
    },
    tituloProvisionNacional: {
      archivoUrl: docs.tituloProvisionNacional?.archivoUrl || '',
      nombreArchivo: docs.tituloProvisionNacional?.nombreArchivo || '',
      tieneTitulo: docs.tituloProvisionNacional?.tieneTitulo ?? true,
      numeroTitulo: docs.tituloProvisionNacional?.numeroTitulo || '',
      institucionEmisora: docs.tituloProvisionNacional?.institucionEmisora || '',
      anoEmision: docs.tituloProvisionNacional?.anoEmision || '',
      especialidadMencion: docs.tituloProvisionNacional?.especialidadMencion || docente.specialty || '',
    },
    resolucionEscalafon: {
      archivoUrl: docs.resolucionEscalafon?.archivoUrl || '',
      nombreArchivo: docs.resolucionEscalafon?.nombreArchivo || '',
      numeroResolucion: docs.resolucionEscalafon?.numeroResolucion || '',
      fechaResolucion: docs.resolucionEscalafon?.fechaResolucion || '',
      libroRegistro: docs.resolucionEscalafon?.libroRegistro || '',
      folioRegistro: docs.resolucionEscalafon?.folioRegistro || '',
      categoriaIngreso: docs.resolucionEscalafon?.categoriaIngreso || docente.escalafonCategory || 'Quinta Categoría (Inicio)',
    },
    boletaPago: {
      archivoUrl: docs.boletaPago?.archivoUrl || '',
      nombreArchivo: docs.boletaPago?.nombreArchivo || '',
      aplicaBoleta: docs.boletaPago?.aplicaBoleta ?? true,
      numeroItem: docente.itemNumber || docs.boletaPago?.numeroItem || '',
      periodoBoleta: docs.boletaPago?.periodoBoleta || '',
      distritoFiscal: docs.boletaPago?.distritoFiscal || '',
      bonosPercibidos: docs.boletaPago?.bonosPercibidos || '',
    },
    titularPorAntiguedad: {
      archivoUrl: docs.titularPorAntiguedad?.archivoUrl || '',
      nombreArchivo: docs.titularPorAntiguedad?.nombreArchivo || '',
      esTitularPorAntiguedad: docs.titularPorAntiguedad?.esTitularPorAntiguedad ?? false,
      numeroResolucionSuprema: docs.titularPorAntiguedad?.numeroResolucionSuprema || '',
      fechaResolucion: docs.titularPorAntiguedad?.fechaResolucion || '',
      anosAcreditados: docs.titularPorAntiguedad?.anosAcreditados || '',
      profesionOrigen: docs.titularPorAntiguedad?.profesionOrigen || '',
    },
  };
}

export async function comprimirArchivoADataUrl(archivo: File, maxAncho = 1600, calidad = 0.82): Promise<{ dataUrl: string; nombre: string }> {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith('image/')) {
      const lector = new FileReader();
      lector.onload = () => resolve({ dataUrl: lector.result as string, nombre: archivo.name });
      lector.onerror = reject;
      lector.readAsDataURL(archivo);
      return;
    }

    const lector = new FileReader();
    lector.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let ancho = img.width;
        let alto = img.height;
        if (ancho > maxAncho) {
          alto = Math.round((alto * maxAncho) / ancho);
          ancho = maxAncho;
        }
        const canvas = document.createElement('canvas');
        canvas.width = ancho;
        canvas.height = alto;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: e.target?.result as string, nombre: archivo.name });
          return;
        }
        ctx.drawImage(img, 0, 0, ancho, alto);
        const dataUrl = canvas.toDataURL('image/jpeg', calidad);
        resolve({ dataUrl, nombre: archivo.name.replace(/\.[^/.]+$/, '.jpg') });
      };
      img.onerror = () => resolve({ dataUrl: e.target?.result as string, nombre: archivo.name });
      img.src = e.target?.result as string;
    };
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}

async function descargarArchivoAdjunto(dataUrl: string, nombreArchivo?: string) {
  const blob = await (await fetch(dataUrl)).blob();
  const urlTemporal = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = urlTemporal;
  enlace.download = (nombreArchivo || 'respaldo-docente').replace(/[\\/:*?"<>|]/g, '_').slice(0, 120);
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(urlTemporal), 60_000);
}

/**
 * Componente para subir y previsualizar documentos/fotos
 */
export function SubidorDocumentoFoto({
  label,
  subtitulo,
  archivoUrl,
  nombreArchivo,
  onChange,
  onRemove,
  onVerCompleto,
}: {
  label: string;
  subtitulo?: string;
  archivoUrl?: string;
  nombreArchivo?: string;
  onChange: (dataUrl: string, nombre: string) => void;
  onRemove: () => void;
  onVerCompleto?: (url: string, titulo: string) => void;
}) {
  const [cargando, setCargando] = useState(false);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tiposPermitidos = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
    if (!tiposPermitidos.has(file.type)) {
      setErrorArchivo('Usa un archivo PDF, JPG, PNG o WebP.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorArchivo('El archivo supera el límite de 8 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    try {
      setErrorArchivo(null);
      setCargando(true);
      const resultado = await comprimirArchivoADataUrl(file);
      onChange(resultado.dataUrl, resultado.nombre);
    } catch {
      setErrorArchivo('No se pudo procesar el archivo. Inténtalo nuevamente.');
    } finally {
      setCargando(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const descargarParaRevision = async () => {
    if (!archivoUrl?.startsWith('data:application/pdf;base64,')) return;
    try {
      await descargarArchivoAdjunto(archivoUrl, nombreArchivo || 'documento-docente.pdf');
      setErrorArchivo(null);
    } catch {
      setErrorArchivo('No se pudo preparar el PDF para revisarlo.');
    }
  };

  const esImagen = archivoUrl?.startsWith('data:image/') || /\.(jpg|jpeg|png|webp)$/i.test(archivoUrl || '');

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold text-slate-800">{label}</span>
          {subtitulo && <p className="text-[11px] text-slate-500">{subtitulo}</p>}
        </div>
        {archivoUrl ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Adjunto para cotejo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Pendiente
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={manejarArchivo}
      />

      {archivoUrl ? (
        <div className="relative group overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
          {esImagen ? (
            <div className="relative h-28 w-full bg-slate-100 rounded overflow-hidden flex items-center justify-center">
              <img
                src={archivoUrl}
                alt={label}
                className="h-full w-full object-contain object-center"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {onVerCompleto && (
                  <button
                    type="button"
                    onClick={() => onVerCompleto(archivoUrl, label)}
                    className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-md text-xs font-medium flex items-center gap-1 shadow"
                    title="Ver imagen completa"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-md text-xs font-medium flex items-center gap-1 shadow"
                  title="Cambiar archivo"
                >
                  <Upload className="w-3.5 h-3.5" /> Cambiar
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-medium flex items-center gap-1 shadow"
                  title="Quitar archivo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-5 h-5 text-brand-700 shrink-0" />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {nombreArchivo || 'Documento adjunto'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {archivoUrl.startsWith('data:application/pdf;base64,') && (
                  <button
                    type="button"
                    onClick={() => void descargarParaRevision()}
                    className="rounded px-2 py-1 text-xs font-medium text-brand-800 hover:bg-brand-50"
                    title="Descargar el PDF para revisar su contenido"
                  >
                    Descargar para revisar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="p-1 text-slate-500 hover:text-slate-800"
                  title="Cambiar"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1 text-rose-500 hover:text-rose-700"
                  title="Quitar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {nombreArchivo && esImagen && (
            <p className="mt-1 text-[11px] text-slate-500 truncate">{nombreArchivo}</p>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={cargando}
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-white/60 p-4 text-center hover:bg-white hover:border-brand-400 transition-colors cursor-pointer"
        >
          <Camera className="w-5 h-5 text-slate-400" />
          <span className="text-xs font-medium text-brand-700 hover:text-brand-800">
            {cargando ? 'Procesando archivo...' : 'Subir foto o documento escaneado'}
          </span>
          <span className="text-[10px] text-slate-400">PDF, JPG, PNG o WebP · máximo 8 MB</span>
        </button>
      )}
      {errorArchivo && (
        <p role="alert" className="mt-2 text-xs font-medium text-rose-700">
          {errorArchivo}
        </p>
      )}
    </div>
  );
}

/**
 * Editor completo de los 5 requerimientos oficiales del magisterio
 */
export function EditorRequisitosMagisterio({
  valores,
  onChange,
  onVerImagen,
}: {
  valores: RequisitosDocenteDatos;
  onChange: (nuevosValores: RequisitosDocenteDatos) => void;
  onVerImagen?: (url: string, titulo: string) => void;
}) {
  const [tabActiva, setTabActiva] = useState<'rda' | 'titulo' | 'escalafon' | 'boleta' | 'antiguedad'>('rda');

  const actualizarRda = (campo: keyof RequisitosDocenteDatos['rda'], valor: any) => {
    onChange({
      ...valores,
      rda: { ...valores.rda, [campo]: valor },
    });
  };

  const actualizarTitulo = (campo: keyof RequisitosDocenteDatos['tituloProvisionNacional'], valor: any) => {
    onChange({
      ...valores,
      tituloProvisionNacional: { ...valores.tituloProvisionNacional, [campo]: valor },
    });
  };

  const actualizarEscalafon = (campo: keyof RequisitosDocenteDatos['resolucionEscalafon'], valor: any) => {
    onChange({
      ...valores,
      resolucionEscalafon: { ...valores.resolucionEscalafon, [campo]: valor },
    });
  };

  const actualizarBoleta = (campo: keyof RequisitosDocenteDatos['boletaPago'], valor: any) => {
    onChange({
      ...valores,
      boletaPago: { ...valores.boletaPago, [campo]: valor },
    });
  };

  const actualizarAntiguedad = (campo: keyof RequisitosDocenteDatos['titularPorAntiguedad'], valor: any) => {
    onChange({
      ...valores,
      titularPorAntiguedad: { ...valores.titularPorAntiguedad, [campo]: valor },
    });
  };

  const tieneDoc = (url?: string) => Boolean(url && url.length > 5);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Cabecera descriptiva institucional */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 px-4 py-3 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wide uppercase">
              Requerimientos Oficiales del Docente (Ley 070 y Magisterio)
            </h3>
            <p className="text-[11px] text-slate-300">
              Legajo profesional informatizado: extracto RDA, TPN, Escalafón, Boleta e Interinatos.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200 font-mono">
            Bolivia · Ministerio de Educación
          </span>
        </div>
      </div>

      {/* Selector de pestañas de los 5 requerimientos */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-2 pt-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setTabActiva('rda')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${tabActiva === 'rda'
              ? 'bg-white text-brand-700 border-brand-700 shadow-2xs'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. RDA</span>
          {tieneDoc(valores.rda.archivoUrl) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('titulo')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${tabActiva === 'titulo'
              ? 'bg-white text-brand-700 border-brand-700 shadow-2xs'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>2. Título Provisión Nacional</span>
          {tieneDoc(valores.tituloProvisionNacional.archivoUrl) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('escalafon')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${tabActiva === 'escalafon'
              ? 'bg-white text-brand-700 border-brand-700 shadow-2xs'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>3. Resolución Escalafón</span>
          {tieneDoc(valores.resolucionEscalafon.archivoUrl) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('boleta')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${tabActiva === 'boleta'
              ? 'bg-white text-brand-700 border-brand-700 shadow-2xs'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>4. Boleta Mecanizada</span>
          {tieneDoc(valores.boletaPago.archivoUrl) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('antiguedad')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${tabActiva === 'antiguedad'
              ? 'bg-white text-brand-700 border-brand-700 shadow-2xs'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>5. Titular por Antigüedad</span>
          {tieneDoc(valores.titularPorAntiguedad.archivoUrl) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          )}
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="p-4 sm:p-5">
        {/* PESTAÑA 1: RDA */}
        {tabActiva === 'rda' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50/60 p-3 text-xs text-blue-900 border border-blue-100 flex items-start gap-2.5">
              <FileCheck2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-blue-950">
                  1. Registro Docente Administrativo (RDA):
                </strong>{' '}
                Transcribe aquí los datos que aparecen en el documento y adjunta una copia para que el personal autorizado
                pueda cotejarlos. SIGCE conserva el respaldo, pero no valida automáticamente su autenticidad. Cada archivo
                adjunto puede pesar hasta 8 MB; el legajo completo admite hasta 10 MB.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <SubidorDocumentoFoto
                  label="Foto o Duplicado del RDA"
                  subtitulo="Extracto informatizado oficial"
                  archivoUrl={valores.rda.archivoUrl}
                  nombreArchivo={valores.rda.nombreArchivo}
                  onChange={(url, nombre) => {
                    actualizarRda('archivoUrl', url);
                    actualizarRda('nombreArchivo', nombre);
                  }}
                  onRemove={() => {
                    actualizarRda('archivoUrl', '');
                    actualizarRda('nombreArchivo', '');
                  }}
                  onVerCompleto={onVerImagen}
                />
              </div>

              <div className="md:col-span-8 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Número de RDA</label>
                  <Entrada
                    value={valores.rda.numeroRda}
                    onChange={(e) => actualizarRda('numeroRda', e.target.value)}
                    placeholder="Ej. 5894102"
                  />
                  <p className="text-[10px] text-slate-500">Código único del docente; obligatorio si adjuntas el respaldo</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Categoría en Escalafón</label>
                  <select
                    value={valores.rda.categoriaEscalafon}
                    onChange={(e) => actualizarRda('categoriaEscalafon', e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    {CATEGORIAS_ESCALAFON.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500">Nivel jerárquico salarial acreditado</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Años de Servicio (Antigüedad)</label>
                  <Entrada
                    type="number"
                    min="0"
                    max="50"
                    value={valores.rda.anosServicio}
                    onChange={(e) => actualizarRda('anosServicio', e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej. 12"
                  />
                  <p className="text-[10px] text-slate-500">Años de servicio formal en el magisterio</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Carga Horaria Asignada</label>
                  <Entrada
                    value={valores.rda.cargaHoraria}
                    onChange={(e) => actualizarRda('cargaHoraria', e.target.value)}
                    placeholder="Ej. 88 horas / 96 horas"
                  />
                  <p className="text-[10px] text-slate-500">Horas semanales/mensuales según ítem</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Formación Académica en RDA</label>
                  <Entrada
                    value={valores.rda.formacionAcademica}
                    onChange={(e) => actualizarRda('formacionAcademica', e.target.value)}
                    placeholder="Ej. Licenciatura en Educación Secundaria Comunitaria Productiva"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Unidad Educativa / Distrito de Origen</label>
                  <Entrada
                    value={valores.rda.unidadEducativaDistrito}
                    onChange={(e) => actualizarRda('unidadEducativaDistrito', e.target.value)}
                    placeholder="Ej. Distrito Cochabamba 1 - U.E. Central"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: TÍTULO EN PROVISIÓN NACIONAL */}
        {tabActiva === 'titulo' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-50/70 p-3 text-xs text-emerald-950 border border-emerald-100 flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-950">2. Título Profesional de Maestro/a (Título en Provisión Nacional):</strong>{' '}
                Documento definitivo que certifica la culminación de estudios pedagógicos en Escuela Superior de Formación
                de Maestros (ESFM o ex-Normal). Habilita para el ejercicio fiscal, de convenio y privado.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <SubidorDocumentoFoto
                  label="Foto o Escaneo del Título"
                  subtitulo="Título en Provisión Nacional"
                  archivoUrl={valores.tituloProvisionNacional.archivoUrl}
                  nombreArchivo={valores.tituloProvisionNacional.nombreArchivo}
                  onChange={(url, nombre) => {
                    actualizarTitulo('archivoUrl', url);
                    actualizarTitulo('nombreArchivo', nombre);
                  }}
                  onRemove={() => {
                    actualizarTitulo('archivoUrl', '');
                    actualizarTitulo('nombreArchivo', '');
                  }}
                  onVerCompleto={onVerImagen}
                />
              </div>

              <div className="md:col-span-8 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-tiene-titulo"
                    checked={valores.tituloProvisionNacional.tieneTitulo}
                    onChange={(e) => actualizarTitulo('tieneTitulo', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-700"
                  />
                  <label htmlFor="chk-tiene-titulo" className="text-xs font-semibold text-slate-800">
                    Docente cuenta con Título en Provisión Nacional acreditado
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Número de T.P.N.</label>
                  <Entrada
                    value={valores.tituloProvisionNacional.numeroTitulo}
                    onChange={(e) => actualizarTitulo('numeroTitulo', e.target.value)}
                    placeholder="Ej. TPN-2016-08492"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Año de Emisión / Egreso</label>
                  <Entrada
                    type="number"
                    min="1970"
                    max="2030"
                    value={valores.tituloProvisionNacional.anoEmision}
                    onChange={(e) => actualizarTitulo('anoEmision', e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej. 2016"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Institución de Formación Pedagógica (ESFM / Ex-Normal)</label>
                  <Entrada
                    value={valores.tituloProvisionNacional.institucionEmisora}
                    onChange={(e) => actualizarTitulo('institucionEmisora', e.target.value)}
                    placeholder="Ej. ESFM Simón Rodríguez / ESFM Mariscal Sucre"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Especialidad o Mención en Título</label>
                  <Entrada
                    value={valores.tituloProvisionNacional.especialidadMencion}
                    onChange={(e) => actualizarTitulo('especialidadMencion', e.target.value)}
                    placeholder="Ej. Matemática y Física / Educación Primaria Comunitaria Vocacional"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: RESOLUCIÓN ESCALAFÓN */}
        {tabActiva === 'escalafon' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50/70 p-3 text-xs text-amber-950 border border-amber-100 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-950">3. Resolución Administrativa del Escalafón Nacional:</strong>{' '}
                Regula la carrera docente, garantizando estabilidad laboral, jerarquía y escala salarial. Certifica la
                incorporación formal al magisterio y habilita los exámenes de ascenso de categoría.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <SubidorDocumentoFoto
                  label="Foto o Escaneo de la R.A."
                  subtitulo="Resolución Administrativa de Escalafón"
                  archivoUrl={valores.resolucionEscalafon.archivoUrl}
                  nombreArchivo={valores.resolucionEscalafon.nombreArchivo}
                  onChange={(url, nombre) => {
                    actualizarEscalafon('archivoUrl', url);
                    actualizarEscalafon('nombreArchivo', nombre);
                  }}
                  onRemove={() => {
                    actualizarEscalafon('archivoUrl', '');
                    actualizarEscalafon('nombreArchivo', '');
                  }}
                  onVerCompleto={onVerImagen}
                />
              </div>

              <div className="md:col-span-8 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Número de Resolución Administrativa</label>
                  <Entrada
                    value={valores.resolucionEscalafon.numeroResolucion}
                    onChange={(e) => actualizarEscalafon('numeroResolucion', e.target.value)}
                    placeholder="Ej. RA N° 342/2017"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Fecha de la Resolución</label>
                  <Entrada
                    type="date"
                    value={valores.resolucionEscalafon.fechaResolucion}
                    onChange={(e) => actualizarEscalafon('fechaResolucion', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Libro de Registro</label>
                  <Entrada
                    value={valores.resolucionEscalafon.libroRegistro}
                    onChange={(e) => actualizarEscalafon('libroRegistro', e.target.value)}
                    placeholder="Ej. Libro 14"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Folio de Registro</label>
                  <Entrada
                    value={valores.resolucionEscalafon.folioRegistro}
                    onChange={(e) => actualizarEscalafon('folioRegistro', e.target.value)}
                    placeholder="Ej. Folio 82"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Categoría Inicial o Acreditada</label>
                  <select
                    value={valores.resolucionEscalafon.categoriaIngreso}
                    onChange={(e) => actualizarEscalafon('categoriaIngreso', e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    {CATEGORIAS_ESCALAFON.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: BOLETA MECANIZADA */}
        {tabActiva === 'boleta' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50/70 p-3 text-xs text-amber-950 border border-amber-200 flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-950">4. Boleta de Pago Mecanizada (Maestros en Ejercicio):</strong>{' '}
                Prueba oficial emitida por el Ministerio de Economía y Finanzas Públicas para docentes en ejercicio activo
                del sistema fiscal o convenio. Certifica ítem, RDA, categoría y bonos del magisterio.
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <SubidorDocumentoFoto
                  label="Foto o Escaneo de Boleta"
                  subtitulo="Boleta Mecanizada MEFP"
                  archivoUrl={valores.boletaPago.archivoUrl}
                  nombreArchivo={valores.boletaPago.nombreArchivo}
                  onChange={(url, nombre) => {
                    actualizarBoleta('archivoUrl', url);
                    actualizarBoleta('nombreArchivo', nombre);
                  }}
                  onRemove={() => {
                    actualizarBoleta('archivoUrl', '');
                    actualizarBoleta('nombreArchivo', '');
                  }}
                  onVerCompleto={onVerImagen}
                />
              </div>

              <div className="md:col-span-8 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-aplica-boleta"
                    checked={valores.boletaPago.aplicaBoleta}
                    onChange={(e) => actualizarBoleta('aplicaBoleta', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-700"
                  />
                  <label htmlFor="chk-aplica-boleta" className="text-xs font-semibold text-slate-800">
                    Docente cuenta con Boleta Mecanizada en ejercicio fiscal/convenio
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Número de Ítem en Boleta</label>
                  <Entrada
                    value={valores.boletaPago.numeroItem}
                    onChange={(e) => actualizarBoleta('numeroItem', e.target.value)}
                    placeholder="Ej. IT-4029"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Periodo Pagado (Mes / Gestión)</label>
                  <Entrada
                    value={valores.boletaPago.periodoBoleta}
                    onChange={(e) => actualizarBoleta('periodoBoleta', e.target.value)}
                    placeholder="Ej. Octubre 2026 (10/2026)"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Distrito o Entidad Fiscal (MEFP)</label>
                  <Entrada
                    value={valores.boletaPago.distritoFiscal}
                    onChange={(e) => actualizarBoleta('distritoFiscal', e.target.value)}
                    placeholder="Ej. Dirección Departamental Cochabamba - Distrito 1"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Bonos Percibidos en Boleta</label>
                  <Entrada
                    value={valores.boletaPago.bonosPercibidos}
                    onChange={(e) => actualizarBoleta('bonosPercibidos', e.target.value)}
                    placeholder="Ej. Bono Pro-Libro, Incentivo a la Permanencia, Bono Zona"
                  />
                  <p className="text-[10px] text-slate-500">Bonos específicos asignados en la boleta mecanizada</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: TITULAR POR ANTIGÜEDAD */}
        {tabActiva === 'antiguedad' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-800 border border-slate-200 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-slate-900">5. Título de "Titular por Antigüedad" (Casos excepcionales e interinos):</strong>{' '}
                Para profesionales universitarios o técnicos que ingresaron a la docencia por necesidad de servicio.
                Acredita 10 o más años de servicio docente y examen de capacidad aprobado según Resolución Suprema.
              </div>
            </div>

            <div className="space-y-1 p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div>
                <label htmlFor="chk-titular-antiguedad" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  ¿Aplica condición de "Titular por Antigüedad" / Maestro Interino?
                </label>
                <p className="text-[11px] text-slate-500">
                  Marque si el profesor regularizó su titularidad tras 10 años de servicio docente
                </p>
              </div>
              <input
                type="checkbox"
                id="chk-titular-antiguedad"
                checked={valores.titularPorAntiguedad.esTitularPorAntiguedad}
                onChange={(e) => actualizarAntiguedad('esTitularPorAntiguedad', e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-brand-700 focus:ring-brand-700"
              />
            </div>

            {valores.titularPorAntiguedad.esTitularPorAntiguedad ? (
              <div className="grid gap-4 md:grid-cols-12 pt-2">
                <div className="md:col-span-4">
                  <SubidorDocumentoFoto
                    label="Foto o Resolución Suprema"
                    subtitulo="Título de Titular por Antigüedad"
                    archivoUrl={valores.titularPorAntiguedad.archivoUrl}
                    nombreArchivo={valores.titularPorAntiguedad.nombreArchivo}
                    onChange={(url, nombre) => {
                      actualizarAntiguedad('archivoUrl', url);
                      actualizarAntiguedad('nombreArchivo', nombre);
                    }}
                    onRemove={() => {
                      actualizarAntiguedad('archivoUrl', '');
                      actualizarAntiguedad('nombreArchivo', '');
                    }}
                    onVerCompleto={onVerImagen}
                  />
                </div>

                <div className="md:col-span-8 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Número de Resolución Suprema</label>
                    <Entrada
                      value={valores.titularPorAntiguedad.numeroResolucionSuprema}
                      onChange={(e) => actualizarAntiguedad('numeroResolucionSuprema', e.target.value)}
                      placeholder="Ej. RS N° 21894"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Fecha de Resolución Suprema</label>
                    <Entrada
                      type="date"
                      value={valores.titularPorAntiguedad.fechaResolucion}
                      onChange={(e) => actualizarAntiguedad('fechaResolucion', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Años de Servicio Demostrados (mín. 10)</label>
                    <Entrada
                      type="number"
                      min="10"
                      max="45"
                      value={valores.titularPorAntiguedad.anosAcreditados}
                      onChange={(e) => actualizarAntiguedad('anosAcreditados', e.target.value ? Number(e.target.value) : '')}
                      placeholder="Ej. 11"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Profesión o Título de Origen</label>
                    <Entrada
                      value={valores.titularPorAntiguedad.profesionOrigen}
                      onChange={(e) => actualizarAntiguedad('profesionOrigen', e.target.value)}
                      placeholder="Ej. Lic. en Bioquímica / Ing. de Sistemas"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                No aplica: El docente es egresado normalista titular o no requiere resolución de titular por antigüedad.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Modal visualizador del Legajo Docente institucional completo con opción de impresión
 */
export function ModalDetalleLegajoDocente({
  docente,
  onCerrar,
  onVerImagenCompleta,
}: {
  docente: {
    id: string;
    firstName: string;
    lastName: string;
    ci: string;
    email: string;
    phone?: string | null;
    specialty: string;
    itemNumber?: string | null;
    rdaNumber?: string | null;
    escalafonCategory?: string | null;
    yearsOfService?: number | null;
    photoUrl?: string | null;
    documents?: any;
  };
  onCerrar: () => void;
  onVerImagenCompleta?: (url: string, titulo: string) => void;
}) {
  const [errorDescargaRda, setErrorDescargaRda] = useState<string | null>(null);
  const reqs = normalizarRequisitosDocente(docente);
  const esImagen = (url?: string) => Boolean(url && (url.startsWith('data:image/') || /\.(jpg|jpeg|png|webp)$/i.test(url)));

  const totalCompletados = [
    Boolean(reqs.rda.archivoUrl || reqs.rda.numeroRda),
    Boolean(reqs.tituloProvisionNacional.archivoUrl || reqs.tituloProvisionNacional.numeroTitulo),
    Boolean(reqs.resolucionEscalafon.archivoUrl || reqs.resolucionEscalafon.numeroResolucion),
    Boolean(reqs.boletaPago.archivoUrl || reqs.boletaPago.numeroItem),
    reqs.titularPorAntiguedad.esTitularPorAntiguedad
      ? Boolean(reqs.titularPorAntiguedad.archivoUrl || reqs.titularPorAntiguedad.numeroResolucionSuprema)
      : true,
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto">
        {/* Cabecera del modal */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Expediente y Legajo Oficial del Docente
              </h2>
              <p className="text-xs text-slate-300">
                Verificación de Requisitos bajo Normativa de Educación del Estado Plurinacional de Bolivia
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Boton
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1 h-8"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </Boton>
            <button
              type="button"
              onClick={onCerrar}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ficha Resumen del Docente */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            {reqs.fotoPerfil ? (
              <img
                src={reqs.fotoPerfil}
                alt={docente.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-brand-600 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-800 font-bold text-lg flex items-center justify-center border-2 border-brand-200">
                {docente.firstName[0]}
                {docente.lastName[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">
                  {docente.firstName} {docente.lastName}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                  {docente.specialty}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span>
                  <strong>C.I.:</strong> {docente.ci}
                </span>
                <span>
                  <strong>RDA:</strong> {reqs.rda.numeroRda || <span className="text-slate-400">Sin registrar</span>}
                </span>
                <span>
                  <strong>Ítem:</strong> {docente.itemNumber || <span className="text-slate-400">Sin asignar</span>}
                </span>
                <span>
                  <strong>Escalafón:</strong> {reqs.rda.categoriaEscalafon}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold text-slate-600">Estado del Legajo:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${totalCompletados >= 4
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
            >
              <CheckCircle2 className="w-4 h-4" /> {totalCompletados}/5 Requisitos Registrados
            </span>
          </div>
        </div>

        {/* Contenido scrolleable con los 5 bloques */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* 1. RDA */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    1. Registro Docente Administrativo (RDA)
                  </h4>
                  <p className="text-xs text-slate-500">Historial centralizado y extracto oficial</p>
                </div>
              </div>
              {reqs.rda.archivoUrl ? (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto / Documento Adjunto
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  Sin documento adjunto
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Número de RDA:</span>
                <span className="font-semibold text-slate-800 text-sm">{reqs.rda.numeroRda || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Categoría de Escalafón:</span>
                <span className="font-semibold text-slate-800">{reqs.rda.categoriaEscalafon || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Años de Servicio (Antigüedad):</span>
                <span className="font-semibold text-slate-800">{reqs.rda.anosServicio ? `${reqs.rda.anosServicio} años` : '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-500 block">Formación Académica en RDA:</span>
                <span className="font-semibold text-slate-800">{reqs.rda.formacionAcademica || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Carga Horaria:</span>
                <span className="font-semibold text-slate-800">{reqs.rda.cargaHoraria || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-3">
                <span className="text-slate-500 block">Unidad Educativa / Distrito:</span>
                <span className="font-semibold text-slate-800">{reqs.rda.unidadEducativaDistrito || '—'}</span>
              </div>
            </div>

            {reqs.rda.archivoUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Archivo: <strong>{reqs.rda.nombreArchivo || 'Extracto_RDA'}</strong>
                </span>
                {reqs.rda.archivoUrl.startsWith('data:application/pdf;base64,') ? (
                  <button
                    type="button"
                    onClick={() => {
                      void descargarArchivoAdjunto(
                        reqs.rda.archivoUrl!,
                        reqs.rda.nombreArchivo || 'respaldo-rda.pdf',
                      )
                        .then(() => setErrorDescargaRda(null))
                        .catch(() => {
                          setErrorDescargaRda('No se pudo descargar el respaldo del RDA.');
                        });
                    }}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Descargar PDF para revisar
                  </button>
                ) : onVerImagenCompleta ? (
                  <button
                    type="button"
                    onClick={() => onVerImagenCompleta(reqs.rda.archivoUrl!, 'Registro Docente Administrativo (RDA)')}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver imagen completa
                  </button>
                ) : null}
              </div>
            )}
            {errorDescargaRda && (
              <p role="alert" className="mt-2 text-xs text-rose-700">{errorDescargaRda}</p>
            )}
          </div>

          {/* 2. TÍTULO EN PROVISIÓN NACIONAL */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    2. Título Profesional de Maestro/a (Título en Provisión Nacional)
                  </h4>
                  <p className="text-xs text-slate-500">Acreditación pedagógica de Escuela Normal / ESFM</p>
                </div>
              </div>
              {reqs.tituloProvisionNacional.archivoUrl ? (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto / Documento Adjunto
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Sin documento adjunto
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Número de T.P.N.:</span>
                <span className="font-semibold text-slate-800 text-sm">{reqs.tituloProvisionNacional.numeroTitulo || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Año de Graduación:</span>
                <span className="font-semibold text-slate-800">{reqs.tituloProvisionNacional.anoEmision || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Condición:</span>
                <span className="font-semibold text-emerald-700">
                  {reqs.tituloProvisionNacional.tieneTitulo ? 'Título Vigente' : 'En trámite'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-500 block">Institución Emisora (ESFM / Normal):</span>
                <span className="font-semibold text-slate-800">{reqs.tituloProvisionNacional.institucionEmisora || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Especialidad:</span>
                <span className="font-semibold text-slate-800">{reqs.tituloProvisionNacional.especialidadMencion || '—'}</span>
              </div>
            </div>

            {reqs.tituloProvisionNacional.archivoUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Archivo: <strong>{reqs.tituloProvisionNacional.nombreArchivo || 'Titulo_Provision_Nacional'}</strong>
                </span>
                {onVerImagenCompleta && (
                  <button
                    type="button"
                    onClick={() => onVerImagenCompleta(reqs.tituloProvisionNacional.archivoUrl!, 'Título en Provisión Nacional')}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver imagen completa
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. RESOLUCIÓN ESCALAFÓN */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    3. Resolución Administrativa de Inscripción en el Escalafón
                  </h4>
                  <p className="text-xs text-slate-500">Incorporación formal al magisterio nacional y derechos laborales</p>
                </div>
              </div>
              {reqs.resolucionEscalafon.archivoUrl ? (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto / Documento Adjunto
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Sin documento adjunto
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Número de R.A.:</span>
                <span className="font-semibold text-slate-800 text-sm">{reqs.resolucionEscalafon.numeroResolucion || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Fecha de Resolución:</span>
                <span className="font-semibold text-slate-800">{reqs.resolucionEscalafon.fechaResolucion || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Categoría Ingreso:</span>
                <span className="font-semibold text-slate-800">{reqs.resolucionEscalafon.categoriaIngreso || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Libro de Registro:</span>
                <span className="font-semibold text-slate-800">{reqs.resolucionEscalafon.libroRegistro || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Folio de Registro:</span>
                <span className="font-semibold text-slate-800">{reqs.resolucionEscalafon.folioRegistro || '—'}</span>
              </div>
            </div>

            {reqs.resolucionEscalafon.archivoUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Archivo: <strong>{reqs.resolucionEscalafon.nombreArchivo || 'Resolucion_Escalafon'}</strong>
                </span>
                {onVerImagenCompleta && (
                  <button
                    type="button"
                    onClick={() => onVerImagenCompleta(reqs.resolucionEscalafon.archivoUrl!, 'Resolución de Escalafón')}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver imagen completa
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. BOLETA MECANIZADA */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    4. Boleta de Pago Mecanizada (Maestro en Ejercicio)
                  </h4>
                  <p className="text-xs text-slate-500">Prueba emitida por el Ministerio de Economía y Finanzas Públicas</p>
                </div>
              </div>
              {reqs.boletaPago.archivoUrl ? (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto / Documento Adjunto
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Sin documento adjunto
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Número de Ítem:</span>
                <span className="font-semibold text-slate-800 text-sm">{reqs.boletaPago.numeroItem || docente.itemNumber || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Periodo de Boleta:</span>
                <span className="font-semibold text-slate-800">{reqs.boletaPago.periodoBoleta || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Estado Fiscal:</span>
                <span className="font-semibold text-amber-800">{reqs.boletaPago.aplicaBoleta ? 'En Ejercicio Activo' : 'No Aplica'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
                <span className="text-slate-500 block">Distrito / Entidad Fiscal:</span>
                <span className="font-semibold text-slate-800">{reqs.boletaPago.distritoFiscal || '—'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-3">
                <span className="text-slate-500 block">Bonos Percibidos en Boleta:</span>
                <span className="font-semibold text-slate-800">{reqs.boletaPago.bonosPercibidos || '—'}</span>
              </div>
            </div>

            {reqs.boletaPago.archivoUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Archivo: <strong>{reqs.boletaPago.nombreArchivo || 'Boleta_Mecanizada'}</strong>
                </span>
                {onVerImagenCompleta && (
                  <button
                    type="button"
                    onClick={() => onVerImagenCompleta(reqs.boletaPago.archivoUrl!, 'Boleta de Pago Mecanizada')}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver imagen completa
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 5. TITULAR POR ANTIGÜEDAD */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    5. Título de "Titular por Antigüedad" (Casos excepcionales e interinos)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Resolución Suprema que certifica 10 años de servicio docente y examen de capacidad
                  </p>
                </div>
              </div>
              {reqs.titularPorAntiguedad.esTitularPorAntiguedad ? (
                <span className="text-xs font-medium text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                  Condición Aplica
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  No Aplica (Normalista Titular)
                </span>
              )}
            </div>

            {reqs.titularPorAntiguedad.esTitularPorAntiguedad ? (
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Resolución Suprema N°:</span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {reqs.titularPorAntiguedad.numeroResolucionSuprema || '—'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Fecha de Resolución:</span>
                  <span className="font-semibold text-slate-800">
                    {reqs.titularPorAntiguedad.fechaResolucion || '—'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Años Demostrados:</span>
                  <span className="font-semibold text-slate-800">
                    {reqs.titularPorAntiguedad.anosAcreditados ? `${reqs.titularPorAntiguedad.anosAcreditados} años` : '—'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Profesión / Grado de Origen:</span>
                  <span className="font-semibold text-slate-800">
                    {reqs.titularPorAntiguedad.profesionOrigen || '—'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded">
                Docente titulado por Escuela Superior de Formación de Maestros (ESFM). No requiere trámite de titularidad por antigüedad.
              </p>
            )}

            {reqs.titularPorAntiguedad.archivoUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Archivo: <strong>{reqs.titularPorAntiguedad.nombreArchivo || 'Resolucion_Suprema_Titularidad'}</strong>
                </span>
                {onVerImagenCompleta && (
                  <button
                    type="button"
                    onClick={() =>
                      onVerImagenCompleta(
                        reqs.titularPorAntiguedad.archivoUrl!,
                        'Resolución de Titular por Antigüedad',
                      )
                    }
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver imagen completa
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            SIGCE · Sistema Integral de Gestión y Control Educativo
          </p>
          <Boton type="button" onClick={onCerrar} className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
            Cerrar Expediente
          </Boton>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal Visor de Imagen / Documento a pantalla completa
 */
export function VisorImagenCompletaModal({
  url,
  titulo,
  onCerrar,
}: {
  url: string;
  titulo: string;
  onCerrar: () => void;
}) {
  const esPdf = url.startsWith('data:application/pdf');

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
          <h3 className="text-sm font-semibold truncate pr-4">{titulo}</h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download={`${titulo.toLowerCase().replace(/\s+/g, '_')}.jpg`}
              className="p-1 rounded text-slate-300 hover:text-white"
              title="Descargar imagen"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onCerrar}
              className="p-1 rounded text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-100 min-h-[350px]">
          {esPdf ? (
            <iframe src={url} className="w-full h-[70vh] border-0 rounded" title={titulo} />
          ) : (
            <img src={url} alt={titulo} className="max-h-[75vh] w-auto object-contain rounded shadow" />
          )}
        </div>
      </div>
    </div>
  );
}
