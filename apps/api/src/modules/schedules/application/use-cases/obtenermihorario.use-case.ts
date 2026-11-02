import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { rolusuario } from '@academic/domain-kernel';
import { actorusuario } from '../../../../core/application/actorusuario';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import {
  tokenrepositoriohorarios,
  repositoriohorarios,
} from '../../domain/repositories/horario.repository.interface';
import { resultadomihorario } from '../../domain/entities/horario.types';

@servicioaplicacion()
export class casousoobtenermihorario {
  constructor(
    @inyectarpuerto(tokenrepositoriohorarios) private readonly repositorio: repositoriohorarios,
  ) {}

  async ejecutar(usuario: actorusuario): Promise<resultadomihorario> {
    if (usuario.role === rolusuario.TEACHER) {
      const iddocente = await this.repositorio.buscariddocenteporusuario(usuario.id);
      if (!iddocente)
        throw new incumplimientoregladominio(
          'NOT_FOUND',
          'Docente no encontrado para este usuario',
        );
      const horario = await this.repositorio.obtenerhorariodocente(iddocente, true);
      return {
        type: 'teacher',
        course: null,
        schedules: horario.schedules,
        teacherSubjects: [],
        teacher: horario.teacher,
        assignments: horario.assignments,
      };
    }

    const estudianteperfil = await this.repositorio.buscarperfilhorarioestudiante(usuario.id);
    if (estudianteperfil) {
      const horario = estudianteperfil.activeCourseId
        ? await this.repositorio.obtenerhorariocurso(estudianteperfil.activeCourseId)
        : null;
      return {
        type: 'student',
        student: estudianteperfil.student,
        course: horario?.course ?? null,
        schedules: horario?.schedules ?? [],
        teacherSubjects: horario?.teacherSubjects ?? [],
        ...(!estudianteperfil.activeCourseId
          ? { message: 'El estudiante no cuenta con una matrícula activa en la gestión actual.' }
          : {}),
      };
    }

    const familiarperfil = await this.repositorio.buscarperfilhorariofamiliar(usuario.id);
    if (familiarperfil) {
      const hijos = await Promise.all(
        familiarperfil.children.map(async (hijo) => {
          const horario = hijo.activeCourseId
            ? await this.repositorio.obtenerhorariocurso(hijo.activeCourseId)
            : null;
          return {
            student: hijo.student,
            relationship: hijo.relationship,
            course: horario?.course ?? null,
            schedules: horario?.schedules ?? [],
            teacherSubjects: horario?.teacherSubjects ?? [],
          };
        }),
      );
      const primerhijo = hijos[0];
      return {
        type: 'parent',
        parent: familiarperfil.parent,
        children: hijos,
        course: primerhijo?.course ?? null,
        schedules: primerhijo?.schedules ?? [],
        teacherSubjects: primerhijo?.teacherSubjects ?? [],
      };
    }

    return { type: 'administrative', course: null, schedules: [], teacherSubjects: [] };
  }
}
