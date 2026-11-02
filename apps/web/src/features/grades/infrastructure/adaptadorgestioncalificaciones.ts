import { academicoapi } from '../../../lib/apiacademica';
import {
  gestioncalificacion,
  type puertogestioncalificacion,
} from '../application/gestioncalificaciones';

const puerto: puertogestioncalificacion = {
  listarcalificaciones: async () => (await academicoapi.listarcalificaciones()).data,
  buscarcalificaciones: (filtros) => academicoapi.listarcalificaciones({ ...filtros, limit: 200 }),
  listarestudiantes: async () => {
    const estudiantes: Awaited<ReturnType<typeof academicoapi.listarestudiantes>>['data'] = [];
    const ids = new Set<string>();
    let total = 0;
    do {
      const pagina = await academicoapi.listarestudiantes(undefined, 200, estudiantes.length);
      total = Math.max(total, pagina.total);
      if (!pagina.data.length && estudiantes.length < total) {
        throw new Error('No se pudieron cargar todos los estudiantes. Vuelve a intentarlo.');
      }
      for (const estudiante of pagina.data) {
        if (ids.has(estudiante.id)) {
          throw new Error('La lista de estudiantes cambió durante la carga. Vuelve a intentarlo.');
        }
        ids.add(estudiante.id);
        estudiantes.push(estudiante);
      }
    } while (estudiantes.length < total);
    return estudiantes.map(
      ({ id, rude, ci, firstName: nombres, lastName: apellidos, enrollments: inscripciones }) => ({
        id,
        rude,
        ci,
        firstName: nombres,
        lastName: apellidos,
        enrollments: inscripciones.map(
          ({
            id: inscripcionid,
            status: estado,
            course: curso,
            academicYear: academicogestion,
          }) => ({
            id: inscripcionid,
            status: estado,
            course: { id: curso.id, name: curso.name, gradeLevel: curso.gradeLevel },
            academicYear: { id: academicogestion.id, year: academicogestion.year },
          }),
        ),
      }),
    );
  },
  listarcursos: async () => (await academicoapi.listarcursos()).data,
  listarmaterias: (courseId) => academicoapi.listarmaterias(undefined, courseId),
  listarperiodos: () => academicoapi.listarperiodos(),
  crearcalificacion: async (entrada) => {
    await academicoapi.crearcalificacion(entrada);
  },
  crearmasivocalificaciones: async (entrada) =>
    (await academicoapi.crearmasivocalificaciones(entrada)).data,
  publicarcalificaciones: async (entrada) => {
    const respuesta = await academicoapi.publicarcalificaciones(entrada);
    return respuesta.data;
  },
  crearperiodo: async (entrada) => {
    const nuevo = await academicoapi.crearperiodo(entrada);
    return {
      id: nuevo.id,
      name: nuevo.name,
      number: nuevo.number,
      academicYearId: nuevo.academicYearId,
      isClosed: nuevo.isClosed,
    };
  },
  actualizarperiodo: async ({
    id,
    isClosed: escerrado,
    expectedGradeCount: esperadocalificacioncantidad,
  }) => {
    await academicoapi.actualizarperiodo(
      id,
      escerrado
        ? { isClosed: true, confirmClose: true, expectedGradeCount: esperadocalificacioncantidad }
        : { isClosed: false },
    );
  },
  obtenerperiodocierrevistaprevia: (periodoid) =>
    academicoapi.obtenerperiodocierrevistaprevia(periodoid),
  listarpendientecorrecciones: async () =>
    (await academicoapi.listarcalificacioncorrecciones({ status: 'PENDING', limit: 100 })).data,
  enviarcorreccion: async ({
    gradeId: calificacionid,
    proposedValue: valorpropuesto,
    reason: motivo,
    evidenceReference: referenciaevidencia,
  }) => {
    await academicoapi.enviarcalificacioncorreccion({
      gradeId: calificacionid,
      proposedValue: valorpropuesto,
      reason: motivo,
      evidenceReference: referenciaevidencia,
    });
  },
  decidircorreccion: async ({ id, approve: aprobar, decisionReason: motivodecision }) => {
    await academicoapi.decidircalificacioncorreccion(id, {
      approve: aprobar,
      decisionReason: motivodecision,
    });
  },
};

export const instanciagestioncalificaciones = new gestioncalificacion(puerto);
