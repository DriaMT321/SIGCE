import { PuppeteerSieAdapter } from './infrastructure/browser/puppeteer-sie.adapter';

async function runTest() {
  console.log('🧪 Iniciando prueba controlada y diagnóstico de Puppeteer...');
  const adapter = new PuppeteerSieAdapter();

  try {
    const diagnostic = await adapter.runControlledDiagnosticTest();
    console.log('----------------------------------------------------');
    console.log(`🌐 Navegador: Chromium (${diagnostic.browserVersion})`);
    console.log(`📄 Título de Página de Prueba: "${diagnostic.pageTitle}"`);
    console.log(`🎯 Estado Diagnóstico: ${diagnostic.success ? 'EXITOSO ✅' : 'FALLIDO ❌'}`);
    console.log('----------------------------------------------------');

    if (!diagnostic.success) {
      throw new Error('La prueba diagnóstica de Puppeteer no fue exitosa');
    }
  } catch (error) {
    console.error('❌ Error en prueba de Puppeteer:', error);
    process.exit(1);
  } finally {
    await adapter.close();
    console.log('🎉 Prueba controlada de Puppeteer finalizada con éxito.');
  }
}

runTest();
