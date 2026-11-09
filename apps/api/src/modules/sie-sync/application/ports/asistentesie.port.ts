export const tokenrepositorioasistentesie = Symbol('REPOSITORIO_ASISTENTE_SIE');

export interface datosseleccionasistentesie {
  academicYearId: string;
  courseId: string;
  subjectId: string;
  periodNumber: number;
}

export interface entradaresultadoasistentesie {
  gradeId: string;
  result: 'FILLED' | 'SKIPPED' | 'CONFIRMED_BY_USER' | 'ERROR';
  reason?: string;
}

export interface datosresumenasistentesie extends datosseleccionasistentesie {
  fingerprint: string;
  operationId: string;
  entries: entradaresultadoasistentesie[];
}

export interface actoresumensie {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string;
}

export interface notaasistentesieregistro {
  id: string;
  studentId: string;
  value: number;
  updatedAt: Date;
  publishedAt: Date | null;
  student: {
    rude: string;
    firstName: string;
    lastName: string;
  };
}

export interface contextoasistentesieregistro {
  course: { id: string; name: string } | null;
  subject: { id: string; name: string; code: string } | null;
  period: { id: string; name: string; number: number; isClosed: boolean } | null;
}

export interface registroauditoriaasistentesie {
  id: string;
  createdAt: Date;
  userId: string | null;
  entity: string;
  newValue: unknown;
}

export interface repositorioasistentesie {
  obtenercontexto(filtros: datosseleccionasistentesie): Promise<contextoasistentesieregistro>;
  listarnotaspublicadas(
    filtros: datosseleccionasistentesie,
    periodId: string,
  ): Promise<notaasistentesieregistro[]>;
  resumensha256(contenido: string): string;
  buscarauditoria(operationId: string): Promise<registroauditoriaasistentesie | null>;
  crearauditoria(datos: {
    operationId: string;
    userId: string;
    courseId: string;
    ipAddress?: string;
    userAgent?: string;
    correlationId?: string;
    studentIds: string[];
    newValue: unknown;
    reason: string;
  }): Promise<{ id: string; createdAt: Date }>;
}
