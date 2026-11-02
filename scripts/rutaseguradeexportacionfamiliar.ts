import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

function isWithinDirectory(candidate: string, directory: string): boolean {
  const relativePath = path.relative(directory, candidate);
  return (
    relativePath === '' ||
    (!relativePath.startsWith(`..${path.sep}`) &&
      relativePath !== '..' &&
      !path.isAbsolute(relativePath))
  );
}

function assertSafeExportDirectory(exportDirectory: string): string {
  const resolvedDirectory = path.resolve(exportDirectory);
  const directoryMetadata = fs.lstatSync(resolvedDirectory);
  if (!directoryMetadata.isDirectory() || directoryMetadata.isSymbolicLink()) {
    throw new Error('La ruta de exportación debe ser un directorio real, no un enlace.');
  }

  const realDirectory = fs.realpathSync(resolvedDirectory);
  if (path.resolve(realDirectory) !== resolvedDirectory) {
    throw new Error(
      'La ruta de exportación cambió al resolverla; vuelve a verificar el directorio.',
    );
  }

  const repositoryRoot = fs.realpathSync(path.resolve(__dirname, '..'));
  if (isWithinDirectory(realDirectory, repositoryRoot)) {
    throw new Error('La exportación debe guardarse fuera del repositorio.');
  }
  return resolvedDirectory;
}

export function assertSafeExportFilePath(exportDirectory: string, filename: string): string {
  const safeDirectory = assertSafeExportDirectory(exportDirectory);
  const outputPath = path.join(safeDirectory, filename);
  try {
    const metadata = fs.lstatSync(outputPath);
    if (metadata.isSymbolicLink()) {
      throw new Error(`La salida ${filename} no puede ser un enlace simbólico.`);
    }
    if (!metadata.isFile()) {
      throw new Error(`La salida ${filename} debe ser un archivo regular.`);
    }
    if (metadata.nlink !== 1) {
      throw new Error(`La salida ${filename} no puede tener enlaces duros.`);
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return outputPath;
    throw error;
  }
  return outputPath;
}

export function writeSafeExportFile(
  exportDirectory: string,
  filename: string,
  contents: string,
  encoding: BufferEncoding = 'utf8',
): string {
  const safeDirectory = assertSafeExportDirectory(exportDirectory);
  const outputPath = assertSafeExportFilePath(safeDirectory, filename);
  const temporaryPath = path.join(safeDirectory, `.${filename}.${randomUUID()}.tmp`);
  let descriptor: number | undefined;

  try {
    assertSafeExportDirectory(safeDirectory);
    descriptor = fs.openSync(temporaryPath, 'wx', 0o600);
    assertSafeExportDirectory(safeDirectory);
    const descriptorMetadata = fs.fstatSync(descriptor);
    const pathMetadata = fs.statSync(temporaryPath);
    if (
      descriptorMetadata.dev !== pathMetadata.dev ||
      descriptorMetadata.ino !== pathMetadata.ino ||
      descriptorMetadata.nlink !== 1
    ) {
      throw new Error('El archivo temporal de exportación cambió durante su creación.');
    }
    fs.writeFileSync(descriptor, contents, { encoding });
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;

    // Revalidate after writing; rename replaces the directory entry instead of following a link.
    assertSafeExportDirectory(safeDirectory);
    assertSafeExportFilePath(safeDirectory, filename);
    fs.renameSync(temporaryPath, outputPath);
    return outputPath;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
}
