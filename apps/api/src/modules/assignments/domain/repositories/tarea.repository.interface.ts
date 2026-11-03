import { estadoasignacion, tipoasignacion } from '@academic/domain-kernel';

export interface consultatareas {
  courseId?: string;
  courseIds?: string[];
  subjectId?: string;
  teacherId?: string;
  type?: tipoasignacion;
  status?: estadoasignacion;
  search?: string;
  studentId?: string;
}

export interface registrotareasubmission {
  id?: string;
  score: number | null;
  feedback: string | null;
  status: string;
  gradedAt: Date | null;
}

export interface registrotarea {
  id: string;
  title: string;
  type: tipoasignacion;
  description: string | null;
  dueDate: Date;
  maxScore: number | null;
  status: estadoasignacion;
  courseId: string;
  subjectId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  course: { id: string; name: string; gradeLevel: number; section: string; shift: string };
  subject: { id: string; name: string; code: string; area: string | null };
  teacher: { id: string; firstName: string; lastName: string; specialty: string };
  student?: { id: string; firstName: string; lastName: string };
  submission?: registrotareasubmission;
  gradedCount?: number;
  totalStudents?: number;
}

export interface datoscreaciontarea {
  title: string;
  type: tipoasignacion;
  description?: string;
  dueDate: Date;
  maxScore: number;
  courseId: string;
  subjectId: string;
  teacherId: string;
}

export interface datosactualizaciontarea {
  title?: string;
  type?: tipoasignacion;
  description?: string | null;
  dueDate?: Date;
  maxScore?: number;
  status?: estadoasignacion;
}

export interface destinatarioestudiantetarea {
  id: string;
  firstName: string;
  lastName: string;
  courseId: string | null;
}

export interface calificacionestudianteentrada {
  studentId: string;
  score?: number | null;
  feedback?: string | null;
  status?: string;
}

export interface estudianteparaplanilla {
  id: string;
  firstName: string;
  lastName: string;
  rude: string | null;
  ci: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
  gradedAt: Date | null;
}

export interface asignacionconestudiantesysubmissions {
  assignment: registrotarea;
  students: estudianteparaplanilla[];
}

export interface repositoriotareas {
  buscariddocente(idusuario: string): Promise<string | null>;
  buscardestinatarioestudiante(idusuario: string): Promise<destinatarioestudiantetarea | null>;
  buscardestinatariosfamiliares(idusuario: string): Promise<destinatarioestudiantetarea[]>;
  buscariddocenteasignado(idcurso: string, idmateria: string): Promise<string | null>;
  tieneasignaciondocentevigente(
    iddocente: string,
    idcurso: string,
    idmateria: string,
  ): Promise<boolean>;
  buscartodos(consulta: consultatareas): Promise<registrotarea[]>;
  crear(datos: datoscreaciontarea): Promise<registrotarea>;
  buscarporidentificador(id: string): Promise<Pick<registrotarea, 'id' | 'teacherId'> | null>;
  actualizar(id: string, datos: datosactualizaciontarea): Promise<registrotarea>;
  eliminarlogicamente(id: string, fechaeliminacion: Date): Promise<boolean>;
  obtenerplanillaestudiantes(idtarea: string): Promise<asignacionconestudiantesysubmissions | null>;
  guardarcalificacioneslote(
    idtarea: string,
    calificaciones: calificacionestudianteentrada[],
    iddocentequevalua?: string,
  ): Promise<void>;
}

export const tokenrepositoriotareas = Symbol('ASSIGNMENT_REPOSITORY');
