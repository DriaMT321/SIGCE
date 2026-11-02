import { servicioprisma } from '../../../../common/database/prisma.service';
import { repositorioregistroauditoriaprisma } from './prismaregistroauditoria.repository';

describe('PrismaAuditLogRepository', () => {
  it('filters audit eventos by entity id for report publication recovery', async () => {
    const buscarmany = jest.fn().mockResolvedValue([]);
    const cantidad = jest.fn().mockResolvedValue(0);
    const prisma = {
      auditLog: { findMany: buscarmany, count: cantidad },
    } as unknown as servicioprisma;
    const repositorio = new repositorioregistroauditoriaprisma(prisma);

    await repositorio.buscartodos({ entity: 'SieGradeAudit', entityId: 'report.json', limit: 20 });

    expect(buscarmany).toHaveBeenCalledWith({
      where: { entity: 'SieGradeAudit', entityId: 'report.json' },
      take: 20,
      skip: 0,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    expect(cantidad).toHaveBeenCalledWith({
      where: { entity: 'SieGradeAudit', entityId: 'report.json' },
    });
  });
});
