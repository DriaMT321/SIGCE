import { Body, Controller, Get, Post, Patch, Param, Query, Req, UseGuards, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario, dtocreartraslado, dtoactualizarfasetraslado } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  casousolistartraslados,
  casousoobtenertrasladoporid,
  casousocreartraslado,
  casousoactualizarfasetraslado,
} from '../../application/use-cases/traslado.use-cases';

@Controller('enrollments/transfers')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladortraslados {
  constructor(
    private readonly listartraslados: casousolistartraslados,
    private readonly obtenertraslado: casousoobtenertrasladoporid,
    private readonly creartraslado: casousocreartraslado,
    private readonly actualizarfase: casousoactualizarfasetraslado,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('enrollments:read')
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query() query: any,
  ) {
    const resultado = await this.listartraslados.ejecutar({
      academicYearId: query.academicYearId,
      studentId: query.studentId,
      direction: query.direction,
      transferType: query.transferType,
      status: query.status,
      phase: query.phase,
      search: query.search,
      limit: Math.min(Number(query.limit) || 50, 200),
      offset: Number(query.offset) || 0,
    });

    return {
      statusCode: 200,
      message: 'Trámites de traslado obtenidos exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Get(':id')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('enrollments:read')
  async obtenerPorId(@Param('id') id: string) {
    const item = await this.obtenertraslado.ejecutar(id);
    if (!item) {
      throw new NotFoundException(`Trámite de traslado no encontrado: ${id}`);
    }
    return {
      statusCode: 200,
      message: 'Detalle de traslado obtenido exitosamente',
      data: item,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('enrollments:create')
  async crear(
    @Body() dto: dtocreartraslado,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    const resultado = await this.creartraslado.ejecutar(dto, usuario.id, req.ip);
    return {
      statusCode: 201,
      message: 'Trámite de traslado iniciado exitosamente bajo normativa R.M. 0001',
      data: resultado,
    };
  }

  @Patch(':id/phase')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('enrollments:update')
  async avanzarFase(
    @Param('id') id: string,
    @Body() dto: dtoactualizarfasetraslado,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    const resultado = await this.actualizarfase.ejecutar(id, dto, usuario.id, req.ip);
    return {
      statusCode: 200,
      message: 'Fase del traslado actualizada exitosamente',
      data: resultado,
    };
  }
}
