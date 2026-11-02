import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenrepositorioperiodosacademicos,
  repositorioperiodosacademicos,
} from '../../domain/repositories/periodoacademico.repository.interface';

@servicioaplicacion()
export class casousolistarperiodos {
  constructor(
    @inyectarpuerto(tokenrepositorioperiodosacademicos)
    private readonly repositorio: repositorioperiodosacademicos,
  ) {}
  ejecutar(idanioacademico?: string) {
    return this.repositorio.buscartodos(idanioacademico);
  }
}
