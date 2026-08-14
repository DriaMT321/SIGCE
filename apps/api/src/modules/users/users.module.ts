import { Module } from '@nestjs/common';
import { UsersController } from './presentation/controllers/users.controller';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  controllers: [UsersController],
  providers: [
    PermissionsGuard,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    GetUsersUseCase,
  ],
  exports: [GetUsersUseCase, USER_REPOSITORY],
})
export class UsersModule {}
