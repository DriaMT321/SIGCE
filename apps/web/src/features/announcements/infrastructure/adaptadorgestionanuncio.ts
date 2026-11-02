import { academicoapi } from '../../../lib/apiacademica';
import { gestionanuncio, type puertogestionanuncio } from '../application/gestionanuncio';

const puerto: puertogestionanuncio = {
  listaranuncios: async () => (await academicoapi.listaranuncios()).data,
  listarcursos: async () => {
    const respuesta = await academicoapi.listarcursos();
    return respuesta.data.map(({ id, name: nombre }) => ({ id, name: nombre }));
  },
  listardocentes: async () => {
    const respuesta = await academicoapi.listardocentes();
    return respuesta.data.map(
      ({
        id,
        firstName: nombres,
        lastName: apellidos,
        specialty: especialidad,
        itemNumber: elementonumero,
      }) => ({
        id,
        firstName: nombres,
        lastName: apellidos,
        specialty: especialidad,
        itemNumber: elementonumero,
      }),
    );
  },
  listarfamiliares: async () => {
    const respuesta = await academicoapi.listarfamiliares(undefined, 300);
    return respuesta.data.map(
      ({
        id,
        firstName: nombres,
        lastName: apellidos,
        ci,
        phone: telefono,
        students: estudiantes,
      }) => ({
        id,
        firstName: nombres,
        lastName: apellidos,
        ci,
        phone: telefono,
        students: estudiantes.map(
          ({ firstName: estudianteprimernombre, lastName: estudianteultimonombre }) => ({
            firstName: estudianteprimernombre,
            lastName: estudianteultimonombre,
          }),
        ),
      }),
    );
  },
  listarestudiantes: async () => {
    const respuesta = await academicoapi.listarestudiantes(undefined, 500);
    return respuesta.data.map(
      ({ id, rude, ci, firstName: nombres, lastName: apellidos, enrollments: inscripciones }) => ({
        id,
        rude,
        ci,
        firstName: nombres,
        lastName: apellidos,
        enrollments: inscripciones.map(({ course: curso }) => ({ course: { name: curso.name } })),
      }),
    );
  },
  crearanuncio: async (entrada) => {
    await academicoapi.crearanuncio(entrada);
  },
  eliminaranuncio: async (anuncioid) => {
    await academicoapi.eliminaranuncio(anuncioid);
  },
};

export const instanciagestionanuncios = new gestionanuncio(puerto);
