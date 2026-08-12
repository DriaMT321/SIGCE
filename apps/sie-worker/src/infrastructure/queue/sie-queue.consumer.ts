import { Worker, Job } from 'bullmq';
import { SieSyncJobData, SieSyncResult } from '@academic/shared-types';
import { workerConfig } from '../../config/worker.config';
import { ProcessSieSyncUseCase } from '../../application/use-cases/process-sie-sync.use-case';

export class SieQueueConsumer {
  private worker: Worker<SieSyncJobData, SieSyncResult> | null = null;

  constructor(private readonly processUseCase: ProcessSieSyncUseCase) {}

  start(): void {
    console.log(`📡 [BullMQ Worker] Escuchando la cola "${workerConfig.queueName}" en Redis ${workerConfig.redis.host}:${workerConfig.redis.port}...`);

    this.worker = new Worker<SieSyncJobData, SieSyncResult>(
      workerConfig.queueName,
      async (job: Job<SieSyncJobData, SieSyncResult>) => {
        console.log(`\n📥 [BullMQ] Trabajo recibido [ID: ${job.id}, Name: ${job.name}]`);
        return this.processUseCase.execute(job.data);
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
