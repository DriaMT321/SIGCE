import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoautorizado } from '../../../../core/application/aplicacionerror';
import {
  tokenescritorregistroauditoria,
  escritorregistroauditoria,
} from '../../../audit/application/ports/registroauditoria.port';
import { accionauditoria } from '@academic/domain-kernel';
import { dtoiniciosesion } from '../dto/acceso.dto';
import { tokenemisortokenautenticacion, emisortokenspuerto } from '../ports/tokenemisor.port';
import {
  tokenrepositorioautenticacion,
  repositorioautenticacion,
} from '../../domain/repositories/autenticacion.repository.interface';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../ports/seguridadcredencial.port';

@servicioaplicacion()
export class casousoiniciarsesion {
  constructor(
    @inyectarpuerto(tokenrepositorioautenticacion)
    private readonly repositorio: repositorioautenticacion,
    @inyectarpuerto(tokenescritorregistroauditoria)
    private readonly casousocrearregistroauditoria: escritorregistroauditoria,
    @inyectarpuerto(tokenemisortokenautenticacion)
    private readonly emisortokens: emisortokenspuerto,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}

  async ejecutar(dto: dtoiniciosesion, direccionip?: string, agenteusuario?: string) {
    const usuario = await this.repositorio.buscarporcorreo(dto.email);

    if (!usuario || !usuario.isActive || usuario.deletedAt || usuario.passwordSetupPending) {
      throw new errornoautorizado('Credenciales inválidas o cuenta inactiva');
    }

    const contrasenaesvalida = await this.seguridadcredenciales.verificarcontrasena(
      dto.password,
      usuario.passwordHash,
    );
    if (!contrasenaesvalida) {
      throw new errornoautorizado('Credenciales inválidas o cuenta inactiva');
    }

    const partokens = this.emisortokens.emitirparausuario(usuario);

    await this.repositorio.creartokenrenovacion({
      userId: usuario.id,
      sessionId: partokens.sessionId,
      token: this.seguridadcredenciales.resumirtoken(partokens.refreshToken),
      expiresAt: partokens.refreshExpiresAt,
    });

    // Registrar en auditoría
    await this.casousocrearregistroauditoria.ejecutar({
      userId: usuario.id,
      action: accionauditoria.LOGIN,
      entity: 'User',
      entityId: usuario.id,
      newValue: { email: usuario.email, role: usuario.role },
      ipAddress: direccionip,
      userAgent: agenteusuario,
    });

    return {
      accessToken: partokens.accessToken,
      refreshToken: partokens.refreshToken,
      refreshExpiresAt: partokens.refreshExpiresAt,
      user: {
        id: usuario.id,
        email: usuario.email,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        role: usuario.role,
      },
    };
  }
}
