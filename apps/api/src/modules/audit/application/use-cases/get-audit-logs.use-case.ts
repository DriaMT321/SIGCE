import { Inject, Injectable } from '@nestjs/common';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import {
  AUDIT_LOG_REPOSITORY,
  IAuditLogRepository,
} from '../../domain/repositories/audit-log.repository.interface';

@Injectable()
export class GetAuditLogsUseCase {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepo: IAuditLogRepository,
  ) {}

  async execute(params?: {
    entity?: string;
    userId?: string;
    correlationId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: AuditLogEntity[]; total: number }> {
    return this.auditLogRepo.findAll(params);
  }
}
