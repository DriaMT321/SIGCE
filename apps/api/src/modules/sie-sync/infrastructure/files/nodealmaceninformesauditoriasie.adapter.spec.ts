import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';
import { adaptadoralmaceninformessienode } from './nodealmaceninformesauditoriasie.adapter';

describe('adaptador de almacenamiento privado para informes SIE', () => {
  const pruebaenposix = process.platform === 'win32' ? it.skip : it;
  const pruebaenwindows = process.platform === 'win32' ? it : it.skip;
  let raiztemporal: string;
  let hogartemporal: string;

  beforeEach(() => {
    raiztemporal = fs.mkdtempSync(path.join(os.homedir(), '.sigce-informes-sie-'));
    hogartemporal = path.join(raiztemporal, 'home');
    fs.mkdirSync(hogartemporal);
    if (process.platform === 'win32') {
      const usuario = execFileSync('whoami.exe', ['/user', '/fo', 'csv', '/nh'], {
        encoding: 'utf8',
        windowsHide: true,
      }).match(/S-1-\d-(?:\d+-)*\d+/)?.[0];
      if (!usuario) throw new Error('No se pudo determinar el SID para la carpeta temporal.');
      execFileSync('icacls.exe', [hogartemporal, '/inheritance:r'], {
        stdio: 'ignore',
        windowsHide: true,
      });
      for (const sid of [usuario, 'S-1-5-18', 'S-1-5-32-544']) {
        execFileSync('icacls.exe', [hogartemporal, '/grant:r', `*${sid}:(OI)(CI)F`], {
          stdio: 'ignore',
          windowsHide: true,
        });
      }
    }
    jest.spyOn(os, 'homedir').mockReturnValue(hogartemporal);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fs.rmSync(raiztemporal, { recursive: true, force: true });
  });

  it('creates reports under a dedicated directory in the user profile', () => {
    const directorio = new adaptadoralmaceninformessienode().obtenerdirectoriotemporal();
    expect(directorio).toBe(path.join(hogartemporal, '.sigce', 'informes-sie'));
    expect(fs.statSync(directorio).isDirectory()).toBe(true);
    if (process.platform !== 'win32') {
      expect(fs.statSync(directorio).mode & 0o777).toBe(0o700);
    }
  });

  it('writes report files only when their inherited permissions are private', () => {
    const almacen = new adaptadoralmaceninformessienode();
    const directorio = almacen.obtenerdirectoriotemporal();
    const rutaarchivo = path.join(directorio, 'informe.json');

    almacen.escribirexclusivoysincronizar(rutaarchivo, '{"seguro":true}');

    expect(fs.readFileSync(rutaarchivo, 'utf8')).toBe('{"seguro":true}');
  });

  pruebaenwindows('rejects report directories with broad Windows ACLs', () => {
    const directorio = path.join(hogartemporal, '.sigce', 'informes-sie');
    fs.mkdirSync(directorio, { recursive: true });
    execFileSync('icacls.exe', [directorio, '/grant', '*S-1-1-0:(OI)(CI)R'], {
      stdio: 'ignore',
      windowsHide: true,
    });

    expect(() => new adaptadoralmaceninformessienode().obtenerdirectoriotemporal()).toThrow(
      /limitar el acceso/,
    );
  });

  pruebaenwindows(
    'rejects report directories under a parent that other accounts can modify',
    () => {
      const padre = path.join(hogartemporal, '.sigce');
      const directorio = path.join(padre, 'informes-sie');
      fs.mkdirSync(directorio, { recursive: true });
      execFileSync('icacls.exe', [padre, '/grant', '*S-1-1-0:(OI)(CI)M'], {
        stdio: 'ignore',
        windowsHide: true,
      });

      expect(() => new adaptadoralmaceninformessienode().obtenerdirectoriotemporal()).toThrow(
        /propietarios o permisos de directorio no confiables/,
      );
    },
  );

  it('rejects a report directory reached through a symbolic link', () => {
    const realdirectory = path.join(raiztemporal, 'real');
    const directorioseguro = path.join(hogartemporal, '.sigce');
    fs.mkdirSync(realdirectory);
    fs.mkdirSync(directorioseguro);
    fs.symlinkSync(
      realdirectory,
      path.join(directorioseguro, 'informes-sie'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );

    expect(() => new adaptadoralmaceninformessienode().obtenerdirectoriotemporal()).toThrow(
      /enlaces simbólicos/,
    );
  });

  pruebaenposix('rejects shared report directories without changing permissions', () => {
    const directorio = path.join(hogartemporal, '.sigce', 'informes-sie');
    fs.mkdirSync(directorio, { recursive: true, mode: 0o755 });
    fs.chmodSync(directorio, 0o755);

    expect(() => new adaptadoralmaceninformessienode().obtenerdirectoriotemporal()).toThrow(
      /debe ser privado/,
    );
    expect(fs.statSync(directorio).mode & 0o777).toBe(0o755);
  });
});
