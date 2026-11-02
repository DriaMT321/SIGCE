import assert from 'node:assert/strict';
import { test } from 'node:test';

const almacenadovalores = new Map<string, string>();
const sesionalmacenadovalores = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (clave: string) => almacenadovalores.get(clave) ?? null,
    setItem: (clave: string, valor: string) => almacenadovalores.set(clave, valor),
    removeItem: (clave: string) => almacenadovalores.delete(clave),
  },
});
Object.defineProperty(globalThis, 'sessionStorage', {
  configurable: true,
  value: {
    getItem: (clave: string) => sesionalmacenadovalores.get(clave) ?? null,
    setItem: (clave: string, valor: string) => sesionalmacenadovalores.set(clave, valor),
    removeItem: (clave: string) => sesionalmacenadovalores.delete(clave),
    clear: () => sesionalmacenadovalores.clear(),
  },
});
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { dispatchEvent: () => true },
});

const autenticacionestadopromesa =
  import('../apps/web/src/features/auth/services/estadodeautenticacion').then(
    ({ autenticacionestado }) => autenticacionestado,
  );

const usuario = (id: string) => ({
  id,
  email: `${id}@example.test`,
  firstName: 'Test',
  lastName: 'User',
  role: 'ADMINISTRATIVE',
});

const webrespuesta = (id: string) => ({
  statusCode: 200,
  message: 'ok',
  data: { accessToken: `token-${id}`, user: usuario(id) },
});

test('does not restore a session from a refresh response that arrived after logout', async () => {
  const autenticacionestado = await autenticacionestadopromesa;
  autenticacionestado.establecersesion('token-user-1', usuario('user-1'));
  const actualizargeneracion = autenticacionestado.getSessionGeneration();

  autenticacionestado.limpiar();

  assert.equal(
    autenticacionestado.aplicarwebrespuesta(webrespuesta('user-1'), actualizargeneracion),
    false,
  );
  assert.equal(autenticacionestado.getAccessToken(), null);
  assert.equal(autenticacionestado.getCurrentUser(), null);
});

test('does not apply an old refresh response to a newer login', async () => {
  const autenticacionestado = await autenticacionestadopromesa;
  autenticacionestado.establecersesion('token-user-1', usuario('user-1'));
  const actualizargeneracion = autenticacionestado.getSessionGeneration();
  autenticacionestado.establecersesion('token-user-2', usuario('user-2'));

  assert.equal(
    autenticacionestado.aplicarwebrespuesta(webrespuesta('user-1'), actualizargeneracion),
    false,
  );
  assert.equal(autenticacionestado.getAccessToken(), 'token-user-2');
  assert.equal(autenticacionestado.getCurrentUser()?.id, 'user-2');
});
