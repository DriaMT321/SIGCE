import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { estadosincronizacionsie } from '@academic/shared-types';
import type { servicioprisma } from '../../../../common/database/prisma.service';
import { determinarestadogrupodiscrepanciasie } from '../../domain/policies/politicasincronizacionsie';
import { sincronizacionitemrelacionesinclude } from './consultarsincronizacionsieprisma';

export class repositoriorevisiondiscrepanciassieprisma {
  constructor(private readonly prisma: servicioprisma) {}
  async resolverdiscrepancia(entrada: {
    itemId: string;
    decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const previa = await tx.sieSynchronizationItem.findUnique({
        where: { id: entrada.itemId },
        select: { discrepancyGroupId: true },
      });
      if (!previa) throw new NotFoundException('Discrepancia SIE no encontrada');

      if (previa.discrepancyGroupId) {
        const grupobloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "sie_discrepancy_groups" WHERE "id" = ${previa.discrepancyGroupId} FOR UPDATE
        `;
        if (!grupobloqueado[0]) {
          throw new ConflictException('El grupo de discrepancias ya no está disponible');
        }
      }

      const itembloqueado = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "sie_synchronization_items" WHERE "id" = ${entrada.itemId} FOR UPDATE
      `;
      if (!itembloqueado[0]) throw new NotFoundException('Discrepancia SIE no encontrada');

      const anterior = await tx.sieSynchronizationItem.findUnique({
        where: { id: entrada.itemId },
      });
      if (!anterior) throw new NotFoundException('Discrepancia SIE no encontrada');
      if (anterior.discrepancyGroupId !== previa.discrepancyGroupId) {
        throw new ConflictException(
          'El grupo de discrepancias cambió durante la revisión. Actualice la pantalla e inténtelo de nuevo.',
        );
      }
      if (anterior.status !== 'DISCREPANCY' || anterior.discrepancyResolvedAt) {
        throw new ConflictException('La discrepancia ya no está pendiente de revisión');
      }

      const fechaderesolucion = new Date();
      const actualizado = await tx.sieSynchronizationItem.update({
        where: { id: entrada.itemId },
        data: {
          discrepancyResolvedById: entrada.userId,
          discrepancyResolvedAt: fechaderesolucion,
          discrepancyResolutionReason: entrada.reason.trim(),
          discrepancyDecision: entrada.decision,
        },
        include: sincronizacionitemrelacionesinclude,
      });
      if (actualizado.discrepancyGroupId) {
        const elementospendientes = await tx.sieSynchronizationItem.count({
          where: {
            discrepancyGroupId: actualizado.discrepancyGroupId,
            status: estadosincronizacionsie.DISCREPANCY,
            discrepancyResolvedAt: null,
          },
        });
        const estadogrupo = determinarestadogrupodiscrepanciasie(elementospendientes);
        if (estadogrupo === 'RESOLVED') {
          await tx.sieDiscrepancyGroup.update({
            where: { id: actualizado.discrepancyGroupId },
            data: {
              status: 'RESOLVED',
              resolvedById: entrada.userId,
              resolvedAt: fechaderesolucion,
              resolutionReason: entrada.reason.trim(),
            },
          });
        } else {
          await tx.sieDiscrepancyGroup.update({
            where: { id: actualizado.discrepancyGroupId },
            data: { status: estadogrupo },
          });
        }
      }
      await tx.auditLog.create({
        data: {
          userId: entrada.userId,
          action: PrismaAuditAction.UPDATE,
          entity: 'SieSynchronizationItem',
          entityId: entrada.itemId,
          studentIds: [anterior.studentId],
          previousValue: {
            status: anterior.status,
            localValue: anterior.localValue,
            sieValue: anterior.sieValue,
          },
          newValue: {
            status: actualizado.status,
            localValue: actualizado.localValue,
            sieValue: actualizado.sieValue,
            decision: actualizado.discrepancyDecision,
            reason: actualizado.discrepancyResolutionReason,
            resolvedAt: fechaderesolucion.toISOString(),
          },
          reason: entrada.reason.trim(),
          ipAddress: entrada.ipAddress,
          correlationId: entrada.correlationId,
        },
      });
      return actualizado;
    });
  }

  async resolvergrupodiscrepancias(entrada: {
    groupId: string;
    decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "sie_discrepancy_groups" WHERE "id" = ${entrada.groupId} FOR UPDATE
      `;
        if (!bloqueado[0]) throw new NotFoundException('Grupo de discrepancias no encontrado');
        const grupo = await tx.sieDiscrepancyGroup.findUnique({
          where: { id: entrada.groupId },
          select: {
            id: true,
            synchronizationId: true,
            status: true,
            items: {
              where: { status: estadosincronizacionsie.DISCREPANCY, discrepancyResolvedAt: null },
              select: { id: true, studentId: true, localValue: true, sieValue: true },
            },
          },
        });
        if (!grupo) throw new NotFoundException('Grupo de discrepancias no encontrado');
        if (grupo.status === 'RESOLVED' || grupo.items.length === 0) {
          throw new ConflictException(
            'El grupo ya fue resuelto o no tiene discrepancias pendientes',
          );
        }

        const fechaderesolucion = new Date();
        const resultado = await tx.sieSynchronizationItem.updateMany({
          where: {
            discrepancyGroupId: grupo.id,
            status: estadosincronizacionsie.DISCREPANCY,
            discrepancyResolvedAt: null,
          },
          data: {
            discrepancyResolvedById: entrada.userId,
            discrepancyResolvedAt: fechaderesolucion,
            discrepancyResolutionReason: entrada.reason.trim(),
            discrepancyDecision: entrada.decision,
          },
        });
        if (resultado.count !== grupo.items.length) {
          throw new ConflictException(
            'El grupo cambió durante la revisión. Actualice la pantalla e inténtelo de nuevo.',
          );
        }
        await tx.sieDiscrepancyGroup.update({
          where: { id: grupo.id },
          data: {
            status: 'RESOLVED',
            resolvedById: entrada.userId,
            resolvedAt: fechaderesolucion,
            resolutionReason: entrada.reason.trim(),
          },
        });
        await tx.auditLog.create({
          data: {
            userId: entrada.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'SieDiscrepancyGroup',
            entityId: grupo.id,
            studentIds: [...new Set(grupo.items.map((elemento) => elemento.studentId))],
            previousValue: {
              status: grupo.status,
              items: grupo.items.map((elemento) => ({
                itemId: elemento.id,
                localValue: elemento.localValue,
                sieValue: elemento.sieValue,
              })),
            },
            newValue: {
              status: 'RESOLVED',
              decision: entrada.decision,
              reason: entrada.reason.trim(),
              resolvedAt: fechaderesolucion.toISOString(),
              items: grupo.items.map((elemento) => ({
                itemId: elemento.id,
                localValue: elemento.localValue,
                sieValue: elemento.sieValue,
              })),
            },
            reason: entrada.reason.trim(),
            ipAddress: entrada.ipAddress,
            correlationId: entrada.correlationId ?? grupo.synchronizationId,
          },
        });
        return { groupId: grupo.id, resolvedItemCount: resultado.count };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
}
