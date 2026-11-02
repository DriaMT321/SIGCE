export interface datoscreacioncalificacion {
  enrollmentId: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  remarks?: string;
}

export type datosactualizacioncalificacion = Partial<Pick<datoscreacioncalificacion, 'value'>> & {
  remarks?: string | null;
};
