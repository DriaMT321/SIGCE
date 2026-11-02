import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { usuarioautenticado, rolusuario } from '@academic/shared-types';
import { usuarioactual } from '../../../../common/decorators/usuarioactual.decorator';
import { definirroles } from '../../../../common/decorators/roles.decorator';
import { guardiaautenticacionjwt } from '../../../../common/guards/jwtautenticacion.guard';
import { guardiaroles } from '../../../../common/guards/roles.guard';
import { dtocrearanuncio } from '../dto/crearanuncio.dto';
import {
  casousocrearanuncio,
  casousoeliminaranuncio,
  casousolistaranuncios,
} from '../../application/anuncio.use-cases';

@Controller('announcements')
@UseGuards(guardiaautenticacionjwt, guardiaroles)
export class controladoranuncios {
  constructor(
    private readonly casousolistaranuncios: casousolistaranuncios,
    private readonly casousocrearanuncio: casousocrearanuncio,
    private readonly casousoeliminaranuncio: casousoeliminaranuncio,
  ) {}

  @Get()
  @definirroles(
    rolusuario.ADMINISTRATIVE,
    rolusuario.SECRETARY,
    rolusuario.TEACHER,
    rolusuario.PARENT,
    rolusuario.STUDENT,
  )
  async listar(@usuarioactual() usuario: usuarioautenticado) {
    const datos = await this.casousolistaranuncios.ejecutar(usuario);
    return {
      statusCode: 200,
      message: 'Comunicados obtenidos exitosamente',
      data: datos,
      total: datos.length,
    };
  }

  @Post()
  @definirroles(rolusuario.ADMINISTRATIVE, rolusuario.SECRETARY)
  async crear(@usuarioactual() usuario: usuarioautenticado, @Body() body: dtocrearanuncio) {
    const datos = await this.casousocrearanuncio.ejecutar(usuario, body);
    return {
      statusCode: 201,
      message: 'Comunicado emitido y notificado exitosamente',
      data: datos,
    };
  }

  @Delete(':id')
  @definirroles(rolusuario.ADMINISTRATIVE)
  async eliminar(@Param('id') id: string) {
    await this.casousoeliminaranuncio.ejecutar(id);
    return {
      statusCode: 200,
      message: 'Comunicado eliminado exitosamente',
    };
  }
}
