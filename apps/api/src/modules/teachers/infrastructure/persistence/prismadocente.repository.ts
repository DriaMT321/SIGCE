import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma, UserRole } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import { entidaddocente } from '../../domain/entities/docente.entity';
import {
  datoscreaciondocente,
  repositoriodocentes,
  datosactualizaciondocente,
} from '../../domain/repositories/docente.repository.interface';

const includeasignacionesdocente = {
  user: true,
  teacherSubjects: {
    where: { academicYear: { isActive: true } },
    include: {
      subject: { select: { id: true, code: true, name: true } },
      course: { select: { id: true, name: true, gradeLevel: true, section: true } },
      academicYear: { select: { year: true } },
    },
  },
} satisfies Prisma.TeacherInclude;

type docenteconusuario = Prisma.TeacherGetPayload<{ include: { user: true } }>;
type docenteconasignaciones = Prisma.TeacherGetPayload<{
  include: typeof includeasignacionesdocente;
}>;

@Injectable()
export class repositoriodocenteprisma implements repositoriodocentes {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscartodos(consulta: { search?: string; limit: number; offset: number }) {
    const where: Prisma.TeacherWhereInput = {
      deletedAt: null,
      ...(consulta.search
        ? {
            OR: [
              { ci: { contains: consulta.search, mode: 'insensitive' } },
              { firstName: { contains: consulta.search, mode: 'insensitive' } },
              { lastName: { contains: consulta.search, mode: 'insensitive' } },
              { itemNumber: { contains: consulta.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: includeasignacionesdocente,
      }),
      this.prisma.teacher.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async buscarporidentificador(id: string) {
    const docente = await this.prisma.teacher.findFirst({
      where: { id, deletedAt: null },
      include: includeasignacionesdocente,
    });
    return docente ? this.mapa(docente) : null;
  }

  async crear(datos: datoscreaciondocente, auditoria: auditoriacontexto) {
    try {
      const docente = await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.user.create({
          data: {
            email: datos.email.toLowerCase(),
            passwordHash: datos.passwordHash,
            firstName: datos.firstName,
            lastName: datos.lastName,
            role: UserRole.TEACHER,
          },
        });
        const docentecreado = await tx.teacher.create({
          data: {
            userId: usuario.id,
            ci: datos.ci,
            firstName: datos.firstName,
            lastName: datos.lastName,
            specialty: datos.specialty,
            phone: datos.phone,
            itemNumber: datos.itemNumber,
          },
          include: { user: true },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'Teacher',
            entityId: docentecreado.id,
            newValue: {
              email: usuario.email,
              ci: docentecreado.ci,
              name: `${docentecreado.firstName} ${docentecreado.lastName}`.trim(),
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return docentecreado;
      });
      return this.mapa(docente);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new incumplimientoregladominio(
          'CONFLICT',
          'Ya existe un usuario con ese correo electrónico o documento de identidad.',
        );
      }
      throw error;
    }
  }

  async actualizar(id: string, datos: datosactualizaciondocente, auditoria: auditoriacontexto) {
    const { email: correo, firstName: nombres, lastName: apellidos, ...docentecampos } = datos;
    try {
      const docente = await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "teachers"
          WHERE "id" = ${id} AND "deleted_at" IS NULL
          FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Docente no encontrado');
        const actual = await tx.teacher.findFirst({
          where: { id, deletedAt: null },
          include: { user: true },
        });
        if (!actual) throw new NotFoundException('Docente no encontrado');
        if (correo || nombres || apellidos) {
          await tx.user.update({
            where: { id: actual.userId },
            data: {
              ...(correo ? { email: correo.toLowerCase() } : {}),
              ...(nombres ? { firstName: nombres } : {}),
              ...(apellidos ? { lastName: apellidos } : {}),
            },
          });
        }
        const actualizado = await tx.teacher.update({
          where: { id, deletedAt: null },
          data: {
            ...docentecampos,
            ...(nombres ? { firstName: nombres } : {}),
            ...(apellidos ? { lastName: apellidos } : {}),
          },
          include: { user: true },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Teacher',
            entityId: actualizado.id,
            previousValue: {
              email: actual.user.email,
              ci: actual.ci,
              firstName: actual.firstName,
              lastName: actual.lastName,
              specialty: actual.specialty,
              phone: actual.phone,
              itemNumber: actual.itemNumber,
            },
            newValue: {
              email: actualizado.user.email,
              ci: actualizado.ci,
              firstName: actualizado.firstName,
              lastName: actualizado.lastName,
              specialty: actualizado.specialty,
              phone: actualizado.phone,
              itemNumber: actualizado.itemNumber,
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return actualizado;
      });
      return this.mapa(docente);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Docente no encontrado');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new incumplimientoregladominio(
          'CONFLICT',
          'El correo electrónico o documento de identidad ya está registrado.',
        );
      }
      throw error;
    }
  }

  async eliminarlogicamente(id: string, auditoria: auditoriacontexto) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "teachers"
          WHERE "id" = ${id} AND "deleted_at" IS NULL
          FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Docente no encontrado');
        const docente = await tx.teacher.findFirst({
          where: { id, deletedAt: null },
          include: { user: true },
        });
        if (!docente) throw new NotFoundException('Docente no encontrado');
        const fechadeeliminacion = new Date();
        await tx.teacher.update({
          where: { id, deletedAt: null },
          data: { deletedAt: fechadeeliminacion },
        });
        await tx.user.update({
          where: { id: docente.userId },
          data: { deletedAt: fechadeeliminacion, isActive: false },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.DELETE,
            entity: 'Teacher',
            entityId: docente.id,
            previousValue: {
              email: docente.user.email,
              ci: docente.ci,
              firstName: docente.firstName,
              lastName: docente.lastName,
            },
            newValue: { deletedAt: fechadeeliminacion.toISOString() },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Docente no encontrado');
      }
      throw error;
    }
  }

  private mapa(
    valor: docenteconusuario & { teacherSubjects?: docenteconasignaciones['teacherSubjects'] },
  ): entidaddocente {
    return {
      id: valor.id,
      userId: valor.userId,
      ci: valor.ci,
      firstName: valor.firstName,
      lastName: valor.lastName,
      specialty: valor.specialty,
      teacherAssignments: (valor.teacherSubjects ?? []).map((asignacion) => ({
        id: asignacion.id,
        courseId: asignacion.courseId,
        subjectId: asignacion.subjectId,
        weeklyPeriods: asignacion.weeklyPeriods,
        courseName: asignacion.course.name,
        courseGradeLevel: asignacion.course.gradeLevel,
        courseSection: asignacion.course.section,
        gradeLevel: asignacion.course.gradeLevel,
        section: asignacion.course.section,
        subjectCode: asignacion.subject.code,
        subjectName: asignacion.subject.name,
        academicYear: asignacion.academicYear.year,
      })),
      phone: valor.phone,
      itemNumber: valor.itemNumber,
      email: valor.user.email,
      createdAt: valor.createdAt,
      updatedAt: valor.updatedAt,
    };
  }
}
