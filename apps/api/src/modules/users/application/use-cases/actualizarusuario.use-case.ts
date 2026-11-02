import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errorprohibido, errornoencontrado } from '../../../../core/application/aplicacionerror';
import {
  repositoriousuarios,
  constanterepositoriousuarios,
} from '../../domain/repositories/usuario.repository.interface';
import { rolusuario } from '@academic/domain-kernel';
import { dtoactualizarusuario } from '../dto/crearusuario.dto';
import {
  tokenrevocacionsesionesusuario,
  revocacionsesionesusuario,
} from '../../../auth/application/ports/usuariosesionrevocacion.port';

@servicioaplicacion()
export class casousoactualizarusuario {
  constructor(
    @inyectarpuerto(constanterepositoriousuarios)
    private readonly repositoriousuarios: repositoriousuarios,
    @inyectarpuerto(tokenrevocacionsesionesusuario)
    private readonly sesiones: revocacionsesionesusuario,
  ) {}

  async ejecutar(
    id: string,
    dto: dtoactualizarusuario,
    idusuarioactual: string,
    direccionip?: string,
  ) {
    const existente = await this.repositoriousuarios.buscarporidentificador(id);
    if (!existente) {
      throw new errornoencontrado('Usuario no encontrado');
    }
    if (idusuarioactual === id && dto.isActive === false) {
      throw new errorprohibido('No puedes desactivar tu propia cuenta.');
    }
    if (
      [rolusuario.TEACHER, rolusuario.PARENT, rolusuario.STUDENT].includes(existente.rol) &&
      (dto.firstName !== undefined || dto.lastName !== undefined)
    ) {
      throw new errorprohibido(
        'Actualiza los nombres desde el perfil académico de docentes, familiares o estudiantes.',
      );
    }

    const actualizado = await this.repositoriousuarios.actualizar(
      id,
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        isActive: dto.isActive,
      },
      { userId: idusuarioactual, ipAddress: direccionip },
    );

    if (dto.isActive !== undefined && dto.isActive !== existente.isActive) {
      await this.sesiones.revocarsesionesusuario(id);
    }

    return actualizado;
  }
}
