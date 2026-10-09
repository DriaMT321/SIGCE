import { Module } from '@nestjs/common';
import { GradesController } from './presentation/controllers/grades.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { GRADE_REPOSITORY } from './domain/repositories/grade.repository.interface';
import { PrismaGradeRepository } from './infrastructure/persistence/prisma-grade.repository';
import { CreateGradeUseCase, ListGradesUseCase, UpdateGradeUseCase, CreateBulkGradesUseCase } from './application/use-cases/grade.use-cases';

@Module({
  controllers: [GradesController],
  providers: [
    PermissionsGuard,
    { provide: GRADE_REPOSITORY, useClass: PrismaGradeRepository },
    ListGradesUseCase,
    CreateGradeUseCase,
    UpdateGradeUseCase,
    CreateBulkGradesUseCase,
  ],
})
export class GradesModule {}
