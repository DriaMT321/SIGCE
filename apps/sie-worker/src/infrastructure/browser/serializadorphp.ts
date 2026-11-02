/**
 * Serializador mínimo del formato nativo de PHP (`serialize()`), necesario porque el SIE
 * recibe el parámetro `infoUe` como un array PHP serializado y URL-encoded. Los contadores
 * `s:N:` se calculan sobre bytes UTF-8, no sobre caracteres.
 */
export type valorphp =
  | string
  | number
  | boolean
  | null
  | valorphp[]
  | { [clave: string]: valorphp };

export function serializarphp(valor: valorphp): string {
  if (valor === null) return 'N;';

  if (typeof valor === 'boolean') return `b:${valor ? 1 : 0};`;

  if (typeof valor === 'number') {
    if (!Number.isFinite(valor)) {
      throw new Error('No se puede serializar un número no finito para el SIE');
    }
    return Number.isInteger(valor) ? `i:${valor};` : `d:${String(valor)};`;
  }

  if (typeof valor === 'string') {
    return `s:${Buffer.byteLength(valor, 'utf8')}:"${valor}";`;
  }

  if (Array.isArray(valor)) {
    const elementos = valor.map((elemento, indice) => {
      return `i:${indice};${serializarphp(elemento)}`;
    });
    return `a:${valor.length}:{${elementos.join('')}}`;
  }

  const entradas = Object.entries(valor);
  const elementos = entradas.map(([clave, contenido]) => {
    return `${serializarphp(clave)}${serializarphp(contenido)}`;
  });
  return `a:${entradas.length}:{${elementos.join('')}}`;
}

export interface datosinfoue {
  nivel: string;
  grado: string;
  paralelo: string;
  turno: string;
  paraleloId: string;
  turnoId: number;
  nivelId: number;
  gradoId: number;
  cicloId: number;
  iecId: number;
  sie: string;
  gestion: string;
  swRegisterCalifications?: boolean;
  swRegisterPersonBjp?: boolean;
}

/**
 * Construye `infoUe` con el mismo orden de claves observado en el portal. El orden no es
 * semánticamente relevante para `unserialize()`, pero conservarlo facilita comparar capturas.
 */
export function construirinfoue(datos: datosinfoue): string {
  return serializarphp({
    ueducativaInfo: {
      nivel: datos.nivel,
      grado: datos.grado,
      paralelo: datos.paralelo,
      turno: datos.turno,
    },
    ueducativaInfoId: {
      paraleloId: datos.paraleloId,
      turnoId: datos.turnoId,
      nivelId: datos.nivelId,
      gradoId: datos.gradoId,
      cicloId: datos.cicloId,
      iecId: datos.iecId,
    },
    requestUser: {
      sie: datos.sie,
      gestion: datos.gestion,
      swRegisterCalifications: datos.swRegisterCalifications ?? true,
      swRegisterPersonBjp: datos.swRegisterPersonBjp ?? true,
    },
  });
}

export function codificarinfoue(datos: datosinfoue): string {
  return encodeURIComponent(construirinfoue(datos));
}
