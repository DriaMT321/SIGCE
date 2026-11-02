import { entidadregistroauditoria } from '../entities/registroauditoria.entity';

export interface repositorioregistroauditoria {
  crear(registro: entidadregistroauditoria): Promise<entidadregistroauditoria>;
  buscartodos(parametros?: {
    entity?: string;
    entityId?: string;
    userId?: string;
    correlationId?: string;
    studentId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: entidadregistroauditoria[]; total: number }>;
  buscarporidentificador(id: string): Promise<entidadregistroauditoria | null>;
}

export const constanterepositorioregistroauditoria = 'AUDIT_LOG_REPOSITORY';
