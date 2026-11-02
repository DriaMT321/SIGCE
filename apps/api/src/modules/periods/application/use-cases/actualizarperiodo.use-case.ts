import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorsolicitudincorrecta,
  errornoencontrado,
} from '../../../../core/application/aplicacionerror';
import { dtoactualizarperiodo } from '../dto/periodo.dto';
import {
  tokenrepositorioperiodosacademicos,
  repositorioperiodosacademicos,
} from '../../domain/repositories/periodoacademico.repository.interface';

@servicioaplicacion()
export class casousoactualizarperiodo {
  constructor(
    @inyectarpuerto(tokenrepositorioperiodosacademicos)
    private readonly repositorio: repositorioperiodosacademicos,
  ) {}

  async ejecutar(
    id: string,
    dto: dtoactualizarperiodo,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    if (dto.isClosed === true && (!dto.confirmClose || dto.expectedGradeCount === undefined)) {
      throw new errorsolicitudincorrecta(
        'Confirme el cierre después de revisar el resumen del período',
      );
    }

    const actualizado = await this.repositorio.actualizar(
      id,
      {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.isClosed !== undefined ? { isClosed: dto.isClosed } : {}),
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
      },
      {
        userId: idusuario,
        ipAddress: ipdireccion,
        correlationId: correlacionid,
        expectedGradeCount: dto.expectedGradeCount,
      },
    );
    if (!actualizado) throw new errornoencontrado('Periodo académico no encontrado');
    return actualizado;
  }
}
