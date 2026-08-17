import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { TEACHER_REPOSITORY, TeacherRepository } from '../../domain/repositories/teacher.repository.interface';
import { CreateTeacherDto, UpdateTeacherDto } from '../dto/teacher.dto';

@Injectable()
export class ListTeachersUseCase {
  constructor(@Inject(TEACHER_REPOSITORY) private readonly repository: TeacherRepository) {}
  execute(query: { search?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class CreateTeacherUseCase {
  constructor(@Inject(TEACHER_REPOSITORY) private readonly repository: TeacherRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(dto: CreateTeacherDto, userId: string, ipAddress?: string) {
    const teacher = await this.repository.create(dto);
    await this.audit.execute({ userId, action: AuditAction.CREATE, entity: 'Teacher', entityId: teacher.id, newValue: teacher as unknown as Record<string, unknown>, ipAddress });
    return teacher;
  }
}

@Injectable()
export class UpdateTeacherUseCase {
  constructor(@Inject(TEACHER_REPOSITORY) private readonly repository: TeacherRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, dto: UpdateTeacherDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Docente no encontrado');
    const teacher = await this.repository.update(id, dto);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Teacher', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: teacher as unknown as Record<string, unknown>, ipAddress });
    return teacher;
  }
}
