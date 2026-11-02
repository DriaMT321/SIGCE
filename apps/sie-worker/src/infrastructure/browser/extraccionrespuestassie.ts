export type jsonvalor =
  null | boolean | number | string | jsonvalor[] | { [clave: string]: jsonvalor };

export interface estudiantesie {
  id: string | null;
  rude: string;
  carnet: string | null;
  idinscripcion: string | null;
  nombrecompleto: string;
  grado: string | null;
  paralelo: string | null;
  nivel: string | null;
  estadomatricula: number | null;
  crudo: Record<string, jsonvalor>;
}

export interface filanotasie {
  idEstudianteNota: string | null;
  idNotaTipo: number | null;
  idEstudianteAsignatura: string | null;
  nota: number;
  asignatura: string | null;
  tipoNotaNombre: string | null;
}

export type resultadobusquedaestudiante =
  { encontrado: true; estudiante: estudiantesie } | { encontrado: false; motivo: string };

export type resultadobusquedaasignatura =
  { encontrado: true; fila: filanotasie } | { encontrado: false; motivo: string };

const clavesrude = ['codigorude', 'rude', 'codigoderude'];
const clavesidestudiante = ['id', 'idestudiante', 'estudianteid'];
const clavescarnet = ['carnetidentidad', 'carnet', 'ci', 'cedulaidentidad'];
const claveseinscripcion = ['einsid', 'idinscripcion', 'inscripcionid', 'idmatricula'];
const clavesgrado = ['grado', 'gradonombre'];
const clavesparalelo = ['paralelo', 'seccion'];
const clavesnivel = ['nivel', 'nivelnombre'];
const clavesestadomatricula = ['estadomatriculaid', 'estadomatricula'];
const clavesasignatura = [
  'asignatura',
  'nombreasignatura',
  'nombremateria',
  'materia',
  'descripcionasignatura',
  'areacurricular',
  'area',
];
const clavesidasignatura = [
  'idestudianteasignatura',
  'idasignatura',
  'asignaturaid',
  'idmateria',
  'materiaid',
];
const clavesidnota = ['idestudiantenota', 'idnota', 'notaid', 'idregistronota'];
const clavesidnotatipo = ['idnotatipo', 'notatipoid', 'tiponotaid', 'idtiponota'];
const clavesnotatiponombre = ['notatipo', 'tiponota', 'nombrenotatipo', 'periodo', 'trimestre'];
const clavesnota = ['nota', 'valor', 'calificacion', 'notafinal'];

