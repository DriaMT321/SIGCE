import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { repositoriofamiliarprisma } from './prismapadre.repository';

describe('repositorio de familiares al crear', () => {
  it('crea usuario, perfil y auditoría en una transacción', async () => {
    const usuario = {
      id: 'usuario-1',
      email: 'familiar@example.test',
      role: 'PARENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const familiar = {
      id: 'familiar-1',
      userId: usuario.id,
      ci: '1234567',
      firstName: 'Ana',
      lastName: 'Paz',
      phone: '70000000',
      address: null,
      occupation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: usuario,
      studentParents: [],
    };
    const tx = {
      user: { create: jest.fn().mockResolvedValue(usuario) },
      parent: { create: jest.fn().mockResolvedValue(familiar) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.crear(
      {
        email: usuario.email,
        passwordHash: 'hash-seguro',
        ci: familiar.ci,
        firstName: familiar.firstName,
        lastName: familiar.lastName,
        phone: familiar.phone,
      },
      { userId: 'admin-1', ipAddress: '127.0.0.1' },
    );

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'admin-1',
          entity: 'Parent',
          entityId: familiar.id,
          ipAddress: '127.0.0.1',
        }),
      }),
    );
  });

  it('traduce una violación de unicidad del usuario o su CI a conflicto', async () => {
    const duplicado = new Prisma.PrismaClientKnownRequestError('duplicate parent', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });
    const tx = {
      user: { create: jest.fn().mockRejectedValue(duplicado) },
      parent: { create: jest.fn() },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.crear(
        {
          email: 'familiar@example.test',
          passwordHash: 'hash-seguro',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          phone: '70000000',
        },
        { userId: 'admin-1' },
      ),
    ).rejects.toMatchObject({
      constructor: incumplimientoregladominio,
      code: 'CONFLICT',
    });
  });
});

describe('repositorio de familiares al actualizar', () => {
  it('traduce un correo o C.I. duplicado a conflicto', async () => {
    const duplicado = new Prisma.PrismaClientKnownRequestError('duplicate parent identity', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'familiar-1' }]),
      parent: {
        findFirst: jest.fn().mockResolvedValue({
          userId: 'usuario-1',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          phone: '70000000',
          address: null,
          occupation: null,
          user: { email: 'ana@example.test' },
        }),
        update: jest.fn(),
      },
      user: { update: jest.fn().mockRejectedValue(duplicado) },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar(
        'familiar-1',
        { email: 'ocupado@example.test' },
        { userId: 'admin-1' },
      ),
    ).rejects.toMatchObject({
      constructor: incumplimientoregladominio,
      code: 'CONFLICT',
    });
  });

  it('propaga los errores de persistencia que no son conflictos ni faltantes', async () => {
    const fallo = new Error('conexión de base de datos interrumpida');
    const prisma = {
      $transaction: jest.fn().mockRejectedValue(fallo),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('familiar-1', { email: 'nuevo@example.test' }, { userId: 'admin-1' }),
    ).rejects.toBe(fallo);
  });

  it('guarda el cambio y su auditoría en la misma transacción', async () => {
    const anterior = {
      id: 'familiar-1',
      userId: 'usuario-1',
      ci: '1234567',
      firstName: 'Ana',
      lastName: 'Paz',
      phone: '70000000',
      address: null,
      occupation: null,
      user: { email: 'ana@example.test' },
      studentParents: [],
    };
    const actualizado = { ...anterior, firstName: 'Ana María' };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'familiar-1' }]),
      parent: {
        findFirst: jest.fn().mockResolvedValue(anterior),
        update: jest.fn().mockResolvedValue(actualizado),
      },
      user: { update: jest.fn() },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.actualizar('familiar-1', { firstName: 'Ana María' }, { userId: 'admin-1' });

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'UPDATE',
          entity: 'Parent',
          entityId: 'familiar-1',
          previousValue: expect.objectContaining({ firstName: 'Ana' }),
          newValue: expect.objectContaining({ firstName: 'Ana María' }),
        }),
      }),
    );
    expect(tx.parent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'familiar-1', deletedAt: null },
      }),
    );
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.parent.findFirst.mock.invocationCallOrder[0],
    );
  });

  it('incluye la eliminación lógica y su auditoría en una transacción', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'familiar-1' }]),
      parent: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'familiar-1',
          userId: 'usuario-1',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          user: { email: 'ana@example.test' },
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      user: { update: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.eliminarlogicamente('familiar-1', { userId: 'admin-1' });

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'DELETE',
          entity: 'Parent',
          entityId: 'familiar-1',
        }),
      }),
    );
    expect(tx.parent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'familiar-1', deletedAt: null },
      }),
    );
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.parent.findFirst.mock.invocationCallOrder[0],
    );
  });

  it('rechaza actualizar o eliminar un familiar dado de baja', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      parent: { findFirst: jest.fn(), update: jest.fn() },
      user: { update: jest.fn() },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('familiar-1', { firstName: 'Ana' }, { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      repositorio.eliminarlogicamente('familiar-1', { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
    expect(tx.parent.findFirst).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('traduce a 404 una baja concurrente detectada al actualizar o eliminar', async () => {
    const registroinactivo = new Prisma.PrismaClientKnownRequestError('record not found', {
      code: 'P2025',
      clientVersion: '6.19.3',
    });
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'familiar-1' }]),
      parent: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'familiar-1',
          userId: 'usuario-1',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          user: { email: 'ana@example.test' },
        }),
        update: jest.fn().mockRejectedValue(registroinactivo),
      },
      user: { update: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriofamiliarprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('familiar-1', { firstName: 'Ana María' }, { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      repositorio.eliminarlogicamente('familiar-1', { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});
