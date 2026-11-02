/**
 * Datos enteramente ficticios para probar el lector del worker cuando el SIE
 * no está disponible. Ninguna fila se construye a partir de SieSyncJobData.
 */
export interface calificacionesielocal {
  rudeestudiante: string;
  gestionacademica: number;
  numeroperiodo: number;
  codigoasignatura: string;
  calificacion: number;
}

export const calificacionessielocales: ReadonlyArray<calificacionesielocal> = [
  {
    rudeestudiante: 'SIM-2026-001',
    gestionacademica: 2026,
    numeroperiodo: 1,
    codigoasignatura: 'MAT-SEC',
    calificacion: 85,
  },
  {
    rudeestudiante: 'SIM-2026-002',
    gestionacademica: 2026,
    numeroperiodo: 1,
    codigoasignatura: 'MAT-SEC',
    calificacion: 72,
  },
];

function escaparHTML(valor: string | number): string {
  return String(valor).replace(/[&<>"']/g, (caracter) => {
    const entidadeshtml: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entidadeshtml[caracter];
  });
}

export function renderizarpaginasielocal(registros: ReadonlyArray<calificacionesielocal>): string {
  const filas = registros
    .map(
      (registro) => `
    <tr>
      <td data-field="rude">${escaparHTML(registro.rudeestudiante)}</td>
      <td data-field="year">${escaparHTML(registro.gestionacademica)}</td>
      <td data-field="period">${escaparHTML(registro.numeroperiodo)}</td>
      <td data-field="subject">${escaparHTML(registro.codigoasignatura)}</td>
      <td data-field="grade">${escaparHTML(registro.calificacion)}</td>
    </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><title>SIE local simulado</title></head>
  <body>
    <h1>SIE local simulado</h1>
    <table id="sie-grades">
      <thead><tr><th>RUDE</th><th>Gestión</th><th>Periodo</th><th>Materia</th><th>Nota</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
  </body>
</html>`;
}
