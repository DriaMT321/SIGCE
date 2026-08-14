import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../../common/database/prisma.service';
import { EventsGateway } from '../../../../common/websocket/events.gateway';
import { SIE_SYNC_QUEUE } from '../../../../common/queue/queue.module';
import { TriggerSieSyncDto } from '../dto/trigger-sync.dto';
import { SieSyncStatus, SieSyncJobData } from '@academic/shared-types';

@Injectable()
export class TriggerSieSyncUseCase {
  private readonly logger = new Logger(TriggerSieSyncUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    @InjectQueue(SIE_SYNC_QUEUE)
    private readonly sieQueue: Queue<SieSyncJobData>,
  ) {}

  async execute(dto: TriggerSieSyncDto, userId: string) {
    this.logger.log(`Iniciando solicitud de sincronización SIE por usuario ${userId}`);

    // 1. Crear registro maestro de sincronización
    const sync = await this.prisma.sieSynchronization.create({
      data: {
        requestedById: userId,
        syncType: dto.syncType,
        status: SieSyncStatus.QUEUED,
        totalItems: 1, // En bootstrap/demo encolamos 1 item de prueba
      },
    });

    // 2. Crear item de sincronización
    const academicYear = await this.prisma.academicYear.findFirst({
      where: { isActive: true },
      include: { periods: true },
    });

    const subject = await this.prisma.subject.findFirst();

    // Crear un estudiante de prueba si no existe para la demo
    const student = await this.prisma.student.upsert({
      where: { rude: '807300012024001' },
      update: {},
      create: {
        rude: '807300012024001',
        ci: '10023456',
        firstName: 'Juan',
        lastName: 'Pérez García',
        birthDate: new Date('2010-05-15'),
        gender: 'MALE',
      },
    });

    const periodId = academicYear?.periods[0]?.id;

    if (!periodId || !subject) {
      throw new Error('No se encontraron períodos académicos o materias para sincronizar');
    }

    const item = await this.prisma.sieSynchronizationItem.create({
      data: {
        synchronizationId: sync.id,
        studentId: student.id,
        subjectId: subject.id,
        periodId: periodId,
        localValue: 85,
        status: SieSyncStatus.QUEUED,
      },
    });

    // 3. Encolar trabajo en BullMQ para el Worker RPA
    const jobData: SieSyncJobData = {
      synchronizationId: sync.id,
      itemId: item.id,
      studentRude: student.rude,
      studentCi: student.ci,
      academicYear: academicYear.year,
      periodNumber: 1,
      subjectCode: subject.code,
      localGrade: 85,
    };

    const job = await this.sieQueue.add('sync-grade-sie', jobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: false,
      removeOnFail: false,
    });

    this.logger.log(`Trabajo encolado en BullMQ con Job ID: ${job.id}`);

    // 4. Notificar vía WebSocket que la sincronización fue encolada
    this.eventsGateway.emitSieSyncProgress({
      synchronizationId: sync.id,
      status: SieSyncStatus.QUEUED,
      progress: 0,
      total: 1,
    });
    this.eventsGateway.emitSieSyncQueued({
      synchronizationId: sync.id,
      status: SieSyncStatus.QUEUED,
      total: 1,
    });

    return {
      synchronizationId: sync.id,
      jobId: job.id,
      status: SieSyncStatus.QUEUED,
      message: 'Sincronización encolada exitosamente en BullMQ',
    };
  }
}
