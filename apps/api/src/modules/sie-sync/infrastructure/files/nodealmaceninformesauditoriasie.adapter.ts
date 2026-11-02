import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { validaraclprivada, validarancestrosprivados } from '@academic/seguridadarchivos';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { almaceninformeauditoriasie } from '../../application/ports/ejecucionauditoriacalificacionsie.ports';

@Injectable()
export class adaptadoralmaceninformessienode implements almaceninformeauditoriasie {
  obtenerdirectoriotemporal(): string {
    const hogar = fs.realpathSync(os.homedir());
    const directorioinformes = path.join(hogar, '.sigce', 'informes-sie');
    validarancestrosprivados(directorioinformes);
    fs.mkdirSync(directorioinformes, { recursive: true, mode: 0o700 });
    const metadatos = fs.lstatSync(directorioinformes);
    if (!metadatos.isDirectory() || metadatos.isSymbolicLink()) {
      throw new Error('El directorio de informes SIE debe ser una carpeta real.');
    }
    if (process.platform !== 'win32' && (metadatos.mode & 0o077) !== 0) {
      throw new Error(
        'El directorio de informes SIE debe ser privado (permisos 0700 o más restrictivos).',
      );
    }
    validaraclprivada(directorioinformes);
    const rutareal = fs.realpathSync(directorioinformes);
    if (path.normalize(rutareal) !== path.normalize(directorioinformes)) {
      throw new Error('La ruta efectiva de informes SIE no puede atravesar enlaces simbólicos.');
    }
    return rutareal;
  }

  idproceso(): number {
    return process.pid;
  }

  nuevoidentificador(): string {
    return randomUUID();
  }

  unirruta(...partes: string[]): string {
    return path.join(...partes);
  }

  nombrebase(rutaarchivo: string): string {
    return path.basename(rutaarchivo);
  }

  listararchivos(directorio: string): string[] {
    return fs.readdirSync(directorio);
  }

  existe(rutaarchivo: string): boolean {
    return fs.existsSync(rutaarchivo);
  }

  leertexto(rutaarchivo: string): string {
    return fs.readFileSync(rutaarchivo, 'utf8');
  }

  modificadoen(rutaarchivo: string): number {
    return fs.statSync(rutaarchivo).mtimeMs;
  }

  eliminararchivo(rutaarchivo: string): void {
    try {
      fs.unlinkSync(rutaarchivo);
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
  }

  estaprocesoactivo(idproceso: number): boolean {
    try {
      process.kill(idproceso, 0);
      return true;
    } catch (error) {
      return error instanceof Error && 'code' in error && error.code !== 'ESRCH';
    }
  }

  asegurarmarcadorpublicado(rutaarchivo: string): void {
    try {
      fs.writeFileSync(rutaarchivo, 'PUBLISHED\n', { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) throw error;
    }
    validaraclprivada(rutaarchivo);
  }

  escribirexclusivoysincronizar(rutaarchivo: string, contenido: string): void {
    const descriptor = fs.openSync(rutaarchivo, 'wx', 0o600);
    try {
      fs.writeFileSync(descriptor, contenido, 'utf8');
      fs.fsyncSync(descriptor);
    } finally {
      fs.closeSync(descriptor);
    }
    try {
      validaraclprivada(rutaarchivo);
    } catch (error) {
      fs.rmSync(rutaarchivo, { force: true });
      throw error;
    }
  }

  publicarexclusivo(rutapendiente: string, rutapublicada: string): void {
    fs.linkSync(rutapendiente, rutapublicada);
    fs.unlinkSync(rutapendiente);
  }
}
