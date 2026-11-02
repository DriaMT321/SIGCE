import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { dtopaginacion } from '../../../../common/dto/paginacion.dto';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import {
  dtocrearfamiliar,
  dtoactualizarfamiliar,
  dtoactualizarvinculofamiliar,
} from '../dto/padre.dto';
import {
  casousocrearfamiliar,
  casousoeliminarfamiliar,
  casousolistarfamiliares,
  casousoactualizarfamiliar,
  casousoactualizarvinculofamiliar,
  casousoeliminarvinculofamiliar,
} from '../../application/use-cases/padre.use-cases';

@Controller('parents')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladorfamiliares {
  constructor(
    private readonly listarparents: casousolistarfamiliares,
    private readonly crearfamiliar: casousocrearfamiliar,
    private readonly actualizarfamiliar: casousoactualizarfamiliar,
    private readonly eliminarfamiliar: casousoeliminarfamiliar,
    private readonly actualizarvinculo: casousoactualizarvinculofamiliar,
    private readonly eliminarvinculo: casousoeliminarvinculofamiliar,
  ) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('parents:read')
  async listar(@Query() filtros: dtopaginacion) {
    const resultado = await this.listarparents.ejecutar({
      search: filtros.search,
      limit: Math.min(filtros.limit ?? 50, 300),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Familiares obtenidos exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Patch(':parentId/students/:studentId')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('parents:update')
  async actualizarvinculoestudiante(
    @Param('parentId') parentId: string,
    @Param('studentId') studentId: string,
    @Body() dto: dtoactualizarvinculofamiliar,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Vínculo familiar actualizado exitosamente',
      data: await this.actualizarvinculo.ejecutar(parentId, studentId, dto, usuario.id, req.ip),
    };
  }

  @Delete(':parentId/students/:studentId')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('parents:update')
  async eliminarvinculoestudiante(
    @Param('parentId') parentId: string,
    @Param('studentId') studentId: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Estudiante desvinculado exitosamente',
      data: await this.eliminarvinculo.ejecutar(parentId, studentId, usuario.id, req.ip),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('parents:create')
  async crear(
    @Body() dto: dtocrearfamiliar,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 201,
      message: 'Familiar creado exitosamente',
      data: await this.crearfamiliar.ejecutar(dto, usuario.id, req.ip),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('parents:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarfamiliar,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Familiar actualizado exitosamente',
      data: await this.actualizarfamiliar.ejecutar(id, dto, usuario.id, req.ip),
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  async eliminar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    await this.eliminarfamiliar.ejecutar(id, usuario.id, req.ip);
    return { statusCode: 200, message: 'Familiar eliminado exitosamente' };
  }
}
