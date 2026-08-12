import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TriggerSieSyncDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de sincronización es requerido' })
  syncType: string; // 'GRADES', 'STUDENTS', 'ATTENDANCE'

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsNumber()
  periodNumber?: number;
}
