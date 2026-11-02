import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';

export class dtofiltrosasistencia extends dtopaginacion {
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
