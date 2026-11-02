import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Global, Module } from '@nestjs/common';
import { constanterepositorioregistroauditoria } from './domain/repositories/registroauditoria.repository.interface';
import { repositorioregistroauditoriaprisma } from './infrastructure/persistence/prismaregistroauditoria.repository';
import { casousocrearregistroauditoria } from './application/use-cases/crearregistroauditoria.use-case';
import { casousoobtenerregistrosauditoria } from './application/use-cases/obtenerauditoriaregistros.use-case';
import { controladorauditoria } from './presentation/controllers/auditoria.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import {
  tokenlectorregistroauditoria,
  tokenescritorregistroauditoria,
} from './application/ports/registroauditoria.port';

@Global()
@Module({
  controllers: [controladorauditoria],
  providers: [
    guardiapermisos,
    {
      provide: constanterepositorioregistroauditoria,
      useClass: repositorioregistroauditoriaprisma,
    },
    proveedoraplicacion(casousocrearregistroauditoria),
    proveedoraplicacion(casousoobtenerregistrosauditoria),
    { provide: tokenescritorregistroauditoria, useExisting: casousocrearregistroauditoria },
    { provide: tokenlectorregistroauditoria, useExisting: casousoobtenerregistrosauditoria },
  ],
  exports: [
    casousocrearregistroauditoria,
    casousoobtenerregistrosauditoria,
    constanterepositorioregistroauditoria,
    tokenescritorregistroauditoria,
    tokenlectorregistroauditoria,
  ],
})
export class moduloauditoria {}
