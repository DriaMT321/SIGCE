import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetAuditLogsUseCase } from '../../application/use-cases/get-audit-logs.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '@academic/shared-types';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @Permissions('audit:read')
  async getAuditLogs(
    @Query('entity') entity?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const data = await this.getAuditLogsUseCase.execute({
      entity,
      userId,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    return {
      statusCode: 200,
      message: 'Bitácora de auditoría recuperada exitosamente',
      data: data.items,
      total: data.total,
    };
  }
}
