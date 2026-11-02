import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoautorizado } from '../../../../core/application/aplicacionerror';
import { cargatokenautenticacion } from '../modelos/cargatoken.model';
import { dtotokenrenovacion } from '../dto/acceso.dto';
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
export class casousorenovartoken {
  constructor(
    @inyectarpuerto(tokenrepositorioautenticacion)
    private readonly repositorio: repositorioautenticacion,
    @inyectarpuerto(tokenemisortokenautenticacion)
    private readonly emisortokens: emisortokenspuerto,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}

  async ejecutar(dto: dtotokenrenovacion) {
    let carga: cargatokenautenticacion;
    try {
      carga = this.emisortokens.verificartokenrenovacion(dto.refreshToken);
    } catch {
      throw new errornoautorizado('Refresh token inválido o expirado');
    }

    const almacenadotoken = await this.repositorio.buscartokenrenovacion(
      this.seguridadcredenciales.resumirtoken(dto.refreshToken),
    );
    const ahora = new Date();

    if (
      !almacenadotoken ||
      almacenadotoken.userId !== carga.sub ||
      !carga.sessionId ||
      almacenadotoken.sessionId !== carga.sessionId ||
      !almacenadotoken.session ||
      almacenadotoken.session.userId !== carga.sub ||
      almacenadotoken.session.revokedAt ||
      almacenadotoken.session.expiresAt <= ahora ||
      almacenadotoken.revokedAt ||
      almacenadotoken.expiresAt <= ahora ||
      !almacenadotoken.user.isActive ||
      almacenadotoken.user.deletedAt ||
      almacenadotoken.user.passwordSetupPending ||
      ((carga.credentialVersion !== undefined || almacenadotoken.user.credentialVersion !== 0) &&
        carga.credentialVersion !== almacenadotoken.user.credentialVersion)
    ) {
      throw new errornoautorizado('Refresh token inválido, revocado o expirado');
    }

    const partokens = this.emisortokens.emitirparausuario(almacenadotoken.user, carga.sessionId);
    const rotado = await this.repositorio.rotartokenrenovacion({
      previousTokenId: almacenadotoken.id,
      now: ahora,
      replacement: {
        userId: almacenadotoken.userId,
        sessionId: carga.sessionId,
        token: this.seguridadcredenciales.resumirtoken(partokens.refreshToken),
        expiresAt: partokens.refreshExpiresAt,
      },
    });
    if (!rotado) throw new errornoautorizado('Refresh token inválido, revocado o expirado');

    return {
      accessToken: partokens.accessToken,
      refreshToken: partokens.refreshToken,
      refreshExpiresAt: partokens.refreshExpiresAt,
      user: {
        id: almacenadotoken.user.id,
        email: almacenadotoken.user.email,
        firstName: almacenadotoken.user.firstName,
        lastName: almacenadotoken.user.lastName,
        role: almacenadotoken.user.role,
      },
    };
  }
}
