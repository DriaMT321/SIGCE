import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { CreateCourseDto, UpdateCourseDto } from '../../application/dto/course.dto';
import { CreateCourseUseCase, DeleteCourseUseCase, GetCourseUseCase, ListCoursesUseCase, UpdateCourseUseCase } from '../../application/use-cases/course.use-cases';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CoursesController {
  constructor(
    private readonly listCourses: ListCoursesUseCase,
    private readonly getCourse: GetCourseUseCase,
    private readonly createCourse: CreateCourseUseCase,
    private readonly updateCourse: UpdateCourseUseCase,
    private readonly deleteCourse: DeleteCourseUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('courses:read')
  async list(@Query('academicYearId') academicYearId?: string, @Query('search') search?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listCourses.execute({ academicYearId, search, limit: Math.min(Number(limit) || 50, 100), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Cursos obtenidos exitosamente', data: result.items, total: result.total };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  @Permissions('courses:read')
  async get(@Param('id') id: string) { return { statusCode: 200, message: 'Curso obtenido exitosamente', data: await this.getCourse.execute(id) }; }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('courses:create')
  async create(@Body() dto: CreateCourseDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Curso creado exitosamente', data: await this.createCourse.execute(dto, user.id, req.ip) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('courses:update')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Curso actualizado exitosamente', data: await this.updateCourse.execute(id, dto, user.id, req.ip) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @Permissions('courses:delete')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    await this.deleteCourse.execute(id, user.id, req.ip);
    return { statusCode: 200, message: 'Curso eliminado exitosamente' };
  }
}
