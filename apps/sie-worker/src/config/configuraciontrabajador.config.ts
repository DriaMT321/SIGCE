import * as dotenv from 'dotenv';

dotenv.config();

export function leerenteroconfiguraciontrabajador(
  nombre: string,
  valor: string | undefined,
  valorpredeterminado: number,
  minimo: number,
  maximo: number,
): number {
  const valorsinprocesar = valor?.trim() || String(valorpredeterminado);
  if (!/^\d+$/.test(valorsinprocesar)) throw new Error(`${nombre} debe ser un número entero`);
  const numerovalidado = Number(valorsinprocesar);
  if (!Number.isSafeInteger(numerovalidado) || numerovalidado < minimo || numerovalidado > maximo) {
    throw new Error(`${nombre} debe estar entre ${minimo} y ${maximo}`);
  }
  return numerovalidado;
}

export function leertasaconfiguraciontrabajador(
  nombre: string,
  valor: string | undefined,
  valorpredeterminado: number,
): number {
  const valorsinprocesar = valor?.trim() || String(valorpredeterminado);
  const tasavalidada = Number(valorsinprocesar);
  if (!Number.isFinite(tasavalidada) || tasavalidada <= 0 || tasavalidada > 1) {
    throw new Error(`${nombre} debe estar entre 0 y 1, sin incluir 0`);
  }
  return tasavalidada;
}

export function leerbooleanoconfiguraciontrabajador(
  nombre: string,
  valor: string | undefined,
  valorpredeterminado: boolean,
): boolean {
  const limpio = valor?.trim().toLowerCase();
  if (!limpio) return valorpredeterminado;
  if (['true', '1', 'yes', 'si'].includes(limpio)) return true;
  if (['false', '0', 'no'].includes(limpio)) return false;
  throw new Error(`${nombre} debe ser true o false`);
}

export function leerurloficialsie(valor: string | undefined): string {
  const configurada = valor?.trim() || 'https://academico.sie.gob.bo';
  try {
    const url = new URL(configurada);
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'academico.sie.gob.bo' ||
      url.port ||
      url.username ||
      url.password ||
      (url.pathname !== '/' && url.pathname !== '') ||
      url.search ||
      url.hash
    ) {
      throw new Error('destino no oficial');
    }
    return url.origin;
  } catch {
    throw new Error('SIE_BASE_URL debe ser el origen HTTPS oficial https://academico.sie.gob.bo');
  }
}

/**
 * Formato `1:6,2:7,3:8`: número de período local -> idNotaTipo del SIE. El documento técnico
 * solo confirma el período 1 (tipo 6); los demás deben configurarse tras verificarlos.
 */
export function leermapanotassie(valor: string | undefined): Record<number, number> {
  const configurado = valor?.trim();
  if (!configurado) return { 1: 6 };
  const mapa: Record<number, number> = {};
  for (const par of configurado.split(',')) {
    const [periodo, tipo] = par.split(':').map((parte) => parte.trim());
    if (!/^\d+$/.test(periodo ?? '') || !/^\d+$/.test(tipo ?? '')) {
      throw new Error('SIE_PERIOD_NOTE_TYPE_MAP debe usar el formato 1:6,2:7');
    }
    const numeroperiodo = Number(periodo);
    const numerotipo = Number(tipo);
    if (numeroperiodo < 1 || numeroperiodo > 10 || numerotipo < 1 || numerotipo > 100) {
      throw new Error('SIE_PERIOD_NOTE_TYPE_MAP contiene un período o tipo fuera de rango');
    }
    mapa[numeroperiodo] = numerotipo;
  }
  return mapa;
}

