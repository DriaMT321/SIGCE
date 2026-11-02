import { servicioprisma } from '../../../../common/database/prisma.service';
import { rolusuario } from '@academic/domain-kernel';
import { repositorioanuncioprisma } from './prismanuncio.repository';

describe('Visibilidad de comunicados personales', () => {
  it('no incluye comunicados dirigidos a otros padres cuando no hay perfil de padre', async () => {
    const prisma = { parent: { findUnique: jest.fn().mockResolvedValue(null) }, announcement: { findMany: jest.fn().mockResolvedValue([]) } } as unknown as servicioprisma;
    await new repositorioanuncioprisma(prisma).buscarvisiblespara({ id: 'usuario', role: rolusuario.PARENT });
    const where = (prisma.announcement.findMany as jest.Mock).mock.calls[0][0].where;
    expect(where.OR).not.toContainEqual(expect.objectContaining({ scope: 'PARENT' }));
  });

  it('limita los comunicados individuales al padre y a sus hijos vinculados', async () => {
    const prisma = { parent: { findUnique: jest.fn().mockResolvedValue({ id: 'padre-1', studentParents: [{ student: { id: 'hijo-1', enrollments: [{ courseId: 'curso-1' }] } }] }) }, announcement: { findMany: jest.fn().mockResolvedValue([]) } } as unknown as servicioprisma;
    await new repositorioanuncioprisma(prisma).buscarvisiblespara({ id: 'usuario', role: rolusuario.PARENT });
    const where = (prisma.announcement.findMany as jest.Mock).mock.calls[0][0].where;
    expect(where.OR).toContainEqual({ scope: 'PARENT', targetParentId: 'padre-1' });
    expect(where.OR).toContainEqual({ scope: 'SPECIFIC_STUDENTS', targetUserIds: { has: 'hijo-1' } });
    expect(where.OR).not.toContainEqual({ scope: 'PARENT', targetParentId: 'padre-ajeno' });
  });

  it('no incluye comunicados de docentes ajenos si no existe perfil docente', async () => {
    const prisma = { teacher: { findUnique: jest.fn().mockResolvedValue(null) }, announcement: { findMany: jest.fn().mockResolvedValue([]) } } as unknown as servicioprisma;
    await new repositorioanuncioprisma(prisma).buscarvisiblespara({ id: 'usuario', role: rolusuario.TEACHER });
    const where = (prisma.announcement.findMany as jest.Mock).mock.calls[0][0].where;
    expect(where.OR).not.toContainEqual(expect.objectContaining({ scope: 'TEACHER' }));
  });
});
