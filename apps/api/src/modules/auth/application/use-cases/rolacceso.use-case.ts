import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoautorizado } from '../../../../core/application/aplicacionerror';
import { accionauditoria } from '@academic/domain-kernel';
import {
  tokenescritorregistroauditoria,
  escritorregistroauditoria,
} from '../../../audit/application/ports/registroauditoria.port';
import { tokenemisortokenautenticacion, emisortokenspuerto } from '../ports/tokenemisor.port';
import { dtoiniciosesionporrol } from '../dto/acceso.dto';
import {
  tokenrepositorioautenticacion,
  repositorioautenticacion,
} from '../../domain/repositories/autenticacion.repository.interface';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../ports/seguridadcredencial.port';

@servicioaplicacion()
export class casousoiniciarsesionporrol {
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

  async ejecutar(dto: dtoiniciosesionporrol, direccionip?: string, agenteusuario?: string) {
    const identificador = dto.identifier.trim();
    const usuario = await this.repositorio.buscarporidentificadoryrol(
      dto.role,
      identificador,
      dto.secondaryIdentifier?.trim(),
    );

    if (!usuario || !usuario.isActive || usuario.deletedAt || usuario.passwordSetupPending) {
      throw new errornoautorizado('Las credenciales no son válidas o la cuenta está inactiva');
    }

    if (
      !dto.secret ||
      !(await this.seguridadcredenciales.verificarcontrasena(dto.secret, usuario.passwordHash))
    ) {
      throw new errornoautorizado('Las credenciales no son válidas o la cuenta está inactiva');
    }

    const partokens = this.emisortokens.emitirparausuario(usuario);
    await this.repositorio.creartokenrenovacion({
      userId: usuario.id,
      sessionId: partokens.sessionId,
      token: this.seguridadcredenciales.resumirtoken(partokens.refreshToken),
      expiresAt: partokens.refreshExpiresAt,
    });

    await this.casousocrearregistroauditoria.ejecutar({
      userId: usuario.id,
      action: accionauditoria.LOGIN,
      entity: 'User',
      entityId: usuario.id,
      newValue: { email: usuario.email, role: usuario.role, loginRole: dto.role },
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
