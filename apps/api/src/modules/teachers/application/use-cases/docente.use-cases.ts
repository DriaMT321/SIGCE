import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { validarcontrasena } from '../../../../core/domain/policies/politicacontrasena';
import {
  tokenseguridadcredenciales,
  seguridadcredencialespuerto,
} from '../../../auth/application/ports/seguridadcredencial.port';
import {
  tokenrepositoriodocentes,
  repositoriodocentes,
} from '../../domain/repositories/docente.repository.interface';
import { dtocreardocente, dtoactualizardocente } from '../dto/docente.dto';

@servicioaplicacion()
export class casousolistardocentes {
  constructor(
    @inyectarpuerto(tokenrepositoriodocentes) private readonly repositorio: repositoriodocentes,
  ) {}
  ejecutar(consulta: { search?: string; limit: number; offset: number }) {
    return this.repositorio.buscartodos(consulta);
  }
}

@servicioaplicacion()
export class casousocreardocente {
  constructor(
    @inyectarpuerto(tokenrepositoriodocentes) private readonly repositorio: repositoriodocentes,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}
  async ejecutar(dto: dtocreardocente, idusuario: string, direccionip?: string) {
    validarcontrasena(dto.password);
    const { password, ...datosdocente } = dto;
    const passwordHash = await this.seguridadcredenciales.resumircontrasena(password);
    return this.repositorio.crear(
      { ...datosdocente, passwordHash },
      {
        userId: idusuario,
        ipAddress: direccionip,
      },
    );
  }
}

@servicioaplicacion()
export class casousoactualizardocente {
  constructor(
    @inyectarpuerto(tokenrepositoriodocentes) private readonly repositorio: repositoriodocentes,
  ) {}
  async ejecutar(id: string, dto: dtoactualizardocente, idusuario: string, direccionip?: string) {
    return this.repositorio.actualizar(id, dto, { userId: idusuario, ipAddress: direccionip });
  }
}

@servicioaplicacion()
export class casousoeliminardocente {
  constructor(
    @inyectarpuerto(tokenrepositoriodocentes) private readonly repositorio: repositoriodocentes,
  ) {}
  async ejecutar(id: string, idusuario: string, direccionip?: string) {
    await this.repositorio.eliminarlogicamente(id, { userId: idusuario, ipAddress: direccionip });
  }
}
