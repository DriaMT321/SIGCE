import { estadosincronizacionsie } from '@academic/domain-kernel';

export interface trabajoprocesamientosie {
  synchronizationId: string;
  itemId: string;
  studentRude: string;
  academicYear: number;
  periodNumber: number;
  subjectCode: string;
  subjectName?: string;
  courseGradeLevel?: number;
  courseSection?: string;
  courseShift?: string;
  localGrade: number;
  correlationId?: string;
  retryCount?: number;
}

export interface resultadoprocesamientosie {
  synchronizationId: string;
  itemId: string;
  studentRude: string;
  localValue: number;
  sieValue: number | null;
  source: 'LOCAL_SIE_SIMULATION' | 'SIE_REAL';
  status: estadosincronizacionsie;
  isMatched: boolean;
  errorMessage?: string;
  verifiedAt: string | null;
  skipped?: boolean;
}
