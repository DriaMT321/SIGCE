import { Module } from '@nestjs/common';
import { StudentsController } from './presentation/controllers/students.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { STUDENT_REPOSITORY } from './domain/repositories/student.repository.interface';
import { PrismaStudentRepository } from './infrastructure/persistence/prisma-student.repository';
import { CreateStudentUseCase, DeleteStudentUseCase, GetStudentUseCase, ListStudentsUseCase, UpdateStudentUseCase } from './application/use-cases/student.use-cases';

@Module({
  controllers: [StudentsController],
  providers: [
    PermissionsGuard,
    { provide: STUDENT_REPOSITORY, useClass: PrismaStudentRepository },
    ListStudentsUseCase,
    GetStudentUseCase,
    CreateStudentUseCase,
    UpdateStudentUseCase,
    DeleteStudentUseCase,
  ],
})
export class StudentsModule {}
