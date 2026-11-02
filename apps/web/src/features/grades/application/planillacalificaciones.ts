import type {
  calificacionestudianteopcion,
  calificacionregistro,
  gestioncalificacion,
} from './gestioncalificaciones';

export function interpretarcalificacion(entrada: string):
  | { tipo: 'vacia' }
  | { tipo: 'invalida' }
  | { tipo: 'valida'; valor: number } {
  const texto = entrada.trim();
  if (!texto) return { tipo: 'vacia' };
  if (!/^\d+(?:[.,]\d+)?$/.test(texto)) return { tipo: 'invalida' };
  const valor = Number(texto.replace(',', '.'));
  if (!Number.isFinite(valor) || valor < 0 || valor > 100) return { tipo: 'invalida' };
  return { tipo: 'valida', valor };
}

export async function cargarcalificacionesplanilla(
  gestion: Pick<gestioncalificacion, 'buscarcalificaciones'>,
  filtros: { courseId: string; subjectId: string; periodId: string },
): Promise<calificacionregistro[]> {
  const resultados: calificacionregistro[] = [];
  const identificadores = new Set<string>();
  let total = 0;
  do {
    const pagina = await gestion.buscarcalificaciones({ ...filtros, offset: resultados.length });
    total = Math.max(total, pagina.total);
    if (!pagina.data.length && resultados.length < total) {
      throw new Error('No se pudieron cargar todas las calificaciones. Vuelve a intentarlo.');
    }
    for (const calificacion of pagina.data) {
      if (identificadores.has(calificacion.id)) {
        throw new Error('Las calificaciones cambiaron durante la carga. Vuelve a intentarlo.');
      }
      identificadores.add(calificacion.id);
      resultados.push(calificacion);
    }
  } while (resultados.length < total);
  return resultados;
}

export function prepararcalificacionesplanilla(entrada: {
  estudiantes: calificacionestudianteopcion[];
  registradas: calificacionregistro[];
  valores: Record<string, string>;
  observaciones: Record<string, string>;
  courseId: string;
  academicYearId: string;
}) {
  if (entrada.estudiantes.some((estudiante) =>
    interpretarcalificacion(entrada.valores[estudiante.id] ?? '').tipo === 'invalida',
  )) {
    throw new Error('Corrige las notas señaladas antes de guardar. Las demás permanecen en la planilla.');
  }
  return entrada.estudiantes.flatMap((estudiante) => {
    const matricula = estudiante.enrollments.find((item) =>
      item.course.id === entrada.courseId && item.status === 'ACTIVE' &&
      item.academicYear.id === entrada.academicYearId,
    );
    const calificacion = interpretarcalificacion(entrada.valores[estudiante.id] ?? '');
    if (!matricula || calificacion.tipo !== 'valida') return [];
    const observacion = entrada.observaciones[estudiante.id]?.trim() || undefined;
    const existente = entrada.registradas.find((item) => item.enrollmentId === matricula.id);
    if (existente && existente.value === calificacion.valor &&
      (existente.remarks?.trim() || undefined) === observacion) return [];
    return [{ studentId: estudiante.id, enrollmentId: matricula.id, value: calificacion.valor, remarks: observacion }];
  });
}
