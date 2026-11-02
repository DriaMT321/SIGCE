import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requireOfficialSieOrigin, requireSieCredentials } from './credencialessie.ts';

test('uses the official SIE origin when no override is configured', () => {
  assert.equal(requireOfficialSieOrigin(''), 'https://academico.sie.gob.bo');
});

test('rejects an untrusted target before credentials can be used', () => {
  for (const target of [
    'http://academico.sie.gob.bo',
    'https://academico.sie.gob.bo.attacker.example',
    'https://example.com',
    'https://academico.sie.gob.bo:8443',
    'https://academico.sie.gob.bo/path',
  ]) {
    assert.throws(() => requireOfficialSieOrigin(target), /origen HTTPS oficial/);
  }
});

test('requires the explicit real access flag before loading credentials', () => {
  const previous = process.env.SIE_REAL_ACCESS_ENABLED;
  delete process.env.SIE_REAL_ACCESS_ENABLED;
  try {
    assert.throws(() => requireSieCredentials(), /deshabilitado/);
  } finally {
    if (previous === undefined) delete process.env.SIE_REAL_ACCESS_ENABLED;
    else process.env.SIE_REAL_ACCESS_ENABLED = previous;
  }
});
