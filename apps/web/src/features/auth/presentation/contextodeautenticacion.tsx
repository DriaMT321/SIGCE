import { createContext, useContext, type ReactNode } from 'react';
import type { gestionautenticacion } from '../application/gestionautenticacion';

const autenticacioncontexto = createContext<gestionautenticacion | null>(null);

export function AutenticacionContextoProveedor({
  management: gestion,
  children: hijos,
}: {
  management: gestionautenticacion;
  children: ReactNode;
}) {
  return <autenticacioncontexto.Provider value={gestion}>{hijos}</autenticacioncontexto.Provider>;
}

export function gestionusoautenticacion() {
  const gestion = useContext(autenticacioncontexto);
  if (!gestion) throw new Error('AuthContextProvider is missing from the application tree.');
  return gestion;
}
