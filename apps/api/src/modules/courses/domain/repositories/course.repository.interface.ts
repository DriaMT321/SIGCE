import { CourseEntity } from '../entities/course.entity';

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export interface CourseCreateData {
  academicYearId: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
  maxCapacity?: number;
}

export type CourseUpdateData = Partial<Omit<CourseCreateData, 'academicYearId'>>;

export interface CourseRepository {
  findAll(query: { academicYearId?: string; search?: string; limit: number; offset: number }): Promise<{ items: CourseEntity[]; total: number }>;
  findById(id: string): Promise<CourseEntity | null>;
  create(data: CourseCreateData): Promise<CourseEntity>;
  update(id: string, data: CourseUpdateData): Promise<CourseEntity>;
  delete(id: string): Promise<void>;
}
