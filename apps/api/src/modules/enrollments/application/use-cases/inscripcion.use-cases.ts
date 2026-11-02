import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenrepositorioinscripciones,
  repositorioinscripciones,
} from '../../domain/repositories/inscripcion.repository.interface';
import {
  dtocrearinscripcion,
  dtoactualizarinscripcion,
  dtoactualizarestadomasivo,
} from '../dto/inscripcion.dto';

@servicioaplicacion()
export class casousolistarinscripciones {
  constructor(
    @inyectarpuerto(tokenrepositorioinscripciones)
    private readonly repositorio: repositorioinscripciones,
  ) {}

  ejecutar(consulta: {
    academicYearId?: string;
    courseId?: string;
    studentId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    return this.repositorio.buscartodos(consulta);
  }
}

@servicioaplicacion()
export class casousocrearinscripcion {
  constructor(
    @inyectarpuerto(tokenrepositorioinscripciones)
    private readonly repositorio: repositorioinscripciones,
  ) {}

  ejecutar(dto: dtocrearinscripcion, idusuario: string, ipdireccion?: string) {
    return this.repositorio.crear(dto, { userId: idusuario, ipAddress: ipdireccion });
  }
}

@servicioaplicacion()
export class casousoactualizarinscripcion {
  constructor(
    @inyectarpuerto(tokenrepositorioinscripciones)
    private readonly repositorio: repositorioinscripciones,
  ) {}

  ejecutar(id: string, dto: dtoactualizarinscripcion, idusuario: string, ipdireccion?: string) {
    return this.repositorio.actualizarestado(id, dto.status, dto.remarks, {
      userId: idusuario,
      ipAddress: ipdireccion,
    });
  }
}

@servicioaplicacion()
export class casousoactualizarestadomasivo {
  constructor(
    @inyectarpuerto(tokenrepositorioinscripciones)
    private readonly repositorio: repositorioinscripciones,
  ) {}

  ejecutar(dto: dtoactualizarestadomasivo, idusuario: string, ipdireccion?: string) {
    return this.repositorio.actualizarestadomasivo(dto.ids, dto.status, {
      userId: idusuario,
      ipAddress: ipdireccion,
    });
  }
}
