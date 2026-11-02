import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import {
  root,
  webSourceRoot,
  webFeaturesRoot,
  legacyWebAdapterPaths,
  legacyWebAdapterImportBudget,
  legacyWebPresentationInfrastructurePaths,
  legacyWebPresentationInfrastructureBudget,
  sourceFiles,
  importsFrom,
  isForbiddenWebInnerPackage,
  hasUnsafeModuleLoader,
  hayiodirectonavegador,
  packageName,
  webFeature,
  webModule,
  targetWebFeature,
  targetWebModule,
  isForbiddenWebLayerImport,
  targetWebPath,
  isWebPresentation,
} from './limitesarquitectura.test-support';

test('web feature layers follow the inward dependency rule', async () => {
  const files = await sourceFiles(webSourceRoot);
  const violations: string[] = [];
  const legacyPresentationInfrastructureImports: string[] = [];

  for (const { file, source } of files) {
    const module = webModule(file);
    if (!module?.layer) continue;
    if (module.layer === 'unclassified') {
      violations.push(`${path.relative(root, file)} is outside a named web feature layer`);
      continue;
    }
    if (
      ['domain', 'application', 'presentation'].includes(module.layer) &&
      hasUnsafeModuleLoader(source)
    ) {
      violations.push(
        `${path.relative(root, file)} ${module.layer} uses an untraceable module loader`,
      );
    }
    if (['domain', 'application'].includes(module.layer) && hayiodirectonavegador(source)) {
      violations.push(`${path.relative(root, file)} ${module.layer} uses browser I/O directly`);
    }

    for (const { specifier } of importsFrom(source)) {
      const packageIsForbidden = isForbiddenWebInnerPackage(specifier);
      if (['domain', 'application'].includes(module.layer) && packageIsForbidden) {
        violations.push(
          `${path.relative(root, file)} ${module.layer} imports UI or I/O package ${specifier}`,
        );
      }
      const targetPath = targetWebPath(file, specifier);
      if (
        ['domain', 'application'].includes(module.layer) &&
        targetPath &&
        legacyWebAdapterPaths.has(targetPath)
      ) {
        violations.push(
          `${path.relative(root, file)} ${module.layer} imports a web adapter via ${specifier}`,
        );
      }

      const target = targetWebModule(file, specifier);
      if (
        target?.feature &&
        target.feature !== module.feature &&
        target.feature !== '@core' &&
        ['domain', 'application'].includes(module.layer)
      ) {
        violations.push(
          `${path.relative(root, file)} ${module.layer} crosses into feature ${target.feature} via ${specifier}`,
        );
      }
      const isBudgetedLegacyPresentationAdapter =
        module.layer === 'presentation' &&
        targetPath !== undefined &&
        legacyWebAdapterPaths.has(targetPath);
      const isBudgetedLegacyPresentationInfrastructure =
        module.layer === 'presentation' &&
        targetPath !== undefined &&
        legacyWebPresentationInfrastructurePaths.has(targetPath);
      if (isBudgetedLegacyPresentationInfrastructure) {
        legacyPresentationInfrastructureImports.push(
          `${path.relative(root, file)} -> ${specifier}`,
        );
      }
      if (
        target &&
        !isBudgetedLegacyPresentationAdapter &&
        !isBudgetedLegacyPresentationInfrastructure &&
        isForbiddenWebLayerImport(module.layer, target.layer)
      ) {
        violations.push(
          `${path.relative(root, file)} ${module.layer} imports ${target.layer} via ${specifier}`,
        );
      }
    }
  }

  assert.ok(
    legacyPresentationInfrastructureImports.length <= legacyWebPresentationInfrastructureBudget,
    `Found ${legacyPresentationInfrastructureImports.length} legacy web infrastructure imports from presentation; budget is ${legacyWebPresentationInfrastructureBudget}:\n${legacyPresentationInfrastructureImports.join('\n')}`,
  );
  assert.deepEqual(violations, []);
});

