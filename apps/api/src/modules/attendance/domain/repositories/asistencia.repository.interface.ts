import { entidadasistencia } from '../entities/asistencia.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export const tokenrepositorioasistencias = Symbol('ATTENDANCE_REPOSITORY');

export interface datoscreacionasistencia {
  studentId: string;
  courseId: string;
  registeredById: string;
  date: Date;
  status: string;
  justification?: string;
}

export type datosactualizacionasistencia = Pick<
  datoscreacionasistencia,
  'status' | 'justification'
>;

export interface contextocreacionasistencia {
  student: { active: boolean; deleted: boolean } | null;
  course: {
    id: string;
    academicYearId: string;
    academicYear: { closed: boolean; startsAt: Date; endsAt: Date };
  } | null;
  enrollmentAcademicYearId: string | null;
}

export type estadoasignacioncursodocente = 'NO_PROFILE' | 'UNASSIGNED' | 'ASSIGNED';

export interface contextopermisoescrituraasistencia {
  teacherUserId?: string;
}

export interface repositorioasistencias {
  buscartodos(consulta: {
    studentId?: string;
    courseId?: string;
    from?: Date;
    to?: Date;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidadasistencia[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidadasistencia | null>;
  obtenercontextocreacion(
    idestudiante: string,
    idcurso: string,
  ): Promise<contextocreacionasistencia>;
  obtenerestadoasignacioncursodocente(
    idusuario: string,
    idcurso: string,
    idgestionacademica: string,
  ): Promise<estadoasignacioncursodocente>;
  existeasistencia(idestudiante: string, idcurso: string, fecha: Date): Promise<boolean>;
  obteneridanioacademicocurso(idcurso: string): Promise<string | null>;
  crear(
    datos: datoscreacionasistencia,
    auditoria: auditoriacontexto,
    permiso: contextopermisoescrituraasistencia,
  ): Promise<entidadasistencia>;
  actualizar(
    id: string,
    datos: datosactualizacionasistencia,
    auditoria: auditoriacontexto,
    permiso: contextopermisoescrituraasistencia,
  ): Promise<entidadasistencia>;
}
