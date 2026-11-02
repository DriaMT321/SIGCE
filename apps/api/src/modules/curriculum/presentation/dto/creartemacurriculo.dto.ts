import { IsInt, IsOptional, IsString, IsUUID, Min, Max, Matches, MinLength } from 'class-validator';

export class dtocreartemacurricular {
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @IsUUID()
  subjectId: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(14)
  gradeLevel?: number;

  @IsInt()
  @Min(1)
  @Max(3)
  periodNumber: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Matches(/\S/)
  campo?: string;

  @IsString()
  @MinLength(1)
  @Matches(/\S/)
  unitTitle: string;

  @IsString()
  @MinLength(1)
  @Matches(/\S/)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
