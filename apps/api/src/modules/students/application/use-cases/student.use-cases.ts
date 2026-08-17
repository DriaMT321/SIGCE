import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { StudentCreateData, STUDENT_REPOSITORY, StudentRepository, StudentUpdateData } from '../../domain/repositories/student.repository.interface';
import { CreateStudentDto, UpdateStudentDto } from '../dto/student.dto';

@Injectable()
export class ListStudentsUseCase {
  constructor(@Inject(STUDENT_REPOSITORY) private readonly repository: StudentRepository) {}
  execute(query: { search?: string; parentUserId?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class GetStudentUseCase {
  constructor(@Inject(STUDENT_REPOSITORY) private readonly repository: StudentRepository) {}
  async execute(id: string, parentUserId?: string) {
    const student = await this.repository.findById(id, parentUserId);
    if (!student) throw new NotFoundException('Estudiante no encontrado');
    return student;
  }
}

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(STUDENT_REPOSITORY) private readonly repository: StudentRepository,
    private readonly audit: CreateAuditLogUseCase,
  ) {}
  async execute(dto: CreateStudentDto, userId: string, ipAddress?: string) {
    const data: StudentCreateData = { ...dto, birthDate: new Date(dto.birthDate) };
    const student = await this.repository.create(data);
    await this.audit.execute({ userId, action: AuditAction.CREATE, entity: 'Student', entityId: student.id, newValue: student as unknown as Record<string, unknown>, ipAddress });
    return student;
  }
}

@Injectable()
export class UpdateStudentUseCase {
  constructor(
    @Inject(STUDENT_REPOSITORY) private readonly repository: StudentRepository,
    private readonly audit: CreateAuditLogUseCase,
  ) {}
  async execute(id: string, dto: UpdateStudentDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Estudiante no encontrado');
    const { birthDate, ...fields } = dto;
    const data: StudentUpdateData = { ...fields, ...(birthDate ? { birthDate: new Date(birthDate) } : {}) };
    const student = await this.repository.update(id, data);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Student', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: student as unknown as Record<string, unknown>, ipAddress });
    return student;
  }
}

@Injectable()
export class DeleteStudentUseCase {
  constructor(
    @Inject(STUDENT_REPOSITORY) private readonly repository: StudentRepository,
    private readonly audit: CreateAuditLogUseCase,
  ) {}
  async execute(id: string, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Estudiante no encontrado');
    await this.repository.softDelete(id);
    await this.audit.execute({ userId, action: AuditAction.DELETE, entity: 'Student', entityId: id, previousValue: previous as unknown as Record<string, unknown>, ipAddress });
  }
}
