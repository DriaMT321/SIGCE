import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import { entidadcurso } from '../../domain/entities/curso.entity';
import {
  datoscreacioncurso,
  repositoriocursos,
  datosactualizacioncurso,
} from '../../domain/repositories/curso.repository.interface';

@Injectable()
export class repositoriocursoprisma implements repositoriocursos {
  constructor(private readonly prisma: servicioprisma) {}

  async buscartodos(consulta: {
    academicYearId?: string;
    teacherUserId?: string;
    search?: string;
    limit: number;
    offset: number;
  }) {
    const where = {
      ...(consulta.teacherUserId ? {
        academicYear: { isActive: true },
        teacherSubjects: { some: { teacher: { userId: consulta.teacherUserId, deletedAt: null }, academicYear: { isActive: true } } },
      } : {}),
      ...(consulta.academicYearId ? { academicYearId: consulta.academicYearId } : {}),
      ...(consulta.search
        ? { name: { contains: consulta.search, mode: 'insensitive' as const } }
        : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: [{ gradeLevel: 'asc' }, { section: 'asc' }],
        include: { academicYear: true, _count: { select: { enrollments: true } } },
      }),
      this.prisma.course.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async docentetieneasignacion(userId: string, courseId: string): Promise<boolean> {
    const asignacion = await this.prisma.teacherSubject.findFirst({
      where: { courseId, teacher: { userId, deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
      select: { id: true },
    });
    return Boolean(asignacion);
  }

  async buscarporidentificador(id: string) {
    const elemento = await this.prisma.course.findUnique({
      where: { id },
      include: { academicYear: true, _count: { select: { enrollments: true } } },
    });
    return elemento ? this.mapa(elemento) : null;
  }

  async crear(datos: datoscreacioncurso, auditoria: auditoriacontexto) {
    return this.prisma.$transaction(async (tx) => {
      const elemento = await tx.course.create({
        data: { ...datos, shift: datos.shift as 'MORNING' | 'AFTERNOON' | 'EVENING' },
        include: { academicYear: true, _count: { select: { enrollments: true } } },
      });
      const curso = this.mapa(elemento);
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: 'CREATE',
          entity: 'Course',
          entityId: curso.id,
          newValue: curso as unknown as Prisma.InputJsonValue,
          ipAddress: auditoria.ipAddress,
        },
      });
      return curso;
    });
  }

  async actualizar(id: string, datos: datosactualizacioncurso, auditoria: auditoriacontexto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "courses" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Curso no encontrado');
        const anteriorcrudo = await tx.course.findUnique({
          where: { id },
          include: { academicYear: true, _count: { select: { enrollments: true } } },
        });
        if (!anteriorcrudo) throw new NotFoundException('Curso no encontrado');
        if (datos.maxCapacity !== undefined) {
          const inscripcionesactivas = await tx.enrollment.count({
            where: { courseId: id, status: 'ACTIVE' },
          });
          if (datos.maxCapacity < inscripcionesactivas) {
            throw new ConflictException(
              'La capacidad no puede ser menor que las matrículas activas del curso',
            );
          }
        }
        const anterior = this.mapa(anteriorcrudo);
        const { shift: turno, ...campos } = datos;
        const actualizadocrudo = await tx.course.update({
          where: { id },
          data: {
            ...campos,
            ...(turno ? { shift: turno as 'MORNING' | 'AFTERNOON' | 'EVENING' } : {}),
          },
          include: { academicYear: true, _count: { select: { enrollments: true } } },
        });
        const actualizado = this.mapa(actualizadocrudo);
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: 'UPDATE',
            entity: 'Course',
            entityId: id,
            previousValue: anterior as unknown as Prisma.InputJsonValue,
            newValue: actualizado as unknown as Prisma.InputJsonValue,
            ipAddress: auditoria.ipAddress,
          },
        });
        return actualizado;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Curso no encontrado');
      }
      throw error;
    }
  }

  async eliminar(id: string, auditoria: auditoriacontexto) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "courses" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Curso no encontrado');
        const anteriorcrudo = await tx.course.findUnique({
          where: { id },
          include: {
            academicYear: true,
            _count: {
              select: {
                enrollments: true,
                teacherSubjects: true,
                attendances: true,
                schedules: true,
                curriculumTopics: true,
                assignments: true,
                announcements: true,
                sieDiscrepancyGroups: true,
              },
            },
          },
        });
        if (!anteriorcrudo) throw new NotFoundException('Curso no encontrado');
        if (Object.values(anteriorcrudo._count).some((cantidad) => cantidad > 0)) {
          throw new ConflictException(
            'No se puede eliminar un curso que ya tiene matrículas, calificaciones u otros registros académicos.',
          );
        }
        const anterior = this.mapa(anteriorcrudo);
        await tx.course.delete({ where: { id } });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: 'DELETE',
            entity: 'Course',
            entityId: id,
            previousValue: anterior as unknown as Prisma.InputJsonValue,
            ipAddress: auditoria.ipAddress,
          },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Curso no encontrado');
      }
      throw error;
    }
  }

  private mapa(
    elemento: Awaited<ReturnType<servicioprisma['course']['findUnique']>> & {
      _count?: { enrollments: number };
    },
  ): entidadcurso {
    const valor = elemento as NonNullable<
      Awaited<ReturnType<servicioprisma['course']['findUnique']>>
    > & {
      academicYear: { id: string; year: number; name: string };
      _count?: { enrollments: number };
    };
    return {
      id: valor.id,
      academicYearId: valor.academicYearId,
      name: valor.name,
      gradeLevel: valor.gradeLevel,
      section: valor.section,
      shift: valor.shift,
      maxCapacity: valor.maxCapacity,
      academicYear: valor.academicYear,
      enrollmentCount: valor._count?.enrollments ?? 0,
    };
  }
}
