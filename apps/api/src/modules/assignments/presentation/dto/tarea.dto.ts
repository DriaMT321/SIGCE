import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { estadoasignacion, tipoasignacion } from '@academic/shared-types';

export class dtocreartarea {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(tipoasignacion)
  @IsOptional()
  type?: tipoasignacion;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  maxScore?: number;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsOptional()
  teacherId?: string;
}

export class dtoactualizartarea {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(tipoasignacion)
  @IsOptional()
  type?: tipoasignacion;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  maxScore?: number;

  @IsEnum(estadoasignacion)
  @IsOptional()
  status?: estadoasignacion;
}

export class dtocalificacionestudiante {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  score?: number | null;

  @IsString()
  @IsOptional()
  feedback?: string | null;

  @IsString()
  @IsOptional()
  status?: string;
}

export class dtoguardarcalificacioneslote {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => dtocalificacionestudiante)
  grades: dtocalificacionestudiante[];
}
