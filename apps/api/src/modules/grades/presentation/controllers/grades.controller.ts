import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateGradeDto, UpdateGradeDto, CreateBulkGradesDto } from '../../application/dto/grade.dto';
import {
  CreateGradeUseCase,
  ListGradesUseCase,
  UpdateGradeUseCase,
  CreateBulkGradesUseCase,
} from '../../application/use-cases/grade.use-cases';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class GradesController {
  constructor(
    private readonly listGrades: ListGradesUseCase,
    private readonly createGrade: CreateGradeUseCase,
    private readonly updateGrade: UpdateGradeUseCase,
    private readonly createBulkGrades: CreateBulkGradesUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('grades:read')
  async list(@CurrentUser() user: AuthenticatedUser, @Query('studentId') studentId?: string, @Query('enrollmentId') enrollmentId?: string, @Query('periodId') periodId?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listGrades.execute({ studentId, enrollmentId, periodId, parentUserId: user.role === UserRole.PARENT ? user.id : undefined, limit: Math.min(Number(limit) || 100, 200), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Calificaciones obtenidas exitosamente', data: result.items, total: result.total };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('grades:create')
  async create(@Body() dto: CreateGradeDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Calificación registrada exitosamente', data: await this.createGrade.execute(dto, user.id, req.ip, user.role) };
  }

  @Post('bulk')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('grades:create')
  async createBulk(@Body() dto: CreateBulkGradesDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const result = await this.createBulkGrades.execute(dto, user.id, req.ip, user.role);
    return { statusCode: 201, message: 'Calificaciones registradas exitosamente en bloque', data: result };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('grades:update')
  async update(@Param('id') id: string, @Body() dto: UpdateGradeDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Calificación actualizada exitosamente', data: await this.updateGrade.execute(id, dto, user.id, req.ip, user.role) };
  }
}
