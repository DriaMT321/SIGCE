import { seguridadcredencialespuerto } from '../../../auth/application/ports/seguridadcredencial.port';
import { fabricacredencialesactivacionestudiante } from './credencialactivacionestudiante.factory';

describe('StudentActivationCredentialFactory', () => {
  it('issues a short-lived one-time token and stores only its hashes', async () => {
    const seguridad = {
      generartoken: jest
        .fn()
        .mockReturnValueOnce('public-activation-token')
        .mockReturnValueOnce('placeholder-password'),
      resumirtoken: jest.fn().mockReturnValue('activation-hash'),
      resumircontrasena: jest.fn().mockResolvedValue('placeholder-password-hash'),
    } as unknown as jest.Mocked<seguridadcredencialespuerto>;

    const emitido = await new fabricacredencialesactivacionestudiante(seguridad).emitir();

    expect(emitido.token).toBe('public-activation-token');
    expect(emitido.setup.activationTokenHash).toBe('activation-hash');
    expect(emitido.setup.placeholderPasswordHash).toBe('placeholder-password-hash');
    expect(emitido.setup.activationExpiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(seguridad.resumirtoken).toHaveBeenCalledWith('public-activation-token');
    expect(seguridad.resumircontrasena).toHaveBeenCalledWith('placeholder-password');
  });
});
