import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoencontrado, errorprohibido } from '../../../../core/application/aplicacionerror';
import {
  tokenrepositoriocursos,
  datoscreacioncurso,
  repositoriocursos,
  datosactualizacioncurso,
} from '../../domain/repositories/curso.repository.interface';
import { dtocrearcurso, dtoactualizarcurso } from '../dto/curso.dto';

@servicioaplicacion()
export class casousolistarcursos {
  constructor(
    @inyectarpuerto(tokenrepositoriocursos) private readonly repositorio: repositoriocursos,
  ) {}
  ejecutar(consulta: { academicYearId?: string; teacherUserId?: string; search?: string; limit: number; offset: number }) {
    return this.repositorio.buscartodos(consulta);
  }
}

@servicioaplicacion()
export class casousoobtenercurso {
  constructor(
    @inyectarpuerto(tokenrepositoriocursos) private readonly repositorio: repositoriocursos,
  ) {}
  async ejecutar(id: string, teacherUserId?: string) {
    if (teacherUserId && !(await this.repositorio.docentetieneasignacion(teacherUserId, id))) {
      throw new errorprohibido('El docente no tiene asignación académica para este curso');
    }
    const curso = await this.repositorio.buscarporidentificador(id);
    if (!curso) throw new errornoencontrado('Curso no encontrado');
    return curso;
  }
}

@servicioaplicacion()
export class casousocrearcurso {
  constructor(
    @inyectarpuerto(tokenrepositoriocursos) private readonly repositorio: repositoriocursos,
  ) {}
  async ejecutar(dto: dtocrearcurso, idusuario: string, ipdireccion?: string) {
    const datos: datoscreacioncurso = dto;
    return this.repositorio.crear(datos, { userId: idusuario, ipAddress: ipdireccion });
  }
}

@servicioaplicacion()
export class casousoactualizarcurso {
  constructor(
    @inyectarpuerto(tokenrepositoriocursos) private readonly repositorio: repositoriocursos,
  ) {}
  async ejecutar(id: string, dto: dtoactualizarcurso, idusuario: string, ipdireccion?: string) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Curso no encontrado');
    const datos: datosactualizacioncurso = dto;
    return this.repositorio.actualizar(id, datos, { userId: idusuario, ipAddress: ipdireccion });
  }
}

@servicioaplicacion()
export class casousoeliminarcurso {
  constructor(
    @inyectarpuerto(tokenrepositoriocursos) private readonly repositorio: repositoriocursos,
  ) {}
  async ejecutar(id: string, idusuario: string, ipdireccion?: string) {
    const anterior = await this.repositorio.buscarporidentificador(id);
    if (!anterior) throw new errornoencontrado('Curso no encontrado');
    await this.repositorio.eliminar(id, { userId: idusuario, ipAddress: ipdireccion });
  }
}
