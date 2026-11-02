import { clienteapi } from '../../../lib/clienteapi';
import type {
  autenticacionsesion,
  autenticacionusuario,
  sesioncredenciales,
} from '../application/gestionautenticacion';
import { webautenticacionrespuestaesquema } from '../infrastructure/esquemaderespuestaautenticacion';
import { autenticacionestado } from './estadodeautenticacion';
import { esperarparaactualizararesolver } from '../../../lib/clienteapi';

let inicializacion: Promise<void> | null = null;

export const autenticacionservicio = {
  async activarestudiantecuenta(entrada: { activationToken: string; newPassword: string }) {
    const respuesta = await clienteapi.post('/auth/student/activate', entrada);
    return respuesta.data;
  },

  inicializar(): Promise<void> {
    inicializacion ??= (async () => {
      const sesiongeneracion = autenticacionestado.getSessionGeneration();
      // Remove tokens left by older builds before restoring from the HttpOnly cookie.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
      try {
        const respuesta = await clienteapi.post('/auth/web/refresh', {});
        if (!autenticacionestado.aplicarwebrespuesta(respuesta.data, sesiongeneracion))
          throw new Error('Respuesta de sesión inválida');
      } catch {
        if (autenticacionestado.getSessionGeneration() === sesiongeneracion)
          autenticacionestado.limpiar();
      }
    })().finally(() => {
      inicializacion = null;
    });
    return inicializacion;
  },

  async sesion(datos: sesioncredenciales): Promise<autenticacionsesion> {
    const cargautil: Partial<sesioncredenciales> = {
      role: datos.role,
      identifier: datos.identifier.trim(),
    };
    if (datos.secret?.trim()) cargautil.secret = datos.secret;
    if (datos.secondaryIdentifier?.trim())
      cargautil.secondaryIdentifier = datos.secondaryIdentifier.trim();

    const respuesta = await clienteapi.post('/auth/web/role-login', cargautil);
    const analizado = webautenticacionrespuestaesquema.parse(respuesta.data);
    autenticacionestado.establecersesion(analizado.data.accessToken, analizado.data.user);
    return analizado.data;
  },

  esautenticado() {
    return Boolean(autenticacionestado.getAccessToken());
  },

  obteneraccesotoken() {
    return autenticacionestado.getAccessToken();
  },

  obtenerusuarioactual(): autenticacionusuario | null {
    return autenticacionestado.getCurrentUser();
  },

  async cerrarsesion() {
    autenticacionestado.limpiar();
    try {
      await esperarparaactualizararesolver();
      await clienteapi.post('/auth/web/revoke', {});
    } catch {
      // El cierre local debe completarse aunque la API no responda.
    } finally {
      window.location.assign('/login');
    }
  },
};
