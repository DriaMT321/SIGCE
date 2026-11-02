import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { grade } from '../../domain/entities/grade.entity';
import {
  datosactualizacioncalificacion,
  datoscreacioncalificacion,
} from '../../domain/entities/datosregistrocalificacion';
import {
  instantaneaauditoriacalificacion,
  contextoauditoriacalificacion,
  contextoauditoriacargamasivacalificaciones,
  repositoriocalificaciones,
  contextoescrituracalificacion,
  consultacontextoescrituracalificacion,
  contextopermisoescrituracalificacion,
  datosalcancepublicacioncalificaciones,
  resultadopublicacioncalificaciones,
} from '../../domain/repositories/calificacion.repository.interface';

type calificacionconrelations = Prisma.GradeGetPayload<{
  include: { student: true; subject: true; period: true };
}>;

async function bloqueoopenperiodo(
  tx: Prisma.TransactionClient,
  idperiodo: string,
): Promise<string> {
  const periodos = await tx.$queryRaw<Array<{ isClosed: boolean; academicYearId: string }>>`
    SELECT "is_closed" AS "isClosed", "academic_year_id" AS "academicYearId"
    FROM "academic_periods"
    WHERE "id" = ${idperiodo}
    FOR UPDATE
  `;
  if (!periodos[0]) throw new NotFoundException('Periodo académico no encontrado');
  if (periodos[0].isClosed) {
    throw new ConflictException('No se pueden modificar calificaciones de un periodo cerrado');
  }
  return periodos[0].academicYearId;
}

async function bloqueoyvalidarinscripcion(
  tx: Prisma.TransactionClient,
  datos: { enrollmentId: string; studentId: string; subjectId: string },
  idgestionacademica: string,
  esperadocursoid?: string,
): Promise<{ courseId: string }> {
  const inscripcion = await tx.$queryRaw<
    Array<{ courseId: string; academicYearId: string; status: string; studentId: string }>
  >`
    SELECT "course_id" AS "courseId", "academic_year_id" AS "academicYearId",
      "status", "student_id" AS "studentId"
    FROM "enrollments"
    WHERE "id" = ${datos.enrollmentId}
    FOR UPDATE
  `;
  const actual = inscripcion[0];
  if (!actual) throw new NotFoundException('Matrícula no encontrada');
  if (
    actual.studentId !== datos.studentId ||
    actual.academicYearId !== idgestionacademica ||
    actual.status !== 'ACTIVE' ||
    (esperadocursoid !== undefined && actual.courseId !== esperadocursoid)
  ) {
    throw new BadRequestException(
      'La calificación no corresponde a una matrícula activa del curso y período indicados',
    );
  }
  const estudianteactivo = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT "id"
    FROM "students"
    WHERE "id" = ${datos.studentId}
      AND "is_active" = TRUE
      AND "deleted_at" IS NULL
    FOR UPDATE
  `;
  if (estudianteactivo.length === 0) {
    throw new ConflictException('No se pueden registrar calificaciones a un estudiante eliminado.');
  }
  return { courseId: actual.courseId };
}

async function bloqueodocenteasignacion(
  tx: Prisma.TransactionClient,
  idusuariodocente: string,
  cursoid: string,
  materiaid: string,
  idgestionacademica: string,
): Promise<void> {
  const asignaciones = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT ts."id"
    FROM "teacher_subjects" AS ts
    INNER JOIN "teachers" AS t ON t."id" = ts."teacher_id"
    WHERE t."user_id" = ${idusuariodocente}
      AND t."deleted_at" IS NULL
      AND ts."course_id" = ${cursoid}
      AND ts."subject_id" = ${materiaid}
      AND ts."academic_year_id" = ${idgestionacademica}
    FOR UPDATE OF ts, t
  `;
  if (asignaciones.length === 0) {
    throw new ForbiddenException(
      'El docente no tiene asignación académica para esta materia y curso',
    );
  }
}

async function revalidatecalificacionescribir(
  tx: Prisma.TransactionClient,
  datos: { enrollmentId: string; studentId: string; subjectId: string },
  idgestionacademica: string,
  permiso: contextopermisoescrituracalificacion,
  esperadocursoid?: string,
): Promise<void> {
  const inscripcion = await bloqueoyvalidarinscripcion(
    tx,
    datos,
    idgestionacademica,
    esperadocursoid,
  );
  if (permiso.teacherUserId) {
    await bloqueodocenteasignacion(
      tx,
      permiso.teacherUserId,
      inscripcion.courseId,
      datos.subjectId,
      idgestionacademica,
    );
  }
}

@Injectable()
export class prismagraderepository implements repositoriocalificaciones {
  constructor(private readonly prisma: servicioprisma) {}

