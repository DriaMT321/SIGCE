import { academicoapi } from '../../../lib/apiacademica';
import { cursocatalogo, type cursocatalogopuerto } from '../application/catalogodecursos';

const puerto: cursocatalogopuerto = {
  listarcursos: (buscar) => academicoapi.listarcursos(buscar),
  listaracademicogestiones: () => academicoapi.listaracademicogestiones(),
  crearacademicogestion: (entrada) => academicoapi.crearanioacademico(entrada),
  crearcurso: (entrada) => academicoapi.crearcurso(entrada),
};

export const catalogocursos = new cursocatalogo(puerto);
