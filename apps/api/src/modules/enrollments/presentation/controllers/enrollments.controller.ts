import { Body, Controller, Get, Post, Patch, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../../application/dto/enrollment.dto';
import { CreateEnrollmentUseCase, ListEnrollmentsUseCase, UpdateEnrollmentUseCase } from '../../application/use-cases/enrollment.use-cases';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class EnrollmentsController {
  constructor(private readonly listEnrollments: ListEnrollmentsUseCase, private readonly createEnrollment: CreateEnrollmentUseCase, private readonly updateEnrollment: UpdateEnrollmentUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('enrollments:read')
  async list(@CurrentUser() user: AuthenticatedUser, @Query('academicYearId') academicYearId?: string, @Query('courseId') courseId?: string, @Query('studentId') studentId?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listEnrollments.execute({ academicYearId, courseId, studentId, parentUserId: user.role === UserRole.PARENT ? user.id : undefined, limit: Math.min(Number(limit) || 50, 1000), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Matrículas obtenidas exitosamente', data: result.items, total: result.total };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('enrollments:create')
  async create(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Matrícula creada exitosamente', data: await this.createEnrollment.execute(dto, user.id, req.ip) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('enrollments:update')
  async update(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Matrícula actualizada exitosamente', data: await this.updateEnrollment.execute(id, dto, user.id, req.ip) };
  }
}
