import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventsGateway } from '../../../../common/websocket/events.gateway';
import { SIE_SYNC_QUEUE } from '../../../../common/queue/queue.module';
import { TriggerSieSyncDto } from '../dto/trigger-sync.dto';
import { SieSyncStatus, SieSyncJobData } from '@academic/shared-types';
import { ISieSynchronizationRepository, SIE_SYNC_REPOSITORY } from '../../domain/repositories/sie-synchronization.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class TriggerSieSyncUseCase {
  private readonly logger = new Logger(TriggerSieSyncUseCase.name);

  constructor(
    private readonly eventsGateway: EventsGateway,
    @Inject(SIE_SYNC_REPOSITORY)
    private readonly repository: ISieSynchronizationRepository,
    @InjectQueue(SIE_SYNC_QUEUE)
    private readonly sieQueue: Queue<SieSyncJobData>,
  ) {}

  async execute(dto: TriggerSieSyncDto, userId: string) {
    this.logger.log(`Iniciando solicitud de sincronización SIE por usuario ${userId}`);

    const created = await this.repository.createFromGrades({ ...dto, requestedById: userId });
    if (!created || !created.jobs.length) {
      throw new BadRequestException('No existen calificaciones locales que coincidan con los filtros seleccionados');
    }

    const jobs = await Promise.all(created.jobs.map((jobData: SieSyncJobData) => this.sieQueue.add('sync-grade-sie', jobData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: false,
      removeOnFail: false,
    })));

    this.logger.log(`${jobs.length} trabajos encolados en BullMQ para sincronización ${created.synchronization.id}`);

    // 4. Notificar vía WebSocket que la sincronización fue encolada
    this.eventsGateway.emitSieSyncProgress({
      synchronizationId: created.synchronization.id,
      status: SieSyncStatus.QUEUED,
      progress: 0,
      total: created.jobs.length,
    });
    this.eventsGateway.emitSieSyncQueued({
      synchronizationId: created.synchronization.id,
      status: SieSyncStatus.QUEUED,
      total: created.jobs.length,
    });

    return {
      synchronizationId: created.synchronization.id,
      jobId: jobs[0]?.id ?? null,
      jobIds: jobs.map((job) => job.id),
      status: SieSyncStatus.QUEUED,
      totalItems: created.jobs.length,
      message: 'Sincronización local encolada exitosamente en BullMQ',
    };
  }
}
