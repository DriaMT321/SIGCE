import { estadoasistencia } from '@academic/domain-kernel';

export class dtocrearasistencia {
  studentId: string;

  courseId: string;

  date: string;

  status: estadoasistencia;

  justification?: string;
}

export class dtoactualizarasistencia {
  status: estadoasistencia;

  justification?: string;
}
