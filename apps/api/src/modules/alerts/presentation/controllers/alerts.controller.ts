import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { ListAlertsUseCase, MarkAlertReadUseCase, UpdateAlertStatusUseCase } from '../../application/use-cases/alert.use-cases';

@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AlertsController {
  constructor(
    private readonly listAlerts: ListAlertsUseCase,
    private readonly markAlertRead: MarkAlertReadUseCase,
    private readonly updateAlertStatus: UpdateAlertStatusUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('alerts:read')
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.listAlerts.execute(
      user.id,
      Math.min(Number(limit) || 50, 100),
      Number(offset) || 0,
      status,
    );
    return { statusCode: 200, message: 'Alertas obtenidas exitosamente', data: result.items, total: result.total };
  }

  @Patch(':id/read')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('alerts:update')
  async markRead(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return { statusCode: 200, message: 'Alerta marcada como leída', data: await this.markAlertRead.execute(id, user.id) };
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('alerts:update')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return {
      statusCode: 200,
      message: 'Estado de la alerta actualizado',
      data: await this.updateAlertStatus.execute(id, user.id, status),
    };
  }
}
