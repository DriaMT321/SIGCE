import { accionauditoria } from '@academic/domain-kernel';
import {
  servicioaplicacion,
  inyectarpuerto,
  dependenciaopcional,
} from '../../../../core/application/aplicacioninyeccion';
import {
  tokenregistradoraplicacion,
  registroaplicacion,
} from '../../../../core/application/registradoraplicacion.port';
import {
  tokenlectorregistroauditoria,
  tokenescritorregistroauditoria,
  lectorregistroauditoria,
  escritorregistroauditoria,
} from '../../../audit/application/ports/registroauditoria.port';
import {
  tokenalmaceninformeauditoriacalificacionessie,
  almaceninformeauditoriasie,
} from '../ports/ejecucionauditoriacalificacionsie.ports';
import type {
  datosultimaauditoria,
  resultadocomparacionestudiante,
} from '../modelos/modeloauditoriasie';
import { resumircomparacionesie } from './resumircomparacionesie.service';

const constantemargengraciainformeabandonadoms = 24 * 60 * 60 * 1000;

export interface estadopublicacioninforme {
  status: 'PENDING_PUBLICATION' | 'PUBLISHED' | 'FAILED' | 'UNKNOWN';
  userId: string | null;
  ipAddress: string | null;
  correlationId: string | null;
}

@servicioaplicacion()
export class serviciogestionarinformesauditoriasie {
  constructor(
    @inyectarpuerto(tokenescritorregistroauditoria)
    private readonly auditoriaregistro: escritorregistroauditoria,
    @inyectarpuerto(tokenlectorregistroauditoria)
    private readonly obtenerregistrosauditoria: lectorregistroauditoria,
    @inyectarpuerto(tokenalmaceninformeauditoriacalificacionessie)
    private readonly almaceninformes: almaceninformeauditoriasie,
    @inyectarpuerto(tokenregistradoraplicacion)
    @dependenciaopcional()
    private readonly registrador?: registroaplicacion,
  ) {}

  async obtenerestadopublicacioninforme(identidad: string): Promise<estadopublicacioninforme> {
    const { items: elementos } = await this.obtenerregistrosauditoria.ejecutar({
      entity: 'SieGradeAudit',
      entityId: identidad,
      limit: 20,
    });
    const estados = elementos.map((elemento) => elemento.newValue?.reportStatus);
    const eventocreacion = elementos.find((elemento) => elemento.action === accionauditoria.CREATE);
    const actorcontexto = {
      userId: eventocreacion?.userId ?? null,
      ipAddress: eventocreacion?.ipAddress ?? null,
      correlationId: eventocreacion?.correlationId ?? null,
    };
    if (estados.includes('FAILED')) return { status: 'FAILED', ...actorcontexto };
    if (estados.includes('PUBLISHED')) return { status: 'PUBLISHED', ...actorcontexto };
    if (estados.includes('PENDING_PUBLICATION'))
      return { status: 'PENDING_PUBLICATION', ...actorcontexto };
    return { status: 'UNKNOWN', ...actorcontexto };
  }

  async limpiarinformesabandonados(temporaldir: string): Promise<void> {
    for (const nombrearchivo of this.almaceninformes.listararchivos(temporaldir)) {
      const coincidencia =
        /^\.(auditoria_calificaciones_.*\.(?:json|md))\.(\d+)\.[0-9a-f-]{36}\.pending$/i.exec(
          nombrearchivo,
        );
      if (coincidencia && !this.almaceninformes.estaprocesoactivo(Number(coincidencia[2]))) {
        const identidad = coincidencia[1].replace(/\.md$/i, '.json');
        const publicacion = await this.obtenerestadopublicacioninforme(identidad);
        if (publicacion.status === 'PENDING_PUBLICATION') {
          await this.auditoriaregistro.ejecutar({
            userId: publicacion.userId,
            action: accionauditoria.UPDATE,
            entity: 'SieGradeAudit',
            entityId: identidad,
            previousValue: { reportStatus: 'PENDING_PUBLICATION' },
            newValue: { reportStatus: 'FAILED' },
            reason: 'El proceso terminó antes de publicar los archivos del informe.',
            ipAddress: publicacion.ipAddress,
            correlationId: publicacion.correlationId,
          });
        }
        if (
          publicacion.status === 'UNKNOWN' &&
          !this.superaventanarecuperacion(this.almaceninformes.unirruta(temporaldir, nombrearchivo))
        )
          continue;
        this.eliminararchivoinformeabandonado(temporaldir, nombrearchivo);
        continue;
      }

      const informesinpublicar = /^auditoria_calificaciones_.*_(\d+)_([0-9a-f-]{36})\.json$/i.exec(
        nombrearchivo,
      );
      if (!informesinpublicar) continue;
      if (this.almaceninformes.estaprocesoactivo(Number(informesinpublicar[1]))) continue;

      const publicacion = await this.obtenerestadopublicacioninforme(nombrearchivo);
      if (publicacion.status === 'PUBLISHED') {
        try {
          this.asegurarmarcadorpublicado(
            this.almaceninformes.unirruta(temporaldir, `${nombrearchivo}.published`),
          );
        } catch (marcadorerror) {
          this.registrador?.warn(
            `No se pudo reconstruir la marca del informe publicado ${nombrearchivo}:`,
            marcadorerror,
          );
        }
        continue;
      }

      if (publicacion.status === 'PENDING_PUBLICATION') {
        await this.auditoriaregistro.ejecutar({
          userId: publicacion.userId,
          action: accionauditoria.UPDATE,
          entity: 'SieGradeAudit',
          entityId: nombrearchivo,
          previousValue: { reportStatus: 'PENDING_PUBLICATION' },
          newValue: { reportStatus: 'FAILED' },
          reason: 'El proceso terminó antes de completar la publicación del informe.',
          ipAddress: publicacion.ipAddress,
          correlationId: publicacion.correlationId,
        });
      }
      if (
        publicacion.status === 'UNKNOWN' &&
        !this.superaventanarecuperacion(this.almaceninformes.unirruta(temporaldir, nombrearchivo))
      )
        continue;
      this.eliminararchivoinformeabandonado(temporaldir, nombrearchivo);
      this.eliminararchivoinformeabandonado(temporaldir, nombrearchivo.replace(/\.json$/i, '.md'));
      this.eliminararchivoinformeabandonado(temporaldir, `${nombrearchivo}.published`);
    }
  }

