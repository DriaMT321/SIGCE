import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { controladorcursos } from './presentation/controllers/cursos.controller';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { tokenrepositoriocursos } from './domain/repositories/curso.repository.interface';
import { repositoriocursoprisma } from './infrastructure/persistence/prismacurso.repository';
import {
  casousocrearcurso,
  casousoeliminarcurso,
  casousoobtenercurso,
  casousolistarcursos,
  casousoactualizarcurso,
} from './application/use-cases/curso.use-cases';

@Module({
  controllers: [controladorcursos],
  providers: [
    guardiapermisos,
    { provide: tokenrepositoriocursos, useClass: repositoriocursoprisma },
    proveedoraplicacion(casousolistarcursos),
    proveedoraplicacion(casousoobtenercurso),
    proveedoraplicacion(casousocrearcurso),
    proveedoraplicacion(casousoactualizarcurso),
    proveedoraplicacion(casousoeliminarcurso),
  ],
})
export class modulocursos {}
