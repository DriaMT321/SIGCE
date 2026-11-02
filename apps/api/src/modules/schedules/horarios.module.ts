import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladorhorarios } from './presentation/controllers/horarios.controller';
import { serviciohorarios } from './application/horarios.service';
import { tokenrepositoriohorarios } from './domain/repositories/horario.repository.interface';
import { repositoriohorarioprisma } from './infrastructure/persistence/prismahorario.repository';
import { casousoobtenermihorario } from './application/use-cases/obtenermihorario.use-case';
import { casousogenerarhorariosemanal } from './application/use-cases/generarhorariosemanal.use-case';

@Module({
  controllers: [controladorhorarios],
  providers: [
    { provide: tokenrepositoriohorarios, useClass: repositoriohorarioprisma },
    proveedoraplicacion(serviciohorarios),
    proveedoraplicacion(casousoobtenermihorario),
    proveedoraplicacion(casousogenerarhorariosemanal),
  ],
  exports: [serviciohorarios],
})
export class modulohorarios {}
