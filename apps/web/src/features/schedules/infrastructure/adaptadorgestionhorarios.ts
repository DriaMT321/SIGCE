import { academicoapi } from '../../../lib/apiacademica';
import {
  gestionhorario,
  type myhorario,
  type horariocursoopcion,
  type puertogestionhorario,
} from '../application/gestionhorarios';

const mapacurso = (curso: {
  id: string;
  name: string;
  gradeLevel: number;
  section: string;
  shift: string;
}): horariocursoopcion => ({
  id: curso.id,
  name: curso.name,
  gradeLevel: curso.gradeLevel,
  section: curso.section,
  shift: curso.shift,
});

const puerto: puertogestionhorario = {
  obtenermyhorario: async () => {
    const { data: datos } = await academicoapi.obtenermyhorario();
    return {
      type: datos.type,
      student: datos.student,
      course: datos.course ? mapacurso(datos.course) : datos.course,
      schedules: datos.schedules,
      children: datos.children?.map((hijo) => ({
        student: hijo.student,
        course: hijo.course ? mapacurso(hijo.course) : null,
        schedules: hijo.schedules,
      })),
    } satisfies myhorario;
  },
  listarcursos: async () => (await academicoapi.listarcursos()).data.map(mapacurso),
  listardocentes: async () => {
    const respuesta = await academicoapi.listardocentes();
    return respuesta.data.map(
      ({ id, userId, firstName: nombres, lastName: apellidos, specialty: especialidad }) => ({
        id,
        userId,
        firstName: nombres,
        lastName: apellidos,
        specialty: especialidad,
      }),
    );
  },
  listarmaterias: () => academicoapi.listarmaterias(),
  obtenercursohorario: async (cursoid) => {
    const { data: datos } = await academicoapi.obtenercursohorario(cursoid);
    return {
      course: mapacurso(datos.course),
      schedules: datos.schedules,
      teacherSubjects: datos.teacherSubjects as Awaited<ReturnType<puertogestionhorario['obtenercursohorario']>>['teacherSubjects'],
    };
  },
  obtenerdocentehorario: async (docenteid) => {
    const { data: datos } = await academicoapi.obtenerdocentehorario(docenteid);
    return { schedules: datos.schedules };
  },
  actualizarocrearhorario: async (entrada) => {
    await academicoapi.actualizarocrearhorario(entrada);
  },
  eliminarhorario: async (horarioid) => {
    await academicoapi.eliminarhorario(horarioid);
  },
  generarautomaticohorario: async (cursoid) =>
    (await academicoapi.generarautomaticohorario(cursoid)).data,
  asignarmateriasdocente: async (entrada) =>
    (await academicoapi.asignarmateriasdocente(entrada)).data.created,
};

export const instanciagestionhorarios = new gestionhorario(puerto);
