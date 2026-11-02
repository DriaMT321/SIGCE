import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositorioautenticacionprisma } from './prismaautenticacion.repository';

describe('PrismaAuthenticationRepository student activation', () => {
  it('only completes activation while the linked student profile is active', async () => {
    const tx = {
      user: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'user-1',
          student: { id: 'student-1' },
        }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      refreshToken: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      user: { findFirst: jest.fn().mockResolvedValue({ id: 'user-1' }) },
      $transaction: jest.fn((callback: (cliente: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioautenticacionprisma(prisma);
    const entrada = {
      tokenHash: 'hashed-token',
      passwordHash: 'hashed-password',
      now: new Date('2026-01-01T00:00:00.000Z'),
    };

    await expect(repositorio.esvalidotokenconfiguracioncontrasenaestudiante(entrada)).resolves.toBe(
      true,
    );
    await expect(repositorio.completarconfiguracioncontrasenaestudiante(entrada)).resolves.toEqual({
      userId: 'user-1',
      studentId: 'student-1',
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          student: { is: { isActive: true, deletedAt: null } },
        }),
      }),
    );
    expect(tx.user.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          student: { is: { isActive: true, deletedAt: null } },
        }),
      }),
    );
  });
});
