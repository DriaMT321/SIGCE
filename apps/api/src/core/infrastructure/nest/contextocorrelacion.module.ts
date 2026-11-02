import { Global, Module } from '@nestjs/common';
import { tokencontextocorrelacion } from '../../application/ports/contextocorrelacion.port';
import { contextoidentificadorcorrelacionlocal } from '../contextocorrelacion.local';
import { interceptorregistrosolicitudes } from '../../../common/interceptors/registro.interceptor';

@Global()
@Module({
  providers: [
    interceptorregistrosolicitudes,
    {
      provide: tokencontextocorrelacion,
      useClass: contextoidentificadorcorrelacionlocal,
    },
  ],
  exports: [tokencontextocorrelacion, interceptorregistrosolicitudes],
})
export class modulocontextocorrelacion {}
