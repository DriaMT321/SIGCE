import { entidaddocente } from '../entities/docente.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export const tokenrepositoriodocentes = Symbol('TEACHER_REPOSITORY');

export interface datoscreaciondocente {
  email: string;
  passwordHash: string;
  ci: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone?: string;
  itemNumber?: string;
}

export type datosactualizaciondocente = Partial<Omit<datoscreaciondocente, 'passwordHash'>>;

export interface repositoriodocentes {
  buscartodos(consulta: {
    search?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidaddocente[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidaddocente | null>;
  crear(datos: datoscreaciondocente, auditoria: auditoriacontexto): Promise<entidaddocente>;
  actualizar(
    id: string,
    datos: datosactualizaciondocente,
    auditoria: auditoriacontexto,
  ): Promise<entidaddocente>;
  eliminarlogicamente(id: string, auditoria: auditoriacontexto): Promise<void>;
}
