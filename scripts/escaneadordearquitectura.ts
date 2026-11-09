import { lstat, mkdtemp, mkdir, readdir, readFile, rm, symlink } from 'node:fs/promises';
import { builtinModules } from 'node:module';
import path from 'node:path';
import * as ts from 'typescript';
import { isRequireCall } from './analisiscargadoresnode';
import { tieneejecuciondinamica, tienereferenciaglobal } from './referenciasglobales';
export * from './analisiscargadoresnode';
export * from './analisiscargadoresdinamicos';
export * from './referenciasglobales';

export const root = path.resolve(__dirname, '..');
export const apiModulesRoot = path.join(root, 'apps', 'api', 'src', 'modules');
const apiTsconfigPath = path.join(root, 'apps', 'api', 'tsconfig.json');
const apiconfiguracionleida = ts.readConfigFile(apiTsconfigPath, ts.sys.readFile);
if (apiconfiguracionleida.error) {
  throw new Error(ts.flattenDiagnosticMessageText(apiconfiguracionleida.error.messageText, '\n'));
}
const apiconfiguracion = ts.parseJsonConfigFileContent(
  apiconfiguracionleida.config,
  ts.sys,
  path.dirname(apiTsconfigPath),
  undefined,
  apiTsconfigPath,
);
if (apiconfiguracion.errors.length > 0) {
  throw new Error(
    apiconfiguracion.errors
      .map((diagnostico) => ts.flattenDiagnosticMessageText(diagnostico.messageText, '\n'))
      .join('\n'),
  );
}
const apiOpcionescompilador = apiconfiguracion.options;
export const mobileLibRoot = path.join(root, 'mobile', 'lib');
export const mobileFeaturesRoot = path.join(root, 'mobile', 'lib', 'features');
export const webSourceRoot = path.join(root, 'apps', 'web', 'src');
export const webFeaturesRoot = path.join(webSourceRoot, 'features');
export const sourceExtensions = new Set([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.dart',
]);
export const testFilePattern = /(?:\.spec|\.test)\.(?:[cm]?(?:js|ts)|[jt]sx?|dart)$/;
export const webLayerNames = new Set([
  'domain',
  'application',
  'infrastructure',
  'presentation',
  'composition',
]);
export const webInnerLayerPackages = new Set([
  'react',
  'react-dom',
  'react-router-dom',
  '@tanstack/react-query',
  'axios',
  'socket.io-client',
  '@hookform/resolvers',
  '@radix-ui/react-label',
  '@radix-ui/react-slot',
  '@tabler/icons-react',
  'class-variance-authority',
  'clsx',
  'lucide-react',
  'react-hook-form',
  'tailwind-merge',
]);
export const nodeBuiltinPackageNames = new Set(
  builtinModules.flatMap((moduleName) => {
    const name = packageName(moduleName);
    if (!name) return [];
    return [name, name.startsWith('node:') ? name.slice('node:'.length) : `node:${name}`];
  }),
);
export const importacionespermitidaspresentacionmovil = new Set([
  'package:flutter/material.dart',
  'package:flutter_riverpod/flutter_riverpod.dart',
  'package:go_router/go_router.dart',
]);
export const legacyWebAdapterPaths = new Set([
  'lib/apiacademica',
  'lib/clienteapi',
  'features/auth/services/serviciodeautenticacion',
]);
export const legacyWebAdapterImportBudget = 0;
// Socket access belongs to infrastructure and must pass through an application port.
export const legacyWebPresentationInfrastructurePaths = new Set(['lib/conexiontiemporeal']);
export const legacyWebPresentationInfrastructureBudget = 0;
export const forbiddenApplicationPackages = new Set([
  '@prisma/client',
  'class-validator',
  'class-transformer',
  'puppeteer',
  'bcryptjs',
  'ioredis',
  'bullmq',
  'node:fs',
  'node:path',
  'node:crypto',
  'fs',
  'path',
  'crypto',
]);

interface SourceFile {
  file: string;
  source: string;
}

