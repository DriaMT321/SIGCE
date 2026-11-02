import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladormaterias } from './presentation/controllers/asignaturas.controller';
import { casousolistarmaterias } from './application/use-cases/listarasignaturas.use-case';
import {
  casousoactualizarmateria,
  casousocrearmateria,
  casousoeliminarmateria,
} from './application/use-cases/gestionarmateria.use-cases';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositoriomaterias } from './domain/repositories/asignatura.repository.interface';
import { repositoriomateriaprisma } from './infrastructure/persistence/prismaasignatura.repository';

@Module({
  controllers: [controladormaterias],
  providers: [
    guardiapermisos,
    { provide: tokenrepositoriomaterias, useClass: repositoriomateriaprisma },
    proveedoraplicacion(casousolistarmaterias),
    proveedoraplicacion(casousocrearmateria),
    proveedoraplicacion(casousoactualizarmateria),
    proveedoraplicacion(casousoeliminarmateria),
  ],
})
export class modulomaterias {}
