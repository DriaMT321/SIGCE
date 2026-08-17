export interface AttendanceEntity {
  id: string;
  studentId: string;
  courseId: string;
  registeredById: string;
  date: Date;
  status: string;
  justification: string | null;
  student: { id: string; rude: string; firstName: string; lastName: string };
  course: { id: string; name: string; gradeLevel: number; section: string };
}
