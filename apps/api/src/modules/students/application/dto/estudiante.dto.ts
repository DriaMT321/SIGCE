import { genero, tiporelacion } from '@academic/domain-kernel';

export class dtocrearestudiante {
  rude: string;

  ci: string;

  firstName: string;

  lastName: string;

  birthDate: string;

  gender: genero;

  address?: string;

  phone?: string;

  parentId?: string;

  relationship?: tiporelacion;
}

export class dtoactualizarestudiante {
  rude?: string;

  ci?: string;

  firstName?: string;

  lastName?: string;

  birthDate?: string;

  gender?: genero;

  address?: string;

  phone?: string;

  parentId?: string;

  relationship?: tiporelacion;
}
