import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { aplicacionerror } from '../core/application/erroraplicacion';
import { autenticacionestado } from '../features/auth/services/estadodeautenticacion';

function normalizarapierror(error: unknown): Error {
  if (error instanceof aplicacionerror) return error;
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new Error('No se pudo completar la solicitud.');
  }

  const respuestadatos = error.response?.data as
    { details?: { message?: string | string[] }; message?: string | string[] } | undefined;
  const respuestamensaje = respuestadatos?.details?.message ?? respuestadatos?.message;
  const mensaje = Array.isArray(respuestamensaje)
    ? respuestamensaje.join(' ')
    : respuestamensaje?.trim() || error.message;
  return new aplicacionerror(mensaje, error.response?.status, error);
}

function resolverapibaseurl(): string {
  const configurado = import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) {
    if (!configurado)
      throw new Error('VITE_API_URL debe configurarse para la compilación de producción.');
    const url = new URL(configurado);
    if (url.protocol !== 'https:') throw new Error('VITE_API_URL debe usar HTTPS en producción.');
    return configurado;
  }
  return configurado || 'http://localhost:3000/api/v1';
}

const constanteapibaseurl = resolverapibaseurl();
const constantewebmarcador = '1';
type reintentableconfiguracion = InternalAxiosRequestConfig & {
  _sigceRetried?: boolean;
  _sigceSessionGeneration?: number;
};

export const clienteapi = axios.create({
  baseURL: constanteapibaseurl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-SIGCE-Web': constantewebmarcador,
  },
});

clienteapi.interceptors.request.use((configuracion) => {
  const token = autenticacionestado.getAccessToken();
  const identificadorpestana = autenticacionestado.getTabSessionId();
  if (identificadorpestana && configuracion.headers) {
    configuracion.headers.set('X-SIGCE-Tab', identificadorpestana);
  }
  if (token && configuracion.headers && !configuracion.url?.includes('/auth/web/')) {
    configuracion.headers.Authorization = `Bearer ${token}`;
    (configuracion as reintentableconfiguracion)._sigceSessionGeneration =
      autenticacionestado.getSessionGeneration();
  }
  return configuracion;
});

let actualizarenvuelo: { generation: number; promise: Promise<void> } | null = null;

export async function esperarparaactualizararesolver(): Promise<void> {
  const actualactualizar = actualizarenvuelo;
  if (actualactualizar) await actualactualizar.promise.catch(() => undefined);
}

function actualizarsesion(generacion: number): Promise<void> {
  if (actualizarenvuelo?.generation === generacion) return actualizarenvuelo.promise;

  const promesa = clienteapi
    .post('/auth/web/refresh', {})
    .then((respuesta) => {
      if (!autenticacionestado.aplicarwebrespuesta(respuesta.data, generacion))
        throw new Error('La sesión cambió durante la renovación');
    })
    .finally(() => {
      if (actualizarenvuelo?.promise === promesa) actualizarenvuelo = null;
    });
  actualizarenvuelo = { generation: generacion, promise: promesa };
  return promesa;
}

clienteapi.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config as reintentableconfiguracion | undefined;
    if (
      error.response?.status !== 401 ||
      !original ||
      original._sigceRetried ||
      original.url?.includes('/auth/web/')
    ) {
      return Promise.reject(normalizarapierror(error));
    }

    const solicitudgeneracion = original._sigceSessionGeneration;
    if (
      solicitudgeneracion === undefined ||
      solicitudgeneracion !== autenticacionestado.getSessionGeneration() ||
      !autenticacionestado.getAccessToken()
    ) {
      return Promise.reject(normalizarapierror(error));
    }

    original._sigceRetried = true;
    try {
      await actualizarsesion(solicitudgeneracion);
      if (solicitudgeneracion !== autenticacionestado.getSessionGeneration()) {
        return Promise.reject(normalizarapierror(error));
      }
      const token = autenticacionestado.getAccessToken();
      if (!token) throw new Error('No se recibió un token de acceso');
      original.headers.Authorization = `Bearer ${token}`;
      return clienteapi.request(original);
    } catch (actualizarerror) {
      if (solicitudgeneracion === autenticacionestado.getSessionGeneration()) {
        autenticacionestado.limpiar();
        if (window.location.pathname !== '/login') window.location.assign('/login');
      }
      return Promise.reject(normalizarapierror(actualizarerror));
    }
  },
);
