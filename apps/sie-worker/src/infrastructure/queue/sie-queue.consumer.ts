import { Worker, Job } from 'bullmq';
import { SieSyncJobData, SieSyncResult } from '@academic/shared-types';
import { workerConfig } from '../../config/worker.config';
import { ProcessSieSyncUseCase } from '../../application/use-cases/process-sie-sync.use-case';
import { ISieEventPublisher } from '../../domain/ports/sie-event-publisher.port';

export class SieQueueConsumer {
  private worker: Worker<SieSyncJobData, SieSyncResult> | null = null;

  constructor(
    private readonly processUseCase: ProcessSieSyncUseCase,
    private readonly eventPublisher: ISieEventPublisher,
  ) {}

  start(): void {
    console.log(`📡 [BullMQ Worker] Escuchando la cola "${workerConfig.queueName}" en Redis ${workerConfig.redis.host}:${workerConfig.redis.port}...`);

    this.worker = new Worker<SieSyncJobData, SieSyncResult>(
      workerConfig.queueName,
      async (job: Job<SieSyncJobData, SieSyncResult>) => {
        console.log(`\n📥 [BullMQ] Trabajo recibido [ID: ${job.id}, Name: ${job.name}]`);
        await this.eventPublisher.publish('sie.sync.started', {
          synchronizationId: job.data.synchronizationId,
          itemId: job.data.itemId,
          status: 'PROCESSING',
        });
        try {
          const result = await this.processUseCase.execute(job.data);
          await this.eventPublisher.publish(
            result.isMatched ? 'sie.sync.verified' : 'sie.sync.failed',
            { ...result },
          );
          return result;
        } catch (error: unknown) {
          await this.eventPublisher.publish('sie.sync.failed', {
            synchronizationId: job.data.synchronizationId,
            itemId: job.data.itemId,
            error: error instanceof Error ? error.message : 'Error desconocido en el Worker',
          });
          throw error;
        }
      },
      {
        connection: {
          host: workerConfig.redis.host,
          port: workerConfig.redis.port,
          password: workerConfig.redis.password,
        },
        concurrency: 1, // Ejecutar 1 tarea RPA a la vez para control de sesión de navegador
      },
    );

    this.worker.on('completed', (job: Job<SieSyncJobData, SieSyncResult>) => {
      console.log(`🎉 [BullMQ] Trabajo completado exitosamente: ${job.id}`);
    });

    this.worker.on('failed', (job: Job<SieSyncJobData, SieSyncResult> | undefined, err: Error) => {
      console.error(`❌ [BullMQ] Trabajo fallido [ID: ${job?.id}]: ${err.message}`);
    });
  }

  async stop(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      console.log('🛑 [BullMQ Worker] Worker detenido.');
    }
  }
}
