import { servicioprisma } from '../../../../common/database/prisma.service';
import { prismagraderepository } from './prismagrade.repository';

describe('Alcance de lectura de calificaciones del docente', () => {
  it('rechaza cursos y materias no asignados, incluso si el docente tiene otra materia en ese curso', async () => {
    const prisma = { teacherSubject: { findMany: jest.fn().mockResolvedValue([{ courseId: 'curso-1', subjectId: 'mat-1', academicYearId: 'anio' }]) }, grade: { findMany: jest.fn(), count: jest.fn() } } as unknown as servicioprisma;
    const repo = new prismagraderepository(prisma);
    await expect(repo.buscartodos({ teacherUserId: 'docente', courseId: 'curso-1', subjectId: 'mat-2', limit: 10, offset: 0 })).rejects.toMatchObject({ status: 403 });
    await expect(repo.buscartodos({ teacherUserId: 'docente', courseId: 'curso-2', limit: 10, offset: 0 })).rejects.toMatchObject({ status: 403 });
    expect(prisma.grade.findMany).not.toHaveBeenCalled();
  });
  it('solo consulta las combinaciones asignadas', async () => {
    const prisma = { teacherSubject: { findMany: jest.fn().mockResolvedValue([{ courseId: 'curso-1', subjectId: 'mat-1', academicYearId: 'anio' }]) }, grade: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) } } as unknown as servicioprisma;
    await new prismagraderepository(prisma).buscartodos({ teacherUserId: 'docente', limit: 10, offset: 0 });
    expect(prisma.grade.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { OR: [{ subjectId: 'mat-1', enrollment: { courseId: 'curso-1' }, period: { academicYearId: 'anio' } }] } }));
  });
});
