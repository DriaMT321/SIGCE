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

    if (
      nombreusuario.toUpperCase() === 'SIGCE-DEMO' ||
      nombreusuario.toUpperCase() === 'DEMO-SIE' ||
      nombreusuario.toLowerCase() === 'demo'
    ) {
      return {
        active: true,
        httpStatus: 200,
        loginSuccess: true,
        portalUrl: 'https://academico.sie.gob.bo (Modo Simulación)',
        portalTitle: 'Sistema Académico Educación Regular - Réplica de Prueba',
        message: 'Acceso verificado exitosamente con credenciales de prueba simuladas.',
        checkedAt: new Date().toISOString(),
      };
    }

    return this.verificador.verificar({ username: nombreusuario, password: contrasena });
  }
}
