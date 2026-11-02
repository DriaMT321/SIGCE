export class dtocrearreferenciadocumentoestudiante {
  documentType: 'BIRTH_CERTIFICATE' | 'IDENTITY_DOCUMENT' | 'RUDE_FORM' | 'OTHER';

  reference: string;

  notes?: string;
}
