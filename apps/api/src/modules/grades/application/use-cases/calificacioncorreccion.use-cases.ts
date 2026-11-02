import {
  servicioaplicacion,
  inyectarpuerto,
  dependenciaopcional,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorsolicitudincorrecta,
  errorprohibido,
  errornoencontrado,
} from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import { solicitudcorreccioncalificacion } from '../../domain/entities/solicitudcorreccioncalificacion.entity';
import {
  tokenrepositoriocorreccionescalificacion,
  repositoriocorreccionescalificacion,
} from '../../domain/repositories/calificacioncorreccion.repository.interface';
import {
  tokenrepositoriocalificaciones,
  repositoriocalificaciones,
} from '../../domain/repositories/calificacion.repository.interface';
import {
  dtodecidircorreccioncalificacion,
  dtosolicitarcorreccioncalificacion,
} from '../dto/calificacioncorreccion.dto';
import { valorcalificacion } from '../../domain/value-objects/calificacionvalor';
import {
  tokenevaluacionalertatemprana,
  puertoevaluacionalertatemprana,
} from '../../../alerts/application/ports/evaluacionalertatemprana.port';

@servicioaplicacion()
export class casousosolicitarcorreccioncalificacion {
  constructor(
    @inyectarpuerto(tokenrepositoriocalificaciones)
    private readonly calificaciones: repositoriocalificaciones,
    @inyectarpuerto(tokenrepositoriocorreccionescalificacion)
    private readonly correcciones: repositoriocorreccionescalificacion,
  ) {}

  async ejecutar(
    dto: dtosolicitarcorreccioncalificacion,
    idusuario: string,
    rolactual: rolusuario,
    ipdireccion?: string,
  ) {
    const calificacion = await this.calificaciones.buscarporidentificador(dto.gradeId);
    if (!calificacion) throw new errornoencontrado('Calificación no encontrada');
    const contexto = await this.calificaciones.obtenercontextoescritura({
      periodId: calificacion.periodId,
      subjectId: calificacion.subjectId,
      enrollmentIds: [calificacion.enrollmentId],
      ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}),
    });
    if (!contexto.period) throw new errornoencontrado('Período académico no encontrado');
    if (!contexto.period.isClosed) {
      throw new errorsolicitudincorrecta(
        'Las solicitudes de corrección se reservan para períodos cerrados',
      );
    }
    if (
      rolactual === rolusuario.TEACHER &&
      (!contexto.teacherProfileExists || !contexto.hasAssignment)
    ) {
      throw new errorprohibido('El docente no tiene asignación para esta calificación');
    }

    const solicitud = solicitudcorreccioncalificacion.enviar({
      previousValue: calificacion.value,
      proposedValue: valorcalificacion.desde(dto.proposedValue).valor,
      reason: dto.reason,
      evidenceReference: dto.evidenceReference,
    });
    return this.correcciones.crear({
      gradeId: calificacion.id,
      requestedById: idusuario,
      previousValue: solicitud.previousValue,
      proposedValue: solicitud.proposedValue,
      reason: solicitud.motivo,
      evidenceReference: solicitud.evidenceReference,
      ipAddress: ipdireccion,
    });
  }
}

@servicioaplicacion()
export class casousolistarcorreccionescalificacion {
  constructor(
    @inyectarpuerto(tokenrepositoriocorreccionescalificacion)
    private readonly correcciones: repositoriocorreccionescalificacion,
  ) {}

  ejecutar(consulta: {
    status?: 'PENDING' | 'EXECUTED' | 'REJECTED';
    requestedById?: string;
    limit: number;
    offset: number;
  }) {
    return this.correcciones.buscartodos(consulta);
  }
}

@servicioaplicacion()
export class casousodecidircorreccioncalificacion {
  constructor(
    @inyectarpuerto(tokenrepositoriocorreccionescalificacion)
    private readonly correcciones: repositoriocorreccionescalificacion,
    @inyectarpuerto(tokenevaluacionalertatemprana)
    @dependenciaopcional()
    private readonly evaluaralertas?: puertoevaluacionalertatemprana,
  ) {}

  async ejecutar(
    idsolicitud: string,
    dto: dtodecidircorreccioncalificacion,
    idusuario: string,
    ipdireccion?: string,
  ) {
    const estadodecision = await this.correcciones.buscarestadodecision(idsolicitud);
    if (!estadodecision) throw new errornoencontrado('Solicitud de corrección no encontrada');
    solicitudcorreccioncalificacion
      .rehidratar(estadodecision)
      .decidir(dto.approve ? 'EXECUTED' : 'REJECTED', dto.decisionReason);

    const correccion = await this.correcciones.decidir({
      requestId: idsolicitud,
      decidedById: idusuario,
      decision: dto.approve ? 'EXECUTED' : 'REJECTED',
      decisionReason: dto.decisionReason.trim(),
      ipAddress: ipdireccion,
    });
    if (dto.approve) await this.evaluaralertas?.ejecutarsiesposible(correccion.grade.studentId);
    return correccion;
  }
}
