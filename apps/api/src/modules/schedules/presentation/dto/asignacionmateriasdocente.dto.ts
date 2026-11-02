import { ArrayMinSize, ArrayUnique, IsArray, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class dtoasignacionmateriasdocente {
  @IsUUID()
  courseId!: string;

  @IsUUID()
  teacherId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  subjectIds!: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  weeklyPeriods?: number | null;
}
