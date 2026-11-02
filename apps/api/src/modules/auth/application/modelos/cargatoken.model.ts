import { rolusuario } from '@academic/domain-kernel';

export interface cargatokenautenticacion {
  sub: string;
  sessionId?: string;
  email: string;
  role: rolusuario;
  firstName: string;
  lastName: string;
  credentialVersion?: number;
}
