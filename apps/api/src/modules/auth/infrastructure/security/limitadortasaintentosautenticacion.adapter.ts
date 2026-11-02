import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';
import Redis from 'ioredis';
import { limitadorintentosautenticacionpuerto } from '../../application/ports/limitadorintentosautenticacion.port';

const constantewindowseconds = 15 * 60;
const constantemaximoipintentos = 200;
const constanteincrementconwindow = `
  local count = redis.call('INCR', KEYS[1])
  if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return count
`;

@Injectable()
export class limitadorintentosautenticacion
  implements OnModuleDestroy, limitadorintentosautenticacionpuerto
{
  private readonly redis: Redis;
  private connectionPromise: Promise<void> | null = null;

  constructor(configuracionservicio: ConfigService) {
    this.redis = new Redis({
      host: configuracionservicio.get<string>('redis.host', 'localhost'),
      port: configuracionservicio.get<number>('redis.port', 6379),
      password: configuracionservicio.get<string>('redis.password') || undefined,
      ...(configuracionservicio.get<boolean>('redis.usarTLS', false) ? { tls: {} } : {}),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    // Redis reports connection errors through EventEmitter; requests fail closed below.
    this.redis.on('error', () => undefined);
  }

  async verificariniciosesion(direccionip: string): Promise<void> {
    try {
      const ipclave = `sigce:auth:ip:${this.digest(direccionip || 'unknown')}`;
      const intentosip = await this.increment(ipclave);

      if (intentosip > constantemaximoipintentos) {
        throw new HttpException(
          'Demasiados intentos de acceso. Espera 15 minutos e inténtalo nuevamente.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (error) {
      if (error instanceof HttpException && error.getStatus() === HttpStatus.TOO_MANY_REQUESTS)
        throw error;
      throw new ServiceUnavailableException(
        'El servicio de autenticación no está disponible temporalmente.',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis.status === 'ready') await this.redis.quit();
    else this.redis.disconnect();
  }

  private async increment(clave: string): Promise<number> {
    await this.asegurarconnected();
    return Number(
      await this.redis.eval(constanteincrementconwindow, 1, clave, constantewindowseconds),
    );
  }

  private async asegurarconnected(): Promise<void> {
    if (this.connectionPromise) {
      await this.connectionPromise;
    } else if (this.redis.status === 'wait') {
      const pendiente = this.redis.connect().then(() => undefined);
      this.connectionPromise = pendiente;
      try {
        await pendiente;
      } finally {
        if (this.connectionPromise === pendiente) this.connectionPromise = null;
      }
    }
    if (this.redis.status !== 'ready') throw new Error('Redis is not ready');
  }

  private digest(valor: string): string {
    return createHash('sha256').update(valor).digest('hex');
  }
}
