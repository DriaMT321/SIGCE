import { repositorioautenticacion } from '../../domain/repositories/autenticacion.repository.interface';
import { casousorenovartoken } from './renovaciontoken.use-case';
import { emisortokenspuerto } from '../ports/tokenemisor.port';
import { dtotokenrenovacion } from '../dto/acceso.dto';

describe('RefreshTokenUseCase', () => {
  const seguridadcredenciales = {
    resumirtoken: (token: string) => `hash:${token}`,
    resumircontrasena: jest.fn(),
    verificarcontrasena: jest.fn(),
    generartoken: jest.fn(),
  };
  it('rota un refresh token válido y revoca el anterior', async () => {
    const tokenanterior = {
      id: 'token-1',
      userId: 'user-1',
      sessionId: 'session-1',
      session: { id: 'session-1', userId: 'user-1', revokedAt: null, expiresAt: new Date(Date.now() + 60_000) },
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: 'user-1',
        email: 'admin@example.local',
        firstName: 'Admin',
        lastName: 'Local',
        role: 'ADMINISTRATIVE',
        passwordSetupPending: false,
        credentialVersion: 0,
        isActive: true,
        deletedAt: null,
      },
    };
    const repositorio = {
      buscartokenrenovacion: jest.fn().mockResolvedValue(tokenanterior),
      rotartokenrenovacion: jest.fn().mockResolvedValue(true),
    };
    const emisortokens = {
      verificartokenrenovacion: jest.fn().mockReturnValue({ sub: 'user-1', sessionId: 'session-1' }),
      emitirparausuario: jest.fn().mockReturnValue({
        accessToken: 'new-access',
        sessionId: 'session-1',
        refreshToken: 'new-refresh',
        refreshExpiresAt: new Date(Date.now() + 604_800_000),
      }),
    };

    const usocaso = new casousorenovartoken(
      repositorio as unknown as repositorioautenticacion,
      emisortokens as unknown as emisortokenspuerto,
      seguridadcredenciales,
    );

    const resultado = await usocaso.ejecutar({
      refreshToken: 'old-refresh',
    } satisfies dtotokenrenovacion);

    expect(resultado.accessToken).toBe('new-access');
    expect(emisortokens.emitirparausuario).toHaveBeenCalledWith(tokenanterior.user, 'session-1');
    expect(repositorio.rotartokenrenovacion).toHaveBeenCalledWith(
      expect.objectContaining({
        previousTokenId: 'token-1',
        replacement: expect.objectContaining({ userId: 'user-1', token: expect.any(String) }),
      }),
    );
  });

  it('rechaza un refresh token reutilizado en una renovación concurrente', async () => {
    const token = {
      id: 'token-race',
      userId: 'user-1',
      sessionId: 'session-1',
      session: { id: 'session-1', userId: 'user-1', revokedAt: null, expiresAt: new Date(Date.now() + 60_000) },
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      user: {
        id: 'user-1',
        email: 'admin@example.local',
        firstName: 'Admin',
        lastName: 'Local',
        role: 'ADMINISTRATIVE',
        passwordSetupPending: false,
        credentialVersion: 0,
        isActive: true,
        deletedAt: null,
      },
    };
    const repositorio = {
      buscartokenrenovacion: jest.fn().mockResolvedValue(token),
      rotartokenrenovacion: jest.fn().mockResolvedValue(false),
    };
    const usocaso = new casousorenovartoken(
      repositorio as unknown as repositorioautenticacion,
      {
        verificartokenrenovacion: jest.fn().mockReturnValue({ sub: 'user-1', sessionId: 'session-1' }),
        emitirparausuario: jest.fn().mockReturnValue({
          accessToken: 'new',
          refreshToken: 'new-refresh',
          refreshExpiresAt: new Date(),
        }),
      } as unknown as emisortokenspuerto,
      seguridadcredenciales,
    );

    await expect(usocaso.ejecutar({ refreshToken: 'old-refresh' })).rejects.toThrow(
      'Refresh token inválido',
    );
    expect(repositorio.rotartokenrenovacion).toHaveBeenCalledTimes(1);
  });

  it('rechaza sesiones de cuentas bloqueadas para activación y no las rota', async () => {
    const repositorio = {
      buscartokenrenovacion: jest.fn().mockResolvedValue({
        id: 'token-locked',
        userId: 'student-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        user: {
          id: 'student-1',
          email: 'student@example.local',
          firstName: 'Estudiante',
          lastName: 'Pendiente',
          role: 'STUDENT',
          passwordSetupPending: true,
          isActive: true,
          deletedAt: null,
        },
      }),
      rotartokenrenovacion: jest.fn(),
    };
    const usocaso = new casousorenovartoken(
      repositorio as unknown as repositorioautenticacion,
      {
        verificartokenrenovacion: jest.fn().mockReturnValue({ sub: 'student-1' }),
        emitirparausuario: jest.fn(),
      } as unknown as emisortokenspuerto,
      seguridadcredenciales,
    );

    await expect(usocaso.ejecutar({ refreshToken: 'legacy-refresh' })).rejects.toThrow(
      'Refresh token inválido',
    );
    expect(repositorio.rotartokenrenovacion).not.toHaveBeenCalled();
  });

  it('rechaza un refresh token emitido antes de la reemisión de activación', async () => {
    const repositorio = {
      buscartokenrenovacion: jest.fn().mockResolvedValue({
        id: 'token-before-reset',
        userId: 'student-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        user: {
          id: 'student-1',
          email: 'student@example.local',
          firstName: 'Estudiante',
          lastName: 'Activo',
          role: 'STUDENT',
          passwordSetupPending: false,
          credentialVersion: 1,
          isActive: true,
          deletedAt: null,
        },
      }),
      rotartokenrenovacion: jest.fn(),
    };
    const usocaso = new casousorenovartoken(
      repositorio as unknown as repositorioautenticacion,
      {
        verificarTokenRenovacion: jest
          .fn()
          .mockReturnValue({ sub: 'student-1', credentialVersion: 0 }),
        emitirparausuario: jest.fn(),
      } as unknown as emisortokenspuerto,
      seguridadcredenciales,
    );

    await expect(usocaso.ejecutar({ refreshToken: 'pre-reset-refresh' })).rejects.toThrow(
      'Refresh token inválido',
    );
    expect(repositorio.rotartokenrenovacion).not.toHaveBeenCalled();
  });
});
