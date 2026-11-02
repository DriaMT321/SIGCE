import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class dtoresolverdiscrepanciasie {
  @IsIn(['KEEP_SIGCE', 'KEEP_SIE_AS_REFERENCE'])
  decision: 'KEEP_SIGCE' | 'KEEP_SIE_AS_REFERENCE';

  @IsString()
  @MinLength(8, { message: 'La justificación debe tener al menos 8 caracteres' })
  @MaxLength(500)
  reason: string;
}
