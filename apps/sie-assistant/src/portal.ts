import type { GradePlan, PortalResponse, SigceGrade } from './types';

type FillRequest = {
  grade: SigceGrade;
  course: GradePlan['course'];
  subject: GradePlan['subject'];
  period: GradePlan['period'];
  subjectAlias?: string;
  allowOverwrite?: boolean;
};

const gradeAliases = [
  ['primero', 'primer', '1', '1ro', '1 ro', '1er', '1 er', '1ero', '1 ero'],
  ['segundo', '2', '2do', '2 do'],
  ['tercero', 'tercer', '3', '3ro', '3 ro', '3er', '3 er'],
  ['cuarto', '4', '4to', '4 to'],
  ['quinto', '5', '5to', '5 to'],
  ['sexto', '6', '6to', '6 to'],
];
const periodWords = [['primero', 'primer'], ['segundo'], ['tercero', 'tercer']];

function normalized(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function visible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  return (
    element.getClientRects().length > 0 &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    Number(style.opacity || '1') > 0
  );
}

function text(element: Element | null): string {
  return element?.textContent?.trim() ?? '';
}

function one<T>(values: T[], reason: string): T {
  if (values.length !== 1) throw new Error(reason);
  return values[0]!;
}

function selectedCourseText(): string {
  for (const selector of ['.course-summary', '[data-current-course]', '.selected-course']) {
    const candidates = [...document.querySelectorAll(selector)].filter(visible);
    if (candidates.length === 1) return text(candidates[0]!);
    if (candidates.length > 1) throw new Error('Hay varios cursos visibles; abre un solo curso.');
  }
  return '';
}

function courseMatches(expected: string, actual: string): boolean {
  const target = normalized(expected);
  const current = normalized(actual);
  const level = ['inicial', 'primaria', 'secundaria'].find((word) => target.includes(word));
  const gradeIndex = gradeAliases.findIndex((aliases) =>
    aliases.some((alias) => new RegExp(`(?:^| )${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: |$)`).test(target)),
  );
  const grade = gradeIndex >= 0 ? gradeAliases[gradeIndex]!.find((alias) =>
    new RegExp(`(?:^| )${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: |$)`).test(target),
  ) : undefined;
  const afterGrade = grade
    ? target.slice(target.indexOf(grade) + grade.length).trim().split(' ')
    : [];
  const section = afterGrade.find((part) => /^[a-f]$/.test(part));
  if (!level || !grade || !section) return false;
  const currentGradeMatches = gradeAliases[gradeIndex]!.some((alias) =>
    new RegExp(`(?:^| )${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?: |$)`).test(current),
  );
  return (
    current.includes(level) &&
    currentGradeMatches &&
    new RegExp(`(?:^| )${section}(?: |$)`).test(current)
  );
}

interface Roster {
  table: HTMLTableElement;
  rudeIndex: number;
  surnameIndex: number;
  rows: HTMLTableRowElement[];
}

function headerLabels(table: HTMLTableElement): string[] {
  const header = table.tHead;
  if (!header || header.rows.length === 0) return [];
  const grid: string[][] = [];
  for (const [rowIndex, row] of [...header.rows].entries()) {
    grid[rowIndex] ??= [];
    let column = 0;
    for (const cell of [...row.cells]) {
      while (grid[rowIndex]![column] !== undefined) column += 1;
      for (let down = 0; down < cell.rowSpan; down += 1) {
        grid[rowIndex + down] ??= [];
        for (let across = 0; across < cell.colSpan; across += 1) {
          grid[rowIndex + down]![column + across] = normalized(text(cell));
        }
      }
      column += cell.colSpan;
    }
  }
  const width = Math.max(...grid.map((row) => row.length));
  return Array.from({ length: width }, (_, column) =>
    [...new Set(grid.map((row) => row[column]).filter(Boolean))].join(' '),
  );
}

function cellAtColumn(row: HTMLTableRowElement, column: number): HTMLTableCellElement | null {
  let cursor = 0;
  for (const cell of [...row.cells]) {
    const next = cursor + cell.colSpan;
    if (column >= cursor && column < next) {
      return cell.colSpan === 1 && cell.rowSpan === 1 ? cell : null;
    }
    cursor = next;
  }
  return null;
}

