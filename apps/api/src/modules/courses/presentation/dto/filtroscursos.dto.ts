import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';

export class dtofiltroscursos extends dtopaginacion {
  @IsOptional()
  @IsUUID()
  academicYearId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onlyAssigned?: boolean;
}
