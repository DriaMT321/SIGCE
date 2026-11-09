import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';
import { servicioprisma } from '../database/prisma.service';
import { pasarelaeventos } from './eventos.gateway';

describe('Canal WebSocket de dirección', () => {
  it('publica el cambio de nota sin datos del estudiante', () => {
    const gateway = new pasarelaeventos({} as ConfigService, {} as never, {} as never);
    const emit = jest.fn();
    gateway.servidor = { emit } as unknown as Server;

    gateway.emitircalificacionactualizada({
      studentId: 'student-1',
      subjectId: 'subject-1',
      newValue: 85,
    });

    expect(emit).toHaveBeenCalledWith('grade.updated', { status: 'UPDATED' });
  });

  it('rechaza la conexión antes del handshake cuando no presenta un JWT', async () => {
    const gateway = new pasarelaeventos({} as ConfigService, {} as JwtService, {} as servicioprisma);
    let middleware:
      ((socket: Socket, next: (error?: Error) => void) => void) | undefined;
    gateway.afterInit({
      use: (handler) => { middleware = handler; },
    } as never);
    const next = jest.fn();

    middleware?.(
      { handshake: { auth: {}, headers: {} }, data: {} } as unknown as Socket,
      next,
    );
    await new Promise((resolve) => setImmediate(resolve));

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('autoriza el canal solo a una cuenta activa con rol de dirección', async () => {
    const gateway = new pasarelaeventos(
      { getOrThrow: jest.fn().mockReturnValue('access-secret') } as unknown as ConfigService,
      { verify: jest.fn().mockReturnValue({ sub: 'director-1', exp: Math.ceil((Date.now() + 60_000) / 1000) }) } as unknown as JwtService,
      { user: { findUnique: jest.fn().mockResolvedValue({ id: 'director-1', isActive: true, deletedAt: null, role: 'ADMINISTRATIVE' }) } } as unknown as servicioprisma,
    );
    let middleware:
      ((socket: Socket, next: (error?: Error) => void) => void) | undefined;
    gateway.afterInit({
      use: (handler) => { middleware = handler; },
    } as never);
    const socket = {
      handshake: { auth: { token: 'valid-access' }, headers: {} },
      data: {},
      disconnect: jest.fn(),
    } as unknown as Socket;
    const next = jest.fn();

    middleware?.(socket, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(next).toHaveBeenCalledWith();
    expect(socket.data).toMatchObject({ userId: 'director-1', userRole: 'ADMINISTRATIVE' });
    gateway.handleDisconnect(socket);
  });

  it('desconecta el socket cuando vence el token de acceso', async () => {
    jest.useFakeTimers();
    const gateway = new pasarelaeventos(
      { getOrThrow: jest.fn().mockReturnValue('access-secret') } as unknown as ConfigService,
      { verify: jest.fn().mockReturnValue({ sub: 'director-1', exp: Math.ceil((Date.now() + 1000) / 1000) }) } as unknown as JwtService,
      { user: { findUnique: jest.fn().mockResolvedValue({ id: 'director-1', isActive: true, deletedAt: null, role: 'ADMINISTRATIVE' }) } } as unknown as servicioprisma,
    );
    let middleware:
      ((socket: Socket, next: (error?: Error) => void) => void) | undefined;
    gateway.afterInit({
      use: (handler) => { middleware = handler; },
    } as never);
    const disconnect = jest.fn();
    const socket = {
      handshake: { auth: { token: 'valid-access' }, headers: {} },
      data: {},
      disconnect,
    } as unknown as Socket;
    const next = jest.fn();

    try {
      await new Promise<void>((resolve) => {
        middleware?.(socket, (error) => {
          if (error) next(error);
          else next();
          resolve();
        });
      });
      expect(next).toHaveBeenCalledWith();
      await jest.advanceTimersByTimeAsync(2000);
      expect(disconnect).toHaveBeenCalledWith(true);
    } finally {
      gateway.handleDisconnect(socket);
      jest.useRealTimers();
    }
  });
});
