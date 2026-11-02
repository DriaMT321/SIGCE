import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  puertoresolverdiscrepanciasie,
  constanterepositoriosincronizacionsie,
  decisiondiscrepanciasie,
} from '../ports/repositoriosincronizacionsie';

@servicioaplicacion()
export class casousoresolverdiscrepanciasie {
  constructor(
    @inyectarpuerto(constanterepositoriosincronizacionsie)
    private readonly repositorio: puertoresolverdiscrepanciasie,
  ) {}

  ejecutar(entrada: {
    itemId: string;
    decision: decisiondiscrepanciasie;
    reason: string;
    userId: string;
    ipAddress?: string;
    correlationId?: string;
  }) {
    return this.repositorio.resolverdiscrepancia(entrada);
  }
}
