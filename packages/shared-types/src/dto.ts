import { rolusuario } from './enumeraciones';

export interface contenidotokenjwt {
  sub: string;
  sessionId?: string;
  email: string;
  role: rolusuario;
  firstName: string;
  lastName: string;
  credentialVersion?: number;
}

export interface usuarioautenticado {
  id: string;
  email: string;
  role: rolusuario;
  firstName: string;
  lastName: string;
}
