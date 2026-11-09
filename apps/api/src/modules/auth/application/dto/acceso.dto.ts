export enum roliniciosesion {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  FAMILY = 'FAMILY',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SECRETARY = 'SECRETARY',
}

export class dtoiniciosesion {
  email: string;

  password: string;
}

export class dtotokenrenovacion {
  refreshToken: string;
}

export class dtoiniciosesionporrol {
  role: roliniciosesion;

  identifier: string;

  secret?: string;

  secondaryIdentifier?: string;
}

export class dtoactivarcuentaestudiante {
  activationToken: string;

  newPassword: string;
}
