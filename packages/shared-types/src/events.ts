import { SieSyncStatus, AuditAction } from './enums';

export interface GradeUpdatedEvent {
  gradeId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  courseId: string;
  teacherId: string;
  previousValue: number | null;
  newValue: number;
  updatedAt: Date;
  ipAddress?: string;
}

export interface AttendanceUpdatedEvent {
  attendanceId: string;
  studentId: string;
  courseId: string;
  date: string;
  previousStatus: string | null;
  newStatus: string;
  updatedAt: Date;
  ipAddress?: string;
}

export interface StudentUpdatedEvent {
  studentId: string;
  rude: string;
  ci: string;
  previousData: Record<string, unknown>;
  newData: Record<string, unknown>;
  updatedAt: Date;
  ipAddress?: string;
}

export interface SynchronizationRequestedEvent {
  synchronizationId: string;
  requestedById: string;
  type: string;
  totalItems: number;
  createdAt: Date;
}

export interface SynchronizationVerifiedEvent {
  synchronizationId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  localValue: number;
  sieValue: number;
  status: SieSyncStatus;
  verifiedAt: Date;
}

export interface SynchronizationFailedEvent {
  synchronizationId: string;
  itemId?: string;
  reason: string;
  errorDetails?: string;
  failedAt: Date;
}

export interface AuditLogEvent {
  userId: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  previousValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
