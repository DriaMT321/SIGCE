import { academicoapi } from '../../../lib/apiacademica';
import { gestioninscripcion, type puertogestioninscripcion } from '../application/gestionmatricula';

const puerto: puertogestioninscripcion = {
  listarinscripciones: async () => (await academicoapi.listarinscripciones()).data,
  listarestudiantes: async () => {
    const respuesta = await academicoapi.listarestudiantes();
    return respuesta.data.map(({ id, firstName: nombres, lastName: apellidos }) => ({
      id,
      firstName: nombres,
      lastName: apellidos,
    }));
  },
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data.map(({ id, name: nombre }) => ({ id, name: nombre }));
  },
  listaracademicogestiones: () => academicoapi.listaracademicogestiones(),
  crearinscripcion: async (entrada) => {
    await academicoapi.crearinscripcion(entrada);
  },
  actualizarestado: async (inscripcionid, estado) => {
    await academicoapi.actualizarinscripcion(inscripcionid, { status: estado });
  },
  actualizarestadomultiple: (inscripcionids, estado) =>
    academicoapi.actualizarestadomultipleinscripcion(inscripcionids, estado),
};

export const instanciagestioninscripciones = new gestioninscripcion(puerto);
