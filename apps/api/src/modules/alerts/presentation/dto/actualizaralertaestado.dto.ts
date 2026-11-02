import { IsIn } from 'class-validator';

export class dtoactualizarestadoalerta {
  @IsIn(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}
