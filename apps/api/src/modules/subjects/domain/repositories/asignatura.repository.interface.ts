import type { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export interface registromateria {
  id: string;
  name: string;
  code: string;
  description: string | null;
  area: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface datoscreacionmateria {
  name: string;
  code: string;
  description?: string;
  area?: string;
}

export type datosactualizacionmateria = Partial<datoscreacionmateria>;

export interface repositoriomaterias {
  buscartodos(busqueda?: string, teacherUserId?: string, courseId?: string): Promise<registromateria[]>;
  docentetieneasignacion(userId: string, courseId: string): Promise<boolean>;
  buscarporidentificador(id: string): Promise<registromateria | null>;
  crear(datos: datoscreacionmateria, auditoria: auditoriacontexto): Promise<registromateria>;
  actualizar(
    id: string,
    datos: datosactualizacionmateria,
    auditoria: auditoriacontexto,
  ): Promise<registromateria | null>;
  eliminar(id: string, auditoria: auditoriacontexto): Promise<void>;
}

export const tokenrepositoriomaterias = Symbol('SUBJECT_REPOSITORY');
