import { SieSyncStatus, UserRole } from './enums';

export interface SieSyncJobData {
  synchronizationId: string;
  itemId: string;
  studentRude: string;
  studentCi: string;
  academicYear: number;
  periodNumber: number;
  subjectCode: string;
  localGrade: number;
  retryCount?: number;
}

export interface SieSyncResult {
  synchronizationId: string;
  itemId: string;
  studentRude: string;
  localValue: number;
  sieValue: number;
  status: SieSyncStatus;
  isMatched: boolean;
  errorMessage?: string;
  verifiedAt: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}
