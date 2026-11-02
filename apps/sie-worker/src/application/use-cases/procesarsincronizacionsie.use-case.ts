import { estadosincronizacionsie } from '@academic/domain-kernel';
import {
  resultadoprocesamientosie,
  trabajoprocesamientosie,
} from '../modelos/sincronizacion.model';
import { errorautenticacionsierequerida } from '../../domain/errors/autenticacionsierequerida.error';
import { errordestinosincronizacionincompatible } from '../../domain/errors/destinosincronizacionincompatible.error';
import { puertoautomatizacionsie } from '../ports/automatizacionsie.port';
import {
  puertoprocesamientosincronizacionsie,
  intervaloactualizacionarrendamientosie,
} from '../ports/procesamientosincronizacionsie.port';
import { configuraciontrabajador } from '../../config/configuraciontrabajador.config';

const estadosfinalessie = new Set([
  estadosincronizacionsie.VERIFIED,
  estadosincronizacionsie.DISCREPANCY,
  estadosincronizacionsie.AUTH_REQUIRED,
  estadosincronizacionsie.FAILED,
]);

export class casousoprocesarsincronizacionsie {
  constructor(
    private readonly puertoautomatizacion: puertoautomatizacionsie,
    private readonly repositorioprocesamiento: puertoprocesamientosincronizacionsie,
    private readonly umbralpausadiscrepancias = 0.2,
    private readonly plazorevisiondiscrepanciashoras = 72,
    private readonly fuenteConfig: resultadoprocesamientosie['source'] = configuraciontrabajador.sie
      .fuente,
  ) {}

  async validardestino(idsincronizacion: string): Promise<void> {
    const coincide = await this.repositorioprocesamiento.validardestinosincronizacion(
      idsincronizacion,
      this.fuenteConfig,
    );
    if (!coincide) throw new errordestinosincronizacionincompatible();
  }

  async ejecutar(
    datostrabajo: trabajoprocesamientosie,
    opciones: { esintentofinal?: boolean } = {},
  ): Promise<resultadoprocesamientosie> {
    await this.validardestino(datostrabajo.synchronizationId);
    const fuenteConfig = this.fuenteConfig;
    const estadosincronizacion = await this.repositorioprocesamiento.obtenerestadosincronizacion(
      datostrabajo.synchronizationId,
    );
    if (!estadosincronizacion) throw new Error('La solicitud de sincronización no existe');
    if (estadosincronizacion === estadosincronizacionsie.PAUSED) {
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: datostrabajo.localGrade,
        sieValue: null,
        status: estadosincronizacionsie.PAUSED,
        isMatched: false,
        source: fuenteConfig,
        verifiedAt: null,
        skipped: true,
      };
    }

    let reclamacion = await this.repositorioprocesamiento.reclamarelemento(
      datostrabajo.synchronizationId,
      datostrabajo.itemId,
    );
    while (reclamacion.tipo === 'ocupado') {
      const esperarmilisegundos = reclamacion.esperarmilisegundos;
      await new Promise((resolver) =>
        setTimeout(resolver, Math.max(250, Math.min(esperarmilisegundos, 5000))),
      );
      const estadoreclamado = await this.repositorioprocesamiento.obtenerestadosincronizacion(
        datostrabajo.synchronizationId,
      );
      if (estadoreclamado === estadosincronizacionsie.PAUSED) {
        return {
          synchronizationId: datostrabajo.synchronizationId,
          itemId: datostrabajo.itemId,
          studentRude: datostrabajo.studentRude,
          localValue: datostrabajo.localGrade,
          sieValue: null,
          status: estadosincronizacionsie.PAUSED,
          isMatched: false,
          source: fuenteConfig,
          verifiedAt: null,
          skipped: true,
        };
      }
      reclamacion = await this.repositorioprocesamiento.reclamarelemento(
        datostrabajo.synchronizationId,
        datostrabajo.itemId,
      );
    }
    if (reclamacion.tipo === 'nodisponible') {
      const elementoalmacenado = await this.repositorioprocesamiento.buscarelemento(
        datostrabajo.itemId,
      );
      if (!elementoalmacenado || elementoalmacenado.estado === estadosincronizacionsie.CANCELLED) {
        throw new Error('El ítem de sincronización no existe o fue cancelado');
      }
      if (!estadosfinalessie.has(elementoalmacenado.estado)) {
        throw new Error('El ítem de sincronización ya está siendo procesado');
      }
      return {
        synchronizationId: datostrabajo.synchronizationId,
        itemId: datostrabajo.itemId,
        studentRude: datostrabajo.studentRude,
        localValue: elementoalmacenado.valorlocal,
        sieValue: elementoalmacenado.valorsie,
        status: elementoalmacenado.estado,
        isMatched: elementoalmacenado.estado === estadosincronizacionsie.VERIFIED,
        source: fuenteConfig,
        ...(elementoalmacenado.mensajeerror
          ? { errorMessage: elementoalmacenado.mensajeerror }
          : {}),
        verifiedAt: elementoalmacenado.verificadoen?.toISOString() ?? null,
      };
    }
    const tokenreclamo = reclamacion.token;

