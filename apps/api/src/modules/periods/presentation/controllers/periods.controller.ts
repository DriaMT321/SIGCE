import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@academic/shared-types';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { ListPeriodsUseCase } from '../../application/use-cases/list-periods.use-case';

@Controller('periods')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PeriodsController {
  constructor(private readonly listPeriods: ListPeriodsUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('periods:read')
  async list(@Query('academicYearId') academicYearId?: string) {
    return { statusCode: 200, message: 'Periodos académicos obtenidos exitosamente', data: await this.listPeriods.execute(academicYearId) };
  }
}
