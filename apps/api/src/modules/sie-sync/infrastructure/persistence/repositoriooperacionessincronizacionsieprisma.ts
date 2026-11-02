import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { estadosincronizacionsie } from '@academic/shared-types';
import type { servicioprisma } from '../../../../common/database/prisma.service';
import { calcularestadoreanudacionsie } from '../../domain/policies/politicasincronizacionsie';
import { sincronizacioncalificacioninclude } from './inclusionsincronizacionsie.prisma';

export class repositoriooperacionessincronizacionsieprisma {
  constructor(private readonly prisma: servicioprisma) {}
  async buscartrabajosencola(limite: number) {
    const elementos = await this.prisma.sieSynchronizationItem.findMany({
      where: {
        status: estadosincronizacionsie.QUEUED,
        synchronization: { status: { not: estadosincronizacionsie.PAUSED } },
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: limite,
      include: {
        student: { select: { rude: true } },
        subject: { select: { code: true, name: true } },
        period: { include: { academicYear: { select: { year: true } } } },
      },
    });
    const idsdesincronizaciones = [
      ...new Set(elementos.map((elemento) => elemento.synchronizationId)),
    ];
    const contextosdecursos = new Map<string, { gradeLevel: number; section: string; shift: string }>();
    if (elementos.length > 0 && this.prisma.grade?.findMany) {
      const calificaciones = (await this.prisma.grade.findMany({
        where: {
          OR: elementos.map((elemento) => ({
            studentId: elemento.studentId,
            subjectId: elemento.subjectId,
            periodId: elemento.periodId,
          })),
        },
        select: {
          studentId: true,
          subjectId: true,
          periodId: true,
          enrollment: { select: { course: { select: { gradeLevel: true, section: true, shift: true } } } },
        },
      })) ?? [];
      for (const calificacion of calificaciones) {
        if (calificacion?.enrollment?.course) {
          contextosdecursos.set(
            `${calificacion.studentId}|${calificacion.subjectId}|${calificacion.periodId}`,
            calificacion.enrollment.course,
          );
        }
      }
    }
    const eventosdeconfirmacion =
      idsdesincronizaciones.length === 0
        ? []
        : await this.prisma.auditLog.findMany({
            where: {
              action: PrismaAuditAction.SYNC_SIE,
              entity: 'SieSynchronization',
              entityId: { in: idsdesincronizaciones },
            },
            orderBy: { createdAt: 'asc' },
            select: { entityId: true, correlationId: true, newValue: true },
          });
    const correlacionesporsincronizacion = new Map<string, string>();
    for (const evento of eventosdeconfirmacion) {
      const valor = evento.newValue;
      if (
        valor &&
        typeof valor === 'object' &&
        !Array.isArray(valor) &&
        valor.event === 'CONFIRMED_BEFORE_ENQUEUE' &&
        evento.correlationId &&
        !correlacionesporsincronizacion.has(evento.entityId)
      ) {
        correlacionesporsincronizacion.set(evento.entityId, evento.correlationId);
      }
    }
    return elementos.map((elemento) => {
      const curso = contextosdecursos.get(
        `${elemento.studentId}|${elemento.subjectId}|${elemento.periodId}`,
      );
      return {
        synchronizationId: elemento.synchronizationId,
        itemId: elemento.id,
        studentRude: elemento.student.rude,
        academicYear: elemento.period.academicYear.year,
        periodNumber: elemento.period.number,
        subjectCode: elemento.subject.code,
        subjectName: elemento.subject.name,
        ...(curso
          ? {
              courseGradeLevel: curso.gradeLevel,
              courseSection: curso.section,
              courseShift: curso.shift,
            }
          : {}),
        localGrade: elemento.localValue,
        retryCount: elemento.retryCount,
        correlationId:
          correlacionesporsincronizacion.get(elemento.synchronizationId) ??
          elemento.synchronizationId,
      };
    });
  }

  async reintentarelementofallido(entrada: {
    itemId: string;
    userId: string;
    reason: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "sie_synchronization_items" WHERE "id" = ${entrada.itemId} FOR UPDATE
      `;
        if (!bloqueado[0]) throw new NotFoundException('Ítem de sincronización no encontrado');

        const elemento = await tx.sieSynchronizationItem.findUnique({
          where: { id: entrada.itemId },
          include: {
            student: { select: { rude: true } },
            subject: { select: { code: true } },
            period: { include: { academicYear: { select: { year: true, isActive: true } } } },
            synchronization: {
              select: { requestedById: true, status: true, processedItems: true, errorCount: true },
            },
          },
        });
        if (!elemento) throw new NotFoundException('Ítem de sincronización no encontrado');
        if (elemento.status !== estadosincronizacionsie.FAILED) {
          throw new ConflictException('Solo se pueden reintentar ítems con fallo final');
        }
        if (elemento.synchronization.status === estadosincronizacionsie.PAUSED) {
          throw new ConflictException(
            'Resuelva los grupos de discrepancias y reanude el lote antes del reintento',
          );
        }

        const calificacion = await tx.grade.findFirst({
          where: {
            studentId: elemento.studentId,
            subjectId: elemento.subjectId,
            periodId: elemento.periodId,
            student: { isActive: true, deletedAt: null },
          },
          include: sincronizacioncalificacioninclude,
        });
        if (
          !calificacion ||
          calificacion.enrollment.status !== 'ACTIVE' ||
          !calificacion.period.isClosed ||
          !calificacion.period.academicYear.isActive
        ) {
          throw new ConflictException(
            'La calificación ya no cumple los criterios para reintentar la sincronización',
          );
        }

        await tx.sieSynchronizationItem.update({
          where: { id: elemento.id },
          data: {
            localValue: calificacion.value,
            sieValue: null,
            status: estadosincronizacionsie.QUEUED,
            errorMessage: null,
            retryCount: 0,
            verifiedAt: null,
          },
        });
        await tx.sieSynchronization.update({
          where: { id: elemento.synchronizationId },
          data: {
            status: estadosincronizacionsie.QUEUED,
            processedItems: Math.max(0, elemento.synchronization.processedItems - 1),
            errorCount: Math.max(0, elemento.synchronization.errorCount - 1),
            completedAt: null,
          },
        });
        await tx.auditLog.create({
          data: {
            userId: entrada.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'SieSynchronizationItem',
            entityId: elemento.id,
            studentIds: [elemento.studentId],
            previousValue: {
              status: elemento.status,
              localValue: elemento.localValue,
              errorMessage: elemento.errorMessage,
            },
            newValue: {
              status: estadosincronizacionsie.QUEUED,
              localValue: calificacion.value,
            },
            reason: entrada.reason.trim(),
            ipAddress: entrada.ipAddress,
            correlationId: entrada.correlationId ?? elemento.synchronizationId,
          },
        });

        return {
          synchronizationId: elemento.synchronizationId,
          itemId: elemento.id,
          studentRude: calificacion.student.rude,
          academicYear: calificacion.period.academicYear.year,
          periodNumber: calificacion.period.number,
          subjectCode: calificacion.subject.code,
          subjectName: calificacion.subject.name,
          courseGradeLevel: calificacion.enrollment.course.gradeLevel,
          courseSection: calificacion.enrollment.course.section,
          courseShift: calificacion.enrollment.course.shift,
          localGrade: calificacion.value,
          correlationId: entrada.correlationId ?? elemento.synchronizationId,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  async reanudarsincronizacionpausada(entrada: {
    synchronizationId: string;
    userId: string;
    reason: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "sie_synchronizations" WHERE "id" = ${entrada.synchronizationId} FOR UPDATE
      `;
        const sincronizacion = await tx.sieSynchronization.findUnique({
          where: { id: entrada.synchronizationId },
          select: {
            id: true,
            status: true,
            totalItems: true,
            processedItems: true,
            discrepancyCount: true,
            errorCount: true,
          },
        });
        if (!sincronizacion) throw new NotFoundException('Sincronización no encontrada');
        if (sincronizacion.status !== estadosincronizacionsie.PAUSED) {
          throw new ConflictException('Solo se pueden reanudar sincronizaciones pausadas');
        }

        const grupospendientes = await tx.sieDiscrepancyGroup.count({
          where: { synchronizationId: entrada.synchronizationId, status: { not: 'RESOLVED' } },
        });
        if (grupospendientes > 0) {
          throw new ConflictException(
            'Revise y resuelva los grupos de discrepancias antes de reanudar el lote',
          );
        }

        await tx.sieSynchronizationItem.updateMany({
          where: {
            synchronizationId: entrada.synchronizationId,
            status: estadosincronizacionsie.AUTH_REQUIRED,
          },
          data: {
            status: estadosincronizacionsie.QUEUED,
            processingToken: null,
            processingLeaseUntil: null,
            errorMessage: null,
          },
        });
        await tx.sieSynchronizationItem.updateMany({
          where: {
            synchronizationId: entrada.synchronizationId,
            status: estadosincronizacionsie.PENDING,
          },
          data: { status: estadosincronizacionsie.QUEUED },
        });
        const elementosencola = await tx.sieSynchronizationItem.findMany({
          where: {
            synchronizationId: entrada.synchronizationId,
            status: estadosincronizacionsie.QUEUED,
          },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          include: {
            student: { select: { rude: true } },
            subject: { select: { code: true, name: true } },
            period: { include: { academicYear: { select: { year: true } } } },
          },
        });
        const contextoscursoreanudacion = new Map<string, { gradeLevel: number; section: string; shift: string }>();
        if (elementosencola.length > 0 && (tx as unknown as { grade?: { findMany?: unknown } }).grade?.findMany) {
          const calificacionesreanudacion = (await (tx as unknown as { grade: { findMany: typeof this.prisma.grade.findMany } }).grade.findMany({
            where: {
              OR: elementosencola.map((e) => ({
                studentId: e.studentId,
                subjectId: e.subjectId,
                periodId: e.periodId,
              })),
            },
            select: {
              studentId: true,
              subjectId: true,
              periodId: true,
              enrollment: { select: { course: { select: { gradeLevel: true, section: true, shift: true } } } },
            },
          })) ?? [];
          for (const cal of calificacionesreanudacion) {
            if (cal?.enrollment?.course) {
              contextoscursoreanudacion.set(
                `${cal.studentId}|${cal.subjectId}|${cal.periodId}`,
                cal.enrollment.course,
              );
            }
          }
        }
        const elementosprocesando = await tx.sieSynchronizationItem.count({
          where: {
            synchronizationId: entrada.synchronizationId,
            status: estadosincronizacionsie.PROCESSING,
          },
        });
        const estadofinal = calcularestadoreanudacionsie({
          elementosencola: elementosencola.length,
          elementosprocesando,
          elementosprocesados: sincronizacion.processedItems,
          elementosesperados: sincronizacion.totalItems,
          cantidaderrores: sincronizacion.errorCount,
          cantidaddiscrepancias: sincronizacion.discrepancyCount,
        });
        if (!estadofinal) {
          throw new ConflictException(
            'El lote conserva elementos sin procesar que no se pueden reanudar automáticamente',
          );
        }
        const evento =
          estadofinal === estadosincronizacionsie.QUEUED
            ? 'BATCH_RESUMED_AFTER_REVIEW'
            : estadofinal === estadosincronizacionsie.PROCESSING
              ? 'BATCH_RESUMED_WITH_ACTIVE_ITEMS'
              : 'BATCH_FINALIZED_AFTER_REVIEW';
        await tx.sieSynchronization.update({
          where: { id: entrada.synchronizationId },
          data: {
            status: estadofinal,
            pausedAt: null,
            pausedReason: null,
            completedAt:
              estadofinal === estadosincronizacionsie.QUEUED ||
              estadofinal === estadosincronizacionsie.PROCESSING
                ? null
                : new Date(),
          },
        });
        const correlacionid = entrada.correlationId ?? entrada.synchronizationId;
        const tareas = elementosencola.map((elemento) => {
          const cursoreanudacion = contextoscursoreanudacion.get(
            `${elemento.studentId}|${elemento.subjectId}|${elemento.periodId}`,
          );
          return {
            synchronizationId: elemento.synchronizationId,
            itemId: elemento.id,
            studentRude: elemento.student.rude,
            academicYear: elemento.period.academicYear.year,
            periodNumber: elemento.period.number,
            subjectCode: elemento.subject.code,
            subjectName: elemento.subject.name,
            ...(cursoreanudacion
              ? {
                  courseGradeLevel: cursoreanudacion.gradeLevel,
                  courseSection: cursoreanudacion.section,
                  courseShift: cursoreanudacion.shift,
                }
              : {}),
            localGrade: elemento.localValue,
            correlationId: correlacionid,
          };
        });
        await tx.auditLog.create({
          data: {
            userId: entrada.userId,
            action: PrismaAuditAction.SYNC_SIE,
            entity: 'SieSynchronization',
            entityId: entrada.synchronizationId,
            correlationId: correlacionid,
            newValue: {
              event: evento,
              status: estadofinal,
              resumedItemCount: tareas.length,
              activeItemCount: elementosprocesando,
            },
            reason: entrada.reason.trim(),
            ipAddress: entrada.ipAddress,
          },
        });
        return {
          synchronizationId: sincronizacion.id,
          totalItems: sincronizacion.totalItems,
          status: estadofinal,
          jobs: tareas,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
}
