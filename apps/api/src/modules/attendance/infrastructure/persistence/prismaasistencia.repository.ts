import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { entidadasistencia } from '../../domain/entities/asistencia.entity';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import {
  datoscreacionasistencia,
  contextocreacionasistencia,
  repositorioasistencias,
  datosactualizacionasistencia,
  estadoasignacioncursodocente,
  contextopermisoescrituraasistencia,
} from '../../domain/repositories/asistencia.repository.interface';

async function bloqueoyvalidarattendancecontexto(
  tx: Prisma.TransactionClient,
  datos: datoscreacionasistencia,
): Promise<void> {
  const validocontexts = await tx.$queryRaw<Array<{ enrollmentId: string }>>`
    SELECT e."id" AS "enrollmentId"
    FROM "students" AS s
    INNER JOIN "enrollments" AS e ON e."student_id" = s."id"
    INNER JOIN "courses" AS c ON c."id" = e."course_id"
    INNER JOIN "academic_years" AS y ON y."id" = c."academic_year_id"
    WHERE s."id" = ${datos.studentId}
      AND s."is_active" = TRUE
      AND s."deleted_at" IS NULL
      AND e."course_id" = ${datos.courseId}
      AND e."status" = 'ACTIVE'
      AND e."academic_year_id" = c."academic_year_id"
      AND y."is_closed" = FALSE
      AND ${datos.date}::date BETWEEN y."start_date" AND y."end_date"
    FOR UPDATE OF s, e, c, y
  `;
  if (validocontexts.length === 0) {
    throw new ConflictException(
      'El estudiante debe tener matrícula activa y la fecha debe pertenecer a una gestión abierta',
    );
  }
}

