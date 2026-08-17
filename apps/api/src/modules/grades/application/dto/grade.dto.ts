import { IsNumber, IsOptional, IsString, IsUUID, Max, Min, MaxLength } from 'class-validator';

export class CreateGradeDto {
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
}

export class UpdateGradeDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  value: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
