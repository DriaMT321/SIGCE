import { rolusuario } from '@academic/domain-kernel';

export const tokenrepositoriocredencialesusuario = Symbol('USER_CREDENTIAL_REPOSITORY');

export interface ordenrestablecercontrasenausuario {
  userId: string;
  passwordHash: string;
  actorUserId: string;
  actorRole: rolusuario;
  ipAddress?: string;
}

export interface repositoriocredencialesusuario {
  restablecercontrasenayregistrarauditoria(orden: ordenrestablecercontrasenausuario): Promise<void>;
}
