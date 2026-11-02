import {
  severidadalerta,
  codigoalcanceanuncio,
  codigourgenciaanuncio,
} from '@academic/domain-kernel';
import { datoscreacionanuncio, registroanuncio } from './repositorioanuncios.port';

export const tokenpublicadoranuncio = Symbol('PUBLICADOR_ANUNCIO');

export interface notificacionanuncio {
  userId: string;
  title: string;
  message: string;
  severity: severidadalerta;
  urgency: codigourgenciaanuncio;
  scope: codigoalcanceanuncio;
}

export interface entradapublicaranuncio {
  creadorId: string;
  datos: datoscreacionanuncio;
  notificaciones: notificacionanuncio[];
}

export interface publicadoranuncio {
  publicar(entrada: entradapublicaranuncio): Promise<registroanuncio>;
}
