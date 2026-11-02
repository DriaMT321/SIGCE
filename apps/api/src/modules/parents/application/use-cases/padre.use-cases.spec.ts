import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { casousocrearfamiliar } from './padre.use-cases';

describe('caso de uso para crear familiar', () => {
  it('rechaza una contraseña corta antes de persistir', async () => {
    const repositorio = { crear: jest.fn() };
    const seguridad = { resumircontrasena: jest.fn() };
    const caso = new casousocrearfamiliar(repositorio as never, seguridad as never);

    await expect(
      caso.ejecutar(
        {
          email: 'familiar@example.test',
          password: 'corta123456',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          phone: '70000000',
        },
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);

    expect(repositorio.crear).not.toHaveBeenCalled();
    expect(seguridad.resumircontrasena).not.toHaveBeenCalled();
  });

  it('persiste solo el hash generado por el servicio de credenciales', async () => {
    const repositorio = { crear: jest.fn().mockResolvedValue({ id: 'familiar-1' }) };
    const seguridad = { resumircontrasena: jest.fn().mockResolvedValue('hash-seguro') };
    const caso = new casousocrearfamiliar(repositorio as never, seguridad as never);
    const contrasena = 'clave-familiar-segura-123';

    await caso.ejecutar(
      {
        email: 'familiar@example.test',
        password: contrasena,
        ci: '1234567',
        firstName: 'Ana',
        lastName: 'Paz',
        phone: '70000000',
      },
      'admin-1',
    );

    expect(seguridad.resumircontrasena).toHaveBeenCalledWith(contrasena);
    expect(repositorio.crear.mock.calls[0][0]).toEqual(
      expect.objectContaining({ passwordHash: 'hash-seguro' }),
    );
    expect(repositorio.crear.mock.calls[0][0]).not.toHaveProperty('password');
  });
});
