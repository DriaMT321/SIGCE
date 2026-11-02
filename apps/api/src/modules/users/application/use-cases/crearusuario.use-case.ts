import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errorsolicitudincorrecta,
  errorconflictoaplicacion,
} from '../../../../core/application/aplicacionerror';
import { rolusuario } from '@academic/domain-kernel';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../../../auth/application/ports/seguridadcredencial.port';
import {
  repositoriousuarios,
  constanterepositoriousuarios,
  datoscreacionusuario,
} from '../../domain/repositories/usuario.repository.interface';
import { dtocrearusuario } from '../dto/crearusuario.dto';
import { validarcontrasena } from '../../../../core/domain/policies/politicacontrasena';

@servicioaplicacion()
export class casousocrearusuario {
  constructor(
    @inyectarpuerto(constanterepositoriousuarios)
    private readonly repositoriousuarios: repositoriousuarios,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}

  async ejecutar(dto: dtocrearusuario, idusuarioactual: string, direccionip?: string) {
    validarcontrasena(dto.password);
    if (dto.role === rolusuario.STUDENT) {
      throw new errorsolicitudincorrecta(
        'Las cuentas estudiantiles se crean junto con el expediente del estudiante.',
      );
    }
    if (dto.role === rolusuario.ADMINISTRATIVE) {
      throw new errorsolicitudincorrecta(
        'Las cuentas de Administración y Dirección no se crean desde este flujo.',
      );
    }
    if (dto.role !== rolusuario.SECRETARY) {
      throw new errorsolicitudincorrecta(
        'Las cuentas de docentes y familiares se crean desde sus módulos correspondientes.',
      );
    }

    // 2. Verificar duplicidad de email
    const existentecorreo = await this.repositoriousuarios.buscarporcorreo(dto.email);
    if (existentecorreo) {
      throw new errorconflictoaplicacion(
        `El correo electrónico '${dto.email}' ya se encuentra registrado en el sistema`,
      );
    }

    // Generar el hash antes de entregar las credenciales al adaptador de persistencia.
    const hashcontrasena = await this.seguridadcredenciales.resumircontrasena(dto.password);
    const datoscreacion: datoscreacionusuario = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: rolusuario.SECRETARY,
      passwordHash: hashcontrasena,
    };
    return this.repositoriousuarios.crear(datoscreacion, {
      userId: idusuarioactual,
      ipAddress: direccionip,
    });
  }
}
