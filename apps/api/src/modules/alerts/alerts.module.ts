import { Module } from '@nestjs/common';
import { AlertsController } from './presentation/controllers/alerts.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ALERT_REPOSITORY } from './domain/repositories/alert.repository.interface';
import { PrismaAlertRepository } from './infrastructure/persistence/prisma-alert.repository';
import { ListAlertsUseCase, MarkAlertReadUseCase } from './application/use-cases/alert.use-cases';

@Module({
  controllers: [AlertsController],
  providers: [PermissionsGuard, { provide: ALERT_REPOSITORY, useClass: PrismaAlertRepository }, ListAlertsUseCase, MarkAlertReadUseCase],
})
export class AlertsModule {}
