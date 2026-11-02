export class dtocrearperiodo {
  academicYearId: string;
  name: string;
  number: number;
  startDate: string;
  endDate: string;
}

export class dtoactualizarperiodo {
  name?: string;

  isClosed?: boolean;

  confirmClose?: boolean;

  expectedGradeCount?: number;

  startDate?: string;

  endDate?: string;
}
