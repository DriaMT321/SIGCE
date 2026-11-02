import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class dtocrearcalificacion {
  @IsUUID()
  enrollmentId: string;

  @IsUUID()
  studentId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  periodId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class dtoactualizarcalificacion {
  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class dtoelementocalificacionmasiva {
  @IsUUID()
  studentId: string;

  @IsUUID()
  enrollmentId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

export class dtocrearcalificacionesmasivas {
  @IsUUID()
  courseId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  periodId: string;

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => dtoelementocalificacionmasiva)
  grades: dtoelementocalificacionmasiva[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class dtopublicarcalificaciones {
  @IsUUID()
  courseId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  periodId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
