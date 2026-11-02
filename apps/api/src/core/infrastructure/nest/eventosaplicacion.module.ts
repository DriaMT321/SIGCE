import { Global, Module } from '@nestjs/common';
import { tokenbuseventosaplicacion } from '../../application/buseventosaplicacion.port';
import { buseventosaplicacionenmemoria } from './buseventosenmemoria';

@Global()
@Module({
  providers: [{ provide: tokenbuseventosaplicacion, useClass: buseventosaplicacionenmemoria }],
  exports: [tokenbuseventosaplicacion],
})
export class moduloeventosaplicacion {}
