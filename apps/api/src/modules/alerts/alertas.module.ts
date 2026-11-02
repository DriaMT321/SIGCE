import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Global, Module } from '@nestjs/common';
import { AlertsController } from './presentation/controllers/alerts.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioalertas } from './domain/repositories/alerta.repository.interface';
import { repositorioalertaprisma } from './infrastructure/persistence/prismaalerta.repository';
import { suscriptorasistenciaregistradaalerta } from './infrastructure/events/suscriptoralertaasistenciaregistrada';
import { tokenevaluacionalertatemprana } from './application/ports/evaluacionalertatemprana.port';
import {
  casousoevaluaralertasestudiante,
  casousoevaluaralertastodosestudiantes,
  casousolistarreglasalerta,
  casousolistaralertas,
  casousomarcaralertaleida,
  casousoactualizarreglaalerta,
  casousoactualizarestadoalerta,
  casousoprocesarevaluacionesalertaspendientes,
} from './application/use-cases/alerta.use-cases';
import { reconciliadoroutboxevaluacionalertas } from './infrastructure/events/reconciliadorevaluacionalertabuzonsalida';

@Global()
@Module({
  controllers: [AlertsController],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioalertas, useClass: repositorioalertaprisma },
    proveedoraplicacion(casousolistaralertas),
    proveedoraplicacion(casousomarcaralertaleida),
    proveedoraplicacion(casousoactualizarestadoalerta),
    proveedoraplicacion(casousolistarreglasalerta),
    proveedoraplicacion(casousoactualizarreglaalerta),
    proveedoraplicacion(casousoevaluaralertasestudiante),
    suscriptorasistenciaregistradaalerta,
    reconciliadoroutboxevaluacionalertas,
    { provide: tokenevaluacionalertatemprana, useExisting: casousoevaluaralertasestudiante },
    proveedoraplicacion(casousoevaluaralertastodosestudiantes),
    proveedoraplicacion(casousoprocesarevaluacionesalertaspendientes),
  ],
  exports: [casousoevaluaralertasestudiante, tokenevaluacionalertatemprana],
})
export class moduloalertas {}
