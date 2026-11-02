import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { test } from 'node:test';
import { validarentradasacl, validarpropietarioacl } from '@academic/seguridadarchivos';
import { guardararchivoprivado, resolverdirectorioprivado } from './rutaseguradirectorioprivado';

test('rejects private data directories inside the repository before creating them', () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-backup-test-'));
  const repository = path.join(temporaryRoot, 'repository');
  const insideRepository = path.join(repository, 'database', 'backups');
  fs.mkdirSync(repository);

  try {
    assert.throws(
      () =>
        resolverdirectorioprivado(
          repository,
          'database/backups',
          path.join(temporaryRoot, 'default'),
        ),
      /fuera del repositorio/,
    );
    assert.equal(fs.existsSync(insideRepository), false);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test('creates external private directories with restricted permissions where supported', () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-backup-test-'));
  const repository = path.join(temporaryRoot, 'repository');
  const backupDirectory = path.join(temporaryRoot, 'private', 'backups');
  fs.mkdirSync(repository);

  try {
    assert.equal(
      resolverdirectorioprivado(repository, backupDirectory, path.join(temporaryRoot, 'default')),
      backupDirectory,
    );
    if (process.platform !== 'win32') {
      assert.equal(fs.statSync(backupDirectory).mode & 0o777, 0o700);
    }
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test('rejects private directories reached through a symbolic link or junction', () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-backup-test-'));
  const repository = path.join(temporaryRoot, 'repository');
  const actualDirectory = path.join(temporaryRoot, 'actual');
  const linkedDirectory = path.join(temporaryRoot, 'linked');
  fs.mkdirSync(repository);
  fs.mkdirSync(actualDirectory);
  fs.symlinkSync(
    actualDirectory,
    linkedDirectory,
    process.platform === 'win32' ? 'junction' : 'dir',
  );

  try {
    assert.throws(
      () =>
        resolverdirectorioprivado(repository, linkedDirectory, path.join(temporaryRoot, 'default')),
      /enlaces simbólicos o junctions/,
    );
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});

test(
  'rejects shared existing directories without changing their permissions',
  { skip: process.platform === 'win32' },
  () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-backup-test-'));
    const repository = path.join(temporaryRoot, 'repository');
    const sharedDirectory = path.join(temporaryRoot, 'shared');
    fs.mkdirSync(repository);
    fs.mkdirSync(sharedDirectory, { mode: 0o755 });
    fs.chmodSync(sharedDirectory, 0o755);

    try {
      assert.throws(
        () =>
          resolverdirectorioprivado(
            repository,
            sharedDirectory,
            path.join(temporaryRoot, 'default'),
          ),
        /permisos 0700/,
      );
      assert.equal(fs.statSync(sharedDirectory).mode & 0o777, 0o755);
    } finally {
      fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
  },
);

test(
  'rejects Windows directories with broad access ACLs',
  { skip: process.platform !== 'win32' },
  () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-shared-acl-test-'));
    const repository = path.join(temporaryRoot, 'repository');
    const sharedDirectory = path.join(temporaryRoot, 'shared');
    fs.mkdirSync(repository);
    fs.mkdirSync(sharedDirectory);
    execFileSync('icacls.exe', [sharedDirectory, '/grant', '*S-1-1-0:(OI)(CI)R'], {
      stdio: 'ignore',
      windowsHide: true,
    });

    try {
      assert.throws(
        () =>
          resolverdirectorioprivado(
            repository,
            sharedDirectory,
            path.join(temporaryRoot, 'default'),
          ),
        /limitar el acceso/,
      );
    } finally {
      fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
  },
);

test('rejects broad conditional ACEs and nested SDDL instead of ignoring them', () => {
  const usuario = 'S-1-5-21-1-2-3-1001';
  const aclprivada = `D:(A;OICIID;FA;;;SY)(A;OICIID;FA;;;BA)(A;OICIID;FA;;;${usuario})`;
  const aclcondicional =
    'D:(XA;OICI;FA;;;S-1-1-0;(@User.department == "school" && (@User.clearance > 2)))';

  assert.doesNotThrow(() => validarentradasacl(aclprivada, usuario));
  assert.throws(() => validarentradasacl(aclcondicional, usuario), /no privado/);
  assert.throws(() => validarentradasacl('D:)(A;OICI;FA;;;SY)', usuario), /no es válido/);
  assert.throws(() => validarentradasacl('D:(A;OICI;FA;;;SY', usuario), /no privado/);
});

test('accepts only trusted Windows ACL owners', () => {
  const usuario = 'S-1-5-21-1-2-3-1001';

  assert.doesNotThrow(() => validarpropietarioacl(usuario, usuario));
  assert.doesNotThrow(() => validarpropietarioacl('S-1-5-18', usuario));
  assert.doesNotThrow(() => validarpropietarioacl('S-1-5-32-544', usuario));
  assert.doesNotThrow(() =>
    validarpropietarioacl(
      'S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464',
      usuario,
      true,
    ),
  );
  assert.throws(() => validarpropietarioacl('S-1-1-0', usuario), /propietario no confiable/);
  assert.throws(
    () =>
      validarpropietarioacl(
        'S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464',
        usuario,
      ),
    /propietario no confiable/,
  );
});

test(
  'rejects POSIX ancestor directories writable by a group or other user',
  { skip: process.platform === 'win32' },
  () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-unsafe-parent-test-'));
    const privateParent = path.join(temporaryRoot, 'parent');
    const privateDirectory = path.join(privateParent, 'private');
    fs.mkdirSync(privateDirectory, { recursive: true, mode: 0o700 });
    fs.chmodSync(privateParent, 0o770);

    try {
      assert.throws(
        () =>
          resolverdirectorioprivado(
            temporaryRoot,
            privateDirectory,
            path.join(temporaryRoot, 'default'),
          ),
        /modificaciones de otras cuentas/,
      );
    } finally {
      fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
  },
);

test('rejects a null DACL', () => {
  const usuario = 'S-1-5-21-1-2-3-1001';
  assert.throws(() => validarentradasacl('D:NO_ACCESS_CONTROL', usuario), /no privado/);
});

test('writes private files exclusively and rejects path traversal', () => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.homedir(), 'sigce-private-file-test-'));
  const repository = path.join(temporaryRoot, 'repository');
  const privateDirectory = path.join(temporaryRoot, 'private');
  fs.mkdirSync(repository);

  try {
    const directory = resolverdirectorioprivado(
      repository,
      privateDirectory,
      path.join(temporaryRoot, 'default'),
    );
    const filename = 'sie-audit.json';
    const filepath = guardararchivoprivado(directory, filename, '{"ok":true}');

    assert.equal(fs.readFileSync(filepath, 'utf8'), '{"ok":true}');
    assert.throws(() => guardararchivoprivado(directory, filename, 'replacement'), {
      code: 'EEXIST',
    });
    assert.throws(
      () => guardararchivoprivado(directory, '../outside.json', 'unsafe'),
      /nombre simple/,
    );
    if (process.platform !== 'win32') {
      assert.equal(fs.statSync(filepath).mode & 0o777, 0o600);
    }
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
