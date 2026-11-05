import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
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

export class dtoregistroasistenciaindividual {
  @IsUUID()
  studentId: string;

  @IsEnum(estadoasistencia)
  status: estadoasistencia;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  justification?: string;
}

export class dtoregistroasistenciaclase {
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsString()
  subjectName?: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => dtoregistroasistenciaindividual)
  attendances: dtoregistroasistenciaindividual[];
}

export class dtosolicitarjustificacion {
  @IsString()
  @MaxLength(1000)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  attachmentName?: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsString()
  subjectName?: string;
}

export class dtoresolverjustificacion {
  @IsIn(['APPROVE', 'REJECT'])
  decision: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNotes?: string;
}
