import React from 'react';
import { BookOpen } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 font-display">
          <BookOpen className="w-6 h-6 text-[#F37022]" />
          Cursos y Materias
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Estructura académica de grados, secciones, turnos y asignaciones docentes.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-slate-200 shadow-xs bg-white">
        <p className="text-slate-700 text-sm font-medium">
          Módulo preparado con entidades AcademicYear, Course, Subject y TeacherSubject.
        </p>
        <p className="text-xs text-[#B91329] font-mono font-semibold">
          Estructura relacional sincronizable con el SIE
        </p>
      </div>
    </div>
  );
};


