import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { accionauditoria, rolusuario } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import {
  ordenrestablecercontrasenausuario,
  repositoriocredencialesusuario,
} from '../../domain/repositories/usuariocredencial.repository.interface';

@Injectable()
export class repositoriocredencialesusuarioprisma implements repositoriocredencialesusuario {
  constructor(
    private readonly prisma: servicioprisma,
    @Inject(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
  ) {}

  async restablecercontrasenayregistrarauditoria(
    orden: ordenrestablecercontrasenausuario,
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const objetivo = await transaction.user.findUnique({ where: { id: orden.userId } });
      if (!objetivo || objetivo.deletedAt) throw new NotFoundException('Usuario no encontrado');
      if (objetivo.passwordSetupRequired) {
        throw new ConflictException('La cuenta estudiantil debe completar su flujo de activación.');
      }
      if (
        (objetivo.role === rolusuario.ADMINISTRATIVE &&
          (orden.actorRole !== rolusuario.ADMINISTRATIVE || orden.actorUserId === objetivo.id)) ||
        orden.actorRole !== rolusuario.ADMINISTRATIVE
      ) {
        throw new ForbiddenException('No tienes autorización para restablecer esta cuenta.');
      }

      const actualizado = await transaction.user.update({
        where: { id: objetivo.id },
        data: {
          passwordHash: orden.passwordHash,
          credentialVersion: { increment: 1 },
        },
      });
      await transaction.refreshToken.updateMany({
        where: { userId: objetivo.id, revokedAt: null },
        data: { revokedAt: actualizado.updatedAt },
      });
      await transaction.auditLog.create({
        data: {
          userId: orden.actorUserId,
          action: accionauditoria.UPDATE,
          entity: 'UserCredential',
          entityId: objetivo.id,
          previousValue: {
            isActive: objetivo.isActive,
            name: `${objetivo.firstName} ${objetivo.lastName}`,
          },
          newValue: {
            isActive: actualizado.isActive,
            name: `${actualizado.firstName} ${actualizado.lastName}`,
            passwordReset: true,
          },
          ipAddress: orden.ipAddress,
          correlationId: this.contextocorrelacion.obteneractual(),
        },
      });
    });
  }
}
