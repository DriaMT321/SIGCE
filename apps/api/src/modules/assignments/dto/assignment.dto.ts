import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { AssignmentStatus, AssignmentType } from '@prisma/client';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(AssignmentType)
  @IsOptional()
  type?: AssignmentType;

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

export class UpdateAssignmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(AssignmentType)
  @IsOptional()
  type?: AssignmentType;

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

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;
}
