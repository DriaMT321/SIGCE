export const gradominimoinicial = 1;
export const gradomaximoinicial = 2;
export const gradominimoprimaria = 3;
export const gradomaximoprimaria = 8;
export const gradominimosecundaria = 9;
export const gradomaximoregular = 14;
export const gradomaximosecundaria = gradomaximoregular;
export const minutosperiodopedagogico = 40;
export const periodosinicialesdiarios = 5;
export const periodosprimariaysecundariosdiarios = 6;
export const diaslectivospasemana = 5;
export const minutosrecreopedagogico = 15;

export type turnoacademico = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface franjaperiodopedagogico {
  indiceperiodo: number;
  horainicio: string;
  horafin: string;
}

export type niveleducativoregular = 'INITIAL' | 'PRIMARY' | 'SECONDARY';

export function obtenierniveleducativoregular(gradonivel: number): niveleducativoregular | null {
  if (
    !Number.isInteger(gradonivel) ||
    gradonivel < gradominimoinicial ||
    gradonivel > gradomaximoregular
  ) {
    return null;
  }
  if (gradonivel <= gradomaximoinicial) return 'INITIAL';
  if (gradonivel <= gradomaximoprimaria) return 'PRIMARY';
  return 'SECONDARY';
}

export function obtenercantidadperiodosdiarios(gradonivel: number): number {
  const niveleducativo = obtenierniveleducativoregular(gradonivel);
  if (!niveleducativo)
    throw new RangeError(`El grado ${gradonivel} está fuera de la educación regular.`);
  return niveleducativo === 'INITIAL'
    ? periodosinicialesdiarios
    : periodosprimariaysecundariosdiarios;
}

export function obtenerminutosperiodopedagogico(gradonivel: number, turno: turnoacademico): number {
  const niveleducativo = obtenierniveleducativoregular(gradonivel);
  if (!niveleducativo)
    throw new RangeError(`El grado ${gradonivel} está fuera de la educación regular.`);
  return niveleducativo !== 'INITIAL' && turno === 'EVENING' ? 35 : minutosperiodopedagogico;
}

const minutosinicioporturno: Record<turnoacademico, number> = {
  MORNING: 7 * 60 + 30,
  AFTERNOON: 13 * 60,
  EVENING: 18 * 60,
};

export function obtenerfranjasperiodosdiarios(
  gradonivel: number,
  turno: turnoacademico,
): franjaperiodopedagogico[] {
  const cantidadperiodos = obtenercantidadperiodosdiarios(gradonivel);
  const minutosperiodo = obtenerminutosperiodopedagogico(gradonivel, turno);
  let minutostranscurridos = minutosinicioporturno[turno];
  const franjas: franjaperiodopedagogico[] = [];

  for (let indiceperiodo = 1; indiceperiodo <= cantidadperiodos; indiceperiodo++) {
    if (indiceperiodo === 3 || indiceperiodo === 5) minutostranscurridos += minutosrecreopedagogico;
    const horainicio = formatearhora(minutostranscurridos);
    minutostranscurridos += minutosperiodo;
    franjas.push({ indiceperiodo, horainicio, horafin: formatearhora(minutostranscurridos) });
  }

  return franjas;
}

function formatearhora(minutostotales: number): string {
  const horas = Math.floor(minutostotales / 60) % 24;
  const minutos = minutostotales % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}
