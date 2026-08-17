import React from 'react';
import { History, Shield } from 'lucide-react';

export const AuditPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
          <History className="w-6 h-6 text-[#B91329]" />
          Bitácora de Auditoría del Sistema
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Trazabilidad inmutable de todas las operaciones sensibles: cambios de notas, asistencia y sincronizaciones SIE.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs bg-white">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-[#fff5eb] text-[#B91329] border border-orange-200 mb-2 shadow-2xs">
          <Shield className="w-6 h-6" />
        </div>
        <p className="text-slate-900 text-sm font-bold">
          Auditoría a Nivel de Capa de Aplicación
        </p>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed font-medium">
          Registra automáticamente usuario, acción, entidad, valores previos, valores nuevos, dirección IP y estampilla de tiempo inmutable.
        </p>
      </div>
    </div>
  );
};


