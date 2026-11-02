import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladorcurriculo } from './presentation/controllers/curriculo.controller';
import { serviciocurriculo } from './application/curriculo.service';
import { tokenrepositoriocurriculo } from './domain/repositories/curriculo.repository.interface';
import { repositoriocurriculoprisma } from './infrastructure/persistence/prismacurriculo.repository';

@Module({
  controllers: [controladorcurriculo],
  providers: [
    proveedoraplicacion(serviciocurriculo),
    { provide: tokenrepositoriocurriculo, useClass: repositoriocurriculoprisma },
  ],
  exports: [serviciocurriculo],
})
export class modulocurriculo {}