async function bloqueodocenteasignacion(
  tx: Prisma.TransactionClient,
  idusuariodocente: string,
  cursoid: string,
): Promise<void> {
  const asignaciones = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT ts."id"
    FROM "teacher_subjects" AS ts
    INNER JOIN "teachers" AS t ON t."id" = ts."teacher_id"
    INNER JOIN "courses" AS c ON c."id" = ts."course_id"
    WHERE t."user_id" = ${idusuariodocente}
      AND t."deleted_at" IS NULL
      AND ts."course_id" = ${cursoid}
      AND ts."academic_year_id" = c."academic_year_id"
    FOR UPDATE OF ts, t
  `;
  if (asignaciones.length === 0) {
    throw new ForbiddenException('El docente no tiene asignación académica para este curso');
  }
}

@Injectable()
export class repositorioasistenciaprisma implements repositorioasistencias {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscartodos(consulta: {
    studentId?: string;
    courseId?: string;
    from?: Date;
    to?: Date;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    const cursosasignados = consulta.teacherUserId
      ? await this.prisma.teacherSubject.findMany({
          where: { teacher: { userId: consulta.teacherUserId, deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
          select: { courseId: true },
          distinct: ['courseId'],
        })
      : undefined;

    if (
      cursosasignados &&
      consulta.courseId &&
      !cursosasignados.some(({ courseId }) => courseId === consulta.courseId)
    ) {
      throw new ForbiddenException('El docente no tiene asignación académica para este curso');
    }
    if (cursosasignados && cursosasignados.length === 0) return { items: [], total: 0 };

    const where = {
      ...(consulta.studentId ? { studentId: consulta.studentId } : {}),
      ...(consulta.courseId
        ? { courseId: consulta.courseId }
        : cursosasignados
          ? { courseId: { in: cursosasignados.map(({ courseId: cursoid }) => cursoid) } }
          : {}),
      ...(consulta.from || consulta.to
        ? {
            date: {
              ...(consulta.from ? { gte: consulta.from } : {}),
              ...(consulta.to ? { lte: consulta.to } : {}),
            },
          }
        : {}),
      ...(consulta.parentUserId
        ? {
            student: {
              OR: [
                { studentParents: { some: { parent: { userId: consulta.parentUserId } } } },
                { userId: consulta.parentUserId },
              ],
            },
          }
        : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: [{ date: 'desc' }, { id: 'asc' }],
        include: { student: true, course: true },
      }),
      this.prisma.attendance.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async buscarporidentificador(id: string) {
    const elemento = await this.prisma.attendance.findUnique({
      where: { id },
      include: { student: true, course: true },
    });
    return elemento ? this.mapa(elemento) : null;
  }

  async obtenercontextocreacion(
    idestudiante: string,
    idcurso: string,
  ): Promise<contextocreacionasistencia> {
    const [estudiante, curso, inscripcion] = await Promise.all([
      this.prisma.student.findUnique({
        where: { id: idestudiante },
        select: { isActive: true, deletedAt: true },
      }),
      this.prisma.course.findUnique({
        where: { id: idcurso },
        select: {
          id: true,
          academicYearId: true,
          academicYear: { select: { isClosed: true, startDate: true, endDate: true } },
        },
      }),
      this.prisma.enrollment.findFirst({
        where: { studentId: idestudiante, courseId: idcurso, status: 'ACTIVE' },
        select: { academicYearId: true },
      }),
    ]);

    return {
      student: estudiante
        ? { active: estudiante.isActive, deleted: estudiante.deletedAt !== null }
        : null,
      course: curso
        ? {
            id: curso.id,
            academicYearId: curso.academicYearId,
            academicYear: {
              closed: curso.academicYear.isClosed,
              startsAt: curso.academicYear.startDate,
              endsAt: curso.academicYear.endDate,
            },
          }
        : null,
      enrollmentAcademicYearId: inscripcion?.academicYearId ?? null,
    };
  }

  async obtenerestadoasignacioncursodocente(
    idusuario: string,
    idcurso: string,
    idgestionacademica: string,
  ): Promise<estadoasignacioncursodocente> {
    const docente = await this.prisma.teacher.findUnique({
      where: { userId: idusuario },
      select: { id: true },
    });
    if (!docente) return 'NO_PROFILE';
    const tarea = await this.prisma.teacherSubject.findFirst({
      where: { teacherId: docente.id, courseId: idcurso, academicYearId: idgestionacademica },
      select: { id: true },
    });
    return tarea ? 'ASSIGNED' : 'UNASSIGNED';
  }

  async existeasistencia(idestudiante: string, idcurso: string, fecha: Date): Promise<boolean> {
    return (
      (await this.prisma.attendance.findUnique({
        where: {
          studentId_courseId_date: { studentId: idestudiante, courseId: idcurso, date: fecha },
        },
        select: { id: true },
      })) !== null
    );
  }

  async obteneridanioacademicocurso(idcurso: string): Promise<string | null> {
    const curso = await this.prisma.course.findUnique({
      where: { id: idcurso },
      select: { academicYearId: true },
    });
    return curso?.academicYearId ?? null;
  }

  async crear(
    datos: datoscreacionasistencia,
    auditoria: auditoriacontexto,
    permiso: contextopermisoescrituraasistencia,
  ) {
    try {
      const elemento = await this.prisma.$transaction(async (tx) => {
        await bloqueoyvalidarattendancecontexto(tx, datos);
        if (permiso.teacherUserId) {
          await bloqueodocenteasignacion(tx, permiso.teacherUserId, datos.courseId);
        }
        const creado = await tx.attendance.create({
          data: { ...datos, status: datos.status as 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED' },
          include: { student: true, course: true },
        });
        await tx.alertEvaluationOutbox.create({
          data: { studentId: creado.studentId },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'Attendance',
            entityId: creado.id,
            studentIds: [creado.studentId],
            newValue: {
              date: creado.date,
              status: creado.status,
              justification: creado.justification,
              courseId: creado.courseId,
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return creado;
      });
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'La asistencia de este estudiante ya está registrada para esa fecha',
        );
      }
      throw error;
    }
  }

  async actualizar(
    id: string,
    datos: datosactualizacionasistencia,
    auditoria: auditoriacontexto,
    permiso: contextopermisoescrituraasistencia,
  ) {
    try {
      const elemento = await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "attendances" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0)
          throw new NotFoundException('Registro de asistencia no encontrado');
        const anterior = await tx.attendance.findUnique({ where: { id } });
        if (!anterior) throw new NotFoundException('Registro de asistencia no encontrado');
        const gestionhabilitada = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT a."id"
          FROM "attendances" AS a
          INNER JOIN "courses" AS c ON c."id" = a."course_id"
          INNER JOIN "academic_years" AS y ON y."id" = c."academic_year_id"
          WHERE a."id" = ${id}
            AND y."is_closed" = FALSE
            AND a."date"::date BETWEEN y."start_date" AND y."end_date"
          FOR UPDATE OF c, y
        `;
        if (gestionhabilitada.length === 0) {
          throw new ConflictException(
            'No se puede corregir asistencia de una gestión cerrada o fuera de sus fechas',
          );
        }
        if (permiso.teacherUserId) {
          await bloqueodocenteasignacion(tx, permiso.teacherUserId, anterior.courseId);
        }
        const actualizado = await tx.attendance.update({
          where: { id },
          data: { ...datos, status: datos.status as 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED' },
          include: { student: true, course: true },
        });
        await tx.alertEvaluationOutbox.create({ data: { studentId: actualizado.studentId } });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Attendance',
            entityId: id,
            studentIds: [anterior.studentId],
            previousValue: {
              date: anterior.date,
              status: anterior.status,
              justification: anterior.justification,
              courseId: anterior.courseId,
            },
            newValue: {
              date: actualizado.date,
              status: actualizado.status,
              justification: actualizado.justification,
              courseId: actualizado.courseId,
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return actualizado;
      });
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Registro de asistencia no encontrado');
      }
      throw error;
    }
  }

  private mapa(
    elemento: Awaited<ReturnType<servicioprisma['attendance']['findUnique']>> & {
      student?: unknown;
      course?: unknown;
    },
  ): entidadasistencia {
    const valor = elemento as NonNullable<
      Awaited<ReturnType<servicioprisma['attendance']['findUnique']>>
    > & {
      student: { id: string; rude: string; firstName: string; lastName: string };
      course: { id: string; name: string; gradeLevel: number; section: string };
    };
    return {
      id: valor.id,
      studentId: valor.studentId,
      courseId: valor.courseId,
      registeredById: valor.registeredById,
      date: valor.date,
      status: valor.status,
      justification: valor.justification,
      student: valor.student,
      course: valor.course,
    };
  }
}
