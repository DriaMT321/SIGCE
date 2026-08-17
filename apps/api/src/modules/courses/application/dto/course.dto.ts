import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Shift } from '@academic/shared-types';

export class CreateCourseDto {
  @IsUUID()
  academicYearId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Max(12)
  gradeLevel: number;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsEnum(Shift)
  shift: Shift;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxCapacity?: number;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  gradeLevel?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  section?: string;

  @IsOptional()
  @IsEnum(Shift)
  shift?: Shift;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxCapacity?: number;
}
