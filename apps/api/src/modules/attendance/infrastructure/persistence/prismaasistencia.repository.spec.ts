import { servicioprisma } from '../../../../common/database/prisma.service';
import { ConflictException } from '@nestjs/common';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { repositorioasistenciaprisma } from './prismaasistencia.repository';

describe('PrismaAttendanceRepository audit transactions', () => {
  const registrar = {
    id: 'attendance-1',
    studentId: 'student-1',
    courseId: 'course-1',
    registeredById: 'teacher-1',
    date: new Date('2026-03-04T00:00:00.000Z'),
    status: 'PRESENT',
    justification: null,
    student: { id: 'student-1', rude: 'R-1', firstName: 'Ana', lastName: 'Rojas' },
    course: { id: 'course-1', name: '6to A', gradeLevel: 6, section: 'A' },
  };

  it('creates attendance and its audit event in one transaction', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'attendance-1' }]),
      attendance: { create: jest.fn().mockResolvedValue(registrar) },
      alertEvaluationOutbox: { create: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.crear(
      {
        studentId: 'student-1',
        courseId: 'course-1',
        registeredById: 'teacher-1',
        date: registrar.date,
        status: 'PRESENT',
      },
      { userId: 'teacher-1', ipAddress: '127.0.0.1' },
      {},
    );

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'teacher-1',
          entity: 'Attendance',
          entityId: 'attendance-1',
          studentIds: ['student-1'],
        }),
      }),
    );
    expect(tx.alertEvaluationOutbox.create).toHaveBeenCalledWith({
      data: { studentId: 'student-1' },
    });
    expect(tx.$queryRaw).toHaveBeenCalled();
  });

  it('updates attendance and records the prior and new values in one transaction', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'attendance-1' }]),
      attendance: {
        findUnique: jest.fn().mockResolvedValue(registrar),
        update: jest
          .fn()
          .mockResolvedValue({ ...registrar, status: 'JUSTIFIED', justification: 'Constancia' }),
      },
      alertEvaluationOutbox: { create: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.actualizar(
      'attendance-1',
      { status: 'JUSTIFIED', justification: 'Constancia' },
      { userId: 'teacher-1' },
      {},
    );

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          studentIds: ['student-1'],
          previousValue: expect.objectContaining({ status: 'PRESENT' }),
          newValue: expect.objectContaining({ status: 'JUSTIFIED' }),
        }),
      }),
    );
    expect(tx.alertEvaluationOutbox.create).toHaveBeenCalledWith({
      data: { studentId: 'student-1' },
    });
  });

  it('blocks attendance updates after the academic year closes', async () => {
    const tx = {
      $queryRaw: jest
        .fn()
        .mockResolvedValueOnce([{ id: 'attendance-1' }])
        .mockResolvedValueOnce([]),
      attendance: {
        findUnique: jest.fn().mockResolvedValue(registrar),
        update: jest.fn(),
      },
      alertEvaluationOutbox: { create: jest.fn() },
      auditLog: { create: jest.fn() },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.actualizar(
        'attendance-1',
        { status: 'JUSTIFIED', justification: 'Constancia' },
        { userId: 'teacher-1' },
        {},
      ),
    ).rejects.toThrow(ConflictException);

    expect(tx.attendance.update).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('rejects a teacher write when the assignment is removed before the transaction revalidates it', async () => {
    const tx = {
      $queryRaw: jest
        .fn()
        .mockResolvedValueOnce([{ enrollmentId: 'enrollment-1' }])
        .mockResolvedValueOnce([]),
      attendance: { create: jest.fn().mockResolvedValue(registrar) },
      alertEvaluationOutbox: { create: jest.fn().mockResolvedValue({}) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.crear(
        {
          studentId: 'student-1',
          courseId: 'course-1',
          registeredById: 'teacher-1',
          date: registrar.date,
          status: 'PRESENT',
        },
        { userId: 'teacher-1' },
        { teacherUserId: 'teacher-1' },
      ),
    ).rejects.toThrow('El docente no tiene asignación académica para este curso');

    expect(tx.attendance.create).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});
