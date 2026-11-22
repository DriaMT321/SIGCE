import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladorinscripciones } from './presentation/controllers/inscripciones.controller';
import { controladortraslados } from './presentation/controllers/traslados.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioinscripciones } from './domain/repositories/inscripcion.repository.interface';
import { repositorioinscripcionprisma } from './infrastructure/persistence/prismainscripcion.repository';
import { tokenrepositoriotraslados } from './domain/repositories/traslado.repository.interface';
import { repositoriotrasladoprisma } from './infrastructure/persistence/prismatraslado.repository';
import {
  casousocrearinscripcion,
  casousolistarinscripciones,
  casousoactualizarinscripcion,
  casousoactualizarestadomasivo,
} from './application/use-cases/inscripcion.use-cases';
import {
  casousolistartraslados,
  casousoobtenertrasladoporid,
  casousocreartraslado,
  casousoactualizarfasetraslado,
} from './application/use-cases/traslado.use-cases';

@Module({
  controllers: [controladorinscripciones, controladortraslados],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioinscripciones, useClass: repositorioinscripcionprisma },
    { provide: tokenrepositoriotraslados, useClass: repositoriotrasladoprisma },
    proveedoraplicacion(casousolistarinscripciones),
    proveedoraplicacion(casousocrearinscripcion),
    proveedoraplicacion(casousoactualizarinscripcion),
    proveedoraplicacion(casousoactualizarestadomasivo),
    proveedoraplicacion(casousolistartraslados),
    proveedoraplicacion(casousoobtenertrasladoporid),
    proveedoraplicacion(casousocreartraslado),
    proveedoraplicacion(casousoactualizarfasetraslado),
  ],
})
export class moduloinscripciones {}
