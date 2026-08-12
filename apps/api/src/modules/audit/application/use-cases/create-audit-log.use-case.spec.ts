import { CreateAuditLogUseCase } from './create-audit-log.use-case';
import { IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { AuditAction } from '@academic/shared-types';

describe('CreateAuditLogUseCase', () => {
  let useCase: CreateAuditLogUseCase;
  let mockRepo: jest.Mocked<IAuditLogRepository>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn().mockImplementation(async (entity: AuditLogEntity) => entity),
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new CreateAuditLogUseCase(mockRepo);
  });

  it('debe registrar un evento de auditoría correctamente', async () => {
    const result = await useCase.execute({
      userId: 'user-123',
      action: AuditAction.UPDATE,
      entity: 'Grade',
      entityId: 'grade-456',
      previousValue: { score: 70 },
      newValue: { score: 85 },
      ipAddress: '127.0.0.1',
    });

    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    expect(result.entity).toBe('Grade');
    expect(result.action).toBe(AuditAction.UPDATE);
    expect(result.previousValue).toEqual({ score: 70 });
    expect(result.newValue).toEqual({ score: 85 });
  });
});
