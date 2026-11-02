import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import * as dotenv from 'dotenv';
import {
  connectionArgs as argumentosconexion,
  findPostgresTool as buscarherramientapostgres,
  readDatabaseConfig as leerconfiguracionbasedatos,
  runPostgresTool as ejecutarherramientapostgres,
} from './consolapostgres';
import { validaraclprivada } from '@academic/seguridadarchivos';
import { resolverdirectorioprivado } from './rutaseguradirectorioprivado';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function fragmentosegurodearchivo(valor: string): string {
  return valor.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function ejecutarrespaldo(): void {
  const configuracion = leerconfiguracionbasedatos();
  const raizproyecto = path.resolve(__dirname, '..');
  const directorioprivado = resolverdirectorioprivado(
    raizproyecto,
    process.env.SIGCE_BACKUP_DIR,
    path.join(os.homedir(), '.sigce', 'backups'),
  );

  const marca = new Date().toISOString().replace(/[:.]/g, '-');
  const identificadorrespaldo = randomUUID();
  const rutadump = path.join(
    directorioprivado,
    `sigce_${fragmentosegurodearchivo(configuracion.database)}_${marca}_${identificadorrespaldo}.dump`,
  );
  const rutatemporal = `${rutadump}.partial`;
  const herramientapgdump = buscarherramientapostgres('pg_dump');

  try {
    fs.closeSync(fs.openSync(rutatemporal, 'wx', 0o600));
    validaraclprivada(rutatemporal);
    ejecutarherramientapostgres(
      herramientapgdump,
      [...argumentosconexion(configuracion), '--format=custom', '--blobs', '--file', rutatemporal],
      configuracion.password,
    );

    validaraclprivada(rutatemporal);
    const tamano = fs.statSync(rutatemporal).size;
    if (tamano === 0) throw new Error('pg_dump produjo un archivo vacío.');
    fs.renameSync(rutatemporal, rutadump);
    try {
      validaraclprivada(rutadump);
    } catch (error) {
      fs.rmSync(rutadump, { force: true });
      throw error;
    }
    console.log(`Respaldo verificado: ${rutadump} (${(tamano / 1024).toFixed(1)} KiB).`);
  } catch (error) {
    fs.rmSync(rutatemporal, { force: true });
    throw error;
  }
}

try {
  ejecutarrespaldo();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'No se pudo completar el respaldo.');
  process.exitCode = 1;
}