function findRoster(): Roster {
  const tables = [...document.querySelectorAll<HTMLTableElement>('table')]
    .filter(visible)
    .map((table) => {
      const headings = headerLabels(table);
      const rudeMatches = headings.flatMap((heading, index) => /\brude\b/.test(heading) ? [index] : []);
      const surnameMatches = headings.flatMap((heading, index) =>
        /\bpaterno\b|\bapellidos?\b/.test(heading) ? [index] : [],
      );
      const rudeIndex = rudeMatches.length === 1 ? rudeMatches[0]! : -1;
      const surnameIndex = surnameMatches.length === 1 ? surnameMatches[0]! : -1;
      const rows = [...table.querySelectorAll<HTMLTableRowElement>('tbody tr')].filter(visible);
      return { table, rudeIndex, surnameIndex, rows };
    })
    .filter(({ rudeIndex, surnameIndex }) => rudeIndex >= 0 && surnameIndex >= 0);
  const roster = one(tables, 'Debe haber una sola tabla visible con columnas RUDE y apellido.');
  if (roster.rows.some((row) => [...row.cells].some((cell) => cell.rowSpan !== 1 || cell.colSpan !== 1))) {
    throw new Error('La tabla de estudiantes tiene celdas combinadas; requiere revisión manual.');
  }
  return roster;
}

function exactRude(value: string): string {
  return value.replace(/\s+/g, '').trim();
}

function firstSurnameMatches(expectedLastName: string, observed: string): boolean {
  const expected = normalized(expectedLastName);
  const actual = normalized(observed);
  return Boolean(actual) && (expected === actual || expected.startsWith(`${actual} `));
}

function findStudentRow(roster: Roster, grade: SigceGrade): HTMLTableRowElement {
  const matches = roster.rows.filter((row) =>
    exactRude(text(cellAtColumn(row, roster.rudeIndex))) === exactRude(grade.rude),
  );
  const row = one(matches, `El RUDE ${grade.rude} no aparece una sola vez en la tabla visible.`);
  if (!firstSurnameMatches(grade.lastName, text(cellAtColumn(row, roster.surnameIndex)))) {
    throw new Error(`El apellido del RUDE ${grade.rude} no coincide con SIGCE.`);
  }
  return row;
}

function findGradeDialog(): Element | null {
  for (const selector of ['[role="dialog"]', '.grade-modal']) {
    const dialogs = [...document.querySelectorAll(selector)]
      .filter(visible)
      .filter((dialog) => dialog.querySelector('table'));
    if (dialogs.length > 1) throw new Error('Hay varios registros de notas abiertos.');
    if (dialogs.length === 1) return dialogs[0]!;
  }
  return null;
}

function waitForGradeDialog(): Promise<Element> {
  const opened = findGradeDialog();
  if (opened) return Promise.resolve(opened);
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      try {
        const dialog = findGradeDialog();
        if (!dialog) return;
        clearTimeout(timeout);
        observer.disconnect();
        resolve(dialog);
      } catch (error) {
        clearTimeout(timeout);
        observer.disconnect();
        reject(error);
      }
    });
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      reject(new Error('No se abrió el registro de notas del estudiante.'));
    }, 4000);
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  });
}

function dialogField(dialog: Element, label: RegExp): string {
  const rows = [...dialog.querySelectorAll('tr')];
  for (const row of rows) {
    const cells = [...row.querySelectorAll('td,th')];
    const labelIndex = cells.findIndex((cell) => label.test(normalized(text(cell))));
    if (labelIndex >= 0) return text(cells[labelIndex + 1] ?? null);
  }
  return '';
}

function periodHeaderMatches(value: string, periodNumber: number): boolean {
  const name = normalized(value);
  const ordinals = periodWords[periodNumber - 1] ?? [];
  return (
    ordinals.length > 0 &&
    (/trimestre|\b[123]t\b|\bt[123]\b/.test(name)) &&
    (ordinals.some((ordinal) => name.includes(ordinal)) || new RegExp(`(?:^| )${periodNumber}(?: |t|ro|er|do|$)`).test(name) || name.includes(`t${periodNumber}`))
  );
}

function subjectLabels(subject: FillRequest['subject'], additional?: string): Set<string> {
  const labels = new Set([normalized(subject.name), normalized(additional ?? '')].filter(Boolean));
  const builtIns: Record<string, string[]> = {
    matematica: ['matematicas'],
    matematicas: ['matematica'],
    'educacion fisica y deportes': ['educacion fisica'],
    'comunicacion y lenguajes lengua castellana': ['lengua castellana'],
    'ciencias naturales fisica': ['fisica'],
    'ciencias naturales quimica': ['quimica'],
    'ciencias naturales biologia geografia': ['biologia geografia'],
  };
  for (const label of builtIns[normalized(subject.name)] ?? []) labels.add(label);
  return labels;
}

