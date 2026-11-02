export type clavereglaalerta = 'LOW_GRADE' | 'REPEATED_ABSENCE' | 'REPEATED_LATENESS';
export type valorgravedadalerta = 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';

export interface entidadreglaalerta {
  key: clavereglaalerta;
  enabled: boolean;
  severity: valorgravedadalerta;
  gradeThreshold: number | null;
  absenceThreshold: number | null;
  absenceWindowDays: number | null;
  updatedAt: Date;
}

export interface actualizacionreglaalerta {
  key: clavereglaalerta;
  enabled: boolean;
  severity: valorgravedadalerta;
  gradeThreshold?: number;
  absenceThreshold?: number;
  absenceWindowDays?: number;
}
