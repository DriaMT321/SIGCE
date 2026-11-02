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
  tokenescritorregistroauditoria,
  escritorregistroauditoria,
} from '../../../audit/application/ports/registroauditoria.port';
import {
  tokenalmaceninformeauditoriacalificacionessie,
  almaceninformeauditoriasie,
} from '../ports/ejecucionauditoriacalificacionsie.ports';
import type {
  resultadocomparacionestudiante,
  resumenauditoria,
} from '../modelos/modeloauditoriasie';
import {
  serviciogestionarinformesauditoriasie,
  type estadopublicacioninforme,
} from './gestionarinformesauditoriasie.service';

export interface operadorpublicacionauditoria {
  userId: string;
  ipAddress?: string;
  correlationId?: string;
}

@servicioaplicacion()
export class serviciopublicarinformeauditoriasie {
  constructor(
    @inyectarpuerto(tokenescritorregistroauditoria)
    private readonly auditoriaregistro: escritorregistroauditoria,
    @inyectarpuerto(tokenalmaceninformeauditoriacalificacionessie)
    private readonly almaceninformes: almaceninformeauditoriasie,
    private readonly gestionarinformes: serviciogestionarinformesauditoriasie,
    @inyectarpuerto(tokenregistradoraplicacion)
    @dependenciaopcional()
    private readonly registrador?: registroaplicacion,
  ) {}

