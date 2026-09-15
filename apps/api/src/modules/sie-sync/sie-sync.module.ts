import { Module } from '@nestjs/common';
import { SieSyncController } from './presentation/controllers/sie-sync.controller';
import { TriggerSieSyncUseCase } from './application/use-cases/trigger-sync.use-case';
import { GetSieSyncStatusUseCase } from './application/use-cases/get-sie-sync-status.use-case';
import { PrismaSieSynchronizationRepository } from './infrastructure/persistence/prisma-sie-synchronization.repository';
import { SIE_SYNC_REPOSITORY } from './domain/repositories/sie-synchronization.repository.interface';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckSieLoginUseCase } from './application/use-cases/check-sie-login.use-case';
import { AuditSieGradesUseCase } from './application/use-cases/audit-sie-grades.use-case';

@Module({
  controllers: [SieSyncController],
  providers: [
    PermissionsGuard,
    TriggerSieSyncUseCase,
    GetSieSyncStatusUseCase,
    CheckSieLoginUseCase,
    AuditSieGradesUseCase,
    {
      provide: SIE_SYNC_REPOSITORY,
      useClass: PrismaSieSynchronizationRepository,
    },
  ],
  exports: [TriggerSieSyncUseCase, CheckSieLoginUseCase, AuditSieGradesUseCase],
})
export class SieSyncModule {}

