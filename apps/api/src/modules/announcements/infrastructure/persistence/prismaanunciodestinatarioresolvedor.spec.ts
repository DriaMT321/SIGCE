import { alcanceanuncio, rolusuario } from '@academic/shared-types';
import { servicioprisma } from '../../../../common/database/prisma.service';
import { resolvedordestinatariosanuncioprisma } from './prismaanunciodestinatarioresolvedor';

describe('ResolvedorDestinatariosAnuncioPrisma', () => {
  it('incluye estudiantes, familiares y docentes destinatarios de un curso', async () => {
    const prisma = {
      enrollment: {
        findMany: jest.fn().mockResolvedValue([
          {
            student: {
              userId: 'usuario-estudiante',
              studentParents: [{ parent: { userId: 'usuario-familiar' } }],
            },
          },
        ]),
      },
      teacherSubject: {
        findMany: jest.fn().mockResolvedValue([{ teacher: { userId: 'usuario-docente' } }]),
      },
    } as unknown as servicioprisma;
    const resolvedor = new resolvedordestinatariosanuncioprisma(prisma);

    await expect(
      resolvedor.resolverdestinatarios({
        title: 'Aviso',
        content: 'Aviso académico',
        urgency: 'MEDIA',
        scope: alcanceanuncio.COURSE,
        targetCourseId: 'curso-1',
      }),
    ).resolves.toEqual(['usuario-estudiante', 'usuario-familiar', 'usuario-docente']);
  });

  it('considera a las cuentas de estudiantes en comunicados generales', async () => {
    const buscarusuarios = jest.fn().mockResolvedValue([{ id: 'usuario-estudiante' }]);
    const prisma = { user: { findMany: buscarusuarios } } as unknown as servicioprisma;
    const resolvedor = new resolvedordestinatariosanuncioprisma(prisma);

    await expect(
      resolvedor.resolverdestinatarios({
        title: 'Aviso',
        content: 'Aviso general',
        urgency: 'MEDIA',
        scope: alcanceanuncio.ALL_COURSES,
      }),
    ).resolves.toEqual(['usuario-estudiante']);

    expect(buscarusuarios).toHaveBeenCalledWith({
      where: { role: { in: [rolusuario.PARENT, rolusuario.TEACHER, rolusuario.STUDENT] } },
      select: { id: true },
    });
  });
});
