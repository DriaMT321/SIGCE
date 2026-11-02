import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errorsolicitudincorrecta } from '../../../../core/application/aplicacionerror';
import {
  tokenverificadoraccesosie,
  verificadoraccesosie,
} from '../ports/verificadoraccesosie.port';

@servicioaplicacion()
export class casousoverificaraccesosie {
  constructor(
    @inyectarpuerto(tokenverificadoraccesosie) private readonly verificador: verificadoraccesosie,
  ) {}

  async ejecutar(credenciales: { username?: string; password?: string }) {
    const nombreusuario = credenciales.username?.trim() ?? '';
    const contrasena = credenciales.password ?? '';
    if (!nombreusuario || !contrasena.trim()) {
      throw new errorsolicitudincorrecta(
        'Ingresa las credenciales del SIE para ejecutar la verificación.',
      );
    }

    return this.verificador.verificar({ username: nombreusuario, password: contrasena });
  }
}
