import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { casousolistarperiodos } from '../../application/use-cases/listarperiodos.use-case';
import { casousoactualizarperiodo } from '../../application/use-cases/actualizarperiodo.use-case';
import { casousoobtenervistapreviacierreperiodo } from '../../application/use-cases/obtenerprevisualizacioncierredelperiodo.use-case';
import { casousocrearperiodo } from '../../application/use-cases/crearperiodo.use-case';
import { dtocrearperiodo, dtoactualizarperiodo } from '../dto/periodo.dto';

type correlatedsolicitud = Request & { correlationId?: string };

@Controller('periods')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladorperiodos {
  constructor(
    private readonly casolistarperiodos: casousolistarperiodos,
    private readonly casoactualizarperiodo: casousoactualizarperiodo,
    private readonly casocrearperiodo: casousocrearperiodo,
    private readonly obtenervistapreviacierre: casousoobtenervistapreviacierreperiodo,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('periods:read')
  async listar(@Query('academicYearId') idanioacademico?: string) {
    return {
      statusCode: 200,
      message: 'Periodos académicos obtenidos exitosamente',
      data: await this.casolistarperiodos.ejecutar(idanioacademico),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('periods:create')
  async crear(
    @Body() dto: dtocrearperiodo,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 201,
      message: 'Periodo académico creado exitosamente',
      data: await this.casocrearperiodo.ejecutar(dto, usuario.id, req.ip, req.correlationId),
    };
  }

  @Get(':id/closure-preview')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('periods:update')
  async vistapreviacierre(@Param('id') id: string) {
    return {
      statusCode: 200,
      message: 'Resumen del período obtenido',
      data: await this.obtenervistapreviacierre.ejecutar(id),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('periods:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarperiodo,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    const actualizado = await this.casoactualizarperiodo.ejecutar(
      id,
      dto,
      usuario.id,
      req.ip,
      req.correlationId,
    );
    return {
      statusCode: 200,
      message: 'Periodo académico actualizado exitosamente',
      data: actualizado,
    };
  }
}
