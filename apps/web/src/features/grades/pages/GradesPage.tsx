import React from 'react';
import { Award } from 'lucide-react';

export const GradesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Award className="w-6 h-6 text-indigo-400" />
          Registro y Centralización de Calificaciones
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Control de notas por período trimestral, cálculo de promedios y disparador de sincronización SIE.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <p className="text-slate-400 text-sm">
          Cada modificación de calificación emite un evento de dominio y un registro en AuditLog.
        </p>
      </div>
    </div>
  );
};
