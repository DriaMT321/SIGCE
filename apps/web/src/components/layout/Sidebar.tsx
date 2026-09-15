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
  ClipboardList,
  ContactRound,
  UsersRound,
  Bell,
} from 'lucide-react';
import { authService } from '../../features/auth/services/auth.service';

const navigation: Array<{ name: string; href: string; icon: typeof LayoutDashboard; roles: string[] }> = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
  { name: 'Sincronización SIE (RPA)', href: '/dashboard/sie-sync', icon: RefreshCw, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
  { name: 'Estudiantes', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
  { name: 'Cursos y Materias', href: '/dashboard/courses', icon: BookOpen, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
  { name: 'Matrículas', href: '/dashboard/enrollments', icon: ClipboardList, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
  { name: 'Docentes', href: '/dashboard/teachers', icon: ContactRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
  { name: 'Familiares', href: '/dashboard/parents', icon: UsersRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
  { name: 'Alertas', href: '/dashboard/alerts', icon: Bell, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
  { name: 'Calificaciones', href: '/dashboard/grades', icon: Award, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
  { name: 'Asistencia', href: '/dashboard/attendance', icon: CalendarCheck, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
  { name: 'Auditoría', href: '/dashboard/audit', icon: History, roles: ['ADMIN', 'DIRECTOR'] },
  { name: 'Reportes', href: '/dashboard/reports', icon: FileSpreadsheet, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
];

export const Sidebar: React.FC = () => {
  const currentRole = authService.getCurrentUser()?.role ?? '';
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 shadow-xs">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F8C311] via-[#F37022] to-[#B91329] flex items-center justify-center text-white shadow-md shadow-[#B91329]/25">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900 font-display block leading-none">
            SIGCE
          </span>
          <span className="text-[10px] text-[#F37022] font-semibold tracking-wide">
            Académico & SIE
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Módulos del Sistema
        </div>

        {navigation.filter((item) => item.roles.includes(currentRole)).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#fff5eb] via-[#fff9e5] to-white text-[#B91329] font-semibold border-l-4 border-l-[#B91329] border-y border-r border-orange-100 shadow-xs'
                    : 'text-slate-600 hover:text-[#B91329] hover:bg-[#fff9e5] hover:border-l-2 hover:border-l-[#F8C311]'
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
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-xl flex items-center space-x-3 border border-slate-200/80 hover:border-[#F37022]/40 transition-colors shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F8C311]/20 to-[#B91329]/15 flex items-center justify-center text-[#B91329]">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-slate-800">U.E. Comunidad Cristiana B</p>
            <p className="text-[10px] text-[#F37022] font-semibold">SIE: 81981191 · Gestión 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
};


