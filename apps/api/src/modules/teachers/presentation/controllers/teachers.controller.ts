import { Body, Controller, Delete, Get, Patch, Post, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateTeacherDto, UpdateTeacherDto } from '../../application/dto/teacher.dto';
import { CreateTeacherUseCase, DeleteTeacherUseCase, ListTeachersUseCase, UpdateTeacherUseCase } from '../../application/use-cases/teacher.use-cases';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class TeachersController {
  constructor(
    private readonly listTeachers: ListTeachersUseCase,
    private readonly createTeacher: CreateTeacherUseCase,
    private readonly updateTeacher: UpdateTeacherUseCase,
    private readonly deleteTeacher: DeleteTeacherUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('teachers:read')
  async list(@Query('search') search?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listTeachers.execute({ search, limit: Math.min(Number(limit) || 50, 100), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Docentes obtenidos exitosamente', data: result.items, total: result.total };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('teachers:create')
  async create(@Body() dto: CreateTeacherDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Docente creado exitosamente', data: await this.createTeacher.execute(dto, user.id, req.ip) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('teachers:update')
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Docente actualizado exitosamente', data: await this.updateTeacher.execute(id, dto, user.id, req.ip) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    await this.deleteTeacher.execute(id, user.id, req.ip);
    return { statusCode: 200, message: 'Docente eliminado exitosamente' };
  }
}
