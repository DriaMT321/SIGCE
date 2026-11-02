import { Equals, IsBoolean, IsInt, IsString, Length, Min } from 'class-validator';
import { dtovistapreviasincronizacionsie } from './siesincronizacionprevisualizacion.dto';

export class dtoiniciarsincronizacionsie extends dtovistapreviasincronizacionsie {
  @IsBoolean()
  @Equals(true, { message: 'Debe confirmar el resumen antes de encolar.' })
  confirmSend: true;

  @IsString()
  @Length(64, 64)
  expectedFingerprint: string;

  @IsInt()
  @Min(1)
  expectedGradeCount: number;
}
