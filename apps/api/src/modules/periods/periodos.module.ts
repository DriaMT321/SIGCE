import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladorperiodos } from './presentation/controllers/periodos.controller';
import { casousolistarperiodos } from './application/use-cases/listarperiodos.use-case';
import { casousoactualizarperiodo } from './application/use-cases/actualizarperiodo.use-case';
import { casousoobtenervistapreviacierreperiodo } from './application/use-cases/obtenerprevisualizacioncierredelperiodo.use-case';
import { casousocrearperiodo } from './application/use-cases/crearperiodo.use-case';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioperiodosacademicos } from './domain/repositories/periodoacademico.repository.interface';
import { repositorioperiodoacademicoprisma } from './infrastructure/persistence/prismaperiodoacademico.repository';

@Module({
  controllers: [controladorperiodos],
  providers: [
    guardiapermisos,
    { provide: tokenrepositorioperiodosacademicos, useClass: repositorioperiodoacademicoprisma },
    proveedoraplicacion(casousolistarperiodos),
    proveedoraplicacion(casousocrearperiodo),
    proveedoraplicacion(casousoactualizarperiodo),
    proveedoraplicacion(casousoobtenervistapreviacierreperiodo),
  ],
})
export class moduloperiodos {}
