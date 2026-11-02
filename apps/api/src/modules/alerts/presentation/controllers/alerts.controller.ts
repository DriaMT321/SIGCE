import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
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
import {
  casousoevaluaralertasestudiante,
  casousoevaluaralertastodosestudiantes,
  casousolistarreglasalerta,
  casousolistaralertas,
  casousomarcaralertaleida,
  casousoactualizarreglaalerta,
  casousoactualizarestadoalerta,
} from '../../application/use-cases/alerta.use-cases';
import { dtoactualizarreglaalerta } from '../dto/actualizaralertaregla.dto';
import { dtoactualizarestadoalerta } from '../dto/actualizaralertaestado.dto';
import { dtofiltrosalertas } from '../dto/filtrosalertas.dto';

@Controller('alerts')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class AlertsController {
  constructor(
    private readonly casolistaralertas: casousolistaralertas,
    private readonly casomarcaralertaleida: casousomarcaralertaleida,
    private readonly casoactualizarestadoalerta: casousoactualizarestadoalerta,
    private readonly casolistarreglasalerta: casousolistarreglasalerta,
    private readonly casoactualizarreglaalerta: casousoactualizarreglaalerta,
    private readonly casoevaluaralertasestudiante: casousoevaluaralertasestudiante,
    private readonly casoevaluaralertastodosestudiantes: casousoevaluaralertastodosestudiantes,
  ) {}

  @Get('rules')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('alerts:configure')
  async listarreglas() {
    return {
      statusCode: 200,
      message: 'Reglas de alerta obtenidas',
      data: await this.casolistarreglasalerta.ejecutar(),
    };
  }

  @Put('rules/:key')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('alerts:configure')
  async configurarregla(
    @Param('key') clave: string,
    @Body() dto: dtoactualizarreglaalerta,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    if (clave !== 'LOW_GRADE' && clave !== 'REPEATED_ABSENCE' && clave !== 'REPEATED_LATENESS') {
      throw new BadRequestException('Tipo de regla de alerta no válido');
    }
    return {
      statusCode: 200,
      message: 'Regla de alerta actualizada',
      data: await this.casoactualizarreglaalerta.ejecutar(
        { key: clave, ...dto },
        usuario.id,
        req.ip,
      ),
    };
  }

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('alerts:read')
  async listar(@usuarioactual() usuario: usuarioautenticado, @Query() filtros: dtofiltrosalertas) {
    const resultado = await this.casolistaralertas.ejecutar(
      usuario.id,
      Math.min(filtros.limit ?? 50, 100),
      filtros.offset ?? 0,
      filtros.status,
    );
    return {
      statusCode: 200,
      message: 'Alertas obtenidas exitosamente',
      data: resultado.items,
      total: resultado.total,
    };
  }

  @Patch(':id/read')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  @definirpermisos('alerts:update')
  async marcarleida(
    @Param('id') id: string,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Alerta marcada como leída',
      data: await this.casomarcaralertaleida.ejecutar(id, usuario.id, req.ip),
    };
  }

  @Patch(':id/status')
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
  )
  @definirpermisos('alerts:update')
  async actualizarestado(
    @Param('id') id: string,
    @Body() dto: dtoactualizarestadoalerta,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: Request,
  ) {
    return {
      statusCode: 200,
      message: 'Estado de la alerta actualizado',
      data: await this.casoactualizarestadoalerta.ejecutar(id, usuario.id, dto.status, req.ip),
    };
  }

  @Patch('students/:studentId/evaluate')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('alerts:configure')
  async evaluar(@Param('studentId') idestudiante: string) {
    await this.casoevaluaralertasestudiante.ejecutar(idestudiante);
    return { statusCode: 200, message: 'Evaluación de alertas completada' };
  }

  @Patch('rules/evaluate')
  @definirroles(rolusuario.ADMINISTRATIVE)
  @definirpermisos('alerts:configure')
  async evaluartodas() {
    const resultado = await this.casoevaluaralertastodosestudiantes.ejecutar();
    return {
      statusCode: 200,
      message: 'Evaluación general de alertas completada',
      data: resultado,
    };
  }
}
