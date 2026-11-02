import { IsIn, IsOptional } from 'class-validator';
import { rolusuario } from '@academic/shared-types';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';

export class dtofiltrosusuarios extends dtopaginacion {
  @IsOptional()
  @IsIn([...Object.values(rolusuario), 'ALL'])
  role?: string;
}
