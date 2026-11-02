import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositoriomateriaprisma } from './prismaasignatura.repository';
import { casousolistarmaterias } from '../../application/use-cases/listarasignaturas.use-case';
import type { repositoriomaterias } from '../../domain/repositories/asignatura.repository.interface';

describe('Alcance de materias del docente', () => {
  it('filtra materias por docente, curso y gestión activa', async () => {
    const prisma = { subject: { findMany: jest.fn().mockResolvedValue([]) } } as unknown as servicioprisma;
    await new repositoriomateriaprisma(prisma).buscartodos(undefined, 'docente', 'curso');
    expect(prisma.subject.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {
      teacherSubjects: { some: { teacher: { userId: 'docente', deletedAt: null }, academicYear: { isActive: true }, course: { academicYear: { isActive: true } }, courseId: 'curso' } },
    } }));
  });
  it('no restringe el catálogo de administración', async () => {
    const prisma = { subject: { findMany: jest.fn().mockResolvedValue([]) } } as unknown as servicioprisma;
    await new repositoriomateriaprisma(prisma).buscartodos();
    expect(prisma.subject.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
  });
  it('rechaza consultar materias de un curso ajeno', async () => {
    const buscartodos = jest.fn();
    const repo = { docentetieneasignacion: jest.fn().mockResolvedValue(false), buscartodos } as unknown as repositoriomaterias;
    await expect(new casousolistarmaterias(repo).ejecutar(undefined, 'docente', 'curso-ajeno')).rejects.toMatchObject({ code: 'FORBIDDEN' });
    expect(buscartodos).not.toHaveBeenCalled();
  });
});
