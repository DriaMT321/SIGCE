import { cargatokenautenticacion } from '../modelos/cargatoken.model';
import { usuarioautenticacion } from '../../domain/repositories/autenticacion.repository.interface';

export const tokenemisortokenautenticacion = Symbol('AUTH_TOKEN_ISSUER');

export interface partokens {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

export interface emisortokenspuerto {
  emitirparausuario(
    usuario: Pick<
      usuarioautenticacion,
      'id' | 'email' | 'role' | 'firstName' | 'lastName' | 'credentialVersion'
    >,
    sessionId?: string,
  ): partokens;
  verificartokenrenovacion(token: string): cargatokenautenticacion;
}
