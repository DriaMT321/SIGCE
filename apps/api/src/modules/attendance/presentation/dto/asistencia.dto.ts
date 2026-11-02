import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { estadoasistencia } from '@academic/shared-types';

export class dtocrearasistencia {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;

  @IsDateString()
  date: string;

  @IsEnum(estadoasistencia)
  status: estadoasistencia;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  justification?: string;
}

export class dtoactualizarasistencia {
  @IsEnum(estadoasistencia)
  status: estadoasistencia;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  justification?: string;
}
