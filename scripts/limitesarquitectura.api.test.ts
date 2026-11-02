import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import {
  root,
  apiModulesRoot,
  workerRoot,
  sourceFiles,
  importsFrom,
  hasUnsafeModuleLoader,
  encontrarciclodependencias,
  packageName,
  isForbiddenApplicationPackage,
  isTransportContractPackage,
  apiModule,
  targetApiModule,
} from './limitesarquitectura.test-support';

test('API domain and application remain independent from outer layers and frameworks', async () => {
  const files = await sourceFiles(apiModulesRoot);
  const violations: string[] = [];

  for (const { file, source } of files) {
    const module = apiModule(file);
    if (!module?.layer || !['domain', 'application', 'presentation'].includes(module.layer)) {
      continue;
    }
    if (hasUnsafeModuleLoader(source)) {
      violations.push(
        `${path.relative(root, file)} ${module.layer} uses an untraceable module loader`,
      );
    }

    for (const { specifier } of importsFrom(source)) {
      const packageIsForbidden =
        ['domain', 'application'].includes(module.layer) &&
        isForbiddenApplicationPackage(specifier);
      if (module.layer === 'domain' && isTransportContractPackage(specifier)) {
        violations.push(
          `${path.relative(root, file)} domain imports transport contracts from ${specifier}`,
        );
      }
      if (module.layer === 'application' && isTransportContractPackage(specifier)) {
        violations.push(
          `${path.relative(root, file)} application imports transport contracts from ${specifier}`,
        );
      }
      if (packageIsForbidden) {
        violations.push(`${path.relative(root, file)} imports forbidden package ${specifier}`);
      }

      const target = targetApiModule(file, specifier);
      if (!target) continue;
      if (target.context !== module.context && !target.isApplicationPort) {
        violations.push(
          `${path.relative(root, file)} crosses into ${target.context} through ${specifier}; use a published application port`,
        );
      }
      if (
        target.context === module.context &&
        module.layer === 'domain' &&
        target.layer !== undefined &&
        target.layer !== 'domain'
      ) {
        violations.push(
          `${path.relative(root, file)} domain imports ${target.layer} via ${specifier}`,
        );
      }
      if (
        target.context === module.context &&
        module.layer === 'application' &&
        ['infrastructure', 'presentation'].includes(target.layer ?? '')
      ) {
        violations.push(
          `${path.relative(root, file)} application imports ${target.layer} via ${specifier}`,
        );
      }
    }
  }

  assert.deepEqual(violations, []);
});

test('API core application remains independent from platform and infrastructure', async () => {
  const coreApplicationRoot = path.join(root, 'apps', 'api', 'src', 'core', 'application');
  const files = await sourceFiles(coreApplicationRoot);
  const violations: string[] = [];

  for (const { file, source } of files) {
    if (hasUnsafeModuleLoader(source)) {
      violations.push(
        `${path.relative(root, file)} core application uses an untraceable module loader`,
      );
    }
    for (const { specifier } of importsFrom(source)) {
      if (isForbiddenApplicationPackage(specifier)) {
        violations.push(
          `${path.relative(root, file)} core application imports forbidden package ${specifier}`,
        );
      }
      if (
        specifier.startsWith('.') &&
        path.resolve(path.dirname(file), specifier).split(path.sep).includes('infrastructure')
      ) {
        violations.push(
          `${path.relative(root, file)} core application imports infrastructure via ${specifier}`,
        );
      }
    }
  }

  assert.deepEqual(violations, []);
});

test('API presentation does not import infrastructure and HTTP validation stays in presentation', async () => {
  const files = await sourceFiles(apiModulesRoot);
  const violations: string[] = [];

  for (const { file, source } of files) {
    const module = apiModule(file);
    if (!module) continue;
    const imports = importsFrom(source);

    if (!module.layer && !file.endsWith('.module.ts')) {
      violations.push(`${path.relative(root, file)} is outside a named architecture layer`);
    }

    if (module.layer === 'presentation') {
      for (const { specifier } of imports) {
        const target = targetApiModule(file, specifier);
        if (target?.context === module.context && target.layer === 'infrastructure') {
          violations.push(
            `${path.relative(root, file)} presentation imports infrastructure via ${specifier}`,
          );
        }
      }
    }

    if (module.layer !== 'presentation' && /class-validator|class-transformer/.test(source)) {
      violations.push(`${path.relative(root, file)} uses request validation outside presentation`);
    }

    if (file.endsWith('.controller.ts') && module.layer !== 'presentation') {
      violations.push(`${path.relative(root, file)} controller is outside presentation`);
    }
  }

  assert.deepEqual(violations, []);
});

test('API and worker adapter ports belong to application, not domain', async () => {
  const files = [...(await sourceFiles(apiModulesRoot)), ...(await sourceFiles(workerRoot))];
  const domainPorts = files.filter(({ file }) => {
    const relative = path.relative(root, file).split(path.sep);
    const domainIndex = relative.indexOf('domain');
    return domainIndex >= 0 && relative[domainIndex + 1] === 'ports';
  });

  assert.deepEqual(
    domainPorts.map(({ file }) => path.relative(root, file)),
    [],
    'External collaborators consumed by application or infrastructure must be declared in application/ports.',
  );
});

