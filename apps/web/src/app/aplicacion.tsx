import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { enrutador } from './enrutador';
import { AplicacionProveedores } from './proveedores';
import { AutenticacionProveedor } from './composition/proveedordeautenticacion';
import { AlertasProveedor } from './composition/proveedordealertas';
import { instanciagestionautenticacion } from '../features/auth/infrastructure/adaptadorgestionautenticacion';

export const Aplicacion: React.FC = () => {
  const [sesionlista, establecersesionlista] = useState(false);

  useEffect(() => {
    void instanciagestionautenticacion.inicializar().finally(() => establecersesionlista(true));
  }, []);

  if (!sesionlista) {
    return (
      <main className="grid min-h-screen place-items-center text-sm text-slate-600">
        Restaurando sesión segura…
      </main>
    );
  }

  return (
    <AutenticacionProveedor>
      <AlertasProveedor>
        <AplicacionProveedores>
          <RouterProvider router={enrutador} />
        </AplicacionProveedores>
      </AlertasProveedor>
    </AutenticacionProveedor>
  );
};
