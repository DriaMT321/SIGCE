import { IsString, Length } from 'class-validator';

export class dtoreintentarelementosincronizacionsie {
  @IsString()
  @Length(8, 500)
  reason: string;
}
