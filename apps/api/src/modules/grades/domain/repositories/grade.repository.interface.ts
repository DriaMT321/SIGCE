import { GradeEntity } from '../entities/grade.entity';

export const GRADE_REPOSITORY = Symbol('GRADE_REPOSITORY');

export interface GradeCreateData {
  enrollmentId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  remarks?: string;
}

export type GradeUpdateData = Partial<Pick<GradeCreateData, 'value' | 'remarks'>>;

export interface GradeRepository {
  findAll(query: { studentId?: string; enrollmentId?: string; periodId?: string; parentUserId?: string; limit: number; offset: number }): Promise<{ items: GradeEntity[]; total: number }>;
  findById(id: string): Promise<GradeEntity | null>;
  create(data: GradeCreateData): Promise<GradeEntity>;
  update(id: string, data: GradeUpdateData): Promise<GradeEntity>;
}
