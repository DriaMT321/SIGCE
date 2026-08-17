import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { GRADE_REPOSITORY, GradeRepository } from '../../domain/repositories/grade.repository.interface';
import { CreateGradeDto, UpdateGradeDto } from '../dto/grade.dto';

@Injectable()
export class ListGradesUseCase {
  constructor(@Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository) {}
  execute(query: { studentId?: string; enrollmentId?: string; periodId?: string; parentUserId?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class CreateGradeUseCase {
  constructor(@Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(dto: CreateGradeDto, userId: string, ipAddress?: string) {
    const grade = await this.repository.create(dto);
    await this.audit.execute({ userId, action: AuditAction.CREATE, entity: 'Grade', entityId: grade.id, newValue: grade as unknown as Record<string, unknown>, ipAddress });
    return grade;
  }
}

@Injectable()
export class UpdateGradeUseCase {
  constructor(@Inject(GRADE_REPOSITORY) private readonly repository: GradeRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, dto: UpdateGradeDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Calificación no encontrada');
    const grade = await this.repository.update(id, dto);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Grade', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: grade as unknown as Record<string, unknown>, ipAddress });
    return grade;
  }
}
