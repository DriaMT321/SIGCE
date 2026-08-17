import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '@academic/shared-types';
import { CreateAuditLogUseCase } from '../../../audit/application/use-cases/create-audit-log.use-case';
import { ATTENDANCE_REPOSITORY, AttendanceRepository } from '../../domain/repositories/attendance.repository.interface';
import { CreateAttendanceDto, UpdateAttendanceDto } from '../dto/attendance.dto';

@Injectable()
export class ListAttendanceUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repository: AttendanceRepository) {}
  execute(query: { studentId?: string; courseId?: string; from?: Date; to?: Date; parentUserId?: string; limit: number; offset: number }) { return this.repository.findAll(query); }
}

@Injectable()
export class CreateAttendanceUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repository: AttendanceRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(dto: CreateAttendanceDto, registeredById: string, ipAddress?: string) {
    const attendance = await this.repository.create({ ...dto, date: new Date(dto.date), registeredById });
    await this.audit.execute({ userId: registeredById, action: AuditAction.CREATE, entity: 'Attendance', entityId: attendance.id, newValue: attendance as unknown as Record<string, unknown>, ipAddress });
    return attendance;
  }
}

@Injectable()
export class UpdateAttendanceUseCase {
  constructor(@Inject(ATTENDANCE_REPOSITORY) private readonly repository: AttendanceRepository, private readonly audit: CreateAuditLogUseCase) {}
  async execute(id: string, dto: UpdateAttendanceDto, userId: string, ipAddress?: string) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Registro de asistencia no encontrado');
    const attendance = await this.repository.update(id, dto);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Attendance', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: attendance as unknown as Record<string, unknown>, ipAddress });
    return attendance;
  }
}
