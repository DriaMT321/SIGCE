import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditAction as PrismaAuditAction,
  AlertRuleType,
  AlertSeverity,
  AlertStatus,
  Prisma,
} from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import { entidadalerta } from '../../domain/entities/alerta.entity';
import {
  actualizacionreglaalerta,
  entidadreglaalerta,
} from '../../domain/entities/alertaregla.entity';
import {
  repositorioalertas,
  entradaalertatemprana,
  instantaneaadvertenciaestudiante,
} from '../../domain/repositories/alerta.repository.interface';

function filtrovinculovigente(idusuario: string): Pick<Prisma.AlertWhereInput, 'OR'> {
  return {
    OR: [
      { user: { role: { in: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'] } } },
      { studentId: null },
      { student: { OR: [
        { userId: idusuario },
        { studentParents: { some: { parent: { userId: idusuario } } } },
      ] } },
    ],
  };
}

@Injectable()
export class repositorioalertaprisma implements repositorioalertas {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscarporusuario(
    idusuario: string,
    limite: number,
    desplazamiento: number,
    estado?: string,
  ) {
    const where: Prisma.AlertWhereInput = { userId: idusuario, ...filtrovinculovigente(idusuario) };
    if (estado && ['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(estado)) {
      where.status = estado as AlertStatus;
    }
    const [elementos, total] = await Promise.all([
      this.prisma.alert.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limite,
        skip: desplazamiento,
      }),
      this.prisma.alert.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async marcarleida(id: string, idusuario: string, auditoria: auditoriacontexto) {
    try {
      const elemento = await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "alerts" WHERE "id" = ${id} AND "user_id" = ${idusuario} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Alerta no encontrada');
        const anterior = await tx.alert.findFirst({ where: { id, userId: idusuario, ...filtrovinculovigente(idusuario) } });
        if (!anterior) throw new NotFoundException('Alerta no encontrada');
        const actualizado = await tx.alert.update({
          where: { id, userId: idusuario, ...filtrovinculovigente(idusuario) },
          data: { isRead: true },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Alert',
            entityId: id,
            ...(anterior.studentId ? { studentIds: [anterior.studentId] } : {}),
            previousValue: { isRead: anterior.isRead },
            newValue: { isRead: actualizado.isRead },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return actualizado;
      });
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Alerta no encontrada');
      }
      throw error;
    }
  }

  async actualizarestado(
    id: string,
    idusuario: string,
    estado: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
    auditoria: auditoriacontexto,
  ) {
    try {
      const elemento = await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "alerts" WHERE "id" = ${id} AND "user_id" = ${idusuario} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Alerta no encontrada');
        const anterior = await tx.alert.findFirst({ where: { id, userId: idusuario, ...filtrovinculovigente(idusuario) } });
        if (!anterior) throw new NotFoundException('Alerta no encontrada');
        const actualizado = await tx.alert.update({
          where: { id, userId: idusuario, ...filtrovinculovigente(idusuario) },
          data: { status: estado as AlertStatus },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Alert',
            entityId: id,
            ...(anterior.studentId ? { studentIds: [anterior.studentId] } : {}),
            previousValue: { status: anterior.status },
            newValue: { status: actualizado.status },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return actualizado;
      });
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Alerta no encontrada');
      }
      throw error;
    }
  }

  async listarreglas(): Promise<entidadreglaalerta[]> {
    const reglas = await this.prisma.alertRule.findMany({ orderBy: { key: 'asc' } });
    return reglas.map((regla) => ({
      key: regla.key,
      enabled: regla.enabled,
      severity: regla.severity,
      gradeThreshold: regla.gradeThreshold,
      absenceThreshold: regla.absenceThreshold,
      absenceWindowDays: regla.absenceWindowDays,
      updatedAt: regla.updatedAt,
    }));
  }

  async actualizarregla(
    entrada: actualizacionreglaalerta,
    auditoria: auditoriacontexto,
  ): Promise<entidadreglaalerta> {
    const datos = {
      enabled: entrada.enabled,
      severity: entrada.severity as AlertSeverity,
      gradeThreshold: entrada.key === 'LOW_GRADE' ? (entrada.gradeThreshold ?? null) : null,
      absenceThreshold:
        entrada.key !== 'LOW_GRADE' ? (entrada.absenceThreshold ?? null) : null,
      absenceWindowDays:
        entrada.key !== 'LOW_GRADE' ? (entrada.absenceWindowDays ?? null) : null,
    };
    const regla = await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "alert_rules" WHERE "key"::text = ${entrada.key} FOR UPDATE
      `;
      const anterior = await tx.alertRule.findUnique({
        where: { key: entrada.key as AlertRuleType },
      });
      const actualizado = await tx.alertRule.upsert({
        where: { key: entrada.key as AlertRuleType },
        create: { id: entrada.key, key: entrada.key as AlertRuleType, ...datos },
        update: datos,
      });
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: anterior ? PrismaAuditAction.UPDATE : PrismaAuditAction.CREATE,
          entity: 'AlertRule',
          entityId: actualizado.key,
          ...(anterior
            ? {
                previousValue: {
                  enabled: anterior.enabled,
                  severity: anterior.severity,
                  gradeThreshold: anterior.gradeThreshold,
                  absenceThreshold: anterior.absenceThreshold,
                  absenceWindowDays: anterior.absenceWindowDays,
                },
              }
            : {}),
          newValue: {
            enabled: actualizado.enabled,
            severity: actualizado.severity,
            gradeThreshold: actualizado.gradeThreshold,
            absenceThreshold: actualizado.absenceThreshold,
            absenceWindowDays: actualizado.absenceWindowDays,
          },
          ipAddress: auditoria.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });
      return actualizado;
    });
    return {
      key: regla.key,
      enabled: regla.enabled,
      severity: regla.severity,
      gradeThreshold: regla.gradeThreshold,
      absenceThreshold: regla.absenceThreshold,
      absenceWindowDays: regla.absenceWindowDays,
      updatedAt: regla.updatedAt,
    };
  }

  async obtenerinstantaneaadvertenciaestudiante(
    idestudiante: string,
    desde: Date,
    mediante: Date,
    desdeatrasos = desde,
  ): Promise<instantaneaadvertenciaestudiante | null> {
    const estudiante = await this.prisma.student.findFirst({
      where: { id: idestudiante, isActive: true, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userId: true,
        enrollments: {
          where: { status: 'ACTIVE', academicYear: { is: { isActive: true } } },
          select: { courseId: true },
        },
        studentParents: { select: { parent: { select: { userId: true } } } },
      },
    });
    if (!estudiante) return null;

    const [calificaciones, attendances, direccion] = await Promise.all([
      this.prisma.grade.findMany({
        where: {
          studentId: idestudiante,
          period: { academicYear: { isActive: true } },
          enrollment: {
            status: 'ACTIVE',
            courseId: { in: estudiante.enrollments.map((elemento) => elemento.courseId) },
          },
        },
        include: {
          subject: { select: { id: true, name: true } },
          period: { select: { id: true, name: true } },
          enrollment: {
            include: {
              course: {
                include: {
                  teacherSubjects: {
                    where: { academicYear: { isActive: true } },
                    include: { teacher: { select: { userId: true } } },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.attendance.findMany({
        where: {
          studentId: idestudiante,
          courseId: { in: estudiante.enrollments.map((elemento) => elemento.courseId) },
          OR: [
            { status: 'ABSENT', date: { gte: desde, lte: mediante } },
            { status: 'LATE', date: { gte: desdeatrasos, lte: mediante } },
          ],
          course: { academicYear: { isActive: true } },
        },
        include: {
          course: {
            include: {
              teacherSubjects: {
                where: { academicYear: { isActive: true } },
                include: { teacher: { select: { userId: true } } },
              },
            },
          },
        },
      }),
      this.prisma.user.findMany({
        where: { role: 'ADMINISTRATIVE', isActive: true, deletedAt: null },
        select: { id: true },
      }),
    ]);

    const porcurso = new Map<string, instantaneaadvertenciaestudiante['absences'][number]>();
    const atrasosporcurso = new Map<string, instantaneaadvertenciaestudiante['absences'][number]>();
    for (const attendance of attendances) {
      const grupo = attendance.status === 'LATE' ? atrasosporcurso : porcurso;
      const actual = grupo.get(attendance.courseId);
      if (actual) {
        actual.count += 1;
      } else {
        grupo.set(attendance.courseId, {
          courseId: attendance.courseId,
          courseName: attendance.course.name,
          count: 1,
          teacherUserIds: attendance.course.teacherSubjects.map(
            (elemento) => elemento.teacher.userId,
          ),
        });
      }
    }

    return {
      studentId: estudiante.id,
      studentName: `${estudiante.firstName} ${estudiante.lastName}`,
      studentUserId: estudiante.userId,
      guardianUserIds: estudiante.studentParents.map((elemento) => elemento.parent.userId),
      administrativeUserIds: direccion.map((usuario) => usuario.id),
      grades: calificaciones.map((calificacion) => ({
        id: calificacion.id,
        value: calificacion.value,
        subjectName: calificacion.subject.name,
        subjectId: calificacion.subject.id,
        periodId: calificacion.period.id,
        periodName: calificacion.period.name,
        courseId: calificacion.enrollment.course.id,
        courseName: calificacion.enrollment.course.name,
        teacherUserIds: calificacion.enrollment.course.teacherSubjects
          .filter((elemento) => elemento.subjectId === calificacion.subjectId)
          .map((elemento) => elemento.teacher.userId),
      })),
      absences: [...porcurso.values()],
      lateness: [...atrasosporcurso.values()],
    };
  }

  async conciliaralertastempranas(
    idestudiante: string,
    claveregla: AlertRuleType,
    activoalertas: entradaalertatemprana[],
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      for (const entrada of activoalertas) {
        const existente = await transaction.$queryRaw<Array<{ status: AlertStatus }>>`
          SELECT "status"
          FROM "alerts"
          WHERE "user_id" = ${entrada.userId}
            AND "deduplication_key" = ${entrada.deduplicationKey}
          FOR UPDATE
        `;
        if (existente[0]?.status === AlertStatus.RESOLVED) continue;

        await transaction.alert.upsert({
          where: {
            userId_deduplicationKey: {
              userId: entrada.userId,
              deduplicationKey: entrada.deduplicationKey,
            },
          },
          create: {
            userId: entrada.userId,
            studentId: entrada.studentId,
            ruleKey: entrada.ruleKey as AlertRuleType,
            deduplicationKey: entrada.deduplicationKey,
            title: entrada.title,
            message: entrada.message,
            severity: entrada.severity as AlertSeverity,
            metadata: entrada.metadata as Prisma.InputJsonObject,
          },
          update: {
            studentId: entrada.studentId,
            ruleKey: entrada.ruleKey as AlertRuleType,
            title: entrada.title,
            message: entrada.message,
            severity: entrada.severity as AlertSeverity,
            metadata: entrada.metadata as Prisma.InputJsonObject,
          },
        });
      }
    });
  }

  async listaridsestudiantesactivos(): Promise<string[]> {
    const estudiantes = await this.prisma.student.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        enrollments: { some: { status: 'ACTIVE', academicYear: { is: { isActive: true } } } },
      },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    return estudiantes.map(({ id }) => id);
  }

  async reclamarevaluacionespendientes(
    limite: number,
    ahora: Date,
    desactualizadobloqueoantes: Date,
  ) {
    return this.prisma.$transaction(
      (tx) =>
        tx.$queryRaw<Array<{ id: string; studentId: string; attempts: number }>>`
        WITH pendientes AS (
          SELECT "id"
          FROM "alert_evaluation_outbox"
          WHERE "available_at" <= ${ahora}
            AND ("locked_at" IS NULL OR "locked_at" < ${desactualizadobloqueoantes})
          ORDER BY "available_at" ASC, "created_at" ASC, "id" ASC
          LIMIT ${limite}
          FOR UPDATE SKIP LOCKED
        )
        UPDATE "alert_evaluation_outbox" AS tarea
        SET "locked_at" = ${ahora}
        FROM pendientes
        WHERE tarea."id" = pendientes."id"
        RETURNING tarea."id", tarea."student_id" AS "studentId", tarea."attempts"
      `,
    );
  }

  async completarevaluacionpendiente(id: string): Promise<void> {
    await this.prisma.alertEvaluationOutbox.deleteMany({ where: { id } });
  }

  async reintentarevaluacionpendiente(
    id: string,
    intentos: number,
    error: string,
    disponibledesde: Date,
  ): Promise<void> {
    await this.prisma.alertEvaluationOutbox.updateMany({
      where: { id },
      data: { attempts: intentos, lastError: error, availableAt: disponibledesde, lockedAt: null },
    });
  }

  private mapa(elemento: {
    id: string;
    userId: string;
    title: string;
    message: string;
    severity: string;
    status: AlertStatus;
    isRead: boolean;
    link: string | null;
    metadata: unknown;
    createdAt: Date;
  }): entidadalerta {
    return {
      id: elemento.id,
      userId: elemento.userId,
      title: elemento.title,
      message: elemento.message,
      severity: elemento.severity,
      status: elemento.status,
      isRead: elemento.isRead,
      link: elemento.link,
      metadata: elemento.metadata,
      createdAt: elemento.createdAt,
    };
  }
}
