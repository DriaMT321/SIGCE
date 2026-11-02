export type administradousuariorol =
  'ADMINISTRATIVE' | 'SECRETARY' | 'TEACHER' | 'PARENT' | 'STUDENT';
export type nuevousuariorol = Exclude<administradousuariorol, 'ADMINISTRATIVE' | 'STUDENT'>;

export interface administradousuarioregistro {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: administradousuariorol;
  isActive: boolean;
  passwordSetupRequired: boolean;
  createdAt: string;
}

export interface crearadministradousuarioentrada {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: nuevousuariorol;
  ci?: string;
  phone?: string;
  specialty?: string;
  itemNumber?: string;
  address?: string;
  occupation?: string;
}

type datosusuarioaplicacion = Pick<
  crearadministradousuarioentrada,
  'email' | 'password' | 'firstName' | 'lastName'
>;

export type crearusuariopersistencia =
  | (datosusuarioaplicacion & { role: 'SECRETARY' })
  | (datosusuarioaplicacion & {
      role: 'TEACHER';
      ci: string;
      specialty: string;
      phone?: string;
      itemNumber?: string;
    })
  | (datosusuarioaplicacion & {
      role: 'PARENT';
      ci: string;
      phone: string;
      address?: string;
      occupation?: string;
    });

export interface puertogestionusuario {
  listarusuarios(entrada: {
    role?: string;
    search?: string;
    limit: number;
  }): Promise<{ data: administradousuarioregistro[]; total: number }>;
  crearusuario(entrada: crearusuariopersistencia): Promise<void>;
  establecerusuarioactivo(idusuario: string, estaactivo: boolean): Promise<void>;
  restablecercontrasena(idusuario: string, contrasena: string): Promise<void>;
}

export const mensajedecontrasenainvalida =
  'La contraseña no puede contener solo espacios, debe tener al menos 12 caracteres y como máximo 72 bytes UTF-8.';

export function escontrasenavalida(contrasena: string): boolean {
  return (
    /\P{White_Space}/u.test(contrasena) &&
    [...contrasena].length >= 12 &&
    new TextEncoder().encode(contrasena).length <= 72
  );
}

export class gestionusuario {
  constructor(private readonly puerto: puertogestionusuario) {}

  listarusuarios(entrada: { role?: string; search?: string; limit: number }) {
    return this.puerto.listarusuarios({
      role: entrada.role?.trim() || undefined,
      search: entrada.search?.trim() || undefined,
      limit: Math.max(1, Math.trunc(entrada.limit)),
    });
  }

  crearusuario(entrada: crearadministradousuarioentrada) {
    this.validarcontrasena(entrada.password);
    const datos: datosusuarioaplicacion = {
      email: entrada.email.trim().toLowerCase(),
      password: entrada.password,
      firstName: entrada.firstName.trim(),
      lastName: entrada.lastName.trim(),
    };

    if (entrada.role === 'TEACHER') {
      return this.puerto.crearusuario({
        ...datos,
        role: entrada.role,
        ci: this.requerirtexto(entrada.ci, 'La cédula es obligatoria para crear un docente.'),
        specialty: this.requerirtexto(entrada.specialty, 'La especialidad es obligatoria.'),
        phone: this.opcionaltexto(entrada.phone),
        itemNumber: this.opcionaltexto(entrada.itemNumber),
      });
    }
    if (entrada.role === 'PARENT') {
      return this.puerto.crearusuario({
        ...datos,
        role: entrada.role,
        ci: this.requerirtexto(entrada.ci, 'La cédula es obligatoria para crear un familiar.'),
        phone: this.requerirtexto(
          entrada.phone,
          'El teléfono es obligatorio para crear un familiar.',
        ),
        address: this.opcionaltexto(entrada.address),
        occupation: this.opcionaltexto(entrada.occupation),
      });
    }
    return this.puerto.crearusuario({ ...datos, role: 'SECRETARY' });
  }

  establecerusuarioactivo(idusuario: string, estaactivo: boolean) {
    return this.puerto.establecerusuarioactivo(this.requeriridentificador(idusuario), estaactivo);
  }

  restablecercontrasena(idusuario: string, contrasena: string) {
    this.validarcontrasena(contrasena);
    return this.puerto.restablecercontrasena(this.requeriridentificador(idusuario), contrasena);
  }

  private validarcontrasena(contrasena: string) {
    if (!escontrasenavalida(contrasena)) {
      throw new Error(mensajedecontrasenainvalida);
    }
  }

  private opcionaltexto(valor: string | undefined): string | undefined {
    const normalizado = valor?.trim();
    return normalizado || undefined;
  }

  private requerirtexto(valor: string | undefined, mensaje: string): string {
    const normalizado = valor?.trim();
    if (!normalizado) throw new Error(mensaje);
    return normalizado;
  }

  private requeriridentificador(valor: string): string {
    const normalizado = valor.trim();
    if (!normalizado) throw new Error('Se requiere el identificador del usuario.');
    return normalizado;
  }
}
