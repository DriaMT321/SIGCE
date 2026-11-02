import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
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
