import { AuditAction } from '@academic/shared-types';

export class AuditLogEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly action: AuditAction,
    public readonly entity: string,
    public readonly entityId: string,
    public readonly previousValue: Record<string, unknown> | null,
    public readonly newValue: Record<string, unknown> | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(params: {
    userId?: string | null;
    action: AuditAction;
    entity: string;
    entityId: string;
    previousValue?: Record<string, unknown> | null;
    newValue?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): AuditLogEntity {
    return new AuditLogEntity(
      '',
      params.userId ?? null,
      params.action,
      params.entity,
      params.entityId,
      params.previousValue ?? null,
      params.newValue ?? null,
      params.ipAddress ?? null,
      params.userAgent ?? null,
      new Date(),
    );
  }
}
