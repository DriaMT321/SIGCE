import { academicoapi } from '../../../lib/apiacademica';
import { clienteapi } from '../../../lib/clienteapi';
import { obtenersocket } from '../../../lib/conexiontiemporeal';
import {
  sieauditoriarespuestadatosesquema,
  siesincronizacionestadoeventoesquema,
} from '../application/esquemasincronizacionsie';
import {
  gestionsiesincronizacion,
  type puertogestionsiesincronizacion,
} from '../application/gestionsincronizacionsie';

const puerto: puertogestionsiesincronizacion = {
  comprobaracceso: async (credenciales) => {
    const respuesta = await clienteapi.post('/sie-sync/check-login', credenciales);
    return respuesta.data.data;
  },
  comprobarreplicalocal: async (html) => {
    const respuesta = await clienteapi.post('/sie-sync/check-local', html ? { html } : {});
    return respuesta.data.data;
  },
  obtenerultimoauditoria: async () => {
    const respuesta = await clienteapi.get('/sie-sync/audit/latest');
    return sieauditoriarespuestadatosesquema.parse(respuesta.data?.data);
  },
  ejecutarauditoria: async (entrada) => {
    await clienteapi.post('/sie-sync/audit/execute', entrada);
  },
  listarsincronizaciones: async (filtros) =>
    (await academicoapi.listarsiesincronizaciones(filtros)).data,
  resolverdiscrepancia: async ({
    groupId: grupoid,
    itemId: elementoid,
    decision,
    reason: motivo,
  }) => {
    if (grupoid) {
      await academicoapi.resolversiediscrepanciagrupo(grupoid, { decision, reason: motivo });
      return;
    }
    if (!elementoid) throw new Error('Seleccione una discrepancia.');
    await academicoapi.resolversiediscrepancia(elementoid, { decision, reason: motivo });
  },
  reintentarelemento: async (elementoid, motivo) =>
    academicoapi.reintentarsiesincronizacionelemento(elementoid, { reason: motivo }),
  reanudarsincronizacion: async (id, motivo) =>
    academicoapi.reanudarsiesincronizacion(id, { reason: motivo }),
  suscribirseaestado: (manejador) => {
    const socket = obtenersocket();
    const eventonombres = [
      'sie.sync.queued',
      'sie.sync.started',
      'sie.sync.progress',
      'sie.sync.verified',
      'sie.sync.discrepancy',
      'sie.sync.authentication_required',
      'sie.sync.failed',
    ];
    const oyente = (crudodatos: unknown) => {
      const analizado = siesincronizacionestadoeventoesquema.safeParse(crudodatos);
      if (analizado.success) manejador(analizado.data);
    };
    eventonombres.forEach((eventonombre) => socket.on(eventonombre, oyente));
    return () => eventonombres.forEach((eventonombre) => socket.off(eventonombre, oyente));
  },
  listaracademicogestiones: async () =>
    (await academicoapi.listaracademicogestiones()).map(
      ({ id, year: gestion, name: nombre, isActive: estaactivo }) => ({
        id,
        year: gestion,
        name: nombre,
        isActive: estaactivo,
      }),
    ),
  listarperiodos: async (idgestionacademica) =>
    (await academicoapi.listarperiodos(idgestionacademica)).map(
      ({ id, name: nombre, number: numero, isClosed: escerrado }) => ({
        id,
        name: nombre,
        number: numero,
        isClosed: escerrado,
      }),
    ),
  listarcursos: async () =>
    (await academicoapi.listarcursos()).data.map(
      ({ id, name: nombre, academicYearId: idgestionacademica }) => ({
        id,
        name: nombre,
        academicYearId: idgestionacademica,
      }),
    ),
  listarmaterias: () => academicoapi.listarmaterias(),
  vistaprevia: (filtros) => academicoapi.vistapreviasiesincronizacion(filtros),
  encolar: (entrada) => academicoapi.disparadorsiesincronizacion(entrada),
};

export const instanciagestionsiesincronizacion = new gestionsiesincronizacion(puerto);
export const esrealsieauditoriahabilitado = import.meta.env.VITE_SIE_REAL_AUDIT_ENABLED !== 'false';
