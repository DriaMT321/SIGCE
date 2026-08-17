import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@academic/shared-types';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { ListAcademicYearsUseCase } from '../../application/use-cases/list-academic-years.use-case';

@Controller('academic-years')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AcademicYearsController {
  constructor(private readonly listAcademicYears: ListAcademicYearsUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('academic-years:read')
  async list() {
    return { statusCode: 200, message: 'Gestiones académicas obtenidas exitosamente', data: await this.listAcademicYears.execute() };
  }
}
