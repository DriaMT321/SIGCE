import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as dotenv from 'dotenv';
import {
  connectionArgs,
  findPostgresTool,
  readDatabaseConfig,
  runPostgresTool,
} from './consolapostgres';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface RestoreOptions {
  backupPath?: string;
  targetDatabase?: string;
  confirmedTarget?: string;
  help: boolean;
}

function parseArgs(args: string[]): RestoreOptions {
  const options: RestoreOptions = { help: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') {
      options.help = true;
      continue;
    }
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error('Falta el valor para ' + argument + '.');
    if (argument === '--backup') options.backupPath = value;
    else if (argument === '--target-database') options.targetDatabase = value;
    else if (argument === '--confirm-target') options.confirmedTarget = value;
    else throw new Error('Argumento desconocido: ' + argument + '.');
    index += 1;
  }
  return options;
}

function printUsage(): void {
  console.log(
    [
      'Uso seguro de restauración:',
      '  pnpm db:restore -- --backup <archivo.dump> --target-database <base> --confirm-target <base>',
      '',
      'La confirmación debe repetir exactamente el nombre de la base destino. El volcado debe',
      'estar en formato custom de PostgreSQL y se restaura en una sola transacción. El destino',
      'debe existir; el comando no crea ni limpia bases de datos.',
    ].join('\n'),
  );
}

function validateArchive(pgRestore: string, backupPath: string): void {
  const result = spawnSync(pgRestore, ['--list', backupPath], {
    stdio: 'ignore',
    windowsHide: true,
  });
  if (result.error || result.status !== 0) {
    throw new Error('El archivo no es un volcado custom válido de PostgreSQL.');
  }
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  if (!options.backupPath || !options.targetDatabase || !options.confirmedTarget) {
    printUsage();
    throw new Error('Indica el archivo, la base destino y confirma el nombre de la base.');
  }
  if (options.targetDatabase !== options.confirmedTarget) {
    throw new Error(
      'El nombre confirmado no coincide con la base destino; se canceló la restauración.',
    );
  }

  const backupPath = path.resolve(options.backupPath);
  const backupStat = fs.existsSync(backupPath) ? fs.statSync(backupPath) : null;
  if (!backupStat || !backupStat.isFile() || backupStat.size === 0) {
    throw new Error('El archivo de respaldo no existe, no es un archivo normal o está vacío.');
  }

  const config = readDatabaseConfig(options.targetDatabase);
  const pgRestore = findPostgresTool('pg_restore');
  validateArchive(pgRestore, backupPath);

  console.log('Restaurando el volcado seleccionado en la base "' + config.database + '".');
  runPostgresTool(
    pgRestore,
    [
      ...connectionArgs(config),
      '--format=custom',
      '--exit-on-error',
      '--single-transaction',
      '--no-owner',
      '--no-privileges',
      backupPath,
    ],
    config.password,
  );
  console.log('Restauración completada.');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'No se pudo completar la restauración.');
  process.exitCode = 1;
}
