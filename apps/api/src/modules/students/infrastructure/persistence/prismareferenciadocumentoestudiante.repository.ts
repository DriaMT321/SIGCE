import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  repositorioreferenciasdocumentosestudiante,
  tipodocumentoestudiante,
} from '../../domain/repositories/referenciadocumentoestudiante.repository.interface';

@Injectable()
export class repositorioreferenciadocumentoestudianteprisma implements repositorioreferenciasdocumentosestudiante {
  constructor(private readonly prisma: servicioprisma) {}

  async buscarporestudiante(idestudiante: string) {
    const estudiante = await this.prisma.student.findFirst({
      where: { id: idestudiante, deletedAt: null },
      select: { id: true },
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return this.prisma.studentDocumentReference.findMany({
      where: { studentId: idestudiante },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async crear(entrada: {
    studentId: string;
    documentType: tipodocumentoestudiante;
    reference: string;
    notes?: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const estudiante = await tx.student.findFirst({
        where: { id: entrada.studentId, deletedAt: null },
        select: { id: true },
      });
      if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
      const referencia = await tx.studentDocumentReference.create({
        data: {
          studentId: entrada.studentId,
          documentType: entrada.documentType,
          reference: entrada.reference,
          notes: entrada.notes,
          createdById: entrada.userId,
        },
        include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
      });
      await tx.auditLog.create({
        data: {
          userId: entrada.userId,
          action: PrismaAuditAction.CREATE,
          entity: 'StudentDocumentReference',
          entityId: referencia.id,
          studentIds: [entrada.studentId],
          newValue: {
            documentType: referencia.documentType,
            reference: referencia.reference,
            notes: referencia.notes,
          },
          ipAddress: entrada.ipAddress,
          correlationId: entrada.correlationId,
        },
      });
      return referencia;
    });
  }
}
