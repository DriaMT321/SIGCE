import { rolusuario } from '@academic/domain-kernel';

export class dtocrearusuario {
  email: string;

  password: string;

  firstName: string;

  lastName: string;

  role: rolusuario;
}

export class dtoactualizarusuario {
  firstName?: string;

  lastName?: string;

  isActive?: boolean;
}
