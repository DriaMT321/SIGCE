import { Module } from '@nestjs/common';
import { SieSyncController } from './presentation/controllers/sie-sync.controller';
import { TriggerSieSyncUseCase } from './application/use-cases/trigger-sync.use-case';

@Module({
  controllers: [SieSyncController],
  providers: [TriggerSieSyncUseCase],
  exports: [TriggerSieSyncUseCase],
})
export class SieSyncModule {}
