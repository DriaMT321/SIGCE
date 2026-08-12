import React from 'react';
import { Users, Plus } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            Gestión de Estudiantes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registro, actualización de datos personales, RUDE y vinculación con tutores.
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md">
          <Plus className="w-4 h-4" />
          <span>Registrar Estudiante</span>
        </button>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <p className="text-slate-400 text-sm">
          Módulo preparado con Clean Architecture en backend y React Hook Form + Zod en frontend.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Entidades vinculadas: Student, Parent, StudentParent, Enrollment
        </p>
      </div>
    </div>
  );
};
