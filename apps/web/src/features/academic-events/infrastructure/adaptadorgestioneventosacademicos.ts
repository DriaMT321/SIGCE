import { academicoapi } from '../../../lib/apiacademica';
import {
  gestioneventosacademicos,
  type puertogestioneventosacademicos,
} from '../application/gestioneventosacademicos';

const puerto: puertogestioneventosacademicos = {
  listar: async (desde, hasta) => academicoapi.listareventosacademicos(desde, hasta),
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data.map(({ id, name, gradeLevel, section, shift }) => ({
      id,
      name,
      gradeLevel,
      section,
      shift,
    }));
  },
  crear: async (datos) => academicoapi.creareventoacademico(datos),
  actualizar: async (id, datos) => academicoapi.actualizareventoacademico(id, datos),
  cancelar: async (id) => academicoapi.cancelareventoacademico(id),
};

export const instanciagestioneventosacademicos = new gestioneventosacademicos(puerto);

