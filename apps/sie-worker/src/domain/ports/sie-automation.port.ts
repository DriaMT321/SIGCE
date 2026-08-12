import { SieSyncJobData, SieSyncResult } from '@academic/shared-types';

export interface ISieAutomationPort {
  /**
   * Inicializa el navegador Chromium controlado por Puppeteer
   */
  initialize(): Promise<void>;

  /**
   * Ejecuta el flujo de automatización y verificación RPA para una calificación
   * 1. Autenticación con SIE
   * 2. Navegación al estudiante/curso/período
   * 3. Lectura de valor actual en SIE
   * 4. Comparación y actualización si corresponde
   * 5. Verificación de coincidencia
   */
  processGradeSynchronization(jobData: SieSyncJobData): Promise<SieSyncResult>;

  /**
   * Cierra el navegador y libera recursos
   */
  close(): Promise<void>;

  /**
   * Prueba controlada de Puppeteer en entorno local / sandbox
   */
  runControlledDiagnosticTest(): Promise<{
    browserVersion: string;
    pageTitle: string;
    success: boolean;
  }>;
}

export const SIE_AUTOMATION_PORT = 'SIE_AUTOMATION_PORT';