  async buscartodos(consulta: {
    search?: string;
    studentId?: string;
    subjectId?: string;
    enrollmentId?: string;
    courseId?: string;
    periodId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    const asignacionesdocente = consulta.teacherUserId
      ? await this.prisma.teacherSubject.findMany({
          where: { teacher: { userId: consulta.teacherUserId, deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
          select: { courseId: true, subjectId: true, academicYearId: true },
        })
      : undefined;

    if (asignacionesdocente && (consulta.courseId || consulta.subjectId) &&
        !asignacionesdocente.some((asignacion) =>
          (!consulta.courseId || asignacion.courseId === consulta.courseId) &&
          (!consulta.subjectId || asignacion.subjectId === consulta.subjectId))) {
      throw new ForbiddenException('El docente no tiene asignación para el curso o la materia solicitada');
    }
    if (asignacionesdocente && asignacionesdocente.length === 0) {
      return { items: [], total: 0 };
    }

    const where: Prisma.GradeWhereInput = {
      ...(consulta.search
        ? { student: { OR: [
            { firstName: { contains: consulta.search, mode: 'insensitive' } },
            { lastName: { contains: consulta.search, mode: 'insensitive' } },
            { rude: { contains: consulta.search, mode: 'insensitive' } },
          ] } }
        : {}),
      ...(consulta.studentId ? { studentId: consulta.studentId } : {}),
      ...(consulta.subjectId ? { subjectId: consulta.subjectId } : {}),
      ...(consulta.enrollmentId ? { enrollmentId: consulta.enrollmentId } : {}),
      ...(consulta.courseId ? { enrollment: { courseId: consulta.courseId } } : {}),
      ...(consulta.periodId ? { periodId: consulta.periodId } : {}),
      ...(consulta.parentUserId
        ? {
            publishedAt: { not: null },
            student: {
              OR: [
                { studentParents: { some: { parent: { userId: consulta.parentUserId } } } },
                { userId: consulta.parentUserId },
              ],
            },
          }
        : {}),
      ...(asignacionesdocente
        ? {
            OR: asignacionesdocente.map((asignacion) => ({
              subjectId: asignacion.subjectId,
              enrollment: { courseId: asignacion.courseId },
              period: { academicYearId: asignacion.academicYearId },
            })),
          }
        : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.grade.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: [
          { period: { academicYear: { year: 'asc' } } },
          { period: { number: 'asc' } },
          { subject: { name: 'asc' } },
          { id: 'asc' },
        ],
        include: { student: true, subject: true, period: true },
      }),
      this.prisma.grade.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async buscarporidentificador(id: string) {
    const elemento = await this.prisma.grade.findUnique({
      where: { id },
      include: { student: true, subject: true, period: true },
    });
    return elemento ? this.mapa(elemento) : null;
  }

  async obtenercontextoescritura(
    consulta: consultacontextoescrituracalificacion,
  ): Promise<contextoescrituracalificacion> {
    const [periodo, materia, enrollments, docente] = await Promise.all([
      this.prisma.academicPeriod.findUnique({ where: { id: consulta.periodId } }),
      this.prisma.subject.findUnique({ where: { id: consulta.subjectId }, select: { id: true } }),
      this.prisma.enrollment.findMany({ where: { id: { in: consulta.enrollmentIds } } }),
      consulta.teacherUserId
        ? this.prisma.teacher.findUnique({ where: { userId: consulta.teacherUserId } })
        : Promise.resolve(null),
    ]);

    const objetivocursoid = consulta.courseId ?? enrollments[0]?.courseId;
    const tarea =
      docente && periodo && objetivocursoid
        ? await this.prisma.teacherSubject.findFirst({
            where: {
              teacherId: docente.id,
              subjectId: consulta.subjectId,
              courseId: objetivocursoid,
              academicYearId: periodo.academicYearId,
            },
            select: { id: true },
          })
        : null;

    return {
      period: periodo
        ? { academicYearId: periodo.academicYearId, isClosed: periodo.isClosed }
        : null,
      subjectExists: Boolean(materia),
      enrollments,
      teacherProfileExists: Boolean(docente),
      hasAssignment: Boolean(tarea),
    };
  }

  async buscaranterioresporlote(
    idsestudiantes: string[],
    idmateria: string,
    idperiodo: string,
  ): Promise<instantaneaauditoriacalificacion[]> {
    if (idsestudiantes.length === 0) return [];
    return this.prisma.grade.findMany({
      where: {
        studentId: { in: idsestudiantes },
        subjectId: idmateria,
        periodId: idperiodo,
      },
      select: { id: true, enrollmentId: true, studentId: true, value: true, remarks: true },
    });
  }

  async crear(
    datos: datoscreacioncalificacion,
    auditoria: contextoauditoriacalificacion,
    permiso: contextopermisoescrituracalificacion,
  ) {
    try {
      const elemento = await this.prisma.$transaction(async (tx) => {
        const idgestionacademica = await bloqueoopenperiodo(tx, datos.periodId);
        await revalidatecalificacionescribir(tx, datos, idgestionacademica, permiso);
        const creado = await tx.grade.create({
          data: datos,
          include: { student: true, subject: true, period: true },
        });
        await tx.alertEvaluationOutbox.create({ data: { studentId: creado.studentId } });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'Grade',
            entityId: creado.id,
            studentIds: [creado.studentId],
            newValue: {
              enrollmentId: creado.enrollmentId,
              studentId: creado.studentId,
              subjectId: creado.subjectId,
              periodId: creado.periodId,
              value: creado.value,
              remarks: creado.remarks,
            },
            reason: auditoria.reason,
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return creado;
      });
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una calificación para este estudiante, materia y período',
        );
      }
      throw error;
    }
  }

  async actualizar(
    id: string,
    datos: datosactualizacioncalificacion,
    auditoria: contextoauditoriacalificacion,
    permiso: contextopermisoescrituracalificacion,
  ) {
    try {
      const elemento = await this.prisma.$transaction(async (tx) => {
        const candidata = await tx.grade.findUnique({ where: { id } });
        if (!candidata) throw new NotFoundException('Calificación no encontrada');
        const idgestionacademica = await bloqueoopenperiodo(tx, candidata.periodId);
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "grades" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Calificación no encontrada');
        const anterior = await tx.grade.findUnique({ where: { id } });
        if (!anterior) throw new NotFoundException('Calificación no encontrada');
        if (anterior.periodId !== candidata.periodId) {
          throw new ConflictException(
            'La calificación cambió de período durante la operación; vuelve a intentarlo.',
          );
        }
        await revalidatecalificacionescribir(
          tx,
          {
            enrollmentId: anterior.enrollmentId,
            studentId: anterior.studentId,
            subjectId: anterior.subjectId,
          },
          idgestionacademica,
          permiso,
        );
        const actualizado = await tx.grade.update({
          where: { id },
          data: { ...datos, publishedAt: null, publishedById: null },
          include: { student: true, subject: true, period: true },
        });
        await tx.alertEvaluationOutbox.create({ data: { studentId: actualizado.studentId } });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Grade',
            entityId: id,
            studentIds: [anterior.studentId],
            previousValue: {
              value: anterior.value,
              remarks: anterior.remarks,
            },
            newValue: {
              value: actualizado.value,
              remarks: actualizado.remarks,
            },
            reason: auditoria.reason,
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return actualizado;
      });
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Calificación no encontrada');
      }
      throw error;
    }
  }

  async insertaroactualizarporlote(
    calificaciones: datoscreacioncalificacion[],
    auditoria: contextoauditoriacargamasivacalificaciones,
    permiso: contextopermisoescrituracalificacion,
  ) {
    if (calificaciones.length === 0) return [];
    const resultados = await this.prisma.$transaction(async (tx) => {
      const idgestionacademica = await bloqueoopenperiodo(tx, auditoria.periodId);
      for (const calificacion of calificaciones) {
        if (
          calificacion.periodId !== auditoria.periodId ||
          calificacion.subjectId !== auditoria.subjectId
        ) {
          throw new BadRequestException('La carga mezcla materias o períodos académicos');
        }
        await revalidatecalificacionescribir(
          tx,
          calificacion,
          idgestionacademica,
          permiso,
          auditoria.courseId,
        );
      }
      const anteriorcalificaciones = await tx.grade.findMany({
        where: {
          studentId: { in: auditoria.studentIds },
          subjectId: auditoria.subjectId,
          periodId: auditoria.periodId,
        },
        select: { id: true, enrollmentId: true, studentId: true, value: true, remarks: true },
      });
      const actualizadocalificaciones: calificacionconrelations[] = [];
      for (const g of calificaciones) {
        actualizadocalificaciones.push(
          await tx.grade.upsert({
            where: {
              studentId_subjectId_periodId: {
                studentId: g.studentId,
                subjectId: g.subjectId,
                periodId: g.periodId,
              },
            },
            create: {
              enrollmentId: g.enrollmentId,
              studentId: g.studentId,
              subjectId: g.subjectId,
              periodId: g.periodId,
              value: g.value,
              remarks: g.remarks,
            },
            update: {
              value: g.value,
              remarks: g.remarks,
              publishedAt: null,
              publishedById: null,
            },
            include: { student: true, subject: true, period: true },
          }),
        );
      }
      await tx.alertEvaluationOutbox.createMany({
        data: [
          ...new Set(actualizadocalificaciones.map(({ studentId: idestudiante }) => idestudiante)),
        ].map((idestudiante) => ({
          studentId: idestudiante,
        })),
      });
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: PrismaAuditAction.UPDATE,
          entity: 'GradeBulk',
          entityId: `${auditoria.courseId}_${auditoria.subjectId}_${auditoria.periodId}`,
          studentIds: auditoria.studentIds,
          previousValue: { grades: anteriorcalificaciones } as Prisma.InputJsonValue,
          newValue: {
            courseId: auditoria.courseId,
            subjectId: auditoria.subjectId,
            periodId: auditoria.periodId,
            grades: actualizadocalificaciones.map(
              ({
                id,
                enrollmentId: inscripcionid,
                studentId: idestudiante,
                value: valor,
                remarks: observaciones,
              }) => ({
                id,
                enrollmentId: inscripcionid,
                studentId: idestudiante,
                value: valor,
                remarks: observaciones,
              }),
            ),
          } as Prisma.InputJsonValue,
          reason: auditoria.reason,
          ipAddress: auditoria.ipAddress,
          correlationId: auditoria.correlationId,
        },
      });
      return actualizadocalificaciones;
    });
    return resultados.map((elemento) => this.mapa(elemento));
  }

  async publicarporlote(
    alcance: datosalcancepublicacioncalificaciones,
    auditoria: contextoauditoriacalificacion,
    permiso: contextopermisoescrituracalificacion,
  ): Promise<resultadopublicacioncalificaciones> {
    return this.prisma.$transaction(async (tx) => {
      const periodos = await tx.$queryRaw<Array<{ academicYearId: string }>>`
        SELECT "academic_year_id" AS "academicYearId"
        FROM "academic_periods"
        WHERE "id" = ${alcance.periodId}
        FOR UPDATE
      `;
      const periodo = periodos[0];
      if (!periodo) throw new NotFoundException('Periodo académico no encontrado');

      if (permiso.teacherUserId) {
        await bloqueodocenteasignacion(
          tx,
          permiso.teacherUserId,
          alcance.courseId,
          alcance.subjectId,
          periodo.academicYearId,
        );
      }

      const calificaciones = await tx.grade.findMany({
        where: {
          subjectId: alcance.subjectId,
          periodId: alcance.periodId,
          enrollment: {
            courseId: alcance.courseId,
            academicYearId: periodo.academicYearId,
            status: 'ACTIVE',
          },
        },
        select: { id: true, studentId: true },
      });
      if (calificaciones.length === 0) {
        throw new NotFoundException(
          'No hay calificaciones para publicar en el curso, materia y período indicados',
        );
      }

      const publishedAt = new Date();
      await tx.grade.updateMany({
        where: { id: { in: calificaciones.map((calificacion) => calificacion.id) } },
        data: { publishedAt, publishedById: auditoria.userId },
      });
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: PrismaAuditAction.UPDATE,
          entity: 'GradePublication',
          entityId: `${alcance.courseId}_${alcance.subjectId}_${alcance.periodId}`,
          studentIds: [...new Set(calificaciones.map((calificacion) => calificacion.studentId))],
          previousValue: {
            gradeIds: calificaciones.map((calificacion) => calificacion.id),
            published: false,
          },
          newValue: {
            gradeIds: calificaciones.map((calificacion) => calificacion.id),
            published: true,
            publishedAt: publishedAt.toISOString(),
          },
          reason: auditoria.reason,
          ipAddress: auditoria.ipAddress,
          correlationId: auditoria.correlationId,
        },
      });
      return { publishedCount: calificaciones.length, publishedAt };
    });
  }

  private mapa(
    elemento: Awaited<ReturnType<servicioprisma['grade']['findUnique']>> & {
      student?: unknown;
      subject?: unknown;
      period?: unknown;
    },
  ): grade {
    const valor = elemento as NonNullable<
      Awaited<ReturnType<servicioprisma['grade']['findUnique']>>
    > & {
      student: { id: string; rude: string; firstName: string; lastName: string };
      subject: { id: string; code: string; name: string; area?: string | null };
      period: { id: string; name: string; number: number };
    };
    return {
      id: valor.id,
      enrollmentId: valor.enrollmentId,
      studentId: valor.studentId,
      subjectId: valor.subjectId,
      periodId: valor.periodId,
      value: valor.value,
      remarks: valor.remarks,
      publishedAt: valor.publishedAt ?? null,
      publishedById: valor.publishedById ?? null,
      updatedAt: valor.updatedAt,
      student: valor.student,
      subject: valor.subject,
      period: valor.period,
    };
  }
}