export function normalizarclave(clave: string): string {
  return clave
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function normalizartexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function esobjeto(valor: jsonvalor | undefined): valor is Record<string, jsonvalor> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function buscarvalor(
  objeto: Record<string, jsonvalor>,
  claves: ReadonlyArray<string>,
): jsonvalor | undefined {
  const buscadas = new Set(claves.map(normalizarclave));
  for (const [clave, valor] of Object.entries(objeto)) {
    if (buscadas.has(normalizarclave(clave)) && valor !== undefined) return valor;
  }
  return undefined;
}

function comoTexto(valor: jsonvalor | undefined): string | null {
  if (typeof valor === 'string') {
    const limpio = valor.trim();
    return limpio ? limpio : null;
  }
  if (typeof valor === 'number' && Number.isFinite(valor)) return String(valor);
  return null;
}

function comoNumero(valor: jsonvalor | undefined): number | null {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;
  if (typeof valor !== 'string') return null;
  const limpio = valor.trim().replace(',', '.');
  if (!limpio || !/^-?\d+(\.\d+)?$/.test(limpio)) return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

function nombreasignaturade(objeto: Record<string, jsonvalor>): string | null {
  const directo = comoTexto(buscarvalor(objeto, clavesasignatura));
  if (directo) return directo;
  const anidada = buscarvalor(objeto, ['asignatura', 'materia']);
  if (esobjeto(anidada)) {
    return comoTexto(buscarvalor(anidada, ['nombre', 'descripcion', 'nombreasignatura']));
  }
  return null;
}

export function extraerestudiantesie(respuesta: jsonvalor): estudiantesie[] {
  const estudiantes: estudiantesie[] = [];

  const visitar = (valor: jsonvalor): void => {
    if (Array.isArray(valor)) {
      for (const elemento of valor) visitar(elemento);
      return;
    }
    if (!esobjeto(valor)) return;

    const rude = comoTexto(buscarvalor(valor, clavesrude));
    if (rude) {
      const id = comoTexto(buscarvalor(valor, clavesidestudiante));
      const idinscripcion = comoTexto(buscarvalor(valor, claveseinscripcion));
      const duplicado = estudiantes.some((estudiante) => {
        if (estudiante.rude.trim().toUpperCase() !== rude.trim().toUpperCase()) return false;
        const mismapersona = Boolean(id && estudiante.id && id === estudiante.id);
        const mismainscripcion = Boolean(
          idinscripcion && estudiante.idinscripcion && idinscripcion === estudiante.idinscripcion,
        );
        const idscompatibles = !id || !estudiante.id || id === estudiante.id;
        const inscripcionescompatibles =
          !idinscripcion || !estudiante.idinscripcion || idinscripcion === estudiante.idinscripcion;
        return (mismapersona || mismainscripcion) && idscompatibles && inscripcionescompatibles;
      });
      if (!duplicado) {
        const paterno = comoTexto(buscarvalor(valor, ['paterno', 'apellidopaterno'])) ?? '';
        const materno = comoTexto(buscarvalor(valor, ['materno', 'apellidomaterno'])) ?? '';
        const nombre = comoTexto(buscarvalor(valor, ['nombre', 'nombres', 'primernombre'])) ?? '';
        const nombrecompleto =
          comoTexto(buscarvalor(valor, ['nombrecompleto', 'nombrescompletos'])) ??
          [nombre, paterno, materno].filter(Boolean).join(' ').trim();
        estudiantes.push({
          id,
          rude,
          carnet: comoTexto(buscarvalor(valor, clavescarnet)),
          idinscripcion,
          nombrecompleto,
          grado: comoTexto(buscarvalor(valor, clavesgrado)),
          paralelo: comoTexto(buscarvalor(valor, clavesparalelo)),
          nivel: comoTexto(buscarvalor(valor, clavesnivel)),
          estadomatricula: comoNumero(buscarvalor(valor, clavesestadomatricula)),
          crudo: valor,
        });
      }
    }

    for (const hijo of Object.values(valor)) {
      if (esobjeto(hijo) || Array.isArray(hijo)) visitar(hijo);
    }
  };

  visitar(respuesta);
  return estudiantes;
}

export function buscarestudiante(
  estudiantes: ReadonlyArray<estudiantesie>,
  rude: string,
): resultadobusquedaestudiante {
  const buscado = rude.trim().toUpperCase();
  const coincidencias = estudiantes.filter(
    (estudiante) => estudiante.rude.trim().toUpperCase() === buscado,
  );
  if (coincidencias.length === 0) {
    return { encontrado: false, motivo: 'El RUDE no aparece en la lista de estudiantes del SIE' };
  }
  if (coincidencias.length > 1) {
    return {
      encontrado: false,
      motivo: 'La lista del SIE devolvió más de un estudiante para el mismo RUDE',
    };
  }
  return { encontrado: true, estudiante: coincidencias[0] };
}

function construirfila(
  objeto: Record<string, jsonvalor>,
  contextoAsignatura: string | null,
): filanotasie | null {
  const valor = buscarvalor(objeto, clavesnota);
  const nota = comoNumero(valor);
  if (nota === null || nota < 0 || nota > 100) return null;

  const idEstudianteNota = comoTexto(buscarvalor(objeto, clavesidnota));
  const idEstudianteAsignatura = comoTexto(buscarvalor(objeto, clavesidasignatura));
  const idNotaTipo = comoNumero(buscarvalor(objeto, clavesidnotatipo));
  const asignatura = nombreasignaturade(objeto) ?? contextoAsignatura;

  if (!idEstudianteNota && !idEstudianteAsignatura && !asignatura) return null;

  return {
    idEstudianteNota,
    idNotaTipo,
    idEstudianteAsignatura,
    nota,
    asignatura,
    tipoNotaNombre: comoTexto(buscarvalor(objeto, clavesnotatiponombre)),
  };
}

export function extraerfilasnotasie(respuesta: jsonvalor): filanotasie[] {
  const filas: filanotasie[] = [];
  const vistos = new Set<string>();

  const agregar = (fila: filanotasie): void => {
    const clave = [
      fila.idEstudianteNota ?? '',
      fila.idNotaTipo ?? '',
      fila.idEstudianteAsignatura ?? '',
      fila.asignatura ? normalizartexto(fila.asignatura) : '',
      fila.nota,
    ].join('|');
    if (vistos.has(clave)) return;
    vistos.add(clave);
    filas.push(fila);
  };

  const visitar = (valor: jsonvalor, contextoAsignatura: string | null): void => {
    if (Array.isArray(valor)) {
      for (const elemento of valor) visitar(elemento, contextoAsignatura);
      return;
    }
    if (!esobjeto(valor)) return;

    const propia = nombreasignaturade(valor) ?? contextoAsignatura;
    const fila = construirfila(valor, propia);
    if (fila) agregar(fila);

    for (const hijo of Object.values(valor)) {
      if (esobjeto(hijo) || Array.isArray(hijo)) visitar(hijo, propia);
    }
  };

  visitar(respuesta, null);
  return filas;
}

export interface criterioasignatura {
  nombre: string;
  codigo?: string;
  aliassie?: Readonly<Record<string, string>>;
}

function resolveralias(criterio: criterioasignatura): {
  porId: string | null;
  porNombre: string | null;
} {
  if (!criterio.aliassie) return { porId: null, porNombre: null };
  for (const clave of [criterio.codigo, criterio.nombre]) {
    if (!clave) continue;
    for (const [alias, valor] of Object.entries(criterio.aliassie)) {
      if (normalizarclave(alias) !== normalizarclave(clave)) continue;
      const limpio = valor.trim();
      if (!limpio) continue;
      if (/^\d+$/.test(limpio)) return { porId: limpio, porNombre: null };
      return { porId: null, porNombre: limpio };
    }
  }
  return { porId: null, porNombre: null };
}

export function seleccionarfilaasignatura(
  filas: ReadonlyArray<filanotasie>,
  criterio: criterioasignatura,
  tiponota: number,
  opciones: { permitiraproximada?: boolean } = {},
): resultadobusquedaasignatura {
  const contestadotipo = filas.filter((fila) => fila.idNotaTipo !== null);
  const candidatas =
    contestadotipo.length > 0 ? filas.filter((fila) => fila.idNotaTipo === tiponota) : [...filas];
  if (candidatas.length === 0) {
    return {
      encontrado: false,
      motivo: `El SIE no devolvió notas para el tipo de período ${tiponota}`,
    };
  }

  const alias = resolveralias(criterio);
  if (alias.porId) {
    const pormid = candidatas.filter((fila) => fila.idEstudianteAsignatura?.trim() === alias.porId);
    if (pormid.length === 1) return { encontrado: true, fila: pormid[0] };
    if (pormid.length > 1) {
      return { encontrado: false, motivo: 'El alias SIE de la asignatura es ambiguo' };
    }
    return {
      encontrado: false,
      motivo: 'El ID de asignatura configurado no aparece en las notas del SIE',
    };
  }

  const nombresbuscados = [
    alias.porNombre ?? criterio.nombre,
    criterio.nombre,
    criterio.nombre.split(':').pop() ?? criterio.nombre,
  ]
    .map(normalizartexto)
    .filter(Boolean);

  for (const nombrebuscado of nombresbuscados) {
    const exactas = candidatas.filter(
      (fila) => fila.asignatura && normalizartexto(fila.asignatura) === nombrebuscado,
    );
    if (exactas.length === 1) return { encontrado: true, fila: exactas[0] };
    if (exactas.length > 1) {
      return {
        encontrado: false,
        motivo: 'El SIE devolvió más de una nota para la misma asignatura y período',
      };
    }
  }

  if (opciones.permitiraproximada) {
    const tokens = normalizartexto(criterio.nombre)
      .split(' ')
      .filter((token) => token.length >= 4);
    if (tokens.length > 0) {
      const aproximadas = candidatas.filter((fila) => {
        if (!fila.asignatura) return false;
        const tokenssie = new Set(normalizartexto(fila.asignatura).split(' '));
        return tokens.every((token) => tokenssie.has(token));
      });
      if (aproximadas.length === 1) return { encontrado: true, fila: aproximadas[0] };
      if (aproximadas.length > 1) {
        return {
          encontrado: false,
          motivo: 'La asignatura coincide parcialmente con varias notas del SIE',
        };
      }
    }
  }

  return {
    encontrado: false,
    motivo:
      'No se encontró la asignatura en las notas del SIE; configure un alias si el nombre oficial difiere',
  };
}

export interface solicitudactualizacionsie {
  infoue: string;
  estudiante: estudiantesie;
  fila: filanotasie;
  tiponota: number;
  nivel: number;
  gestion: number;
  nota: number;
  plantilla?: string;
}

export function construircuerpoactualizacionsie(
  solicitud: solicitudactualizacionsie,
): Array<[string, string]> {
  const { estudiante, fila } = solicitud;
  if (!estudiante.idinscripcion) {
    throw new Error('El estudiante del SIE no expone idInscripcion/eInsId');
  }
  if (!fila.idEstudianteNota) {
    throw new Error('La fila de nota del SIE no expone idEstudianteNota');
  }
  if (!fila.idEstudianteAsignatura) {
    throw new Error('La fila de nota del SIE no expone idEstudianteAsignatura');
  }
  if (!Number.isFinite(solicitud.nota) || solicitud.nota < 0 || solicitud.nota > 100) {
    throw new Error('La calificación local está fuera del rango 0..100');
  }

  return [
    ['infoUe', solicitud.infoue],
    ['infoStudent', JSON.stringify(estudiante.crudo)],
    ['tipoNota', solicitud.plantilla ?? 'newTemplateDB'],
    ['nivel', String(solicitud.nivel)],
    ['idInscripcion', estudiante.idinscripcion],
    ['gestion', String(solicitud.gestion)],
    ['idEstudianteNota[]', fila.idEstudianteNota],
    ['idNotaTipo[]', String(solicitud.tiponota)],
    ['idEstudianteAsignatura[]', fila.idEstudianteAsignatura],
    ['nota[]', String(solicitud.nota)],
  ];
}

function contienefallo(valor: jsonvalor, profundidad: number): boolean {
  if (profundidad > 5) return false;
  if (Array.isArray(valor))
    return valor.some((elemento) => contienefallo(elemento, profundidad + 1));
  if (!esobjeto(valor)) return false;

  for (const [clave, contenido] of Object.entries(valor)) {
    const claveNormalizada = normalizarclave(clave);
    if (
      ['success', 'exito', 'ok'].includes(claveNormalizada) &&
      (contenido === false || contenido === 0 || contenido === 'false')
    ) {
      return true;
    }
    if (['status', 'estado'].includes(claveNormalizada) && typeof contenido === 'string') {
      if (['error', 'failed', 'fail', 'denied'].includes(normalizarclave(contenido))) return true;
    }
    if (
      ['error', 'errors', 'errores', 'exception'].includes(claveNormalizada) &&
      contenido !== null &&
      contenido !== false &&
      contenido !== ''
    ) {
      return true;
    }
    if (contienefallo(contenido, profundidad + 1)) return true;
  }
  return false;
}

export function respuestaindicaerror(texto: string): boolean {
  const limpio = texto.trim();
  if (!limpio) return false;
  try {
    return contienefallo(JSON.parse(limpio) as jsonvalor, 0);
  } catch {
    return /\b(error|exception|denied|denegado|inv[aá]lido)\b/i.test(limpio);
  }
}
