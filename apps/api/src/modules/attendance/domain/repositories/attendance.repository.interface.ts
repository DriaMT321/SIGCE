import { AttendanceEntity } from '../entities/attendance.entity';

export const ATTENDANCE_REPOSITORY = Symbol('ATTENDANCE_REPOSITORY');

export interface AttendanceCreateData {
  studentId: string;
  courseId: string;
  registeredById: string;
  date: Date;
  status: string;
  justification?: string;
}

export type AttendanceUpdateData = Pick<AttendanceCreateData, 'status' | 'justification'>;

export interface AttendanceRepository {
  findAll(query: { studentId?: string; courseId?: string; from?: Date; to?: Date; parentUserId?: string; limit: number; offset: number }): Promise<{ items: AttendanceEntity[]; total: number }>;
  findById(id: string): Promise<AttendanceEntity | null>;
  create(data: AttendanceCreateData): Promise<AttendanceEntity>;
  update(id: string, data: AttendanceUpdateData): Promise<AttendanceEntity>;
}
