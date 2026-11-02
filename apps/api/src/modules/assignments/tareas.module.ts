import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladortareas } from './presentation/controllers/tareas.controller';
import { serviciotareas } from './application/tareas.service';
import { tokenrepositoriotareas } from './domain/repositories/tarea.repository.interface';
import { repositoriotareaprisma } from './infrastructure/persistence/prismatarea.repository';

@Module({
  controllers: [controladortareas],
  providers: [
    proveedoraplicacion(serviciotareas),
    { provide: tokenrepositoriotareas, useClass: repositoriotareaprisma },
  ],
  exports: [serviciotareas],
})
export class modulotareas {}
