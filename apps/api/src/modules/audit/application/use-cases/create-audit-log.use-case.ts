import { Inject, Injectable } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import {
  AUDIT_LOG_REPOSITORY,
  IAuditLogRepository,
} from '../../domain/repositories/audit-log.repository.interface';

export interface CreateAuditLogDto {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId: string;
  previousValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  reason?: string | null;
  correlationId?: string | null;
}

@Injectable()
export class CreateAuditLogUseCase {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepo: IAuditLogRepository,
  ) {}

  async execute(dto: CreateAuditLogDto): Promise<AuditLogEntity> {
    const entity = AuditLogEntity.create(dto);
    return this.auditLogRepo.create(entity);
  }
}
