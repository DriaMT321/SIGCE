import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { repositoriousuarioprisma } from './prismausuario.repository';

describe('PrismaUserRepository.update', () => {
  function configuracion(estaactivo = true) {
    const actual = {
      id: 'user-1',
      email: 'staff@example.test',
      firstName: 'Ana',
      lastName: 'Pérez',
      role: 'TEACHER',
      isActive: estaactivo,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      deletedAt: null,
    };
    const transaction = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'user-1' }]),
      user: {
        findUnique: jest.fn().mockResolvedValue(actual),
        update: jest.fn().mockResolvedValue(actual),
      },
      refreshToken: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (tx: typeof transaction) => unknown) =>
        callback(transaction),
      ),
    } as unknown as servicioprisma;
    return {
      repository: new repositoriousuarioprisma(prisma, new contextoidentificadorcorrelacionlocal()),
      transaction,
    };
  }

  it('invalida sesiones al desactivar y reactivar una cuenta', async () => {
    const { repository: repositorio, transaction } = configuracion();

    await repositorio.actualizar('user-1', { isActive: false }, { userId: 'admin-1' });

    expect(transaction.refreshToken.updateMany).toHaveBeenCalledTimes(1);
    expect(transaction.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ credentialVersion: { increment: 1 } }),
      }),
    );
    expect(transaction.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: 'admin-1', entity: 'User', entityId: 'user-1' }),
      }),
    );
  });

  it('no cambia la versión de credenciales para una edición de perfil', async () => {
    const { repository: repositorio, transaction } = configuracion();

    await repositorio.actualizar('user-1', { firstName: 'Ana María' }, { userId: 'admin-1' });

    expect(transaction.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { firstName: 'Ana María' },
      }),
    );
    expect(transaction.refreshToken.updateMany).not.toHaveBeenCalled();
  });

  it('rechaza usuarios inexistentes sin abrir una actualización', async () => {
    const { repository: repositorio, transaction } = configuracion();
    transaction.$queryRaw.mockResolvedValue([]);
    transaction.user.findUnique.mockResolvedValue(null);

    await expect(
      repositorio.actualizar('missing', { isActive: false }, { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(transaction.user.update).not.toHaveBeenCalled();
    expect(transaction.auditLog.create).not.toHaveBeenCalled();
  });
});

describe('PrismaUserRepository.create', () => {
  it('creates the user and audit event in the same transaction', async () => {
    const creado = {
      id: 'user-2',
      email: 'staff@example.test',
      firstName: 'Ana',
      lastName: 'Pérez',
      role: 'SECRETARY',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      passwordSetupRequired: false,
    };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'user-2' }]),
      user: { create: jest.fn().mockResolvedValue(creado) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriousuarioprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.crear(
      {
        email: creado.email,
        firstName: creado.firstName,
        lastName: creado.lastName,
        passwordHash: 'hashed-password',
        role: 'SECRETARY' as never,
      },
      { userId: 'admin-1' },
    );

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: 'admin-1', entity: 'User', entityId: 'user-2' }),
      }),
    );
  });

  it('traduce un correo duplicado a un conflicto de dominio', async () => {
    const duplicado = new Prisma.PrismaClientKnownRequestError('duplicate email', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });
    const tx = {
      user: { create: jest.fn().mockRejectedValue(duplicado) },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriousuarioprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.crear(
        {
          email: 'staff@example.test',
          firstName: 'Ana',
          lastName: 'Pérez',
          passwordHash: 'hashed-password',
          role: 'SECRETARY' as never,
        },
        { userId: 'admin-1' },
      ),
    ).rejects.toMatchObject({
      constructor: incumplimientoregladominio,
      code: 'CONFLICT',
    });
  });
});
