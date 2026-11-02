import { createContext, useContext, type ReactNode } from 'react';
import type { gestionalertas } from '../application/gestionalertas';

const alertascontexto = createContext<gestionalertas | null>(null);

export function AlertasContextoProveedor({
  management: gestion,
  children: hijos,
}: {
  management: gestionalertas;
  children: ReactNode;
}) {
  return <alertascontexto.Provider value={gestion}>{hijos}</alertascontexto.Provider>;
}

export function gestionusoalertas(): gestionalertas | null {
  return useContext(alertascontexto);
}

