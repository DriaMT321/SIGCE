import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { EnrollmentStatus } from '@academic/shared-types';

export class CreateEnrollmentDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  courseId: string;

  @IsUUID()
  academicYearId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

export class UpdateEnrollmentDto {
  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
