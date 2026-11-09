export interface SigceGrade {
  gradeId: string;
  studentId: string;
  rude: string;
  firstName: string;
  lastName: string;
  value: number;
}

export interface GradePlan {
  course: { id: string; name: string };
  subject: { id: string; name: string; code: string };
  period: { number: number; name: string };
  grades: SigceGrade[];
  fingerprint: string;
}

export interface PlanFilters {
  academicYearId: string;
  courseId: string;
  subjectId: string;
  periodNumber: number;
}

export type EntryResult = 'FILLED' | 'SKIPPED' | 'CONFIRMED_BY_USER' | 'ERROR';

export interface SummaryEntry {
  gradeId: string;
  result: EntryResult;
  reason?: string;
}

export type PortalRequest =
  | { kind: 'SIGCE_INSPECT'; expectedCourse?: string }
  | {
      kind: 'SIGCE_FILL';
      grade: SigceGrade;
      course: GradePlan['course'];
      subject: GradePlan['subject'];
      period: GradePlan['period'];
      subjectAlias?: string;
      allowOverwrite?: boolean;
    }
  | { kind: 'SIGCE_RESET' };

export type PortalResponse =
  | { ok: true; status: 'READY'; course: string; studentCount: number }
  | { ok: true; status: 'FILLED' | 'ALREADY_EQUAL'; gradeId: string; detail: string }
  | { ok: false; status: 'CONFLICT' | 'ERROR'; gradeId?: string; detail: string };

export interface SavedMessage {
  kind: 'SIGCE_SAVE_OBSERVED';
  gradeId: string;
  detail: string;
}
