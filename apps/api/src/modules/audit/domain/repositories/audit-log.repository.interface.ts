import { AuditLogEntity } from '../entities/audit-log.entity';

export interface IAuditLogRepository {
  create(log: AuditLogEntity): Promise<AuditLogEntity>;
  findAll(params?: {
    entity?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: AuditLogEntity[]; total: number }>;
  findById(id: string): Promise<AuditLogEntity | null>;
}

export const AUDIT_LOG_REPOSITORY = 'AUDIT_LOG_REPOSITORY';
