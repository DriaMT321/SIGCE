import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import type { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import {
  datosactualizacionmateria,
  datoscreacionmateria,
  registromateria,
  repositoriomaterias,
} from '../../domain/repositories/asignatura.repository.interface';

@Injectable()
export class repositoriomateriaprisma implements repositoriomaterias {
  constructor(private readonly prisma: servicioprisma) {}

  buscartodos(busqueda?: string, teacherUserId?: string, courseId?: string): Promise<registromateria[]> {
    const term = busqueda?.trim();
    return this.prisma.subject.findMany({
      where: {
        ...(term ? { OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
          { area: { contains: term, mode: 'insensitive' } },
        ] } : {}),
        ...(teacherUserId ? { teacherSubjects: { some: {
          teacher: { userId: teacherUserId, deletedAt: null },
          academicYear: { isActive: true },
          course: { academicYear: { isActive: true } },
          ...(courseId ? { courseId } : {}),
        } } } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async docentetieneasignacion(userId: string, courseId: string): Promise<boolean> {
    const asignacion = await this.prisma.teacherSubject.findFirst({
      where: { courseId, teacher: { userId, deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
      select: { id: true },
    });
    return Boolean(asignacion);
  }

  buscarporidentificador(id: string): Promise<registromateria | null> {
    return this.prisma.subject.findUnique({ where: { id } });
  }

  async crear(
    datos: datoscreacionmateria,
    auditoria: auditoriacontexto,
  ): Promise<registromateria> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const creada = await tx.subject.create({
          data: {
            name: datos.name,
            code: datos.code,
            description: datos.description,
            area: datos.area,
          },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'Subject',
            entityId: creada.id,
            newValue: this.instantanea(creada),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return creada;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una materia con ese nombre o código');
      }
      throw error;
    }
  }

  async actualizar(
    id: string,
    datos: datosactualizacionmateria,
    auditoria: auditoriacontexto,
  ): Promise<registromateria | null> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "subjects" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) return null;

        const anterior = await tx.subject.findUniqueOrThrow({ where: { id } });
        const actualizada = await tx.subject.update({
          where: { id },
          data: {
            ...(datos.name !== undefined ? { name: datos.name } : {}),
            ...(datos.code !== undefined ? { code: datos.code } : {}),
            ...(datos.description !== undefined ? { description: datos.description } : {}),
            ...(datos.area !== undefined ? { area: datos.area } : {}),
          },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Subject',
            entityId: id,
            previousValue: this.instantanea(anterior),
            newValue: this.instantanea(actualizada),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return actualizada;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una materia con ese nombre o código');
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async eliminar(id: string, auditoria: auditoriacontexto): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "subjects" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Materia no encontrada');

        const anterior = await tx.subject.findUniqueOrThrow({
          where: { id },
          include: {
            _count: {
              select: {
                teacherSubjects: true,
                grades: true,
                syncItems: true,
                sieDiscrepancyGroups: true,
                schedules: true,
                curriculumTopics: true,
                assignments: true,
              },
            },
          },
        });
        if (Object.values(anterior._count).some((cantidad) => cantidad > 0)) {
          throw new ConflictException(
            'No se puede eliminar una materia con asignaciones, calificaciones u otros registros académicos.',
          );
        }
        await tx.subject.delete({ where: { id } });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.DELETE,
            entity: 'Subject',
            entityId: id,
            previousValue: this.instantanea(anterior),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Materia no encontrada');
      }
      throw error;
    }
  }

  private instantanea(materia: registromateria): Prisma.InputJsonValue {
    return {
      name: materia.name,
      code: materia.code,
      description: materia.description,
      area: materia.area,
    };
  }
}
