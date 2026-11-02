import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { entidadusuario } from '../../domain/entities/usuario.entity';
import {
  repositoriousuarios,
  datoscreacionusuario,
  datosactualizacionusuario,
} from '../../domain/repositories/usuario.repository.interface';
import { AuditAction as PrismaAuditAction, Prisma, UserRole } from '@prisma/client';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import { auditoriacontexto } from '../../../../core/domain/contextoauditoria';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';

@Injectable()
export class repositoriousuarioprisma implements repositoriousuarios {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async buscartodos(parametros?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: entidadusuario[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (parametros?.role && parametros.role !== 'ALL') {
      where.role = parametros.role as UserRole;
    }

    if (parametros?.search?.trim()) {
      const term = parametros.search.trim();
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [crudousuarios, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: parametros?.limit ?? 50,
        skip: parametros?.offset ?? 0,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const elementos = crudousuarios.map(
      (u) =>
        new entidadusuario(
          u.id,
          u.email,
          u.firstName,
          u.lastName,
          u.role as unknown as entidadusuario['rol'],
          u.isActive,
          u.createdAt,
          u.updatedAt,
          u.deletedAt,
          u.passwordSetupRequired,
        ),
    );

    return { items: elementos, total };
  }

  async buscarporidentificador(id: string): Promise<entidadusuario | null> {
    const u = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!u) return null;

    return new entidadusuario(
      u.id,
      u.email,
      u.firstName,
      u.lastName,
      u.role as unknown as entidadusuario['rol'],
      u.isActive,
      u.createdAt,
      u.updatedAt,
      u.deletedAt,
      u.passwordSetupRequired,
    );
  }

  async buscarporcorreo(correoelectronico: string): Promise<entidadusuario | null> {
    const u = await this.prisma.user.findUnique({
      where: { email: correoelectronico.toLowerCase() },
    });

    if (!u) return null;

    return new entidadusuario(
      u.id,
      u.email,
      u.firstName,
      u.lastName,
      u.role as unknown as entidadusuario['rol'],
      u.isActive,
      u.createdAt,
      u.updatedAt,
      u.deletedAt,
      u.passwordSetupRequired,
    );
  }

  async crear(datos: datoscreacionusuario, auditoria: auditoriacontexto): Promise<entidadusuario> {
    let creadousuario;
    try {
      creadousuario = await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.user.create({
          data: {
            email: datos.email.toLowerCase(),
            passwordHash: datos.passwordHash,
            firstName: datos.firstName,
            lastName: datos.lastName,
            role: datos.role as unknown as UserRole,
          },
        });

        await tx.auditLog.create({
          data: {
            userId: auditoria.userId,
            action: PrismaAuditAction.CREATE,
            entity: 'User',
            entityId: usuario.id,
            newValue: {
              email: usuario.email,
              role: usuario.role,
              name: `${usuario.firstName} ${usuario.lastName}`.trim(),
            },
            ipAddress: auditoria.ipAddress,
            correlationId: this.contextocorrelacion.obteneractual(),
          },
        });

        return usuario;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new incumplimientoregladominio(
          'CONFLICT',
          'Ya existe una cuenta con ese correo electrónico.',
        );
      }
      throw error;
    }

    return new entidadusuario(
      creadousuario.id,
      creadousuario.email,
      creadousuario.firstName,
      creadousuario.lastName,
      creadousuario.role as unknown as entidadusuario['rol'],
      creadousuario.isActive,
      creadousuario.createdAt,
      creadousuario.updatedAt,
      creadousuario.deletedAt,
      creadousuario.passwordSetupRequired,
    );
  }

  async actualizar(
    id: string,
    datos: datosactualizacionusuario,
    auditoria: auditoriacontexto,
  ): Promise<entidadusuario> {
    return this.prisma.$transaction(async (transaction) => {
      const bloqueado = await transaction.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "users" WHERE "id" = ${id} FOR UPDATE
      `;
      if (bloqueado.length === 0) throw new NotFoundException('Usuario no encontrado');
      const existente = await transaction.user.findUnique({ where: { id } });
      if (!existente) throw new NotFoundException('Usuario no encontrado');

      const invalidatessesiones =
        typeof datos.isActive === 'boolean' && datos.isActive !== existente.isActive;
      const actualizado = await transaction.user.update({
        where: { id },
        data: {
          ...(datos.firstName ? { firstName: datos.firstName } : {}),
          ...(datos.lastName ? { lastName: datos.lastName } : {}),
          ...(typeof datos.isActive === 'boolean' ? { isActive: datos.isActive } : {}),
          ...(invalidatessesiones ? { credentialVersion: { increment: 1 } } : {}),
        },
      });

      await transaction.auditLog.create({
        data: {
          userId: auditoria.userId,
          action: PrismaAuditAction.UPDATE,
          entity: 'User',
          entityId: id,
          previousValue: {
            isActive: existente.isActive,
            name: `${existente.firstName} ${existente.lastName}`.trim(),
          },
          newValue: {
            isActive: actualizado.isActive,
            name: `${actualizado.firstName} ${actualizado.lastName}`.trim(),
          },
          ipAddress: auditoria.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });

      if (invalidatessesiones) {
        await transaction.refreshToken.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }

      return new entidadusuario(
        actualizado.id,
        actualizado.email,
        actualizado.firstName,
        actualizado.lastName,
        actualizado.role as unknown as entidadusuario['rol'],
        actualizado.isActive,
        actualizado.createdAt,
        actualizado.updatedAt,
        actualizado.deletedAt,
        actualizado.passwordSetupRequired,
      );
    });
  }
}
