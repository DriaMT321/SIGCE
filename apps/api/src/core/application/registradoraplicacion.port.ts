export const tokenregistradoraplicacion = Symbol('APPLICATION_LOGGER');

export interface registroaplicacion {
  error(mensaje: string, error?: unknown): void;
  warn(mensaje: string, error?: unknown): void;
  informacion(mensaje: string): void;
}
