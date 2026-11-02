import { IsIn, IsOptional } from 'class-validator';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';

export class dtofiltroscorreccionescalificacion extends dtopaginacion {
  @IsOptional()
  @IsIn(['PENDING', 'EXECUTED', 'REJECTED'])
  status?: 'PENDING' | 'EXECUTED' | 'REJECTED';
}
