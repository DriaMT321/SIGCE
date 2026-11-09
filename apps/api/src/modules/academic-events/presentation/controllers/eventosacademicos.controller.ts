import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { servicioeventosacademicos } from '../../application/eventosacademicos.service';
import { dtocreareventoacademico, dtoactualizareventoacademico } from '../dto/eventoacademico.dto';

@Controller('academic-events')
@UseGuards(guardiaautenticacionjwt, guardiaroles)
export class controladoreventosacademicos {
  constructor(private readonly servicio: servicioeventosacademicos) {}

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
    @Query('from') desde?: string,
    @Query('to') hasta?: string,
    @Query('courseId') courseId?: string,
  ) {
    const datos = await this.servicio.listar(usuario, { desde, hasta, courseId });
    return {
      statusCode: 200,
      message: 'Actividades académicas obtenidas exitosamente',
      data: datos,
      total: datos.length,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async crear(@usuarioactual() usuario: usuarioautenticado, @Body() dto: dtocreareventoacademico) {
    const datos = await this.servicio.crear(usuario, {
      ...dto,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
    });
    return { statusCode: 201, message: 'Actividad académica programada', data: datos };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async actualizar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Body() dto: dtoactualizareventoacademico,
  ) {
    const { startsAt, endsAt, ...campos } = dto;
    const datos = await this.servicio.actualizar(usuario, id, {
      ...campos,
      ...(startsAt ? { startsAt: new Date(startsAt) } : {}),
      ...(endsAt ? { endsAt: new Date(endsAt) } : {}),
    });
    return { statusCode: 200, message: 'Actividad académica actualizada', data: datos };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  async cancelar(@Param('id') id: string, @usuarioactual() usuario: usuarioautenticado) {
    const datos = await this.servicio.cancelar(usuario, id);
    return { statusCode: 200, message: 'Actividad académica cancelada', data: datos };
  }
}

