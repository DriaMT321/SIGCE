// Margen amplio para detectar datos imposibles o claramente fuera del registro escolar regular.
// Es una regla de integridad del sistema, no una edad de admisión establecida por norma.
export const edadminimaestudianteregular = 3;
export const edadmaximaestudianteregular = 100;

export function obtenerfechahoybolivia(fechaactual = new Date()): string {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(fechaactual);
  const anio = partes.find((parte) => parte.type === 'year')?.value;
  const mes = partes.find((parte) => parte.type === 'month')?.value;
  const dia = partes.find((parte) => parte.type === 'day')?.value;
  if (!anio || !mes || !dia) throw new Error('No se pudo obtener la fecha local de Bolivia.');
  return `${anio}-${mes}-${dia}`;
}

export function obtenererrorfechanacimientoestudiante(
  valor: unknown,
  fechaactual = new Date(),
): string | null {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return 'Ingresa una fecha de nacimiento válida en formato AAAA-MM-DD.';
  }

  const fecha = new Date(`${valor}T00:00:00.000Z`);
  if (!Number.isFinite(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== valor) {
    return 'La fecha de nacimiento no existe en el calendario.';
  }

  const hoy = obtenerfechahoybolivia(fechaactual);
  if (valor > hoy) return 'La fecha de nacimiento no puede ser posterior a hoy.';

  const [anioNacimiento, mesNacimiento, diaNacimiento] = valor.split('-').map(Number);
  const [anioActual, mesActual, diaActual] = hoy.split('-').map(Number);
  let edad = anioActual! - anioNacimiento!;
  if (
    mesActual! < mesNacimiento! ||
    (mesActual === mesNacimiento && diaActual! < diaNacimiento!)
  ) {
    edad -= 1;
  }

  if (edad < edadminimaestudianteregular || edad > edadmaximaestudianteregular) {
    return `La edad para registrar a un estudiante debe estar entre ${edadminimaestudianteregular} y ${edadmaximaestudianteregular} años. Revisa la fecha.`;
  }
  return null;
}
