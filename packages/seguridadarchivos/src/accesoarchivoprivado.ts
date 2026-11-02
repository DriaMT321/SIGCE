import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const sidadministradores = 'S-1-5-32-544';
const sidsistema = 'S-1-5-18';
const sidtrustedinstaller = 'S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464';

export function validarpropietarioacl(
  propietario: string,
  usuario: string,
  permitirtrustedinstaller = false,
): void {
  const propietariospermitidos = new Set([usuario, sidsistema, sidadministradores]);
  if (permitirtrustedinstaller) propietariospermitidos.add(sidtrustedinstaller);
  if (!propietariospermitidos.has(propietario)) {
    throw new Error('La ruta privada tiene un propietario no confiable.');
  }
}

export function validarentradasacl(descriptoracl: string, usuario: string): void {
  const entradas: string[][] = [];
  let profundidad = 0;
  let inicio = -1;

  for (let indice = 0; indice < descriptoracl.length; indice++) {
    if (descriptoracl[indice] === '(') {
      if (profundidad === 0) inicio = indice + 1;
      profundidad++;
    } else if (descriptoracl[indice] === ')') {
      profundidad--;
      if (profundidad < 0) throw new Error('El descriptor de permisos no es válido.');
      if (profundidad === 0) entradas.push(descriptoracl.slice(inicio, indice).split(';'));
    }
  }

  const tipospermitidos = new Set(['A', 'OA', 'XA', 'ZA']);
  const tiposquenootorganacceso = new Set([
    'D',
    'OD',
    'XD',
    'ZD',
    'AU',
    'AL',
    'OU',
    'OL',
    'XU',
    'XL',
    'ML',
    'SP',
    'TL',
    'RA',
  ]);
  const identidadespermitidas = new Set(['SY', 'BA', usuario]);
  if (
    profundidad !== 0 ||
    entradas.length === 0 ||
    !entradas.some((entrada) => tipospermitidos.has(entrada[0]) && entrada[5] === usuario) ||
    entradas.some((entrada) => {
      const tipo = entrada[0];
      if (tipospermitidos.has(tipo)) return !identidadespermitidas.has(entrada[5]);
      return !tiposquenootorganacceso.has(tipo);
    })
  ) {
    throw new Error('El descriptor de permisos concede acceso no privado.');
  }
}

function sonlamismaruta(primeraruta: string, segundaruta: string): boolean {
  const primerarutanormalizada = path.normalize(primeraruta);
  const segundarutanormalizada = path.normalize(segundaruta);
  return process.platform === 'win32'
    ? primerarutanormalizada.toLowerCase() === segundarutanormalizada.toLowerCase()
    : primerarutanormalizada === segundarutanormalizada;
}

function obtenerancestrosreales(ruta: string): { destino: string; rutas: string[] } {
  const destino = path.resolve(ruta);
  let ancestro = destino;
  let objetivoexistente = true;

  while (true) {
    try {
      fs.lstatSync(ancestro);
      break;
    } catch (error) {
      if (
        !error ||
        typeof error !== 'object' ||
        (error as NodeJS.ErrnoException).code !== 'ENOENT'
      ) {
        throw error;
      }
      objetivoexistente = false;
      const padre = path.dirname(ancestro);
      if (padre === ancestro) throw error;
      ancestro = padre;
    }
  }

  if (!objetivoexistente && !fs.lstatSync(ancestro).isDirectory()) {
    throw new Error('La ruta privada debe estar dentro de una carpeta real.');
  }

  const rutas: string[] = [];
  while (true) {
    const metadatos = fs.lstatSync(ancestro);
    if (metadatos.isSymbolicLink() || !sonlamismaruta(fs.realpathSync(ancestro), ancestro)) {
      throw new Error('La ruta privada no puede atravesar enlaces simbólicos o junctions.');
    }
    rutas.push(ancestro);
    const padre = path.dirname(ancestro);
    if (padre === ancestro) break;
    ancestro = padre;
  }
  return { destino, rutas };
}

function validarancestrosposix(destino: string, rutas: string[]): void {
  const uidactual = process.getuid?.();
  if (uidactual === undefined) {
    throw new Error('No se pudo comprobar el propietario de la ruta privada.');
  }

  for (let indice = 0; indice < rutas.length; indice++) {
    const ruta = rutas[indice];
    const metadatos = fs.lstatSync(ruta);
    const esobjetivo = sonlamismaruta(ruta, destino);
    if (!metadatos.isDirectory() && !(esobjetivo && metadatos.isFile())) {
      throw new Error('La ruta privada debe atravesar únicamente carpetas reales.');
    }
    if (metadatos.uid !== 0 && metadatos.uid !== uidactual) {
      throw new Error('La ruta privada tiene un propietario no confiable.');
    }
    if (metadatos.isDirectory()) {
      const escrituraamplia = (metadatos.mode & 0o022) !== 0;
      const directoriopublicoconsticky = (metadatos.mode & 0o1000) !== 0;
      if (escrituraamplia && !directoriopublicoconsticky) {
        throw new Error('Un directorio padre permite modificaciones de otras cuentas.');
      }
      if (esobjetivo && (metadatos.mode & 0o077) !== 0) {
        throw new Error('El directorio privado debe usar permisos 0700 o más restrictivos.');
      }
    } else if (esobjetivo && ((metadatos.mode & 0o077) !== 0 || metadatos.nlink !== 1)) {
      throw new Error(
        'El archivo privado debe ser exclusivo y usar permisos 0600 o más restrictivos.',
      );
    }
  }
}

