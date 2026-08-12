import React from 'react';
import { BookOpen } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          Cursos y Materias
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Estructura académica de grados, secciones, turnos y asignaciones docentes.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
        <p className="text-slate-400 text-sm">
          Módulo preparado con entidades AcademicYear, Course, Subject y TeacherSubject.
        </p>
      </div>
    </div>
  );
};
