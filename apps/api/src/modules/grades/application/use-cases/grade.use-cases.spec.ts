import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { GradeRepository } from '../../domain/repositories/grade.repository.interface';
import { CreateGradeUseCase } from './grade.use-cases';

describe('CreateGradeUseCase', () => {
  it('persiste la calificación y deja trazabilidad de la creación', async () => {
    const grade = {
      id: 'grade-1',
      enrollmentId: 'enrollment-1',
      studentId: 'student-1',
      subjectId: 'subject-1',
      periodId: 'period-1',
      value: 85,
      remarks: null,
      updatedAt: new Date(),
      student: { id: 'student-1', rude: 'RUDE-1', firstName: 'Ana', lastName: 'Pérez' },
      subject: { id: 'subject-1', code: 'MAT', name: 'Matemática' },
      period: { id: 'period-1', name: '1er Trimestre', number: 1 },
    };
    const repository = { create: jest.fn().mockResolvedValue(grade) } as unknown as GradeRepository;
    const audit = { execute: jest.fn().mockResolvedValue({}) } as unknown as CreateAuditLogUseCase;
    const useCase = new CreateGradeUseCase(repository, audit);

    const result = await useCase.execute({ enrollmentId: 'enrollment-1', studentId: 'student-1', subjectId: 'subject-1', periodId: 'period-1', value: 85 }, 'user-1', '127.0.0.1');

    expect(result).toEqual(grade);
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ value: 85 }));
    expect(audit.execute).toHaveBeenCalledWith(expect.objectContaining({ action: AuditAction.CREATE, entity: 'Grade', entityId: 'grade-1', userId: 'user-1' }));
  });
});
