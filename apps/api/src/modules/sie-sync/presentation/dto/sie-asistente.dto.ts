import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class seleccionasistentesieDto {
  @IsUUID()
  academicYearId: string;

  @IsUUID()
  courseId: string;

  @IsUUID()
  subjectId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  periodNumber: number;
}

export class resultadoasistentesieDto {
  @IsUUID()
  gradeId: string;

  @IsIn(['FILLED', 'SKIPPED', 'CONFIRMED_BY_USER', 'ERROR'])
  result: 'FILLED' | 'SKIPPED' | 'CONFIRMED_BY_USER' | 'ERROR';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class resumenasistentesieDto extends seleccionasistentesieDto {
  @Matches(/^[a-f0-9]{64}$/i)
  fingerprint: string;

  @IsUUID()
  operationId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => resultadoasistentesieDto)
  entries: resultadoasistentesieDto[];
}