  async ejecutar(
    estudiantes: resultadocomparacionestudiante[],
    resumen: resumenauditoria,
    operador: operadorpublicacionauditoria,
  ): Promise<void> {
    const temporaldir = this.almaceninformes.obtenerdirectoriotemporal();
    await this.gestionarinformes.limpiarinformesabandonados(temporaldir);
    const marcatemporal = new Date().toISOString().replace(/[:.]/g, '-');
    const idinforme = `${marcatemporal}_${this.almaceninformes.idproceso()}_${this.almaceninformes.nuevoidentificador()}`;
    const jsonruta = this.almaceninformes.unirruta(
      temporaldir,
      `auditoria_calificaciones_${idinforme}.json`,
    );
    const mdruta = this.almaceninformes.unirruta(
      temporaldir,
      `auditoria_calificaciones_${idinforme}.md`,
    );
    const publicadomarcadorruta = `${jsonruta}.published`;
    const pendientejsonruta = this.almaceninformes.unirruta(
      temporaldir,
      `.${this.almaceninformes.nombrebase(jsonruta)}.${this.almaceninformes.idproceso()}.${this.almaceninformes.nuevoidentificador()}.pending`,
    );
    const pendientemdruta = this.almaceninformes.unirruta(
      temporaldir,
      `.${this.almaceninformes.nombrebase(mdruta)}.${this.almaceninformes.idproceso()}.${this.almaceninformes.nuevoidentificador()}.pending`,
    );
    const {
      totalStudents: totalestudiantes,
      totalExactMatches: totalcoincidenciasexactas,
      totalWithDiscrepancies: totalcondiscrepancias,
      matchPercentage: coincidenciaporcentaje,
    } = resumen;

    let markdown = `# Reporte de Auditoría de Calificaciones: SIE vs SIGCE\n\n`;
    markdown += `**Fecha**: ${new Date().toLocaleString()}\n`;
    markdown += `**Total Alumnos Auditados**: ${totalestudiantes}\n`;
    markdown += `**Coincidencias Exactas**: ${totalcoincidenciasexactas} (${coincidenciaporcentaje}%)\n`;
    markdown += `**Con Discrepancias**: ${totalcondiscrepancias}\n\n`;
    markdown += `> [!NOTE]\n> Auditoría en modo solo lectura. Ninguna nota fue modificada en el SIE ni en SIGCE.\n\n`;
    markdown += `| RUDE | Estudiante | Curso | Promedio SIE | Promedio SIGCE | Discrepancias | Estado |\n`;
    markdown += `|---|---|---|---|---|---|---|\n`;
    for (const estudiante of estudiantes) {
      const estado = estudiante.overallMatch
        ? 'COINCIDE'
        : estudiante.totalDiscrepancies > 0
          ? `DISCREPANCIA (${estudiante.totalDiscrepancies})`
          : 'SOLO_SIE';
      markdown += `| ${estudiante.rude} | ${estudiante.studentName} | ${estudiante.courseName} | ${estudiante.sieAverage} pts | ${estudiante.sigceAverage} pts | ${estudiante.totalDiscrepancies} | ${estado} |\n`;
    }

    const rutasinformestemporales = [pendientejsonruta, pendientemdruta];
    const rutasinformespublicados: string[] = [];
    let auditoriacrearintentado = false;
    try {
      for (const [rutainforme, contenidos] of [
        [pendientejsonruta, JSON.stringify(estudiantes, null, 2)],
        [pendientemdruta, markdown],
      ] as const) {
        this.almaceninformes.escribirexclusivoysincronizar(rutainforme, contenidos);
      }

      auditoriacrearintentado = true;
      await this.auditoriaregistro.ejecutar({
        userId: operador.userId,
        action: accionauditoria.CREATE,
        entity: 'SieGradeAudit',
        entityId: this.almaceninformes.nombrebase(jsonruta),
        newValue: {
          reportStatus: 'PENDING_PUBLICATION',
          totalStudents: totalestudiantes,
          totalExactMatches: totalcoincidenciasexactas,
          totalWithDiscrepancies: totalcondiscrepancias,
          matchPercentage: coincidenciaporcentaje,
          auditedCoursesCount: resumen.auditedCoursesCount,
          auditedAt: resumen.auditedAt,
        },
        ipAddress: operador.ipAddress,
        correlationId: operador.correlationId,
      });
      for (const [pendienteruta, rutainforme] of [
        [pendientejsonruta, jsonruta],
        [pendientemdruta, mdruta],
      ] as const) {
        this.almaceninformes.publicarexclusivo(pendienteruta, rutainforme);
        rutasinformespublicados.push(rutainforme);
      }

      await this.auditoriaregistro.ejecutar({
        userId: operador.userId,
        action: accionauditoria.UPDATE,
        entity: 'SieGradeAudit',
        entityId: this.almaceninformes.nombrebase(jsonruta),
        previousValue: { reportStatus: 'PENDING_PUBLICATION' },
        newValue: { reportStatus: 'PUBLISHED' },
        ipAddress: operador.ipAddress,
        correlationId: operador.correlationId,
      });

      this.gestionarinformes.asegurarmarcadorpublicado(publicadomarcadorruta);
    } catch (error) {
      let publicacion: estadopublicacioninforme | null = null;
      if (auditoriacrearintentado) {
        try {
          publicacion = await this.gestionarinformes.obtenerestadopublicacioninforme(
            this.almaceninformes.nombrebase(jsonruta),
          );
        } catch (auditorialeererror) {
          this.registrador?.error(
            `No se pudo reconciliar la auditoría SIE ${jsonruta}:`,
            auditorialeererror,
          );
        }
      }

      if (publicacion?.status === 'PUBLISHED') {
        if (!this.almaceninformes.existe(jsonruta)) throw error;
        if (!this.almaceninformes.existe(publicadomarcadorruta)) {
          try {
            this.gestionarinformes.asegurarmarcadorpublicado(publicadomarcadorruta);
          } catch (marcadorerror) {
            this.registrador?.warn(
              `No se pudo crear la marca del informe publicado ${jsonruta}:`,
              marcadorerror,
            );
          }
        }
        for (const rutainforme of rutasinformestemporales) {
          this.gestionarinformes.eliminararchivoinformeabandonado(
            temporaldir,
            this.almaceninformes.nombrebase(rutainforme),
          );
        }
        return;
      }

      if (publicacion?.status === 'PENDING_PUBLICATION') {
        try {
          await this.auditoriaregistro.ejecutar({
            userId: publicacion.userId ?? operador.userId,
            action: accionauditoria.UPDATE,
            entity: 'SieGradeAudit',
            entityId: this.almaceninformes.nombrebase(jsonruta),
            previousValue: { reportStatus: 'PENDING_PUBLICATION' },
            newValue: { reportStatus: 'FAILED' },
            reason: 'Falló la escritura o confirmación del informe.',
            ipAddress: publicacion.ipAddress ?? operador.ipAddress,
            correlationId: publicacion.correlationId ?? operador.correlationId,
          });
        } catch (auditoriaerror) {
          this.registrador?.error(
            `No se pudo registrar el fallo de publicación del informe SIE ${jsonruta}:`,
            auditoriaerror,
          );
          // Keep the report as recovery evidence if the FAILED event did not persist.
          throw error;
        }
      }

      if (
        !auditoriacrearintentado ||
        publicacion?.status === 'FAILED' ||
        publicacion?.status === 'PENDING_PUBLICATION'
      ) {
        for (const rutainforme of [
          ...rutasinformespublicados,
          ...rutasinformestemporales,
          publicadomarcadorruta,
        ]) {
          try {
            this.almaceninformes.eliminararchivo(rutainforme);
          } catch (limpiezaerror) {
            this.registrador?.error(
              `No se pudo eliminar el informe SIE sin publicación completa ${rutainforme}:`,
              limpiezaerror,
            );
          }
        }
      }

      // An uncertain CREATE commit needs its artifacts for a later reconciliation.
      throw error;
    }
  }
}
