import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, GradeCorrectionStatus } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  entradacrearcorreccioncalificacion,
  entradadecidircorreccioncalificacion,
  estadodecisioncorreccioncalificacion,
  entidadcorreccioncalificacion,
  repositoriocorreccionescalificacion,
} from '../../domain/repositories/calificacioncorreccion.repository.interface';

const correccioninclude = {
  grade: {
    include: {
      student: { select: { firstName: true, lastName: true, rude: true } },
      subject: { select: { name: true, code: true } },
      period: { select: { name: true, number: true, isClosed: true } },
    },
  },
  requestedBy: { select: { firstName: true, lastName: true } },
  decidedBy: { select: { firstName: true, lastName: true } },
} satisfies Prisma.GradeCorrectionRequestInclude;

async function bloqueocorreccionperiodo(
  transaction: Prisma.TransactionClient,
  periodoid: string,
): Promise<boolean> {
  const periodos = await transaction.$queryRaw<Array<{ isClosed: boolean }>>`
    SELECT "is_closed" AS "isClosed"
    FROM "academic_periods"
    WHERE "id" = ${periodoid}
    FOR UPDATE
  `;
  if (!periodos[0]) throw new NotFoundException('Período académico no encontrado');
  return periodos[0].isClosed;
}

@Injectable()
export class repositoriocorreccioncalificacionprisma implements repositoriocorreccionescalificacion {
  constructor(private readonly prisma: servicioprisma) {}

  async crear(entrada: entradacrearcorreccioncalificacion): Promise<entidadcorreccioncalificacion> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const calificacion = await transaction.grade.findUnique({
          where: { id: entrada.gradeId },
          include: { period: true },
        });
        if (!calificacion) throw new NotFoundException('Calificación no encontrada');
        if (!calificacion.period.isClosed) {
          throw new ConflictException('El período fue abierto mientras se preparaba la solicitud');
        }
        if (calificacion.value !== entrada.previousValue) {
          throw new ConflictException(
            'La calificación cambió; actualice la solicitud con el valor vigente',
          );
        }
        const existentependiente = await transaction.gradeCorrectionRequest.findFirst({
          where: { gradeId: entrada.gradeId, status: GradeCorrectionStatus.PENDING },
          select: { id: true },
        });
        if (existentependiente) {
          throw new ConflictException('Ya existe una solicitud pendiente para esta calificación');
        }

