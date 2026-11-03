import { isIP } from 'node:net';

export interface configuracionaplicacion {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    usarTLS: boolean;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  corsOrigins: string[];
  trustedProxyIps: string[];
  webCookieSameSite: 'lax' | 'strict' | 'none';
  sie: {
    baseUrl: string;
    headless: boolean;
    timeoutMs: number;
    realAuditEnabled: boolean;
  };
}

function exigirVariableEntorno(nombre: string): string {
  const valor = process.env[nombre]?.trim();
  if (!valor) {
    throw new Error(`Missing required environment variable: ${nombre}`);
  }
  return valor;
}

function leerEnteroEntorno(
  nombre: string,
  valor: string | undefined,
  valorPredeterminado: number,
  minimo: number,
  maximo: number,
): number {
  const valorSinProcesar = valor?.trim() || String(valorPredeterminado);
  if (!/^\d+$/.test(valorSinProcesar)) {
    throw new Error(`${nombre} debe ser un número entero`);
  }
  const urlAnalizada = Number(valorSinProcesar);
  if (!Number.isSafeInteger(urlAnalizada) || urlAnalizada < minimo || urlAnalizada > maximo) {
    throw new Error(`${nombre} debe estar entre ${minimo} y ${maximo}`);
  }
  return urlAnalizada;
}

export default (): configuracionaplicacion => {
  const entornoNodo = process.env.NODE_ENV || 'development';
  const origenesConfigurados = process.env.CORS_ORIGINS?.split(',')
    .map((origen) => origen.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const proxiesconfiables =
    process.env.TRUSTED_PROXY_IPS?.split(',')
      .map((direccion) => direccion.trim())
      .filter(Boolean) ?? [];
  if (proxiesconfiables.some((direccion) => isIP(direccion) === 0)) {
    throw new Error('TRUSTED_PROXY_IPS debe contener direcciones IP válidas separadas por comas');
  }
  if (entornoNodo === 'production' && !origenesConfigurados?.length) {
    throw new Error(
      'CORS_ORIGINS must contain the exact HTTPS origin(s) of the web application in production',
    );
  }
  if (
    origenesConfigurados?.some((origen) => {
      try {
        const urlAnalizada = new URL(origen);
        return (
          origen === '*' ||
          urlAnalizada.origin !== origen ||
          (entornoNodo === 'production' && urlAnalizada.protocol !== 'https:')
        );
      } catch {
        return true;
      }
    })
  ) {
    throw new Error('CORS_ORIGINS must contain exact valid origins without paths or wildcards');
  }

  const mismoSitioCookieWeb = (process.env.WEB_COOKIE_SAME_SITE || 'lax').toLowerCase();
  if (!['lax', 'strict', 'none'].includes(mismoSitioCookieWeb)) {
    throw new Error('WEB_COOKIE_SAME_SITE must be lax, strict, or none');
  }

  const secretoAccesoJWT = exigirVariableEntorno('JWT_ACCESS_SECRET');
  const secretoRenovacionJWT = exigirVariableEntorno('JWT_REFRESH_SECRET');
  if (
    Buffer.byteLength(secretoAccesoJWT, 'utf8') < 32 ||
    Buffer.byteLength(secretoRenovacionJWT, 'utf8') < 32
  ) {
    throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben tener al menos 32 bytes UTF-8');
  }
  if (secretoAccesoJWT === secretoRenovacionJWT) {
    throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben ser distintos');
  }
  if (
    entornoNodo === 'production' &&
    [secretoAccesoJWT, secretoRenovacionJWT].some((secret) =>
      /change[_ -]?me|replace[_ -]?me|local_(access|refresh)_secret/i.test(secret),
    )
  ) {
    throw new Error(
      'Configura secretos JWT propios; los valores de ejemplo no son válidos en producción',
    );
  }

  return {
    nodeEnv: entornoNodo,
    port: leerEnteroEntorno(
      'PORT/API_PORT',
      process.env.PORT || process.env.API_PORT,
      3000,
      1,
      65535,
    ),
    database: {
      url: exigirVariableEntorno('DATABASE_URL'),
    },
    redis: (() => {
      let servidor = process.env.REDIS_HOST || process.env.REDISHOST || 'localhost';
      let puerto = leerEnteroEntorno(
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
      let usarTLS = tlsconfigurada === 'true';

      if (process.env.REDIS_URL) {
        let urlAnalizada: URL;
        try {
          urlAnalizada = new URL(process.env.REDIS_URL);
        } catch {
          throw new Error('REDIS_URL debe ser una URL válida');
        }
        if (!['redis:', 'rediss:'].includes(urlAnalizada.protocol) || !urlAnalizada.hostname) {
          throw new Error('REDIS_URL debe usar el protocolo redis o rediss y definir un host');
        }
        servidor = urlAnalizada.hostname;
        puerto = leerEnteroEntorno('puerto de REDIS_URL', urlAnalizada.port, 6379, 1, 65535);
        contrasena = urlAnalizada.password || undefined;
        const urlcontls = urlAnalizada.protocol === 'rediss:';
        if (
          (tlsconfigurada === 'true' && !urlcontls) ||
          (tlsconfigurada === 'false' && urlcontls)
        ) {
          throw new Error('REDIS_TLS debe coincidir con el protocolo de REDIS_URL');
        }
        usarTLS = urlcontls;
      }

      const esBucleLocal = servidor === 'localhost' || servidor === '127.0.0.1' || servidor === '::1';
      if (entornoNodo === 'production' && !esBucleLocal && (!usarTLS || !contrasena)) {
        throw new Error('En producción Redis requiere TLS y una contraseña configurada');
      }

      return { host: servidor, port: puerto, password: contrasena, usarTLS };
    })(),
    jwt: {
      accessSecret: secretoAccesoJWT,
      refreshSecret: secretoRenovacionJWT,
      accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
      refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    corsOrigins: origenesConfigurados?.length
      ? origenesConfigurados
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    trustedProxyIps: proxiesconfiables,
    webCookieSameSite: mismoSitioCookieWeb as configuracionaplicacion['webCookieSameSite'],
    sie: {
      baseUrl: process.env.SIE_BASE_URL || '',
      headless: process.env.SIE_HEADLESS !== 'false',
      timeoutMs: leerEnteroEntorno(
        'SIE_SYNC_TIMEOUT_MS',
        process.env.SIE_SYNC_TIMEOUT_MS,
        30000,
        1000,
        300000,
      ),
      realAuditEnabled: process.env.SIE_REAL_AUDIT_ENABLED === 'true',
    },
  };
};
