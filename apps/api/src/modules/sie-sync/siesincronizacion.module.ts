import { proveedoraplicacion } from '../../core/infrastructure/nest/proveedoraplicacion';
import { Module } from '@nestjs/common';
import { SieSyncController } from './presentation/controllers/sie-sync.controller';
import { casousoiniciarsincronizacionsie } from './application/use-cases/iniciarsincronizacion.use-case';
import { casousoprevisualizarsincronizacionsie } from './application/use-cases/previsualizacionsiesincronizacion.use-case';
import { casousoobtenerestadosincronizacionsie } from './application/use-cases/obtenerestadosincronizacionsie.use-case';
import { repositoriosincronizacionsieprisma } from './infrastructure/persistence/repositoriosincronizacionsieprisma';
import { constanterepositoriosincronizacionsie } from './application/ports/repositoriosincronizacionsie';
import { guardiapermisos } from '../../common/guards/permisos.guard';
import { casousoverificaraccesosie } from './application/use-cases/verificaraccesosie.use-case';
import { casousoverificarreplicalocalsie } from './application/use-cases/verificarreplicalocalsie.use-case';
import { casousoauditarcalificacionessie } from './application/use-cases/auditoriacalificacionesie.use-case';
import { serviciogestionarinformesauditoriasie } from './application/services/gestionarinformesauditoriasie.service';
import { serviciopublicarinformeauditoriasie } from './application/services/publicarinformeauditoriasie.service';
import { tokenverificadoraccesosie } from './application/ports/verificadoraccesosie.port';
import { verificadoraccesosiepuppeteer } from './infrastructure/browser/puppeteersieaccesoverificador';
import { tokenverificadorreplicalocalsie } from './application/ports/verificadorreplicalocalsie.port';
import { adaptadornavegadorreplicalocalsie } from './infrastructure/browser/puppeteerverificadorreplicalocal.adapter';
import { tokenrepositorioauditoriacalificacionessie } from './application/ports/repositorioauditoriacalificacionsie';
import { repositorioauditoriacalificacionessieprisma } from './infrastructure/persistence/prismaauditoriacalificacioniesie.repository';
import { reconciliadorcolasincronizacionsie } from './infrastructure/queue/reconciliadorcolasincronizacionsie.service';
import { casousoresolverdiscrepanciasie } from './application/use-cases/resolversiediscrepancia.use-case';
import { tokenpuertocolasincronizacionsie } from './application/ports/siesincronizacioncola.port';
import { tokenpublicadorprogresosincronizacionsie } from './application/ports/publicadorprogresosincronizacionsie.port';
import { adaptadorcolasincronizacionsiebullmq } from './infrastructure/queue/bullmqcolasie.adapter';
import { adaptadorpasarelaprogresosincronizacionsie } from './infrastructure/realtime/siesincronizacionprogreso.gateway-adapter';
import { adaptadornavegadorpuppeteerauditoriasie } from './infrastructure/browser/puppeteernavegadorauditoriacalificacioniesie.adapter';
import { adaptadoralmaceninformessienode } from './infrastructure/files/nodealmaceninformesauditoriasie.adapter';
import { adaptadorconfiguracionnestauditoriacalificacionessie } from './infrastructure/config/nestsiecalificacionauditoriaconfiguracion.adapter';
import {
  tokennavegadorauditoriacalificacionessie,
  tokenconfiguracionauditoriacalificacionessie,
  tokenalmaceninformeauditoriacalificacionessie,
} from './application/ports/ejecucionauditoriacalificacionsie.ports';
import { tokenregistradoraplicacion } from '../../core/application/registradoraplicacion.port';
import { adaptadorregistroaplicacionnest } from '../../core/infrastructure/nest/registradoraplicacionnest.adapter';
import { casousoreintentarelementosincronizacionsie } from './application/use-cases/reintentarelementosincronizacionsie.use-case';
import { casousoreanudarsincronizacionsie } from './application/use-cases/reanudarsiesincronizacion.use-case';
import { casousoresolvergrupodiscrepanciassie } from './application/use-cases/resolvergrupodiscrepanciasie.use-case';
import type { repositoriosincronizacionsie } from './application/ports/repositoriosincronizacionsie';
import type { puertocolasincronizacionsie } from './application/ports/siesincronizacioncola.port';
import type { puertopublicadorprogresosincronizacionsie } from './application/ports/publicadorprogresosincronizacionsie.port';

