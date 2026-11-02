import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import { entidadusuario } from '../../domain/entities/usuario.entity';
import {
  repositoriousuarios,
  constanterepositoriousuarios,
} from '../../domain/repositories/usuario.repository.interface';

@servicioaplicacion()
export class casousoobtenerusuarios {
  constructor(
    @inyectarpuerto(constanterepositoriousuarios)
    private readonly repositoriousuarios: repositoriousuarios,
  ) {}

  async ejecutar(parametros?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: entidadusuario[]; total: number }> {
    return this.repositoriousuarios.buscartodos(parametros);
  }
}
