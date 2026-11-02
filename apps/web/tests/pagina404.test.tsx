import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { pagina404 } from '../src/components/feedback/pagina404';

test('la página 404 anuncia el error y ofrece rutas existentes', () => {
  const marcado = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(pagina404)));

  assert.match(marcado, /<main[^>]*aria-labelledby="pagina404titulo"/);
  assert.match(marcado, /<h1 id="pagina404titulo">No encontramos esta página\.<\/h1>/);
  assert.match(marcado, /href="\/dashboard"/);
  assert.match(marcado, /href="\/login"/);
});