export function leeraliassie(valor: string | undefined): Record<string, string> {
  const configurado = valor?.trim();
  if (!configurado) return {};
  let parseado: unknown;
  try {
    parseado = JSON.parse(configurado);
  } catch {
    throw new Error('SIE_SUBJECT_ALIASES debe ser un objeto JSON válido');
  }
  if (!parseado || typeof parseado !== 'object' || Array.isArray(parseado)) {
    throw new Error('SIE_SUBJECT_ALIASES debe ser un objeto JSON de alias');
  }
  const alias: Record<string, string> = {};
  for (const [clave, contenido] of Object.entries(parseado)) {
    if (typeof contenido !== 'string' || !contenido.trim()) {
      throw new Error('Cada alias de SIE_SUBJECT_ALIASES debe ser un texto no vacío');
    }
    if (clave.trim()) alias[clave.trim()] = contenido.trim();
  }
  return alias;
}

const configuracionrealhabilitada = leerbooleanoconfiguraciontrabajador(
  'SIE_REAL_ACCESS_ENABLED',
  process.env.SIE_REAL_ACCESS_ENABLED,
  false,
);
const escriturarealhabilitada = leerbooleanoconfiguraciontrabajador(
  'SIE_REAL_WRITE_ENABLED',
  process.env.SIE_REAL_WRITE_ENABLED,
  false,
);
if (escriturarealhabilitada && !configuracionrealhabilitada) {
  throw new Error('SIE_REAL_WRITE_ENABLED requiere SIE_REAL_ACCESS_ENABLED=true');
}

const datosaccesorealsie = (() => {
  const usuario = process.env.SIE_USERNAME?.trim() || undefined;
  const contrasena = process.env.SIE_PASSWORD || undefined;
  const codigosie = process.env.SIE_TEACHER_CODE?.trim() || undefined;
  const iecid = process.env.SIE_IEC_ID
    ? leerenteroconfiguraciontrabajador('SIE_IEC_ID', process.env.SIE_IEC_ID, 1, 1, 2147483647)
    : undefined;
  if (configuracionrealhabilitada) {
    const faltantes = [
      ['SIE_USERNAME', usuario],
      ['SIE_PASSWORD', contrasena],
      ['SIE_TEACHER_CODE', codigosie],
      ['SIE_IEC_ID', iecid],
    ]
      .filter(([, valor]) => !valor)
      .map(([nombre]) => nombre);
    if (faltantes.length > 0) {
      throw new Error(`La integración real SIE requiere: ${faltantes.join(', ')}`);
    }
  }
  return { usuario, contrasena, codigosie, iecid };
})();

