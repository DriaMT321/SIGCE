import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { moduloautenticacion } from '../auth/autenticacion.module';
import { controladorfamiliares } from './presentation/controllers/padres.controller';
import { tokenrepositoriofamiliares } from './domain/repositories/padre.repository.interface';
import { repositoriofamiliarprisma } from './infrastructure/persistence/prismapadre.repository';
import {
  casousocrearfamiliar,
  casousoeliminarfamiliar,
  casousolistarfamiliares,
  casousoactualizarfamiliar,
  casousoactualizarvinculofamiliar,
  casousoeliminarvinculofamiliar,
} from './application/use-cases/padre.use-cases';

@Module({
  imports: [moduloautenticacion],
  controllers: [controladorfamiliares],
  providers: [
    { provide: tokenrepositoriofamiliares, useClass: repositoriofamiliarprisma },
    proveedoraplicacion(casousolistarfamiliares),
    proveedoraplicacion(casousocrearfamiliar),
    proveedoraplicacion(casousoactualizarfamiliar),
    proveedoraplicacion(casousoeliminarfamiliar),
    proveedoraplicacion(casousoactualizarvinculofamiliar),
    proveedoraplicacion(casousoeliminarvinculofamiliar),
  ],
})
export class modulofamiliares {}
