import { academicoapi } from '../../../lib/apiacademica';
import { gestionestudiante, type puertogestionestudiante } from '../application/gestionestudiantes';

const puerto: puertogestionestudiante = {
  buscarcoincidencias: (entrada) => academicoapi.buscarcoincidenciasestudiante(entrada),
  listarcursos: async () => (await academicoapi.listarcursos()).data,
  listarestudiantes: ({ search: buscar, courseId: cursoid, limit: limite, offset: desplazamiento }) =>
    academicoapi.listarestudiantes(buscar, limite, desplazamiento, cursoid),
  listarfamiliares: (limite) => academicoapi.listarfamiliares(undefined, limite),
  listarestudiantedocumentoreferencias: (idestudiante) =>
    academicoapi.listarestudiantedocumentoreferencias(idestudiante),
  listarestudiantehistorial: async (idestudiante) => {
    const respuesta = await academicoapi.listarauditoria({ studentId: idestudiante });
    return respuesta.data;
  },
  crearestudiante: (entrada) => academicoapi.crearestudiante(entrada),
  actualizarci: async (idestudiante, ci) => {
    await academicoapi.actualizarestudiante(idestudiante, { ci });
  },
  reemisionestudianteactivacion: (idestudiante) =>
    academicoapi.reemisionestudianteactivacion(idestudiante),
  crearestudiantedocumentoreferencia: (idestudiante, entrada) =>
    academicoapi.crearestudiantedocumentoreferencia(idestudiante, entrada),
  eliminarestudiante: async (idestudiante) => {
    await academicoapi.eliminarestudiante(idestudiante);
  },
};

export const instanciagestionestudiantes = new gestionestudiante(puerto);
