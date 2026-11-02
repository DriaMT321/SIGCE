import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { casousoobtenerusuarios } from '../../application/use-cases/obtenerusuarios.use-case';
import { casousocrearusuario } from '../../application/use-cases/crearusuario.use-case';
import { casousoactualizarusuario } from '../../application/use-cases/actualizarusuario.use-case';
import { casousorestablecercontrasenausuario } from '../../application/use-cases/restablecercontrasenausuario.use-case';
import { dtocrearusuario, dtoactualizarusuario } from '../dto/crearusuario.dto';
import { dtorestablecercontrasenausuario } from '../dto/restablecercontrasenausuario.dto';
import { dtofiltrosusuarios } from '../dto/filtrosusuarios.dto';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';

@Controller('users')
@UseGuards(guardiaautenticacionjwt, guardiaroles)
export class controladorusuarios {
  constructor(
    private readonly obtenerusuariosusocaso: casousoobtenerusuarios,
    private readonly crearusuariousocaso: casousocrearusuario,
    private readonly actualizarusuariousocaso: casousoactualizarusuario,
    private readonly resetusuariocontrasena: casousorestablecercontrasenausuario,
  ) {}

  @Get()
  @definirroles(rolusuario.ADMINISTRATIVE)
  async obtenerusuarios(@Query() filtros: dtofiltrosusuarios) {
    const datos = await this.obtenerusuariosusocaso.ejecutar({
      role: filtros.role,
      search: filtros.search,
      limit: filtros.limit ?? 50,
      offset: filtros.offset ?? 0,
    });

    return {
      statusCode: 200,
      message: 'Usuarios obtenidos exitosamente',
      data: datos.items,
      total: datos.total,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE)
  async crearusuario(
    @Body() dto: dtocrearusuario,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    const creado = await this.crearusuariousocaso.ejecutar(dto, usuario.id, req.ip);

    return {
      statusCode: 201,
      message: 'Usuario institucional creado exitosamente',
      data: creado,
    };
  }

  @Patch(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  async actualizarusuario(
    @Param('id') id: string,
    @Body() dto: dtoactualizarusuario,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    const actualizado = await this.actualizarusuariousocaso.ejecutar(id, dto, usuario.id, req.ip);

    return {
      statusCode: 200,
      message: 'Usuario actualizado exitosamente',
      data: actualizado,
    };
  }

  @Patch(':id/password')
  @definirroles(rolusuario.ADMINISTRATIVE)
  async restablecercontrasena(
    @Param('id') id: string,
    @Body() dto: dtorestablecercontrasenausuario,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    const resultado = await this.resetusuariocontrasena.ejecutar(
      id,
      dto.newPassword,
      usuario,
      req.ip,
    );
    return {
      statusCode: 200,
      message: 'Contraseña restablecida y sesiones revocadas.',
      data: resultado,
    };
  }
}
