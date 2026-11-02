import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import {
  root,
  mobileLibRoot,
  mobileFeaturesRoot,
  sourceFiles,
  importsFrom,
  hasUnsafeModuleLoader,
  espaqueteexternoprohibidomovil,
  targetMobileFeature,
} from './limitesarquitectura.test-support';

test('mobile presentation and domain stay independent from data adapters', async () => {
  const files = await sourceFiles(mobileFeaturesRoot);
  const violations: string[] = [];

  for (const { file, source } of files) {
    const relative = path.relative(mobileFeaturesRoot, file).split(path.sep);
    const layer = relative.find((segment) => ['domain', 'data', 'presentation'].includes(segment));
    if (!layer) {
      violations.push(`${path.relative(root, file)} is outside a mobile feature layer`);
      continue;
    }
    if (['domain', 'presentation'].includes(layer) && hasUnsafeModuleLoader(source)) {
      violations.push(`${path.relative(root, file)} ${layer} uses an untraceable module loader`);
    }

    for (const { specifier } of importsFrom(source)) {
      const target = targetMobileFeature(file, specifier);
      if (espaqueteexternoprohibidomovil(layer, specifier)) {
        violations.push(`${path.relative(root, file)} ${layer} imports I/O package ${specifier}`);
      }
      if (!target) continue;
      if (
        layer === 'domain' &&
        ['data', 'presentation', 'unclassified'].includes(target.layer ?? '')
      ) {
        violations.push(
          `${path.relative(root, file)} domain imports ${target.layer} via ${specifier}`,
        );
      }
      if (layer === 'presentation' && ['data', 'unclassified'].includes(target.layer ?? '')) {
        violations.push(`${path.relative(root, file)} presentation imports data via ${specifier}`);
      }
    }
  }

  assert.deepEqual(violations, []);
});

test('mobile core presentation stays independent from data adapters', async () => {
  const coreRoot = path.join(mobileLibRoot, 'core');
  const files = await sourceFiles(coreRoot);
  const violations: string[] = [];

  for (const { file, source } of files) {
    const [area] = path.relative(coreRoot, file).split(path.sep);
    if (['providers', 'router'].includes(area)) continue;
    const layer = ['theme', 'widgets'].includes(area)
      ? 'presentation'
      : ['network', 'storage', 'auth', 'config', 'notifications'].includes(area)
        ? 'data'
        : 'unclassified';
    if (layer !== 'presentation') continue;
    if (hasUnsafeModuleLoader(source)) {
      violations.push(`${path.relative(root, file)} ${layer} uses an untraceable module loader`);
    }
    for (const { specifier } of importsFrom(source)) {
      const target = targetMobileFeature(file, specifier);
      if (espaqueteexternoprohibidomovil(layer, specifier)) {
        violations.push(
          `${path.relative(root, file)} ${layer} imports forbidden package ${specifier}`,
        );
      }
      if (target && ['data', 'unclassified'].includes(target.layer ?? '')) {
        violations.push(
          `${path.relative(root, file)} ${layer} imports ${target.layer} via ${specifier}`,
        );
      }
    }
  }

  assert.deepEqual(violations, []);
});

test('mobile package imports resolve to feature layers', () => {
  const domainFile = path.join(mobileFeaturesRoot, 'students', 'domain', 'student.dart');

  assert.deepEqual(
    targetMobileFeature(
      domainFile,
      'package:mobile_app/features/students/data/student_repository.dart',
    ),
    { feature: 'students', layer: 'data' },
  );
  assert.deepEqual(
    targetMobileFeature(domainFile, 'package:mobile_app/core/storage/secure_storage_service.dart'),
    { feature: '@core', layer: 'data' },
  );
  assert.deepEqual(
    targetMobileFeature(domainFile, 'package:mobile_app/core/router/enrutadoraplicacion.dart'),
    { feature: '@core', layer: 'composition' },
  );
  assert.deepEqual(
    targetMobileFeature(
      domainFile,
      'package:mobile_app/core/providers/proveedoresautenticacion.dart',
    ),
    { feature: '@core', layer: 'composition' },
  );
  assert.deepEqual(targetMobileFeature(domainFile, '../auth.dart'), {
    feature: 'students',
    layer: 'unclassified',
  });
});

test('mobile inner layers reject external packages outside presentation allowlist', () => {
  for (const specifier of [
    'package:dio/dio.dart',
    'package:flutter_secure_storage/flutter_secure_storage.dart',
    'package:socket_io_client/socket_io_client.dart',
    'package:universal_html/html.dart',
    'package:some_network_adapter/client.dart',
    'dart:io',
    'dart:js_interop_unsafe',
    'dart:ui_web',
  ]) {
    assert.equal(espaqueteexternoprohibidomovil('domain', specifier), true);
    assert.equal(espaqueteexternoprohibidomovil('presentation', specifier), true);
  }

  assert.equal(espaqueteexternoprohibidomovil('domain', 'dart:ui'), true);
  assert.equal(espaqueteexternoprohibidomovil('presentation', 'dart:ui'), false);
  assert.equal(espaqueteexternoprohibidomovil('domain', 'dart:convert'), false);
  assert.equal(
    espaqueteexternoprohibidomovil('domain', 'package:mobile_app/domain/model.dart'),
    false,
  );
  assert.equal(
    espaqueteexternoprohibidomovil('presentation', 'package:flutter/material.dart'),
    false,
  );
  assert.equal(
    espaqueteexternoprohibidomovil(
      'presentation',
      'package:flutter_riverpod/flutter_riverpod.dart',
    ),
    false,
  );
  assert.equal(
    espaqueteexternoprohibidomovil('presentation', 'package:go_router/go_router.dart'),
    false,
  );
  assert.equal(espaqueteexternoprohibidomovil('data', 'package:dio/dio.dart'), false);
});
