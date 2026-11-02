export interface grade {
  id: string;
  enrollmentId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  remarks: string | null;
  publishedAt: Date | null;
  publishedById: string | null;
  updatedAt: Date;
  student: { id: string; rude: string; firstName: string; lastName: string };
  subject: { id: string; code: string; name: string };
  period: { id: string; name: string; number: number };
}
