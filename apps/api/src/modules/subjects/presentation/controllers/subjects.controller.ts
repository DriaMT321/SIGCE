import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@academic/shared-types';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { ListSubjectsUseCase } from '../../application/use-cases/list-subjects.use-case';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class SubjectsController {
  constructor(private readonly listSubjects: ListSubjectsUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('subjects:read')
  async list(@Query('search') search?: string) {
    return { statusCode: 200, message: 'Materias obtenidas exitosamente', data: await this.listSubjects.execute(search) };
  }
}
