import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { casousolistarmaterias } from '../../application/use-cases/listarasignaturas.use-case';
import {
  casousoactualizarmateria,
  casousocrearmateria,
  casousoeliminarmateria,
} from '../../application/use-cases/gestionarmateria.use-cases';
import { dtoactualizarmateria, dtocrearmateria } from '../dto/asignatura.dto';

type correlatedsolicitud = Request & { correlationId?: string };

@Controller('subjects')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladormaterias {
  constructor(
    private readonly listarmaterias: casousolistarmaterias,
    private readonly crearmateria: casousocrearmateria,
    private readonly actualizarmateria: casousoactualizarmateria,
    private readonly eliminarmateria: casousoeliminarmateria,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('subjects:read')
  async listar(
    @usuarioactual() usuario: usuarioautenticado,
    @Query('search') busqueda?: string,
    @Query('courseId') cursoid?: string,
  ) {
    return {
      statusCode: 200,
      message: 'Materias obtenidas exitosamente',
      data: await this.listarmaterias.ejecutar(busqueda, usuario.role === rolusuario.TEACHER ? usuario.id : undefined, cursoid),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('subjects:create')
  async crear(
    @Body() dto: dtocrearmateria,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 201,
      message: 'Materia creada exitosamente',
      data: await this.crearmateria.ejecutar(dto, usuario.id, req.ip, req.correlationId),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('subjects:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarmateria,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 200,
      message: 'Materia actualizada exitosamente',
      data: await this.actualizarmateria.ejecutar(id, dto, usuario.id, req.ip, req.correlationId),
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('subjects:delete')
  async eliminar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    await this.eliminarmateria.ejecutar(id, usuario.id, req.ip, req.correlationId);
    return { statusCode: 200, message: 'Materia eliminada exitosamente' };
  }
}
