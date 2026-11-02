import { rolusuario } from '@academic/domain-kernel';

export interface usuarioautenticacion {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: rolusuario;
  passwordHash: string;
  passwordSetupPending: boolean;
  credentialVersion: number;
  isActive: boolean;
  deletedAt: Date | null;
}

export interface tokenrenovacionalmacenado {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  revokedAt: Date | null;
  sessionId: string | null;
  session: { id: string; userId: string; revokedAt: Date | null; expiresAt: Date } | null;
  user: usuarioautenticacion;
}

export interface nuevotokenrenovacion {
  userId: string;
  sessionId: string;
  token: string;
  expiresAt: Date;
}

export interface rotaciontokenrenovacion {
  previousTokenId: string;
  now: Date;
  replacement: nuevotokenrenovacion;
}

export interface repositorioautenticacion {
  buscarporcorreo(correoelectronico: string): Promise<usuarioautenticacion | null>;
  buscarporidentificadoryrol(
    rol: string,
    identificador: string,
    identificadorsecundario?: string,
  ): Promise<usuarioautenticacion | null>;
  creartokenrenovacion(token: nuevotokenrenovacion): Promise<void>;
  buscartokenrenovacion(resumentoken: string): Promise<tokenrenovacionalmacenado | null>;
  rotartokenrenovacion(rotacion: rotaciontokenrenovacion): Promise<boolean>;
  revocartokenrenovacion(resumentoken: string, fecharevocacion: Date): Promise<void>;
  esvalidotokenconfiguracioncontrasenaestudiante(entrada: {
    tokenHash: string;
    now: Date;
  }): Promise<boolean>;
  completarconfiguracioncontrasenaestudiante(entrada: {
    tokenHash: string;
    passwordHash: string;
    now: Date;
    ipAddress?: string;
  }): Promise<{ userId: string; studentId: string } | null>;
}

export const tokenrepositorioautenticacion = Symbol('AUTH_REPOSITORY');
