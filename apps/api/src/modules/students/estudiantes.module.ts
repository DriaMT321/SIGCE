import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { moduloautenticacion } from '../auth/autenticacion.module';
import { StudentsController } from './presentation/controllers/students.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioestudiantes } from './domain/repositories/estudiante.repository.interface';
import { repositorioestudianteprisma } from './infrastructure/persistence/prismaestudiante.repository';
import {
  casousocrearestudiante,
  casousoeliminarestudiante,
  casousoobtenerestudiante,
  casousolistarestudiantes,
  casousoreemitiractivacionestudiante,
  casousoactualizarestudiante,
} from './application/use-cases/estudiante.use-cases';
import { fabricacredencialesactivacionestudiante } from './application/services/credencialactivacionestudiante.factory';
import {
  casousocrearreferenciadocumentoestudiante,
  casousolistarreferenciasdocumentosestudiante,
} from './application/use-cases/referenciadocumentoestudiante.use-cases';
import { tokenrepositorioreferenciasdocumentosestudiante } from './domain/repositories/referenciadocumentoestudiante.repository.interface';
import { repositorioreferenciadocumentoestudianteprisma } from './infrastructure/persistence/prismareferenciadocumentoestudiante.repository';

@Module({
  imports: [moduloautenticacion],
  controllers: [StudentsController],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioestudiantes, useClass: repositorioestudianteprisma },
    {
      provide: tokenrepositorioreferenciasdocumentosestudiante,
      useClass: repositorioreferenciadocumentoestudianteprisma,
    },
    proveedoraplicacion(casousolistarestudiantes),
    proveedoraplicacion(casousoobtenerestudiante),
    proveedoraplicacion(casousocrearestudiante),
    proveedoraplicacion(casousoreemitiractivacionestudiante),
    proveedoraplicacion(casousoactualizarestudiante),
    proveedoraplicacion(casousoeliminarestudiante),
    proveedoraplicacion(fabricacredencialesactivacionestudiante),
    proveedoraplicacion(casousolistarreferenciasdocumentosestudiante),
    proveedoraplicacion(casousocrearreferenciadocumentoestudiante),
  ],
})
export class moduloestudiantes {}
