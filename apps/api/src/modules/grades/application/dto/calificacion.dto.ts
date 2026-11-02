export class dtocrearcalificacion {
  enrollmentId: string;

  studentId: string;

  subjectId: string;

  periodId: string;

  value: number;

  remarks?: string;

  reason?: string;
}

export class dtoactualizarcalificacion {
  value: number;

  remarks?: string;

  reason?: string;
}

export class dtopublicarcalificaciones {
  courseId: string;

  subjectId: string;

  periodId: string;

  reason?: string;
}

export class dtoelementocalificacionmasiva {
  studentId: string;

  enrollmentId: string;

  value: number;

  remarks?: string;
}

export class dtocrearcalificacionesmasivas {
  courseId: string;

  subjectId: string;

  periodId: string;

  grades: dtoelementocalificacionmasiva[];

  reason?: string;
}
