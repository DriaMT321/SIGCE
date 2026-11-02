import { Global, Module } from '@nestjs/common';
import { pasarelaeventos } from './eventos.gateway';
import { moduloautenticacion } from '../../modules/auth/autenticacion.module';
import { tokenrevocacionsesionesusuario } from '../../modules/auth/application/ports/usuariosesionrevocacion.port';

@Global()
@Module({
  imports: [moduloautenticacion],
  providers: [
    pasarelaeventos,
    { provide: tokenrevocacionsesionesusuario, useExisting: pasarelaeventos },
  ],
  exports: [pasarelaeventos, tokenrevocacionsesionesusuario],
})
export class modulowebsocket {}
