export interface CourseEntity {
  id: string;
  academicYearId: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
  maxCapacity: number;
  academicYear: { id: string; year: number; name: string };
  enrollmentCount: number;
}
