import { eventoaplicacion, manejadoreventoaplicacion } from './aplicacionevento';

export const tokenbuseventosaplicacion = Symbol('APPLICATION_EVENT_BUS');

export interface buseventosaplicacion {
  publicar<TEvent extends eventoaplicacion>(evento: TEvent): Promise<void>;
  suscribir<TEvent extends eventoaplicacion>(
    tipoevento: TEvent['type'],
    manejador: manejadoreventoaplicacion<TEvent>,
  ): () => void;
}
