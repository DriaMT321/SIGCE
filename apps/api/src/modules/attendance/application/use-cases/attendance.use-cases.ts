import { ForbiddenException, Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { AuditAction, UserRole } from '@academic/shared-types';
import { PrismaService } from '../../../../common/database/prisma.service';
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
  constructor(
    @Inject(ATTENDANCE_REPOSITORY) private readonly repository: AttendanceRepository,
    private readonly audit: CreateAuditLogUseCase,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async execute(dto: CreateAttendanceDto, registeredById: string, ipAddress?: string, userRole?: UserRole) {
    if (this.prisma && userRole === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({ where: { userId: registeredById } });
      if (teacher) {
        const assignment = await this.prisma.teacherSubject.findFirst({
          where: { teacherId: teacher.id, courseId: dto.courseId },
        });
        if (!assignment) {
          throw new ForbiddenException('El docente no tiene asignación académica autorizada para este curso.');
        }
      }
    }

    const attendance = await this.repository.create({ ...dto, date: new Date(dto.date), registeredById });
    await this.audit.execute({ userId: registeredById, action: AuditAction.CREATE, entity: 'Attendance', entityId: attendance.id, newValue: attendance as unknown as Record<string, unknown>, ipAddress });
    return attendance;
  }
}

@Injectable()
export class UpdateAttendanceUseCase {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY) private readonly repository: AttendanceRepository,
    private readonly audit: CreateAuditLogUseCase,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async execute(id: string, dto: UpdateAttendanceDto, userId: string, ipAddress?: string, userRole?: UserRole) {
    const previous = await this.repository.findById(id);
    if (!previous) throw new NotFoundException('Registro de asistencia no encontrado');

    if (this.prisma && userRole === UserRole.TEACHER) {
      const teacher = await this.prisma.teacher.findUnique({ where: { userId } });
      if (teacher) {
        const assignment = await this.prisma.teacherSubject.findFirst({
          where: { teacherId: teacher.id, courseId: previous.courseId },
        });
        if (!assignment) {
          throw new ForbiddenException('El docente no tiene asignación académica autorizada para este curso.');
        }
      }
    }

    const attendance = await this.repository.update(id, dto);
    await this.audit.execute({ userId, action: AuditAction.UPDATE, entity: 'Attendance', entityId: id, previousValue: previous as unknown as Record<string, unknown>, newValue: attendance as unknown as Record<string, unknown>, ipAddress });
    return attendance;
  }
}
