import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';

dotenv.config();

async function inspectSieDashboard() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    console.log('Ingresando al SIE...');
    await page.goto('https://academico.sie.gob.bo', { waitUntil: 'networkidle2' });

    await page.type('#username', '2967609', { delay: 20 });
    await page.type('#password', 'Olaa@mar123*', { delay: 20 });

    const checkbox = await page.$('input[type="checkbox"]');
    if (checkbox) await checkbox.click();

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 35000 }),
      page.click('.btn-aceptar'),
    ]);

    console.log('Logueado en:', page.url());
    console.log('Título:', await page.title());

    const allLinks = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('a'));
      return items
        .map((a) => ({
          text: (a.textContent || '').trim().replace(/\s+/g, ' '),
          href: a.getAttribute('href') || '',
          onclick: a.getAttribute('onclick') || '',
        }))
        .filter((a) => a.text.length > 0);
    });

    console.log('TODOS LOS ENLACES DEL MENÚ:');
    console.log(JSON.stringify(allLinks, null, 2));
  } finally {
    await browser.close();
  }
}

inspectSieDashboard().catch(console.error);
