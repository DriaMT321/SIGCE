import { academicoapi } from '../../../lib/apiacademica';
import {
  gestionasignacion,
  type puertogestionasignacion,
  type asignacionregistro,
  type asignaciontipo,
  type asignacionestado,
} from '../application/gestionasignacion';

const puerto: puertogestionasignacion = {
  listarasignaciones: async () => {
    const res = await academicoapi.listarasignaciones();
    return res.data.map((item) => ({
      ...item,
      type: item.type as asignaciontipo,
      status: item.status as asignacionestado,
      submission: item.submission
        ? {
            id: item.submission.id,
            score: item.submission.score,
            feedback: item.submission.feedback ?? null,
            status: item.submission.status,
            gradedAt: item.submission.gradedAt ?? null,
          }
        : undefined,
    })) as asignacionregistro[];
  },
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data.map(({ id, name: nombre, shift: turno, gradeLevel, section }) => ({
      id,
      name: nombre,
      shift: turno,
      gradeLevel,
      section,
    }));
  },
  listarmaterias: () => academicoapi.listarmaterias(),
  crearasignacion: async (entrada) => {
    await academicoapi.crearasignacion(entrada);
  },
  actualizarestado: async (id, estado) => {
    await academicoapi.actualizarasignacion(id, { status: estado });
  },
  eliminarasignacion: async (id) => {
    await academicoapi.eliminarasignacion(id);
  },
  obtenerplanilla: async (assignmentId: string) => {
    const res = await academicoapi.obtenersubmissionsasignacion(assignmentId);
    return res;
  },
  guardarcalificaciones: async (assignmentId: string, calificaciones) => {
    await academicoapi.guardarcalificacionesasignacion(assignmentId, calificaciones);
  },
};

export const instanciagestionasignaciones = new gestionasignacion(puerto);
