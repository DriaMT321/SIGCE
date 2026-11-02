import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../../../auth/application/ports/seguridadcredencial.port';
import { datosconfiguracioncuentaestudiante } from '../../domain/repositories/estudiante.repository.interface';

const constanteduraciontokenactivacionms = 7 * 24 * 60 * 60 * 1000;

@servicioaplicacion()
export class fabricacredencialesactivacionestudiante {
  constructor(
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridad: seguridadcredencialespuerto,
  ) {}

  async emitir(): Promise<{ token: string; setup: datosconfiguracioncuentaestudiante }> {
    const token = this.seguridad.generartoken();
    const contrasenaprovisional = this.seguridad.generartoken();
    const venceen = new Date(Date.now() + constanteduraciontokenactivacionms);
    return {
      token,
      setup: {
        placeholderPasswordHash: await this.seguridad.resumircontrasena(contrasenaprovisional),
        activationTokenHash: this.seguridad.resumirtoken(token),
        activationExpiresAt: venceen,
      },
    };
  }
}
