export interface StudentEntity {
  id: string;
  rude: string;
  ci: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  enrollments: Array<{
    id: string;
    status: string;
    course: { id: string; name: string; gradeLevel: number; section: string };
    academicYear: { id: string; year: number; name: string };
  }>;
}
