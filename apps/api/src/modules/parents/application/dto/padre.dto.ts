export class dtocrearfamiliar {
  email: string;

  password: string;

  ci: string;

  firstName: string;

  lastName: string;

  phone: string;

  address?: string;

  occupation?: string;
}

export class dtoactualizarfamiliar {
  email?: string;

  ci?: string;

  firstName?: string;

  lastName?: string;

  phone?: string;

  address?: string;

  occupation?: string;
}
import { tiporelacion } from '../../domain/entities/padre.entity';


export class dtoactualizarvinculofamiliar {
  relationship: tiporelacion;
}
