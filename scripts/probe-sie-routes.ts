import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';

dotenv.config();

async function probeRoutes() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Ingresando al SIE...');
  await page.goto('https://academico.sie.gob.bo', { waitUntil: 'networkidle2' });
  await page.type('#username', '2967609');
  await page.type('#password', 'Olaa@mar123*');
  const cb = await page.$('input[type="checkbox"]');
  if (cb) await cb.click();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('.btn-aceptar'),
  ]);

  const routes = [
    '/sie/infoConsolidation/',
    '/sie/changeParalelo/',
    '/acceso/newhistoryInscription/',
    '/sie/maestroAsignacion/asignar/maestro/materia/index',
    '/sie/tramite/',
  ];

  for (const r of routes) {
    console.log(`\n================== RUTA: ${r} ==================`);
    try {
      await page.goto(`https://academico.sie.gob.bo${r}`, {
        waitUntil: 'networkidle2',
        timeout: 25000,
      });
      console.log('URL actual:', page.url());
      console.log('Título:', await page.title());

      const data = await page.evaluate(() => {
        const titleEl = document.querySelector('h1, h2, h3, .page-header, .panel-title');
        const tables = Array.from(document.querySelectorAll('table')).map((t) => ({
          id: t.id,
          class: t.className,
          headers: Array.from(t.querySelectorAll('th')).map((th) => th.innerText.trim()),
          rowsCount: t.querySelectorAll('tbody tr').length,
        }));
        const selects = Array.from(document.querySelectorAll('select')).map((s) => ({
          id: s.id,
          name: s.name,
          options: Array.from(s.options).map((o) => o.text.trim()),
        }));
        const buttons = Array.from(document.querySelectorAll('button, a.btn')).map((b) => ({
          text: b.textContent?.trim().replace(/\s+/g, ' ') || '',
          onclick: b.getAttribute('onclick') || '',
          href: b.getAttribute('href') || '',
        }));

        return {
          title: titleEl ? titleEl.textContent?.trim() : '',
          tables,
          selects,
          buttons: buttons.slice(0, 15),
        };
      });

      console.log(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      console.log(`Error en ruta ${r}: ${err}`);
    }
  }

  await browser.close();
}

probeRoutes().catch(console.error);
