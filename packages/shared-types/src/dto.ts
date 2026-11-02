import { estadosincronizacionsie, rolusuario } from './enumeraciones';

export interface datosprocesosincronizacionsie {
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

export interface resultadosincronizacionsie {
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

export interface contenidotokenjwt {
  sub: string;
  sessionId?: string;
  email: string;
  role: rolusuario;
  firstName: string;
  lastName: string;
  credentialVersion?: number;
}

export interface usuarioautenticado {
  id: string;
  email: string;
  role: rolusuario;
  firstName: string;
  lastName: string;
}
