import type { ReactNode } from 'react';
import { instanciagestionalertas } from '../../features/alerts/infrastructure/adaptadorgestionalertas';
import { AlertasContextoProveedor } from '../../features/alerts/presentation/contextodealertas';

export function AlertasProveedor({ children: hijos }: { children: ReactNode }) {
  return (
    <AlertasContextoProveedor management={instanciagestionalertas}>
      {hijos}
    </AlertasContextoProveedor>
  );
}

