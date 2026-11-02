import { academicoapi } from '../../../lib/apiacademica';
import { gestionasistencia, type puertogestionasistencia } from '../application/gestionasistencia';

const puerto: puertogestionasistencia = {
  listarasistencia: (filtros) => academicoapi.listarasistencia({ ...filtros, limit: 200 }),
  listarestudiantes: async (courseId) => {
    const estudiantes: Awaited<ReturnType<typeof academicoapi.listarestudiantes>>['data'] = [];
    let total = 0;
    do {
      const respuesta = await academicoapi.listarestudiantes(
        undefined,
        200,
        estudiantes.length,
        courseId,
      );
      total = Math.max(total, respuesta.total);
      if (respuesta.data.length === 0 && estudiantes.length < total) {
        throw new Error('No se pudo cargar la lista completa de estudiantes. Vuelve a intentarlo.');
      }
      estudiantes.push(...respuesta.data);
      if (new Set(estudiantes.map((estudiante) => estudiante.id)).size !== estudiantes.length) {
        throw new Error('La lista de estudiantes cambió durante la carga. Vuelve a intentarlo.');
      }
    } while (estudiantes.length < total);
    return estudiantes
      .filter((estudiante) => estudiante.isActive)
      .map(({ id, firstName: nombres, lastName: apellidos }) => ({
        id,
        firstName: nombres,
        lastName: apellidos,
      }));
  },
  listarcursos: async () => {
    const cursos: Awaited<ReturnType<typeof academicoapi.listarcursos>>['data'] = [];
    let total = 0;
    do {
      const respuesta = await academicoapi.listarcursos(undefined, cursos.length);
      total = Math.max(total, respuesta.total);
      if (respuesta.data.length === 0 && cursos.length < total) {
        throw new Error('No se pudo cargar la lista completa de cursos. Vuelve a intentarlo.');
      }
      cursos.push(...respuesta.data);
      if (new Set(cursos.map((curso) => curso.id)).size !== cursos.length) {
        throw new Error('La lista de cursos cambió durante la carga. Vuelve a intentarlo.');
      }
    } while (cursos.length < total);
    return cursos.map(({ id, name: nombre }) => ({ id, name: nombre }));
  },
  registroasistencia: async (entrada) => {
    await academicoapi.crearasistencia(entrada);
  },
};

export const instanciagestionasistencia = new gestionasistencia(puerto);