export const configuraciontrabajador = {
  redis: (() => {
    let servidor = process.env.REDIS_HOST || process.env.REDISHOST || 'localhost';
    let puerto = leerenteroconfiguraciontrabajador(
      'REDIS_PORT/REDISPORT',
      process.env.REDIS_PORT || process.env.REDISPORT,
      6379,
      1,
      65535,
    );
    let contrasena = process.env.REDIS_PASSWORD || process.env.REDISPASSWORD || undefined;
    const tlsconfigurada = process.env.REDIS_TLS?.trim().toLowerCase();
    if (tlsconfigurada && !['true', 'false'].includes(tlsconfigurada)) {
      throw new Error('REDIS_TLS debe ser true o false');
    }
    let usartls = tlsconfigurada === 'true';

    if (process.env.REDIS_URL) {
      let urlredis: URL;
      try {
        urlredis = new URL(process.env.REDIS_URL);
      } catch {
        throw new Error('REDIS_URL debe ser una URL válida');
      }
      if (!['redis:', 'rediss:'].includes(urlredis.protocol) || !urlredis.hostname) {
        throw new Error('REDIS_URL debe usar el protocolo redis o rediss y definir un host');
      }
      servidor = urlredis.hostname;
      puerto = leerenteroconfiguraciontrabajador(
        'puerto de REDIS_URL',
        urlredis.port,
        6379,
        1,
        65535,
      );
      contrasena = urlredis.password || undefined;
      const urlcontls = urlredis.protocol === 'rediss:';
      if ((tlsconfigurada === 'true' && !urlcontls) || (tlsconfigurada === 'false' && urlcontls)) {
        throw new Error('REDIS_TLS debe coincidir con el protocolo de REDIS_URL');
      }
      usartls = urlcontls;
    }

    if (process.env.NODE_ENV === 'production' && (!usartls || !contrasena)) {
      throw new Error('En producción Redis requiere TLS y una contraseña configurada');
    }

    return { servidor, puerto, contrasena, usartls };
  })(),
  sie: {
    sininterfazgrafica: process.env.SIE_HEADLESS !== 'false',
    modo: configuracionrealhabilitada ? ('real' as const) : ('local' as const),
    fuente: configuracionrealhabilitada ? ('SIE_REAL' as const) : ('LOCAL_SIE_SIMULATION' as const),
    accesoRealHabilitado: configuracionrealhabilitada,
    escrituraRealHabilitada: escriturarealhabilitada,
    baseurl: leerurloficialsie(process.env.SIE_BASE_URL),
    credenciales: datosaccesorealsie,
    nivelId: leerenteroconfiguraciontrabajador(
      'SIE_NIVEL_ID',
      process.env.SIE_NIVEL_ID,
      13,
      1,
      999,
    ),
    nivelNombre: process.env.SIE_NIVEL_NAME?.trim() || 'Secundaria Comunitaria Productiva',
    nivelPrimariaId: process.env.SIE_PRIMARY_NIVEL_ID
      ? leerenteroconfiguraciontrabajador(
          'SIE_PRIMARY_NIVEL_ID',
          process.env.SIE_PRIMARY_NIVEL_ID,
          12,
          1,
          999,
        )
      : undefined,
    nivelPrimariaNombre:
      process.env.SIE_PRIMARY_NIVEL_NAME?.trim() || 'Primaria Comunitaria Vocacional',
    cicloId: leerenteroconfiguraciontrabajador(
      'SIE_CICLO_ID',
      process.env.SIE_CICLO_ID,
      1,
      1,
      99,
    ),
    idiomaId: leerenteroconfiguraciontrabajador(
      'SIE_IDIOMA_ID',
      process.env.SIE_IDIOMA_ID,
      48,
      1,
      999,
    ),
    tiempomaximoms: leerenteroconfiguraciontrabajador(
      'SIE_SYNC_TIMEOUT_MS',
      process.env.SIE_SYNC_TIMEOUT_MS,
      30000,
      1000,
      300000,
    ),
    plantillanotas: process.env.SIE_NOTE_TEMPLATE?.trim() || 'newTemplateDB',
    tiponotaporperiodo: leermapanotassie(process.env.SIE_PERIOD_NOTE_TYPE_MAP),
    aliasasignaturas: leeraliassie(process.env.SIE_SUBJECT_ALIASES),
    permitircoincidenciaaproximada: leerbooleanoconfiguraciontrabajador(
      'SIE_ALLOW_FUZZY_SUBJECT_MATCH',
      process.env.SIE_ALLOW_FUZZY_SUBJECT_MATCH,
      false,
    ),
    selectoreslogin: {
      usuario: process.env.SIE_LOGIN_USER_SELECTOR?.trim() || undefined,
      contrasena: process.env.SIE_LOGIN_PASSWORD_SELECTOR?.trim() || undefined,
      enviar: process.env.SIE_LOGIN_SUBMIT_SELECTOR?.trim() || undefined,
    },
    rutapaginareplicalocal: (() => {
      const ruta = process.env.SIE_LOCAL_REPLICA_PATH?.trim();
      if (ruta && process.env.NODE_ENV === 'production') {
        throw new Error('SIE_LOCAL_REPLICA_PATH solo puede usarse fuera de producción');
      }
      return ruta || undefined;
    })(),
    umbralpausadiscrepancias: leertasaconfiguraciontrabajador(
      'SIE_SYNC_DISCREPANCY_THRESHOLD',
      process.env.SIE_SYNC_DISCREPANCY_THRESHOLD,
      0.2,
    ),
    plazorevisiondiscrepanciashoras: leerenteroconfiguraciontrabajador(
      'SIE_DISCREPANCY_DEADLINE_HOURS',
      process.env.SIE_DISCREPANCY_DEADLINE_HOURS,
      72,
      1,
      720,
    ),
  },
  nombrecola: 'sie-synchronization',
};
