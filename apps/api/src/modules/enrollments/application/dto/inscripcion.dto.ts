import { estadoinscripcion } from '@academic/domain-kernel';

export class dtocrearinscripcion {
  studentId: string;

  courseId: string;

  academicYearId: string;

  remarks?: string;
}

export class dtoactualizarinscripcion {
  status: estadoinscripcion;

  remarks?: string;
}

export class dtoactualizarestadomasivo {
  ids: string[];

  status: estadoinscripcion;
}
