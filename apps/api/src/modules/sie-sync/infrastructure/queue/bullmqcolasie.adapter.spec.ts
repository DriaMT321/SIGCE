import { Queue } from 'bullmq';
import { adaptadorcolasincronizacionsiebullmq } from './bullmqcolasie.adapter';

const tareadatos = {
  synchronizationId: 'sync-1',
  itemId: 'item-1',
  studentRude: 'RUDE-1',
  academicYear: 2026,
  periodNumber: 1,
  subjectCode: 'MAT',
  localGrade: 85,
};

describe('BullMqSieSyncQueueAdapter', () => {
  it('removes a terminal job before scheduling its manual retry with the stable id', async () => {
    const existente = {
      id: 'item-1',
      getState: jest.fn().mockResolvedValue('failed'),
      remove: jest.fn(),
    };
    const cola = {
      getJob: jest.fn().mockResolvedValue(existente),
      addBulk: jest.fn().mockResolvedValue([{ id: 'item-1' }]),
    } as unknown as Queue;
    const adapter = new adaptadorcolasincronizacionsiebullmq(cola as never);

    const ids = await adapter.encolar([tareadatos]);

    expect(existente.remove).toHaveBeenCalledTimes(1);
    expect(cola.addBulk).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          data: tareadatos,
          opts: expect.objectContaining({
            jobId: 'item-1',
            removeOnComplete: { age: 24 * 60 * 60, count: 1000 },
            removeOnFail: { age: 7 * 24 * 60 * 60, count: 1000 },
          }),
        }),
      ]),
    );
    expect(ids).toEqual(['item-1']);
  });

  it('keeps an active job and does not crear a duplicate', async () => {
    const existente = {
      id: 'item-1',
      getState: jest.fn().mockResolvedValue('active'),
      remove: jest.fn(),
    };
    const cola = {
      getJob: jest.fn().mockResolvedValue(existente),
      addBulk: jest.fn(),
    } as unknown as Queue;
    const adapter = new adaptadorcolasincronizacionsiebullmq(cola as never);

    await expect(adapter.encolar([tareadatos])).resolves.toEqual(['item-1']);
    expect(existente.remove).not.toHaveBeenCalled();
    expect(cola.addBulk).not.toHaveBeenCalled();
  });
});
