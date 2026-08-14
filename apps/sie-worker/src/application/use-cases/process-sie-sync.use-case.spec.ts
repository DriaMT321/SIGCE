import { ProcessSieSyncUseCase } from './process-sie-sync.use-case';
import { ISieAutomationPort } from '../../domain/ports/sie-automation.port';
import { SieSyncStatus } from '@academic/shared-types';
import { PrismaClient } from '@prisma/client';

describe('ProcessSieSyncUseCase', () => {
  let useCase: ProcessSieSyncUseCase;
  let mockPort: jest.Mocked<ISieAutomationPort>;
  let mockPrisma: {
    sieSynchronizationItem: { update: jest.Mock };
    sieSynchronization: { update: jest.Mock };
    auditLog: { create: jest.Mock };
  };

  beforeEach(() => {
    mockPort = {
      initialize: jest.fn(),
      processGradeSynchronization: jest.fn().mockResolvedValue({
        synchronizationId: 'sync-1',
        itemId: 'item-1',
        studentRude: '807300012024001',
        localValue: 85,
        sieValue: 85,
        status: SieSyncStatus.VERIFIED,
        isMatched: true,
        verifiedAt: new Date().toISOString(),
      }),
      close: jest.fn(),
      runControlledDiagnosticTest: jest.fn(),
    };

    mockPrisma = {
      sieSynchronizationItem: {
        update: jest.fn().mockResolvedValue({}),
      },
      sieSynchronization: {
        update: jest.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    useCase = new ProcessSieSyncUseCase(mockPort, mockPrisma as unknown as PrismaClient);
  });

  it('debe procesar la sincronización y actualizar el estado en BD y registrar auditoría', async () => {
    const result = await useCase.execute({
      synchronizationId: 'sync-1',
      itemId: 'item-1',
      studentRude: '807300012024001',
      studentCi: '10023456',
      academicYear: 2026,
      periodNumber: 1,
      subjectCode: 'MAT-SEC',
      localGrade: 85,
    });

    expect(mockPort.processGradeSynchronization).toHaveBeenCalledTimes(1);
    expect(mockPrisma.sieSynchronizationItem.update).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).toHaveBeenCalled();
    expect(result.status).toBe(SieSyncStatus.VERIFIED);
    expect(result.isMatched).toBe(true);
  });
});
