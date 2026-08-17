import { Module } from '@nestjs/common';
import { TeachersController } from './presentation/controllers/teachers.controller';
import { TEACHER_REPOSITORY } from './domain/repositories/teacher.repository.interface';
import { PrismaTeacherRepository } from './infrastructure/persistence/prisma-teacher.repository';
import { CreateTeacherUseCase, ListTeachersUseCase, UpdateTeacherUseCase } from './application/use-cases/teacher.use-cases';

@Module({
  controllers: [TeachersController],
  providers: [
    { provide: TEACHER_REPOSITORY, useClass: PrismaTeacherRepository },
    ListTeachersUseCase,
    CreateTeacherUseCase,
    UpdateTeacherUseCase,
  ],
})
export class TeachersModule {}
