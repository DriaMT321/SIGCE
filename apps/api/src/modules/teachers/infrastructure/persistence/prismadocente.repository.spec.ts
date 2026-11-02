import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { repositoriodocenteprisma } from './prismadocente.repository';

describe('repositorio de docentes al crear', () => {
  it('crea usuario, perfil y auditoría en una transacción', async () => {
    const usuario = {
      id: 'usuario-1',
      email: 'docente@example.test',
      role: 'TEACHER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docente = {
      id: 'docente-1',
      userId: usuario.id,
      ci: '1234567',
      firstName: 'Ana',
      lastName: 'Paz',
      specialty: 'Matemática',
      phone: null,
      itemNumber: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: usuario,
    };
    const tx = {
      user: { create: jest.fn().mockResolvedValue(usuario) },
      teacher: { create: jest.fn().mockResolvedValue(docente) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.crear(
      {
        email: usuario.email,
        passwordHash: 'hash-seguro',
        ci: docente.ci,
        firstName: docente.firstName,
        lastName: docente.lastName,
        specialty: docente.specialty,
      },
      { userId: 'admin-1', ipAddress: '127.0.0.1' },
    );

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'admin-1',
          entity: 'Teacher',
          entityId: docente.id,
          ipAddress: '127.0.0.1',
        }),
      }),
    );
  });

  it('traduce una violación de unicidad del usuario o su CI a conflicto', async () => {
    const duplicado = new Prisma.PrismaClientKnownRequestError('duplicate teacher', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });
    const tx = {
      user: { create: jest.fn().mockRejectedValue(duplicado) },
      teacher: { create: jest.fn() },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.crear(
        {
          email: 'docente@example.test',
          passwordHash: 'hash-seguro',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          specialty: 'Matemática',
        },
        { userId: 'admin-1' },
      ),
    ).rejects.toMatchObject({
      constructor: incumplimientoregladominio,
      code: 'CONFLICT',
    });
  });
});

describe('repositorio de docentes al actualizar', () => {
  it('traduce un correo o C.I. duplicado a conflicto', async () => {
    const duplicado = new Prisma.PrismaClientKnownRequestError('duplicate teacher identity', {
      code: 'P2002',
      clientVersion: '6.19.3',
    });
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'docente-1' }]),
      teacher: {
        findFirst: jest.fn().mockResolvedValue({
          userId: 'usuario-1',
          ci: '1234567',
          firstName: 'Ana',
          lastName: 'Paz',
          specialty: 'Matemática',
          phone: null,
          itemNumber: null,
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
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('docente-1', { email: 'ocupado@example.test' }, { userId: 'admin-1' }),
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
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('docente-1', { email: 'nuevo@example.test' }, { userId: 'admin-1' }),
    ).rejects.toBe(fallo);
  });

  it('guarda el cambio y su auditoría en la misma transacción', async () => {
    const anterior = {
      id: 'docente-1',
      userId: 'usuario-1',
      ci: '1234567',
      firstName: 'Ana',
      lastName: 'Paz',
      specialty: 'Matemática',
      phone: null,
      itemNumber: null,
      user: { email: 'ana@example.test' },
    };
    const actualizado = { ...anterior, firstName: 'Ana María' };
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'docente-1' }]),
      teacher: {
        findFirst: jest.fn().mockResolvedValue(anterior),
        update: jest.fn().mockResolvedValue(actualizado),
      },
      user: { update: jest.fn() },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.actualizar('docente-1', { firstName: 'Ana María' }, { userId: 'admin-1' });

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'UPDATE',
          entity: 'Teacher',
          entityId: 'docente-1',
          previousValue: expect.objectContaining({ firstName: 'Ana' }),
          newValue: expect.objectContaining({ firstName: 'Ana María' }),
        }),
      }),
    );
    expect(tx.teacher.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'docente-1', deletedAt: null },
      }),
    );
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.teacher.findFirst.mock.invocationCallOrder[0],
    );
  });

  it('incluye la eliminación lógica y su auditoría en una transacción', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'docente-1' }]),
      teacher: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'docente-1',
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
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.eliminarlogicamente('docente-1', { userId: 'admin-1' });

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'DELETE',
          entity: 'Teacher',
          entityId: 'docente-1',
        }),
      }),
    );
    expect(tx.teacher.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'docente-1', deletedAt: null },
      }),
    );
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.teacher.findFirst.mock.invocationCallOrder[0],
    );
  });

  it('rechaza actualizar o eliminar un docente dado de baja', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      teacher: { findFirst: jest.fn(), update: jest.fn() },
      user: { update: jest.fn() },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('docente-1', { firstName: 'Ana' }, { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      repositorio.eliminarlogicamente('docente-1', { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
    expect(tx.teacher.findFirst).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('traduce a 404 una baja concurrente detectada al actualizar o eliminar', async () => {
    const registroinactivo = new Prisma.PrismaClientKnownRequestError('record not found', {
      code: 'P2025',
      clientVersion: '6.19.3',
    });
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'docente-1' }]),
      teacher: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'docente-1',
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
    const repositorio = new repositoriodocenteprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar('docente-1', { firstName: 'Ana María' }, { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(
      repositorio.eliminarlogicamente('docente-1', { userId: 'admin-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});
