import { PrismaClient } from '@prisma/client';
import { PuppeteerSieAdapter } from './infrastructure/browser/puppeteer-sie.adapter';
import { ProcessSieSyncUseCase } from './application/use-cases/process-sie-sync.use-case';
import { SieQueueConsumer } from './infrastructure/queue/sie-queue.consumer';
import { RedisSieEventPublisher } from './infrastructure/events/redis-sie-event.publisher';

export class SieWorkerApplication {
  private prisma: PrismaClient;
  private puppeteerAdapter: PuppeteerSieAdapter;
  private processUseCase: ProcessSieSyncUseCase;
  private queueConsumer: SieQueueConsumer;
  private readonly eventPublisher: RedisSieEventPublisher;

  constructor() {
    this.prisma = new PrismaClient();
    this.puppeteerAdapter = new PuppeteerSieAdapter();
    this.processUseCase = new ProcessSieSyncUseCase(this.puppeteerAdapter, this.prisma);
    this.eventPublisher = new RedisSieEventPublisher();
    this.queueConsumer = new SieQueueConsumer(this.processUseCase, this.eventPublisher);
  }

  async start(): Promise<void> {
    console.log('===============================================================');
    console.log('🤖 INICIANDO WORKER RPA SIE (BULLMQ + PUPPETEER)');
    console.log('===============================================================\n');

    await this.prisma.$connect();
    console.log('✅ Base de datos conectada en el Worker');

    await this.eventPublisher.start();
    this.queueConsumer.start();
    console.log('🚀 Worker RPA listo para procesar solicitudes de sincronización\n');
  }

  async stop(): Promise<void> {
    console.log('\n🛑 Deteniendo Worker RPA...');
    await this.queueConsumer.stop();
    await this.eventPublisher.stop();
    await this.puppeteerAdapter.close();
    await this.prisma.$disconnect();
    console.log('✅ Worker RPA apagado de forma segura.');
  }
}
