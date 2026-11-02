import { academicoapi } from '../../../lib/apiacademica';
import {
  consultasauditoria,
  type auditoriaconsultaspuerto,
} from '../application/consultasauditoria';

const puerto: auditoriaconsultaspuerto = {
  listarauditoria: async (idestudiante) => {
    const respuesta = await academicoapi.listarauditoria({ studentId: idestudiante });
    return {
      total: respuesta.total,
      data: respuesta.data.map((registrar) => ({
        ...registrar,
        previousValue: registrar.previousValue ?? null,
        newValue: registrar.newValue ?? null,
      })),
    };
  },
  listarestudianteopciones: async () => {
    const respuesta = await academicoapi.listarestudiantes(undefined, 1000);
    return respuesta.data.map(({ id, rude, firstName: nombres, lastName: apellidos }) => ({
      id,
      rude,
      firstName: nombres,
      lastName: apellidos,
    }));
  },
};

export const auditoriaconsultas = new consultasauditoria(puerto);
