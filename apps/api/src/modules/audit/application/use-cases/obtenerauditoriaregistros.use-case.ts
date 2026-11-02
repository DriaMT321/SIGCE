import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { entidadregistroauditoria } from '../../domain/entities/registroauditoria.entity';
import {
  consultaregistroauditoria,
  lectorregistroauditoria,
} from '../ports/registroauditoria.port';
import {
  constanterepositorioregistroauditoria,
  repositorioregistroauditoria,
} from '../../domain/repositories/registroauditoria.repository.interface';

@servicioaplicacion()
export class casousoobtenerregistrosauditoria implements lectorregistroauditoria {
  constructor(
    @inyectarpuerto(constanterepositorioregistroauditoria)
    private readonly repositorioregistroauditoria: repositorioregistroauditoria,
  ) {}

  async ejecutar(
    parametros?: consultaregistroauditoria,
  ): Promise<{ items: entidadregistroauditoria[]; total: number }> {
    return this.repositorioregistroauditoria.buscartodos(parametros);
  }
}
