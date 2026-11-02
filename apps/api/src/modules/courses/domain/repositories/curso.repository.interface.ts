import { entidadcurso } from '../entities/curso.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export const tokenrepositoriocursos = Symbol('COURSE_REPOSITORY');

export interface datoscreacioncurso {
  academicYearId: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
  maxCapacity?: number;
}

export type datosactualizacioncurso = Partial<Omit<datoscreacioncurso, 'academicYearId'>>;

export interface repositoriocursos {
  buscartodos(consulta: {
    academicYearId?: string;
    teacherUserId?: string;
    search?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidadcurso[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidadcurso | null>;
  docentetieneasignacion(userId: string, courseId: string): Promise<boolean>;
  crear(datos: datoscreacioncurso, auditoria: auditoriacontexto): Promise<entidadcurso>;
  actualizar(
    id: string,
    datos: datosactualizacioncurso,
    auditoria: auditoriacontexto,
  ): Promise<entidadcurso>;
  eliminar(id: string, auditoria: auditoriacontexto): Promise<void>;
}
