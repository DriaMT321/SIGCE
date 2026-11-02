import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { repositorioinscripcionprisma } from './prismainscripcion.repository';

describe('PrismaEnrollmentRepository teacher read scope', () => {
  it('limits enrollment records to courses assigned to the teacher', async () => {
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([{ courseId: 'course-1' }]) },
      enrollment: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
    } as unknown as servicioprisma;
    const repositorio = new repositorioinscripcionprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await repositorio.buscartodos({ teacherUserId: 'teacher-1', limit: 25, offset: 0 });

    expect(prisma.teacherSubject.findMany).toHaveBeenCalledWith({
      where: { teacher: { userId: 'teacher-1', deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } } },
      select: { courseId: true },
      distinct: ['courseId'],
    });
    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { courseId: { in: ['course-1'] } } }),
    );
  });

  it('returns no enrollments for a teacher without course assignments', async () => {
    const buscarmany = jest.fn();
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([]) },
      enrollment: { findMany: buscarmany, count: jest.fn() },
    } as unknown as servicioprisma;
    const repositorio = new repositorioinscripcionprisma(
      prisma,
      new contextoidentificadorcorrelacionlocal(),
    );

    await expect(
      repositorio.buscartodos({ teacherUserId: 'teacher-1', limit: 25, offset: 0 }),
    ).resolves.toEqual({ items: [], total: 0 });
    expect(buscarmany).not.toHaveBeenCalled();
  });

  it('retains the selected course and rejects another course outside the assignment', async () => {
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([{ courseId: 'course-1' }, { courseId: 'course-2' }]) },
      enrollment: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) },
    } as unknown as servicioprisma;
    const repositorio = new repositorioinscripcionprisma(prisma, new contextoidentificadorcorrelacionlocal());
    await repositorio.buscartodos({ teacherUserId: 'teacher-1', courseId: 'course-1', limit: 25, offset: 0 });
    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { courseId: 'course-1' } }));
    await expect(repositorio.buscartodos({ teacherUserId: 'teacher-1', courseId: 'course-3', limit: 25, offset: 0 }))
      .rejects.toMatchObject({ status: 403 });
  });

});