function findGradeInput(dialog: Element, request: FillRequest): HTMLInputElement | HTMLTextAreaElement {
  const candidates: Array<HTMLInputElement | HTMLTextAreaElement> = [];
  for (const table of [...dialog.querySelectorAll<HTMLTableElement>('table')].filter(visible)) {
    if ([...table.querySelectorAll<HTMLTableRowElement>('tbody tr')].some((row) =>
      [...row.cells].some((cell) => cell.rowSpan !== 1 || cell.colSpan !== 1))) continue;
    const headers = headerLabels(table);
    const subjectIndices = headers.flatMap((value, index) => /\barea\b|\bmateria\b|\basignatura\b/.test(value) ? [index] : []);
    const periodIndices = headers.flatMap((value, index) => periodHeaderMatches(value, request.period.number) ? [index] : []);
    if (subjectIndices.length !== 1 || periodIndices.length !== 1) continue;
    const subjectIndex = subjectIndices[0]!;
    const periodIndex = periodIndices[0]!;
    const labels = subjectLabels(request.subject, request.subjectAlias);
    for (const row of [...table.querySelectorAll<HTMLTableRowElement>('tbody tr')].filter(visible)) {
      if (!labels.has(normalized(text(cellAtColumn(row, subjectIndex))))) continue;
      const cell = cellAtColumn(row, periodIndex);
      if (!cell) continue;
      candidates.push(
        ...[...cell.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input,textarea')].filter(
          (input) =>
            visible(input) &&
            !input.disabled &&
            !input.readOnly &&
            (input instanceof HTMLTextAreaElement || ['text', 'number', ''].includes(input.type)),
        ),
      );
    }
  }
  return one(candidates, 'No se encontró una única casilla editable para la materia y el trimestre.');
}

function writeValue(input: HTMLInputElement | HTMLTextAreaElement, value: number): void {
  const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(input, String(value));
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
}

export function inspectPortal(expectedCourse?: string): PortalResponse {
  try {
    const course = selectedCourseText();
    if (!course) throw new Error('No se reconoce el curso abierto en esta pantalla.');
    if (expectedCourse && !courseMatches(expectedCourse, course)) {
      throw new Error(`El curso abierto (${course}) no coincide con ${expectedCourse}.`);
    }
    const roster = findRoster();
    return { ok: true, status: 'READY', course, studentCount: roster.rows.length };
  } catch (error) {
    return { ok: false, status: 'ERROR', detail: error instanceof Error ? error.message : 'Pantalla no reconocida.' };
  }
}

export async function fillVisibleGrade(request: FillRequest): Promise<PortalResponse> {
  const { grade } = request;
  try {
    const course = selectedCourseText();
    if (!courseMatches(request.course.name, course)) {
      throw new Error(`El curso abierto (${course || 'sin identificar'}) no coincide con ${request.course.name}.`);
    }
    const roster = findRoster();
    const row = findStudentRow(roster, grade);
    row.scrollIntoView({ block: 'center', behavior: 'instant' });
    let dialog = findGradeDialog();
    if (!dialog) {
      const buttons = [...row.querySelectorAll<HTMLButtonElement>('button')].filter((button) =>
        visible(button) &&
        (/calificacion|nota/i.test(normalized(`${button.title} ${button.getAttribute('aria-label') ?? ''}`)) ||
          button.dataset.action === 'grade'),
      );
      one(buttons, 'No se identificó un único botón de calificaciones para este estudiante.').click();
      dialog = await waitForGradeDialog();
    }
    if (!dialog) throw new Error('No se abrió el registro de notas del estudiante.');
    const rudeInDialog = text(dialog.querySelector('#modal-code')) || dialogField(dialog, /\brude\b/);
    if (exactRude(rudeInDialog) !== exactRude(grade.rude)) {
      throw new Error('El RUDE del registro abierto no coincide con la fila seleccionada.');
    }
    const nameInDialog = text(dialog.querySelector('#modal-student')) || dialogField(dialog, /\bestudiante\b/);
    if (!normalized(nameInDialog).includes(normalized(grade.lastName).split(' ')[0] ?? '')) {
      throw new Error('El apellido del registro abierto no coincide con SIGCE.');
    }
    const input = findGradeInput(dialog, request);
    if (!Number.isInteger(grade.value) || grade.value < 0 || grade.value > 100) {
      throw new Error('SIGCE devolvió una calificación fuera del rango de 0 a 100.');
    }
    const current = input.value.trim();
    if (current === String(grade.value)) {
      return { ok: true, status: 'ALREADY_EQUAL', gradeId: grade.gradeId, detail: 'La casilla ya muestra esta nota; no se modificó.' };
    }
    if (current !== '' && !request.allowOverwrite) {
      return {
        ok: false,
        status: 'CONFLICT',
        gradeId: grade.gradeId,
        detail: `La casilla muestra ${current} y SIGCE propone ${grade.value}. Revise antes de reemplazar.`,
      };
    }
    writeValue(input, grade.value);
    if (input.value !== String(grade.value)) throw new Error('La página rechazó el valor escrito.');
    return { ok: true, status: 'FILLED', gradeId: grade.gradeId, detail: 'Nota escrita. Revísela y pulse Guardar en el SIE.' };
  } catch (error) {
    return {
      ok: false,
      status: 'ERROR',
      gradeId: grade.gradeId,
      detail: error instanceof Error ? error.message : 'No se pudo completar esta fila.',
    };
  }
}