  asegurarmarcadorpublicado(marcadorruta: string): void {
    this.almaceninformes.asegurarmarcadorpublicado(marcadorruta);
  }

  async obtenerultimaauditoria(): Promise<datosultimaauditoria> {
    const temporaldir = this.almaceninformes.obtenerdirectoriotemporal();
    await this.limpiarinformesabandonados(temporaldir);
    const archivos = this.almaceninformes
      .listararchivos(temporaldir)
      .filter((f) => f.startsWith('auditoria_calificaciones_') && f.endsWith('.json'))
      .sort()
      .reverse();

    const accesiblearchivos: string[] = [];
    for (const nombrearchivo of archivos) {
      if (!/^auditoria_calificaciones_.*_\d+_[0-9a-f-]{36}\.json$/i.test(nombrearchivo)) {
        accesiblearchivos.push(nombrearchivo);
        continue;
      }

      const publicacion = await this.obtenerestadopublicacioninforme(nombrearchivo);
      if (publicacion.status !== 'PUBLISHED') continue;
      const marcadorruta = this.almaceninformes.unirruta(temporaldir, `${nombrearchivo}.published`);
      if (!this.almaceninformes.existe(marcadorruta)) {
        try {
          this.asegurarmarcadorpublicado(marcadorruta);
        } catch (marcadorerror) {
          this.registrador?.warn(
            `No se pudo reconstruir la marca del informe publicado ${nombrearchivo}:`,
            marcadorerror,
          );
        }
      }
      accesiblearchivos.push(nombrearchivo);
    }

    if (accesiblearchivos.length === 0) {
      return { hasData: false, summary: null, students: [] };
    }

    const ultimoarchivo = this.almaceninformes.unirruta(temporaldir, accesiblearchivos[0]);
    try {
      const crudo = this.almaceninformes.leertexto(ultimoarchivo);
      const estudiantes: resultadocomparacionestudiante[] = JSON.parse(crudo);

      const auditadoen = new Date(this.almaceninformes.modificadoen(ultimoarchivo)).toISOString();
      const resumen = resumircomparacionesie(
        estudiantes,
        new Set(estudiantes.map((estudiante) => estudiante.courseName)).size,
        auditadoen,
      );

      return {
        hasData: true,
        summary: resumen,
        students: estudiantes,
        auditedAt: auditadoen,
        reportFile: accesiblearchivos[0],
      };
    } catch (error) {
      this.registrador?.error(`Error al leer archivo de auditoría ${ultimoarchivo}:`, error);
      return { hasData: false, summary: null, students: [] };
    }
  }

  private superaventanarecuperacion(rutaarchivo: string): boolean {
    try {
      return (
        Date.now() - this.almaceninformes.modificadoen(rutaarchivo) >
        constantemargengraciainformeabandonadoms
      );
    } catch (error) {
      return error instanceof Error && 'code' in error && error.code === 'ENOENT';
    }
  }

  eliminararchivoinformeabandonado(temporaldir: string, nombrearchivo: string): void {
    try {
      this.almaceninformes.eliminararchivo(
        this.almaceninformes.unirruta(temporaldir, nombrearchivo),
      );
    } catch (error) {
      this.registrador?.warn(
        `No se pudo limpiar un informe temporal abandonado ${nombrearchivo}:`,
        error,
      );
    }
  }
}
