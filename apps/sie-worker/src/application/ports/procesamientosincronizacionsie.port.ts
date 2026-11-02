import { estadosincronizacionsie } from '@academic/domain-kernel';
import {
  resultadoprocesamientosie,
  trabajoprocesamientosie,
} from '../modelos/sincronizacion.model';

export interface elementosincronizacionsiealmacenado {
  estado: estadosincronizacionsie;
  valorlocal: number;
  valorsie: number | null;
  mensajeerror: string | null;
  verificadoen: Date | null;
}

export interface guardarresultadosincronizacionsie {
  datostrabajo: trabajoprocesamientosie;
  tokenreclamo: string;
  resultado: resultadoprocesamientosie;
  falloreintentable: boolean;
  umbralpausadiscrepancias: number;
  plazorevisiondiscrepanciashoras: number;
}

export type resultadoreclamoelementosie =
  | { tipo: 'reclamado'; token: string }
  | { tipo: 'ocupado'; esperarmilisegundos: number }
  | { tipo: 'nodisponible' };

export const duracionarrendamientosie = 5 * 60 * 1000;
export const intervaloactualizacionarrendamientosie = 60 * 1000;

export interface puertoprocesamientosincronizacionsie {
  validardestinosincronizacion(
    idsincronizacion: string,
    destinotrabajador: resultadoprocesamientosie['source'],
  ): Promise<boolean>;
  obtenerestadosincronizacion(idsincronizacion: string): Promise<estadosincronizacionsie | null>;
  reclamarelemento(
    idsincronizacion: string,
    idelemento: string,
  ): Promise<resultadoreclamoelementosie>;
  renovarreclamoelemento(
    idsincronizacion: string,
    idelemento: string,
    token: string,
  ): Promise<boolean>;
  buscarelemento(idelemento: string): Promise<elementosincronizacionsiealmacenado | null>;
  marcarinicioyprocesamiento(idsincronizacion: string, fechainicio: Date): Promise<void>;
  devolverelementoalacola(idelemento: string, token: string, mensajeerror: string): Promise<void>;
  guardarresultado(entrada: guardarresultadosincronizacionsie): Promise<boolean>;
}
