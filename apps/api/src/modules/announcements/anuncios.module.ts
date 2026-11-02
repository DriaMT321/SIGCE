import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladoranuncios } from './presentation/controllers/anuncios.controller';
import {
  casousocrearanuncio,
  casousoeliminaranuncio,
  casousolistaranuncios,
} from './application/anuncio.use-cases';
import { tokenrepositorioanuncios } from './application/ports/repositorioanuncios.port';
import { repositorioanuncioprisma } from './infrastructure/persistence/prismanuncio.repository';
import { tokenresolvedordestinatariosanuncio } from './application/ports/anunciodestinatarioresolvedor.port';
import { resolvedordestinatariosanuncioprisma } from './infrastructure/persistence/prismaanunciodestinatarioresolvedor';
import { tokenpublicadoranuncio } from './application/ports/anunciopublicacion.port';
import { publicadoranuncioprisma } from './infrastructure/persistence/prismaanunciopublicador';

@Module({
  controllers: [controladoranuncios],
  providers: [
    { provide: tokenrepositorioanuncios, useClass: repositorioanuncioprisma },
    {
      provide: tokenresolvedordestinatariosanuncio,
      useClass: resolvedordestinatariosanuncioprisma,
    },
    { provide: tokenpublicadoranuncio, useClass: publicadoranuncioprisma },
    proveedoraplicacion(casousolistaranuncios),
    proveedoraplicacion(casousocrearanuncio),
    proveedoraplicacion(casousoeliminaranuncio),
  ],
})
export class moduloanuncios {}
