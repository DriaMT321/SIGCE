import { IsOptional, IsUUID } from 'class-validator';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';

export class dtofiltroscalificaciones extends dtopaginacion {
  @IsOptional()
  @IsUUID()
  subjectId?: string;
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  enrollmentId?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsUUID()
  periodId?: string;
}
