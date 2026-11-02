import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { usuarioautenticado, codigodiadelasemana, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { serviciohorarios } from '../../application/horarios.service';
import { dtoescriturahorario } from '../dto/escriturahorario.dto';
import { dtoasignacionmateriasdocente } from '../dto/asignacionmateriasdocente.dto';
import { dtoreemplazarmateriasdocente } from '../dto/reemplazarmateriasdocente.dto';

@Controller('schedules')
@UseGuards(guardiaautenticacionjwt, guardiaroles)
export class controladorhorarios {
  constructor(private readonly serviciohorarios: serviciohorarios) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query('courseId') idcurso?: string,
    @Query('teacherId') iddocente?: string,
    @Query('dayOfWeek') diasemana?: codigodiadelasemana,
    @Query('academicYearId') idgestionacademica?: string,
  ) {
    const datos = await this.serviciohorarios.listar(
      {
        courseId: idcurso,
        teacherId: iddocente,
        dayOfWeek: diasemana,
        academicYearId: idgestionacademica,
      },
      usuario,
    );
    return {
      statusCode: 200,
      message: 'Horarios obtenidos exitosamente',
      data: datos,
      total: datos.length,
    };
  }

  @Get('my-schedule')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  async obtenermihorario(@usuarioactual() usuario: usuarioautenticado) {
    const datos = await this.serviciohorarios.obtenermihorario(usuario);
    return {
      statusCode: 200,
      message: 'Horario personal obtenido exitosamente',
      data: datos,
    };
  }

  @Get('course/:courseId')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
  )
  async obtenerhorariocurso(@Param('courseId') idcurso: string, @usuarioactual() usuario: usuarioautenticado) {
    const datos = await this.serviciohorarios.obtenerhorariocurso(idcurso, usuario);
    return {
      statusCode: 200,
      message: 'Horario del curso obtenido exitosamente',
      data: datos,
    };
  }

  @Get('teacher/:teacherId')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async obtenerhorariodocente(
    @Param('teacherId') iddocente: string,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const datos = await this.serviciohorarios.obtenerhorariodocente(iddocente, usuario);
    return {
      statusCode: 200,
      message: 'Horario del docente obtenido exitosamente',
      data: datos,
    };
  }

  @Post('upsert')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async insertaroactualizar(@Body() body: dtoescriturahorario) {
    const datos = await this.serviciohorarios.insertaroactualizar(body);
    return {
      statusCode: 200,
      message: 'Sesión de horario asignada exitosamente',
      data: datos,
    };
  }

  @Post('teacher-subjects')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async asignarmateriasdocente(@Body() body: dtoasignacionmateriasdocente) {
    const created = await this.serviciohorarios.asignarmateriasdocente(body);
    return { statusCode: 200, message: 'Materias asignadas al docente', data: { created } };
  }

  @Put('teacher-subjects')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async reemplazarmateriasdocente(@Body() body: dtoreemplazarmateriasdocente) {
    const resultado = await this.serviciohorarios.reemplazarmateriasdocente(body);
    return { statusCode: 200, message: 'Asignaciones del curso actualizadas', data: resultado };
  }

  @Post('generate-auto/:courseId')
  @definirroles(rolusuario.ADMINISTRATIVE)
  async generarautomaticamente(@Param('courseId') idcurso: string) {
    const resultado = await this.serviciohorarios.generarautomaticamente(idcurso);
    return {
      statusCode: 200,
      message: resultado.message,
      data: resultado,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE)
  async crear(@Body() body: dtoescriturahorario) {
    const datos = await this.serviciohorarios.crear(body);
    return {
      statusCode: 201,
      message: 'Sesión de horario creada exitosamente',
      data: datos,
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async eliminar(@Param('id') id: string) {
    await this.serviciohorarios.eliminar(id);
    return {
      statusCode: 200,
      message: 'Sesión de horario eliminada exitosamente',
    };
  }
}
