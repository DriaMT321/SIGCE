import Redis from 'ioredis';
import { configuraciontrabajador } from '../../config/configuraciontrabajador.config';
import {
  publicadoreventossie,
  nombreeventosincronizacionsie,
} from '../../application/ports/publicadoreventossie.port';

export const CANAL_EVENTOS_SINCRONIZACION_SIE = 'sie-synchronization-eventos';

export class publicadorrediseventossie implements publicadoreventossie {
  private cliente: Redis | null = null;

  async iniciar(): Promise<void> {
    if (this.cliente) return;
    this.cliente = new Redis({
      host: configuraciontrabajador.redis.servidor,
      port: configuraciontrabajador.redis.puerto,
      password: configuraciontrabajador.redis.contrasena,
      ...(configuraciontrabajador.redis.usartls ? { tls: {} } : {}),
      maxRetriesPerRequest: null,
    });
    await this.cliente.ping();
  }

  async publicar(
    evento: nombreeventosincronizacionsie,
    carga: Record<string, unknown>,
  ): Promise<void> {
    await this.iniciar();
    await this.cliente!.publish(
      CANAL_EVENTOS_SINCRONIZACION_SIE,
      JSON.stringify({ event: evento, payload: carga }),
    );
  }

  async detener(): Promise<void> {
    if (this.cliente) {
      await this.cliente.quit();
      this.cliente = null;
    }
  }
}
