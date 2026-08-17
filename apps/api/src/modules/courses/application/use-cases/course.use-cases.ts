import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { COURSE_REPOSITORY, CourseCreateData, CourseRepository, CourseUpdateData } from '../../domain/repositories/course.repository.interface';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';

@Injectable()
export class ListCoursesUseCase {
  constructor(@Inject(COURSE_REPOSITORY) private readonly repository: CourseRepository) {}
  execute(query: { academicYearId?: string; search?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class GetCourseUseCase {
  constructor(@Inject(COURSE_REPOSITORY) private readonly repository: CourseRepository) {}
  async execute(id: string) {
    const course = await this.repository.findById(id);
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }
}

@Injectable()
export class CreateCourseUseCase {
  constructor(@Inject(COURSE_REPOSITORY) private readonly repository: CourseRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(dto: CreateCourseDto, userId: string, ipAddress?: string) {
    const data: CourseCreateData = dto;
    const course = await this.repository.create(data);
    await this.audit.execute({ userId, action: AuditAction.CREATE, entity: 'Course', entityId: course.id, newValue: course as unknown as Record<string, unknown>, ipAddress });
    return course;
  }
}

@Injectable()
export class UpdateCourseUseCase {
  constructor(@Inject(COURSE_REPOSITORY) private readonly repository: CourseRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, dto: UpdateCourseDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Curso no encontrado');
    const data: CourseUpdateData = dto;
    const course = await this.repository.update(id, data);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Course', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: course as unknown as Record<string, unknown>, ipAddress });
    return course;
  }
}

@Injectable()
export class DeleteCourseUseCase {
  constructor(@Inject(COURSE_REPOSITORY) private readonly repository: CourseRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Curso no encontrado');
    await this.repository.delete(id);
    await this.audit.execute({ userId, action: AuditAction.DELETE, entity: 'Course', entityId: id, previousValue: previous as unknown as Record<string, unknown>, ipAddress });
  }
}
