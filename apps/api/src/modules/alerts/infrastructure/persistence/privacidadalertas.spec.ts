import { servicioprisma } from '../../../../common/database/prisma.service';
import { contextoidentificadorcorrelacionlocal } from '../../../../core/infrastructure/contextocorrelacion.local';
import { repositorioalertaprisma } from './prismaalerta.repository';

describe('Privacidad de alertas académicas', () => {
  it('limita alertas de estudiantes al vínculo actual y conserva las generales y las administrativas', async () => {
    const prisma = { alert: { findMany: jest.fn().mockResolvedValue([]), count: jest.fn().mockResolvedValue(0) } } as unknown as servicioprisma;
    const repo = new repositorioalertaprisma(prisma, new contextoidentificadorcorrelacionlocal());
    await repo.buscarporusuario('usuario-1', 20, 0);
    const where = (prisma.alert.findMany as jest.Mock).mock.calls[0][0].where;
    expect(where.userId).toBe('usuario-1');
    expect(where.OR).toContainEqual({ studentId: null });
    expect(where.OR).toContainEqual({ user: { role: { in: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'] } } });
    expect(where.OR).toContainEqual({ student: { OR: [{ userId: 'usuario-1' }, { studentParents: { some: { parent: { userId: 'usuario-1' } } } }] } });
    expect(prisma.alert.count).toHaveBeenCalledWith({ where });
  });

  it.each(['lectura', 'estado'])('impide modificar alerta tras desvinculación: %s', async (operacion) => {
    const tx = { $queryRaw: jest.fn().mockResolvedValue([{ id: 'alerta' }]), alert: { findFirst: jest.fn().mockResolvedValue(null), update: jest.fn() }, auditLog: { create: jest.fn() } };
    const prisma = { $transaction: jest.fn((fn: (client: typeof tx) => unknown) => fn(tx)) } as unknown as servicioprisma;
    const repo = new repositorioalertaprisma(prisma, new contextoidentificadorcorrelacionlocal());
    const accion = operacion === 'lectura'
      ? repo.marcarleida('alerta', 'usuario-1', { userId: 'usuario-1' })
      : repo.actualizarestado('alerta', 'usuario-1', 'RESOLVED', { userId: 'usuario-1' });
    await expect(accion).rejects.toMatchObject({ status: 404 });
    expect(tx.alert.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 'usuario-1', OR: expect.arrayContaining([{ student: { OR: [{ userId: 'usuario-1' }, { studentParents: { some: { parent: { userId: 'usuario-1' } } } }] } }]) }) }));
    expect(tx.alert.update).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it('vuelve a comprobar el vínculo durante la modificación', async () => {
    const alerta = { id: 'alerta', userId: 'usuario-1', studentId: 'hijo-1', title: 'Aviso', message: 'Texto', severity: 'INFO', status: 'OPEN', isRead: false, link: null, metadata: null, createdAt: new Date() };
    const tx = { $queryRaw: jest.fn().mockResolvedValue([{ id: 'alerta' }]), alert: { findFirst: jest.fn().mockResolvedValue(alerta), update: jest.fn().mockResolvedValue({ ...alerta, isRead: true }) }, auditLog: { create: jest.fn() } };
    const prisma = { $transaction: jest.fn((fn: (client: typeof tx) => unknown) => fn(tx)) } as unknown as servicioprisma;
    const repo = new repositorioalertaprisma(prisma, new contextoidentificadorcorrelacionlocal());
    await repo.marcarleida('alerta', 'usuario-1', { userId: 'usuario-1' });
    expect(tx.alert.update).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id: 'alerta', userId: 'usuario-1', OR: expect.any(Array) }) }));
  });
});
