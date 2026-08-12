import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findAll(params?: { role?: string; limit?: number; offset?: number }): Promise<{ items: UserEntity[]; total: number }>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
