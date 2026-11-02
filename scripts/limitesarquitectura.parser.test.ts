import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import {
  root,
  isSourceFileName,
  sourceFiles,
  importsFrom,
  hasComputedModuleLoader,
  hasAliasedModuleLoader,
  hasUnsafeModuleLoader,
  encontrarciclodependencias,
} from './limitesarquitectura.test-support';

test('architecture scanner includes source files and skips JavaScript and Dart tests', () => {
  assert.ok(isSourceFileName('StudentsPage.js'));
  assert.ok(isSourceFileName('StudentActivationPage.jsx'));
  assert.ok(isSourceFileName('legacy.mjs'));
  assert.ok(isSourceFileName('worker.cjs'));
  assert.ok(isSourceFileName('worker.mts'));
  assert.ok(isSourceFileName('worker.cts'));
  assert.equal(isSourceFileName('StudentsPage.spec.js'), false);
  assert.equal(isSourceFileName('StudentsPage.e2e.spec.jsx'), false);
  assert.equal(isSourceFileName('StudentsPage.spec.mts'), false);
  assert.equal(isSourceFileName('StudentsPage.e2e.spec.cts'), false);
  assert.equal(isSourceFileName('StudentsPage.spec.tsx'), false);
  assert.equal(isSourceFileName('students.test.ts'), false);
  assert.equal(isSourceFileName('students.test.jsx'), false);
  assert.equal(isSourceFileName('students.test.dart'), false);
  assert.equal(isSourceFileName('students.spec.dart'), false);
  assert.equal(root, path.resolve(__dirname, '..'));
});

test('dependency cycle detector reports cycles and accepts acyclic graphs', () => {
  assert.deepEqual(
    encontrarciclodependencias(
      new Map([
        ['matricula', new Set(['estudiante'])],
        ['estudiante', new Set(['matricula'])],
      ]),
    ),
    ['matricula', 'estudiante', 'matricula'],
  );
  assert.equal(
    encontrarciclodependencias(
      new Map([
        ['asistencia', new Set(['alertas'])],
        ['alertas', new Set()],
      ]),
    ),
    undefined,
  );
});

test('architecture import scanner recognizes CommonJS require forms', () => {
  assert.deepEqual(
    importsFrom(
      `const api = require('@/lib/clienteapi'); import domain = require('./domain.js'); require.resolve('axios'); module.require('@prisma/client'); module['require']('node:fs/promises');`,
    ),
    [
      { specifier: '@/lib/clienteapi' },
      { specifier: './domain.js' },
      { specifier: 'axios' },
      { specifier: '@prisma/client' },
      { specifier: 'node:fs/promises' },
    ],
  );
  assert.deepEqual(importsFrom("module.constructor._load('@prisma/client', module, false);"), [
    { specifier: '@prisma/client' },
  ]);
});

