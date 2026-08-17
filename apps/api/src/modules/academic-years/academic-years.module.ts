import { Module } from '@nestjs/common';
import { AcademicYearsController } from './presentation/controllers/academic-years.controller';
import { ListAcademicYearsUseCase } from './application/use-cases/list-academic-years.use-case';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({ controllers: [AcademicYearsController], providers: [PermissionsGuard, ListAcademicYearsUseCase] })
export class AcademicYearsModule {}
