import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { rolusuario } from '@academic/domain-kernel';
import { repositoriousuarios } from '../../domain/repositories/usuario.repository.interface';
import { repositoriocredencialesusuario } from '../../domain/repositories/usuariocredencial.repository.interface';
import { seguridadcredencialespuerto } from '../../../auth/application/ports/seguridadcredencial.port';
import { revocacionsesionesusuario } from '../../../auth/application/ports/usuariosesionrevocacion.port';
import { casousorestablecercontrasenausuario } from './restablecercontrasenausuario.use-case';

describe('caso de uso para restablecer contraseña', () => {
  it('rechaza contraseñas cortas antes de consultar usuarios o resumir la clave', async () => {
    const usuarios = { buscarporidentificador: jest.fn() } as unknown as repositoriousuarios;
    const credenciales = {
      restablecercontrasenayregistrarauditoria: jest.fn(),
    } as unknown as repositoriocredencialesusuario;
    const seguridad = { resumircontrasena: jest.fn() } as unknown as seguridadcredencialespuerto;
    const sesiones = { revocarsesionesusuario: jest.fn() } as unknown as revocacionsesionesusuario;
    const caso = new casousorestablecercontrasenausuario(
      usuarios,
      credenciales,
      seguridad,
      sesiones,
    );

    await expect(
      caso.ejecutar('user-1', 'corta123456', { id: 'admin-1', role: rolusuario.ADMINISTRATIVE }),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);

    expect(usuarios.buscarporidentificador).not.toHaveBeenCalled();
    expect(seguridad.resumircontrasena).not.toHaveBeenCalled();
  });
});
