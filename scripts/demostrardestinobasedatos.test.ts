import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertLocalDemoDatabaseTarget } from './demostrardestinobasedatos.ts';

const nombresvariables = ['NODE_ENV', 'DATABASE_URL', 'SIGCE_DEMO_DATABASE_NAME'] as const;

function conentorno(variables: Record<string, string | undefined>, ejecutar: () => void): void {
  const anteriores = Object.fromEntries(
    nombresvariables.map((nombre) => [nombre, process.env[nombre]]),
  );
  for (const nombre of nombresvariables) {
    const valor = variables[nombre];
    if (valor === undefined) delete process.env[nombre];
    else process.env[nombre] = valor;
  }
  try {
    ejecutar();
  } finally {
    for (const nombre of nombresvariables) {
      const valor = anteriores[nombre];
      if (valor === undefined) delete process.env[nombre];
      else process.env[nombre] = valor;
    }
  }
}

test('permite la base local autorizada solo en desarrollo', () => {
  conentorno(
    {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/sigce_demo',
      SIGCE_DEMO_DATABASE_NAME: 'sigce_demo',
    },
    () => assert.doesNotThrow(() => assertLocalDemoDatabaseTarget()),
  );
});

test('rechaza bases remotas aunque el nombre coincida', () => {
  conentorno(
    {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://db.example.com:5432/sigce_demo',
      SIGCE_DEMO_DATABASE_NAME: 'sigce_demo',
    },
    () => assert.throws(() => assertLocalDemoDatabaseTarget(), /base PostgreSQL local/),
  );
});

test('rechaza el reinicio fuera de desarrollo incluso para una base local', () => {
  conentorno(
    {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://localhost:5432/sigce_demo',
      SIGCE_DEMO_DATABASE_NAME: 'sigce_demo',
    },
    () => assert.throws(() => assertLocalDemoDatabaseTarget(), /NODE_ENV=development/),
  );
});

test('rechaza una base local cuyo nombre no coincide con el autorizado', () => {
  conentorno(
    {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/sigce_production',
      SIGCE_DEMO_DATABASE_NAME: 'sigce_demo',
    },
    () => assert.throws(() => assertLocalDemoDatabaseTarget(), /nombre exacto/),
  );
});
