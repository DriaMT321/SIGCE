import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
          <FileSpreadsheet className="w-6 h-6 text-[#F8C311]" />
          Reportes y Actas de Calificación
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Generación de boletines, actas trimestrales y resúmenes de centralización.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs bg-white">
        <p className="text-slate-700 text-sm font-medium">
          Módulo de reportería académica preparado para exportación de centralizadores.
        </p>
        <p className="text-xs text-[#B91329] font-mono font-semibold">
          Formatos compatibles con requerimientos del Ministerio de Educación
        </p>
      </div>
    </div>
  );
};


