import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { test } from 'node:test';
import { assertSafeExportFilePath, writeSafeExportFile } from './rutaseguradeexportacionfamiliar';

test('rejects hard-linked export targets', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-export-'));
  const protectedFile = path.join(directory, 'protected.txt');
  const exportFile = path.join(directory, 'families.json');

  try {
    fs.writeFileSync(protectedFile, 'original');
    fs.linkSync(protectedFile, exportFile);

    assert.throws(() => assertSafeExportFilePath(directory, 'families.json'), /enlaces duros/);
    assert.throws(
      () => writeSafeExportFile(directory, 'families.json', 'replacement'),
      /enlaces duros/,
    );
    assert.equal(fs.readFileSync(protectedFile, 'utf8'), 'original');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('writes an export through a temporary file and replaces a normal target', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-export-'));
  const outputFile = path.join(directory, 'families.json');

  try {
    fs.writeFileSync(outputFile, 'old');
    assert.equal(writeSafeExportFile(directory, 'families.json', 'new'), outputFile);
    assert.equal(fs.readFileSync(outputFile, 'utf8'), 'new');
    assert.deepEqual(fs.readdirSync(directory), ['families.json']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('rejects an export directory reached through a junction or symbolic link', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'sigce-export-'));
  const actualDirectory = path.join(parent, 'actual');
  const linkedDirectory = path.join(parent, 'linked');

  try {
    fs.mkdirSync(actualDirectory);
    fs.symlinkSync(
      actualDirectory,
      linkedDirectory,
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    assert.throws(
      () => assertSafeExportFilePath(linkedDirectory, 'families.json'),
      /directorio real/,
    );
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});
