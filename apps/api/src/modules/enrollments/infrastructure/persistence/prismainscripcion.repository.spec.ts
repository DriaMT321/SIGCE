import { Prisma } from '@prisma/client';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositorioinscripcionprisma } from './prismainscripcion.repository';

const inscripcionrelations = {
  student: { id: 'student-1', rude: 'SYNTH-1', firstName: 'Ana', lastName: 'Pérez' },
  course: { id: 'course-1', name: 'Primero A', gradeLevel: 1, section: 'A' },
  academicYear: { id: 'year-1', year: 2026, name: 'Gestión 2026' },
};

function configuracion({ occupied: ocupado = 0, currentStatus: actualestado = 'INACTIVE' } = {}) {
  const tx = {
    $queryRaw: jest.fn().mockResolvedValue([{ id: 'course-1' }]),
    student: {
      findUnique: jest.fn().mockResolvedValue({ id: 'student-1', isActive: true, deletedAt: null }),
    },
    course: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'course-1',
        academicYearId: 'year-1',
        maxCapacity: 1,
      }),
    },
    academicYear: {
      findUnique: jest.fn().mockResolvedValue({ id: 'year-1', isClosed: false }),
    },
    enrollment: {
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn(),
      count: jest.fn().mockResolvedValue(ocupado),
      create: jest.fn().mockResolvedValue({
        id: 'enrollment-1',
        studentId: 'student-1',
        courseId: 'course-1',
        academicYearId: 'year-1',
        enrollmentDate: new Date('2026-02-01T00:00:00.000Z'),
        status: 'ACTIVE',
        remarks: null,
        ...inscripcionrelations,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'enrollment-1',
        studentId: 'student-1',
        courseId: 'course-1',
        academicYearId: 'year-1',
        enrollmentDate: new Date('2026-02-01T00:00:00.000Z'),
        status: 'ACTIVE',
        remarks: null,
        ...inscripcionrelations,
      }),
    },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
  };
  tx.enrollment.findUnique.mockResolvedValue({
    id: 'enrollment-1',
    studentId: 'student-1',
    courseId: 'course-1',
    academicYearId: 'year-1',
    status: actualestado,
    course: { id: 'course-1', maxCapacity: 1 },
    academicYear: { id: 'year-1', isClosed: false },
  });

  const transaction = jest.fn(async (operacion: (client: typeof tx) => unknown) => operacion(tx));
  const prisma = {
    enrollment: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: transaction,
  } as unknown as servicioprisma;

  return {
    repository: new repositorioinscripcionprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    ),
    transaction,
    tx,
  };
}

describe('PrismaEnrollmentRepository capacity invariants', () => {
  it('creates a registration through a serializable transaction', async () => {
    const { repository: repositorio, transaction, tx } = configuracion();
    tx.enrollment.findUnique.mockResolvedValueOnce(null);
    tx.enrollment.count.mockResolvedValueOnce(0);

    await repositorio.crear(
      {
        studentId: 'student-1',
        courseId: 'course-1',
        academicYearId: 'year-1',
      },
      { userId: 'secretary-1' },
    );

    expect(tx.enrollment.create).toHaveBeenCalledTimes(1);
    expect(tx.$queryRaw.mock.calls[0][0].join(' ')).toContain('FOR UPDATE');
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.enrollment.count.mock.invocationCallOrder[0],
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          entity: 'Enrollment',
          entityId: 'enrollment-1',
          userId: 'secretary-1',
          studentIds: ['student-1'],
        }),
      }),
    );
    expect(transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  });

  it('rejects registration when the course is at capacity', async () => {
    const { repository: repositorio, tx } = configuracion({ occupied: 1 });
    tx.enrollment.findUnique.mockResolvedValueOnce(null);

    await expect(
      repositorio.crear(
        {
          studentId: 'student-1',
          courseId: 'course-1',
          academicYearId: 'year-1',
        },
        { userId: 'secretary-1' },
      ),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);
    expect(tx.enrollment.create).not.toHaveBeenCalled();
  });

  it('rejects reactivation when the course is at capacity', async () => {
    const { repository: repositorio, tx } = configuracion({
      occupied: 1,
      currentStatus: 'INACTIVE',
    });

    await expect(
      repositorio.actualizarestado('enrollment-1', 'ACTIVE', undefined, { userId: 'secretary-1' }),
    ).rejects.toBeInstanceOf(incumplimientoregladominio);
    expect(tx.$queryRaw.mock.calls[0][0].join(' ')).toContain('FOR UPDATE');
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.enrollment.count.mock.invocationCallOrder[0],
    );
    expect(tx.enrollment.update).not.toHaveBeenCalled();
  });
});
