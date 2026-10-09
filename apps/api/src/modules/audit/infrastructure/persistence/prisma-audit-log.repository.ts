import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditAction, Prisma } from '@prisma/client';

@Injectable()
export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(log: AuditLogEntity): Promise<AuditLogEntity> {
    const created = await this.prisma.auditLog.create({
      data: {
        userId: log.userId,
        action: log.action as AuditAction,
        entity: log.entity,
        entityId: log.entityId,
        previousValue: (log.previousValue as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        newValue: (log.newValue as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        reason: log.reason,
        correlationId: log.correlationId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
      },
    });

    return new AuditLogEntity(
      created.id,
      created.userId,
      created.action as unknown as AuditLogEntity['action'],
      created.entity,
      created.entityId,
      created.previousValue as Record<string, unknown> | null,
      created.newValue as Record<string, unknown> | null,
      created.ipAddress,
      created.userAgent,
      created.createdAt,
      created.reason,
      created.correlationId,
    );
  }

  async findAll(params?: {
    entity?: string;
    userId?: string;
    correlationId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: AuditLogEntity[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = {};
    if (params?.entity) where.entity = params.entity;
    if (params?.userId) where.userId = params.userId;
    if (params?.correlationId) where.correlationId = params.correlationId;

    const [rawItems, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        take: params?.limit ?? 50,
        skip: params?.offset ?? 0,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const items = rawItems.map(
      (item) =>
        new AuditLogEntity(
          item.id,
          item.userId,
          item.action as unknown as AuditLogEntity['action'],
          item.entity,
          item.entityId,
          item.previousValue as Record<string, unknown> | null,
          item.newValue as Record<string, unknown> | null,
          item.ipAddress,
          item.userAgent,
          item.createdAt,
          item.reason,
          item.correlationId,
        ),
    );

    return { items, total };
  }

  async findById(id: string): Promise<AuditLogEntity | null> {
    const item = await this.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!item) return null;

    return new AuditLogEntity(
      item.id,
      item.userId,
      item.action as unknown as AuditLogEntity['action'],
      item.entity,
      item.entityId,
      item.previousValue as Record<string, unknown> | null,
      item.newValue as Record<string, unknown> | null,
      item.ipAddress,
      item.userAgent,
      item.createdAt,
      item.reason,
      item.correlationId,
    );
  }
}
