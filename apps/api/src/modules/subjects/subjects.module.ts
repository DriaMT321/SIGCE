import { Module } from '@nestjs/common';
import { SubjectsController } from './presentation/controllers/subjects.controller';
import { ListSubjectsUseCase } from './application/use-cases/list-subjects.use-case';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({ controllers: [SubjectsController], providers: [PermissionsGuard, ListSubjectsUseCase] })
export class SubjectsModule {}
