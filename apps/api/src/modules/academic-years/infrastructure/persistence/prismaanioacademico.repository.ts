import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import type { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import {
  datosactualizacionanioacademico,
  datoscreacionanioacademico,
  repositorioanioacademico,
  resumenanioacademico,
} from '../../domain/repositories/anioacademico.repository.interface';

const includeconteos = {
  _count: { select: { courses: true, enrollments: true, periods: true } },
} satisfies Prisma.AcademicYearInclude;

@Injectable()
export class repositorioanioacademicoprisma implements repositorioanioacademico {
  constructor(private readonly prisma: servicioprisma) {}

  buscartodos(): Promise<resumenanioacademico[]> {
    return this.prisma.academicYear.findMany({
      orderBy: { year: 'desc' },
      include: includeconteos,
    });
  }

  buscarporidentificador(id: string): Promise<resumenanioacademico | null> {
    return this.prisma.academicYear.findUnique({
      where: { id },
      include: includeconteos,
    });
  }

  async crear(
    datos: datoscreacionanioacademico,
    auditoria: auditoriacontexto,
  ): Promise<resumenanioacademico> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        if (datos.isActive) {
          await tx.academicYear.updateMany({
            where: { isActive: true },
            data: { isActive: false },
          });
        }
        const creado = await tx.academicYear.create({
          data: {
            year: datos.year,
            name: datos.name,
            startDate: datos.startDate,
            endDate: datos.endDate,
            isActive: datos.isActive ?? false,
          },
          include: includeconteos,
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'AcademicYear',
            entityId: creado.id,
            newValue: this.instantanea(creado),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return creado;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una gestión académica con ese año');
      }
      throw error;
    }
  }

  async actualizar(
    id: string,
    datos: datosactualizacionanioacademico,
    auditoria: auditoriacontexto,
  ): Promise<resumenanioacademico | null> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "academic_years" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) return null;

        const anterior = await tx.academicYear.findUniqueOrThrow({
          where: { id },
          include: includeconteos,
        });
        if (datos.isActive === true) {
          await tx.academicYear.updateMany({
            where: { isActive: true, id: { not: id } },
            data: { isActive: false },
          });
        }
        const actualizado = await tx.academicYear.update({
          where: { id },
          data: {
            ...(datos.year !== undefined ? { year: datos.year } : {}),
            ...(datos.name !== undefined ? { name: datos.name } : {}),
            ...(datos.startDate !== undefined ? { startDate: datos.startDate } : {}),
            ...(datos.endDate !== undefined ? { endDate: datos.endDate } : {}),
            ...(datos.isActive !== undefined ? { isActive: datos.isActive } : {}),
            ...(datos.isClosed !== undefined ? { isClosed: datos.isClosed } : {}),
          },
          include: includeconteos,
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'AcademicYear',
            entityId: id,
            previousValue: this.instantanea(anterior),
            newValue: this.instantanea(actualizado),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
        return actualizado;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Ya existe una gestión académica con ese año');
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
          SELECT "id" FROM "academic_years" WHERE "id" = ${id} FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Gestión académica no encontrada');

        const anterior = await tx.academicYear.findUniqueOrThrow({
          where: { id },
          include: includeconteos,
        });
        if (
          anterior._count.courses > 0 ||
          anterior._count.enrollments > 0 ||
          anterior._count.periods > 0
        ) {
          throw new ConflictException(
            'No se puede eliminar una gestión con períodos, cursos o matrículas asociadas.',
          );
        }
        await tx.academicYear.delete({ where: { id } });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.DELETE,
            entity: 'AcademicYear',
            entityId: id,
            previousValue: this.instantanea(anterior),
            ipAddress: auditoria.ipAddress,
            correlationId: auditoria.correlationId,
          },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Gestión académica no encontrada');
      }
      throw error;
    }
  }

  private instantanea(anio: resumenanioacademico): Prisma.InputJsonValue {
    return {
      year: anio.year,
      name: anio.name,
      startDate: anio.startDate.toISOString(),
      endDate: anio.endDate.toISOString(),
      isActive: anio.isActive,
      isClosed: anio.isClosed,
    };
  }
}
