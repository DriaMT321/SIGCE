import {
  servicioaplicacion,
  inyectarpuerto,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenverificadorreplicalocalsie,
  type verificadorreplicalocalsie,
} from '../ports/verificadorreplicalocalsie.port';

@servicioaplicacion()
export class casousoverificarreplicalocalsie {
  constructor(
    @inyectarpuerto(tokenverificadorreplicalocalsie)
    private readonly verificador: verificadorreplicalocalsie,
  ) {}

  async ejecutar(htmlsubido?: string) {
    return this.verificador.verificar(htmlsubido);
  }
}