test('domain boundary rejects transport package subpaths', () => {
  assert.equal(isTransportContractPackage('@academic/shared-types'), true);
  assert.equal(isTransportContractPackage('@academic/shared-types/dist/auditoriasie'), true);
  assert.equal(isTransportContractPackage('@academic/shared-types-extra'), false);
});

test('API cross-context exceptions require a resolved application port', () => {
  const archivoorigen = path.join(
    apiModulesRoot,
    'grades',
    'domain',
    'aggregates',
    'grade.aggregate.ts',
  );
  const destinoencubierto = targetApiModule(
    archivoorigen,
    '../../../alerts/application/ports/../../infrastructure/persistence/prismaalerta.repository',
  );
  const destinoporbaseurl = targetApiModule(
    archivoorigen,
    'src/modules/alerts/infrastructure/persistence/prismaalerta.repository',
  );
  const destinopuerto = targetApiModule(
    archivoorigen,
    'src/modules/alerts/application/ports/evaluacionalertatemprana.port',
  );

  assert.equal(destinoencubierto?.layer, 'infrastructure');
  assert.equal(destinoencubierto?.isApplicationPort, false);
  assert.equal(destinoporbaseurl?.layer, 'infrastructure');
  assert.equal(destinoporbaseurl?.isApplicationPort, false);
  assert.equal(destinopuerto?.isApplicationPort, true);
});

test('shared domain packages have no framework or persistence dependencies', async () => {
  const paquetes = [
    {
      ruta: path.join(root, 'packages', 'domain-kernel', 'src'),
      dependenciaspermitidas: new Set<string>(),
    },
    {
      ruta: path.join(root, 'packages', 'academic-domain', 'src'),
      dependenciaspermitidas: new Set(['@academic/domain-kernel']),
    },
  ];
  const violaciones: string[] = [];

  for (const paquete of paquetes) {
    for (const { file, source } of await sourceFiles(paquete.ruta)) {
      if (hasUnsafeModuleLoader(source)) {
        violaciones.push(`${path.relative(root, file)} uses an untraceable module loader`);
      }
      for (const { specifier } of importsFrom(source)) {
        if (specifier.startsWith('.')) continue;
        const dependencia = packageName(specifier);
        if (!dependencia || !paquete.dependenciaspermitidas.has(dependencia)) {
          violaciones.push(`${path.relative(root, file)} imports external dependency ${specifier}`);
        }
      }
    }
  }

  assert.deepEqual(violaciones, []);
});

test('domain context source graph contains no import cycles', async () => {
  const files = await sourceFiles(apiModulesRoot);
  const available = new Set(files.map(({ file }) => path.resolve(file)));
  const dependencies = new Map<string, Set<string>>();

  for (const { file, source } of files) {
    const current = path.resolve(file);
    const targets = new Set<string>();
    for (const { specifier } of importsFrom(source)) {
      const target = targetApiModule(file, specifier)?.file;
      if (target && available.has(path.resolve(target))) targets.add(path.resolve(target));
    }
    dependencies.set(current, targets);
  }

  const cycle = encontrarciclodependencias(dependencies);
  assert.equal(cycle, undefined, cycle?.map((file) => path.relative(root, file)).join(' -> '));
});

test('local database and cache ports bind to loopback only', async () => {
  const compose = await readFile(path.join(root, 'docker-compose.yml'), 'utf8');

  assert.match(compose, /127\.0\.0\.1:\$\{POSTGRES_PORT:-5432\}:5432/);
  assert.match(compose, /127\.0\.0\.1:\$\{REDIS_PORT:-6379\}:6379/);
});

test('worker domain and application do not depend on infrastructure libraries or adapters', async () => {
  const files = await sourceFiles(workerRoot);
  const violations: string[] = [];

  for (const { file, source } of files) {
    const relative = path.relative(workerRoot, file).split(path.sep);
    const layer = relative.find((segment) =>
      ['application', 'domain', 'infrastructure'].includes(segment),
    );
    if (!['application', 'domain'].includes(layer ?? '')) continue;
    if (hasUnsafeModuleLoader(source)) {
      violations.push(`${path.relative(root, file)} ${layer} uses an untraceable module loader`);
    }

    for (const { specifier } of importsFrom(source)) {
      if (['domain', 'application'].includes(layer) && isTransportContractPackage(specifier)) {
        violations.push(
          `${path.relative(root, file)} ${layer} imports transport contracts from ${specifier}`,
        );
      }
      if (isForbiddenApplicationPackage(specifier)) {
        violations.push(`${path.relative(root, file)} imports forbidden package ${specifier}`);
      }
      if (
        specifier.startsWith('.') &&
        path.resolve(path.dirname(file), specifier).split(path.sep).includes('infrastructure')
      ) {
        violations.push(
          `${path.relative(root, file)} ${layer} imports infrastructure via ${specifier}`,
        );
      }
    }
  }

  assert.deepEqual(violations, []);
});

test('API and worker inner layers reject framework and infrastructure package subpaths', () => {
  for (const specifier of [
    '@nestjs/common',
    '@nestjs/common/interfaces',
    '@prisma/client',
    '@prisma/client/runtime/library',
    'class-validator',
    'class-validator/types',
    'node:fs/promises',
    'fs/promises',
  ]) {
    assert.ok(
      isForbiddenApplicationPackage(specifier),
      `Expected ${specifier} to resolve to a forbidden package root`,
    );
  }
});
