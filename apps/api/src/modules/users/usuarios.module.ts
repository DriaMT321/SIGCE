import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { moduloautenticacion } from '../auth/autenticacion.module';
import { controladorusuarios } from './presentation/controllers/usuarios.controller';
import { casousoobtenerusuarios } from './application/use-cases/obtenerusuarios.use-case';
import { casousocrearusuario } from './application/use-cases/crearusuario.use-case';
import { casousoactualizarusuario } from './application/use-cases/actualizarusuario.use-case';
import { casousorestablecercontrasenausuario } from './application/use-cases/restablecercontrasenausuario.use-case';
import { repositoriousuarioprisma } from './infrastructure/persistence/prismausuario.repository';
import { repositoriocredencialesusuarioprisma } from './infrastructure/persistence/prismacredencialusuario.repository';
import { constanterepositoriousuarios } from './domain/repositories/usuario.repository.interface';
import { tokenrepositoriocredencialesusuario } from './domain/repositories/usuariocredencial.repository.interface';

@Module({
  imports: [moduloautenticacion],
  controllers: [controladorusuarios],
  providers: [
    {
      provide: constanterepositoriousuarios,
      useClass: repositoriousuarioprisma,
    },
    {
      provide: tokenrepositoriocredencialesusuario,
      useClass: repositoriocredencialesusuarioprisma,
    },
    proveedoraplicacion(casousoobtenerusuarios),
    proveedoraplicacion(casousocrearusuario),
    proveedoraplicacion(casousoactualizarusuario),
    proveedoraplicacion(casousorestablecercontrasenausuario),
  ],
  exports: [
    casousoobtenerusuarios,
    casousocrearusuario,
    casousoactualizarusuario,
    casousorestablecercontrasenausuario,
    constanterepositoriousuarios,
  ],
})
export class modulousuarios {}
