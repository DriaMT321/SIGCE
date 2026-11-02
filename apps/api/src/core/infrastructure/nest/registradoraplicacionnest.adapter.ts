import { Injectable, Logger } from '@nestjs/common';
import { registroaplicacion } from '../../application/registradoraplicacion.port';

@Injectable()
export class adaptadorregistroaplicacionnest implements registroaplicacion {
  private readonly registrador = new Logger('Application');

  error(mensaje: string, error?: unknown): void {
    this.registrador.error(mensaje, error instanceof Error ? error.stack : undefined);
  }

  warn(mensaje: string, error?: unknown): void {
    this.registrador.warn(mensaje, error instanceof Error ? error.stack : undefined);
  }

  informacion(mensaje: string): void {
    this.registrador.log(mensaje);
  }
}
