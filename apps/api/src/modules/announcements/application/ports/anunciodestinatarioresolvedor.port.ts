import { datoscreacionanuncio } from './repositorioanuncios.port';

export const tokenresolvedordestinatariosanuncio = Symbol('RESOLVEDOR_DESTINATARIOS_ANUNCIO');

export interface resolvedordestinatariosanuncio {
  resolverdestinatarios(datos: datoscreacionanuncio): Promise<string[]>;
}
