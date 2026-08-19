import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class TriggerSieSyncDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de sincronización es requerido' })
  syncType: string; // 'GRADES', 'STUDENTS', 'ATTENDANCE'

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  periodNumber?: number;
}
