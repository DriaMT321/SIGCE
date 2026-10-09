import { AuditAction, UserRole } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { GradeRepository } from '../../domain/repositories/grade.repository.interface';
import { CreateGradeUseCase, CreateBulkGradesUseCase } from './grade.use-cases';
import { PrismaService } from '../../../../common/database/prisma.service';

describe('Grade Use Cases', () => {
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

  it('CreateGradeUseCase: persiste la calificación y deja trazabilidad de la creación', async () => {
    const repository = { create: jest.fn().mockResolvedValue(grade) } as unknown as GradeRepository;
    const audit = { execute: jest.fn().mockResolvedValue({}) } as unknown as CreateAuditLogUseCase;
    const useCase = new CreateGradeUseCase(repository, audit);

    const result = await useCase.execute(
      { enrollmentId: 'enrollment-1', studentId: 'student-1', subjectId: 'subject-1', periodId: 'period-1', value: 85 },
      'user-1',
      '127.0.0.1',
    );

    expect(result).toEqual(grade);
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ value: 85 }));
    expect(audit.execute).toHaveBeenCalledWith(
      expect.objectContaining({ action: AuditAction.CREATE, entity: 'Grade', entityId: 'grade-1', userId: 'user-1' }),
    );
  });

  it('CreateGradeUseCase: rechaza el registro si el período está cerrado para rol docente (RN-07, CA-05)', async () => {
    const repository = { create: jest.fn().mockResolvedValue(grade) } as unknown as GradeRepository;
    const audit = { execute: jest.fn().mockResolvedValue({}) } as unknown as CreateAuditLogUseCase;
    const mockPrisma = {
      academicPeriod: {
        findUnique: jest.fn().mockResolvedValue({ id: 'period-1', isClosed: true }),
      },
    } as unknown as PrismaService;

    const useCase = new CreateGradeUseCase(repository, audit, mockPrisma);

    await expect(
      useCase.execute(
        { enrollmentId: 'enrollment-1', studentId: 'student-1', subjectId: 'subject-1', periodId: 'period-1', value: 85 },
        'teacher-1',
        '127.0.0.1',
        UserRole.TEACHER,
      ),
    ).rejects.toThrow('El período de evaluación se encuentra cerrado');
  });

  it('CreateBulkGradesUseCase: procesa y audita carga masiva de calificaciones por curso (RF-20)', async () => {
    const repository = {
      upsertBulk: jest.fn().mockResolvedValue([grade]),
    } as unknown as GradeRepository;
    const audit = { execute: jest.fn().mockResolvedValue({}) } as unknown as CreateAuditLogUseCase;
    const useCase = new CreateBulkGradesUseCase(repository, audit);

    const result = await useCase.execute(
      {
        courseId: 'course-1',
        subjectId: 'subject-1',
        periodId: 'period-1',
        grades: [{ enrollmentId: 'enrollment-1', studentId: 'student-1', value: 90 }],
      },
      'admin-1',
      '127.0.0.1',
      UserRole.ADMIN,
    );

    expect(result.count).toBe(1);
    expect(repository.upsertBulk).toHaveBeenCalled();
    expect(audit.execute).toHaveBeenCalledWith(
      expect.objectContaining({ action: AuditAction.UPDATE, entity: 'GradeBulk' }),
    );
  });
});
