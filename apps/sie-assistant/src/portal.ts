import type { GradePlan, PortalResponse, SigceGrade } from './types';

type FillRequest = {
  grade: SigceGrade;
  course: GradePlan['course'];
  subject: GradePlan['subject'];
  period: GradePlan['period'];
  subjectAlias?: string;
  allowOverwrite?: boolean;
  expectedPreviousValue?: string;
  value?: string;
};

export type PortalStep = {
  element: Element;
  label: string;
  action: 'locate' | 'click' | 'write' | 'done' | 'warning';
};

export type PortalStepObserver = (step: PortalStep) => Promise<void> | void;

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
    if (candidates.length === 1) {
      return [...candidates[0]!.childNodes]
        .map((node) => node.textContent?.trim() ?? '')
        .filter(Boolean)
        .join(' ');
    }
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

function writeValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(input, value);
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

function courseParts(expected: string): { level: string; grade: string; section: string } | null {
  const target = normalized(expected);
  const level = ['inicial', 'primaria', 'secundaria'].find((word) => target.includes(word));
  const gradeIndex = gradeAliases.findIndex((aliases) =>
    aliases.some((alias) => new RegExp(`(?:^| )${alias}(?: |$)`).test(target)),
  );
  if (!level || gradeIndex < 0) return null;
  const grade = gradeAliases[gradeIndex]!.find((alias) =>
    new RegExp(`(?:^| )${alias}(?: |$)`).test(target),
  );
  if (!grade) return null;
  const section = target.slice(target.indexOf(grade) + grade.length).trim().split(' ').find((part) => /^[a-f]$/.test(part));
  return section ? { level, grade, section } : null;
}

function visibleCourseControls(): Array<HTMLElement> {
  return [...document.querySelectorAll<HTMLElement>('button,a,[role="button"],[tabindex]')].filter(visible);
}

function findCourseControl(expected: string, kind: 'grade' | 'section'): HTMLElement {
  const parts = courseParts(expected);
  if (!parts) throw new Error('El nombre del curso no permite identificar nivel, grado y paralelo.');
  const gradeAliasesForTarget = gradeAliases.find((aliases) => aliases.includes(parts.grade)) ?? [parts.grade];
  const controls = visibleCourseControls();
  const exactCandidates = controls.filter((control) => {
    const labels = [
      normalized(text(control)),
      normalized(control.getAttribute('aria-label') ?? ''),
      normalized(control.getAttribute('title') ?? ''),
    ].filter(Boolean);
    if (kind === 'section') return labels.some((label) => label === parts.section);
    return gradeAliasesForTarget.some((alias) => labels.includes(normalized(alias)));
  });

  const matchesContext = (control: HTMLElement) => {
    let parent: Element | null = control;
    for (let depth = 0; parent && depth < 9; depth += 1, parent = parent.parentElement) {
      const context = normalized(text(parent));
      if (context.length > 260) continue;
      const hasLevel = context.includes(parts.level);
      const hasGrade = gradeAliasesForTarget.some((alias) =>
        new RegExp(`(?:^| )${alias}(?: |$)`).test(context),
      );
      if (!hasLevel || !hasGrade) continue;
      if (kind === 'grade' || context.split(' ').includes(parts.section)) return true;
    }
    return false;
  };

  const candidates = exactCandidates.filter(matchesContext);
  if (candidates.length !== 1) {
    throw new Error(`No se identificó un único control visible para el ${kind === 'grade' ? 'grado' : 'paralelo'} de ${expected}.`);
  }
  return candidates[0]!;
}

async function waitForCourse(expected: string): Promise<PortalResponse> {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    const result = inspectPortal(expected);
    if (result.ok && result.status === 'READY') return result;
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }
  return inspectPortal(expected);
}

