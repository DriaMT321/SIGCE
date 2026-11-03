import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  estadoasignacion,
  tipoasignacion,
  usuarioautenticado,
  rolusuario,
} from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { serviciotareas } from '../../application/tareas.service';
import {
  dtocreartarea,
  dtoactualizartarea,
  dtoguardarcalificacioneslote,
} from '../dto/tarea.dto';

@Controller('assignments')
@UseGuards(guardiaautenticacionjwt, guardiaroles)
export class controladortareas {
  constructor(private readonly asignacionesservicio: serviciotareas) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query('courseId') idcurso?: string,
    @Query('subjectId') idmateria?: string,
    @Query('teacherId') iddocente?: string,
    @Query('type') escribirtexto?: tipoasignacion,
    @Query('status') estado?: estadoasignacion,
    @Query('search') buscar?: string,
  ) {
    const datos = await this.asignacionesservicio.listar(
      {
        courseId: idcurso,
        subjectId: idmateria,
        teacherId: iddocente,
        type: escribirtexto,
        status: estado,
        search: buscar,
      },
      usuario,
    );
    return {
      statusCode: 200,
      message: 'Tareas y exámenes obtenidos exitosamente',
      data: datos,
      total: datos.length,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  async crear(@Body() dto: dtocreartarea, @usuarioactual() usuario: usuarioautenticado) {
    const datos = await this.asignacionesservicio.crear(dto, usuario);
    return {
      statusCode: 201,
      message: 'Actividad académica creada exitosamente',
      data: datos,
    };
  }

  @Get(':id/submissions')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  async obtenerSubmissions(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const datos = await this.asignacionesservicio.obtenerplanillatarea(id, usuario);
    return {
      statusCode: 200,
      message: 'Planilla de alumnos y calificaciones obtenida exitosamente',
      data: datos,
    };
  }

  @Post(':id/grades')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  async guardarCalificaciones(
    @Param('id') id: string,
    @Body() dto: dtoguardarcalificacioneslote,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const datos = await this.asignacionesservicio.guardarcalificacionestarea(
      id,
      dto.grades,
      usuario,
    );
    return {
      statusCode: 200,
      message: datos.message,
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizartarea,
    @usuarioactual() usuario: usuarioautenticado,
  ) {
    const datos = await this.asignacionesservicio.actualizar(id, dto, usuario);
    return {
      statusCode: 200,
      message: 'Actividad académica actualizada exitosamente',
      data: datos,
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.TEACHER)
  async eliminar(@Param('id') id: string, @usuarioactual() usuario: usuarioautenticado) {
    const datos = await this.asignacionesservicio.eliminar(id, usuario);
    return {
      statusCode: 200,
      message: datos.message,
    };
  }
}
