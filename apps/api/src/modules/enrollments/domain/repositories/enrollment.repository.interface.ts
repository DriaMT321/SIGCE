import { EnrollmentEntity } from '../entities/enrollment.entity';

export const ENROLLMENT_REPOSITORY = Symbol('ENROLLMENT_REPOSITORY');

export interface EnrollmentCreateData {
  studentId: string;
  courseId: string;
  academicYearId: string;
  enrollmentDate?: Date;
  remarks?: string;
}

export interface EnrollmentRepository {
  findAll(query: { academicYearId?: string; courseId?: string; studentId?: string; parentUserId?: string; limit: number; offset: number }): Promise<{ items: EnrollmentEntity[]; total: number }>;
  findById(id: string): Promise<EnrollmentEntity | null>;
  create(data: EnrollmentCreateData): Promise<EnrollmentEntity>;
  updateStatus(id: string, status: string, remarks?: string): Promise<EnrollmentEntity>;
}
