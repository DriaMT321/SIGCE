import { AsyncLocalStorage } from 'node:async_hooks';
import { contextoidentificadorcorrelacion } from '../application/ports/contextocorrelacion.port';

export class contextoidentificadorcorrelacionlocal implements contextoidentificadorcorrelacion {
  private readonly almacen = new AsyncLocalStorage<string>();

  ejecutar<T>(idcorrelacion: string, operacion: () => T): T {
    return this.almacen.run(idcorrelacion, operacion);
  }

  obteneractual(): string | undefined {
    return this.almacen.getStore();
  }
}
