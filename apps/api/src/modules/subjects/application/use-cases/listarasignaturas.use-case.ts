import { errorprohibido } from '../../../../core/application/aplicacionerror';
import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenrepositoriomaterias,
  repositoriomaterias,
} from '../../domain/repositories/asignatura.repository.interface';

@servicioaplicacion()
export class casousolistarmaterias {
  constructor(
    @inyectarpuerto(tokenrepositoriomaterias) private readonly repositorio: repositoriomaterias,
  ) {}
  async ejecutar(busqueda?: string, teacherUserId?: string, courseId?: string) {
    if (teacherUserId && courseId && !(await this.repositorio.docentetieneasignacion(teacherUserId, courseId))) {
      throw new errorprohibido('El docente no tiene asignación académica para este curso');
    }
    return this.repositorio.buscartodos(busqueda, teacherUserId, courseId);
  }
}
