import { Module } from '@nestjs/common';
import { CoursesController } from './presentation/controllers/courses.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { COURSE_REPOSITORY } from './domain/repositories/course.repository.interface';
import { PrismaCourseRepository } from './infrastructure/persistence/prisma-course.repository';
import { CreateCourseUseCase, DeleteCourseUseCase, GetCourseUseCase, ListCoursesUseCase, UpdateCourseUseCase } from './application/use-cases/course.use-cases';

@Module({
  controllers: [CoursesController],
  providers: [
    PermissionsGuard,
    { provide: COURSE_REPOSITORY, useClass: PrismaCourseRepository },
    ListCoursesUseCase,
    GetCourseUseCase,
    CreateCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
  ],
})
export class CoursesModule {}
