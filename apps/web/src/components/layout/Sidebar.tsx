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
  Clock,
  BookMarked,
  LogOut,
  ShieldCheck,
  FileCheck,
  Megaphone,
} from 'lucide-react';
import { authService } from '../../features/auth/services/auth.service';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { name: 'Panel', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Sincronización SIE', href: '/dashboard/sie-sync', icon: RefreshCw, roles: ['ADMIN', 'DIRECTOR'] },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { name: 'Estudiantes', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Cursos', href: '/dashboard/courses', icon: BookOpen, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Horarios', href: '/dashboard/schedules', icon: Clock, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Tareas y Exámenes', href: '/dashboard/assignments', icon: FileCheck, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Avance Curricular', href: '/dashboard/curriculum', icon: BookMarked, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
      { name: 'Matrículas', href: '/dashboard/enrollments', icon: ClipboardList, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Notas', href: '/dashboard/grades', icon: Award, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Asistencia', href: '/dashboard/attendance', icon: CalendarCheck, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
    ],
  },
  {
    title: 'Comunidad',
    items: [
      { name: 'Docentes', href: '/dashboard/teachers', icon: ContactRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Padres', href: '/dashboard/parents', icon: UsersRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Comunicados', href: '/dashboard/announcements', icon: Megaphone, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Alertas', href: '/dashboard/alerts', icon: Bell, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
    ],
  },
  {
    title: 'Supervisión',
    items: [
      { name: 'Personal y Roles', href: '/dashboard/users', icon: ShieldCheck, roles: ['ADMIN', 'DIRECTOR'] },
      { name: 'Auditoría', href: '/dashboard/audit', icon: History, roles: ['ADMIN', 'DIRECTOR'] },
      { name: 'Reportes', href: '/dashboard/reports', icon: FileSpreadsheet, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const currentRole = currentUser?.role ?? '';
  const initials = `${currentUser?.firstName?.[0] ?? ''}${currentUser?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    DIRECTOR: 'Dirección',
    SECRETARY: 'Secretaría',
    TEACHER: 'Docente',
    PARENT: 'Estudiante / Tutor',
  };

  return (
    <aside className="w-60 lg:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <span className="text-base font-bold text-white tracking-tight">SIGCE</span>
          <p className="text-[11px] text-slate-500 truncate">U.E. Comunidad Cristiana B</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
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
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Profile - Simplified */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {roleLabels[currentRole] || currentRole}
            </p>
          </div>

          <button
            type="button"
            onClick={() => authService.logout()}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
