import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenrepositoriotraslados,
  repositoriotraslados,
} from '../../domain/repositories/traslado.repository.interface';
import {
  dtocreartraslado,
  dtoactualizarfasetraslado,
  dtofiltrosstraslados,
} from '@academic/shared-types';

@servicioaplicacion()
export class casousolistartraslados {
  constructor(
    @inyectarpuerto(tokenrepositoriotraslados)
    private readonly repositorio: repositoriotraslados,
  ) {}

  ejecutar(filtros: dtofiltrosstraslados) {
    return this.repositorio.buscartodos(filtros);
  }
}

@servicioaplicacion()
export class casousoobtenertrasladoporid {
  constructor(
    @inyectarpuerto(tokenrepositoriotraslados)
    private readonly repositorio: repositoriotraslados,
  ) {}

  ejecutar(id: string) {
    return this.repositorio.buscarporid(id);
  }
}

@servicioaplicacion()
export class casousocreartraslado {
  constructor(
    @inyectarpuerto(tokenrepositoriotraslados)
    private readonly repositorio: repositoriotraslados,
  ) {}

  ejecutar(dto: dtocreartraslado, idusuario: string, ipdireccion?: string) {
    return this.repositorio.crear(dto, { userId: idusuario, ipAddress: ipdireccion });
  }
}

@servicioaplicacion()
export class casousoactualizarfasetraslado {
  constructor(
    @inyectarpuerto(tokenrepositoriotraslados)
    private readonly repositorio: repositoriotraslados,
  ) {}

  ejecutar(id: string, dto: dtoactualizarfasetraslado, idusuario: string, ipdireccion?: string) {
    return this.repositorio.actualizarfase(id, dto, {
      userId: idusuario,
      ipAddress: ipdireccion,
    });
  }
}
