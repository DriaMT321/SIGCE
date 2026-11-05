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
import { dtocrearcurso, dtoactualizarcurso } from '../dto/curso.dto';
import { dtofiltroscursos } from '../dto/filtroscursos.dto';
import {
  casousocrearcurso,
  casousoeliminarcurso,
  casousoobtenercurso,
  casousolistarcursos,
  casousoactualizarcurso,
} from '../../application/use-cases/curso.use-cases';

@Controller('courses')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class controladorcursos {
  constructor(
    private readonly listarcursos: casousolistarcursos,
    private readonly obtenercurso: casousoobtenercurso,
    private readonly crearcurso: casousocrearcurso,
    private readonly actualizarcurso: casousoactualizarcurso,
    private readonly eliminarcurso: casousoeliminarcurso,
  ) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('courses:read')
  async listar(@Query() filtros: dtofiltroscursos, @usuarioactual() usuario: usuarioautenticado) {
    const filtrarPorDocente = usuario.role === rolusuario.TEACHER && filtros.onlyAssigned === true;
    const resultado = await this.listarcursos.ejecutar({
      teacherUserId: filtrarPorDocente ? usuario.id : undefined,
      academicYearId: filtros.academicYearId,
      search: filtros.search,
      limit: Math.min(filtros.limit ?? 50, 100),
      offset: filtros.offset ?? 0,
    });
    return {
      statusCode: 200,
      message: 'Cursos obtenidos exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Get(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY, rolusuario.TEACHER)
  @definirpermisos('courses:read')
  async obtener(@Param('id') id: string, @usuarioactual() usuario: usuarioautenticado) {
    return {
      statusCode: 200,
      message: 'Curso obtenido exitosamente',
      data: await this.obtenercurso.ejecutar(id, usuario.role === rolusuario.TEACHER ? usuario.id : undefined),
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('courses:create')
  async crear(
    @Body() dto: dtocrearcurso,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 201,
      message: 'Curso creado exitosamente',
      data: await this.crearcurso.ejecutar(dto, usuario.id, req.ip),
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('courses:update')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: dtoactualizarcurso,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Curso actualizado exitosamente',
      data: await this.actualizarcurso.ejecutar(id, dto, usuario.id, req.ip),
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('courses:delete')
  async eliminar(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    await this.eliminarcurso.ejecutar(id, usuario.id, req.ip);
    return { statusCode: 200, message: 'Curso eliminado exitosamente' };
  }
}
