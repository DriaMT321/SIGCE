import { estadocorreccioncalificacion } from '../entities/solicitudcorreccioncalificacion.entity';

export const tokenrepositoriocorreccionescalificacion = Symbol('GRADE_CORRECTION_REPOSITORY');

export interface entidadcorreccioncalificacion {
  id: string;
  gradeId: string;
  requestedById: string;
  decidedById: string | null;
  previousValue: number;
  proposedValue: number;
  reason: string;
  evidenceReference: string;
  decisionReason: string | null;
  status: estadocorreccioncalificacion;
  createdAt: Date;
  decidedAt: Date | null;
  executedAt: Date | null;
  grade: {
    id: string;
    value: number;
    studentId: string;
    subjectId: string;
    periodId: string;
    student: { firstName: string; lastName: string; rude: string };
    subject: { name: string; code: string };
    period: { name: string; number: number; isClosed: boolean };
  };
  requestedBy: { firstName: string; lastName: string };
  decidedBy: { firstName: string; lastName: string } | null;
}

export interface entradacrearcorreccioncalificacion {
  gradeId: string;
  requestedById: string;
  previousValue: number;
  proposedValue: number;
  reason: string;
  evidenceReference: string;
  ipAddress?: string;
}

export interface entradadecidircorreccioncalificacion {
  requestId: string;
  decidedById: string;
  decision: 'EXECUTED' | 'REJECTED';
  decisionReason: string;
  ipAddress?: string;
}

export interface estadodecisioncorreccioncalificacion {
  previousValue: number;
  proposedValue: number;
  reason: string;
  evidenceReference: string;
  status: estadocorreccioncalificacion;
}

export interface repositoriocorreccionescalificacion {
  crear(entrada: entradacrearcorreccioncalificacion): Promise<entidadcorreccioncalificacion>;
  buscarestadodecision(idsolicitud: string): Promise<estadodecisioncorreccioncalificacion | null>;
  buscartodos(consulta: {
    status?: estadocorreccioncalificacion;
    requestedById?: string;
    limit: number;
    offset: number;
  }): Promise<{ items: entidadcorreccioncalificacion[]; total: number }>;
  decidir(entrada: entradadecidircorreccioncalificacion): Promise<entidadcorreccioncalificacion>;
}
