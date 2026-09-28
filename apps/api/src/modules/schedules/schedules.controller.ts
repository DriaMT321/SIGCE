import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SchedulesService } from './schedules.service';
import { DayOfWeek } from '@prisma/client';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  async list(
    @Query('courseId') courseId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('dayOfWeek') dayOfWeek?: DayOfWeek,
    @Query('academicYearId') academicYearId?: string,
  ) {
    const data = await this.schedulesService.list({
      courseId,
      teacherId,
      dayOfWeek,
      academicYearId,
    });
    return {
      statusCode: 200,
      message: 'Horarios obtenidos exitosamente',
      data,
      total: data.length,
    };
  }

  @Get('my-schedule')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  async getMySchedule(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.schedulesService.getMySchedule(user);
    return {
      statusCode: 200,
      message: 'Horario personal obtenido exitosamente',
      data,
    };
  }

  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  async getCourseSchedule(@Param('courseId') courseId: string) {
    const data = await this.schedulesService.getCourseSchedule(courseId);
    return {
      statusCode: 200,
      message: 'Horario del curso obtenido exitosamente',
      data,
    };
  }

  @Get('teacher/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  async getTeacherSchedule(@Param('teacherId') teacherId: string) {
    const data = await this.schedulesService.getTeacherSchedule(teacherId);
    return {
      statusCode: 200,
      message: 'Horario del docente obtenido exitosamente',
      data,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async create(
    @Body()
    body: {
      courseId: string;
      subjectId: string;
      teacherId: string;
      academicYearId?: string;
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      periodIndex: number;
      classroom?: string;
    },
  ) {
    const data = await this.schedulesService.create(body);
    return {
      statusCode: 201,
      message: 'Sesión de horario creada exitosamente',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  async delete(@Param('id') id: string) {
    await this.schedulesService.delete(id);
    return {
      statusCode: 200,
      message: 'Sesión de horario eliminada exitosamente',
    };
  }
}
