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
    try {
      const respuesta = await academicoapi.listarcursos();
      return respuesta.data ?? [];
    } catch {
      try {
        const respuestaCruda = await clienteapi.get('/courses', { params: { limit: 100 } });
        const items = respuestaCruda.data?.data ?? respuestaCruda.data ?? [];
        return Array.isArray(items) ? items : [];
      } catch {
        return [];
      }
    }
  },
  listarmaterias: (cursoId) => academicoapi.listarmaterias(undefined, cursoId),
  prepararnotas: async (parametros) => {
    const respuesta = await clienteapi.get('/sie-sync/assistant/grades', {
      params: parametros,
    });
    return notaspreparadasesquema.parse(respuesta.data).data;
  },
};

