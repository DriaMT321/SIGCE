import { academicoapi } from '../../../lib/apiacademica';
import {
  curriculoplanificacion,
  type curriculoplanificacionpuerto,
} from '../application/planificacioncurricular';

const puerto: curriculoplanificacionpuerto = {
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data.map(({ id, name: nombre }) => ({ id, name: nombre }));
  },
  obtenerestadisticas: async () => (await academicoapi.obtenercurriculoestadisticas()).data,
  listarmaterias: () => academicoapi.listarmaterias(),
  crearmateria: (entrada) => academicoapi.crearmateria(entrada),
  listartemas: async (filtros) => (await academicoapi.listarcurriculo(filtros)).data,
  actualizaravance: async (temaid, entrada) => {
    await academicoapi.actualizarcurriculoavance(temaid, entrada);
  },
};

export const instanciaplanificacioncurricular = new curriculoplanificacion(puerto);
