import type { actorusuario } from '../../../../core/application/actorusuario';

export const tokenrepositorioeventosacademicos = Symbol('REPOSITORIO_EVENTOS_ACADEMICOS');

export type tipoeventoacademico =
  | 'ACTIVIDAD'
  | 'REUNION'
  | 'ACTO_ESCOLAR'
  | 'SUSPENSION_CLASES'
  | 'OTRO';

export type estadoeventoacademico = 'PROGRAMADO' | 'CANCELADO' | 'REALIZADO';

export interface registroeventoacademico {
  id: string;
  title: string;
  description: string | null;
  type: tipoeventoacademico;
  startsAt: Date;
  endsAt: Date;
  allDay: boolean;
  location: string | null;
  status: estadoeventoacademico;
  targetCourseId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  targetCourse: { id: string; name: string; gradeLevel: number; section: string } | null;
  createdBy: { id: string; firstName: string; lastName: string };
}

export interface filtroslistadoeventosacademicos {
  sinrestricciondecursos: boolean;
  cursosvisibles: string[];
  courseId?: string;
  desde?: Date;
  hasta?: Date;
}

export interface datoscreacioneventoacademico {
  title: string;
  description?: string | null;
  type: tipoeventoacademico;
  startsAt: Date;
  endsAt: Date;
  allDay: boolean;
  location?: string | null;
  targetCourseId?: string | null;
  createdById: string;
}

export interface datosactualizareventoacademico {
  title?: string;
  description?: string | null;
  type?: tipoeventoacademico;
  startsAt?: Date;
  endsAt?: Date;
  allDay?: boolean;
  location?: string | null;
  targetCourseId?: string | null;
  status?: estadoeventoacademico;
}

export interface repositorioeventosacademicos {
  buscarcursosvisibles(usuario: actorusuario): Promise<string[]>;
  docentetieneasignacion(usuarioId: string, cursoId: string): Promise<boolean>;
  existecurso(cursoId: string): Promise<boolean>;
  listar(filtros: filtroslistadoeventosacademicos): Promise<registroeventoacademico[]>;
  buscarporid(id: string): Promise<registroeventoacademico | null>;
  crear(datos: datoscreacioneventoacademico): Promise<registroeventoacademico>;
  actualizar(id: string, datos: datosactualizareventoacademico): Promise<registroeventoacademico>;
}