export async function navigateVisibleCourse(expectedCourse: string): Promise<PortalResponse> {
  const initial = inspectPortal(expectedCourse);
  if (initial.ok) return initial;
  try {
    const parts = courseParts(expectedCourse);
    if (!parts) throw new Error('El curso requiere una selección manual porque no se pudieron leer sus datos.');
    const gradeControl = findCourseControl(expectedCourse, 'grade');
    gradeControl.scrollIntoView({ block: 'center', behavior: 'instant' });
    gradeControl.click();
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const sectionControl = findCourseControl(expectedCourse, 'section');
    sectionControl.scrollIntoView({ block: 'center', behavior: 'instant' });
    sectionControl.click();
    const result = await waitForCourse(expectedCourse);
    if (!result.ok) throw new Error(result.detail);
    return result;
  } catch (error) {
    return { ok: false, status: 'ERROR', detail: error instanceof Error ? error.message : 'No se pudo abrir el curso solicitado.' };
  }
}

export function closeVisibleGradeDialog(rude: string): PortalResponse {
  try {
    const dialog = findGradeDialog();
    if (!dialog) return { ok: true, status: 'CLOSED', detail: 'No había un registro abierto.' };
    const dialogRude = text(dialog.querySelector('#modal-code')) || dialogField(dialog, /\brude\b/);
    if (exactRude(dialogRude) !== exactRude(rude)) {
      throw new Error('El registro abierto no coincide con el estudiante actual.');
    }
    const closeButtons = [...dialog.querySelectorAll<HTMLElement>('button,[role="button"]')]
      .filter(visible)
      .filter((button) => /cerrar|close|cancelar|volver|salir/i.test(normalized(`${text(button)} ${button.getAttribute('aria-label') ?? ''}`)));
    const closeButton = one(closeButtons, 'No se identificó un botón seguro para cerrar el registro de notas.');
    closeButton.click();
    if (findGradeDialog()) throw new Error('El registro de notas sigue abierto.');
    return { ok: true, status: 'CLOSED', detail: 'Registro cerrado.' };
  } catch (error) {
    return { ok: false, status: 'ERROR', detail: error instanceof Error ? error.message : 'No se pudo cerrar el registro.' };
  }
}

export function saveVisibleGrade(request: FillRequest): Promise<PortalResponse> {
  const { grade } = request;
  return new Promise((resolve) => {
    const dialog = findGradeDialog();
    if (!dialog) {
      resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: 'No hay un registro de notas abierto para guardar.' });
      return;
    }
    const dialogRude = text(dialog.querySelector('#modal-code')) || dialogField(dialog, /\brude\b/);
    if (exactRude(dialogRude) !== exactRude(grade.rude)) {
      resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: 'El registro abierto no coincide con el RUDE del estudiante.' });
      return;
    }
    try {
      const input = findGradeInput(dialog, request);
      if (input.value.trim() !== String(grade.value)) {
        resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: 'La casilla cambió después de escribirla. No se pulsó Guardar.' });
        return;
      }
    } catch (error) {
      resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: error instanceof Error ? error.message : 'No se pudo confirmar la casilla antes de guardar.' });
      return;
    }
    const buttons = [...dialog.querySelectorAll<HTMLElement>('button,input[type="submit"],[role="button"]')]
      .filter(visible)
      .filter((button) => !('disabled' in button && Boolean((button as HTMLButtonElement).disabled)))
      .filter((button) => /guardar|registrar cambios/i.test(normalized(`${text(button)} ${button.getAttribute('aria-label') ?? ''}`)));
    if (buttons.length !== 1) {
      resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: 'No se identificó un único botón visible para guardar esta nota.' });
      return;
    }

    let timeout = 0;
    const observer = new MutationObserver((mutations) => {
      const changed = new Set<Element>();
      for (const mutation of mutations) {
        const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
        const status = target?.closest('#toast,[role="status"],[role="alert"]');
        if (status && visible(status)) changed.add(status);
      }
      for (const node of changed) {
        const message = text(node);
        if (/guardad[oa]s?|registrad[oa]s?|actualizad[oa]s?/i.test(message)) {
          clearTimeout(timeout);
          observer.disconnect();
          resolve({ ok: true, status: 'SAVED', gradeId: grade.gradeId, detail: `La página mostró: ${message.slice(0, 180)}` });
          return;
        }
        if (/error|no se pudo|rechaz|fall[oó]|inv[aá]lid/i.test(message)) {
          clearTimeout(timeout);
          observer.disconnect();
          resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: `La página informó: ${message.slice(0, 180)}` });
          return;
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true });
    timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve({ ok: false, status: 'ERROR', gradeId: grade.gradeId, detail: 'La página no mostró una confirmación de guardado en el tiempo esperado.' });
    }, 10000);
    buttons[0]!.click();
  });
}

