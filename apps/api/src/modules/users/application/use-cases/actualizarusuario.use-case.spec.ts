import { rolusuario } from '@academic/shared-types';
import { revocacionsesionesusuario } from '../../../auth/application/ports/usuariosesionrevocacion.port';
import { repositoriousuarios } from '../../domain/repositories/usuario.repository.interface';
import { entidadusuario } from '../../domain/entities/usuario.entity';
import { casousoactualizarusuario } from './actualizarusuario.use-case';

const antes = new entidadusuario(
  'user-1',
  'staff@example.test',
  'Ana',
  'Rojas',
  rolusuario.SECRETARY,
  true,
  new Date('2026-01-01T00:00:00.000Z'),
  new Date('2026-01-01T00:00:00.000Z'),
);

function configuracion() {
  const actualizado = new entidadusuario(
    antes.id,
    antes.correoElectronico,
    'Ana María',
    antes.lastName,
    antes.rol,
    false,
    antes.createdAt,
    new Date('2026-10-22T00:00:00.000Z'),
  );
  const repositoriousuarios = {
    buscarporidentificador: jest.fn().mockResolvedValue(antes),
    actualizar: jest.fn().mockResolvedValue(actualizado),
  } as unknown as jest.Mocked<repositoriousuarios>;
  const sesiones = {
    revocarsesionesusuario: jest.fn(),
  } as jest.Mocked<revocacionsesionesusuario>;
  return {
    userRepo: repositoriousuarios,
    sessions: sesiones,
    updated: actualizado,
    useCase: new casousoactualizarusuario(repositoriousuarios, sesiones),
  };
}

describe('UpdateUserUseCase', () => {
  it('updates profile and status and records a secret-free audit event', async () => {
    const {
      userRepo: repositoriousuarios,
      sessions: sesiones,
      updated: actualizado,
      useCase: usocaso,
    } = configuracion();

    const resultado = await usocaso.ejecutar(
      'user-1',
      { firstName: 'Ana María', isActive: false },
      'director-1',
      '127.0.0.1',
    );

    expect(resultado).toBe(actualizado);
    expect(repositoriousuarios.actualizar).toHaveBeenCalledWith(
      'user-1',
      {
        firstName: 'Ana María',
        lastName: undefined,
        isActive: false,
      },
      { userId: 'director-1', ipAddress: '127.0.0.1' },
    );
    expect(sesiones.revocarsesionesusuario).toHaveBeenCalledWith('user-1');
  });

  it.each([rolusuario.TEACHER, rolusuario.PARENT, rolusuario.STUDENT])(
    'requires the academic profile endpoint to change names for %s accounts',
    async (rol) => {
      const {
        userRepo: repositoriousuarios,
        sessions: sesiones,
        useCase: usocaso,
      } = configuracion();
      repositoriousuarios.buscarporidentificador.mockResolvedValue(
        new entidadusuario(
          'user-1',
          'staff@example.test',
          'Ana',
          'Rojas',
          rol,
          true,
          antes.createdAt,
          antes.updatedAt,
        ),
      );

      await expect(
        usocaso.ejecutar('user-1', { firstName: 'Nuevo' }, 'director-1'),
      ).rejects.toMatchObject({ code: 'FORBIDDEN' });

      expect(repositoriousuarios.actualizar).not.toHaveBeenCalled();
      expect(sesiones.revocarsesionesusuario).not.toHaveBeenCalled();
    },
  );

  it('does not allow a user to disable their own account', async () => {
    const { userRepo: repositoriousuarios, sessions: sesiones, useCase: usocaso } = configuracion();
    repositoriousuarios.buscarporidentificador.mockResolvedValue(
      new entidadusuario(
        'admin-1',
        'admin@example.test',
        'Admin',
        'User',
        rolusuario.ADMINISTRATIVE,
        true,
        antes.createdAt,
        antes.updatedAt,
      ),
    );

    await expect(usocaso.ejecutar('admin-1', { isActive: false }, 'admin-1')).rejects.toMatchObject(
      {
        code: 'FORBIDDEN',
      },
    );

    expect(repositoriousuarios.actualizar).not.toHaveBeenCalled();
    expect(sesiones.revocarsesionesusuario).not.toHaveBeenCalled();
  });
});