interface ImportReference {
  specifier: string;
}

export async function assertNoSymbolicLinkPath(directory: string): Promise<void> {
  const relative = path.relative(root, directory);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Architecture source path is outside the repository: ${directory}`);
  }

  if ((await lstat(root)).isSymbolicLink()) {
    throw new Error(`Architecture repository root cannot be a symbolic link: ${root}`);
  }
  let current = root;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    if ((await lstat(current)).isSymbolicLink()) {
      throw new Error(`Architecture source path cannot contain a symbolic link: ${current}`);
    }
  }
}

export function isSourceFileName(name: string): boolean {
  return sourceExtensions.has(path.extname(name)) && !testFilePattern.test(name);
}

export async function sourceFiles(
  directory: string,
  sourceRoot = directory,
): Promise<SourceFile[]> {
  if (directory === sourceRoot) await assertNoSymbolicLinkPath(sourceRoot);
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`Architecture source tree cannot contain a symbolic link: ${file}`);
      }
      if (entry.isDirectory()) return sourceFiles(file, sourceRoot);
      if (!entry.isFile() || !isSourceFileName(entry.name)) return [];
      return [{ file, source: await readFile(file, 'utf8') }];
    }),
  );
  return nested.flat();
}

export function encontrarciclodependencias(
  grafo: ReadonlyMap<string, ReadonlySet<string>>,
): string[] | undefined {
  const estados = new Map<string, 'visitando' | 'visitado'>();
  const recorrido: string[] = [];
  const nodos = new Set([
    ...grafo.keys(),
    ...[...grafo.values()].flatMap((destinos) => [...destinos]),
  ]);

  const visitar = (nodo: string): string[] | undefined => {
    if (estados.get(nodo) === 'visitado') return undefined;
    if (estados.get(nodo) === 'visitando') {
      return [...recorrido.slice(recorrido.indexOf(nodo)), nodo];
    }
    estados.set(nodo, 'visitando');
    recorrido.push(nodo);
    for (const destino of grafo.get(nodo) ?? []) {
      const ciclo = visitar(destino);
      if (ciclo) return ciclo;
    }
    recorrido.pop();
    estados.set(nodo, 'visitado');
    return undefined;
  };

  for (const nodo of nodos) {
    const ciclo = visitar(nodo);
    if (ciclo) return ciclo;
  }
  return undefined;
}

export function importsFrom(source: string): ImportReference[] {
  const imports: ImportReference[] = [];
  const sourceFile = ts.createSourceFile(
    'architecture-source.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const addSpecifier = (node: ts.Node | undefined) => {
    if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
      imports.push({ specifier: node.text });
    }
  };

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      addSpecifier(node.moduleSpecifier);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addSpecifier(node.moduleReference.expression);
      return;
    } else if (ts.isImportTypeNode(node)) {
      const argument = node.argument;
      if (ts.isLiteralTypeNode(argument)) addSpecifier(argument.literal);
    } else if (ts.isCallExpression(node)) {
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isRequire = isRequireCall(node.expression);
      if (isDynamicImport || isRequire) addSpecifier(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return imports;
}

export function isForbiddenWebInnerPackage(specifier: string): boolean {
  const name = packageName(specifier);
  return Boolean(name && (webInnerLayerPackages.has(name) || nodeBuiltinPackageNames.has(name)));
}

export function hayiodirectonavegador(source: string): boolean {
  return (
    tienereferenciaglobal(
      source,
      new Set([
        'window',
        'globalThis',
        'self',
        'document',
        'navigator',
        'caches',
        'localStorage',
        'sessionStorage',
        'indexedDB',
        'fetch',
        'WebSocket',
        'WebSocketStream',
        'XMLHttpRequest',
        'EventSource',
        'RTCPeerConnection',
        'WebTransport',
        'Worker',
        'SharedWorker',
        'BroadcastChannel',
        'importScripts',
      ]),
    ) || tieneejecuciondinamica(source)
  );
}

export function packageName(specifier: string): string | undefined {
  if (specifier.startsWith('.') || specifier.startsWith('@/')) return undefined;
  const segments = specifier.split('/');
  return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0];
}

export function isTransportContractPackage(specifier: string): boolean {
  return packageName(specifier) === '@academic/shared-types';
}

export function isForbiddenApplicationPackage(specifier: string): boolean {
  const name = packageName(specifier);
  return Boolean(
    name &&
    (forbiddenApplicationPackages.has(name) ||
      nodeBuiltinPackageNames.has(name) ||
      name.startsWith('@nestjs/')),
  );
}

export function apiModule(
  file: string,
): { context: string; layer: string | undefined } | undefined {
  const relative = path.relative(apiModulesRoot, file);
  if (relative.startsWith('..')) return undefined;
  const [context, ...segments] = relative.split(path.sep);
  const layer = segments.find((segment) =>
    ['application', 'domain', 'infrastructure', 'presentation'].includes(segment),
  );
  return { context, layer };
}

export function targetApiModule(file: string, specifier: string) {
  const target = ts.resolveModuleName(specifier, file, apiOpcionescompilador, ts.sys).resolvedModule
    ?.resolvedFileName;
  if (!target) return undefined;
  const module = apiModule(target);
  if (!module) return undefined;
  const [context, layer, directory] = path.relative(apiModulesRoot, target).split(path.sep);
  return {
    ...module,
    file: target,
    isApplicationPort:
      context === module.context && layer === 'application' && directory === 'ports',
  };
}

export function targetMobileFeature(file: string, specifier: string) {
  let target: string;
  if (specifier.startsWith('.')) {
    target = path.resolve(path.dirname(file), specifier);
  } else if (specifier.startsWith('package:mobile_app/')) {
    target = path.resolve(mobileLibRoot, specifier.slice('package:mobile_app/'.length));
  } else {
    return undefined;
  }
  const relativeToLib = path.relative(mobileLibRoot, target);
  if (
    relativeToLib === '..' ||
    relativeToLib.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeToLib)
  ) {
    return undefined;
  }
  const relativeToFeatures = path.relative(mobileFeaturesRoot, target);
  if (
    relativeToFeatures !== '..' &&
    !relativeToFeatures.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativeToFeatures)
  ) {
    const [feature, ...segments] = relativeToFeatures.split(path.sep);
    return {
      feature,
      layer:
        segments.find((segment) => ['domain', 'data', 'presentation'].includes(segment)) ??
        'unclassified',
    };
  }

  const [area, section] = relativeToLib.split(path.sep);
  if (area === 'core') {
    const layer = ['network', 'storage', 'auth', 'config', 'notifications'].includes(section)
      ? 'data'
      : ['providers', 'router'].includes(section)
        ? 'composition'
        : ['theme', 'widgets'].includes(section)
          ? 'presentation'
          : 'unclassified';
    return { feature: '@core', layer };
  }
  return { feature: `@${area}`, layer: 'unclassified' };
}

export function espaqueteexternoprohibidomovil(layer: string, specifier: string): boolean {
  if (!['domain', 'presentation'].includes(layer)) return false;
  if (
    [
      'dart:io',
      'dart:html',
      'dart:ffi',
      'dart:js',
      'dart:js_util',
      'dart:js_interop',
      'dart:js_interop_unsafe',
      'dart:ui_web',
    ].includes(specifier)
  ) {
    return true;
  }
  if (specifier === 'dart:ui') return layer === 'domain';
  if (specifier.startsWith('dart:') || specifier.startsWith('package:mobile_app/')) return false;
  if (!specifier.startsWith('package:')) return false;
  return layer === 'domain' || !importacionespermitidaspresentacionmovil.has(specifier);
}

export function webFeature(
  file: string,
): { feature: string; layer: string | undefined } | undefined {
  const relative = path.relative(webFeaturesRoot, file);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return undefined;
  }

  const [feature, ...segments] = relative.split(path.sep);
  if (!feature) return undefined;
  if (
    segments.length === 0 ||
    (segments.length === 1 && /^index(?:\.(?:[cm]?[jt]sx?))?$/.test(segments[0]))
  ) {
    return { feature, layer: 'root' };
  }
  const explicitLayer = segments.find((segment) => webLayerNames.has(segment));
  const layer =
    explicitLayer ??
    (['pages', 'components'].includes(segments[0])
      ? 'presentation'
      : segments[0] === 'services'
        ? 'infrastructure'
        : segments[0] === 'schemas'
          ? 'presentation'
          : segments.length === 1
            ? 'presentation'
            : 'unclassified');
  return { feature, layer };
}

export function webModule(
  file: string,
): { feature: string | undefined; layer: string | undefined } | undefined {
  const feature = webFeature(file);
  if (feature) return feature;

  const relative = path.relative(webSourceRoot, file);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return undefined;
  }
  const firstSegment = relative.split(path.sep)[0];
  if (firstSegment === 'core') {
    const coreLayer = relative.split(path.sep)[1];
    return {
      feature: '@core',
      layer: webLayerNames.has(coreLayer) ? coreLayer : 'unclassified',
    };
  }
  if (firstSegment === 'app' || /^(?:main|principal)(?:\.(?:[cm]?[jt]sx?))?$/.test(firstSegment)) {
    return { feature: '@app', layer: 'composition' };
  }
  const sharedPath = relative.split(path.sep).join('/');
  const normalizedSharedPath = sharedPath.replace(/\.(?:d\.)?(?:[cm]?[jt]sx?)$/, '');
  const sharedLayer =
    firstSegment === 'components' ||
    ['lib/tema', 'lib/utilidades', 'lib/cursoetiqueta', 'lib/materiaspornivel'].some(
      (basePath) =>
        normalizedSharedPath === basePath || normalizedSharedPath.startsWith(`${basePath}/`),
    )
      ? 'presentation'
      : 'infrastructure';
  return {
    feature: undefined,
    layer: sharedLayer,
  };
}

export function resolveWebImport(file: string, specifier: string): string | undefined {
  let target: string;
  if (specifier.startsWith('.')) {
    target = path.resolve(path.dirname(file), specifier);
  } else if (specifier.startsWith('@/')) {
    target = path.resolve(webSourceRoot, specifier.slice(2));
  } else {
    return undefined;
  }

  const relative = path.relative(webSourceRoot, target);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return undefined;
  }
  return target;
}

export function targetWebFeature(file: string, specifier: string) {
  const target = resolveWebImport(file, specifier);
  return target ? webFeature(target) : undefined;
}

export function targetWebModule(file: string, specifier: string) {
  const target = resolveWebImport(file, specifier);
  return target ? webModule(target) : undefined;
}

export function isForbiddenWebLayerImport(
  sourceLayer: string,
  targetLayer: string | undefined,
): boolean {
  if (sourceLayer === 'composition') return false;
  if (sourceLayer === 'domain') return Boolean(targetLayer && targetLayer !== 'domain');
  if (sourceLayer === 'application') {
    return ['infrastructure', 'presentation', 'composition', 'root', 'unclassified'].includes(
      targetLayer ?? '',
    );
  }
  if (sourceLayer === 'presentation') {
    return ['infrastructure', 'composition', 'root', 'unclassified'].includes(targetLayer ?? '');
  }
  if (sourceLayer === 'infrastructure') {
    return ['presentation', 'composition', 'root', 'unclassified'].includes(targetLayer ?? '');
  }
  return false;
}

export function targetWebPath(file: string, specifier: string): string | undefined {
  const target = resolveWebImport(file, specifier);
  if (!target) return undefined;
  return path
    .relative(webSourceRoot, target)
    .split(path.sep)
    .join('/')
    .replace(/\.(?:d\.)?(?:[cm]?js|jsx|tsx?)$/, '');
}

export function isWebPresentation(file: string): boolean {
  return webModule(file)?.layer === 'presentation';
}
