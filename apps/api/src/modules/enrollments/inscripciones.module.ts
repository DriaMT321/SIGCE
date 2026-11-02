import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladorinscripciones } from './presentation/controllers/inscripciones.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioinscripciones } from './domain/repositories/inscripcion.repository.interface';
import { repositorioinscripcionprisma } from './infrastructure/persistence/prismainscripcion.repository';
import {
  casousocrearinscripcion,
  casousolistarinscripciones,
  casousoactualizarinscripcion,
  casousoactualizarestadomasivo,
} from './application/use-cases/inscripcion.use-cases';

@Module({
  controllers: [controladorinscripciones],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioinscripciones, useClass: repositorioinscripcionprisma },
    proveedoraplicacion(casousolistarinscripciones),
    proveedoraplicacion(casousocrearinscripcion),
    proveedoraplicacion(casousoactualizarinscripcion),
    proveedoraplicacion(casousoactualizarestadomasivo),
  ],
})
export class moduloinscripciones {}
