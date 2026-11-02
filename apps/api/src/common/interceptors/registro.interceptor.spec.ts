import { Logger } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { contextoidentificadorcorrelacionlocal } from '../../core/infrastructure/contextocorrelacion.local';
import { interceptorregistrosolicitudes } from './registro.interceptor';

describe('interceptorregistrosolicitudes', () => {
  it('genera una correlación propia e ignora IDs controlados por el cliente', async () => {
    const ids: string[] = [];
    const registrador = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    try {
      for (let intento = 0; intento < 2; intento += 1) {
        const solicitud: {
          headers: Record<string, string>;
          method: string;
          url: string;
          path: string;
          originalUrl: string;
          correlationId?: string;
        } = {
          headers: { 'x-correlation-id': 'id-reutilizable', 'x-request-id': 'id-reutilizable' },
          method: 'GET',
          url: '/health',
          path: '/health',
          originalUrl: '/health',
        };
        const respuesta = { setHeader: jest.fn() };
        const contexto = {
          switchToHttp: () => ({
            getRequest: () => solicitud,
            getResponse: () => respuesta,
          }),
        };
        const flujo = new interceptorregistrosolicitudes(
          new contextoidentificadorcorrelacionlocal(),
        ).intercept(contexto as never, { handle: () => of({ ok: true }) });
        await firstValueFrom(flujo);

        const id = respuesta.setHeader.mock.calls[0][1] as string;
        expect(id).toMatch(/^[0-9a-f-]{36}$/i);
        expect(id).not.toBe('id-reutilizable');
        expect(solicitud.correlationId).toBe(id);
        ids.push(id);
      }
    } finally {
      registrador.mockRestore();
    }

    expect(ids[0]).not.toBe(ids[1]);
  });

  it('does not write query parameters to request logs', async () => {
    const solicitud = {
      headers: {},
      method: 'GET',
      url: '/students?search=dato-de-prueba',
      path: '/students',
      originalUrl: '/students?search=dato-de-prueba',
      route: { path: '/students' },
    };
    const respuesta = { setHeader: jest.fn() };
    const contexto = {
      switchToHttp: () => ({
        getRequest: () => solicitud,
        getResponse: () => respuesta,
      }),
    };
    const registrador = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    try {
      const flujo = new interceptorregistrosolicitudes(
        new contextoidentificadorcorrelacionlocal(),
      ).intercept(contexto as never, { handle: () => of({ ok: true }) });
      await firstValueFrom(flujo);

      const mensaje = String(registrador.mock.calls[0]?.[0]);
      expect(mensaje).toContain('GET /students');
      expect(mensaje).not.toContain('search=');
      expect(mensaje).not.toContain('dato-de-prueba');
    } finally {
      registrador.mockRestore();
    }
  });
});
