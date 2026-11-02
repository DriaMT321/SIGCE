import { autenticacionservicio } from '../services/serviciodeautenticacion';
import {
  gestionautenticacion,
  type puertogestionautenticacion,
} from '../application/gestionautenticacion';

const puerto: puertogestionautenticacion = {
  activarestudiantecuenta: (entrada) => autenticacionservicio.activarestudiantecuenta(entrada),
  inicializar: () => autenticacionservicio.inicializar(),
  sesion: (credenciales) => autenticacionservicio.sesion(credenciales),
  esautenticado: () => autenticacionservicio.esautenticado(),
  obtenerusuarioactual: () => autenticacionservicio.obtenerusuarioactual(),
  cerrarsesion: () => autenticacionservicio.cerrarsesion(),
};

export const instanciagestionautenticacion = new gestionautenticacion(puerto);
