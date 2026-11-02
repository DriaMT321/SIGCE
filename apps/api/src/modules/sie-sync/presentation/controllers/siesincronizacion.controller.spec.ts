import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { casousoiniciarsincronizacionsie } from '../../application/use-cases/iniciarsincronizacion.use-case';
import { ConfigService } from '@nestjs/config';
import { casousoauditarcalificacionessie } from '../../application/use-cases/auditoriacalificacionesie.use-case';
import { SieSyncController } from './sie-sync.controller';

describe('SieSyncController real audit gate', () => {
  it('requires and forwards an idempotency key when confirming a batch', async () => {
    const inicio = { ejecutar: jest.fn().mockResolvedValue({ synchronizationId: 'sync-1' }) };
    const controller = new SieSyncController(
      inicio as unknown as casousoiniciarsincronizacionsie,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const body = {
      academicYearId: 'year-1',
      periodNumber: 1,
      confirmSend: true,
      expectedFingerprint: 'f'.repeat(64),
      expectedGradeCount: 1,
    };
    const usuario = { id: 'admin-1' } as never;

    await expect(
      controller.iniciarsincronizacion(body as never, usuario, { headers: {} } as never),
    ).rejects.toBeInstanceOf(BadRequestException);
    await controller.iniciarsincronizacion(body as never, usuario, {
      ip: '127.0.0.1',
      correlationId: 'corr-1',
      headers: { 'idempotency-key': 'request-key-1' },
    } as never);

    expect(inicio.ejecutar).toHaveBeenCalledWith(
      expect.objectContaining({
        solicitadoporid: 'admin-1',
        claveidempotencia: 'request-key-1',
        identificadorcorrelacion: 'corr-1',
        idgestionacademica: 'year-1',
        huellaprevia: 'f'.repeat(64),
      }),
    );
  });

  it('does not ejecutar the official portal audit while the feature is disabled', async () => {
    const auditoria = {
      ejecutarauditoria: jest.fn(),
    } as unknown as jest.Mocked<casousoauditarcalificacionessie>;
    const configuracion = {
      get: jest.fn().mockReturnValue(false),
    } as unknown as ConfigService;
    const controller = new SieSyncController(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      auditoria,
      configuracion,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      controller.ejecutarauditoria({} as never, { id: 'admin-1' } as never, {} as never),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(auditoria.ejecutarauditoria).not.toHaveBeenCalled();
  });

  it('passes the authenticated operator and request context to a permitted audit', async () => {
    const resultado = { message: 'ok' };
    const auditoria = {
      ejecutarauditoria: jest.fn().mockResolvedValue(resultado),
    } as unknown as jest.Mocked<casousoauditarcalificacionessie>;
    const configuracion = {
      get: jest.fn().mockReturnValue(true),
    } as unknown as ConfigService;
    const controller = new SieSyncController(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      auditoria,
      configuracion,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );
    const usuario = { id: 'admin-1' } as never;
    const req = { ip: '127.0.0.1', correlationId: 'corr-auditoriasie' } as never;

    await controller.ejecutarauditoria({} as never, usuario, req);

    expect(auditoria.ejecutarauditoria).toHaveBeenCalledWith(
      {},
      {
        userId: 'admin-1',
        ipAddress: '127.0.0.1',
        correlationId: 'corr-auditoriasie',
      },
    );
  });

  it('does not check credentials against the official portal while the feature is disabled', async () => {
    const verificadoracceso = { ejecutar: jest.fn() };
    const configuracion = {
      get: jest.fn().mockReturnValue(false),
    } as unknown as ConfigService;
    const controller = new SieSyncController(
      {} as never,
      {} as never,
      {} as never,
      verificadoracceso as never,
      {} as never,
      {} as never,
      configuracion,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(
      controller.verificaracceso({ username: 'operator', password: 'secret' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(verificadoracceso.ejecutar).not.toHaveBeenCalled();
  });
});
