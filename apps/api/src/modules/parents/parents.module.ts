import { Module } from '@nestjs/common';
import { ParentsController } from './presentation/controllers/parents.controller';
import { PARENT_REPOSITORY } from './domain/repositories/parent.repository.interface';
import { PrismaParentRepository } from './infrastructure/persistence/prisma-parent.repository';
import { CreateParentUseCase, ListParentsUseCase, UpdateParentUseCase } from './application/use-cases/parent.use-cases';

@Module({
  controllers: [ParentsController],
  providers: [
    { provide: PARENT_REPOSITORY, useClass: PrismaParentRepository },
    ListParentsUseCase,
    CreateParentUseCase,
    UpdateParentUseCase,
  ],
})
export class ParentsModule {}