function validarancestroswindows(
  rutas: string[],
  destino: string,
): { usuario: string; descriptoracl?: string } {
  const comandos = [
    "$ErrorActionPreference = 'Stop'; try {",
    '$usuario = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value;',
    `$permitidos = @($usuario, '${sidsistema}', '${sidadministradores}', '${sidtrustedinstaller}');`,
    '$derechosprotegidos = [int]([System.Security.AccessControl.FileSystemRights]::Delete -bor [System.Security.AccessControl.FileSystemRights]::DeleteSubdirectoriesAndFiles -bor [System.Security.AccessControl.FileSystemRights]::ChangePermissions -bor [System.Security.AccessControl.FileSystemRights]::TakeOwnership);',
    '$rutas = ConvertFrom-Json -InputObject $env:SIGCE_RUTAS_ACL; if ($rutas -is [string]) { $rutas = @($rutas) };',
    '$propietarios = @(); $descriptores = @(); foreach ($rutaactual in $rutas) {',
    "$acl = (Get-Item -LiteralPath $rutaactual).GetAccessControl('Owner,Access');",
    '$descriptores += $acl.GetSecurityDescriptorSddlForm([System.Security.AccessControl.AccessControlSections]::Access);',
    'try { $propietario = ([System.Security.Principal.NTAccount]::new($acl.Owner)).Translate([System.Security.Principal.SecurityIdentifier]).Value } catch { $propietario = ([System.Security.Principal.SecurityIdentifier]::new($acl.Owner)).Value };',
    "if ($propietario -notin $permitidos) { throw 'Propietario no confiable' }; $propietarios += $propietario;",
    'foreach ($regla in $acl.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier])) {',
    "$derechos = [long]$regla.FileSystemRights -band 4294967295L; $soloheredado = $regla.PropagationFlags.HasFlag([System.Security.AccessControl.PropagationFlags]::InheritOnly); if (-not $soloheredado -and $regla.AccessControlType -eq [System.Security.AccessControl.AccessControlType]::Allow -and $regla.IdentityReference.Value -notin $permitidos -and ($derechos -band [long]$derechosprotegidos) -ne 0) { throw 'Permisos de modificación no confiables' }",
    '}}',
    '[pscustomobject]@{ usuario = $usuario; propietarios = $propietarios; descriptores = $descriptores } | ConvertTo-Json -Compress -Depth 3; exit 0',
    '} catch { exit 23 }',
  ].join(' ');
  const resultado = spawnSync(
    'powershell.exe',
    ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', comandos],
    {
      encoding: 'utf8',
      windowsHide: true,
      env: { ...process.env, SIGCE_RUTAS_ACL: JSON.stringify(rutas) },
    },
  );
  if (resultado.error || resultado.status !== 0) {
    throw new Error('La ruta privada tiene propietarios o permisos de directorio no confiables.');
  }

  try {
    const identidad = JSON.parse(resultado.stdout.trim()) as {
      usuario?: unknown;
      propietarios?: unknown;
      descriptores?: unknown;
    };
    if (
      typeof identidad.usuario !== 'string' ||
      !Array.isArray(identidad.propietarios) ||
      identidad.propietarios.length !== rutas.length ||
      identidad.propietarios.some((propietario) => typeof propietario !== 'string') ||
      !Array.isArray(identidad.descriptores) ||
      identidad.descriptores.length !== rutas.length ||
      identidad.descriptores.some((descriptor) => typeof descriptor !== 'string')
    ) {
      throw new Error();
    }
    identidad.propietarios.forEach((propietario, indice) => {
      validarpropietarioacl(
        propietario as string,
        identidad.usuario as string,
        !sonlamismaruta(rutas[indice], destino),
      );
    });
    const indiceobjetivo = rutas.findIndex((ruta) => sonlamismaruta(ruta, destino));
    return {
      usuario: identidad.usuario,
      descriptoracl:
        indiceobjetivo === -1 ? undefined : (identidad.descriptores[indiceobjetivo] as string),
    };
  } catch {
    throw new Error('La ruta privada tiene propietarios o permisos de directorio no confiables.');
  }
}

export function validarancestrosprivados(ruta: string): void {
  const { destino, rutas } = obtenerancestrosreales(ruta);
  if (process.platform === 'win32') {
    validarancestroswindows(rutas, destino);
    return;
  }
  validarancestrosposix(destino, rutas);
}

export function validaraclprivada(ruta: string): void {
  const { destino, rutas } = obtenerancestrosreales(ruta);
  if (process.platform !== 'win32') {
    validarancestrosposix(destino, rutas);
    return;
  }
  const { usuario, descriptoracl } = validarancestroswindows(rutas, destino);
  try {
    if (!descriptoracl) throw new Error();
    validarentradasacl(descriptoracl, usuario);
    const metadatos = fs.lstatSync(ruta);
    if (metadatos.isFile() && metadatos.nlink !== 1) throw new Error();
  } catch {
    throw new Error(
      'La ruta privada en Windows debe limitar el acceso al usuario actual, SYSTEM y administradores.',
    );
  }
}
