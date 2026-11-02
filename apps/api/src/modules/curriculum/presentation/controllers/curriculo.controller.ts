import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { rolusuario } from '@academic/shared-types';
import { estadoplanestudio } from '@academic/shared-types';
import { usuarioautenticado } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { serviciocurriculo } from '../../application/curriculo.service';
import { dtocreartemacurricular } from '../dto/creartemacurriculo.dto';
import { dtoactualizaravancecurricular } from '../dto/actualizarcurriculoprogreso.dto';

@Controller('curriculum')
@UseGuards(guardiaautenticacionjwt, guardiaroles)
export class controladorcurriculo {
  constructor(private readonly curriculumservicio: serviciocurriculo) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query('courseId') idcurso?: string,
    @Query('gradeLevel') nivelacademico?: string,
    @Query('subjectId') idmateria?: string,
    @Query('periodNumber') numeroperiodo?: string,
    @Query('status') estado?: estadoplanestudio,
    @Query('search') busqueda?: string,
    @Query('academicYearId') idanioacademico?: string,
  ) {
    const datos = await this.curriculumservicio.listar({
      courseId: idcurso,
      gradeLevel: nivelacademico ? Number(nivelacademico) : undefined,
      subjectId: idmateria,
      periodNumber: numeroperiodo ? Number(numeroperiodo) : undefined,
      status: estado,
      search: busqueda,
      academicYearId: idanioacademico,
    }, usuario);
    return {
      statusCode: 200,
      message: 'Avance curricular obtenido exitosamente',
      data: datos,
      total: datos.length,
    };
  }

  @Get('stats')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async obtenerestadisticas(@usuarioactual() usuario: usuarioautenticado, @Query('academicYearId') idanioacademico?: string) {
    const datos = await this.curriculumservicio.obtenerestadisticas(idanioacademico, usuario);
    return {
      statusCode: 200,
      message: 'Estadísticas curriculares obtenidas exitosamente',
      data: datos,
    };
  }

  @Patch(':id/progress')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  async actualizarprogreso(
    @Param('id') id: string,
    @Body() body: dtoactualizaravancecurricular,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const datos = await this.curriculumservicio.actualizarprogreso(id, body, usuario);
    return {
      statusCode: 200,
      message: 'Progreso curricular actualizado exitosamente',
      data: datos,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async crear(@Body() body: dtocreartemacurricular) {
    const datos = await this.curriculumservicio.crear(body);
    return {
      statusCode: 201,
      message: 'Tema curricular creado exitosamente',
      data: datos,
    };
  }
}
