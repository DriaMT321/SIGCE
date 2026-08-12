import React from 'react';
import { History, Shield } from 'lucide-react';

export const AuditPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <History className="w-6 h-6 text-indigo-400" />
          Bitácora de Auditoría del Sistema
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Trazabilidad inmutable de todas las operaciones sensibles: cambios de notas, asistencia y sincronizaciones SIE.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
          <Shield className="w-6 h-6" />
        </div>
        <p className="text-slate-300 text-sm font-semibold">
          Auditoría a Nivel de Capa de Aplicación
        </p>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Registra automáticamente usuario, acción, entidad, valores previos, valores nuevos, dirección IP y estampilla de tiempo.
        </p>
      </div>
    </div>
  );
};
