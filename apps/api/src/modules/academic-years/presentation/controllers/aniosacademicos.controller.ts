import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { casousolistaraniosacademicos } from '../../application/use-cases/listaraniosacademicos.use-case';
import {
  casousoactualizaranioacademico,
  casousocrearanioacademico,
  casousoeliminaranioacademico,
} from '../../application/use-cases/gestionaranioacademico.use-cases';
import { dtoactualizaranioacademico, dtocrearanioacademico } from '../dto/anioacademico.dto';

type correlatedsolicitud = Request & { correlationId?: string };

@Controller('academic-years')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladoraniosacademicos {
  constructor(
    private readonly listaraniosacademicos: casousolistaraniosacademicos,
    private readonly crearanioacademico: casousocrearanioacademico,
    private readonly actualizaranioacademico: casousoactualizaranioacademico,
    private readonly eliminaranioacademico: casousoeliminaranioacademico,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('academic-years:read')
  async listar() {
    return {
      statusCode: 200,
      message: 'Gestiones académicas obtenidas exitosamente',
      data: await this.listaraniosacademicos.ejecutar(),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('academic-years:create')
  async crear(
    @Body() dto: dtocrearanioacademico,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 201,
      message: 'Gestión académica creada exitosamente',
      data: await this.crearanioacademico.ejecutar(dto, usuario.id, req.ip, req.correlationId),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('academic-years:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizaranioacademico,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    return {
      statusCode: 200,
      message: 'Gestión académica actualizada exitosamente',
      data: await this.actualizaranioacademico.ejecutar(
        id,
        dto,
        usuario.id,
        req.ip,
        req.correlationId,
      ),
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('academic-years:delete')
  async eliminar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: correlatedsolicitud,
  ) {
    await this.eliminaranioacademico.ejecutar(id, usuario.id, req.ip, req.correlationId);
    return { statusCode: 200, message: 'Gestión académica eliminada exitosamente' };
  }
}
