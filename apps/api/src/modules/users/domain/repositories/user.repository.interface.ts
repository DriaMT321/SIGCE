import { UserEntity } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../application/dto/create-user.dto';

export interface IUserRepository {
  findAll(params?: { role?: string; search?: string; limit?: number; offset?: number }): Promise<{ items: UserEntity[]; total: number }>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserDto & { passwordHash: string }): Promise<UserEntity>;
  update(id: string, data: UpdateUserDto & { passwordHash?: string }): Promise<UserEntity>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
