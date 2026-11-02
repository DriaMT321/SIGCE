import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorsolicitudincorrecta,
  errornoencontrado,
} from '../../../../core/application/aplicacionerror';
import {
  tokenrepositorioanioacademico,
  repositorioanioacademico,
} from '../../domain/repositories/anioacademico.repository.interface';
import { dtocrearanioacademico, dtoactualizaranioacademico } from '../dto/anioacademico.dto';

function validarrango(fechainicio: Date, fechafin: Date): void {
  if (Number.isNaN(fechainicio.getTime()) || Number.isNaN(fechafin.getTime())) {
    throw new errorsolicitudincorrecta('Las fechas de la gestión no son válidas');
  }
  if (fechainicio >= fechafin) {
    throw new errorsolicitudincorrecta(
      'La fecha de inicio debe ser anterior a la fecha de fin de la gestión',
    );
  }
}

@servicioaplicacion()
export class casousocrearanioacademico {
  constructor(
    @inyectarpuerto(tokenrepositorioanioacademico)
    private readonly repositorio: repositorioanioacademico,
  ) {}

  ejecutar(
    dto: dtocrearanioacademico,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    const fechainicio = new Date(dto.startDate);
    const fechafin = new Date(dto.endDate);
    validarrango(fechainicio, fechafin);
    return this.repositorio.crear(
      {
        year: dto.year,
        name: dto.name.trim(),
        startDate: fechainicio,
        endDate: fechafin,
        isActive: dto.isActive,
      },
      { userId: idusuario, ipAddress: ipdireccion, correlationId: correlacionid },
    );
  }
}

@servicioaplicacion()
export class casousoactualizaranioacademico {
  constructor(
    @inyectarpuerto(tokenrepositorioanioacademico)
    private readonly repositorio: repositorioanioacademico,
  ) {}

  async ejecutar(
    id: string,
    dto: dtoactualizaranioacademico,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Gestión académica no encontrada');

    const fechainicio = dto.startDate ? new Date(dto.startDate) : anterior.startDate;
    const fechafin = dto.endDate ? new Date(dto.endDate) : anterior.endDate;
    validarrango(fechainicio, fechafin);

    const actualizado = await this.repositorio.actualizar(
      id,
      {
        ...(dto.year !== undefined ? { year: dto.year } : {}),
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.startDate ? { startDate: fechainicio } : {}),
        ...(dto.endDate ? { endDate: fechafin } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.isClosed !== undefined ? { isClosed: dto.isClosed } : {}),
      },
      { userId: idusuario, ipAddress: ipdireccion, correlationId: correlacionid },
    );
    if (!actualizado) throw new errornoencontrado('Gestión académica no encontrada');
    return actualizado;
  }
}

@servicioaplicacion()
export class casousoeliminaranioacademico {
  constructor(
    @inyectarpuerto(tokenrepositorioanioacademico)
    private readonly repositorio: repositorioanioacademico,
  ) {}

  async ejecutar(
    id: string,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Gestión académica no encontrada');
    await this.repositorio.eliminar(id, {
      userId: idusuario,
      ipAddress: ipdireccion,
      correlationId: correlacionid,
    });
  }
}
