import { servicioprisma } from '../../../../common/database/prisma.service';
import { ConflictException } from '@nestjs/common';
import { repositoriocursoprisma } from './prismacurso.repository';

describe('PrismaCourseRepository audited mutations', () => {
  const curso = {
    id: 'course-1',
    academicYearId: 'year-1',
    name: '6to A',
    gradeLevel: 6,
    section: 'A',
    shift: 'MORNING',
    maxCapacity: 30,
    academicYear: { id: 'year-1', year: 2026, name: 'Gestión 2026' },
    _count: { enrollments: 12 },
  };

  function configuracion() {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([{ id: 'course-1' }]),
      course: {
        create: jest.fn().mockResolvedValue(curso),
        findUnique: jest.fn().mockResolvedValue(curso),
        update: jest.fn().mockResolvedValue({ ...curso, name: '6to B', section: 'B' }),
        delete: jest.fn().mockResolvedValue(curso),
      },
      enrollment: { count: jest.fn().mockResolvedValue(12) },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    return { repository: new repositoriocursoprisma(prisma), prisma, tx };
  }

  const auditoria = { userId: 'admin-1', ipAddress: '127.0.0.1' };

  it('creates the course and audit record in one transaction', async () => {
    const { repository: repositorio, prisma, tx } = configuracion();

    const creado = await repositorio.crear(
      {
        academicYearId: 'year-1',
        name: '6to A',
        gradeLevel: 6,
        section: 'A',
        shift: 'MORNING',
      },
      auditoria,
    );

    expect(creado.id).toBe('course-1');
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'CREATE', entity: 'Course', entityId: 'course-1' }),
      }),
    );
  });

  it('updates the course and captures both values in the same transaction', async () => {
    const { repository: repositorio, tx } = configuracion();

    await repositorio.actualizar('course-1', { name: '6to B' }, auditoria);

    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'UPDATE',
          previousValue: expect.objectContaining({ name: '6to A' }),
          newValue: expect.objectContaining({ name: '6to B' }),
        }),
      }),
    );
  });

  it('rejects reducing capacity below the number of active enrollments', async () => {
    const { repository: repositorio, tx } = configuracion();
    tx.enrollment.count.mockResolvedValue(20);

    await expect(
      repositorio.actualizar('course-1', { maxCapacity: 10 }, auditoria),
    ).rejects.toThrow(ConflictException);

    expect(tx.$queryRaw.mock.calls[0][0].join(' ')).toContain('FOR UPDATE');
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.enrollment.count.mock.invocationCallOrder[0],
    );
    expect(tx.enrollment.count).toHaveBeenCalledWith({
      where: { courseId: 'course-1', status: 'ACTIVE' },
    });
    expect(tx.course.update).not.toHaveBeenCalled();
  });

  it('rejects deleting a course that has academic history', async () => {
    const { repository: repositorio, prisma, tx } = configuracion();

    await expect(repositorio.eliminar('course-1', auditoria)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.course.delete).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('deletes an empty course and records its previous value in the same transaction', async () => {
    const { repository: repositorio, prisma, tx } = configuracion();
    tx.course.findUnique.mockResolvedValue({
      ...curso,
      _count: {
        enrollments: 0,
        teacherSubjects: 0,
        attendances: 0,
        schedules: 0,
        curriculumTopics: 0,
        assignments: 0,
        announcements: 0,
        sieDiscrepancyGroups: 0,
      },
    } as never);

    await repositorio.eliminar('course-1', auditoria);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.course.delete).toHaveBeenCalledWith({ where: { id: 'course-1' } });
    expect(tx.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'DELETE',
          entityId: 'course-1',
          previousValue: expect.objectContaining({ name: '6to A' }),
        }),
      }),
    );
  });
});
