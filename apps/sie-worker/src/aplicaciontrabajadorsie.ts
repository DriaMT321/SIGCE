import { PrismaClient } from '@prisma/client';
import { adaptadorpuppeteersie } from './infrastructure/browser/adaptadorpuppeteersie.adapter';
import { adaptadorpuppeteersiereal } from './infrastructure/browser/adaptadorpuppeteersiereal.adapter';
import { puertoautomatizacionsie } from './application/ports/automatizacionsie.port';
import { casousoprocesarsincronizacionsie } from './application/use-cases/procesarsincronizacionsie.use-case';
import { consumidorcolasie } from './infrastructure/queue/consumidorcolasie.consumer';
import { publicadorrediseventossie } from './infrastructure/events/publicadoreventossieredis.publisher';
import { configuraciontrabajador } from './config/configuraciontrabajador.config';
import { adaptadorprismaprocesamientosie } from './infrastructure/persistence/adaptadorprismaprocesamientosie.adapter';

export class aplicaciontrabajadorsie {
  private clienteprisma: PrismaClient;
  private adaptadorpuppeteer: puertoautomatizacionsie;
  private casousoprocesarsincronizacion: casousoprocesarsincronizacionsie;
  private consumidorcola: consumidorcolasie;
  private readonly publicadoreventos: publicadorrediseventossie;

  constructor() {
    this.clienteprisma = new PrismaClient();
    this.adaptadorpuppeteer =
      configuraciontrabajador.sie.modo === 'real'
        ? new adaptadorpuppeteersiereal()
        : new adaptadorpuppeteersie();
    this.casousoprocesarsincronizacion = new casousoprocesarsincronizacionsie(
      this.adaptadorpuppeteer,
      new adaptadorprismaprocesamientosie(this.clienteprisma),
      configuraciontrabajador.sie.umbralpausadiscrepancias,
      configuraciontrabajador.sie.plazorevisiondiscrepanciashoras,
    );
    this.publicadoreventos = new publicadorrediseventossie();
    this.consumidorcola = new consumidorcolasie(
      this.casousoprocesarsincronizacion,
      this.publicadoreventos,
    );
  }

  async iniciar(): Promise<void> {
    console.log('===============================================================');
    console.log('INICIANDO WORKER RPA SIE (BULLMQ + PUPPETEER)');
    console.log('===============================================================\n');

    await this.clienteprisma.$connect();
    console.log('Base de datos conectada en el Worker');

    await this.publicadoreventos.iniciar();
    this.consumidorcola.iniciar();
    console.log('Worker RPA listo para procesar solicitudes de sincronizacion\n');
  }

  async detener(): Promise<void> {
    console.log('\nDeteniendo Worker RPA...');
    await this.consumidorcola.detener();
    await this.publicadoreventos.detener();
    await this.adaptadorpuppeteer.cerrar();
    await this.clienteprisma.$disconnect();
    console.log('Worker RPA apagado de forma segura.');
  }
}
