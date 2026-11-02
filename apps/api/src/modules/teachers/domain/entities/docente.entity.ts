export interface entidaddocente {
  id: string;
  userId: string;
  ci: string;
  firstName: string;
  lastName: string;
  specialty: string;
  teacherAssignments: Array<{
    id: string;
    courseId: string;
    subjectId: string;
    weeklyPeriods: number | null;
    courseName: string;
    courseGradeLevel: number;
    courseSection: string;
    gradeLevel: number;
    section: string;
    subjectCode: string;
    subjectName: string;
    academicYear: number;
  }>;
  phone: string | null;
  itemNumber: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
