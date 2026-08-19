import { Body, Controller, Post, Get, UseGuards, Param, Query } from '@nestjs/common';
import { TriggerSieSyncUseCase } from '../../application/use-cases/trigger-sync.use-case';
import { TriggerSieSyncDto } from '../../application/dto/trigger-sync.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { UserRole, AuthenticatedUser } from '@academic/shared-types';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { GetSieSyncStatusUseCase } from '../../application/use-cases/get-sie-sync-status.use-case';

@Controller('sie-sync')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class SieSyncController {
  constructor(
    private readonly triggerSyncUseCase: TriggerSieSyncUseCase,
    private readonly getSieSyncStatusUseCase: GetSieSyncStatusUseCase,
  ) {}

  @Post('trigger')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('sie:execute')
  async triggerSync(
    @Body() dto: TriggerSieSyncDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.triggerSyncUseCase.execute(dto, user.id);
    return {
      statusCode: 202,
      message: 'Sincronización con el SIE iniciada de forma asíncrona',
      data: result,
    };
  }

  @Get('status/:id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('sie:read')
  async getSyncStatus(@Param('id') id: string) {
    const sync = await this.getSieSyncStatusUseCase.execute(id);

    return {
      statusCode: 200,
      data: sync,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('sie:read')
  async list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.getSieSyncStatusUseCase.list(Math.min(Number(limit) || 20, 100), Number(offset) || 0);
    return { statusCode: 200, message: 'Sincronizaciones obtenidas exitosamente', data: result.items, total: result.total };
  }
}
