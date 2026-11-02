import {
  puertoprevisualizacionsie,
  filtrossincronizacionsie,
  vistapreviasincronizacionsie,
} from '../ports/repositoriosincronizacionsie';

export class casousoprevisualizarsincronizacionsie {
  constructor(private readonly repositorio: puertoprevisualizacionsie) {}

  ejecutar(filtros: filtrossincronizacionsie): Promise<vistapreviasincronizacionsie> {
    return this.repositorio.previsualizardesdecalificaciones(filtros);
  }
}
