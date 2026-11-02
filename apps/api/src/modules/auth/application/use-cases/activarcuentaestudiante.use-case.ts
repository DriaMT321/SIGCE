import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { incumplimientoregladominio } from '../../../../core/domain/violacionregladominio';
import { validarcontrasena } from '../../../../core/domain/policies/politicacontrasena';
import {
  tokenrepositorioautenticacion,
  repositorioautenticacion,
} from '../../domain/repositories/autenticacion.repository.interface';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../ports/seguridadcredencial.port';

@servicioaplicacion()
export class casousoactivarcuentaestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioautenticacion)
    private readonly repositorio: repositorioautenticacion,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}

  async ejecutar(entrada: {
    activationToken: string;
    newPassword: string;
    ipAddress?: string;
  }): Promise<{ activated: true }> {
    validarcontrasena(entrada.newPassword);
    const resumentoken = this.seguridadcredenciales.resumirtoken(entrada.activationToken);
    const ahora = new Date();
    if (
      !(await this.repositorio.esvalidotokenconfiguracioncontrasenaestudiante({
        tokenHash: resumentoken,
        now: ahora,
      }))
    ) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'El código de activación es inválido o venció.',
      );
    }

    const hashcontrasena = await this.seguridadcredenciales.resumircontrasena(entrada.newPassword);
    const activacion = await this.repositorio.completarconfiguracioncontrasenaestudiante({
      tokenHash: resumentoken,
      passwordHash: hashcontrasena,
      now: ahora,
      ipAddress: entrada.ipAddress,
    });

    if (!activacion) {
      throw new incumplimientoregladominio(
        'VALIDATION',
        'El código de activación es inválido o venció.',
      );
    }

    return { activated: true };
  }
}
