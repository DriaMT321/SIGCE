import React, { Suspense } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Barranavegacion } from './barradenavegacion';
import { Barralateral } from './barralateral';
import { gestionusoautenticacion } from '../../features/auth/presentation/contextodeautenticacion';
import { usotema } from '../../lib/tema';
import { RutaCarga } from '../feedback/indicadordecarga';

export const TableroDisposicion: React.FC = () => {
  const autenticacion = gestionusoautenticacion();
  const esautenticacion = autenticacion.esautenticado();
  const actualrol = autenticacion.obtenerusuarioactual()?.role;
  const { pathname: rutapagina } = useLocation();
  const { isInstitutional: esinstitucional } = usotema();

  if (!esautenticacion) {
    return <Navigate to="/login" replace />;
  }

  if (
    actualrol === 'STUDENT' &&
    ![
      '/dashboard/schedules',
      '/dashboard/assignments',
      '/dashboard/grades',
      '/dashboard/attendance',
      '/dashboard/announcements',
      '/dashboard/alerts',
    ].includes(rutapagina)
  ) {
    return <Navigate to="/dashboard/schedules" replace />;
  }

  return (
    <div className="sigce-shell flex h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 overflow-hidden flex-col">
      {/* Signature institutional gradient ribbon from school palette */}
      {esinstitucional && (
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#ffc54c] via-[#f37022] to-[#b91329] z-30" />
      )}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Barralateral />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Barranavegacion />
          <main className="sigce-main flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f8fafc] dark:bg-[#0b0f19]">
            <div className="max-w-7xl mx-auto space-y-6">
              <Suspense fallback={<RutaCarga />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