    await this.repositorioprocesamiento.marcarinicioyprocesamiento(
      datostrabajo.synchronizationId,
      new Date(),
    );

    let latidodetenido = false;
    let reclamoperdido = false;
    let latidoencurso: Promise<void> | null = null;
    const latido = setInterval(() => {
      if (latidoencurso || latidodetenido || reclamoperdido) return;
      latidoencurso = this.repositorioprocesamiento
        .renovarreclamoelemento(datostrabajo.synchronizationId, datostrabajo.itemId, tokenreclamo)
        .then((renovado) => {
          if (!renovado) reclamoperdido = true;
        })
        .catch(() => undefined)
        .finally(() => {
          latidoencurso = null;
        });
    }, intervaloactualizacionarrendamientosie);

    let resultado: resultadoprocesamientosie;
    let falloreintentable = false;
    try {
      try {
        resultado =
          await this.puertoautomatizacion.procesarsincronizacioncalificacion(datostrabajo);
      } catch (fallo: unknown) {
        const mensajeerror =
          fallo instanceof Error ? fallo.message : 'Error desconocido del proceso SIE';
        if (fallo instanceof errorautenticacionsierequerida) {
          resultado = {
            synchronizationId: datostrabajo.synchronizationId,
            itemId: datostrabajo.itemId,
            studentRude: datostrabajo.studentRude,
            localValue: datostrabajo.localGrade,
            sieValue: null,
            status: estadosincronizacionsie.AUTH_REQUIRED,
            isMatched: false,
            source: fuenteConfig,
            errorMessage: mensajeerror,
            verifiedAt: null,
          };
        } else if (!opciones.esintentofinal) {
          await this.repositorioprocesamiento.devolverelementoalacola(
            datostrabajo.itemId,
            tokenreclamo,
            mensajeerror,
          );
          throw fallo;
        } else {
          falloreintentable = true;
          resultado = {
            synchronizationId: datostrabajo.synchronizationId,
            itemId: datostrabajo.itemId,
            studentRude: datostrabajo.studentRude,
            localValue: datostrabajo.localGrade,
            sieValue: null,
            status: estadosincronizacionsie.FAILED,
            isMatched: false,
            source: fuenteConfig,
            errorMessage: mensajeerror,
            verifiedAt: null,
          };
        }
      }

      if (resultado.status === estadosincronizacionsie.AUTH_REQUIRED) {
        resultado = {
          ...resultado,
          sieValue: null,
          source: fuenteConfig,
          isMatched: false,
          errorMessage: 'La autenticación del SIE requiere atención.',
          verifiedAt: null,
        };
      }

      if (reclamoperdido) throw new Error('El trabajo perdió su reclamo de procesamiento');
      const guardado = await this.repositorioprocesamiento.guardarresultado({
        datostrabajo,
        tokenreclamo,
        resultado,
        falloreintentable,
        umbralpausadiscrepancias: this.umbralpausadiscrepancias,
        plazorevisiondiscrepanciashoras: this.plazorevisiondiscrepanciashoras,
      });
      if (!guardado) throw new Error('El resultado no pertenece al reclamo activo');
      return resultado;
    } finally {
      latidodetenido = true;
      clearInterval(latido);
      if (latidoencurso) await latidoencurso;
    }
  }
}
