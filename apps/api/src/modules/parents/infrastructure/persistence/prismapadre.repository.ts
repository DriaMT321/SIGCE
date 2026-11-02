import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction as PrismaAuditAction, Prisma, RelationshipType, UserRole } from '@prisma/client';
import { tiporelacion } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import { entidadfamiliar } from '../../domain/entities/padre.entity';
import {
  datoscreacionfamiliar,
  repositoriofamiliares,
  datosactualizacionfamiliar,
} from '../../domain/repositories/padre.repository.interface';

type familiarconrelations = Prisma.ParentGetPayload<{
  include: { user: true; studentParents: { include: { student: true } } };
}>;

@Injectable()
export class repositoriofamiliarprisma implements repositoriofamiliares {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscartodos(consulta: { search?: string; limit: number; offset: number }) {
    const where: Prisma.ParentWhereInput = {
      deletedAt: null,
      ...(consulta.search
        ? {
            OR: [
              { ci: { contains: consulta.search, mode: 'insensitive' } },
              { firstName: { contains: consulta.search, mode: 'insensitive' } },
              { lastName: { contains: consulta.search, mode: 'insensitive' } },
              { phone: { contains: consulta.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [elementos, total] = await Promise.all([
      this.prisma.parent.findMany({
        where,
        skip: consulta.offset,
        take: consulta.limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: { user: true, studentParents: { include: { student: true } } },
      }),
      this.prisma.parent.count({ where }),
    ]);
    return { items: elementos.map((elemento) => this.mapa(elemento)), total };
  }

  async buscarporidentificador(id: string) {
    const familiar = await this.prisma.parent.findFirst({
      where: { id, deletedAt: null },
      include: { user: true, studentParents: { include: { student: true } } },
    });
    return familiar ? this.mapa(familiar) : null;
  }

  async crear(datos: datoscreacionfamiliar, auditoria: auditoriacontexto) {
    try {
      const familiar = await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.user.create({
          data: {
            email: datos.email.toLowerCase(),
            passwordHash: datos.passwordHash,
            firstName: datos.firstName,
            lastName: datos.lastName,
            role: UserRole.PARENT,
          },
        });
        const familiarcreado = await tx.parent.create({
          data: {
            userId: usuario.id,
            ci: datos.ci,
            firstName: datos.firstName,
            lastName: datos.lastName,
            phone: datos.phone,
            address: datos.address,
            occupation: datos.occupation,
          },
          include: { user: true, studentParents: { include: { student: true } } },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'Parent',
            entityId: familiarcreado.id,
            newValue: {
              email: usuario.email,
              ci: familiarcreado.ci,
              name: `${familiarcreado.firstName} ${familiarcreado.lastName}`.trim(),
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return familiarcreado;
      });
      return this.mapa(familiar);
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

  async actualizar(id: string, datos: datosactualizacionfamiliar, auditoria: auditoriacontexto) {
    const { email: correo, firstName: nombres, lastName: apellidos, ...familiarcampos } = datos;
    try {
      const familiar = await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "parents"
          WHERE "id" = ${id} AND "deleted_at" IS NULL
          FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Familiar no encontrado');
        const actual = await tx.parent.findFirst({
          where: { id, deletedAt: null },
          include: { user: true },
        });
        if (!actual) throw new NotFoundException('Familiar no encontrado');
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
        const actualizado = await tx.parent.update({
          where: { id, deletedAt: null },
          data: {
            ...familiarcampos,
            ...(nombres ? { firstName: nombres } : {}),
            ...(apellidos ? { lastName: apellidos } : {}),
          },
          include: { user: true, studentParents: { include: { student: true } } },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.UPDATE,
            entity: 'Parent',
            entityId: actualizado.id,
            previousValue: {
              email: actual.user.email,
              ci: actual.ci,
              firstName: actual.firstName,
              lastName: actual.lastName,
              phone: actual.phone,
              address: actual.address,
              occupation: actual.occupation,
            },
            newValue: {
              email: actualizado.user.email,
              ci: actualizado.ci,
              firstName: actualizado.firstName,
              lastName: actualizado.lastName,
              phone: actualizado.phone,
              address: actualizado.address,
              occupation: actualizado.occupation,
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });
        return actualizado;
      });
      return this.mapa(familiar);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Familiar no encontrado');
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

  async actualizarvinculo(
    idfamiliar: string,
    idestudiante: string,
    relacion: tiporelacion,
    auditoria: auditoriacontexto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const vinculo = await tx.studentParent.findFirst({
        where: {
          studentId: idestudiante,
          parentId: idfamiliar,
          parent: { deletedAt: null },
          student: { deletedAt: null },
        },
      });
      if (!vinculo) throw new NotFoundException('No se encontró el vínculo entre el familiar y el estudiante.');
      const actualizado = await tx.studentParent.update({
        where: { studentId_parentId: { studentId: idestudiante, parentId: idfamiliar } },
        data: { relationship: relacion as RelationshipType },
      });
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: PrismaAuditAction.UPDATE,
          entity: 'StudentParent',
          entityId: actualizado.id,
          previousValue: { parentId: idfamiliar, studentId: idestudiante, relationship: vinculo.relationship },
          newValue: { parentId: idfamiliar, studentId: idestudiante, relationship: actualizado.relationship },
          ipAddress: auditoria.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });
      const familiar = await tx.parent.findFirst({
        where: { id: idfamiliar, deletedAt: null },
        include: { user: true, studentParents: { include: { student: true } } },
      });
      if (!familiar) throw new NotFoundException('Familiar no encontrado.');
      return this.mapa(familiar);
    });
  }

  async eliminarvinculo(
    idfamiliar: string,
    idestudiante: string,
    auditoria: auditoriacontexto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const vinculo = await tx.studentParent.findFirst({
        where: {
          studentId: idestudiante,
          parentId: idfamiliar,
          parent: { deletedAt: null },
          student: { deletedAt: null },
        },
      });
      if (!vinculo) throw new NotFoundException('No se encontró el vínculo entre el familiar y el estudiante.');
      await tx.studentParent.delete({
        where: { studentId_parentId: { studentId: idestudiante, parentId: idfamiliar } },
      });
      await tx.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: PrismaAuditAction.DELETE,
          entity: 'StudentParent',
          entityId: vinculo.id,
          previousValue: { parentId: idfamiliar, studentId: idestudiante, relationship: vinculo.relationship },
          newValue: { removed: true },
          ipAddress: auditoria.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });
      const familiar = await tx.parent.findFirst({
        where: { id: idfamiliar, deletedAt: null },
        include: { user: true, studentParents: { include: { student: true } } },
      });
      if (!familiar) throw new NotFoundException('Familiar no encontrado.');
      return this.mapa(familiar);
    });
  }

  async eliminarlogicamente(id: string, auditoria: auditoriacontexto) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const bloqueado = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "parents"
          WHERE "id" = ${id} AND "deleted_at" IS NULL
          FOR UPDATE
        `;
        if (bloqueado.length === 0) throw new NotFoundException('Familiar no encontrado');
        const familiar = await tx.parent.findFirst({
          where: { id, deletedAt: null },
          include: { user: true },
        });
        if (!familiar) throw new NotFoundException('Familiar no encontrado');
        const fechadeeliminacion = new Date();
        await tx.parent.update({
          where: { id, deletedAt: null },
          data: { deletedAt: fechadeeliminacion },
        });
        await tx.user.update({
          where: { id: familiar.userId },
          data: { deletedAt: fechadeeliminacion, isActive: false },
        });
        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.DELETE,
            entity: 'Parent',
            entityId: familiar.id,
            previousValue: {
              email: familiar.user.email,
              ci: familiar.ci,
              firstName: familiar.firstName,
              lastName: familiar.lastName,
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
        throw new NotFoundException('Familiar no encontrado');
      }
      throw error;
    }
  }

  private mapa(valor: familiarconrelations): entidadfamiliar {
    return {
      id: valor.id,
      userId: valor.userId,
      ci: valor.ci,
      firstName: valor.firstName,
      lastName: valor.lastName,
      phone: valor.phone,
      email: valor.email,
      address: valor.address,
      occupation: valor.occupation,
      students: valor.studentParents.map(({ student: estudiante, relationship }) => ({
        id: estudiante.id,
        rude: estudiante.rude,
        firstName: estudiante.firstName,
        lastName: estudiante.lastName,
        relationship,
      })),
      createdAt: valor.createdAt,
      updatedAt: valor.updatedAt,
    };
  }
}
