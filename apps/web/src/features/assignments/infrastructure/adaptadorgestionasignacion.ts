import { academicoapi } from '../../../lib/apiacademica';
import { gestionasignacion, type puertogestionasignacion } from '../application/gestionasignacion';

const puerto: puertogestionasignacion = {
  listarasignaciones: async () => (await academicoapi.listarasignaciones()).data,
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
};

export const instanciagestionasignaciones = new gestionasignacion(puerto);
