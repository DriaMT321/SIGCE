import { IsIn, IsOptional } from 'class-validator';
import { dtopaginacionsinbusqueda } from '../../../../common/dto/paginacion.dto';

export class dtofiltrosalertas extends dtopaginacionsinbusqueda {
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}
