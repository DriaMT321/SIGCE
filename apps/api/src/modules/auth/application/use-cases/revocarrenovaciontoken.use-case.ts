import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { dtotokenrenovacion } from '../dto/acceso.dto';
import {
  tokenrepositorioautenticacion,
  repositorioautenticacion,
} from '../../domain/repositories/autenticacion.repository.interface';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../ports/seguridadcredencial.port';

@servicioaplicacion()
export class casousorevocartokenrenovacion {
  constructor(
    @inyectarpuerto(tokenrepositorioautenticacion)
    private readonly repositorio: repositorioautenticacion,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}

  async ejecutar(dto: dtotokenrenovacion): Promise<void> {
    await this.repositorio.revocartokenrenovacion(
      this.seguridadcredenciales.resumirtoken(dto.refreshToken),
      new Date(),
    );
  }
}
