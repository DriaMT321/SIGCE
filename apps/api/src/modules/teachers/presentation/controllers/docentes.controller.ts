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
import { dtocreardocente, dtoactualizardocente } from '../dto/docente.dto';
import {
  casousocreardocente,
  casousoeliminardocente,
  casousolistardocentes,
  casousoactualizardocente,
} from '../../application/use-cases/docente.use-cases';

@Controller('teachers')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladordocentes {
  constructor(
    private readonly listardocentes: casousolistardocentes,
    private readonly creardocente: casousocreardocente,
    private readonly actualizardocente: casousoactualizardocente,
    private readonly eliminardocente: casousoeliminardocente,
  ) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('teachers:read')
  async listar(@Query() filtros: dtopaginacion) {
    const resultado = await this.listardocentes.ejecutar({
      search: filtros.search,
      limit: Math.min(filtros.limit ?? 50, 100),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Docentes obtenidos exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('teachers:create')
  async crear(
    @Body() dto: dtocreardocente,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 201,
      message: 'Docente creado exitosamente',
      data: await this.creardocente.ejecutar(dto, usuario.id, req.ip),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('teachers:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizardocente,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Docente actualizado exitosamente',
      data: await this.actualizardocente.ejecutar(id, dto, usuario.id, req.ip),
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  async eliminar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    await this.eliminardocente.ejecutar(id, usuario.id, req.ip);
    return { statusCode: 200, message: 'Docente eliminado exitosamente' };
  }
}
