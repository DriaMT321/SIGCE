import puppeteer, { Browser } from 'puppeteer';
import { ISieAutomationPort } from '../../domain/ports/sie-automation.port';
import { SieSyncJobData, SieSyncResult, SieSyncStatus } from '@academic/shared-types';
import { workerConfig } from '../../config/worker.config';

export class PuppeteerSieAdapter implements ISieAutomationPort {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    if (!this.browser) {
      console.log('[Puppeteer Adapter] Inicializando instancia de Chromium...');
      this.browser = await puppeteer.launch({
        headless: workerConfig.sie.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });
      console.log('  Chromium inicializado correctamente');
    }
  }

  async processGradeSynchronization(jobData: SieSyncJobData): Promise<SieSyncResult> {
    await this.initialize();
    if (!this.browser) {
      throw new Error('Navegador Puppeteer no inicializado');
    }

    const page = await this.browser.newPage();
    try {
      console.log(`[RPA Worker] Procesando sincronizacion para RUDE: ${jobData.studentRude}, Materia: ${jobData.subjectCode}`);

      // En Fase 1 (Bootstrap), ejecutamos una simulación controlada de lectura y verificación
      // navegando a una página local segura en memoria
      const mockSieHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Portal SIE - Verificación Simulada</title></head>
          <body>
            <h1>Sistema de Información Educativa</h1>
            <div id="student-rude">${jobData.studentRude}</div>
            <div id="subject-code">${jobData.subjectCode}</div>
            <div id="period-number">${jobData.periodNumber}</div>
            <input id="grade-input" value="${jobData.localGrade}" />
            <div id="status-badge">REGISTRADO_SIE</div>
          </body>
        </html>
      `;

      await page.setContent(mockSieHtml, { waitUntil: 'domcontentloaded' });

      // Extraer datos simulados
      const readRude = await page.$eval('#student-rude', (el) => el.textContent?.trim());
      const readGradeStr = await page.$eval(
        '#grade-input',
        (el) => (el as unknown as { value: string }).value,
      );
      const readGrade = parseFloat(readGradeStr || '0');

      console.log(`  -> Datos verificados en pagina: RUDE=${readRude}, Nota=${readGrade}`);

      const isMatched = readGrade === jobData.localGrade;

      return {
        synchronizationId: jobData.synchronizationId,
        itemId: jobData.itemId,
        studentRude: jobData.studentRude,
        localValue: jobData.localGrade,
        sieValue: readGrade,
        status: isMatched ? SieSyncStatus.VERIFIED : SieSyncStatus.FAILED,
        isMatched,
        verifiedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      console.error(`Error en RPA Puppeteer:`, error);
      return {
        synchronizationId: jobData.synchronizationId,
        itemId: jobData.itemId,
        studentRude: jobData.studentRude,
        localValue: jobData.localGrade,
        sieValue: 0,
        status: SieSyncStatus.FAILED,
        isMatched: false,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido en Puppeteer',
        verifiedAt: new Date().toISOString(),
      };
    } finally {
      await page.close();
    }
  }

  async runControlledDiagnosticTest(): Promise<{
    browserVersion: string;
    pageTitle: string;
    success: boolean;
  }> {
    await this.initialize();
    if (!this.browser) {
      throw new Error('Navegador no inicializado');
    }

    const page = await this.browser.newPage();
    try {
      const testHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Antigravity RPA Engine Diagnostic</title></head>
          <body>
            <h1>Puppeteer Test Automation Engine</h1>
            <p id="diagnostic-status">OPERATIONAL</p>
          </body>
        </html>
      `;
      await page.setContent(testHtml);
      const title = await page.title();
      const version = await this.browser.version();
      const statusText = await page.$eval('#diagnostic-status', (el) => el.textContent);

      return {
        browserVersion: version,
        pageTitle: title,
        success: statusText === 'OPERATIONAL',
      };
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('[Puppeteer Adapter] Instancia de Chromium cerrada.');
    }
  }
}
