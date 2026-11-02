export const tokenrevocacionsesionesusuario = Symbol('USER_SESSION_REVOCATION');

export interface revocacionsesionesusuario {
  revocarsesionesusuario(idusuario: string): Promise<void> | void;
}
