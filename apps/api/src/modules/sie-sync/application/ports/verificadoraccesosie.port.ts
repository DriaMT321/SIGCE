export const tokenverificadoraccesosie = Symbol('SIE_LOGIN_VERIFIER');

export interface credencialesaccesosie {
  username: string;
  password: string;
}

export interface verificacionaccesosie {
  active: boolean;
  httpStatus: number;
  loginSuccess: boolean;
  portalUrl: string;
  portalTitle: string;
  message: string;
  checkedAt: string;
  error?: string;
}

export interface verificadoraccesosie {
  verificar(credenciales: credencialesaccesosie): Promise<verificacionaccesosie>;
}
