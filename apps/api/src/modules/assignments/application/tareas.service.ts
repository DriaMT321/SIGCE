import { servicioaplicacion, inyectarpuerto } from '../../../core/application/aplicacioninyeccion';
import { errorprohibido, errornoencontrado } from '../../../core/application/aplicacionerror';
import { estadoasignacion, tipoasignacion, rolusuario } from '@academic/domain-kernel';
import { actorusuario } from '../../../core/application/actorusuario';
import {
  tokenrepositoriotareas,
  consultatareas,
  repositoriotareas,
} from '../domain/repositories/tarea.repository.interface';
import { ordencreartarea, ordenactualizartarea } from './commands/tarea.command';

@servicioaplicacion()
export class serviciotareas {
  constructor(
    @inyectarpuerto(tokenrepositoriotareas) private readonly repositorio: repositoriotareas,
  ) {}

  async listar(
    parametros: {
      courseId?: string;
      subjectId?: string;
      teacherId?: string;
      type?: tipoasignacion;
      status?: estadoasignacion;
      search?: string;
    },
    usuario: actorusuario,
  ) {
    const filtros: consultatareas = {
      subjectId: parametros.subjectId,
      type: parametros.type,
      status: parametros.status,
      search: parametros.search,
    };

    if (usuario.role === rolusuario.TEACHER) {
      const iddocente = await this.repositorio.buscariddocente(usuario.id);
      if (!iddocente) return [];
      return this.repositorio.buscartodos({
        ...filtros,
        teacherId: iddocente,
        courseId: parametros.courseId,
      });
    }

    const estudiante = await this.repositorio.buscardestinatarioestudiante(usuario.id);
    if (estudiante) {
      if (!estudiante.courseId) return [];
      if (parametros.courseId && parametros.courseId !== estudiante.courseId) return [];
      const asignaciones = await this.repositorio.buscartodos({
        ...filtros,
        courseId: estudiante.courseId,
      });
      return asignaciones.map((tarea) => ({
        ...tarea,
        student: {
          id: estudiante.id,
          firstName: estudiante.firstName,
          lastName: estudiante.lastName,
        },
      }));
    }

    if (usuario.role === rolusuario.PARENT) {
      const hijos = await this.repositorio.buscardestinatariosfamiliares(usuario.id);
      const visiblehijos = hijos.filter(
        (hijo) =>
          hijo.courseId !== null && (!parametros.courseId || hijo.courseId === parametros.courseId),
      );
      const cursoids = Array.from(
        new Set(visiblehijos.flatMap((hijo) => (hijo.courseId ? [hijo.courseId] : []))),
      );
      if (cursoids.length === 0) return [];
      const asignaciones = await this.repositorio.buscartodos({ ...filtros, courseIds: cursoids });
      return visiblehijos
        .flatMap((hijo) =>
          asignaciones
            .filter((tarea) => tarea.courseId === hijo.courseId)
            .map((tarea) => ({
              ...tarea,
              student: { id: hijo.id, firstName: hijo.firstName, lastName: hijo.lastName },
            })),
        )
        .sort((restante, derecha) => restante.dueDate.getTime() - derecha.dueDate.getTime());
    }

    if (![rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY].includes(usuario.role)) return [];
    return this.repositorio.buscartodos({
      ...filtros,
      courseId: parametros.courseId,
      teacherId: parametros.teacherId,
    });
  }

  async crear(comando: ordencreartarea, usuario: actorusuario) {
    let iddocente = comando.teacherId;
    if (usuario.role === rolusuario.TEACHER) {
      iddocente = (await this.repositorio.buscariddocente(usuario.id)) ?? undefined;
      if (!iddocente)
        throw new errorprohibido('No se encontró el registro docente para este usuario');
      if (
        !(await this.repositorio.tieneasignaciondocentevigente(
          iddocente,
          comando.courseId,
          comando.subjectId,
        ))
      ) {
        throw new errorprohibido('No tienes una asignación vigente para esta materia y curso');
      }
    }

    if (!iddocente) {
      iddocente =
        (await this.repositorio.buscariddocenteasignado(comando.courseId, comando.subjectId)) ??
        undefined;
      if (!iddocente) {
        throw new errornoencontrado('No hay un docente asignado a esta materia y curso');
      }
    }

    return this.repositorio.crear({
      title: comando.title,
      type: comando.type ?? tipoasignacion.TAREA,
      description: comando.description,
      dueDate: new Date(comando.dueDate),
      maxScore: comando.maxScore ?? 100,
      courseId: comando.courseId,
      subjectId: comando.subjectId,
      teacherId: iddocente,
    });
  }

  async actualizar(id: string, comando: ordenactualizartarea, usuario: actorusuario) {
    const existente = await this.repositorio.buscarporidentificador(id);
    if (!existente) throw new errornoencontrado('Tarea o examen no encontrado');
    await this.exigirdocentepropietariotarea(usuario, existente.teacherId);
    return this.repositorio.actualizar(id, {
      ...(comando.title ? { title: comando.title } : {}),
      ...(comando.type ? { type: comando.type } : {}),
      ...(comando.description !== undefined ? { description: comando.description } : {}),
      ...(comando.dueDate ? { dueDate: new Date(comando.dueDate) } : {}),
      ...(comando.maxScore !== undefined ? { maxScore: comando.maxScore } : {}),
      ...(comando.status ? { status: comando.status } : {}),
    });
  }

  async eliminar(id: string, usuario: actorusuario) {
    const existente = await this.repositorio.buscarporidentificador(id);
    if (!existente) throw new errornoencontrado('Tarea o examen no encontrado');
    await this.exigirdocentepropietariotarea(usuario, existente.teacherId);
    if (!(await this.repositorio.eliminarlogicamente(id, new Date()))) {
      throw new errornoencontrado('Tarea o examen no encontrado');
    }
    return { message: 'Actividad eliminada exitosamente' };
  }

  private async exigirdocentepropietariotarea(
    usuario: actorusuario,
    iddocenteasignado: string,
  ): Promise<void> {
    if (usuario.role !== rolusuario.TEACHER) return;
    const iddocente = await this.repositorio.buscariddocente(usuario.id);
    if (!iddocente || iddocenteasignado !== iddocente) {
      throw new errorprohibido('No tienes permisos para modificar esta actividad');
    }
  }
}
