import { academicoapi } from '../../../lib/apiacademica';
import { gestionalertas, type puertogestionalertas } from '../application/gestionalertas';

const puerto: puertogestionalertas = {
  listaralertas: async () => (await academicoapi.listaralertas()).data,
  marcaralertaleer: (alertaid) => academicoapi.marcaralertaleer(alertaid),
  actualizaralertaestado: (alertaid, estado) =>
    academicoapi.actualizaralertaestado(alertaid, estado),
  listarreglas: () => academicoapi.listaralertareglas(),
  actualizarregla: (clave, entrada) => academicoapi.actualizaralertaregla(clave, entrada),
  evaluarexistentealertas: () => academicoapi.evaluartodosestudiantealertas(),
};

export const instanciagestionalertas = new gestionalertas(puerto);
