import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { ENROLLMENT_REPOSITORY, EnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../dto/enrollment.dto';

@Injectable()
export class ListEnrollmentsUseCase {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repository: EnrollmentRepository) {}
  execute(query: { academicYearId?: string; courseId?: string; studentId?: string; parentUserId?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class CreateEnrollmentUseCase {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repository: EnrollmentRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(dto: CreateEnrollmentDto, userId: string, ipAddress?: string) {
    const enrollment = await this.repository.create(dto);
    await this.audit.execute({ userId, action: AuditAction.CREATE, entity: 'Enrollment', entityId: enrollment.id, newValue: enrollment as unknown as Record<string, unknown>, ipAddress });
    return enrollment;
  }
}

@Injectable()
export class UpdateEnrollmentUseCase {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repository: EnrollmentRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, dto: UpdateEnrollmentDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Matrícula no encontrada');
    const enrollment = await this.repository.updateStatus(id, dto.status, dto.remarks);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Enrollment', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: enrollment as unknown as Record<string, unknown>, ipAddress });
    return enrollment;
  }
}