test('architecture import scanner recognizes static template specifiers only', () => {
  assert.deepEqual(
    importsFrom(
      'import(`@/lib/apiacademica`); require(`@/lib/clienteapi`); import(`./${feature}`); require(`./${feature}`);',
    ),
    [{ specifier: '@/lib/apiacademica' }, { specifier: '@/lib/clienteapi' }],
  );
  assert.equal(
    hasComputedModuleLoader(
      'import(name); require(`./${feature}`); module.require(packageName); module["require"](name); module[loaderName]("@prisma/client");',
    ),
    true,
  );
  assert.equal(
    hasComputedModuleLoader(
      "Reflect.apply(module.require, module, ['@prisma/client']); Reflect['apply'](require, null, ['node:fs']);",
    ),
    true,
  );
  assert.equal(hasComputedModuleLoader("import('@/lib/apiacademica'); require(`axios`);"), false);
  assert.equal(
    hasAliasedModuleLoader(
      "const load = require; const loadAgain = load; const fromModule = module.require; const dynamic = (module[loaderName] as NodeRequire); const bound = module.require.bind(module); const wrapped = (require.bind(null) as NodeRequire); const invoked = require.call.bind(require); const { require: destructuredLoad } = module; const { ['require']: computedLoad } = module; const { require: castedLoad } = (module as NodeModule);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("const runtime = module; runtime.require('@prisma/client');"),
    true,
  );
  assert.equal(hasUnsafeModuleLoader('const filename = module.filename;'), false);
  assert.equal(hasUnsafeModuleLoader('const { exports } = module;'), false);
  assert.equal(hasUnsafeModuleLoader('const filename = module.children[0].filename;'), false);
  assert.equal(hasUnsafeModuleLoader("module.children.require('@prisma/client');"), false);
  assert.equal(
    hasUnsafeModuleLoader(
      "const children = module.children.filter(Boolean); children.require('@prisma/client');",
    ),
    false,
  );
  assert.equal(hasUnsafeModuleLoader('const filename = module.children.at(0).filename;'), false);
  assert.equal(
    hasUnsafeModuleLoader('const filename = module.children.filter(Boolean)[0].filename;'),
    false,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const runtime = module; const key = 'require'; runtime[key]('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const invoke = Reflect.apply; invoke(module.require, module, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const R = Reflect; const invoke = R['apply']; invoke(require, null, ['node:fs']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const R = Reflect; const { apply: invoke } = R; invoke(module.require, module, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const R = Reflect; const invoke = R[operation]; invoke(module.require, module, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const invoke = Reflect.apply.bind(Reflect); invoke(module.require, module, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("globalThis.Reflect.apply(module.require, module, ['@prisma/client']);"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const R = globalThis['Reflect']; const invoke = R.apply.bind(R); invoke(require, null, ['node:fs']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const root = globalThis; root.Reflect.apply(module.require, module, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const root = globalThis; const { Reflect: R } = root; R.apply(module.require, module, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const method = 'bind'; const invoke = Reflect.apply[method](Reflect); invoke(require, null, ['node:fs']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "Function.prototype.apply.call(Reflect.apply, null, [module.require, module, ['@prisma/client']]);",
    ),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("process.mainModule.require('@prisma/client');"), true);
  assert.equal(hasUnsafeModuleLoader("process.getBuiltinModule('node:fs');"), true);
  assert.equal(hasUnsafeModuleLoader("eval('require')('node:fs');"), true);
  assert.equal(hasUnsafeModuleLoader("new Function('return require')()('node:fs');"), true);
  assert.equal(hasUnsafeModuleLoader("Object.constructor('return require')()('node:fs');"), true);
  assert.equal(hasUnsafeModuleLoader('globalThis.Function(\'return import("node:fs")\')();'), true);
  assert.equal(
    hasUnsafeModuleLoader("globalThis['Function']('return import(\"node:fs\")')();"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("({}).constructor.constructor('return require')()('node:fs');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("(() => {})['constructor']('return import(\"node:fs\")')();"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'function fabrica() {} fabrica.constructor(\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('class fabrica {} fabrica.constructor(\'return import("node:fs")\')();'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const objeto = { ejecutar() {} }; objeto.ejecutar.constructor(\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'class Servicio { static ejecutar() {} }; Servicio.ejecutar.constructor(\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'class Servicio { ejecutar() {} }; const servicio = new Servicio(); servicio.ejecutar.constructor(\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'function fabrica() {}; Reflect.construct(fabrica.constructor, [\'return import("node:fs")\'])();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('Reflect.construct(Function, [\'return import("node:fs")\']);'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "Reflect.get(Reflect.get({}, 'constructor'), 'constructor')('return require')()('node:fs');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const get = Reflect.get; get(get({}, 'constructor'), 'constructor')('return require')()('node:fs');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("Reflect.get(globalThis, 'Function')('return import(\"node:fs\")')();"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("Reflect.get(globalThis, 'eval')('require(\"node:fs\")');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const { get } = Reflect; get(globalThis, 'Function')('return import(\"node:fs\")')();",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const { get } = Reflect; get(get({}, 'constructor'), 'constructor')('return require')()('node:fs');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const get = Reflect.get; const leer = get; leer(leer({}, 'constructor'), 'constructor')('return require')()('node:fs');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const R = Reflect; const { get: obtener } = R; obtener(globalThis, 'Function')('return import(\"node:fs\")')();",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const obtener = Reflect.get; const leer = obtener; leer(globalThis, 'Function')('return import(\"node:fs\")')();",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const { Function: factory } = globalThis; factory(\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const clave = "Function"; globalThis[clave](\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('globalThis.Function.call(null, \'return import("node:fs")\')();'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "Reflect.get(globalThis, 'Function').call(null, 'return import(\"node:fs\")')();",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const factory = globalThis.Function; const call = factory.call; call(null, \'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('Object.constructor.call(null, \'return import("node:fs")\')();'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('Object.constructor.apply(null, [\'return import("node:fs")\'])();'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('Object.constructor.bind(null, \'return import("node:fs")\')()();'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader('globalThis.Function.bind(null, \'return require\')()()("node:fs");'),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const ligado = globalThis.Function.bind(null, \'return require\'); ligado()()("node:fs");',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const raiz = globalThis; const reflejo = raiz.Reflect; const { get } = reflejo; get(raiz, "Function")("return require")()("node:fs");',
    ),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("setTimeout.call(globalThis, 'require', 0);"), true);
  assert.equal(hasUnsafeModuleLoader("setTimeout.apply(globalThis, ['require', 0]);"), true);
  assert.equal(
    hasUnsafeModuleLoader("const esperar = setTimeout; esperar.apply(globalThis, ['require', 0]);"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const { globalThis: raiz } = globalThis; raiz.Function(\'return import("node:fs")\')();',
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "({})['con' + 'structor']['con' + 'structor']('return require')()('node:fs');",
    ),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("setTimeout('require', 0);"), true);
  assert.equal(hasUnsafeModuleLoader("const temporal = setTimeout; temporal('require', 0);"), true);
  assert.equal(hasUnsafeModuleLoader('setTimeout(`fetch("/api/${id}")`, 0);'), true);
  assert.equal(hasUnsafeModuleLoader("setTimeout('fetch(' + ruta + ')', 0);"), true);
  assert.equal(hasUnsafeModuleLoader("const codigo = 'require'; setTimeout(codigo, 0);"), true);
  assert.equal(hasUnsafeModuleLoader("(setInterval)('require', 0);"), true);
  assert.equal(hasUnsafeModuleLoader('setTimeout(() => {}, 10);'), false);
  assert.equal(
    hasUnsafeModuleLoader("function programar(setTimeout) { setTimeout('texto', 0); }"),
    false,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const temporal = setTimeout; function programar(temporal) { temporal('texto', 0); }",
    ),
    false,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const raiz = globalThis; function mostrar(raiz) { raiz.Function.name; }',
    ),
    false,
  );
  assert.equal(hasUnsafeModuleLoader('globalThis.Function.name;'), false);
  assert.equal(hasUnsafeModuleLoader('const nombre = globalThis.Function.name;'), false);
  assert.equal(
    hasUnsafeModuleLoader(
      'let ejecutar: any = globalThis.Function; ejecutar = (codigo: string) => codigo; ejecutar("texto");',
    ),
    false,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      'const datos: any = { ejecutar() {} }; datos.ejecutar = 1; datos.ejecutar.constructor("texto");',
    ),
    false,
  );
  assert.equal(hasUnsafeModuleLoader('value.constructor.name;'), false);
  assert.equal(hasUnsafeModuleLoader('value.constructor === Object;'), false);
  assert.equal(hasUnsafeModuleLoader('const { constructor: factory } = metadata;'), false);
  assert.equal(hasUnsafeModuleLoader("globalThis.process['getBuiltinModule']('node:fs');"), true);
  assert.equal(
    hasUnsafeModuleLoader("const { getBuiltinModule } = process; getBuiltinModule('fs');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("const loadBuiltin = process.getBuiltinModule; loadBuiltin('node:fs');"),
    true,
  );
  assert.equal(hasUnsafeModuleLoader('process.env.NODE_ENV;'), false);
  assert.equal(
    hasUnsafeModuleLoader("Reflect.get(module, 'require').call(module, '@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("module.constructor._load('@prisma/client', module, false);"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "Reflect.get(module.constructor, '_load')('@prisma/client', module, false);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("globalThis.process.mainModule.require('@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const runtime = process; runtime.mainModule['require']('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const runtime = process; runtime.mainModule[loaderName]('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "Function.prototype.apply.call(process.mainModule.require, null, ['@prisma/client']);",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("const main = process.mainModule; main.require('@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("const { mainModule } = process; mainModule.require('@prisma/client');"),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("require.main.require('@prisma/client');"), true);
  assert.equal(
    hasUnsafeModuleLoader("const main = require.main; main.require('@prisma/client');"),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("module.parent.require('@prisma/client');"), true);
  assert.equal(
    hasUnsafeModuleLoader("const parent = module.parent; parent.require('@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("const { parent } = module; parent.require('@prisma/client');"),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("module.children[0].require('@prisma/client');"), true);
  assert.equal(hasUnsafeModuleLoader("module.children.at(0).require('@prisma/client');"), true);
  assert.equal(
    hasUnsafeModuleLoader("module.children.find(Boolean).require('@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("module.children.filter(Boolean)[0].require('@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const children = module.children.filter(Boolean); children[0].require('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const [firstChild] = module.children.filter(Boolean); firstChild.require('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader("Reflect.get(module, 'parent').require('@prisma/client');"),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const children = module.children; children[0].require('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const [firstChild] = module.children; firstChild.require('@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const { parent: { require: load } } = module; load.call(module.parent, '@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const main = require.main; const { require: load } = main; load.call(main, '@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const { mainModule: { require: load } } = process; load.call(process.mainModule, '@prisma/client');",
    ),
    true,
  );
  assert.equal(
    hasUnsafeModuleLoader(
      "const { main: { require: load } } = require; load.call(require.main, '@prisma/client');",
    ),
    true,
  );
  assert.equal(hasUnsafeModuleLoader("import('@/lib/apiacademica'); require('axios');"), false);
});

test('architecture import scanner decodes escaped specifiers and reads Dart imports', () => {
  assert.deepEqual(
    importsFrom(String.raw`require('@prisma/\x63lient'); import('@/lib/clientea\x70i');`),
    [{ specifier: '@prisma/client' }, { specifier: '@/lib/clienteapi' }],
  );
  assert.deepEqual(importsFrom("import 'package:flutter/material.dart';"), [
    { specifier: 'package:flutter/material.dart' },
  ]);
});

test('architecture source traversal rejects a symlinked source root', async () => {
  const temporaryRoot = await mkdtemp(path.join(root, '.architecture-boundaries-'));
  const actualSource = path.join(temporaryRoot, 'actual-source');
  const linkedSource = path.join(temporaryRoot, 'linked-source');

  try {
    await mkdir(actualSource);
    await symlink(actualSource, linkedSource, process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(sourceFiles(linkedSource), /symbolic link/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
