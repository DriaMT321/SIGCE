import { IsString, Length } from 'class-validator';

export class dtoreanudarsincronizacionsie {
  @IsString()
  @Length(8, 500)
  reason: string;
}
