import { Module } from '@nestjs/common';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositorioasistentesie } from './application/ports/asistentesie.port';
import { servicioasistentesie } from './application/services/asistentesie.service';
import { repositorioasistentesieprisma } from './infrastructure/persistence/prismaasistentesie.repository';
import { SieAsistenteController } from './presentation/controllers/sie-asistente.controller';

@Module({
  controllers: [SieAsistenteController],
  providers: [
    guardiapermisos,
    {
      provide: tokenrepositorioasistentesie,
      useClass: repositorioasistentesieprisma,
    },
    servicioasistentesie,
  ],
})
export class modulosincronizacionsie {}
