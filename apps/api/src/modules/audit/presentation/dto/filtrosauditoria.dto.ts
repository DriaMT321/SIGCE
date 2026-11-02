import { IsOptional, IsString, MaxLength } from 'class-validator';
import { dtopaginacionsinbusqueda } from '../../../../common/dto/paginacion.dto';

export class dtofiltrosauditoria extends dtopaginacionsinbusqueda {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  entity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  userId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  correlationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  studentId?: string;
}