@Module({
  controllers: [SieSyncController],
  providers: [
    guardiapermisos,
    adaptadorcolasincronizacionsiebullmq,
    adaptadorpasarelaprogresosincronizacionsie,
    {
      provide: tokenpuertocolasincronizacionsie,
      useExisting: adaptadorcolasincronizacionsiebullmq,
    },
    {
      provide: tokenpublicadorprogresosincronizacionsie,
      useExisting: adaptadorpasarelaprogresosincronizacionsie,
    },
    {
      provide: casousoprevisualizarsincronizacionsie,
      useFactory: (repository: repositoriosincronizacionsie) =>
        new casousoprevisualizarsincronizacionsie(repository),
      inject: [constanterepositoriosincronizacionsie],
    },
    {
      provide: casousoiniciarsincronizacionsie,
      useFactory: (
        repository: repositoriosincronizacionsie,
        queue: puertocolasincronizacionsie,
        publisher: puertopublicadorprogresosincronizacionsie,
      ) => new casousoiniciarsincronizacionsie(repository, queue, publisher),
      inject: [
        constanterepositoriosincronizacionsie,
        tokenpuertocolasincronizacionsie,
        tokenpublicadorprogresosincronizacionsie,
      ],
    },
    {
      provide: casousoreintentarelementosincronizacionsie,
      useFactory: (
        repository: repositoriosincronizacionsie,
        queue: puertocolasincronizacionsie,
        publisher: puertopublicadorprogresosincronizacionsie,
      ) => new casousoreintentarelementosincronizacionsie(repository, queue, publisher),
      inject: [
        constanterepositoriosincronizacionsie,
        tokenpuertocolasincronizacionsie,
        tokenpublicadorprogresosincronizacionsie,
      ],
    },
    {
      provide: casousoreanudarsincronizacionsie,
      useFactory: (
        repository: repositoriosincronizacionsie,
        queue: puertocolasincronizacionsie,
        publisher: puertopublicadorprogresosincronizacionsie,
      ) => new casousoreanudarsincronizacionsie(repository, queue, publisher),
      inject: [
        constanterepositoriosincronizacionsie,
        tokenpuertocolasincronizacionsie,
        tokenpublicadorprogresosincronizacionsie,
      ],
    },
    {
      provide: casousoresolvergrupodiscrepanciassie,
      useFactory: (repository: repositoriosincronizacionsie) =>
        new casousoresolvergrupodiscrepanciassie(repository),
      inject: [constanterepositoriosincronizacionsie],
    },
    reconciliadorcolasincronizacionsie,
    proveedoraplicacion(casousoobtenerestadosincronizacionsie),
    proveedoraplicacion(casousoresolverdiscrepanciasie),
    proveedoraplicacion(casousoverificaraccesosie),
    proveedoraplicacion(casousoverificarreplicalocalsie),
    { provide: tokenverificadoraccesosie, useClass: verificadoraccesosiepuppeteer },
    { provide: tokenverificadorreplicalocalsie, useClass: adaptadornavegadorreplicalocalsie },
    {
      provide: tokenconfiguracionauditoriacalificacionessie,
      useClass: adaptadorconfiguracionnestauditoriacalificacionessie,
    },
    {
      provide: tokennavegadorauditoriacalificacionessie,
      useClass: adaptadornavegadorpuppeteerauditoriasie,
    },
    {
      provide: tokenalmaceninformeauditoriacalificacionessie,
      useClass: adaptadoralmaceninformessienode,
    },
    { provide: tokenregistradoraplicacion, useClass: adaptadorregistroaplicacionnest },
    proveedoraplicacion(serviciogestionarinformesauditoriasie),
    proveedoraplicacion(serviciopublicarinformeauditoriasie),
    proveedoraplicacion(casousoauditarcalificacionessie),
    {
      provide: tokenrepositorioauditoriacalificacionessie,
      useClass: repositorioauditoriacalificacionessieprisma,
    },
    {
      provide: constanterepositoriosincronizacionsie,
      useClass: repositoriosincronizacionsieprisma,
    },
  ],
  exports: [
    casousoiniciarsincronizacionsie,
    casousoverificaraccesosie,
    casousoauditarcalificacionessie,
  ],
})
export class modulosincronizacionsie {}
