import type { ReactNode } from 'react';
import { instanciagestionautenticacion } from '../../features/auth/infrastructure/adaptadorgestionautenticacion';
import { AutenticacionContextoProveedor } from '../../features/auth/presentation/contextodeautenticacion';

export function AutenticacionProveedor({ children: hijos }: { children: ReactNode }) {
  return (
    <AutenticacionContextoProveedor management={instanciagestionautenticacion}>
      {hijos}
    </AutenticacionContextoProveedor>
  );
}
