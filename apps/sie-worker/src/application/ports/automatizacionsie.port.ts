import {
  resultadoprocesamientosie,
  trabajoprocesamientosie,
} from '../modelos/sincronizacion.model';

export interface puertoautomatizacionsie {
  /**
   * Inicializa el navegador Chromium controlado por Puppeteer
   */
  inicializar(): Promise<void>;

  // El adaptador local compara datos de SIGCE con una página de prueba; nunca transfiere notas.
  procesarsincronizacioncalificacion(
    datostrabajo: trabajoprocesamientosie,
  ): Promise<resultadoprocesamientosie>;

  /**
   * Cierra el navegador y libera recursos
   */
  cerrar(): Promise<void>;
}

export const PUERTO_AUTOMATIZACION_SIE = 'SIE_AUTOMATION_PORT';