        const solicitud = await transaction.gradeCorrectionRequest.create({
          data: {
            gradeId: entrada.gradeId,
            requestedById: entrada.requestedById,
            previousValue: entrada.previousValue,
            proposedValue: entrada.proposedValue,
            reason: entrada.reason,
            evidenceReference: entrada.evidenceReference,
          },
          include: correccioninclude,
        });
        await transaction.auditLog.create({
          data: {
            userId: entrada.requestedById,
            action: 'CREATE',
            entity: 'GradeCorrectionRequest',
            entityId: solicitud.id,
            studentIds: [calificacion.studentId],
            correlationId: solicitud.id,
            ipAddress: entrada.ipAddress,
            previousValue: { value: entrada.previousValue },
            newValue: {
              gradeId: entrada.gradeId,
              previousValue: entrada.previousValue,
              proposedValue: entrada.proposedValue,
              reason: entrada.reason,
              evidenceReference: entrada.evidenceReference,
              status: 'PENDING',
            },
            reason: entrada.reason,
          },
        });
        return solicitud as entidadcorreccioncalificacion;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una solicitud pendiente para esta calificación');
      }
      throw error;
    }
  }

  async buscartodos(consulta: {
    status?: 'PENDING' | 'EXECUTED' | 'REJECTED';
    requestedById?: string;
    limit: number;
    offset: number;
  }) {
    const where = {
      ...(consulta.status ? { status: consulta.status as GradeCorrectionStatus } : {}),
      ...(consulta.requestedById ? { requestedById: consulta.requestedById } : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.gradeCorrectionRequest.findMany({
        where,
        include: correccioninclude,
        orderBy: { createdAt: 'desc' },
        take: consulta.limit,
        skip: consulta.offset,
      }),
      this.prisma.gradeCorrectionRequest.count({ where }),
    ]);
    return { items: elementos as entidadcorreccioncalificacion[], total };
  }

  async buscarestadodecision(
    idsolicitud: string,
  ): Promise<estadodecisioncorreccioncalificacion | null> {
    const solicitud = await this.prisma.gradeCorrectionRequest.findUnique({
      where: { id: idsolicitud },
      select: {
        previousValue: true,
        proposedValue: true,
        reason: true,
        evidenceReference: true,
        status: true,
      },
    });
    if (!solicitud) return null;
    return {
      ...solicitud,
      status: solicitud.status as estadodecisioncorreccioncalificacion['status'],
    };
  }

  async decidir(
    entrada: entradadecidircorreccioncalificacion,
  ): Promise<entidadcorreccioncalificacion> {
    return this.prisma.$transaction(async (transaction) => {
      let existente = await transaction.gradeCorrectionRequest.findUnique({
        where: { id: entrada.requestId },
        include: { grade: { include: { period: true } } },
      });
      if (!existente) throw new NotFoundException('Solicitud de corrección no encontrada');
      if (existente.status !== GradeCorrectionStatus.PENDING) {
        throw new ConflictException('La solicitud ya fue resuelta');
      }
      if (existente.requestedById === entrada.decidedById) {
        throw new ConflictException(
          'La persona que solicita la corrección no puede aprobarla ni rechazarla',
        );
      }

      if (entrada.decision === 'EXECUTED') {
        const periodocerrado = await bloqueocorreccionperiodo(
          transaction,
          existente.grade.periodId,
        );
        const bloqueadocalificaciones = await transaction.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "grades" WHERE "id" = ${existente.gradeId} FOR UPDATE
        `;
        if (bloqueadocalificaciones.length === 0)
          throw new NotFoundException('Calificación no encontrada');

        const actual = await transaction.gradeCorrectionRequest.findUnique({
          where: { id: entrada.requestId },
          include: { grade: { include: { period: true } } },
        });
        if (!actual) throw new NotFoundException('Solicitud de corrección no encontrada');
        if (actual.status !== GradeCorrectionStatus.PENDING) {
          throw new ConflictException('La solicitud ya fue resuelta');
        }
        if (actual.grade.periodId !== existente.grade.periodId) {
          throw new ConflictException(
            'La calificación cambió de período durante la operación; revise la solicitud.',
          );
        }
        if (!periodocerrado || !actual.grade.period.isClosed) {
          throw new ConflictException(
            'El período ya no está cerrado; revise la solicitud antes de aprobarla',
          );
        }
        if (actual.grade.value !== actual.previousValue) {
          throw new ConflictException('La calificación cambió después de crear la solicitud');
        }
        existente = actual;
      }

      const decideden = new Date();
      const claimeddecision = await transaction.gradeCorrectionRequest.updateMany({
        where: { id: existente.id, status: GradeCorrectionStatus.PENDING },
        data: {
          status: entrada.decision,
          decisionReason: entrada.decisionReason,
          decidedById: entrada.decidedById,
          decidedAt: decideden,
          ...(entrada.decision === 'EXECUTED' ? { executedAt: decideden } : {}),
        },
      });
      if (claimeddecision.count === 0) {
        throw new ConflictException('La solicitud ya fue resuelta');
      }

      let actualizadocalificacionvalor = existente.grade.value;
      if (entrada.decision === 'EXECUTED') {
        if (!existente.grade.period.isClosed) {
          throw new ConflictException(
            'El período ya no está cerrado; revise la solicitud antes de aprobarla',
          );
        }
        if (existente.grade.value !== existente.previousValue) {
          throw new ConflictException('La calificación cambió después de crear la solicitud');
        }
        await transaction.grade.update({
          where: { id: existente.gradeId },
          data: { value: existente.proposedValue },
        });
        await transaction.alertEvaluationOutbox.create({
          data: { studentId: existente.grade.studentId },
        });
        actualizadocalificacionvalor = existente.proposedValue;
        await transaction.auditLog.create({
          data: {
            userId: entrada.decidedById,
            action: 'UPDATE',
            entity: 'Grade',
            entityId: existente.gradeId,
            studentIds: [existente.grade.studentId],
            correlationId: existente.id,
            ipAddress: entrada.ipAddress,
            previousValue: { value: existente.previousValue },
            newValue: {
              value: existente.proposedValue,
              correctionRequestId: existente.id,
              evidenceReference: existente.evidenceReference,
              authorizedById: entrada.decidedById,
              requestedById: existente.requestedById,
            },
            reason: existente.reason,
          },
        });
      }

      const actualizado = await transaction.gradeCorrectionRequest.findUniqueOrThrow({
        where: { id: existente.id },
        include: correccioninclude,
      });
      await transaction.auditLog.create({
        data: {
          userId: entrada.decidedById,
          action: 'UPDATE',
          entity: 'GradeCorrectionRequest',
          entityId: existente.id,
          studentIds: [existente.grade.studentId],
          correlationId: existente.id,
          ipAddress: entrada.ipAddress,
          previousValue: { status: existente.status, gradeValue: existente.previousValue },
          newValue: {
            status: entrada.decision,
            gradeValue: actualizadocalificacionvalor,
            decisionReason: entrada.decisionReason,
            decidedById: entrada.decidedById,
          },
          reason: entrada.decisionReason,
        },
      });
      return actualizado as entidadcorreccioncalificacion;
    });
  }
}
