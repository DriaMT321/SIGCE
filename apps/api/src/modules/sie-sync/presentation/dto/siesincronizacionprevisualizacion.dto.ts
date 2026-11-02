import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class dtovistapreviasincronizacionsie {
  @IsUUID()
  academicYearId: string;

  @IsInt()
  @Min(1)
  @Max(3)
  periodNumber: number;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsUUID()
  subjectId?: string;
}
