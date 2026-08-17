import { Module } from '@nestjs/common';
import { EnrollmentsController } from './presentation/controllers/enrollments.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ENROLLMENT_REPOSITORY } from './domain/repositories/enrollment.repository.interface';
import { PrismaEnrollmentRepository } from './infrastructure/persistence/prisma-enrollment.repository';
import { CreateEnrollmentUseCase, ListEnrollmentsUseCase, UpdateEnrollmentUseCase } from './application/use-cases/enrollment.use-cases';

@Module({
  controllers: [EnrollmentsController],
  providers: [PermissionsGuard, { provide: ENROLLMENT_REPOSITORY, useClass: PrismaEnrollmentRepository }, ListEnrollmentsUseCase, CreateEnrollmentUseCase, UpdateEnrollmentUseCase],
})
export class EnrollmentsModule {}
