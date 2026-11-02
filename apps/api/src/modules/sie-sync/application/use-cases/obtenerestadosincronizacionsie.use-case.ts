import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  puertoconsultasincronizacionsie,
  filtroslistadosincronizacionsie,
  constanterepositoriosincronizacionsie,
} from '../ports/repositoriosincronizacionsie';

@servicioaplicacion()
export class casousoobtenerestadosincronizacionsie {
  constructor(
    @inyectarpuerto(constanterepositoriosincronizacionsie)
    private readonly repositorio: puertoconsultasincronizacionsie,
  ) {}

  ejecutar(id: string) {
    return this.repositorio.buscarporidentificador(id);
  }

  listar(limite: number, desplazamiento: number, filtros?: filtroslistadosincronizacionsie) {
    return this.repositorio.buscartodos(limite, desplazamiento, filtros);
  }
}
