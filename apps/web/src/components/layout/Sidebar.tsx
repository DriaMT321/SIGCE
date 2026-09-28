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
  Sparkles,
  Clock,
  BookMarked,
} from 'lucide-react';
import { authService } from '../../features/auth/services/auth.service';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: string[];
  tag?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { name: 'Panel General', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Sincronización SIE', href: '/dashboard/sie-sync', icon: RefreshCw, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'], tag: 'RPA' },
    ],
  },
  {
    title: 'Académico',
    items: [
      { name: 'Estudiantes', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: '16 Cursos Oficiales', href: '/dashboard/courses', icon: BookOpen, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
      { name: 'Horarios de Clases', href: '/dashboard/schedules', icon: Clock, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'], tag: 'Semanal' },
      { name: 'Avance Curricular', href: '/dashboard/curriculum', icon: BookMarked, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'], tag: 'R.M. 1040' },
      { name: 'Matrículas', href: '/dashboard/enrollments', icon: ClipboardList, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Calificaciones', href: '/dashboard/grades', icon: Award, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Asistencia', href: '/dashboard/attendance', icon: CalendarCheck, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
    ],
  },
  {
    title: 'Comunidad',
    items: [
      { name: 'Docentes', href: '/dashboard/teachers', icon: ContactRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
      { name: 'Familiares', href: '/dashboard/parents', icon: UsersRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Alertas', href: '/dashboard/alerts', icon: Bell, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
    ],
  },
  {
    title: 'Supervisión',
    items: [
      { name: 'Auditoría', href: '/dashboard/audit', icon: History, roles: ['ADMIN', 'DIRECTOR'] },
      { name: 'Reportes y Actas', href: '/dashboard/reports', icon: FileSpreadsheet, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const currentRole = authService.getCurrentUser()?.role ?? '';

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col flex-shrink-0 select-none z-30">
      {/* Brand Institutional Header */}
      <div className="h-18 flex items-center px-5 border-b border-slate-100 gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-xs">
          <GraduationCap className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-slate-900 font-display leading-tight">
              SIGCE
            </span>
            <span className="px-1.5 py-0.2 bg-brand-50 text-brand-800 text-[10px] font-bold rounded border border-brand-200/60">
              2026
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            U.E. Comunidad Cristiana B
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>

              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.tag && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isActive 
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Institutional Metadata Card */}
      <div className="p-3 border-t border-slate-100">
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              Sede Central
            </span>
            <span className="text-[10px] font-mono font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Turno Mañana
            </span>
          </div>
          <div className="text-[10px] text-slate-500 leading-snug">
            Código SIE: <span className="font-mono font-semibold text-slate-700">81981191</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
