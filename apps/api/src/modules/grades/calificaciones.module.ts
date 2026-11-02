import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { GradesController } from './presentation/controllers/grades.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositoriocalificaciones } from './domain/repositories/calificacion.repository.interface';
import { prismagraderepository } from './infrastructure/persistence/prismagrade.repository';
import { repositoriocorreccioncalificacionprisma } from './infrastructure/persistence/prismacorreccioncalificacion.repository';
import { tokenrepositoriocorreccionescalificacion } from './domain/repositories/calificacioncorreccion.repository.interface';
import {
  registrarcalificacion,
  casousolistarcalificaciones,
  casousoactualizarcalificacion,
  casousocrearcalificacionesmasivas,
  casousopublicarcalificaciones,
} from './application/use-cases/calificacion.use-cases';
import {
  casousodecidircorreccioncalificacion,
  casousolistarcorreccionescalificacion,
  casousosolicitarcorreccioncalificacion,
} from './application/use-cases/calificacioncorreccion.use-cases';

@Module({
  controllers: [GradesController],
  providers: [
    guardiapermisos,
    { provide: tokenrepositoriocalificaciones, useClass: prismagraderepository },
    {
      provide: tokenrepositoriocorreccionescalificacion,
      useClass: repositoriocorreccioncalificacionprisma,
    },
    proveedoraplicacion(casousolistarcalificaciones),
    proveedoraplicacion(registrarcalificacion),
    proveedoraplicacion(casousoactualizarcalificacion),
    proveedoraplicacion(casousocrearcalificacionesmasivas),
    proveedoraplicacion(casousopublicarcalificaciones),
    proveedoraplicacion(casousosolicitarcorreccioncalificacion),
    proveedoraplicacion(casousolistarcorreccionescalificacion),
    proveedoraplicacion(casousodecidircorreccioncalificacion),
  ],
})
export class modulocalificaciones {}
