import { Body, Controller, Get, Header, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { rolusuario, type usuarioautenticado } from '@academic/shared-types';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { guardiapermisos } from '../../../../common/guards/permisos.guard';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { definirpermisos } from '../../../../common/decorators/permisos.decorator';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { resumenasistentesieDto, seleccionasistentesieDto } from '../dto/sie-asistente.dto';
import { servicioasistentesie } from '../../application/services/asistentesie.service';

type solicitudcorrelacion = Request & { correlationId?: string };

@Controller('sie-sync/assistant')
@UseGuards(guardiaautenticacionjwt, guardiaroles, guardiapermisos)
export class SieAsistenteController {
  constructor(private readonly asistente: servicioasistentesie) {}

  @Get('grades')
  @Header('Cache-Control', 'no-store')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:read')
  async obtenernotas(@Query() filtros: seleccionasistentesieDto) {
    return {
      statusCode: 200,
      data: await this.asistente.prepararnotas(filtros),
    };
  }

  @Post('summary')
  @Header('Cache-Control', 'no-store')
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  @definirpermisos('sie:execute')
  async registrarresumen(
    @Body() entrada: resumenasistentesieDto,
    @usuarioactual() usuario: usuarioautenticado,
    @Req() req: solicitudcorrelacion,
  ) {
    return {
      statusCode: 201,
      message: 'Se registró el resumen informado por la responsable.',
      data: await this.asistente.registrarresumen(entrada, {
        userId: usuario.id,
        ...(req.ip ? { ipAddress: req.ip } : {}),
        ...(req.get('user-agent') ? { userAgent: req.get('user-agent') } : {}),
        ...(req.correlationId ? { correlationId: req.correlationId } : {}),
      }),
    };
  }
}
