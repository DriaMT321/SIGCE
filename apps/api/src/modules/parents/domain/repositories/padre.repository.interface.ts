import { entidadfamiliar, tiporelacion } from '../entities/padre.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export const tokenrepositoriofamiliares = Symbol('PARENT_REPOSITORY');

export interface datoscreacionfamiliar {
  email: string;
  passwordHash: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  occupation?: string;
}

export type datosactualizacionfamiliar = Partial<Omit<datoscreacionfamiliar, 'passwordHash'>>;

export interface repositoriofamiliares {
  buscartodos(consulta: {
    search?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidadfamiliar[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidadfamiliar | null>;
  crear(datos: datoscreacionfamiliar, auditoria: auditoriacontexto): Promise<entidadfamiliar>;
  actualizar(
    id: string,
    datos: datosactualizacionfamiliar,
    auditoria: auditoriacontexto,
  ): Promise<entidadfamiliar>;
  actualizarvinculo(
    idfamiliar: string,
    idestudiante: string,
    relacion: tiporelacion,
    auditoria: auditoriacontexto,
  ): Promise<entidadfamiliar>;
  eliminarvinculo(
    idfamiliar: string,
    idestudiante: string,
    auditoria: auditoriacontexto,
  ): Promise<entidadfamiliar>;
  eliminarlogicamente(id: string, auditoria: auditoriacontexto): Promise<void>;
}
