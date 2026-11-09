import { fillVisibleGrade, inspectPortal } from './portal';
import type { GradePlan } from './types';

const plan: GradePlan = {
  course: { id: 'course', name: 'Primaria - Segundo B' },
  subject: { id: 'subject', name: 'Matemática', code: 'MAT' },
  period: { number: 1, name: 'Primer trimestre' },
  fingerprint: 'test',
  grades: [
    { gradeId: 'grade', studentId: 'student', rude: 'DEMO-0001', firstName: 'Ana', lastName: 'Pérez López', value: 85 },
  ],
};

beforeEach(() => {
  document.body.innerHTML = `
    <div class="course-summary">Primaria - Segundo B · Gestión 2026</div>
    <table id="roster"><thead><tr><th>Código RUDE</th><th>Paterno</th><th>Opciones</th></tr></thead>
      <tbody><tr><td>DEMO-0001</td><td>Pérez</td><td><button data-action="grade">Notas</button></td></tr></tbody>
    </table>
    <div role="dialog"><div id="modal-code">DEMO-0001</div><div id="modal-student">ANA PÉREZ LÓPEZ</div>
      <table id="grades"><thead><tr><th>Área</th><th>Primer trimestre</th></tr></thead>
        <tbody><tr><td>Matemática</td><td><input type="number" value="" /></td></tr></tbody>
      </table>
    </div>`;
  Object.defineProperty(Element.prototype, 'getClientRects', {
    configurable: true,
    value: () => ({ length: 1 }),
  });
  HTMLElement.prototype.scrollIntoView = jest.fn();
});

function request(overrides: Partial<GradePlan> = {}) {
  const source = { ...plan, ...overrides };
  return { grade: source.grades[0]!, course: source.course, subject: source.subject, period: source.period };
}

test('reconoce solamente el curso esperado', () => {
  expect(inspectPortal('Primaria - Segundo B')).toMatchObject({ ok: true, status: 'READY', studentCount: 1 });
  expect(inspectPortal('Primaria - Tercero B')).toMatchObject({ ok: false, status: 'ERROR' });
});

test('rellena la casilla única del RUDE, materia y trimestre correctos', async () => {
  const outcome = await fillVisibleGrade(request());
  expect(outcome).toMatchObject({ ok: true, status: 'FILLED', gradeId: 'grade' });
  expect((document.querySelector('#grades input') as HTMLInputElement).value).toBe('85');
});

test('detiene la escritura si un RUDE aparece dos veces', async () => {
  document.querySelector('#roster tbody')!.insertAdjacentHTML('beforeend',
    '<tr><td>DEMO-0001</td><td>Pérez</td><td><button>Notas</button></td></tr>');
  const outcome = await fillVisibleGrade(request());
  expect(outcome).toMatchObject({ ok: false, status: 'ERROR' });
  expect((document.querySelector('#grades input') as HTMLInputElement).value).toBe('');
});

test('detiene la escritura ante materia o trimestre sin coincidencia única', async () => {
  const otherSubject = await fillVisibleGrade(request({ subject: { id: 'other', name: 'Biología', code: 'BIO' } }));
  const otherPeriod = await fillVisibleGrade(request({ period: { number: 2, name: 'Segundo trimestre' } }));
  expect(otherSubject).toMatchObject({ ok: false, status: 'ERROR' });
  expect(otherPeriod).toMatchObject({ ok: false, status: 'ERROR' });
  expect((document.querySelector('#grades input') as HTMLInputElement).value).toBe('');
});

test('exige autorización expresa para reemplazar una nota distinta', async () => {
  const input = document.querySelector('#grades input') as HTMLInputElement;
  input.value = '42';
  expect(await fillVisibleGrade(request())).toMatchObject({ ok: false, status: 'CONFLICT' });
  expect(input.value).toBe('42');
  expect(await fillVisibleGrade({ ...request(), allowOverwrite: true })).toMatchObject({ ok: true, status: 'FILLED' });
  expect(input.value).toBe('85');
});

test('detiene la escritura si hay dos columnas del mismo trimestre', async () => {
  document.querySelector('#grades thead tr')!.insertAdjacentHTML('beforeend', '<th>Primer trimestre</th>');
  document.querySelector('#grades tbody tr')!.insertAdjacentHTML('beforeend', '<td><input type="number" /></td>');
  expect(await fillVisibleGrade(request())).toMatchObject({ ok: false, status: 'ERROR' });
  expect((document.querySelector('#grades input') as HTMLInputElement).value).toBe('');
});
