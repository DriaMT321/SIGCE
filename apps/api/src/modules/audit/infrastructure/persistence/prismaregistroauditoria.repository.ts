import { Injectable } from '@nestjs/common';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { entidadregistroauditoria } from '../../domain/entities/registroauditoria.entity';
import { repositorioregistroauditoria } from '../../domain/repositories/registroauditoria.repository.interface';
import { AuditAction, Prisma } from '@prisma/client';

@Injectable()
export class repositorioregistroauditoriaprisma implements repositorioregistroauditoria {
  constructor(private readonly prisma: servicioprisma) {}

  async crear(registro: entidadregistroauditoria): Promise<entidadregistroauditoria> {
    const creado = await this.prisma.auditLog.create({
      data: {
        userId: registro.userId,
        action: registro.action as AuditAction,
        entity: registro.entity,
        entityId: registro.entityId,
        previousValue: (registro.previousValue as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        newValue: (registro.newValue as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        reason: registro.reason,
        correlationId: registro.correlationId,
        studentIds: registro.studentIds,
        ipAddress: registro.ipAddress,
        userAgent: registro.userAgent,
      },
    });

    return new entidadregistroauditoria(
      creado.id,
      creado.userId,
      creado.action as unknown as entidadregistroauditoria['action'],
      creado.entity,
      creado.entityId,
      creado.previousValue as Record<string, unknown> | null,
      creado.newValue as Record<string, unknown> | null,
      creado.ipAddress,
      creado.userAgent,
      creado.createdAt,
      creado.reason,
      creado.correlationId,
      creado.studentIds,
    );
  }

  async buscartodos(parametros?: {
    entity?: string;
    entityId?: string;
    userId?: string;
    correlationId?: string;
    studentId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: entidadregistroauditoria[]; total: number }> {
    const where: Prisma.AuditLogWhereInput = {};
    if (parametros?.entity) where.entity = parametros.entity;
    if (parametros?.entityId) where.entityId = parametros.entityId;
    if (parametros?.userId) where.userId = parametros.userId;
    if (parametros?.correlationId) where.correlationId = parametros.correlationId;
    if (parametros?.studentId) where.studentIds = { has: parametros.studentId };

    const [crudoelementos, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        take: parametros?.limit ?? 50,
        skip: parametros?.offset ?? 0,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const elementos = crudoelementos.map(
      (elemento) =>
        new entidadregistroauditoria(
          elemento.id,
          elemento.userId,
          elemento.action as unknown as entidadregistroauditoria['action'],
          elemento.entity,
          elemento.entityId,
          elemento.previousValue as Record<string, unknown> | null,
          elemento.newValue as Record<string, unknown> | null,
          elemento.ipAddress,
          elemento.userAgent,
          elemento.createdAt,
          elemento.reason,
          elemento.correlationId,
          elemento.studentIds,
        ),
    );

    return { items: elementos, total };
  }

  async buscarporidentificador(id: string): Promise<entidadregistroauditoria | null> {
    const elemento = await this.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!elemento) return null;

    return new entidadregistroauditoria(
      elemento.id,
      elemento.userId,
      elemento.action as unknown as entidadregistroauditoria['action'],
      elemento.entity,
      elemento.entityId,
      elemento.previousValue as Record<string, unknown> | null,
      elemento.newValue as Record<string, unknown> | null,
      elemento.ipAddress,
      elemento.userAgent,
      elemento.createdAt,
      elemento.reason,
      elemento.correlationId,
      elemento.studentIds,
    );
  }
}
