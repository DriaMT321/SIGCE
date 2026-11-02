import {
  servicioaplicacion,
  inyectarpuerto,
  dependenciaopcional,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorsolicitudincorrecta,
  errorprohibido,
  errornoencontrado,
  errorconflictoaplicacion,
} from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import { asistenciaregistrada } from '../../../../core/application/eventos/asistenciaregistrada.event';
import {
  tokenbuseventosaplicacion,
  buseventosaplicacion,
} from '../../../../core/application/buseventosaplicacion.port';
import {
  tokenrepositorioasistencias,
  repositorioasistencias,
} from '../../domain/repositories/asistencia.repository.interface';
import {
  exigirasistenciavalida,
  obtenerdiaasistencia,
} from '../../domain/services/politicaasistencia';
import { dtocrearasistencia, dtoactualizarasistencia } from '../dto/asistencia.dto';
import {
  tokenevaluacionalertatemprana,
  puertoevaluacionalertatemprana,
} from '../../../alerts/application/ports/evaluacionalertatemprana.port';

@servicioaplicacion()
export class casousolistarasistencias {
  constructor(
    @inyectarpuerto(tokenrepositorioasistencias)
    private readonly repositorio: repositorioasistencias,
  ) {}
  ejecutar(consulta: {
    studentId?: string;
    courseId?: string;
    from?: Date;
    to?: Date;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    return this.repositorio.buscartodos(consulta);
  }
}

async function asegurarasignaciondocentecurso(
  repositorio: repositorioasistencias,
  idusuario: string,
  rolactual: rolusuario,
  idcurso: string,
  idgestionacademica: string,
): Promise<void> {
  if (rolactual !== rolusuario.TEACHER) return;
  const estado = await repositorio.obtenerestadoasignacioncursodocente(
    idusuario,
    idcurso,
    idgestionacademica,
  );
  if (estado === 'NO_PROFILE')
    throw new errorprohibido('El usuario no tiene un perfil docente asociado');
  if (estado === 'UNASSIGNED')
    throw new errorprohibido('El docente no tiene asignación académica para este curso');
}

@servicioaplicacion()
export class casousocrearasistencia {
  constructor(
    @inyectarpuerto(tokenrepositorioasistencias)
    private readonly repositorio: repositorioasistencias,
    @inyectarpuerto(tokenbuseventosaplicacion) private readonly eventobus: buseventosaplicacion,
  ) {}

  async ejecutar(
    dto: dtocrearasistencia,
    registradoporid: string,
    ipdireccion: string | undefined,
    rolactual: rolusuario,
  ) {
    exigirasistenciavalida(dto.status, dto.justification);
    const fecha = obtenerdiaasistencia(dto.date);
    const contexto = await this.repositorio.obtenercontextocreacion(dto.studentId, dto.courseId);
    if (!contexto.student || contexto.student.deleted || !contexto.student.active) {
      throw new errornoencontrado('Estudiante activo no encontrado');
    }
    const curso = contexto.course;
    if (!curso) throw new errornoencontrado('Curso no encontrado');
    if (contexto.enrollmentAcademicYearId !== curso.academicYearId) {
      throw new errorsolicitudincorrecta('El estudiante no tiene matrícula activa en este curso');
    }
    if (
      curso.academicYear.closed ||
      fecha < curso.academicYear.startsAt ||
      fecha > curso.academicYear.endsAt
    ) {
      throw new errorsolicitudincorrecta('La fecha está fuera de la gestión académica abierta');
    }
    await asegurarasignaciondocentecurso(
      this.repositorio,
      registradoporid,
      rolactual,
      curso.id,
      curso.academicYearId,
    );
    if (await this.repositorio.existeasistencia(dto.studentId, dto.courseId, fecha)) {
      throw new errorconflictoaplicacion(
        'La asistencia de este estudiante ya está registrada para esa fecha',
      );
    }

    const asistencia = await this.repositorio.crear(
      { ...dto, date: fecha, registeredById: registradoporid },
      { userId: registradoporid, ipAddress: ipdireccion },
      { ...(rolactual === rolusuario.TEACHER ? { teacherUserId: registradoporid } : {}) },
    );
    const evento: asistenciaregistrada = {
      type: 'attendance.registered',
      attendanceId: asistencia.id,
      studentId: asistencia.studentId,
      courseId: asistencia.courseId,
      date: asistencia.date.toISOString(),
      status: asistencia.status,
    };
    await this.eventobus.publicar(evento);
    return asistencia;
  }
}

@servicioaplicacion()
export class casousoactualizarasistencia {
  constructor(
    @inyectarpuerto(tokenrepositorioasistencias)
    private readonly repositorio: repositorioasistencias,
    @inyectarpuerto(tokenevaluacionalertatemprana)
    @dependenciaopcional()
    private readonly evaluaralertas?: puertoevaluacionalertatemprana,
  ) {}

  async ejecutar(
    id: string,
    dto: dtoactualizarasistencia,
    idusuario: string,
    ipdireccion: string | undefined,
    rolactual: rolusuario,
  ) {
    exigirasistenciavalida(dto.status, dto.justification);
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Registro de asistencia no encontrado');
    const idgestionacademica = await this.repositorio.obteneridanioacademicocurso(
      anterior.courseId,
    );
    if (!idgestionacademica) throw new errornoencontrado('Curso no encontrado');
    await asegurarasignaciondocentecurso(
      this.repositorio,
      idusuario,
      rolactual,
      anterior.courseId,
      idgestionacademica,
    );

    const asistencia = await this.repositorio.actualizar(
      id,
      dto,
      { userId: idusuario, ipAddress: ipdireccion },
      { ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}) },
    );
    await this.evaluaralertas?.ejecutarsiesposible(asistencia.studentId);
    return asistencia;
  }
}
