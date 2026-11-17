import { createVisualCursor } from './visual-cursor';

test('muestra el destino real y se retira al terminar', async () => {
  document.body.innerHTML = '<button id="target">Notas</button>';
  const button = document.querySelector('#target') as HTMLButtonElement;
  button.scrollIntoView = jest.fn();
  button.getBoundingClientRect = jest.fn(() => ({
    x: 40, y: 60, left: 40, top: 60, right: 100, bottom: 90, width: 60, height: 30, toJSON: () => undefined,
  }));
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({ matches: true }),
  });

  const cursor = createVisualCursor();
  await cursor.show({ element: button, label: 'Abrir calificaciones', action: 'click' });
  const host = document.querySelector('#sigce-assistant-visual-cursor')!;
  expect(host.classList.contains('visible')).toBe(true);
  expect(host.shadowRoot?.querySelector('.label')?.textContent).toBe('Abrir calificaciones');
  expect(host.shadowRoot?.querySelector('.target')?.getAttribute('data-action')).toBe('click');
  expect(button.scrollIntoView).toHaveBeenCalled();

  cursor.hide();
  expect(host.classList.contains('visible')).toBe(false);
  host.remove();
});
