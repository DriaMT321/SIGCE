import { StudentEntity } from '../entities/student.entity';

export const STUDENT_REPOSITORY = Symbol('STUDENT_REPOSITORY');

export interface StudentCreateData {
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  address?: string;
  phone?: string;
  parentId?: string;
  relationship?: string;
}

export type StudentUpdateData = Partial<StudentCreateData>;

export interface StudentRepository {
  findAll(query: { search?: string; parentUserId?: string; limit: number; offset: number }): Promise<{ items: StudentEntity[]; total: number }>;
  findById(id: string, parentUserId?: string): Promise<StudentEntity | null>;
  create(data: StudentCreateData): Promise<StudentEntity>;
  update(id: string, data: StudentUpdateData): Promise<StudentEntity>;
  softDelete(id: string): Promise<void>;
}
