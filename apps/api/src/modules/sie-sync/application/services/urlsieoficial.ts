import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
export function urloficialsie(urlconfigurada: string): string {
  try {
    const url = new URL(urlconfigurada);
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
      throw new Error('untrusted SIE target');
    }
    return url.origin;
  } catch {
    throw new errorsolicitudincorrecta('La URL del portal SIE debe ser el origen HTTPS oficial.');
  }
}
