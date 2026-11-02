import { academicoapi } from '../../../lib/apiacademica';
import { gestionusuario, type puertogestionusuario } from '../application/gestionusuarios';

const puerto: puertogestionusuario = {
  listarusuarios: async (entrada) => {
    const respuesta = await academicoapi.listarusuarios(entrada);
    return { total: respuesta.total, data: respuesta.data };
  },
  crearusuario: async (entrada) => {
    if (entrada.role === 'TEACHER') {
      await academicoapi.creardocente({
        email: entrada.email,
        password: entrada.password,
        ci: entrada.ci,
        firstName: entrada.firstName,
        lastName: entrada.lastName,
        specialty: entrada.specialty,
        phone: entrada.phone,
        itemNumber: entrada.itemNumber,
      });
      return;
    }
    if (entrada.role === 'PARENT') {
      await academicoapi.crearfamiliar({
        email: entrada.email,
        password: entrada.password,
        ci: entrada.ci,
        firstName: entrada.firstName,
        lastName: entrada.lastName,
        phone: entrada.phone,
        address: entrada.address,
        occupation: entrada.occupation,
      });
      return;
    }
    await academicoapi.crearusuario({
      email: entrada.email,
      password: entrada.password,
      firstName: entrada.firstName,
      lastName: entrada.lastName,
      role: 'SECRETARY',
    });
  },
  establecerusuarioactivo: async (idusuario, estaactivo) => {
    await academicoapi.actualizarusuario(idusuario, { isActive: estaactivo });
  },
  restablecercontrasena: async (idusuario, contrasena) => {
    await academicoapi.restablecerusuariocontrasena(idusuario, contrasena);
  },
};

export const instanciagestionusuarios = new gestionusuario(puerto);
