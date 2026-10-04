import { Module } from '@nestjs/common';
import { UsersController } from './presentation/controllers/users.controller';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    GetUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
  ],
  exports: [GetUsersUseCase, CreateUserUseCase, UpdateUserUseCase, USER_REPOSITORY],
})
export class UsersModule {}
