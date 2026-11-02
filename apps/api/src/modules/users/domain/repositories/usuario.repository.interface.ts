import { entidadusuario } from '../entities/usuario.entity';
import { rolusuario } from '@academic/domain-kernel';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';

export interface datoscreacionusuario {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: rolusuario.SECRETARY;
}

export interface datosactualizacionusuario {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface repositoriousuarios {
  buscartodos(parametros?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: entidadusuario[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidadusuario | null>;
  buscarporcorreo(correoelectronico: string): Promise<entidadusuario | null>;
  crear(datos: datoscreacionusuario, auditoria: auditoriacontexto): Promise<entidadusuario>;
  actualizar(
    id: string,
    datos: datosactualizacionusuario,
    auditoria: auditoriacontexto,
  ): Promise<entidadusuario>;
}

export const constanterepositoriousuarios = 'USER_REPOSITORY';
