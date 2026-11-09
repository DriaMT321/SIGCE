import { academicoapi } from '../../../lib/apiacademica';
import { clienteapi } from '../../../lib/clienteapi';
import {
  notaspreparadasesquema,
  type gestionasistentesie,
} from '../application/gestionasistentesie';

export const adaptadorasistentesie: gestionasistentesie = {
  listargestiones: () => academicoapi.listaracademicogestiones(),
  listarperiodos: (gestionId) => academicoapi.listarperiodos(gestionId),
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data ?? [];
  },
  listarmaterias: (cursoId) => academicoapi.listarmaterias(undefined, cursoId),
  prepararnotas: async (parametros) => {
    const respuesta = await clienteapi.get('/sie-sync/assistant/grades', {
      params: parametros,
    });
    return notaspreparadasesquema.parse(respuesta.data).data;
  },
};
