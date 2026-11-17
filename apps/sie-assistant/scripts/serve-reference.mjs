import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { basename, dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const selectedFile = process.argv[2];
if (!selectedFile) {
  console.error('Uso: pnpm --filter @academic/sie-assistant demo:reference "C:\\ruta\\sie-calificaciones.html"');
  process.exit(1);
}

const pageFile = resolve(selectedFile);
if (extname(pageFile).toLowerCase() !== '.html' || !statSync(pageFile).isFile()) {
  console.error('Selecciona un archivo HTML existente.');
  process.exit(1);
}

const sourceDirectory = dirname(pageFile);
const fixtureFile = fileURLToPath(new URL('../demo/reference-course-data.js', import.meta.url));
const pageName = basename(pageFile);
const badge = '<div style="position:fixed;top:8px;right:10px;z-index:99999;padding:7px 10px;background:#173b5e;color:white;font:700 11px Arial,sans-serif;pointer-events:none">RÉPLICA LOCAL · DATOS FICTICIOS</div>';
const sourcePage = readFileSync(pageFile);
const sourceHtml = sourcePage.toString('utf8');
const sourceSections = 'if (level === levels[1].name && grade === "Segundo") return ["A", "B"];';
if (!sourceHtml.includes(sourceSections)) {
  console.error('La estructura del selector de cursos cambió; revisa la réplica antes de usarla.');
  process.exit(1);
}
const demoPage = sourceHtml
  .replace(sourceSections, 'if (level === levels[1].name && grade === "Segundo") return ["B"];')
  .replace('src="assets/course-data.js"', 'src="/demo/assets/course-data.js"')
  .replace(/<body([^>]*)>/i, `<body$1>${badge}`);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  if (pathname === '/' || pathname === `/${pageName}`) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : sourcePage);
    return;
  }

  if (pathname === '/demo') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : demoPage);
    return;
  }

  const relative = pathname.slice(1).replaceAll('/', sep);
  if (relative.toLowerCase() === `demo${sep}assets${sep}course-data.js`.toLowerCase()) {
    response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
    if (request.method === 'HEAD') response.end();
    else createReadStream(fixtureFile).pipe(response);
    return;
  }

  const file = resolve(sourceDirectory, relative);
  const allowedFolder = ['assets', 'fonts', 'Login - SIE_files'].some(
    (folder) => relative.startsWith(`${folder}${sep}`),
  );
  const mime = mimeTypes[extname(file).toLowerCase()];
  if (!allowedFolder || !mime || !file.startsWith(`${sourceDirectory}${sep}`)) {
    response.writeHead(404).end();
    return;
  }
  try {
    if (!statSync(file).isFile()) throw new Error('No es un archivo');
    response.writeHead(200, { 'Content-Type': mime });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});

server.listen(4174, 'localhost', () => {
  console.log('Página de referencia sin cambios: http://localhost:4174/');
  console.log('Prueba separada con tres estudiantes ficticios: http://localhost:4174/demo');
});
