import { accionauditoria } from '@academic/domain-kernel';
import { entidadregistroauditoria } from '../../domain/entities/registroauditoria.entity';

export const tokenescritorregistroauditoria = Symbol('AUDIT_LOG_WRITER');
export const tokenlectorregistroauditoria = Symbol('AUDIT_LOG_READER');

export interface comandocrearregistroauditoria {
  userId?: string | null;
  action: accionauditoria;
  entity: string;
  entityId: string;
  previousValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  reason?: string | null;
  correlationId?: string | null;
  studentIds?: string[];
}

export interface consultaregistroauditoria {
  entity?: string;
  entityId?: string;
  userId?: string;
  correlationId?: string;
  studentId?: string;
  limit?: number;
  offset?: number;
}

export interface escritorregistroauditoria {
  ejecutar(comando: comandocrearregistroauditoria): Promise<entidadregistroauditoria>;
}

export interface lectorregistroauditoria {
  ejecutar(
    consulta?: consultaregistroauditoria,
  ): Promise<{ items: entidadregistroauditoria[]; total: number }>;
}
