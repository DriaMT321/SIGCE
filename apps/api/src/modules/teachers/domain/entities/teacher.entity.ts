export interface TeacherEntity {
  id: string;
  userId: string;
  ci: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string | null;
  itemNumber: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