test('web import resolution recognizes @/ aliases for feature layers and adapters', () => {
  const presentationFile = path.join(webFeaturesRoot, 'students', 'presentation', 'page.tsx');

  assert.equal(targetWebPath(presentationFile, '@/lib/apiacademica'), 'lib/apiacademica');
  assert.equal(targetWebPath(presentationFile, '@/lib/apiacademica.js'), 'lib/apiacademica');
  assert.deepEqual(
    targetWebFeature(presentationFile, '@/features/students/application/list-students'),
    {
      feature: 'students',
      layer: 'application',
    },
  );
  assert.equal(
    webFeature(path.join(webFeaturesRoot, 'students', 'pages', 'paginaestudiantes.tsx'))?.layer,
    'presentation',
  );
  assert.equal(
    isWebPresentation(
      path.join(webFeaturesRoot, 'students', 'presentation', 'paginaestudiantes.tsx'),
    ),
    true,
  );
  assert.deepEqual(webFeature(path.join(webFeaturesRoot, 'students')), {
    feature: 'students',
    layer: 'root',
  });
  assert.deepEqual(webFeature(path.join(webFeaturesRoot, 'students', 'index.ts')), {
    feature: 'students',
    layer: 'root',
  });
  assert.deepEqual(targetWebModule(presentationFile, '@/components/ui/boton'), {
    feature: undefined,
    layer: 'presentation',
  });
  assert.deepEqual(targetWebModule(presentationFile, '@/lib/conexiontiemporeal'), {
    feature: undefined,
    layer: 'infrastructure',
  });
  assert.deepEqual(targetWebModule(presentationFile, '@/lib/tema'), {
    feature: undefined,
    layer: 'presentation',
  });
  assert.equal(webModule(path.join(webSourceRoot, 'lib', 'tema.ts'))?.layer, 'presentation');
  assert.equal(webModule(path.join(webSourceRoot, 'lib', 'utilidades.ts'))?.layer, 'presentation');
  assert.equal(isWebPresentation(path.join(webSourceRoot, 'lib', 'tema.ts')), true);
  assert.equal(isWebPresentation(path.join(webSourceRoot, 'lib', 'utilidades.ts')), true);
  assert.deepEqual(targetWebFeature(presentationFile, '../schemas/student.schema'), {
    feature: 'students',
    layer: 'presentation',
  });
  assert.deepEqual(targetWebFeature(presentationFile, '../services/auth-state'), {
    feature: 'students',
    layer: 'infrastructure',
  });
  assert.deepEqual(targetWebFeature(presentationFile, '../legacy/nested'), {
    feature: 'students',
    layer: 'unclassified',
  });
});

test('web layers point inward and composition roots remain at the outer boundary', () => {
  assert.equal(isForbiddenWebLayerImport('presentation', 'root'), true);
  assert.equal(isForbiddenWebLayerImport('presentation', 'infrastructure'), true);
  assert.equal(isForbiddenWebLayerImport('presentation', 'composition'), true);
  assert.equal(isForbiddenWebLayerImport('presentation', 'domain'), false);
  assert.equal(isForbiddenWebLayerImport('application', 'root'), true);
  assert.equal(isForbiddenWebLayerImport('application', 'composition'), true);
  assert.equal(isForbiddenWebLayerImport('application', 'unclassified'), true);
  assert.equal(isForbiddenWebLayerImport('domain', 'infrastructure'), true);
  assert.equal(isForbiddenWebLayerImport('infrastructure', 'presentation'), true);
  assert.equal(isForbiddenWebLayerImport('infrastructure', 'composition'), true);
  assert.equal(isForbiddenWebLayerImport('composition', 'presentation'), false);
});

test('web boundary alias stays aligned with the TypeScript path mapping', async () => {
  const tsconfigPath = path.join(root, 'apps', 'web', 'tsconfig.json');
  const tsconfig = JSON.parse(await readFile(tsconfigPath, 'utf8')) as {
    compilerOptions?: {
      baseUrl?: string;
      paths?: Record<string, string[]>;
    };
  };

  assert.equal(tsconfig.compilerOptions?.baseUrl, '.');
  assert.deepEqual(tsconfig.compilerOptions?.paths, { '@/*': ['./src/*'] });
});

