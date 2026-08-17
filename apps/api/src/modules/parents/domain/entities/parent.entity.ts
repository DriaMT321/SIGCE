export interface ParentEntity {
  id: string;
  userId: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  address: string | null;
  occupation: string | null;
  students: Array<{ id: string; rude: string; firstName: string; lastName: string }>;
  createdAt: Date;
  updatedAt: Date;
}
