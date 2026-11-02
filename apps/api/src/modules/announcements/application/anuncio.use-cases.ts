import { servicioaplicacion, inyectarpuerto } from '../../../core/application/aplicacioninyeccion';
import { errornoencontrado } from '../../../core/application/aplicacionerror';
import {
  severidadalerta,
  urgenciaanuncio,
  type codigourgenciaanuncio,
} from '@academic/domain-kernel';
import { actorusuario } from '../../../core/application/actorusuario';
import {
  tokenrepositorioanuncios,
  datoscreacionanuncio,
  repositorioanuncios,
} from './ports/repositorioanuncios.port';
import {
  tokenresolvedordestinatariosanuncio,
  resolvedordestinatariosanuncio,
} from './ports/anunciodestinatarioresolvedor.port';
import { tokenpublicadoranuncio, publicadoranuncio } from './ports/anunciopublicacion.port';

@servicioaplicacion()
export class casousolistaranuncios {
  constructor(
    @inyectarpuerto(tokenrepositorioanuncios) private readonly repositorio: repositorioanuncios,
  ) {}

  ejecutar(usuario: actorusuario) {
    return this.repositorio.buscarvisiblespara(usuario);
  }
}

@servicioaplicacion()
export class casousocrearanuncio {
  constructor(
    @inyectarpuerto(tokenresolvedordestinatariosanuncio)
    private readonly resolvedordestinatarios: resolvedordestinatariosanuncio,
    @inyectarpuerto(tokenpublicadoranuncio) private readonly publicador: publicadoranuncio,
  ) {}

  async ejecutar(usuario: actorusuario, datos: datoscreacionanuncio) {
    const destinatarios = await this.resolvedordestinatarios.resolverdestinatarios(datos);
    const severidad = obtenerseveridadanuncio(datos.urgency);
    const contenidonotificacion =
      datos.content.length > 180 ? `${datos.content.slice(0, 180)}...` : datos.content;

    return this.publicador.publicar({
      creadorId: usuario.id,
      datos: datos,
      notificaciones: destinatarios.map((idusuario) => ({
        userId: idusuario,
        title: `[Comunicado ${datos.urgency}] ${datos.title}`,
        message: contenidonotificacion,
        severity: severidad,
        urgency: datos.urgency,
        scope: datos.scope,
      })),
    });
  }
}

function obtenerseveridadanuncio(urgencia: codigourgenciaanuncio): severidadalerta {
  const severidades: Record<codigourgenciaanuncio, severidadalerta> = {
    [urgenciaanuncio.CRITICA]: severidadalerta.DANGER,
    [urgenciaanuncio.ALTA]: severidadalerta.WARNING,
    [urgenciaanuncio.MEDIA]: severidadalerta.INFO,
    [urgenciaanuncio.BAJA]: severidadalerta.INFO,
  };
  return severidades[urgencia];
}

@servicioaplicacion()
export class casousoeliminaranuncio {
  constructor(
    @inyectarpuerto(tokenrepositorioanuncios) private readonly repositorio: repositorioanuncios,
  ) {}

  async ejecutar(id: string): Promise<void> {
    if (!(await this.repositorio.eliminar(id))) {
      throw new errornoencontrado('Comunicado no encontrado');
    }
  }
}
