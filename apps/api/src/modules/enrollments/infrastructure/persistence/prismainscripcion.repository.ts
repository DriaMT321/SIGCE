import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import { entidadinscripcion } from '../../domain/entities/inscripcion.entity';
import {
  datoscreacioninscripcion,
  repositorioinscripciones,
} from '../../domain/repositories/inscripcion.repository.interface';
import { politicainscripcion } from '../../domain/services/inscripcionpolitica';

@Injectable()
export class repositorioinscripcionprisma implements repositorioinscripciones {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscartodos(consulta: {
    academicYearId?: string;
    courseId?: string;
    studentId?: string;
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

    if (cursosasignados && consulta.courseId && !cursosasignados.some(({ courseId }) => courseId === consulta.courseId)) {
      throw new ForbiddenException('El docente no tiene asignación académica para este curso');
    }
    if (cursosasignados && cursosasignados.length === 0) return { items: [], total: 0 };

    const where = {
      ...(consulta.academicYearId ? { academicYearId: consulta.academicYearId } : {}),
      ...(consulta.courseId ? { courseId: consulta.courseId } : cursosasignados ? { courseId: { in: cursosasignados.map(({ courseId }) => courseId) } } : {}),
      ...(consulta.studentId ? { studentId: consulta.studentId } : {}),
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
      this.prisma.enrollment.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: { createdAt: 'desc' },
        include: { student: true, course: true, academicYear: true },
      }),
      this.prisma.enrollment.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async buscarporidentificador(id: string) {
    const elemento = await this.prisma.enrollment.findUnique({
      where: { id },
      include: { student: true, course: true, academicYear: true },
    });
    return elemento ? this.mapa(elemento) : null;
  }

  async crear(datos: datoscreacioninscripcion, auditoria: auditoriacontexto) {
    try {
      const elemento = await this.prisma.$transaction(
        async (tx) => {
          const cursosbloqueados = await tx.$queryRaw<Array<{ id: string }>>`
            SELECT "id" FROM "courses" WHERE "id" = ${datos.courseId} FOR UPDATE
          `;
          if (cursosbloqueados.length === 0) {
            throw new NotFoundException('Curso no encontrado');
          }
          const [estudiante, curso, gestion, existente] = await Promise.all([
            tx.student.findUnique({ where: { id: datos.studentId } }),
            tx.course.findUnique({ where: { id: datos.courseId } }),
            tx.academicYear.findUnique({ where: { id: datos.academicYearId } }),
            tx.enrollment.findUnique({
              where: {
                studentId_academicYearId: {
                  studentId: datos.studentId,
                  academicYearId: datos.academicYearId,
                },
              },
            }),
          ]);

          if (!estudiante || estudiante.deletedAt || !estudiante.isActive) {
            throw new NotFoundException('Estudiante activo no encontrado');
          }
          if (!curso || !gestion) {
            throw new NotFoundException('Curso o gestión académica no encontrados');
          }
          const ocupado = await tx.enrollment.count({
            where: { courseId: curso.id, status: 'ACTIVE' },
          });
          politicainscripcion.afirmarpuedeinicio({
            studentActive: Boolean(estudiante && !estudiante.deletedAt && estudiante.isActive),
            courseAcademicYearId: curso.academicYearId,
            selectedAcademicYearId: gestion.id,
            academicYearOpen: !gestion.isClosed,
            alreadyEnrolled: Boolean(existente),
            activeEnrollmentCount: ocupado,
            courseCapacity: curso.maxCapacity,
          });

          const creada = await tx.enrollment.create({
            data: datos,
            include: { student: true, course: true, academicYear: true },
          });
          await tx.auditLog.create({
            data: {
              userId: auditoria.userId,
              action: AuditAction.CREATE,
              entity: 'Enrollment',
              entityId: creada.id,
              studentIds: [creada.studentId],
              newValue: {
                id: creada.id,
                studentId: creada.studentId,
                courseId: creada.courseId,
                academicYearId: creada.academicYearId,
                status: creada.status,
              },
              ipAddress: auditoria.ipAddress,
              correlationId: this.contextocorrelacion.obteneractual(),
            },
          });
          return creada;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El estudiante ya tiene una matrícula en esta gestión');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new ConflictException(
          'La matrícula compitió con otra operación; vuelve a intentarlo.',
        );
      }
      throw error;
    }
  }

  async actualizarestado(
    id: string,
    estado: string,
    observaciones: string | undefined,
    auditoria: auditoriacontexto,
  ) {
    try {
      const elemento = await this.prisma.$transaction(
        async (tx) => {
          const reservada = await tx.enrollment.findUnique({
            where: { id },
            select: { courseId: true },
          });
          if (!reservada) throw new NotFoundException('Matrícula no encontrada');
          const cursosbloqueados = await tx.$queryRaw<Array<{ id: string }>>`
            SELECT "id" FROM "courses" WHERE "id" = ${reservada.courseId} FOR UPDATE
          `;
          if (cursosbloqueados.length === 0) {
            throw new NotFoundException('Curso no encontrado');
          }
          const actual = await tx.enrollment.findUnique({
            where: { id },
            include: { course: true, academicYear: true },
          });
          if (!actual) throw new NotFoundException('Matrícula no encontrada');

          if (estado === 'ACTIVE' && actual.status !== 'ACTIVE') {
            const ocupado = await tx.enrollment.count({
              where: { courseId: actual.courseId, status: 'ACTIVE' },
            });
            politicainscripcion.afirmarpuedereactivar({
              academicYearOpen: !actual.academicYear.isClosed,
              activeEnrollmentCount: ocupado,
              courseCapacity: actual.course.maxCapacity,
            });
          }

          const actualizada = await tx.enrollment.update({
            where: { id },
            data: {
              status: estado as 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED' | 'WITHDRAWN',
              ...(observaciones !== undefined ? { remarks: observaciones } : {}),
            },
            include: { student: true, course: true, academicYear: true },
          });
          await tx.auditLog.create({
            data: {
              userId: auditoria.userId,
              action: AuditAction.UPDATE,
              entity: 'Enrollment',
              entityId: id,
              studentIds: [actualizada.studentId],
              previousValue: { status: actual.status, remarks: actual.remarks },
              newValue: { status: actualizada.status, remarks: actualizada.remarks },
              ipAddress: auditoria.ipAddress,
              correlationId: this.contextocorrelacion.obteneractual(),
            },
          });
          return actualizada;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return this.mapa(elemento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Matrícula no encontrada');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new ConflictException(
          'La matrícula compitió con otra operación; vuelve a intentarlo.',
        );
      }
      throw error;
    }
  }

  async actualizarestadomasivo(
    ids: string[],
    estado: string,
    auditoria: auditoriacontexto,
  ): Promise<{ updatedCount: number; unchangedCount: number }> {
    const identificadores = [...new Set(ids)];
    if (identificadores.length !== ids.length) {
      throw new ConflictException('La selección contiene matrículas repetidas.');
    }

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const actuales = await tx.enrollment.findMany({
            where: { id: { in: identificadores } },
            include: { course: true, academicYear: true },
          });
          if (actuales.length !== identificadores.length) {
            throw new NotFoundException('Una o más matrículas seleccionadas ya no existen.');
          }

          const cursoids = [...new Set(actuales.map((registro) => registro.courseId))].sort();
          const cursosbloqueados = await tx.$queryRaw<Array<{ id: string }>>`
            SELECT "id" FROM "courses"
            WHERE "id" IN (${Prisma.join(cursoids)})
            ORDER BY "id"
            FOR UPDATE
          `;
          if (cursosbloqueados.length !== cursoids.length) {
            throw new NotFoundException('Uno o más cursos seleccionados ya no existen.');
          }

          if (estado === 'ACTIVE') {
            const conteos = await tx.enrollment.groupBy({
              by: ['courseId'],
              where: { courseId: { in: cursoids }, status: 'ACTIVE' },
              _count: { _all: true },
            });
            const activosporcurso = new Map(
              conteos.map(({ courseId, _count }) => [courseId, _count._all]),
            );

            for (const courseId of cursoids) {
              const seleccioncurso = actuales.filter((registro) => registro.courseId === courseId);
              const activandose = seleccioncurso.filter((registro) => registro.status !== 'ACTIVE');
              if (activandose.length === 0) continue;

              const desactivandose = seleccioncurso.filter((registro) => registro.status === 'ACTIVE');
              const totalactivoestimado =
                (activosporcurso.get(courseId) ?? 0) -
                desactivandose.length +
                activandose.length;
              const curso = seleccioncurso[0];
              politicainscripcion.afirmarpuedereactivar({
                academicYearOpen: !curso.academicYear.isClosed,
                activeEnrollmentCount: totalactivoestimado - 1,
                courseCapacity: curso.course.maxCapacity,
              });
            }
          }

          const cambios = actuales.filter((registro) => registro.status !== estado);
          if (cambios.length > 0) {
            await tx.enrollment.updateMany({
              where: { id: { in: cambios.map((registro) => registro.id) } },
              data: {
                status: estado as 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED' | 'WITHDRAWN',
              },
            });

            await tx.auditLog.createMany({
              data: cambios.map((registro) => ({
                userId: auditoria.userId,
                action: AuditAction.UPDATE,
                entity: 'Enrollment',
                entityId: registro.id,
                studentIds: [registro.studentId],
                previousValue: { status: registro.status, remarks: registro.remarks },
                newValue: { status: estado, remarks: registro.remarks },
                ipAddress: auditoria.ipAddress,
                correlationId: this.contextocorrelacion.obteneractual(),
              })),
            });
          }

          return {
            updatedCount: cambios.length,
            unchangedCount: actuales.length - cambios.length,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new ConflictException(
          'La actualización compitió con otra operación; vuelve a intentarlo.',
        );
      }
      throw error;
    }
  }

  private mapa(
    elemento: Awaited<ReturnType<servicioprisma['enrollment']['findUnique']>> & {
      student?: unknown;
      course?: unknown;
      academicYear?: unknown;
    },
  ): entidadinscripcion {
    const valor = elemento as NonNullable<
      Awaited<ReturnType<servicioprisma['enrollment']['findUnique']>>
    > & {
      student: { id: string; rude: string; firstName: string; lastName: string };
      course: { id: string; name: string; gradeLevel: number; section: string };
      academicYear: { id: string; year: number; name: string };
    };
    return {
      id: valor.id,
      studentId: valor.studentId,
      courseId: valor.courseId,
      academicYearId: valor.academicYearId,
      enrollmentDate: valor.enrollmentDate,
      status: valor.status,
      remarks: valor.remarks,
      student: valor.student,
      course: valor.course,
      academicYear: valor.academicYear,
    };
  }
}
