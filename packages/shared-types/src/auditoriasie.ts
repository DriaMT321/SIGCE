export type origenauditoriasie = 'LOCAL_SIE_SIMULATION' | 'SIE_REAL';
export type estadocomparacionmateriasie =
  'COINCIDE' | 'DISCREPANCIA' | 'SOLO_EN_SIE' | 'SOLO_EN_SIGCE';

export interface comparacioncalificacionmateriasie {
  sieSubject: string;
  sigceSubject?: string;
  sieGrade1T?: number | null;
  sigceGrade1T?: number | null;
  sieGrade2T?: number | null;
  status: estadocomparacionmateriasie;
  diff?: number;
}

export interface resultadocomparacionestudiantesie {
  rude: string;
  studentName: string;
  courseName: string;
  level?: string;
  grade?: string;
  parallel?: string;
  turn?: string;
  comparisons: comparacioncalificacionmateriasie[];
  overallMatch: boolean;
  totalSubjectsMatched: number;
  totalDiscrepancies: number;
  sieAverage: number;
  sigceAverage: number;
}

export interface resumenauditoriasie {
  totalStudents: number;
  totalExactMatches: number;
  totalWithDiscrepancies: number;
  matchPercentage: number;
  sieAverage: number;
  sigceAverage: number;
  auditedCoursesCount: number;
  auditedAt: string;
}

export interface datosrespuestaauditoriasie {
  hasData: boolean;
  summary: resumenauditoriasie | null;
  students: resultadocomparacionestudiantesie[];
  source?: origenauditoriasie | null;
  auditedAt?: string;
  reportFile?: string;
}
