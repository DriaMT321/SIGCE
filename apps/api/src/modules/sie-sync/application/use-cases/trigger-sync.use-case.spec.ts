import { Queue } from 'bullmq';
import { EventsGateway } from '../../../../common/websocket/events.gateway';
import { TriggerSieSyncUseCase } from './trigger-sync.use-case';
import { ISieSynchronizationRepository } from '../../domain/repositories/sie-synchronization.repository.interface';

describe('TriggerSieSyncUseCase', () => {
  it('encola todas las calificaciones locales seleccionadas', async () => {
    const repository: jest.Mocked<ISieSynchronizationRepository> = {
      createFromGrades: jest.fn().mockResolvedValue({
        synchronization: { id: 'sync-1' } as never,
        jobs: [
          { synchronizationId: 'sync-1', itemId: 'item-1', studentRude: 'RUDE-1', studentCi: 'CI-1', academicYear: 2026, periodNumber: 1, subjectCode: 'MAT', localGrade: 85 },
          { synchronizationId: 'sync-1', itemId: 'item-2', studentRude: 'RUDE-2', studentCi: 'CI-2', academicYear: 2026, periodNumber: 1, subjectCode: 'LEN', localGrade: 78 },
        ],
      }),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    const queue = { add: jest.fn().mockResolvedValue({ id: 'job-1' }) } as unknown as Queue;
    const gateway = { emitSieSyncProgress: jest.fn(), emitSieSyncQueued: jest.fn() } as unknown as EventsGateway;
    const useCase = new TriggerSieSyncUseCase(gateway, repository, queue);

    const result = await useCase.execute({ syncType: 'GRADES' }, 'user-1');

    expect(queue.add).toHaveBeenCalledTimes(2);
    expect(result).toEqual(expect.objectContaining({ synchronizationId: 'sync-1', totalItems: 2, status: 'QUEUED' }));
    expect(gateway.emitSieSyncQueued).toHaveBeenCalledWith(expect.objectContaining({ synchronizationId: 'sync-1', total: 2 }));
  });

  it('rechaza una sincronización sin calificaciones locales', async () => {
    const repository = { createFromGrades: jest.fn().mockResolvedValue(null), findById: jest.fn(), findAll: jest.fn() } as unknown as ISieSynchronizationRepository;
    const queue = { add: jest.fn() } as unknown as Queue;
    const gateway = { emitSieSyncProgress: jest.fn(), emitSieSyncQueued: jest.fn() } as unknown as EventsGateway;
    const useCase = new TriggerSieSyncUseCase(gateway, repository, queue);

    await expect(useCase.execute({ syncType: 'GRADES' }, 'user-1')).rejects.toThrow('No existen calificaciones locales');
    expect(queue.add).not.toHaveBeenCalled();
  });
});
