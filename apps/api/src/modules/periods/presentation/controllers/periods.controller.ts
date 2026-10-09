import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { ListPeriodsUseCase } from '../../application/use-cases/list-periods.use-case';
import { UpdatePeriodUseCase } from '../../application/use-cases/update-period.use-case';
import { UpdatePeriodDto } from '../../application/dto/period.dto';

@Controller('periods')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PeriodsController {
  constructor(
    private readonly listPeriods: ListPeriodsUseCase,
    private readonly updatePeriod: UpdatePeriodUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('periods:read')
  async list(@Query('academicYearId') academicYearId?: string) {
    return { statusCode: 200, message: 'Periodos académicos obtenidos exitosamente', data: await this.listPeriods.execute(academicYearId) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @Permissions('periods:update')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePeriodDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const updated = await this.updatePeriod.execute(id, dto, user.id, req.ip);
    return { statusCode: 200, message: 'Periodo académico actualizado exitosamente', data: updated };
  }
}