export async function fillVisibleGrade(request: FillRequest, onStep?: PortalStepObserver): Promise<PortalResponse> {
  const { grade } = request;
  const showStep = async (step: PortalStep) => {
    try { await onStep?.(step); } catch { /* La ayuda visual no debe impedir el registro. */ }
  };
  try {
    const course = selectedCourseText();
    if (!courseMatches(request.course.name, course)) {
      throw new Error(`El curso abierto (${course || 'sin identificar'}) no coincide con ${request.course.name}.`);
    }
    const roster = findRoster();
    const row = findStudentRow(roster, grade);
    row.scrollIntoView({ block: 'center', behavior: 'instant' });
    await showStep({ element: cellAtColumn(row, roster.rudeIndex) ?? row, label: `RUDE ${grade.rude}`, action: 'locate' });
    let dialog = findGradeDialog();
    if (!dialog) {
      const buttons = [...row.querySelectorAll<HTMLButtonElement>('button')].filter((button) =>
        visible(button) &&
        (/calificacion|nota/i.test(normalized(`${button.title} ${button.getAttribute('aria-label') ?? ''}`)) ||
          button.dataset.action === 'grade'),
      );
      const button = one(buttons, 'No se identificó un único botón de calificaciones para este estudiante.');
      await showStep({ element: button, label: 'Abrir calificaciones', action: 'click' });
      button.click();
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
    await showStep({ element: input, label: `${request.subject.name} · ${request.period.name}`, action: 'write' });
    if (!Number.isInteger(grade.value) || grade.value < 0 || grade.value > 100) {
      throw new Error('SIGCE devolvió una calificación fuera del rango de 0 a 100.');
    }
    const current = input.value.trim();
    const targetValue = request.value ?? String(grade.value);
    const numericTarget = Number(targetValue);
    if (targetValue !== '' && (!Number.isInteger(numericTarget) || numericTarget < 0 || numericTarget > 100)) {
      throw new Error('La calificación solicitada debe estar entre 0 y 100.');
    }
    if (current === targetValue) {
      await showStep({ element: input, label: 'La nota ya coincide', action: 'done' });
      return { ok: true, status: 'ALREADY_EQUAL', gradeId: grade.gradeId, detail: 'La casilla ya muestra esta nota; no se modificó.' };
    }
    if (request.expectedPreviousValue !== undefined && current !== request.expectedPreviousValue) {
      return {
        ok: false,
        status: 'CONFLICT',
        gradeId: grade.gradeId,
        existingValue: current,
        detail: `La casilla cambió desde el respaldo (${request.expectedPreviousValue || 'vacía'}). Se conserva ${current || 'vacía'} y no se modificó.`,
      };
    }
    if (current !== '' && !request.allowOverwrite) {
      await showStep({ element: input, label: 'Nota diferente: revisar', action: 'warning' });
      return {
        ok: false,
        status: 'CONFLICT',
        gradeId: grade.gradeId,
        existingValue: current,
        detail: `La casilla muestra ${current} y SIGCE propone ${grade.value}. Revise antes de reemplazar.`,
      };
    }
    writeValue(input, targetValue);
    if (input.value !== targetValue) throw new Error('La página rechazó el valor escrito.');
    await showStep({ element: input, label: `Nota ${targetValue} escrita · revisa y guarda`, action: 'done' });
    return { ok: true, status: 'FILLED', gradeId: grade.gradeId, detail: request.value !== undefined ? 'Valor anterior restaurado en el campo. Guarde el registro en la página.' : 'Nota escrita. Revísela y pulse Guardar en la página.' };
  } catch (error) {
    return {
      ok: false,
      status: 'ERROR',
      gradeId: grade.gradeId,
      detail: error instanceof Error ? error.message : 'No se pudo completar esta fila.',
    };
  }
}
