export const tokenseguridadcredenciales = Symbol('CREDENTIAL_SECURITY');

export interface seguridadcredencialespuerto {
  generartoken(): string;
  resumirtoken(token: string): string;
  resumircontrasena(contrasena: string): Promise<string>;
  verificarcontrasena(contrasena: string, hashcontrasena: string): Promise<boolean>;
}
