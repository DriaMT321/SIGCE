import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@academic/shared-types';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Permissions } from '../../../../common/decorators/permissions.decorator';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { AuthenticatedUser } from '@academic/shared-types';
import { CreateStudentDto, UpdateStudentDto } from '../../application/dto/student.dto';
import { CreateStudentUseCase, DeleteStudentUseCase, GetStudentUseCase, ListStudentsUseCase, UpdateStudentUseCase } from '../../application/use-cases/student.use-cases';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class StudentsController {
  constructor(
    private readonly listStudents: ListStudentsUseCase,
    private readonly getStudent: GetStudentUseCase,
    private readonly createStudent: CreateStudentUseCase,
    private readonly updateStudent: UpdateStudentUseCase,
    private readonly deleteStudent: DeleteStudentUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('students:read')
  async list(@CurrentUser() user: AuthenticatedUser, @Query('search') search?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const result = await this.listStudents.execute({ search, parentUserId: user.role === UserRole.PARENT ? user.id : undefined, limit: Math.min(Number(limit) || 50, 1000), offset: Number(offset) || 0 });
    return { statusCode: 200, message: 'Estudiantes obtenidos exitosamente', data: result.items, total: result.total };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER, UserRole.PARENT)
  @Permissions('students:read')
  async get(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) { return { statusCode: 200, message: 'Estudiante obtenido exitosamente', data: await this.getStudent.execute(id, user.role === UserRole.PARENT ? user.id : undefined) }; }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('students:create')
  async create(@Body() dto: CreateStudentDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 201, message: 'Estudiante creado exitosamente', data: await this.createStudent.execute(dto, user.id, req.ip) };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY)
  @Permissions('students:update')
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return { statusCode: 200, message: 'Estudiante actualizado exitosamente', data: await this.updateStudent.execute(id, dto, user.id, req.ip) };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR)
  @Permissions('students:delete')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    await this.deleteStudent.execute(id, user.id, req.ip);
    return { statusCode: 200, message: 'Estudiante eliminado exitosamente' };
  }
}
