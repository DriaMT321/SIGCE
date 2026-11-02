import { ConflictException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { createHash } from 'node:crypto';
import { estadosincronizacionsie } from '@academic/shared-types';
import type { servicioprisma } from '../../../../common/database/prisma.service';
import type {
  entradacrearsincronizacion,
  filtrossincronizacionsie,
  vistapreviasincronizacionsie,
} from '../../application/ports/repositoriosincronizacionsie';
import { constantetamanomaximolotesincronizacionsie } from '../../domain/policies/politicasincronizacionsie';
import { sincronizacionitemrelacionesinclude } from './consultarsincronizacionsieprisma';
import {
  sincronizacioncalificacioninclude,
  type sincronizacioncalificacion,
} from './inclusionsincronizacionsie.prisma';

export class repositoriocrearsincronizacionsieprisma {
  constructor(private readonly prisma: servicioprisma) {}
  async previsualizardesdecalificaciones(
    entrada: filtrossincronizacionsie,
  ): Promise<vistapreviasincronizacionsie> {
    const calificaciones = await this.prisma.grade.findMany({
      where: this.filtrocalificaciones(entrada),
      orderBy: { id: 'asc' },
      include: sincronizacioncalificacioninclude,
    });
    return this.avistaprevia(calificaciones, entrada.academicYearId, entrada.periodNumber);
  }

  async creardesdecalificaciones(entrada: entradacrearsincronizacion) {
    try {
      return await this.prisma.$transaction(
        async (transaction) => {
          const existente = await this.buscaridempotencia(transaction, entrada);
          if (existente) return existente;

          const calificaciones = await transaction.grade.findMany({
            where: this.filtrocalificaciones(entrada),
            orderBy: { id: 'asc' },
            include: sincronizacioncalificacioninclude,
          });
          if (calificaciones.length === 0) {
            if (entrada.expectedGradeCount > 0) {
              throw new ConflictException(
                'El lote cambió después del resumen. Genere una vista previa nueva.',
              );
            }
            return null;
          }

          const vistaprevia = this.avistaprevia(
            calificaciones,
            entrada.academicYearId,
            entrada.periodNumber,
          );
          if (
            vistaprevia.totalGrades !== entrada.expectedGradeCount ||
            vistaprevia.fingerprint !== entrada.expectedFingerprint
          ) {
            throw new ConflictException(
              'Las calificaciones cambiaron después del resumen. Revise y confirme el lote actualizado.',
            );
          }

          const sincronizacion = await transaction.sieSynchronization.create({
            data: {
              idempotencyKey: entrada.idempotencyKey,
              requestedById: entrada.requestedById,
              syncType: entrada.syncType,
              status: estadosincronizacionsie.QUEUED,
              totalItems: calificaciones.length,
              items: {
                create: calificaciones.map((calificacion) => ({
                  studentId: calificacion.studentId,
                  subjectId: calificacion.subjectId,
                  periodId: calificacion.periodId,
                  localValue: calificacion.value,
                  status: estadosincronizacionsie.QUEUED,
                })),
              },
            },
            include: { items: { include: sincronizacionitemrelacionesinclude } },
          });

          const calificacionesporidentidad = new Map(
            calificaciones.map((calificacion) => [
              this.calificacionidentidad(
                calificacion.studentId,
                calificacion.subjectId,
                calificacion.periodId,
              ),
              calificacion,
            ]),
          );
          const tareas = sincronizacion.items.map((elemento) => {
            const calificacion = calificacionesporidentidad.get(
              this.calificacionidentidad(elemento.studentId, elemento.subjectId, elemento.periodId),
            );
            if (!calificacion) {
              throw new Error(`No se encontró la calificación local del ítem ${elemento.id}`);
            }
            return {
              synchronizationId: sincronizacion.id,
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
              ...(entrada.correlationId ? { correlationId: entrada.correlationId } : {}),
            };
          });

          await transaction.auditLog.create({
            data: {
              userId: entrada.requestedById,
              action: PrismaAuditAction.SYNC_SIE,
              entity: 'SieSynchronization',
              entityId: sincronizacion.id,
              correlationId: entrada.correlationId ?? sincronizacion.id,
              ipAddress: entrada.ipAddress,
              newValue: {
                event: 'CONFIRMED_BEFORE_ENQUEUE',
                source: 'LOCAL_SIE_SIMULATION',
                status: estadosincronizacionsie.QUEUED,
                syncType: entrada.syncType,
                periodNumber: entrada.periodNumber,
                courseId: entrada.courseId ?? null,
                subjectId: entrada.subjectId ?? null,
                totalGrades: vistaprevia.totalGrades,
                studentCount: vistaprevia.studentCount,
                courseCount: vistaprevia.courseCount,
                subjectCount: vistaprevia.subjectCount,
                fingerprint: vistaprevia.fingerprint,
                confirmedAt: new Date().toISOString(),
              },
              reason: 'El usuario revisó y confirmó el resumen del lote antes de encolarlo.',
            },
          });

          return { synchronization: sincronizacion, jobs: tareas, reutilizado: false };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      try {
        const existente = await this.buscaridempotencia(this.prisma, entrada);
        if (existente) return existente;
      } catch (erroridempotencia) {
        if (erroridempotencia instanceof ConflictException) throw erroridempotencia;
      }
      throw error;
    }
  }

  private async buscaridempotencia(
    ejecutor: Pick<
      Prisma.TransactionClient,
      'sieSynchronization' | 'sieSynchronizationItem' | 'auditLog'
    >,
    entrada: entradacrearsincronizacion,
  ) {
    const sincronizacion = await ejecutor.sieSynchronization.findUnique({
      where: { idempotencyKey: entrada.idempotencyKey },
      select: { id: true, requestedById: true, status: true, totalItems: true },
    });
    if (!sincronizacion) return null;

    const evento = await ejecutor.auditLog.findFirst({
      where: {
        action: PrismaAuditAction.SYNC_SIE,
        entity: 'SieSynchronization',
        entityId: sincronizacion.id,
      },
      orderBy: { createdAt: 'asc' },
      select: { userId: true, correlationId: true, newValue: true },
    });
    const valor = evento?.newValue;
    const detalle =
      valor && typeof valor === 'object' && !Array.isArray(valor)
        ? (valor as Record<string, unknown>)
        : null;
    if (
      sincronizacion.requestedById !== entrada.requestedById ||
      evento?.userId !== entrada.requestedById ||
      detalle?.event !== 'CONFIRMED_BEFORE_ENQUEUE' ||
      detalle.fingerprint !== entrada.expectedFingerprint ||
      detalle.totalGrades !== entrada.expectedGradeCount
    ) {
      throw new ConflictException('La clave Idempotency-Key ya se usó para otra confirmación.');
    }

    const elementos = await ejecutor.sieSynchronizationItem.findMany({
      where: {
        synchronizationId: sincronizacion.id,
        status: { in: [estadosincronizacionsie.PENDING, estadosincronizacionsie.QUEUED] },
      },
      select: {
        id: true,
        synchronizationId: true,
        localValue: true,
        student: { select: { rude: true } },
        subject: { select: { code: true, name: true } },
        period: { select: { number: true, academicYear: { select: { year: true } } } },
      },
    });
    const correlationId = evento.correlationId ?? sincronizacion.id;
    return {
      synchronization: {
        id: sincronizacion.id,
        status: sincronizacion.status,
        totalItems: sincronizacion.totalItems,
      },
      jobs: elementos.map((elemento) => ({
        synchronizationId: elemento.synchronizationId,
        itemId: elemento.id,
        studentRude: elemento.student.rude,
        academicYear: elemento.period.academicYear.year,
        periodNumber: elemento.period.number,
        subjectCode: elemento.subject.code,
        subjectName: elemento.subject.name,
        localGrade: elemento.localValue,
        correlationId,
      })),
      reutilizado: true as const,
    };
  }

  private filtrocalificaciones(entrada: filtrossincronizacionsie): Prisma.GradeWhereInput {
    return {
      student: { isActive: true, deletedAt: null },
      enrollment: {
        status: 'ACTIVE',
        ...(entrada.courseId ? { courseId: entrada.courseId } : {}),
      },
      ...(entrada.subjectId ? { subjectId: entrada.subjectId } : {}),
      period: {
        number: entrada.periodNumber,
        isClosed: true,
        academicYear: { id: entrada.academicYearId, isActive: true },
      },
    };
  }

  private avistaprevia(
    calificaciones: sincronizacioncalificacion[],
    idgestionacademica: string,
    numeroperiodo: number,
  ): vistapreviasincronizacionsie {
    const cursos = new Map<string, { id: string; name: string; gradeCount: number }>();
    for (const calificacion of calificaciones) {
      const curso = calificacion.enrollment.course;
      const existente = cursos.get(curso.id);
      if (existente) existente.gradeCount++;
      else cursos.set(curso.id, { id: curso.id, name: curso.name, gradeCount: 1 });
    }

    const fingerprintentrada = calificaciones.map((calificacion) => [
      calificacion.id,
      calificacion.studentId,
      calificacion.subjectId,
      calificacion.periodId,
      calificacion.value,
      calificacion.student.rude,
      calificacion.subject.code,
      calificacion.period.number,
      calificacion.period.academicYear.year,
      calificacion.enrollment.course.id,
    ]);

    return {
      fingerprint: createHash('sha256').update(JSON.stringify(fingerprintentrada)).digest('hex'),
      academicYearId: idgestionacademica,
      periodNumber: numeroperiodo,
      maxBatchSize: constantetamanomaximolotesincronizacionsie,
      academicYears: [
        ...new Set(calificaciones.map((calificacion) => calificacion.period.academicYear.year)),
      ].sort(),
      totalGrades: calificaciones.length,
      studentCount: new Set(calificaciones.map((calificacion) => calificacion.studentId)).size,
      courseCount: cursos.size,
      subjectCount: new Set(calificaciones.map((calificacion) => calificacion.subjectId)).size,
      courses: [...cursos.values()].sort((a, b) => a.name.localeCompare(b.name, 'es')),
    };
  }

  private calificacionidentidad(
    idestudiante: string,
    materiaid: string,
    periodoid: string,
  ): string {
    return `${idestudiante}\u0000${materiaid}\u0000${periodoid}`;
  }
}
