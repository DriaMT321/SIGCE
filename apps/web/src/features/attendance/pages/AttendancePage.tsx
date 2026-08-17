import React from 'react';
import { CalendarCheck } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
          <CalendarCheck className="w-6 h-6 text-emerald-600" />
          Control de Asistencia Estudiantil
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Registro diario de presencia, atrasos, faltas y justificaciones.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs bg-white">
        <p className="text-slate-700 text-sm font-medium">
          Módulo preparado para vincularse con notificaciones automáticas para padres y tutores.
        </p>
        <p className="text-xs text-[#B91329] font-mono font-semibold">
          Integrado con WebSockets y notificaciones push locales
        </p>
      </div>
    </div>
  );
};


