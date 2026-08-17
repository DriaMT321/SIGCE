import { Module } from '@nestjs/common';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ATTENDANCE_REPOSITORY } from './domain/repositories/attendance.repository.interface';
import { PrismaAttendanceRepository } from './infrastructure/persistence/prisma-attendance.repository';
import { CreateAttendanceUseCase, ListAttendanceUseCase, UpdateAttendanceUseCase } from './application/use-cases/attendance.use-cases';

@Module({
  controllers: [AttendanceController],
  providers: [PermissionsGuard, { provide: ATTENDANCE_REPOSITORY, useClass: PrismaAttendanceRepository }, ListAttendanceUseCase, CreateAttendanceUseCase, UpdateAttendanceUseCase],
})
export class AttendanceModule {}
