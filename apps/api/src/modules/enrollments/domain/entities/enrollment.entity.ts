export interface EnrollmentEntity {
  id: string;
  studentId: string;
  courseId: string;
  academicYearId: string;
  enrollmentDate: Date;
  status: string;
  remarks: string | null;
  student: { id: string; rude: string; firstName: string; lastName: string };
  course: { id: string; name: string; gradeLevel: number; section: string };
  academicYear: { id: string; year: number; name: string };
}
