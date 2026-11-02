import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { gradomaximoregular } from '@academic/academic-domain';
import { turno } from '@academic/shared-types';

export class dtocrearcurso {
  @IsUUID()
  academicYearId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Max(gradomaximoregular)
  gradeLevel: number;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsEnum(turno)
  shift: turno;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxCapacity?: number;
}

export class dtoactualizarcurso {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(gradomaximoregular)
  gradeLevel?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  section?: string;

  @IsOptional()
  @IsEnum(turno)
  shift?: turno;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxCapacity?: number;
}
