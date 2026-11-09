import { accionauditoria } from './enumeraciones';

export interface eventoactualizacioncalificacion {
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

export interface eventoactualizacionasistencia {
  attendanceId: string;
  studentId: string;
  courseId: string;
  date: string;
  previousStatus: string | null;
  newStatus: string;
  updatedAt: Date;
  ipAddress?: string;
}

export interface eventoactualizacionestudiante {
  studentId: string;
  rude: string;
  ci: string;
  previousData: Record<string, unknown>;
  newData: Record<string, unknown>;
  updatedAt: Date;
  ipAddress?: string;
}

export interface eventoregistroauditoria {
  userId: string;
  action: accionauditoria;
  entity: string;
  entityId: string;
  previousValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
