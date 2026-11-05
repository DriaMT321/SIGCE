import { Injectable } from '@nestjs/common';
import { UserRole as PrismaUserRole, type User } from '@prisma/client';
import { accionauditoria, rolusuario } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  repositorioautenticacion,
  usuarioautenticacion,
  nuevotokenrenovacion,
  rotaciontokenrenovacion,
  tokenrenovacionalmacenado,
} from '../../domain/repositories/autenticacion.repository.interface';

@Injectable()
export class repositorioautenticacionprisma implements repositorioautenticacion {
  constructor(private readonly prisma: servicioprisma) {}

  async buscarporcorreo(correoelectronico: string): Promise<usuarioautenticacion | null> {
    const usuario = await this.prisma.user.findUnique({
      where: { email: correoelectronico.toLowerCase() },
    });
    return usuario ? mapearusuarioautenticacionprisma(usuario) : null;
  }

  async buscarporidentificadoryrol(
    rol: string,
    identificador: string,
    identificadorsecundario?: string,
  ): Promise<usuarioautenticacion | null> {
    const identLimpio = identificador.trim();
    const identLower = identLimpio.toLowerCase();
    const cinumerica = identLimpio.split('-')[0].trim();

    let resultado: usuarioautenticacion | null = null;

    switch (rol) {
      case 'STUDENT': {
        const perfil = await this.prisma.student.findFirst({
          where: {
            deletedAt: null,
            userId: { not: null },
            user: { role: PrismaUserRole.STUDENT },
            OR: [{ rude: identLimpio }, { ci: identLimpio }, { ci: cinumerica }],
          },
          include: { user: true },
        });
        if (perfil?.user) resultado = mapearusuarioautenticacionprisma(perfil.user);
        break;
      }
      case 'TEACHER': {
        const perfil = await this.prisma.teacher.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { itemNumber: identLimpio },
              { ci: identLimpio },
              { ci: cinumerica },
              { user: { email: identLower } },
            ],
          },
          include: { user: true },
        });
        if (perfil?.user) resultado = mapearusuarioautenticacionprisma(perfil.user);
        break;
      }
      case 'FAMILY': {
        if (identificadorsecundario) {
          const perfil = await this.prisma.parent.findFirst({
            where: {
              OR: [{ ci: identLimpio }, { ci: cinumerica }],
              phone: identificadorsecundario.trim(),
              deletedAt: null,
            },
            include: { user: true },
          });
          if (perfil?.user) resultado = mapearusuarioautenticacionprisma(perfil.user);
        }
        break;
      }
      case 'ADMINISTRATIVE': {
        const usuario = await this.prisma.user.findFirst({
          where: {
            OR: [
              { email: identLower },
              { email: identLower.includes('@') ? identLower : `${identLower}@sigce.lat` },
              { id: identLimpio },
            ],
            role: { in: [PrismaUserRole.ADMINISTRATIVE, PrismaUserRole.SECRETARY] },
          },
        });
        if (usuario) resultado = mapearusuarioautenticacionprisma(usuario);
        break;
      }
    }

    if (resultado) return resultado;

    // Fallbacks de tolerancia para defensas y pruebas interactivas:
    if (identLower === 'admin' || identLower === 'administrador') {
      const u = await this.prisma.user.findFirst({
        where: { email: 'admin@sigce.lat', isActive: true, deletedAt: null },
      });
      if (u) return mapearusuarioautenticacionprisma(u);
    }

    if (identLower === 'profesor' || identLower === 'docente') {
      const u = await this.prisma.user.findFirst({
        where: { email: 'profesor@sigce.lat', isActive: true, deletedAt: null },
      });
      if (u) return mapearusuarioautenticacionprisma(u);
    }

    if (identLower.includes('@')) {
      const u = await this.prisma.user.findFirst({
        where: { email: identLower, isActive: true, deletedAt: null },
      });
      if (u) return mapearusuarioautenticacionprisma(u);
    }

    const perfilDocente = await this.prisma.teacher.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { itemNumber: identLimpio },
          { ci: identLimpio },
          { ci: cinumerica },
        ],
      },
      include: { user: true },
    });
    if (perfilDocente?.user && perfilDocente.user.isActive) {
      return mapearusuarioautenticacionprisma(perfilDocente.user);
    }

    return null;
  }

  async creartokenrenovacion(token: nuevotokenrenovacion): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.authSession.create({ data: { id: token.sessionId, userId: token.userId, expiresAt: token.expiresAt } });
      await tx.refreshToken.create({ data: token });
    });
  }

  async buscartokenrenovacion(resumentoken: string): Promise<tokenrenovacionalmacenado | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: resumentoken },
      include: { user: true, session: true },
    });
    return token ? { ...token, user: mapearusuarioautenticacionprisma(token.user) } : null;
  }

  async rotartokenrenovacion({
    previousTokenId: anteriortokenid,
    now: ahora,
    replacement,
  }: rotaciontokenrenovacion): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const sesion = await transaction.authSession.updateMany({
        where: {
          id: replacement.sessionId,
          userId: replacement.userId,
          revokedAt: null,
          expiresAt: { gt: ahora },
        },
        data: { revokedAt: null },
      });
      if (sesion.count !== 1) return false;
      const revoked = await transaction.refreshToken.updateMany({
        where: { id: anteriortokenid, sessionId: replacement.sessionId, userId: replacement.userId, revokedAt: null, expiresAt: { gt: ahora } },
        data: { revokedAt: ahora },
      });
      if (revoked.count !== 1) return false;
      await transaction.refreshToken.create({ data: replacement });
      await transaction.authSession.update({
        where: { id: replacement.sessionId },
        data: { expiresAt: replacement.expiresAt },
      });
      return true;
    });
  }

  async revocartokenrenovacion(resumentoken: string, fecharevocacion: Date): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const token = await tx.refreshToken.findUnique({ where: { token: resumentoken }, select: { sessionId: true } });
      if (!token?.sessionId) return;
      await tx.authSession.updateMany({
        where: { id: token.sessionId, revokedAt: null },
        data: { revokedAt: fecharevocacion },
      });
      await tx.refreshToken.updateMany({
        where: { sessionId: token.sessionId, revokedAt: null },
        data: { revokedAt: fecharevocacion },
      });
    });
  }

  async esvalidotokenconfiguracioncontrasenaestudiante(entrada: {
    tokenHash: string;
    now: Date;
  }): Promise<boolean> {
    const usuario = await this.prisma.user.findFirst({
      where: {
        passwordSetupTokenHash: entrada.tokenHash,
        passwordSetupExpiresAt: { gt: entrada.now },
        passwordSetupRequired: true,
        role: PrismaUserRole.STUDENT,
        isActive: true,
        deletedAt: null,
        student: { is: { isActive: true, deletedAt: null } },
      },
      select: { id: true },
    });
    return Boolean(usuario);
  }

  async completarconfiguracioncontrasenaestudiante(entrada: {
    tokenHash: string;
    passwordHash: string;
    now: Date;
    ipAddress?: string;
  }): Promise<{ userId: string; studentId: string } | null> {
    return this.prisma.$transaction(async (transaction) => {
      const candidato = await transaction.user.findFirst({
        where: {
          passwordSetupTokenHash: entrada.tokenHash,
          passwordSetupExpiresAt: { gt: entrada.now },
          passwordSetupRequired: true,
          role: PrismaUserRole.STUDENT,
          isActive: true,
          deletedAt: null,
          student: { is: { isActive: true, deletedAt: null } },
        },
        select: { id: true, student: { select: { id: true } } },
      });
      if (!candidato?.student) return null;

      const resultado = await transaction.user.updateMany({
        where: {
          id: candidato.id,
          passwordSetupTokenHash: entrada.tokenHash,
          passwordSetupExpiresAt: { gt: entrada.now },
          passwordSetupRequired: true,
          role: PrismaUserRole.STUDENT,
          isActive: true,
          deletedAt: null,
        },
        data: {
          passwordHash: entrada.passwordHash,
          passwordSetupTokenHash: null,
          passwordSetupExpiresAt: null,
          passwordSetupRequired: false,
        },
      });
      if (resultado.count !== 1) return null;

      await transaction.refreshToken.updateMany({
        where: { userId: candidato.id, revokedAt: null },
        data: { revokedAt: entrada.now },
      });
      await transaction.auditLog.create({
        data: {
          userId: candidato.id,
          action: accionauditoria.UPDATE,
          entity: 'UserCredential',
          entityId: candidato.id,
          studentIds: [candidato.student.id],
          newValue: { activated: true },
          ipAddress: entrada.ipAddress,
        },
      });
      return { userId: candidato.id, studentId: candidato.student.id };
    });
  }
}

export function mapearusuarioautenticacionprisma(usuario: User): usuarioautenticacion {
  return {
    ...usuario,
    role: usuario.role as unknown as rolusuario,
    passwordSetupPending: usuario.passwordSetupRequired,
  };
}
