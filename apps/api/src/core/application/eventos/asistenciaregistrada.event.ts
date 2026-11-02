export interface asistenciaregistrada {
  readonly type: 'attendance.registered';
  readonly attendanceId: string;
  readonly studentId: string;
  readonly courseId: string;
  readonly date: string;
  readonly status: string;
}
