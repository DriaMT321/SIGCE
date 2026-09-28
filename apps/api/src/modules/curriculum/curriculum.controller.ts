import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@academic/shared-types';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurriculumService, UpdateCurriculumProgressInput } from './curriculum.service';
import { CurriculumStatus } from '@prisma/client';

@Controller('curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  async list(
    @Query('courseId') courseId?: string,
    @Query('gradeLevel') gradeLevel?: string,
    @Query('subjectId') subjectId?: string,
    @Query('periodNumber') periodNumber?: string,
    @Query('status') status?: CurriculumStatus,
    @Query('search') search?: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    const data = await this.curriculumService.list({
      courseId,
      gradeLevel: gradeLevel ? Number(gradeLevel) : undefined,
      subjectId,
      periodNumber: periodNumber ? Number(periodNumber) : undefined,
      status,
      search,
      academicYearId,
    });
    return {
      statusCode: 200,
      message: 'Avance curricular obtenido exitosamente',
      data,
      total: data.length,
    };
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.TEACHER)
  async getStats(@Query('academicYearId') academicYearId?: string) {
    const data = await this.curriculumService.getStats(academicYearId);
    return {
      statusCode: 200,
      message: 'Estadísticas curriculares obtenidas exitosamente',
      data,
    };
  }

  @Patch(':id/progress')
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER)
  async updateProgress(
    @Param('id') id: string,
    @Body() body: UpdateCurriculumProgressInput,
  ) {
    const data = await this.curriculumService.updateProgress(id, body);
    return {
      statusCode: 200,
      message: 'Progreso curricular actualizado exitosamente',
      data,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER)
  async create(
    @Body()
    body: {
      academicYearId?: string;
      subjectId: string;
      courseId?: string;
      gradeLevel?: number;
      periodNumber: number;
      campo?: string;
      unitTitle: string;
      title: string;
      description?: string;
    },
  ) {
    const data = await this.curriculumService.create(body);
    return {
      statusCode: 201,
      message: 'Tema curricular creado exitosamente',
      data,
    };
  }
}
