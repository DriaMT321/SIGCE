import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  Award,
  History,
  RefreshCw,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sincronización SIE (RPA)', href: '/dashboard/sie-sync', icon: RefreshCw },
  { name: 'Estudiantes', href: '/dashboard/students', icon: Users },
  { name: 'Cursos y Materias', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Calificaciones', href: '/dashboard/grades', icon: Award },
  { name: 'Asistencia', href: '/dashboard/attendance', icon: CalendarCheck },
  { name: 'Auditoría', href: '/dashboard/audit', icon: History },
  { name: 'Reportes', href: '/dashboard/reports', icon: FileSpreadsheet },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col flex-shrink-0">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-base font-bold tracking-tight text-white font-display">
          Academic SIE
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Módulos Principales
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="glass-card p-3 rounded-xl flex items-center space-x-3">
          <Settings className="w-4 h-4 text-indigo-400" />
          <div className="text-xs">
            <p className="font-semibold text-slate-300">Clean Architecture</p>
            <p className="text-[10px] text-slate-500">DDD & Monolito Modular</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
