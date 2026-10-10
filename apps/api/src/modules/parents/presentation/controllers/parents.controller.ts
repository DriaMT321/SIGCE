import { Body, Controller, Delete, Get, Patch, Post, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateParentDto, UpdateParentDto } from '../../application/dto/parent.dto';
import { CreateParentUseCase, DeleteParentUseCase, ListParentsUseCase, UpdateParentUseCase } from '../../application/use-cases/parent.use-cases';

@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ParentsController {
  constructor(
    private readonly listParents: ListParentsUseCase,
    private readonly createParent: CreateParentUseCase,
    private readonly updateParent: UpdateParentUseCase,
    private readonly deleteParent: DeleteParentUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('parents:read')
  async list(@Query('search') search?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listParents.execute({ search, limit: Math.min(Number(limit) || 50, 100), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Familiares obtenidos exitosamente', data: result.items, total: result.total };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('parents:create')
  async create(@Body() dto: CreateParentDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Familiar creado exitosamente', data: await this.createParent.execute(dto, user.id, req.ip) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('parents:update')
  async update(@Param('id') id: string, @Body() dto: UpdateParentDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Familiar actualizado exitosamente', data: await this.updateParent.execute(id, dto, user.id, req.ip) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    await this.deleteParent.execute(id, user.id, req.ip);
    return { statusCode: 200, message: 'Familiar eliminado exitosamente' };
  }
}
