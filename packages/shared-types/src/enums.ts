export enum UserRole {
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  SECRETARY = 'SECRETARY',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRANSFERRED = 'TRANSFERRED',
  GRADUATED = 'GRADUATED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  JUSTIFIED = 'JUSTIFIED',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
}

export enum SieSyncStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SYNC_SIE = 'SYNC_SIE',
  VERIFY_SIE = 'VERIFY_SIE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Shift {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export enum RelationshipType {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  GUARDIAN = 'GUARDIAN',
  TUTOR = 'TUTOR',
  OTHER = 'OTHER',
}
