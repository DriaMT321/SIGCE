import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '@academic/shared-types';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async getUsers(
    @Query('role') role?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const data = await this.getUsersUseCase.execute({
      role,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    return {
      statusCode: 200,
      message: 'Usuarios obtenidos exitosamente',
      data: data.items,
      total: data.total,
    };
  }
}
