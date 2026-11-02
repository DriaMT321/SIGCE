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
  tokenrepositoriofamiliares,
  repositoriofamiliares,
} from '../../domain/repositories/padre.repository.interface';
import {
  dtocrearfamiliar,
  dtoactualizarfamiliar,
  dtoactualizarvinculofamiliar,
} from '../dto/padre.dto';

@servicioaplicacion()
export class casousolistarfamiliares {
  constructor(
    @inyectarpuerto(tokenrepositoriofamiliares) private readonly repositorio: repositoriofamiliares,
  ) {}
  ejecutar(consulta: { search?: string; limit: number; offset: number }) {
    return this.repositorio.buscartodos(consulta);
  }
}

@servicioaplicacion()
export class casousocrearfamiliar {
  constructor(
    @inyectarpuerto(tokenrepositoriofamiliares) private readonly repositorio: repositoriofamiliares,
    @inyectarpuerto(tokenseguridadcredenciales)
    private readonly seguridadcredenciales: seguridadcredencialespuerto,
  ) {}
  async ejecutar(dto: dtocrearfamiliar, idusuario: string, direccionip?: string) {
    validarcontrasena(dto.password);
    const { password, ...datosfamiliares } = dto;
    const passwordHash = await this.seguridadcredenciales.resumircontrasena(password);
    return this.repositorio.crear(
      { ...datosfamiliares, passwordHash },
      {
        userId: idusuario,
        ipAddress: direccionip,
      },
    );
  }
}

@servicioaplicacion()
export class casousoactualizarfamiliar {
  constructor(
    @inyectarpuerto(tokenrepositoriofamiliares) private readonly repositorio: repositoriofamiliares,
  ) {}
  async ejecutar(id: string, dto: dtoactualizarfamiliar, idusuario: string, direccionip?: string) {
    return this.repositorio.actualizar(id, dto, { userId: idusuario, ipAddress: direccionip });
  }
}

@servicioaplicacion()
export class casousoactualizarvinculofamiliar {
  constructor(
    @inyectarpuerto(tokenrepositoriofamiliares) private readonly repositorio: repositoriofamiliares,
  ) {}
  ejecutar(
    idfamiliar: string,
    idestudiante: string,
    dto: dtoactualizarvinculofamiliar,
    idusuario: string,
    direccionip?: string,
  ) {
    return this.repositorio.actualizarvinculo(idfamiliar, idestudiante, dto.relationship, {
      userId: idusuario,
      ipAddress: direccionip,
    });
  }
}

@servicioaplicacion()
export class casousoeliminarvinculofamiliar {
  constructor(
    @inyectarpuerto(tokenrepositoriofamiliares) private readonly repositorio: repositoriofamiliares,
  ) {}
  ejecutar(idfamiliar: string, idestudiante: string, idusuario: string, direccionip?: string) {
    return this.repositorio.eliminarvinculo(idfamiliar, idestudiante, {
      userId: idusuario,
      ipAddress: direccionip,
    });
  }
}

@servicioaplicacion()
export class casousoeliminarfamiliar {
  constructor(
    @inyectarpuerto(tokenrepositoriofamiliares) private readonly repositorio: repositoriofamiliares,
  ) {}
  async ejecutar(id: string, idusuario: string, direccionip?: string) {
    await this.repositorio.eliminarlogicamente(id, { userId: idusuario, ipAddress: direccionip });
  }
}
