export interface credencialessie {
  username: string;
  password: string;
}

const OFFICIAL_SIE_ORIGIN = 'https://academico.sie.gob.bo';

export function requireOfficialSieOrigin(configuredUrl = process.env.SIE_BASE_URL): string {
  const raw = configuredUrl?.trim() || OFFICIAL_SIE_ORIGIN;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('SIE_BASE_URL debe ser el origen HTTPS oficial del SIE.');
  }

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
    throw new Error('SIE_BASE_URL debe ser el origen HTTPS oficial del SIE.');
  }

  return url.origin;
}

export function requireSieCredentials(): credencialessie {
  if (process.env.SIE_REAL_ACCESS_ENABLED?.trim().toLowerCase() !== 'true') {
    throw new Error(
      'El acceso real al SIE está deshabilitado. Habilítalo explícitamente solo para una ejecución autorizada.',
    );
  }

  requireOfficialSieOrigin();
  const username = process.env.SIE_USERNAME?.trim();
  const password = process.env.SIE_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Configura SIE_USERNAME y SIE_PASSWORD en el entorno antes de usar este script.',
    );
  }

  return { username, password };
}
