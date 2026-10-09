import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateAttendanceDto, UpdateAttendanceDto } from '../../application/dto/attendance.dto';
import { CreateAttendanceUseCase, ListAttendanceUseCase, UpdateAttendanceUseCase } from '../../application/use-cases/attendance.use-cases';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AttendanceController {
  constructor(private readonly listAttendance: ListAttendanceUseCase, private readonly createAttendance: CreateAttendanceUseCase, private readonly updateAttendance: UpdateAttendanceUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('attendance:read')
  async list(@CurrentUser() user: AuthenticatedUser, @Query('studentId') studentId?: string, @Query('courseId') courseId?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listAttendance.execute({ studentId, courseId, from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined, parentUserId: user.role === UserRole.PARENT ? user.id : undefined, limit: Math.min(Number(limit) || 100, 200), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Asistencia obtenida exitosamente', data: result.items, total: result.total };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('attendance:create')
  async create(@Body() dto: CreateAttendanceDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Asistencia registrada exitosamente', data: await this.createAttendance.execute(dto, user.id, req.ip, user.role) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('attendance:update')
  async update(@Param('id') id: string, @Body() dto: UpdateAttendanceDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Asistencia actualizada exitosamente', data: await this.updateAttendance.execute(id, dto, user.id, req.ip, user.role) };
  }
}
