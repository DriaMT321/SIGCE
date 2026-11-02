import {
  servicioaplicacion,
  inyectarpuerto,
  dependenciaopcional,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoencontrado } from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import {
  tokenrepositoriocalificaciones,
  repositoriocalificaciones,
} from '../../domain/repositories/calificacion.repository.interface';
import {
  dtocrearcalificacion,
  dtoactualizarcalificacion,
  dtocrearcalificacionesmasivas,
  dtopublicarcalificaciones,
} from '../dto/calificacion.dto';
import { validarescrituracalificacion } from './validarregistrocalificacion';
import { gradeaggregate } from '../../domain/aggregates/grade.aggregate';
import {
  tokenevaluacionalertatemprana,
  puertoevaluacionalertatemprana,
} from '../../../alerts/application/ports/evaluacionalertatemprana.port';

@servicioaplicacion()
export class casousolistarcalificaciones {
  constructor(
    @inyectarpuerto(tokenrepositoriocalificaciones)
    private readonly repositorio: repositoriocalificaciones,
  ) {}
  ejecutar(consulta: {
    search?: string;
    studentId?: string;
    subjectId?: string;
    enrollmentId?: string;
    courseId?: string;
    periodId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    return this.repositorio.buscartodos(consulta);
  }
}

@servicioaplicacion()
export class registrarcalificacion {
  constructor(
    @inyectarpuerto(tokenrepositoriocalificaciones)
    private readonly repositorio: repositoriocalificaciones,
    @inyectarpuerto(tokenevaluacionalertatemprana)
    @dependenciaopcional()
    private readonly evaluaralertas?: puertoevaluacionalertatemprana,
  ) {}

  async ejecutar(
    dto: dtocrearcalificacion,
    idusuario: string,
    ipdireccion: string | undefined,
    rolactual: rolusuario,
    correlacionid?: string,
  ) {
    const calificacionregistrada = gradeaggregate.registrar(dto);
    await validarescrituracalificacion(
      this.repositorio,
      {
        periodId: dto.periodId,
        subjectId: dto.subjectId,
        grades: [{ enrollmentId: dto.enrollmentId, studentId: dto.studentId }],
        reason: dto.reason,
      },
      idusuario,
      rolactual,
    );

    const { reason: motivo } = dto;
    const calificacion = await this.repositorio.crear(
      calificacionregistrada.convertiradatoscreacion(),
      {
        userId: idusuario,
        ipAddress: ipdireccion,
        correlationId: correlacionid,
        reason: motivo?.trim(),
      },
      { ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}) },
    );
    await this.evaluaralertas?.ejecutarsiesposible(calificacion.studentId);
    return calificacion;
  }
}

@servicioaplicacion()
export class casousoactualizarcalificacion {
  constructor(
    @inyectarpuerto(tokenrepositoriocalificaciones)
    private readonly repositorio: repositoriocalificaciones,
    @inyectarpuerto(tokenevaluacionalertatemprana)
    @dependenciaopcional()
    private readonly evaluaralertas?: puertoevaluacionalertatemprana,
  ) {}

  async ejecutar(
    id: string,
    dto: dtoactualizarcalificacion,
    idusuario: string,
    ipdireccion: string | undefined,
    rolactual: rolusuario,
    correlacionid?: string,
  ) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Calificación no encontrada');
    const calificacionregistrada = gradeaggregate.rehidratar(anterior).revisar(dto);
    await validarescrituracalificacion(
      this.repositorio,
      {
        periodId: anterior.periodId,
        subjectId: anterior.subjectId,
        grades: [{ enrollmentId: anterior.enrollmentId, studentId: anterior.studentId }],
        reason: dto.reason,
      },
      idusuario,
      rolactual,
    );

    const { reason: motivo } = dto;
    const calificacion = await this.repositorio.actualizar(
      calificacionregistrada.idPersistido,
      calificacionregistrada.convertiradatosactualizacion(),
      {
        userId: idusuario,
        ipAddress: ipdireccion,
        correlationId: correlacionid,
        reason: motivo?.trim(),
      },
      { ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}) },
    );
    await this.evaluaralertas?.ejecutarsiesposible(calificacion.studentId);
    return calificacion;
  }
}

@servicioaplicacion()
export class casousocrearcalificacionesmasivas {
  constructor(
    @inyectarpuerto(tokenrepositoriocalificaciones)
    private readonly repositorio: repositoriocalificaciones,
    @inyectarpuerto(tokenevaluacionalertatemprana)
    @dependenciaopcional()
    private readonly evaluaralertas?: puertoevaluacionalertatemprana,
  ) {}

  async ejecutar(
    dto: dtocrearcalificacionesmasivas,
    idusuario: string,
    ipdireccion: string | undefined,
    rolactual: rolusuario,
    correlacionid?: string,
  ) {
    await validarescrituracalificacion(this.repositorio, dto, idusuario, rolactual);
    const cargautil = dto.grades.map((calificacion) =>
      gradeaggregate
        .registrar({
          enrollmentId: calificacion.enrollmentId,
          studentId: calificacion.studentId,
          subjectId: dto.subjectId,
          periodId: dto.periodId,
          value: calificacion.value,
          remarks: calificacion.remarks,
        })
        .convertiradatoscreacion(),
    );
    const resultados = await this.repositorio.insertaroactualizarporlote(
      cargautil,
      {
        userId: idusuario,
        ipAddress: ipdireccion,
        correlationId: correlacionid,
        reason: dto.reason?.trim(),
        courseId: dto.courseId,
        subjectId: dto.subjectId,
        periodId: dto.periodId,
        studentIds: [...new Set(dto.grades.map((calificacion) => calificacion.studentId))],
      },
      { ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}) },
    );
    if (this.evaluaralertas) {
      await Promise.all(
        [...new Set(dto.grades.map((calificacion) => calificacion.studentId))].map((idestudiante) =>
          this.evaluaralertas!.ejecutarsiesposible(idestudiante),
        ),
      );
    }
    return { count: resultados.length, items: resultados };
  }
}

@servicioaplicacion()
export class casousopublicarcalificaciones {
  constructor(
    @inyectarpuerto(tokenrepositoriocalificaciones)
    private readonly repositorio: repositoriocalificaciones,
  ) {}

  ejecutar(
    dto: dtopublicarcalificaciones,
    idusuario: string,
    ipdireccion: string | undefined,
    rolactual: rolusuario,
    correlacionid?: string,
  ) {
    return this.repositorio.publicarporlote(
      { courseId: dto.courseId, subjectId: dto.subjectId, periodId: dto.periodId },
      {
        userId: idusuario,
        ipAddress: ipdireccion,
        correlationId: correlacionid,
        reason: dto.reason?.trim(),
      },
      { ...(rolactual === rolusuario.TEACHER ? { teacherUserId: idusuario } : {}) },
    );
  }
}
