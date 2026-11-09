import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  errornoencontrado,
  errorsolicitudincorrecta,
} from '../../../../core/application/aplicacionerror';
import { obtenererrorfechanacimientoestudiante } from '@academic/academic-domain';
import {
  datoscreacionestudiante,
  tokenrepositorioestudiantes,
  repositorioestudiantes,
  datosactualizacionestudiante,
} from '../../domain/repositories/estudiante.repository.interface';
import { dtocrearestudiante, dtoactualizarestudiante } from '../dto/estudiante.dto';
import { fabricacredencialesactivacionestudiante } from '../services/credencialactivacionestudiante.factory';

@servicioaplicacion()
export class casousolistarestudiantes {
  constructor(
    @inyectarpuerto(tokenrepositorioestudiantes)
    private readonly repositorio: repositorioestudiantes,
  ) {}
  ejecutar(consulta: {
    search?: string;
    courseId?: string;
    parentUserId?: string;
    teacherUserId?: string;
    limit: number;
    offset: number;
  }) {
    return this.repositorio.buscartodos(consulta);
  }

  buscarcoincidencias(consulta: { rude?: string; ci?: string }) {
    return this.repositorio.buscarcoincidencias({
      rude: consulta.rude?.trim() || undefined,
      ci: consulta.ci?.trim() || undefined,
    });
  }
}

@servicioaplicacion()
export class casousoobtenerestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioestudiantes)
    private readonly repositorio: repositorioestudiantes,
  ) {}
  async ejecutar(id: string, idusuariofamiliar?: string, idusuariodocente?: string) {
    const estudiante = await this.repositorio.buscarporidentificador(
      id,
      idusuariofamiliar,
      idusuariodocente,
    );
    if (!estudiante) throw new errornoencontrado('Estudiante no encontrado');
    return estudiante;
  }
}

@servicioaplicacion()
export class casousocrearestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioestudiantes)
    private readonly repositorio: repositorioestudiantes,
    private readonly credencialesactivacion: fabricacredencialesactivacionestudiante,
  ) {}
  async ejecutar(
    dto: dtocrearestudiante,
    idusuario: string,
    direccionip?: string,
    correlacionid?: string,
  ) {
    const errorfecha = obtenererrorfechanacimientoestudiante(dto.birthDate);
    if (errorfecha) throw new errorsolicitudincorrecta(errorfecha);
    const datos: datoscreacionestudiante = {
      ...dto,
      birthDate: new Date(`${dto.birthDate}T00:00:00.000Z`),
    };
    const activacion = await this.credencialesactivacion.emitir();
    const estudiante = await this.repositorio.crear(datos, activacion.setup, {
      userId: idusuario,
      ipAddress: direccionip,
      correlationId: correlacionid,
      newValue: {
        rude: datos.rude,
        ci: datos.ci,
        firstName: datos.firstName,
        lastName: datos.lastName,
        birthDate: datos.birthDate.toISOString(),
        gender: datos.gender,
        address: datos.address ?? null,
        phone: datos.phone ?? null,
      },
    });
    return {
      student: estudiante,
      activationToken: activacion.token,
      activationExpiresAt: activacion.setup.activationExpiresAt,
    };
  }
}

@servicioaplicacion()
export class casousoreemitiractivacionestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioestudiantes)
    private readonly repositorio: repositorioestudiantes,
    private readonly credencialesactivacion: fabricacredencialesactivacionestudiante,
  ) {}

  async ejecutar(
    idestudiante: string,
    idusuarioactor: string,
    direccionip?: string,
    correlacionid?: string,
  ) {
    const activacion = await this.credencialesactivacion.emitir();
    const idusuario = await this.repositorio.reemitiractivacion(idestudiante, activacion.setup, {
      userId: idusuarioactor,
      ipAddress: direccionip,
      correlationId: correlacionid,
    });
    if (!idusuario)
      throw new errornoencontrado('No se encontró una cuenta estudiantil que pueda activarse');

    return {
      activationToken: activacion.token,
      activationExpiresAt: activacion.setup.activationExpiresAt,
    };
  }
}

@servicioaplicacion()
export class casousoactualizarestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioestudiantes)
    private readonly repositorio: repositorioestudiantes,
  ) {}
  async ejecutar(
    id: string,
    dto: dtoactualizarestudiante,
    idusuario: string,
    direccionip?: string,
    correlacionid?: string,
  ) {
    const { birthDate: nacimientofecha, ...campos } = dto;
    if (nacimientofecha !== undefined) {
      const errorfecha = obtenererrorfechanacimientoestudiante(nacimientofecha);
      if (errorfecha) throw new errorsolicitudincorrecta(errorfecha);
    }
    const datos: datosactualizacionestudiante = {
      ...campos,
      ...(nacimientofecha !== undefined
        ? { birthDate: new Date(`${nacimientofecha}T00:00:00.000Z`) }
        : {}),
    };
    const estudiante = await this.repositorio.actualizar(id, datos, {
      userId: idusuario,
      ipAddress: direccionip,
      correlationId: correlacionid,
    });
    return estudiante;
  }
}

@servicioaplicacion()
export class casousoeliminarestudiante {
  constructor(
    @inyectarpuerto(tokenrepositorioestudiantes)
    private readonly repositorio: repositorioestudiantes,
  ) {}
  async ejecutar(id: string, idusuario: string, direccionip?: string, correlacionid?: string) {
    await this.repositorio.eliminarlogicamente(id, {
      userId: idusuario,
      ipAddress: direccionip,
      correlationId: correlacionid,
    });
  }
}
