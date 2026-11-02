import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { moduloautenticacion } from '../auth/autenticacion.module';
import { controladordocentes } from './presentation/controllers/docentes.controller';
import { tokenrepositoriodocentes } from './domain/repositories/docente.repository.interface';
import { repositoriodocenteprisma } from './infrastructure/persistence/prismadocente.repository';
import {
  casousocreardocente,
  casousoeliminardocente,
  casousolistardocentes,
  casousoactualizardocente,
} from './application/use-cases/docente.use-cases';

@Module({
  imports: [moduloautenticacion],
  controllers: [controladordocentes],
  providers: [
    { provide: tokenrepositoriodocentes, useClass: repositoriodocenteprisma },
    proveedoraplicacion(casousolistardocentes),
    proveedoraplicacion(casousocreardocente),
    proveedoraplicacion(casousoactualizardocente),
    proveedoraplicacion(casousoeliminardocente),
  ],
})
export class modulodocentes {}
