import { PrismaClient, SieSyncStatus as PrismaSieSyncStatus } from '@prisma/client';
import { ISieAutomationPort } from '../../domain/ports/sie-automation.port';
import { SieSyncJobData, SieSyncResult, SieSyncStatus } from '@academic/shared-types';

export class ProcessSieSyncUseCase {
  constructor(
    private readonly automationPort: ISieAutomationPort,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(jobData: SieSyncJobData): Promise<SieSyncResult> {
    console.log(`\n⚙️ [Caso de Uso RPA] Procesando item de sincronización ID: ${jobData.itemId}`);

    // 1. Actualizar estado a PROCESSING en base de datos
    await this.prisma.sieSynchronizationItem.update({
      where: { id: jobData.itemId },
      data: {
        status: PrismaSieSyncStatus.PROCESSING,
      },
    });

    await this.prisma.sieSynchronization.update({
      where: { id: jobData.synchronizationId },
      data: {
        status: PrismaSieSyncStatus.PROCESSING,
        startedAt: new Date(),
      },
    });

    // 2. Ejecutar RPA mediante el puerto de automatización
    const result = await this.automationPort.processGradeSynchronization(jobData);

    // 3. Persistir resultado de verificación en PostgreSQL
    const prismaStatus =
      result.status === SieSyncStatus.VERIFIED
        ? PrismaSieSyncStatus.VERIFIED
        : PrismaSieSyncStatus.FAILED;

    await this.prisma.sieSynchronizationItem.update({
      where: { id: jobData.itemId },
      data: {
        localValue: result.localValue,
        sieValue: result.sieValue,
        status: prismaStatus,
        errorMessage: result.errorMessage || null,
        verifiedAt: new Date(result.verifiedAt),
      },
    });

    await this.prisma.sieSynchronization.update({
      where: { id: jobData.synchronizationId },
      data: {
        status: prismaStatus,
        processedItems: { increment: 1 },
        errorCount: result.isMatched ? undefined : { increment: 1 },
        completedAt: new Date(),
      },
    });

    // 4. Registrar auditoría de la sincronización RPA
    await this.prisma.auditLog.create({
      data: {
        action: 'SYNC_SIE',
        entity: 'SieSynchronization',
        entityId: jobData.synchronizationId,
        newValue: {
          itemId: jobData.itemId,
          studentRude: jobData.studentRude,
          localValue: result.localValue,
          sieValue: result.sieValue,
          status: result.status,
          verified: result.isMatched,
        },
        ipAddress: '127.0.0.1',
        userAgent: 'SieRpaWorker/1.0',
      },
    });

    console.log(`✅ [Caso de Uso RPA] Sincronización finalizada con estado: ${result.status}`);
    return result;
  }
}
