import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladoraniosacademicos } from './presentation/controllers/aniosacademicos.controller';
import { casousolistaraniosacademicos } from './application/use-cases/listaraniosacademicos.use-case';
import {
  casousoactualizaranioacademico,
  casousocrearanioacademico,
  casousoeliminaranioacademico,
} from './application/use-cases/gestionaranioacademico.use-cases';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioanioacademico } from './domain/repositories/anioacademico.repository.interface';
import { repositorioanioacademicoprisma } from './infrastructure/persistence/prismaanioacademico.repository';

@Module({
  controllers: [controladoraniosacademicos],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioanioacademico, useClass: repositorioanioacademicoprisma },
    proveedoraplicacion(casousolistaraniosacademicos),
    proveedoraplicacion(casousocrearanioacademico),
    proveedoraplicacion(casousoactualizaranioacademico),
    proveedoraplicacion(casousoeliminaranioacademico),
  ],
})
export class moduloaniosacademicos {}
