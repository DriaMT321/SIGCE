import {
  errorsolicitudincorrecta,
  errorconflictoaplicacion,
} from '../../../../core/application/aplicacionerror';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { rolusuario } from '@academic/shared-types';
import { repositoriousuarios } from '../../domain/repositories/usuario.repository.interface';
import { dtocrearusuario } from '../dto/crearusuario.dto';
import { casousocrearusuario } from './crearusuario.use-case';

function configuracion() {
  const repositoriousuarios = {
    buscarporcorreo: jest.fn().mockResolvedValue(null),
    crear: jest.fn().mockResolvedValue({
      id: 'user-1',
      email: 'new@example.test',
      role: rolusuario.SECRETARY,
      fullName: 'New User',
    }),
  } as unknown as jest.Mocked<repositoriousuarios>;
  const seguridadcredenciales = {
    resumircontrasena: jest.fn().mockResolvedValue('bcrypt-hash'),
  };
  return {
    userRepo: repositoriousuarios,
    credentialSecurity: seguridadcredenciales,
    useCase: new casousocrearusuario(repositoriousuarios, seguridadcredenciales as never),
  };
}

const entrada: dtocrearusuario = {
  email: 'new@example.test',
  password: 'long-enough-password',
  firstName: 'New',
  lastName: 'User',
  role: rolusuario.SECRETARY,
};

describe('CreateUserUseCase', () => {
  it('rechaza contraseñas cortas antes de consultar o crear usuarios', async () => {
    const { useCase: usocaso, userRepo: repositoriousuarios, credentialSecurity } = configuracion();

    await expect(
      usocaso.ejecutar({ ...entrada, password: 'corta123456' }, 'admin-1'),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);

    expect(repositoriousuarios.buscarporcorreo).not.toHaveBeenCalled();
    expect(credentialSecurity.resumircontrasena).not.toHaveBeenCalled();
  });

  it.each([rolusuario.TEACHER, rolusuario.PARENT])(
    'deriva la creación del rol %s a su módulo correspondiente',
    async (role) => {
      const { useCase: usocaso, userRepo: repositoriousuarios } = configuracion();

      await expect(usocaso.ejecutar({ ...entrada, role }, 'admin-1')).rejects.toBeInstanceOf(
        errorsolicitudincorrecta,
      );

      expect(repositoriousuarios.buscarporcorreo).not.toHaveBeenCalled();
      expect(repositoriousuarios.crear).not.toHaveBeenCalled();
    },
  );

  it('no permite crear otra cuenta administrativa desde el flujo general', async () => {
    const { useCase: usocaso, userRepo: repositoriousuarios } = configuracion();
    await expect(
      usocaso.ejecutar({ ...entrada, role: rolusuario.ADMINISTRATIVE }, 'admin-1'),
    ).rejects.toBeInstanceOf(errorsolicitudincorrecta);
    expect(repositoriousuarios.crear).not.toHaveBeenCalled();
  });

  it('rechaza correos repetidos antes de crear el usuario', async () => {
    const { useCase: usocaso, userRepo: repositoriousuarios } = configuracion();
    repositoriousuarios.buscarporcorreo.mockResolvedValueOnce({ id: 'existing-user' } as never);
    await expect(usocaso.ejecutar(entrada, 'admin-1')).rejects.toBeInstanceOf(
      errorconflictoaplicacion,
    );
    expect(repositoriousuarios.crear).not.toHaveBeenCalled();
  });

  it('envía solo el hash al repositorio', async () => {
    const {
      useCase: usocaso,
      userRepo: repositoriousuarios,
      credentialSecurity: seguridadcredenciales,
    } = configuracion();
    await usocaso.ejecutar(entrada, 'admin-1', '127.0.0.1');
    const [datos] = repositoriousuarios.crear.mock.calls[0];
    expect(seguridadcredenciales.resumircontrasena).toHaveBeenCalledWith(entrada.password);
    expect(datos.passwordHash).not.toBe(entrada.password);
    expect(repositoriousuarios.crear.mock.calls[0][1]).toEqual({
      userId: 'admin-1',
      ipAddress: '127.0.0.1',
    });
  });
});
