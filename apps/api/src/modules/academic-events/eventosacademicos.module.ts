import { Module } from '@nestjs/common';
import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { servicioeventosacademicos } from './application/eventosacademicos.service';
import { tokenrepositorioeventosacademicos } from './application/ports/eventosacademicos.port';
import { controladoreventosacademicos } from './presentation/controllers/eventosacademicos.controller';
import { prismaeventosacademicosrepository } from './infrastructure/persistence/prismaeventosacademicos.repository';

@Module({
  controllers: [controladoreventosacademicos],
  providers: [
    proveedoraplicacion(servicioeventosacademicos),
    { provide: tokenrepositorioeventosacademicos, useClass: prismaeventosacademicosrepository },
  ],
})
export class moduloeventosacademicos {}

