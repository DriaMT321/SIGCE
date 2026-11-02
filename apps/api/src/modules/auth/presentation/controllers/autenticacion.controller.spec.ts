import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';

describe('AuthController web session', () => {
  const futureexpiry = new Date(Date.now() + 60_000);
  const rolloginresultado = {
    accessToken: 'short-access-token',
    refreshToken: 'long-refresh-token',
    refreshExpiresAt: futureexpiry,
    user: {
      id: 'user-1',
      email: 'admin@example.local',
      firstName: 'Admin',
      lastName: 'Local',
      role: 'ADMINISTRATIVE',
    },
  };

  const configuracion = (overrides: Record<string, unknown> = {}) => {
    const iniciarsesion = { ejecutar: jest.fn().mockResolvedValue(rolloginresultado) };
    const renovartoken = {
      ejecutar: jest
        .fn()
        .mockResolvedValue({ ...rolloginresultado, accessToken: 'renewed-access' }),
    };
    const revocartoken = { ejecutar: jest.fn().mockResolvedValue(undefined) };
    const iniciarsesionporrol = { ejecutar: jest.fn().mockResolvedValue(rolloginresultado) };
    const activarestudiante = { ejecutar: jest.fn().mockResolvedValue({ activated: true }) };
    const ratelimitador = { verificariniciosesion: jest.fn() };
    const configuracion = {
      get: jest.fn(
        (clave: string, valoralternativo?: unknown) =>
          ({
            corsOrigins: ['https://sigce.example'],
            nodeEnv: 'production',
            webCookieSameSite: 'none',
          })[clave] ?? valoralternativo,
      ),
    };
    const controller = new AuthController(
      iniciarsesion as never,
      renovartoken as never,
      revocartoken as never,
      iniciarsesionporrol as never,
      activarestudiante as never,
      ratelimitador as never,
      configuracion as unknown as ConfigService,
    );
    const respuesta = { setHeader: jest.fn() } as unknown as Response;
    const solicitud = (cookie?: string, origin = 'https://sigce.example', marcador = '1') =>
      ({
        ip: '192.0.2.4',
        socket: { remoteAddress: '192.0.2.4' },
        headers: { cookie, 'user-agent': 'test' },
        get: (nombre: string) =>
          nombre.toLowerCase() === 'origin'
            ? origin
            : nombre.toLowerCase() === 'x-sigce-web'
              ? marcador
              : undefined,
      }) as unknown as Request;
    return {
      controller,
      login: iniciarsesion,
      refresh: renovartoken,
      revoke: revocartoken,
      roleLogin: iniciarsesionporrol,
      activateStudent: activarestudiante,
      rateLimiter: ratelimitador,
      config: configuracion,
      response: respuesta,
      request: solicitud,
      ...overrides,
    };
  };

  it('guarda el refresh token en cookie HttpOnly y no lo devuelve al JavaScript', async () => {
    const ctx = configuracion();
    const body = await ctx.controller.iniciarsesionwebporrol(
      {
        role: 'ADMINISTRATIVE',
        identifier: 'admin@example.local',
        secret: 'new-password',
      } as never,
      ctx.request(),
      ctx.response,
    );

    const cookie = (ctx.response.setHeader as jest.Mock).mock.calls[0][1] as string;
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=None');
    expect(cookie).toContain('Path=/api/v1/auth/web');
    expect(body.data).not.toHaveProperty('refreshToken');
    expect(JSON.stringify(body)).not.toContain('long-refresh-token');
  });

  it('rota el refresh token desde la cookie y actualiza la cookie', async () => {
    const ctx = configuracion();
    const body = await ctx.controller.renovarsesionweb(
      ctx.request('sigce_refresh=old-cookie-token'),
      ctx.response,
    );

    expect(ctx.refresh.ejecutar).toHaveBeenCalledWith({ refreshToken: 'old-cookie-token' });
    expect(body.data).toMatchObject({ accessToken: 'renewed-access' });
    expect(body.data).not.toHaveProperty('refreshToken');
  });

  it('rechaza una petición web si el origen no está autorizado', async () => {
    const ctx = configuracion();
    await expect(
      ctx.controller.renovarsesionweb(ctx.request(undefined, 'https://evil.example'), ctx.response),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(ctx.refresh.ejecutar).not.toHaveBeenCalled();
  });

  it('revoca la sesión y expira la cookie al cerrar sesión', async () => {
    const ctx = configuracion();
    await ctx.controller.revocarsesionweb(
      ctx.request('sigce_refresh=old-cookie-token'),
      ctx.response,
    );

    expect(ctx.revoke.ejecutar).toHaveBeenCalledWith({ refreshToken: 'old-cookie-token' });
    expect((ctx.response.setHeader as jest.Mock).mock.calls[0][1]).toContain('Max-Age=0');
  });
});
