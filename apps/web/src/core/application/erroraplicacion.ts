export class aplicacionerror extends Error {
  constructor(
    mensaje: string,
    readonly statusCode?: number,
    causa?: unknown,
  ) {
    super(mensaje, causa === undefined ? undefined : { cause: causa });
    this.name = 'ApplicationError';
  }
}
