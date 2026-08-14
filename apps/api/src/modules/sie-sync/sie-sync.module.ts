import { Module } from '@nestjs/common';
import { SieSyncController } from './presentation/controllers/sie-sync.controller';
import { TriggerSieSyncUseCase } from './application/use-cases/trigger-sync.use-case';
import { GetSieSyncStatusUseCase } from './application/use-cases/get-sie-sync-status.use-case';
import { PrismaSieSynchronizationRepository } from './infrastructure/persistence/prisma-sie-synchronization.repository';
import { SIE_SYNC_REPOSITORY } from './domain/repositories/sie-synchronization.repository.interface';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  controllers: [SieSyncController],
  providers: [
    PermissionsGuard,
    TriggerSieSyncUseCase,
    GetSieSyncStatusUseCase,
    {
      provide: SIE_SYNC_REPOSITORY,
      useClass: PrismaSieSynchronizationRepository,
    },
  ],
  exports: [TriggerSieSyncUseCase],
})
export class SieSyncModule {}
