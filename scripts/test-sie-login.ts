import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  console.log('===============================================================');
  console.log('PRUEBA DE COMPROBACIÓN Y ACCESO AL PORTAL SIE');
  console.log('===============================================================');

  const sieUrl = process.env.SIE_BASE_URL || 'https://academico.sie.gob.bo';
  const username = process.env.SIE_USERNAME || '2967609';
  const password = process.env.SIE_PASSWORD || 'Olaa@mar123*';

  console.log(`URL SIE: ${sieUrl}`);
  console.log(`Usuario: ${username}`);
  console.log('Iniciando navegador Chromium en segundo plano...');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('[1/4] Comprobando disponibilidad del portal...');
    const response = await page.goto(sieUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    const httpStatus = response ? response.status() : 0;
    console.log(`  -> Estado HTTP: ${httpStatus} (${httpStatus === 200 ? 'ACTIVO' : 'NO ACTIVO'})`);

    const pageTitle = await page.title();
    console.log(`  -> Título de la página: "${pageTitle}"`);

    console.log('[2/4] Introduciendo credenciales en el formulario...');
    await page.waitForSelector('#username', { timeout: 10000 });
    await page.type('#username', username, { delay: 50 });
    await page.type('#password', password, { delay: 50 });

    // Marcar casilla "Validar los datos"
    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) {
      const isChecked = await (await checkbox.getProperty('checked')).jsonValue();
      if (!isChecked) {
        await checkbox.click();
        console.log('  -> Casilla "Validar los datos" marcada.');
      }
    }

    console.log('[3/4] Enviando formulario (clic en botón Aceptar)...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 35000 }).catch((e) => {
        console.log(`  -> Tiempo de navegación: ${e.message}`);
      }),
      page.click('.btn-aceptar'),
    ]);

    console.log('[4/4] Verificando resultado tras el intento de autenticación...');
    const currentUrl = page.url();
    const newTitle = await page.title();
    console.log(`  -> URL resultante: ${currentUrl}`);
    console.log(`  -> Título resultante: "${newTitle}"`);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasErrorAlert = await page.$('.alert-danger, .alert-warning, .text-danger');
    let errorMessage = '';
    if (hasErrorAlert) {
      errorMessage = await page.evaluate((el) => el.textContent?.trim() || '', hasErrorAlert);
    }

    if (errorMessage) {
      console.log(`  -> Mensaje de alerta en el portal: "${errorMessage}"`);
    }

    const isSuccess = !currentUrl.includes('login') || bodyText.toLowerCase().includes('cerrar sesión') || bodyText.toLowerCase().includes('bienvenido');

    console.log('---------------------------------------------------------------');
    if (isSuccess) {
      console.log(' ¡LOGIN EXITOSO EN EL PORTAL SIE!');
    } else {
      console.log(' Diagnóstico del portal:');
      console.log(bodyText.slice(0, 600));
    }
    console.log('---------------------------------------------------------------');

    return {
      active: httpStatus === 200,
      url: currentUrl,
      title: newTitle,
      success: isSuccess,
      message: errorMessage || 'Verificación completada',
    };
  } finally {
    await browser.close();
    console.log('Navegador Chromium cerrado de forma segura.');
  }
}

testLogin().catch((err) => {
  console.error('Error fatal durante la prueba de acceso al SIE:', err);
  process.exitCode = 1;
});
