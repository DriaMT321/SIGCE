import { academicoapi } from '../../../lib/apiacademica';
import { gestioncomunidad, type puertogestioncomunidad } from '../application/gestioncomunidad';

const puerto: puertogestioncomunidad = {
  listardocentes: async (buscar) => {
    const respuesta = await academicoapi.listardocentes(buscar);
    return {
      total: respuesta.total,
      data: respuesta.data.map(
        ({
          id,
          email: correo,
          firstName: nombres,
          lastName: apellidos,
          specialty: especialidad,
          teacherAssignments: asignacionesdocente,
          phone: telefono,
          itemNumber: elementonumero,
        }) => ({
          id,
          email: correo,
          firstName: nombres,
          lastName: apellidos,
          specialty: especialidad,
          teacherAssignments: asignacionesdocente,
          phone: telefono,
          itemNumber: elementonumero,
        }),
      ),
    };
  },
  listarfamiliares: async (buscar, limite) => {
    const respuesta = await academicoapi.listarfamiliares(buscar, limite);
    return {
      total: respuesta.total,
      data: respuesta.data.map(
        ({
          id,
          ci,
          firstName: nombres,
          lastName: apellidos,
          phone: telefono,
          address: direccion,
          occupation: ocupacion,
          students: estudiantes,
        }) => ({
          id,
          ci,
          firstName: nombres,
          lastName: apellidos,
          phone: telefono,
          address: direccion,
          occupation: ocupacion,
          students: estudiantes.map(
            ({ id, rude, firstName: estudianteprimernombre, lastName: estudianteultimonombre, relationship }) => ({
              id,
              rude,
              firstName: estudianteprimernombre,
              lastName: estudianteultimonombre,
              relationship,
            }),
          ),
        }),
      ),
    };
  },
  creardocente: async (entrada) => {
    await academicoapi.creardocente(entrada);
  },
  crearfamiliar: async (entrada) => {
    const familiar = await academicoapi.crearfamiliar(entrada);
    return {
      id: familiar.id,
      ci: familiar.ci,
      firstName: familiar.firstName,
      lastName: familiar.lastName,
      phone: familiar.phone,
      address: familiar.address,
      occupation: familiar.occupation,
      students: familiar.students,
    };
  },
  actualizardocente: async (id, entrada) => {
    await academicoapi.actualizardocente(id, entrada);
  },
  actualizarfamiliar: async (id, entrada) => {
    await academicoapi.actualizarfamiliar(id, entrada);
  },
  eliminardocente: async (id) => {
    await academicoapi.eliminardocente(id);
  },
  eliminarfamiliar: async (id) => {
    await academicoapi.eliminarfamiliar(id);
  },
  listarmaterias: async () => {
    return academicoapi.listarmaterias();
  },
  listarestudiantes: async (buscar, limite) => {
    const respuesta = await academicoapi.listarestudiantes(buscar, limite);
    return respuesta.data;
  },
  vincularestudiantefamiliar: async (studentId, payload) => {
    await academicoapi.vincularestudiantefamiliar(studentId, payload as any);
  },
  actualizarvinculofamiliar: async (parentId, studentId, relationship) => {
    const familiar = await academicoapi.actualizarvinculofamiliar(parentId, studentId, relationship as any);
    return {
      id: familiar.id,
      ci: familiar.ci,
      firstName: familiar.firstName,
      lastName: familiar.lastName,
      phone: familiar.phone,
      address: familiar.address,
      occupation: familiar.occupation,
      students: familiar.students,
    };
  },
  eliminarvinculofamiliar: async (parentId, studentId) => {
    const familiar = await academicoapi.eliminarvinculofamiliar(parentId, studentId);
    return {
      id: familiar.id,
      ci: familiar.ci,
      firstName: familiar.firstName,
      lastName: familiar.lastName,
      phone: familiar.phone,
      address: familiar.address,
      occupation: familiar.occupation,
      students: familiar.students,
    };
  },
  listaracademicogestiones: async () => {
    return academicoapi.listaracademicogestiones();
  },
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data;
  },
  reemplazarmateriasdocente: async (payload) => {
    const respuesta = await academicoapi.reemplazarmateriasdocente(payload);
    return {
      added: respuesta.data.added,
      removed: respuesta.data.removed,
      assignments: respuesta.data.assignments.map((asignacion) => ({
        id: asignacion.id,
        courseId: asignacion.courseId,
        subjectId: asignacion.subjectId,
        weeklyPeriods: asignacion.weeklyPeriods,
        courseName: asignacion.course.name,
        courseGradeLevel: asignacion.course.gradeLevel,
        courseSection: asignacion.course.section,
        gradeLevel: asignacion.course.gradeLevel,
        section: asignacion.course.section,
        subjectCode: asignacion.subject.code,
        subjectName: asignacion.subject.name,
        academicYear: asignacion.academicYear.year,
      })),
    };
  },
};

export const instanciagestioncomunidad = new gestioncomunidad(puerto);
