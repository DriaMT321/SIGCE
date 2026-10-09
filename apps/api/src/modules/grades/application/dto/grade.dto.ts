import { Type } from 'class-transformer';
import {
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

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
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

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class BulkGradeItemDto {
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

export class CreateBulkGradesDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  periodId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkGradeItemDto)
  grades: BulkGradeItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

