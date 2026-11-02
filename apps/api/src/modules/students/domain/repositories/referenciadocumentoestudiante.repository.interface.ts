export const tokenrepositorioreferenciasdocumentosestudiante = Symbol(
  'STUDENT_DOCUMENT_REFERENCE_REPOSITORY',
);

export type tipodocumentoestudiante =
  'BIRTH_CERTIFICATE' | 'IDENTITY_DOCUMENT' | 'RUDE_FORM' | 'OTHER';

export interface registroreferenciadocumentoestudiante {
  id: string;
  studentId: string;
  documentType: string;
  reference: string;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  createdBy: { id: string; firstName: string; lastName: string };
}

export interface repositorioreferenciasdocumentosestudiante {
  buscarporestudiante(idestudiante: string): Promise<registroreferenciadocumentoestudiante[]>;
  crear(entrada: {
    studentId: string;
    documentType: tipodocumentoestudiante;
    reference: string;
    notes?: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }): Promise<registroreferenciadocumentoestudiante>;
}
