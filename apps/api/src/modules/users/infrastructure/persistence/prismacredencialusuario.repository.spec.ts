import { ConflictException, ForbiddenException } from '@nestjs/common';
import { rolusuario } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { repositoriocredencialesusuarioprisma } from './prismacredencialusuario.repository';

function configuracion(rol = rolusuario.TEACHER, configuracioncontrasenarequerida = false) {
  const objetivo = {
    id: 'user-1',
    firstName: 'Ana',
    lastName: 'Rojas',
    role: rol,
    isActive: true,
    deletedAt: null,
    passwordSetupRequired: configuracioncontrasenarequerida,
  };
  const transaction = {
    user: {
      findUnique: jest.fn().mockResolvedValue(objetivo),
      update: jest
        .fn()
        .mockResolvedValue({ ...objetivo, updatedAt: new Date('2026-10-22T12:00:00Z') }),
    },
    refreshToken: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    auditLog: { create: jest.fn().mockResolvedValue({ id: 'audit-1' }) },
  };
  const prisma = {
    $transaction: jest.fn((callback: (tx: typeof transaction) => unknown) => callback(transaction)),
  } as unknown as servicioprisma;
  const contextocorrelacion = new contextoidentificadorcorrelacionlocal();
  return {
    repository: new repositoriocredencialesusuarioprisma(prisma, contextocorrelacion),
    transaction,
    contextocorrelacion,
  };
}

const administrativecommand = {
  userId: 'user-1',
  passwordHash: 'bcrypt-hash',
  actorUserId: 'director-1',
  actorRole: rolusuario.ADMINISTRATIVE,
  ipAddress: '127.0.0.1',
};

describe('PrismaUserCredentialRepository.resetPasswordAndAudit', () => {
  it('changes the hash, revokes sessions, and writes a secret-free audit event in one transaction', async () => {
    const { repository: repositorio, transaction, contextocorrelacion } = configuracion();

    await contextocorrelacion.ejecutar('corr-password-reset', () =>
      repositorio.restablecercontrasenayregistrarauditoria(administrativecommand),
    );

    expect(transaction.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: { passwordHash: 'bcrypt-hash', credentialVersion: { increment: 1 } },
      }),
    );
    expect(transaction.refreshToken.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1', revokedAt: null },
      }),
    );
    expect(transaction.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'director-1',
        entity: 'UserCredential',
        entityId: 'user-1',
        newValue: expect.objectContaining({ passwordReset: true }),
        ipAddress: '127.0.0.1',
        correlationId: 'corr-password-reset',
      }),
    });
    expect(JSON.stringify(transaction.auditLog.create.mock.calls)).not.toContain('bcrypt-hash');
  });

  it('allows the unified administrative role to reset another administrative account', async () => {
    const { repository: repositorio, transaction } = configuracion(rolusuario.ADMINISTRATIVE);

    await repositorio.restablecercontrasenayregistrarauditoria(administrativecommand);

    expect(transaction.user.update).toHaveBeenCalled();
    expect(transaction.auditLog.create).toHaveBeenCalled();
  });

  it('does not allow an administrator to reset their own account through this flow', async () => {
    const { repository: repositorio, transaction } = configuracion(rolusuario.ADMINISTRATIVE);

    await expect(
      repositorio.restablecercontrasenayregistrarauditoria({
        ...administrativecommand,
        actorUserId: 'user-1',
        actorRole: rolusuario.ADMINISTRATIVE,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(transaction.user.update).not.toHaveBeenCalled();
  });

  it('refuses pending student accounts so they use activation instead', async () => {
    const { repository: repositorio, transaction } = configuracion(rolusuario.STUDENT, true);

    await expect(
      repositorio.restablecercontrasenayregistrarauditoria(administrativecommand),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(transaction.user.update).not.toHaveBeenCalled();
    expect(transaction.auditLog.create).not.toHaveBeenCalled();
  });
});
