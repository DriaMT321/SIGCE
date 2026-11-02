import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositoriocursoprisma } from './prismacurso.repository';
import { casousoobtenercurso } from '../../application/use-cases/curso.use-cases';
import type { repositoriocursos } from '../../domain/repositories/curso.repository.interface';

describe('Alcance de cursos del docente', () => {
  it('limita la consulta y el total a asignaciones de la gestión activa', async () => {
    const prisma = { course: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) } } as unknown as servicioprisma;
    await new repositoriocursoprisma(prisma).buscartodos({ teacherUserId: 'docente', limit: 10, offset: 0 });
    const where = { academicYear: { isActive: true }, teacherSubjects: { some: { teacher: { userId: 'docente', deletedAt: null }, academicYear: { isActive: true } } } };
    expect(prisma.course.findMany).toHaveBeenCalledWith(expect.objectContaining({ where }));
    expect(prisma.course.count).toHaveBeenCalledWith({ where });
  });

  it('no aplica restricciones a la administración', async () => {
    const prisma = { course: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) } } as unknown as servicioprisma;
    await new repositoriocursoprisma(prisma).buscartodos({ limit: 10, offset: 0 });
    expect(prisma.course.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
  });

  it('rechaza con FORBIDDEN acceder directamente a un curso ajeno', async () => {
    const buscarporidentificador = jest.fn();
    const repo = { docentetieneasignacion: jest.fn().mockResolvedValue(false), buscarporidentificador } as unknown as repositoriocursos;
    await expect(new casousoobtenercurso(repo).ejecutar('curso-ajeno', 'docente')).rejects.toMatchObject({ code: 'FORBIDDEN' });
    expect(buscarporidentificador).not.toHaveBeenCalled();
  });
});
