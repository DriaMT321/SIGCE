import { Injectable } from '@nestjs/common';
import { AuditAction, type Prisma } from '@prisma/client';
import { createHash } from 'node:crypto';
import { servicioprisma } from '../../../../common/database/prisma.service';
import type {
  contextoasistentesieregistro,
  datosseleccionasistentesie,
  notaasistentesieregistro,
  registroauditoriaasistentesie,
  repositorioasistentesie,
} from '../../application/ports/asistentesie.port';

@Injectable()
export class repositorioasistentesieprisma implements repositorioasistentesie {
  constructor(private readonly prisma: servicioprisma) {}

  async obtenercontexto(
    filtros: datosseleccionasistentesie,
  ): Promise<contextoasistentesieregistro> {
    const [course, subject, period] = await Promise.all([
      this.prisma.course.findFirst({
        where: { id: filtros.courseId, academicYearId: filtros.academicYearId },
        select: { id: true, name: true },
      }),
      this.prisma.subject.findUnique({
        where: { id: filtros.subjectId },
        select: { id: true, name: true, code: true },
      }),
      this.prisma.academicPeriod.findUnique({
        where: {
          academicYearId_number: {
            academicYearId: filtros.academicYearId,
            number: filtros.periodNumber,
          },
        },
        select: { id: true, name: true, number: true, isClosed: true },
      }),
    ]);

    return { course, subject, period };
  }

  listarnotaspublicadas(
    filtros: datosseleccionasistentesie,
    periodId: string,
  ): Promise<notaasistentesieregistro[]> {
    return this.prisma.grade.findMany({
      where: {
        subjectId: filtros.subjectId,
        periodId,
        publishedAt: { not: null },
        student: { isActive: true, deletedAt: null },
        enrollment: {
          courseId: filtros.courseId,
          academicYearId: filtros.academicYearId,
          status: 'ACTIVE',
        },
      },
      select: {
        id: true,
        studentId: true,
        value: true,
        updatedAt: true,
        publishedAt: true,
        student: {
          select: { rude: true, firstName: true, lastName: true },
        },
      },
    });
  }

  resumensha256(contenido: string): string {
    return createHash('sha256').update(contenido).digest('hex');
  }

  buscarauditoria(operationId: string): Promise<registroauditoriaasistentesie | null> {
    return this.prisma.auditLog.findUnique({
      where: { id: operationId },
      select: { id: true, createdAt: true, userId: true, entity: true, newValue: true },
    });
  }

  crearauditoria(datos: {
    operationId: string;
    userId: string;
    courseId: string;
    ipAddress?: string;
    userAgent?: string;
    correlationId?: string;
    studentIds: string[];
    newValue: unknown;
    reason: string;
  }): Promise<{ id: string; createdAt: Date }> {
    return this.prisma.auditLog.create({
      data: {
        id: datos.operationId,
        userId: datos.userId,
        action: AuditAction.CREATE,
        entity: 'SieAssistedEntrySummary',
        entityId: datos.courseId,
        ipAddress: datos.ipAddress,
        userAgent: datos.userAgent,
        correlationId: datos.correlationId,
        studentIds: datos.studentIds,
        newValue: datos.newValue as Prisma.InputJsonValue,
        reason: datos.reason,
      },
      select: { id: true, createdAt: true },
    });
  }
}
