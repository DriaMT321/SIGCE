import type {
  comparacioncalificacionmateria,
  resultadocomparacionestudiante,
} from '../modelos/modeloauditoriasie';

export type { comparacioncalificacionmateria, resultadocomparacionestudiante };

function normalizarmateria(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function coincidenombremateria(
  siemateria: string,
  sigcematerias: Array<{ id: string; name: string }>,
): { id: string; name: string } | null {
  const normasie = normalizarmateria(siemateria);

  for (const s of sigcematerias) {
    const normasigce = normalizarmateria(s.name);
    if (normasie === normasigce) return s;
  }

  if (normasie.includes('lenguaje') || normasie.includes('comunicacion')) {
    const encontrado = sigcematerias.find(
      (s) =>
        normalizarmateria(s.name).includes('lenguaje') ||
        normalizarmateria(s.name).includes('comunicacion'),
    );
    if (encontrado) return encontrado;
  }
  if (normasie.includes('matematica')) {
    const encontrado = sigcematerias.find((s) => normalizarmateria(s.name).includes('matematica'));
    if (encontrado) return encontrado;
  }
  if (normasie.includes('fisica') && !normasie.includes('educacion')) {
    const encontrado = sigcematerias.find(
      (s) =>
        normalizarmateria(s.name).includes('fisica') &&
        !normalizarmateria(s.name).includes('educacion'),
    );
    if (encontrado) return encontrado;
  }
  if (normasie.includes('quimica')) {
    const encontrado = sigcematerias.find((s) => normalizarmateria(s.name).includes('quimica'));
    if (encontrado) return encontrado;
  }
  if (normasie.includes('sociales') || normasie.includes('historia')) {
    const encontrado = sigcematerias.find(
      (s) =>
        normalizarmateria(s.name).includes('sociales') ||
        normalizarmateria(s.name).includes('historia'),
    );
    if (encontrado) return encontrado;
  }
  if (normasie.includes('extranjera') || normasie.includes('ingles')) {
    const encontrado = sigcematerias.find(
      (s) =>
        normalizarmateria(s.name).includes('extranjera') ||
        normalizarmateria(s.name).includes('ingles'),
    );
    if (encontrado) return encontrado;
  }
  if (normasie.includes('educacion fisica') || normasie.includes('deportes')) {
    const encontrado = sigcematerias.find(
      (s) =>
        normalizarmateria(s.name).includes('educacion fisica') ||
        normalizarmateria(s.name).includes('deportes'),
    );
    if (encontrado) return encontrado;
  }

  return null;
}
