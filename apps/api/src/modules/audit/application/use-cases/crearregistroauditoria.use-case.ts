import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { entidadregistroauditoria } from '../../domain/entities/registroauditoria.entity';
import {
  contextoidentificadorcorrelacion,
  tokencontextocorrelacion,
} from '../../../../core/application/ports/contextocorrelacion.port';
import {
  escritorregistroauditoria,
  comandocrearregistroauditoria,
} from '../ports/registroauditoria.port';
import {
  constanterepositorioregistroauditoria,
  repositorioregistroauditoria,
} from '../../domain/repositories/registroauditoria.repository.interface';

@servicioaplicacion()
export class casousocrearregistroauditoria implements escritorregistroauditoria {
  constructor(
    @inyectarpuerto(tokencontextocorrelacion)
    private readonly contextocorrelacion: contextoidentificadorcorrelacion,
    @inyectarpuerto(constanterepositorioregistroauditoria)
    private readonly repositorioregistroauditoria: repositorioregistroauditoria,
  ) {}

  async ejecutar(dto: comandocrearregistroauditoria): Promise<entidadregistroauditoria> {
    const entidad = entidadregistroauditoria.crear({
      ...dto,
      correlationId: dto.correlationId ?? this.contextocorrelacion.obteneractual(),
    });
    return this.repositorioregistroauditoria.crear(entidad);
  }
}
