import { errorprohibido } from '../../../../core/application/aplicacionerror';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositoriocurriculoprisma } from './prismacurriculo.repository';

describe('PrismaCurriculumRepository teacher access', () => {
  it('limits reads to an exact teacher course, subject and academic year, including search', async () => {
    const asignaciones = [{ courseId: 'course-1', subjectId: 'subject-1', academicYearId: 'year-1' }];
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue(asignaciones) },
      curriculumTopic: { findMany: jest.fn().mockResolvedValue([]) },
    } as unknown as servicioprisma;
    const repo = new repositoriocurriculoprisma(prisma);
    await repo.buscartemas({ teacherUserId: 'teacher-user-1', search: 'álgebra' });
    expect(prisma.curriculumTopic.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        OR: expect.any(Array),
        AND: [{ OR: [{
          courseId: 'course-1', subjectId: 'subject-1', academicYearId: 'year-1',
          course: { teacherSubjects: { some: {
            subjectId: 'subject-1', academicYearId: 'year-1',
            teacher: { userId: 'teacher-user-1', deletedAt: null },
          } } },
        }] }],
      }),
    }));
  });

  it('rejects an explicitly requested course or subject without an assignment', async () => {
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([
        { courseId: 'course-1', subjectId: 'subject-1', academicYearId: 'year-1' },
      ]) },
      curriculumTopic: { findMany: jest.fn() },
    } as unknown as servicioprisma;
    const repo = new repositoriocurriculoprisma(prisma);
    await expect(repo.buscartemas({ teacherUserId: 'user', courseId: 'course-1', subjectId: 'subject-2' }))
      .rejects.toBeInstanceOf(errorprohibido);
    expect(prisma.curriculumTopic.findMany).not.toHaveBeenCalled();
  });

  it('does not list all topics for a teacher without assignments', async () => {
    const prisma = {
      teacherSubject: { findMany: jest.fn().mockResolvedValue([]) },
      curriculumTopic: { findMany: jest.fn() },
    } as unknown as servicioprisma;
    await expect(new repositoriocurriculoprisma(prisma).buscartemas({ teacherUserId: 'user' }))
      .resolves.toEqual([]);
    expect(prisma.curriculumTopic.findMany).not.toHaveBeenCalled();
  });

  it('rejects a teacher who is not assigned to the curriculum topic', async () => {
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      curriculumTopic: {
        findUnique: jest.fn().mockResolvedValue({ id: 'topic-1' }),
        update: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    } as unknown as servicioprisma;
    const repositorio = new repositoriocurriculoprisma(prisma);

    await expect(
      repositorio.actualizarprogresodocente('topic-1', { progressPercent: 40 }, 'teacher-user-1'),
    ).rejects.toBeInstanceOf(errorprohibido);

    expect(tx.curriculumTopic.update).not.toHaveBeenCalled();
    expect(tx.$queryRaw.mock.calls[0][0].join(' ')).toContain('FOR UPDATE OF ct, ts, t');
  });
});
