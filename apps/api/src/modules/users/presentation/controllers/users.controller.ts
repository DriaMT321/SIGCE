import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { CreateUserDto, UpdateUserDto } from '../../application/dto/create-user.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async getUsers(
    @Query('role') role?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const data = await this.getUsersUseCase.execute({
      role,
      search,
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

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async createUser(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const created = await this.createUserUseCase.execute(dto, user?.id, req.ip);

    return {
      statusCode: 201,
      message: 'Usuario institucional creado exitosamente',
      data: created,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const updated = await this.updateUserUseCase.execute(id, dto, user?.id, req.ip);

    return {
      statusCode: 200,
      message: 'Usuario actualizado exitosamente',
      data: updated,
    };
  }
}
