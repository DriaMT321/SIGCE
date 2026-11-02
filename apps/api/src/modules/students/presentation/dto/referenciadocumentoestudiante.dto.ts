import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class dtocrearreferenciadocumentoestudiante {
  @IsIn(['BIRTH_CERTIFICATE', 'IDENTITY_DOCUMENT', 'RUDE_FORM', 'OTHER'])
  documentType: 'BIRTH_CERTIFICATE' | 'IDENTITY_DOCUMENT' | 'RUDE_FORM' | 'OTHER';

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  reference: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
