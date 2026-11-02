import { turno } from '@academic/domain-kernel';

export class dtocrearcurso {
  academicYearId: string;

  name: string;

  gradeLevel: number;

  section: string;

  shift: turno;

  maxCapacity?: number;
}

export class dtoactualizarcurso {
  name?: string;

  gradeLevel?: number;

  section?: string;

  shift?: turno;

  maxCapacity?: number;
}
