export type autenticacionrol = 'STUDENT' | 'TEACHER' | 'FAMILY' | 'ADMINISTRATIVE';

export interface autenticacionusuario {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface sesioncredenciales {
  role: autenticacionrol;
  identifier: string;
  secret?: string;
  secondaryIdentifier?: string;
}

export interface autenticacionsesion {
  accessToken: string;
  user: autenticacionusuario;
}

export interface puertogestionautenticacion {
  activarestudiantecuenta(entrada: { activationToken: string; newPassword: string }): Promise<void>;
  inicializar(): Promise<void>;
  sesion(credenciales: sesioncredenciales): Promise<autenticacionsesion>;
  esautenticado(): boolean;
  obtenerusuarioactual(): autenticacionusuario | null;
  cerrarsesion(): Promise<void>;
}

export class gestionautenticacion {
  constructor(private readonly puerto: puertogestionautenticacion) {}

  activarestudiantecuenta(entrada: { activationToken: string; newPassword: string }) {
    return this.puerto.activarestudiantecuenta(entrada);
  }

  inicializar() {
    return this.puerto.inicializar();
  }

  sesion(credenciales: sesioncredenciales) {
    return this.puerto.sesion({
      ...credenciales,
      identifier: credenciales.identifier.trim(),
      secondaryIdentifier: credenciales.secondaryIdentifier?.trim() || undefined,
    });
  }

  esautenticado() {
    return this.puerto.esautenticado();
  }

  obtenerusuarioactual() {
    return this.puerto.obtenerusuarioactual();
  }

  cerrarsesion() {
    return this.puerto.cerrarsesion();
  }
}
