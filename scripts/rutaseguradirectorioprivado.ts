import * as fs from 'node:fs';
import * as path from 'node:path';
import { validaraclprivada, validarancestrosprivados } from '@academic/seguridadarchivos';

function estadentro(ruta: string, directorio: string): boolean {
  const rutarelativa = path.relative(directorio, ruta);
  return (
    rutarelativa === '' ||
    (!rutarelativa.startsWith(`..${path.sep}`) &&
      rutarelativa !== '..' &&
      !path.isAbsolute(rutarelativa))
  );
}

function sonlamismaruta(primeraruta: string, segundaruta: string): boolean {
  const primerarutanormalizada = path.normalize(primeraruta);
  const segundarutanormalizada = path.normalize(segundaruta);
  return process.platform === 'win32'
    ? primerarutanormalizada.toLowerCase() === segundarutanormalizada.toLowerCase()
    : primerarutanormalizada === segundarutanormalizada;
}

export function resolverdirectorioprivado(
  raizproyecto: string,
  directorioconfigurado: string | undefined,
  directoriopredeterminado: string,
): string {
  const raizproyectoreal = fs.realpathSync(raizproyecto);
  const directoriopersonalizado = directorioconfigurado?.trim();
  const directorioresuelto = path.resolve(
    directoriopersonalizado
      ? path.resolve(raizproyectoreal, directoriopersonalizado)
      : directoriopredeterminado,
  );

  if (estadentro(directorioresuelto, raizproyectoreal)) {
    throw new Error('El directorio privado debe quedar fuera del repositorio.');
  }
  validarancestrosprivados(directorioresuelto);
  fs.mkdirSync(directorioresuelto, { recursive: true, mode: 0o700 });

  const metadatos = fs.lstatSync(directorioresuelto);
  if (!metadatos.isDirectory() || metadatos.isSymbolicLink()) {
    throw new Error('La ruta privada debe ser un directorio real.');
  }
  validaraclprivada(directorioresuelto);
  const directorioreal = fs.realpathSync(directorioresuelto);
  if (
    !sonlamismaruta(directorioreal, directorioresuelto) ||
    estadentro(directorioreal, raizproyectoreal)
  ) {
    throw new Error('La ruta efectiva debe quedar fuera del repositorio.');
  }
  return directorioreal;
}

export function guardararchivoprivado(
  directorio: string,
  nombrearchivo: string,
  contenido: string,
): string {
  if (path.basename(nombrearchivo) !== nombrearchivo) {
    throw new Error('El nombre del archivo privado debe ser un nombre simple.');
  }
  const rutaarchivo = path.join(directorio, nombrearchivo);
  const descriptor = fs.openSync(rutaarchivo, 'wx', 0o600);
  try {
    fs.writeFileSync(descriptor, contenido, 'utf8');
    fs.fsyncSync(descriptor);
  } catch (error) {
    fs.closeSync(descriptor);
    fs.rmSync(rutaarchivo, { force: true });
    throw error;
  }
  fs.closeSync(descriptor);
  try {
    validaraclprivada(rutaarchivo);
  } catch (error) {
    fs.rmSync(rutaarchivo, { force: true });
    throw error;
  }
  return rutaarchivo;
}
