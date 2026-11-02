export interface informepagina<T> {
  data: T[];
  total: number;
}

export interface informecalificacion {
  value: number;
}

export interface informeasistencia {
  status: string;
}

/** Load every page before a report can be exported or printed. */
export async function cargartodospaginas<T>(
  obtenerpagina: (desplazamiento: number) => Promise<informepagina<T>>,
) {
  const elementos: T[] = [];
  let total = 1;

  while (elementos.length < total) {
    const pagina = await obtenerpagina(elementos.length);
    total = pagina.total;
    if (pagina.data.length === 0 && elementos.length < total) {
      throw new Error('La consulta paginada terminó antes de recuperar todos los registros.');
    }
    elementos.push(...pagina.data);
  }

  return elementos;
}

export function promediocalificacion(
  calificaciones: Pick<informecalificacion, 'value'>[],
): number | null {
  return promediovalores(calificaciones.map((calificacion) => calificacion.value));
}

export function promediovalores(valores: number[]): number | null {
  if (valores.length === 0) return null;
  return Math.round((valores.reduce((suma, valor) => suma + valor, 0) / valores.length) * 10) / 10;
}

export function asistenciaresumen(registros: Pick<informeasistencia, 'status'>[]) {
  const presente = registros.filter((registrar) => registrar.status === 'PRESENT').length;
  const tardio = registros.filter((registrar) => registrar.status === 'LATE').length;
  const ausente = registros.filter((registrar) => registrar.status === 'ABSENT').length;
  const justificado = registros.filter((registrar) => registrar.status === 'JUSTIFIED').length;
  return {
    present: presente,
    late: tardio,
    absent: ausente,
    justified: justificado,
    total: registros.length,
    rate:
      registros.length > 0
        ? Math.round(((presente + tardio) / registros.length) * 1000) / 10
        : null,
  };
}
