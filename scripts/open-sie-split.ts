import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';

dotenv.config();

function getExecutablePath(): string | undefined {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

export async function openSieInSplitWindow(keepOpen = true) {
  const sieUrl = process.env.SIE_BASE_URL || 'https://academico.sie.gob.bo';
  const username = process.env.SIE_USERNAME || '2967609';
  const password = process.env.SIE_PASSWORD || 'Olaa@mar123*';

  console.log('Lanzando ventana visible de navegador para el SIE...');
  const executablePath = getExecutablePath();

  const browser = await puppeteer.launch({
    headless: false,
    executablePath,
    defaultViewport: null,
    args: [
      '--window-size=960,1040',
      '--window-position=960,0',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());

  console.log(`Navegando a ${sieUrl}...`);
  await page.goto(sieUrl, { waitUntil: 'networkidle2', timeout: 35000 });

  await page.waitForSelector('#username', { timeout: 10000 });
  await page.type('#username', username, { delay: 35 });
  await page.type('#password', password, { delay: 35 });

  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) {
    const isChecked = await (await checkbox.getProperty('checked')).jsonValue();
    if (!isChecked) {
      await checkbox.click();
    }
  }

  console.log('Iniciando sesión en el SIE...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 35000 }).catch(() => {}),
    page.click('.btn-aceptar'),
  ]);

  console.log('Sesión iniciada. URL actual:', page.url(), 'Título:', await page.title());

  if (!keepOpen) {
    await browser.close();
  } else {
    console.log('El navegador permanece abierto en la mitad derecha de la pantalla.');
  }

  return {
    url: page.url(),
    title: await page.title(),
  };
}

if (require.main === module) {
  openSieInSplitWindow(true).catch(console.error);
}
