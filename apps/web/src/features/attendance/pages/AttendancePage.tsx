import React from 'react';
import { CalendarCheck } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <CalendarCheck className="w-6 h-6 text-indigo-400" />
          Control de Asistencia Estudiantil
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Registro diario de presencia, atrasos, faltas y justificaciones.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <p className="text-slate-400 text-sm">
          Módulo preparado para vincularse con notificaciones automáticas para padres y tutores.
        </p>
      </div>
    </div>
  );
};
