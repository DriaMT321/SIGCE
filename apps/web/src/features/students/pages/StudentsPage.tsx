import React from 'react';
import { Users, Plus } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
            <Users className="w-6 h-6 text-[#F37022]" />
            Gestión de Estudiantes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Registro, actualización de datos personales, RUDE y vinculación con tutores.
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] hover:brightness-105 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#B91329]/25 hover:shadow-lg hover:shadow-[#B91329]/30 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Registrar Estudiante</span>
        </button>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs bg-white">
        <p className="text-slate-700 text-sm font-medium">
          Módulo preparado con Clean Architecture en backend y React Hook Form + Zod en frontend.
        </p>
        <p className="text-xs text-[#B91329] font-mono font-semibold">
          Entidades vinculadas: Student, Parent, StudentParent, Enrollment
        </p>
      </div>
    </div>
  );
};


