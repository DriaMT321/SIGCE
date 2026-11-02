import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { limitadorintentosautenticacion } from './limitadortasaintentosautenticacion.adapter';

describe('AuthAttemptRateLimiter', () => {
  const crearlimitador = (intentosparaclave: (clave: string) => number) => {
    const servicio = new limitadorintentosautenticacion({
      get: jest.fn((_clave: string, valoralternativo?: unknown) => valoralternativo),
    } as unknown as ConfigService);
    const redis = {
      status: 'ready',
      eval: jest.fn((_script: string, _clavecantidad: number, clave: string) =>
        Promise.resolve(intentosparaclave(clave)),
      ),
      del: jest.fn().mockResolvedValue(1),
      disconnect: jest.fn(),
    } as unknown as Redis;
    (servicio as unknown as { redis: Redis }).redis = redis;
    return { service: servicio, redis };
  };

  it('limita por IP sin bloquear a una identidad compartida', async () => {
    const { service: servicio, redis } = crearlimitador(() => 1);
    await servicio.verificariniciosesion('192.0.2.4');

    expect((redis as unknown as { eval: jest.Mock }).eval).toHaveBeenCalledTimes(1);
    expect(JSON.stringify((redis as unknown as { eval: jest.Mock }).eval.mock.calls)).not.toContain(
      '192.0.2.4',
    );
  });

  it('responde 429 al superar doscientos intentos desde una IP', async () => {
    const { service: servicio } = crearlimitador((clave) => (clave.includes(':ip:') ? 201 : 1));
    await expect(servicio.verificariniciosesion('192.0.2.4')).rejects.toMatchObject({
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
  });
});
