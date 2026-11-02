import { analizarmodalcalificacionessie } from './analizadormodalcalificacionessie';

describe('analizadormodalcalificacionessie', () => {
  it('extrae identidad y los tres trimestres desde la respuesta del SIE', () => {
    const html = `
      <table>
        <tr><th>Codigo Rude</th><td>1234567890</td></tr>
        <tr><th>Estudiante</th><td><b>ESTUDIANTE DE PRUEBA</b></td></tr>
        <tr><th>Nivel</th><td>Primaria</td></tr>
        <tr><th>Grado</th><td>3</td></tr>
        <tr><th>Paralelo</th><td>A</td></tr>
        <tr><th>Turno</th><td>Mañana</td></tr>
        <tr>
          <td data-title="Asignatura">Matemática</td>
          <td>
            <input name="nota[]" value="85">
            <input name="nota[]" value="90">
            <input name="nota[]" value="95">
          </td>
        </tr>
      </table>`;

    expect(analizarmodalcalificacionessie(html)).toEqual({
      rude: '1234567890',
      nombre: 'ESTUDIANTE DE PRUEBA',
      nivel: 'Primaria',
      grado: '3',
      paralelo: 'A',
      turno: 'Mañana',
      calificaciones: [
        {
          materia: 'Matemática',
          notaprimertrimestre: 85,
          notasegundotrimestre: 90,
          notatercertrimestre: 95,
        },
      ],
    });
  });
});
