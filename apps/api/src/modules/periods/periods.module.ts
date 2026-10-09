import { Module } from '@nestjs/common';
import { PeriodsController } from './presentation/controllers/periods.controller';
import { ListPeriodsUseCase } from './application/use-cases/list-periods.use-case';
import { UpdatePeriodUseCase } from './application/use-cases/update-period.use-case';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  controllers: [PeriodsController],
  providers: [PermissionsGuard, ListPeriodsUseCase, UpdatePeriodUseCase],
})
export class PeriodsModule {}
