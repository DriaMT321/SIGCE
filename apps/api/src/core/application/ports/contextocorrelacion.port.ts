export const tokencontextocorrelacion = Symbol('CORRELATION_CONTEXT');

export interface contextoidentificadorcorrelacion {
  ejecutar<T>(idcorrelacion: string, operacion: () => T): T;
  obteneractual(): string | undefined;
}
