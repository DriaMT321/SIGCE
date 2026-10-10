import { ParentEntity } from '../entities/parent.entity';

export const PARENT_REPOSITORY = Symbol('PARENT_REPOSITORY');

export interface ParentCreateData {
  email: string;
  password: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  occupation?: string;
}

export type ParentUpdateData = Partial<Omit<ParentCreateData, 'password'>> & { password?: string };

export interface ParentRepository {
  findAll(query: { search?: string; limit: number; offset: number }): Promise<{ items: ParentEntity[]; total: number }>;
  findById(id: string): Promise<ParentEntity | null>;
  create(data: ParentCreateData): Promise<ParentEntity>;
  update(id: string, data: ParentUpdateData): Promise<ParentEntity>;
  softDelete(id: string): Promise<void>;
}
