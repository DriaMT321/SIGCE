import type { autenticacionusuario } from '../application/gestionautenticacion';
import {
  autenticacionusuarioesquema,
  webautenticacionrespuestaesquema,
} from '../infrastructure/esquemaderespuestaautenticacion';

let accesotoken: string | null = null;
let actualusuario: autenticacionusuario | null = leeralmacenadousuario();
let sesiongeneracion = 0;
const claveidentificadorpestana = 'sigce_web_tab';

function crearfallbackuuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (caracter) => {
    const valor = Math.floor(Math.random() * 16);
    return (caracter === 'x' ? valor : (valor & 0x3) | 0x8).toString(16);
  });
}

function obteneridentificadorpestana(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const existente = sessionStorage.getItem(claveidentificadorpestana);
    if (existente && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existente)) {
      return existente.toLowerCase();
    }
    const identificador = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : crearfallbackuuid();
    sessionStorage.setItem(claveidentificadorpestana, identificador);
    return identificador;
  } catch {
    return null;
  }
}

function notificarsesionfinalizado(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('sigce:session-ended'));
}

function leeralmacenadousuario(): autenticacionusuario | null {
  try {
    if (typeof window === 'undefined') return null;
    const crudo = sessionStorage.getItem('auth_user');
    if (!crudo) return null;
    const analizado: unknown = JSON.parse(crudo);
    const resultado = autenticacionusuarioesquema.safeParse(analizado);
    return resultado.success ? resultado.data : null;
  } catch {
    return null;
  }
}

function guardarsesionusuario(usuario: autenticacionusuario): void {
  if (typeof window !== 'undefined')
    sessionStorage.setItem('auth_user', JSON.stringify(usuario));
}

function limpiarsesionusuario(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('auth_user');
  // Elimina la identidad compartida que dejaron versiones anteriores.
  localStorage.removeItem('auth_user');
}

export const autenticacionestado = {
  getTabSessionId: obteneridentificadorpestana,
  getAccessToken: () => accesotoken,
  getCurrentUser: () => actualusuario,
  getSessionGeneration: () => sesiongeneracion,
  establecersesion(token: string, usuario: autenticacionusuario) {
    sesiongeneracion += 1;
    if (accesotoken) notificarsesionfinalizado();
    accesotoken = token;
    actualusuario = usuario;
    guardarsesionusuario(usuario);
  },
  limpiar() {
    sesiongeneracion += 1;
    notificarsesionfinalizado();
    accesotoken = null;
    actualusuario = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    limpiarsesionusuario();
  },
  aplicarwebrespuesta(respuesta: unknown, esperadogeneracion = sesiongeneracion): boolean {
    if (esperadogeneracion !== sesiongeneracion) return false;
    const analizado = webautenticacionrespuestaesquema.safeParse(respuesta);
    if (!analizado.success) return false;
    if (actualusuario && actualusuario.id !== analizado.data.data.user.id) return false;
    accesotoken = analizado.data.data.accessToken;
    actualusuario = analizado.data.data.user;
    guardarsesionusuario(actualusuario);
    return true;
  },
};
