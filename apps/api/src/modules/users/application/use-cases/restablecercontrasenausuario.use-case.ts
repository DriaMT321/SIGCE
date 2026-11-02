import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorprohibido,
  errornoencontrado,
  errorconflictoaplicacion,
} from '../../../../core/application/aplicacionerror';
import { actorusuario } from '../../../../core/application/actorusuario';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../../../auth/application/ports/seguridadcredencial.port';
import {
  tokenrevocacionsesionesusuario,
  revocacionsesionesusuario,
} from '../../../auth/application/ports/usuariosesionrevocacion.port';
import {
  repositoriousuarios,
  constanterepositoriousuarios,
} from '../../domain/repositories/usuario.repository.interface';
import {
  tokenrepositoriocredencialesusuario,
  repositoriocredencialesusuario,
} from '../../domain/repositories/usuariocredencial.repository.interface';
import { validarcontrasena } from '../../../../core/domain/policies/politicacontrasena';

@servicioaplicacion()
export class casousorestablecercontrasenausuario {
  constructor(
    @inyectarpuerto(constanterepositoriousuarios) private readonly usuarios: repositoriousuarios,
    @inyectarpuerto(tokenrepositoriocredencialesusuario)
    private readonly credenciales: repositoriocredencialesusuario,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
    @inyectarpuerto(tokenrevocacionsesionesusuario)
    private readonly sesiones: revocacionsesionesusuario,
  ) {}

  async ejecutar(
    idusuario: string,
    contrasenanueva: string,
    actor: actorusuario,
    direccionip?: string,
  ): Promise<{ reset: true }> {
    validarcontrasena(contrasenanueva);
    const objetivo = await this.usuarios.buscarporidentificador(idusuario);
    if (!objetivo || objetivo.deletedAt) throw new errornoencontrado('Usuario no encontrado');
    if (objetivo.passwordSetupRequired) {
      throw new errorconflictoaplicacion(
        'La cuenta estudiantil debe completar su flujo de activación.',
      );
    }
    if (
      (objetivo.rol === 'ADMINISTRATIVE' &&
        (actor.role !== 'ADMINISTRATIVE' || actor.id === objetivo.id)) ||
      !['ADMINISTRATIVE'].includes(actor.role)
    ) {
      throw new errorprohibido('No tienes autorización para restablecer esta cuenta.');
    }

    const hashcontrasena = await this.seguridadcredenciales.resumircontrasena(contrasenanueva);
    await this.credenciales.restablecercontrasenayregistrarauditoria({
      userId: idusuario,
      passwordHash: hashcontrasena,
      actorUserId: actor.id,
      actorRole: actor.role,
      ipAddress: direccionip,
    });
    await this.sesiones.revocarsesionesusuario(idusuario);

    return { reset: true };
  }
}
