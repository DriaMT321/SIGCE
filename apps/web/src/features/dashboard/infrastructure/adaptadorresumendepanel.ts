import { academicoapi } from '../../../lib/apiacademica';
import { tableroresumen, type tableroresumenpuerto } from '../application/resumendepanel';

const puerto: tableroresumenpuerto = {
  cantidadestudiantes: async () => (await academicoapi.listarestudiantes('', 1)).total,
  cantidadcursos: async () => (await academicoapi.listarcursos()).total,
  cantidaddocentes: async () => (await academicoapi.listardocentes()).total,
  cantidadasignaciones: async () => (await academicoapi.listarasignaciones()).total,
  obtenercurriculoresumen: async () => (await academicoapi.obtenercurriculoestadisticas()).data,
  obtenercursos: async () => (await academicoapi.listarcursos()).data,
};

export const instanciaresumentablero = new tableroresumen(puerto);
