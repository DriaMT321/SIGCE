import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoencontrado } from '../../../../core/application/aplicacionerror';
import {
  tokenrepositoriomaterias,
  repositoriomaterias,
} from '../../domain/repositories/asignatura.repository.interface';
import { dtocrearmateria, dtoactualizarmateria } from '../dto/asignatura.dto';

@servicioaplicacion()
export class casousocrearmateria {
  constructor(
    @inyectarpuerto(tokenrepositoriomaterias) private readonly repositorio: repositoriomaterias,
  ) {}

  ejecutar(
    dto: dtocrearmateria,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    return this.repositorio.crear(
      {
        name: dto.name.trim(),
        code: dto.code.trim().toUpperCase(),
        description: dto.description?.trim() || undefined,
        area: dto.area?.trim() || undefined,
      },
      { userId: idusuario, ipAddress: ipdireccion, correlationId: correlacionid },
    );
  }
}

@servicioaplicacion()
export class casousoactualizarmateria {
  constructor(
    @inyectarpuerto(tokenrepositoriomaterias) private readonly repositorio: repositoriomaterias,
  ) {}

  async ejecutar(
    id: string,
    dto: dtoactualizarmateria,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Materia no encontrada');
    const actualizada = await this.repositorio.actualizar(
      id,
      {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.code !== undefined ? { code: dto.code.trim().toUpperCase() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() || undefined }
          : {}),
        ...(dto.area !== undefined ? { area: dto.area.trim() || undefined } : {}),
      },
      { userId: idusuario, ipAddress: ipdireccion, correlationId: correlacionid },
    );
    if (!actualizada) throw new errornoencontrado('Materia no encontrada');
    return actualizada;
  }
}

@servicioaplicacion()
export class casousoeliminarmateria {
  constructor(
    @inyectarpuerto(tokenrepositoriomaterias) private readonly repositorio: repositoriomaterias,
  ) {}

  async ejecutar(id: string, idusuario: string, ipdireccion?: string, correlacionid?: string) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Materia no encontrada');
    await this.repositorio.eliminar(id, {
      userId: idusuario,
      ipAddress: ipdireccion,
      correlationId: correlacionid,
    });
  }
}
