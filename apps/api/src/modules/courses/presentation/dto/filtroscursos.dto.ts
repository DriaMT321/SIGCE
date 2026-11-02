import { IsOptional, IsUUID } from 'class-validator';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';

export class dtofiltroscursos extends dtopaginacion {
  @IsOptional()
  @IsUUID()
  academicYearId?: string;
}
