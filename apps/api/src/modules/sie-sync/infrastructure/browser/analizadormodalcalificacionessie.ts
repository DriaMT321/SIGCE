import type { estudianteexternaisie } from '../../application/ports/ejecucionauditoriacalificacionsie.ports';

export function analizarmodalcalificacionessie(html: string): estudianteexternaisie {
  const rudecoincidencia = html.match(/<th>Codigo Rude<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const coincidencianombre = html.match(
    /<th>Estudiante<\/th>\s*<td[^>]*>(?:<b>)?([^<]+)(?:<\/b>)?<\/td>/i,
  );
  const nivelcoincidencia = html.match(/<th>Nivel<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const gradocoincidencia = html.match(/<th>Grado<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const paralelocoincidencia = html.match(/<th>Paralelo<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const turnocoincidencia = html.match(/<th>Turno<\/th>\s*<td[^>]*>([^<]+)<\/td>/i);
  const calificaciones: estudianteexternaisie['calificaciones'] = [];

  const notacualitativa = html.match(
    /<textarea[^>]*disabled=["']disabled["'][^>]*>([\s\S]*?)<\/textarea>/i,
  );
  if (notacualitativa) {
    calificaciones.push({
      materia: 'INICIAL EN FAMILIA COMUNITARIA',
      notacualitativa: notacualitativa[1].trim(),
    });
  }

  const filas = html.matchAll(
    /<tr>\s*<td[^>]*data-title=["']Asignatura["'][^>]*>([\s\S]*?)<\/td>([\s\S]*?)<\/tr>/gi,
  );
  for (const fila of filas) {
    const materia = fila[1].replace(/<[^>]+>/g, '').trim();
    if (!materia) continue;

    const entradas = Array.from(
      fila[2].matchAll(/<input[^>]*name=["']nota\[\]["'][^>]*value=["']?([^"'>]*)["']?[^>]*>/gi),
    );
    const convertirnota = (indice: number): number | null => {
      const valor = entradas[indice]?.[1]?.trim();
      if (!valor) return null;
      const nota = Number.parseInt(valor, 10);
      return Number.isFinite(nota) ? nota : null;
    };

    calificaciones.push({
      materia,
      notaprimertrimestre: convertirnota(0),
      notasegundotrimestre: convertirnota(1),
      notatercertrimestre: convertirnota(2),
    });
  }

  return {
    rude: rudecoincidencia?.[1].trim() ?? '',
    nombre: coincidencianombre?.[1].trim() ?? '',
    nivel: nivelcoincidencia?.[1].trim() ?? '',
    grado: gradocoincidencia?.[1].trim() ?? '',
    paralelo: paralelocoincidencia?.[1].trim() ?? '',
    turno: turnocoincidencia?.[1].trim() ?? '',
    calificaciones,
  };
}
