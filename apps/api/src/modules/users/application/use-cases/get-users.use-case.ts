import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(params?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: UserEntity[]; total: number }> {
    return this.userRepo.findAll(params);
  }
}
