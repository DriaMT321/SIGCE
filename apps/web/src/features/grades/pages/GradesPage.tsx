import React from 'react';
import { Award } from 'lucide-react';

export const GradesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
          <Award className="w-6 h-6 text-[#F8C311]" />
          Registro y Centralización de Calificaciones
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Control de notas por período trimestral, cálculo de promedios y disparador de sincronización SIE.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs bg-white">
        <p className="text-slate-700 text-sm font-medium">
          Cada modificación de calificación emite un evento de dominio y un registro en AuditLog.
        </p>
        <p className="text-xs text-[#B91329] font-mono font-semibold">
          Verificación automática de inconsistencias antes de consolidar en SIE
        </p>
      </div>
    </div>
  );
};


