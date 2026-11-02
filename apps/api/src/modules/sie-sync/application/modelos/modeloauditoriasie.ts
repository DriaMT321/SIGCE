export interface comparacioncalificacionmateria {
  sieSubject: string;
  sigceSubject?: string;
  sieGrade1T?: number | null;
  sigceGrade1T?: number | null;
  sieGrade2T?: number | null;
  status: 'COINCIDE' | 'DISCREPANCIA' | 'SOLO_EN_SIE' | 'SOLO_EN_SIGCE';
  diff?: number;
}

export interface resultadocomparacionestudiante {
  rude: string;
  studentName: string;
  courseName: string;
  level?: string;
  grade?: string;
  parallel?: string;
  turn?: string;
  comparisons: comparacioncalificacionmateria[];
  overallMatch: boolean;
  totalSubjectsMatched: number;
  totalDiscrepancies: number;
  sieAverage: number;
  sigceAverage: number;
}

export interface resumenauditoria {
  totalStudents: number;
  totalExactMatches: number;
  totalWithDiscrepancies: number;
  matchPercentage: number;
  sieAverage: number;
  sigceAverage: number;
  auditedCoursesCount: number;
  auditedAt: string;
}

export interface datosultimaauditoria {
  hasData: boolean;
  summary: resumenauditoria | null;
  students: resultadocomparacionestudiante[];
  auditedAt?: string;
  reportFile?: string;
}