test('web inner layers reject UI and I/O package subpaths', () => {
  for (const specifier of [
    'react/jsx-runtime',
    'react-dom/client',
    'react-router-dom/server',
    '@tanstack/react-query/devtools',
    'axios/lib/adapters/http',
    'socket.io-client/build/esm',
    'node:fs/promises',
    'fs/promises',
    'node:child_process',
    'child_process',
    'lucide-react',
    '@radix-ui/react-label',
    '@radix-ui/react-slot',
    '@hookform/resolvers/zod',
    'react-hook-form',
  ]) {
    assert.ok(
      isForbiddenWebInnerPackage(specifier),
      `Expected ${specifier} to resolve to a forbidden package root`,
    );
  }
  assert.equal(packageName('@tanstack/react-query-devtools'), '@tanstack/react-query-devtools');
});

test('web inner layers reject browser I/O globals and aliases', () => {
  for (const source of [
    "fetch('/api/estudiantes')",
    "new WebSocket('wss://example.test')",
    'window.localStorage.getItem("sesion")',
    'navigator.sendBeacon("/telemetria", datos)',
    'caches.open("sigce")',
    'eval(String.fromCharCode(102, 101, 116, 99, 104))("/api")',
    'Function(String.fromCharCode(102, 101, 116, 99, 104))()("/api")',
    '({}).constructor.constructor("return fetch")()("/api")',
    'setTimeout("fetch", 0)',
    'const temporal = setTimeout; temporal("fetch", 0)',
    '(setInterval)("fetch", 0)',
    'new RTCPeerConnection()',
    'new WebTransport("https://example.test")',
    'new BroadcastChannel("actualizaciones")',
    'globalThis.Function("return fetch")()("/api")',
    'globalThis["Function"]("return fetch")()("/api")',
    'const raiz = globalThis; raiz.Function("return fetch")()("/api")',
    'const enviar = window.fetch; enviar("/api")',
    'window["fetch"]("/api")',
    'const abrir = globalThis.WebSocket; new abrir("wss://example.test")',
    'const storage = localStorage; storage.getItem("token")',
    'switch (true) { case true: let fetch = () => 0; break; } fetch("/api")',
    'namespace local { const fetch = () => 0; } fetch("/api")',
    'Reflect.get(Reflect.get({}, "constructor"), "constructor")("return fetch")()("/api")',
    '({})["con" + "structor"]["con" + "structor"]("return fetch")()("/api")',
  ]) {
    assert.equal(hayiodirectonavegador(source), true, source);
  }
  assert.equal(hayiodirectonavegador("const texto = 'fetch()'"), false);
  assert.equal(hayiodirectonavegador('const buscar = () => estudiantes.filter(Boolean)'), false);
  assert.equal(hayiodirectonavegador('const fetch = async () => 1; fetch("/local")'), false);
  assert.equal(
    hayiodirectonavegador('function buscar(fetch: (ruta: string) => void) { fetch("/local"); }'),
    false,
  );
  assert.equal(hayiodirectonavegador('interface contexto { document: string; }'), false);
  assert.equal(
    hayiodirectonavegador('const Function = (valor: string) => valor; Function("x")'),
    false,
  );
  assert.equal(
    hayiodirectonavegador('const { fetch: obtener } = configuracion; obtener("/local")'),
    false,
  );
  assert.equal(
    hayiodirectonavegador('import { fetch as obtener } from "./servicio"; obtener("/local")'),
    false,
  );
  assert.equal(hayiodirectonavegador('const valor = metadata.constructor.name;'), false);
  assert.equal(hayiodirectonavegador('const valido = metadata.constructor === Object;'), false);
  assert.equal(hayiodirectonavegador('setTimeout(() => {}, 10);'), false);
  assert.equal(hayiodirectonavegador('const { constructor: factory } = metadata;'), false);
});

test('legacy web presentation-to-adapter imports do not grow during migration', async () => {
  const files = await sourceFiles(webSourceRoot);
  const legacyImports: string[] = [];

  for (const { file, source } of files) {
    if (!isWebPresentation(file)) continue;
    for (const { specifier } of importsFrom(source)) {
      const target = targetWebPath(file, specifier);
      if (!target || !legacyWebAdapterPaths.has(target)) continue;
      legacyImports.push(`${path.relative(root, file)} -> ${specifier}`);
    }
  }

  assert.ok(
    legacyImports.length <= legacyWebAdapterImportBudget,
    `Found ${legacyImports.length} legacy web adapter imports; budget is ${legacyWebAdapterImportBudget}:\n${legacyImports.join('\n')}`,
  );
});
