import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { casousoactivarcuentaestudiante } from './activarcuentaestudiante.use-case';

describe('ActivateStudentAccountUseCase', () => {
  const repositorio = {
    esvalidotokenconfiguracioncontrasenaestudiante: jest.fn(),
    completarconfiguracioncontrasenaestudiante: jest.fn(),
  };
  const seguridad = {
    resumirtoken: jest.fn().mockReturnValue('activation-token-hash'),
    resumircontrasena: jest.fn().mockResolvedValue('bcrypt-password-hash'),
    verificarcontrasena: jest.fn(),
    generartoken: jest.fn(),
  };
  const usocaso = new casousoactivarcuentaestudiante(repositorio as never, seguridad);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rechaza una contraseña corta antes de consultar o consumir el token', async () => {
    await expect(
      usocaso.ejecutar({
        activationToken: 'activation-token-that-is-never-a-password',
        newPassword: 'corta123456',
      }),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);
    await expect(
      usocaso.ejecutar({
        activationToken: 'activation-token-that-is-never-a-password',
        newPassword: ' '.repeat(12),
      }),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);

    expect(seguridad.resumirtoken).not.toHaveBeenCalled();
    expect(repositorio.esvalidotokenconfiguracioncontrasenaestudiante).not.toHaveBeenCalled();
  });

  it('consumes the one-time token and stores only a password hash', async () => {
    repositorio.esvalidotokenconfiguracioncontrasenaestudiante.mockResolvedValue(true);
    repositorio.completarconfiguracioncontrasenaestudiante.mockResolvedValue({
      userId: 'student-user-1',
      studentId: 'student-1',
    });
    const token = 'activation-token-that-is-never-a-password';
    const contrasena = 'a-long-student-password';

    await expect(
      usocaso.ejecutar({ activationToken: token, newPassword: contrasena, ipAddress: '127.0.0.1' }),
    ).resolves.toEqual({ activated: true });

    const configuracion = repositorio.completarconfiguracioncontrasenaestudiante.mock.calls[0][0];
    const resumentoken = 'activation-token-hash';
    expect(repositorio.esvalidotokenconfiguracioncontrasenaestudiante).toHaveBeenCalledWith(
      expect.objectContaining({ tokenHash: resumentoken }),
    );
    expect(seguridad.resumirtoken).toHaveBeenCalledWith(token);
    expect(configuracion.tokenHash).toBe(resumentoken);
    expect(configuracion.passwordHash).toBe('bcrypt-password-hash');
    expect(configuracion.ipAddress).toBe('127.0.0.1');
    expect(seguridad.resumircontrasena).toHaveBeenCalledWith(contrasena);
  });

  it('rejects expired or consumed tokens without writing an audit event', async () => {
    repositorio.esvalidotokenconfiguracioncontrasenaestudiante.mockResolvedValue(false);

    await expect(
      usocaso.ejecutar({
        activationToken: 'activation-token-that-is-never-a-password',
        newPassword: 'a-long-student-password',
      }),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);
    expect(repositorio.completarconfiguracioncontrasenaestudiante).not.toHaveBeenCalled();
  });
});
