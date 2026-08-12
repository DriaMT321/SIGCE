import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
          Reportes y Actas de Calificación
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generación de boletines, actas trimestrales y resúmenes de centralización.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <p className="text-slate-400 text-sm">
          Módulo de reportería académica preparado para exportación de centralizadores.
        </p>
      </div>
    </div>
  );
};
