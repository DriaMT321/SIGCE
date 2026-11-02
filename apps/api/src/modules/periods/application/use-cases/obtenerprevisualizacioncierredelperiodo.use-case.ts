import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { errornoencontrado } from '../../../../core/application/aplicacionerror';
import {
  tokenrepositorioperiodosacademicos,
  repositorioperiodosacademicos,
} from '../../domain/repositories/periodoacademico.repository.interface';

@servicioaplicacion()
export class casousoobtenervistapreviacierreperiodo {
  constructor(
    @inyectarpuerto(tokenrepositorioperiodosacademicos)
    private readonly repositorio: repositorioperiodosacademicos,
  ) {}

  async ejecutar(id: string) {
    const vistaprevia = await this.repositorio.obtenervistapreviacierre(id);
    if (!vistaprevia) throw new errornoencontrado('Periodo académico no encontrado');
    return vistaprevia;
  }
}
