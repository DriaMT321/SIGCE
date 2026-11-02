import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { repositorioasistenciaprisma } from './prismaasistencia.repository';

describe('PrismaAttendanceRepository teacher read scope', () => {
  it('limits attendance records to courses assigned to the teacher', async () => {
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([{ courseId: 'course-1' }]) },
      attendance: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.buscartodos({ teacherUserId: 'teacher-1', limit: 25, offset: 0 });

    expect(prisma.teacherSubject.findMany).toHaveBeenCalledWith({
      where: { teacher: { userId: 'teacher-1', deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
      select: { courseId: true },
      distinct: ['courseId'],
    });
    expect(prisma.attendance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { courseId: { in: ['course-1'] } } }),
    );
  });

  it('returns no attendance for a teacher without course assignments', async () => {
    const buscarmany = jest.fn();
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([]) },
      attendance: { findMany: buscarmany, count: jest.fn() },
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.buscartodos({ teacherUserId: 'teacher-1', limit: 25, offset: 0 }),
    ).resolves.toEqual({ items: [], total: 0 });
    expect(buscarmany).not.toHaveBeenCalled();
  });

  it('keeps the requested course filter within the courses assigned to the teacher', async () => {
    const prisma = {
      teacherSubject: {
        findMany: jest.fn().mockResolvedValue([{ courseId: 'course-1' }, { courseId: 'course-2' }]),
      },
      attendance: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.buscartodos({
      teacherUserId: 'teacher-1',
      courseId: 'course-1',
      limit: 25,
      offset: 0,
    });

    expect(prisma.attendance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { courseId: 'course-1' } }),
    );
  });

  it('does not return attendance for a requested course that the teacher does not teach', async () => {
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([{ courseId: 'course-1' }]) },
      attendance: { findMany: jest.fn(), count: jest.fn() },
    } as unknown as servicioprisma;
    const repositorio = new repositorioasistenciaprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.buscartodos({
        teacherUserId: 'teacher-1',
        courseId: 'course-2',
        limit: 25,
        offset: 0,
      }),
    ).rejects.toMatchObject({ status: 403 });
    expect(prisma.attendance.findMany).not.toHaveBeenCalled();
  });
});
