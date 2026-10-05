import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AssignmentStatus, AssignmentType } from '@prisma/client';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/assignment.dto';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('courseId') courseId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('type') type?: AssignmentType,
    @Query('status') status?: AssignmentStatus,
    @Query('search') search?: string,
  ) {
    const data = await this.assignmentsService.list(
      { courseId, subjectId, teacherId, type, status, search },
      user,
    );
    return {
      statusCode: 200,
      message: 'Tareas y exámenes obtenidos exitosamente',
      data,
      total: data.length,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER)
  async create(
    @Body() dto: CreateAssignmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.assignmentsService.create(dto, user);
    return {
      statusCode: 201,
      message: 'Actividad académica creada exitosamente',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAssignmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.assignmentsService.update(id, dto, user);
    return {
      statusCode: 200,
      message: 'Actividad académica actualizada exitosamente',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.assignmentsService.delete(id, user);
    return {
      statusCode: 200,
      message: data.message,
    };
  }
}
