import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { servicioprisma } from '../database/prisma.service';
import { Server } from 'socket.io';
import { resultadosincronizacionsie, estadosincronizacionsie } from '@academic/shared-types';
import { pasarelaeventos, convertiracargapublicasincronizacionsie } from './eventos.gateway';

describe('Canal público de progreso SIE', () => {
  const sensitiveresultado: resultadosincronizacionsie = {
    synchronizationId: 'sync-1',
    itemId: 'item-1',
    studentRude: 'SIM-2026-001',
    localValue: 85,
    sieValue: 85,
    status: estadosincronizacionsie.VERIFIED,
    isMatched: true,
    source: 'LOCAL_SIE_SIMULATION',
    errorMessage: 'Detalle interno',
    verifiedAt: new Date().toISOString(),
  };

  it('retira RUDE, notas y errores de un resultado recibido por Redis', () => {
    expect(
      convertiracargapublicasincronizacionsie('sie.sync.verified', sensitiveresultado),
    ).toEqual({
      synchronizationId: 'sync-1',
      status: 'VERIFIED',
      source: 'LOCAL_SIE_SIMULATION',
    });
  });

  it('publica las discrepancias con un estado terminal separado del fallo técnico', () => {
    expect(
      convertiracargapublicasincronizacionsie('sie.sync.discrepancy', {
        ...sensitiveresultado,
        status: estadosincronizacionsie.DISCREPANCY,
        isMatched: false,
      }),
    ).toEqual({
      synchronizationId: 'sync-1',
      status: 'DISCREPANCY',
      source: 'LOCAL_SIE_SIMULATION',
    });
  });

  it('publica el estado de autenticación sin exponer detalles del error', () => {
    expect(
      convertiracargapublicasincronizacionsie('sie.sync.authentication_required', {
        ...sensitiveresultado,
        status: estadosincronizacionsie.AUTH_REQUIRED,
        isMatched: false,
        source: 'LOCAL_SIE_SIMULATION',
      }),
    ).toEqual({
      synchronizationId: 'sync-1',
      status: 'AUTH_REQUIRED',
      source: 'LOCAL_SIE_SIMULATION',
    });
  });

  it('conserva los datos de progreso que necesita la web', () => {
    expect(
      convertiracargapublicasincronizacionsie('sie.sync.progress', {
        synchronizationId: 'sync-1',
        status: 'PROCESSING',
        progress: 1,
        total: 2,
        studentRude: 'SIM-2026-001',
      }),
    ).toEqual({
      synchronizationId: 'sync-1',
      status: 'PROCESSING',
    });
  });

  it('publica las pausas de lote para actualizar el panel en tiempo real', () => {
    expect(
      convertiracargapublicasincronizacionsie('sie.sync.progress', {
        synchronizationId: 'sync-1',
        status: 'PAUSED',
      }),
    ).toEqual({ synchronizationId: 'sync-1', status: 'PAUSED' });
  });

  it('descarta eventos ajenos y mensajes sin identificador', () => {
    expect(convertiracargapublicasincronizacionsie('grade.updated', sensitiveresultado)).toBeNull();
    expect(
      convertiracargapublicasincronizacionsie('sie.sync.verified', { studentRude: 'SIM-2026-001' }),
    ).toBeNull();
  });

  it('sanea también las emisiones directas del gateway', () => {
    const gateway = new pasarelaeventos({} as ConfigService, {} as never, {} as never);
    const emit = jest.fn();
    gateway.servidor = { emit } as unknown as Server;

    gateway.emitirsincronizacionsieverificada(sensitiveresultado);
    gateway.emitircalificacionactualizada({
      studentId: 'student-1',
      subjectId: 'subject-1',
      newValue: 85,
    });

    expect(emit).toHaveBeenNthCalledWith(1, 'sie.sync.verified', {
      synchronizationId: 'sync-1',
      status: 'VERIFIED',
      source: 'LOCAL_SIE_SIMULATION',
    });
    expect(emit).toHaveBeenNthCalledWith(2, 'grade.updated', { status: 'UPDATED' });
  });

  it('rechaza la conexión antes del handshake cuando no presenta un JWT', async () => {
    const gateway = new pasarelaeventos(
      {} as ConfigService,
      {} as JwtService,
      {} as servicioprisma,
    );
    let middleware:
      ((socket: Socket, manejadorsiguiente: (error?: Error) => void) => void) | undefined;
    gateway.afterInit({
      use: (manejador) => {
        middleware = manejador;
      },
    } as never);
    const manejadorsiguiente = jest.fn();

    middleware?.(
      { handshake: { auth: {}, headers: {} }, data: {} } as unknown as Socket,
      manejadorsiguiente,
    );
    await new Promise((resolver) => setImmediate(resolver));

    expect(manejadorsiguiente).toHaveBeenCalledWith(expect.any(Error));
  });

  it('autoriza el canal solo a una cuenta activa con rol de dirección', async () => {
    const gateway = new pasarelaeventos(
      { getOrThrow: jest.fn().mockReturnValue('access-secret') } as unknown as ConfigService,
      {
        verify: jest.fn().mockReturnValue({
          sub: 'director-1',
          exp: Math.ceil((Date.now() + 60_000) / 1000),
        }),
      } as unknown as JwtService,
      {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'director-1',
            isActive: true,
            deletedAt: null,
            role: 'ADMINISTRATIVE',
          }),
        },
      } as unknown as servicioprisma,
    );
    let middleware:
      ((socket: Socket, manejadorsiguiente: (error?: Error) => void) => void) | undefined;
    gateway.afterInit({
      use: (manejador) => {
        middleware = manejador;
      },
    } as never);
    const socket = {
      handshake: { auth: { token: 'valid-access' }, headers: {} },
      data: {},
      disconnect: jest.fn(),
    } as unknown as Socket;
    const manejadorsiguiente = jest.fn();

    middleware?.(socket, manejadorsiguiente);
    await new Promise((resolver) => setImmediate(resolver));

    expect(manejadorsiguiente).toHaveBeenCalledWith();
    expect(socket.data).toMatchObject({ userId: 'director-1', userRole: 'ADMINISTRATIVE' });
    gateway.handleDisconnect(socket);
  });

  it('desconecta un socket cuando vence el access token', async () => {
    jest.useFakeTimers();
    const gateway = new pasarelaeventos(
      { getOrThrow: jest.fn().mockReturnValue('access-secret') } as unknown as ConfigService,
      {
        verify: jest.fn().mockReturnValue({
          sub: 'director-1',
          exp: Math.ceil((Date.now() + 1000) / 1000),
        }),
      } as unknown as JwtService,
      {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'director-1',
            isActive: true,
            deletedAt: null,
            role: 'ADMINISTRATIVE',
          }),
        },
      } as unknown as servicioprisma,
    );
    let middleware:
      ((socket: Socket, manejadorsiguiente: (error?: Error) => void) => void) | undefined;
    gateway.afterInit({
      use: (manejador) => {
        middleware = manejador;
      },
    } as never);
    const disconnect = jest.fn();
    const socket = {
      handshake: { auth: { token: 'valid-access' }, headers: {} },
      data: {},
      disconnect,
    } as unknown as Socket;
    const manejadorsiguiente = jest.fn();

    try {
      await new Promise<void>((resolver) => {
        middleware?.(socket, (error) => {
          if (error) manejadorsiguiente(error);
          else manejadorsiguiente();
          resolver();
        });
      });
      expect(manejadorsiguiente).toHaveBeenCalledWith();

      await jest.advanceTimersByTimeAsync(2000);

      expect(disconnect).toHaveBeenCalledWith(true);
    } finally {
      gateway.handleDisconnect(socket);
      jest.useRealTimers();
    }
  });
});
