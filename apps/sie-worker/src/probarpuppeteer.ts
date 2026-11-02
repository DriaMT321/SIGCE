import { adaptadorpuppeteersie } from './infrastructure/browser/adaptadorpuppeteersie.adapter';

async function ejecutarprueba() {
  console.log('Iniciando prueba controlada y diagnóstico de Puppeteer...');
  const adaptador = new adaptadorpuppeteersie();

  try {
    const diagnostico = await adaptador.ejecutardiagnosticocontrolado();
    console.log('----------------------------------------------------');
    console.log(`Navegador: Chromium (${diagnostico.versionnavegador})`);
    console.log(`Título de Página de Prueba: "${diagnostico.titulopagina}"`);
    console.log(`Estado Diagnóstico: ${diagnostico.correcto ? 'EXITOSO' : 'FALLIDO'}`);
    console.log('----------------------------------------------------');

    if (!diagnostico.correcto) {
      throw new Error('La prueba diagnóstica de Puppeteer no fue exitosa');
    }
  } catch (fallo) {
    console.error('Error en prueba de Puppeteer:', fallo);
    process.exit(1);
  } finally {
    await adaptador.cerrar();
    console.log('Prueba controlada de Puppeteer finalizada con éxito.');
  }
}

ejecutarprueba();
