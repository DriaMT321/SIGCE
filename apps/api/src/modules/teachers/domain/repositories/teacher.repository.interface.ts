import { TeacherEntity } from '../entities/teacher.entity';

export const TEACHER_REPOSITORY = Symbol('TEACHER_REPOSITORY');

export interface TeacherCreateData {
  email: string;
  password: string;
  ci: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone?: string;
  itemNumber?: string;
}

export type TeacherUpdateData = Partial<Omit<TeacherCreateData, 'password'>> & { password?: string };

export interface TeacherRepository {
  findAll(query: { search?: string; limit: number; offset: number }): Promise<{ items: TeacherEntity[]; total: number }>;
  findById(id: string): Promise<TeacherEntity | null>;
  create(data: TeacherCreateData): Promise<TeacherEntity>;
  update(id: string, data: TeacherUpdateData): Promise<TeacherEntity>;
  softDelete(id: string): Promise<void>;
}
