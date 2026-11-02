import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
import {
  tokenrepositorioperiodosacademicos,
  repositorioperiodosacademicos,
} from '../../domain/repositories/periodoacademico.repository.interface';
import { dtocrearperiodo } from '../dto/periodo.dto';

@servicioaplicacion()
export class casousocrearperiodo {
  constructor(
    @inyectarpuerto(tokenrepositorioperiodosacademicos)
    private readonly repositorio: repositorioperiodosacademicos,
  ) {}

  ejecutar(
    dto: dtocrearperiodo,
    idusuario: string,
    ipdireccion?: string,
    correlacionid?: string,
  ) {
    const fechainicio = new Date(dto.startDate);
    const fechafin = new Date(dto.endDate);
    if (Number.isNaN(fechainicio.getTime()) || Number.isNaN(fechafin.getTime())) {
      throw new errorsolicitudincorrecta('Las fechas del período no son válidas');
    }
    if (fechainicio >= fechafin) {
      throw new errorsolicitudincorrecta(
        'La fecha de inicio del período debe ser anterior a la fecha de fin',
      );
    }
    return this.repositorio.crear(
      {
        academicYearId: dto.academicYearId,
        name: dto.name.trim(),
        number: dto.number,
        startDate: fechainicio,
        endDate: fechafin,
      },
      { userId: idusuario, ipAddress: ipdireccion, correlationId: correlacionid },
    );
  }
}
