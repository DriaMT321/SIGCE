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
  Shield,
  LogOut,
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
    title: 'Gobernanza',
    items: [
      { name: 'Panel Principal', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Sincronización SIE', href: '/dashboard/sie-sync', icon: RefreshCw, roles: ['ADMIN', 'DIRECTOR'], tag: 'RPA' },
    ],
  },
  {
    title: 'Gestión Curricular',
    items: [
      { name: 'Estudiantes Matriculados', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: '16 Cursos Oficiales', href: '/dashboard/courses', icon: BookOpen, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Horarios de Clases', href: '/dashboard/schedules', icon: Clock, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'], tag: 'Malla' },
      { name: 'Avance Curricular', href: '/dashboard/curriculum', icon: BookMarked, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'], tag: 'R.M. 1040' },
      { name: 'Matrículas y RUDE', href: '/dashboard/enrollments', icon: ClipboardList, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Registro de Notas', href: '/dashboard/grades', icon: Award, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
      { name: 'Control de Asistencia', href: '/dashboard/attendance', icon: CalendarCheck, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
    ],
  },
  {
    title: 'Comunidad Educativa',
    items: [
      { name: 'Plantel Docente', href: '/dashboard/teachers', icon: ContactRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Padres y Tutores', href: '/dashboard/parents', icon: UsersRound, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY'] },
      { name: 'Sistema de Alertas', href: '/dashboard/alerts', icon: Bell, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER', 'PARENT'] },
    ],
  },
  {
    title: 'Supervisión Oficial',
    items: [
      { name: 'Trazabilidad y Auditoría', href: '/dashboard/audit', icon: History, roles: ['ADMIN', 'DIRECTOR'] },
      { name: 'Centralizadores y Actas', href: '/dashboard/reports', icon: FileSpreadsheet, roles: ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'] },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const currentRole = currentUser?.role ?? '';
  const initials = `${currentUser?.firstName?.[0] ?? ''}${currentUser?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador General',
    DIRECTOR: 'Dirección Pedagógica',
    SECRETARY: 'Secretaría Académica',
    TEACHER: 'Docente Titular',
    PARENT: 'Estudiante / Tutor',
  };

  return (
    <aside className="w-64 lg:w-72 obsidian-surface text-slate-200 flex flex-col flex-shrink-0 select-none z-30 relative overflow-hidden">
      {/* Background subtle geometric hairline grid */}
      <div className="absolute inset-0 hairline-pattern pointer-events-none opacity-40" />

      {/* Brand Institutional Header */}
      <div className="h-20 flex items-center px-5 border-b border-white/[0.08] gap-3 relative z-10">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-glow-amber shrink-0">
          <GraduationCap className="w-6 h-6 stroke-[1.75]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white font-display">
              SIGCE
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/15 text-amber-300 border border-amber-400/25">
              SIE 81981191
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate leading-tight mt-0.5">
            U.E. Comunidad Cristiana B
          </p>
        </div>
      </div>

      {/* Status strip */}
      <div className="px-5 py-2.5 bg-black/30 border-b border-white/[0.05] flex items-center justify-between text-[11px] relative z-10">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistema Operativo</span>
        </span>
        <span className="text-slate-400 font-mono text-[10px]">Gestión 2026</span>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto relative z-10">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
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
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 haptic-press ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600/25 via-red-600/10 to-transparent text-white font-semibold border-l-2 border-red-500 shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.tag && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                            }`}
                          >
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

      {/* Institutional User Profile Card (Double-Bezel Hardware Enclosure) */}
      <div className="p-3 border-t border-white/[0.08] relative z-10 bg-black/40">
        <div className="p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <div className="bg-slate-900/90 rounded-[calc(1rem-0.25rem)] p-3 border border-white/[0.06] flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black font-display text-xs flex items-center justify-center shrink-0 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span className="text-[10px] text-slate-400 truncate">
                    {roleLabels[currentRole] || currentRole}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => authService.logout()}
              title="Cerrar sesión institucional"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors haptic-press shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
