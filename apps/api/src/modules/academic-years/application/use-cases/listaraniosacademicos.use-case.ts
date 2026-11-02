import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenrepositorioanioacademico,
  repositorioanioacademico,
} from '../../domain/repositories/anioacademico.repository.interface';

@servicioaplicacion()
export class casousolistaraniosacademicos {
  constructor(
    @inyectarpuerto(tokenrepositorioanioacademico)
    private readonly repositorio: repositorioanioacademico,
  ) {}
  ejecutar() {
    return this.repositorio.buscartodos();
  }
}
