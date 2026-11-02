import { academicoapi } from '../../../lib/apiacademica';
import { informeconsultas, type informeconsultaspuerto } from '../application/consultasdeinformes';

const puerto: informeconsultaspuerto = {
  listarcursos: (desplazamiento) => academicoapi.listarcursos(undefined, desplazamiento),
  listarestudiantes: (desplazamiento) => academicoapi.listarestudiantes('', 1000, desplazamiento),
  listarperiodos: () => academicoapi.listarperiodos(),
  listarmaterias: () => academicoapi.listarmaterias(),
  listarcalificaciones: ({
    offset: desplazamiento,
    courseId: cursoid,
    enrollmentId: inscripcionid,
    periodId: periodoid,
    studentId: idestudiante,
  }) =>
    academicoapi.listarcalificaciones({
      offset: desplazamiento,
      courseId: cursoid,
      enrollmentId: inscripcionid,
      periodId: periodoid,
      studentId: idestudiante,
    }),
  listarasistencia: ({ courseId: cursoid, offset: desplazamiento }) =>
    academicoapi.listarasistencia({ courseId: cursoid, offset: desplazamiento }),
};

export const consultasinformes = new informeconsultas(puerto);
