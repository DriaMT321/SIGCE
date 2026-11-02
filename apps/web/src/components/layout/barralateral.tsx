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
import { gestionusoautenticacion } from '../../features/auth/presentation/contextodeautenticacion';

interface navegacionelemento {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: string[];
}

interface navegacionseccion {
  title: string;
  items: navegacionelemento[];
}

const navegacionsecciones: navegacionseccion[] = [
  {
    title: 'Principal',
    items: [
      {
        name: 'Panel',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT'],
      },
      {
        name: 'Sincronización SIE',
        href: '/dashboard/sie-sync',
        icon: RefreshCw,
        roles: ['ADMINISTRATIVE'],
      },
    ],
  },
  {
    title: 'Gestión',
    items: [
      {
        name: 'Estudiantes',
        href: '/dashboard/students',
        icon: Users,
        roles: ['ADMINISTRATIVE', 'SECRETARY'],
      },
      {
        name: 'Cursos',
        href: '/dashboard/courses',
        icon: BookOpen,
        roles: ['ADMINISTRATIVE', 'SECRETARY'],
      },
      {
        name: 'Horarios',
        href: '/dashboard/schedules',
        icon: Clock,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT', 'STUDENT'],
      },
      {
        name: 'Tareas y Exámenes',
        href: '/dashboard/assignments',
        icon: FileCheck,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT', 'STUDENT'],
      },
      {
        name: 'Avance Curricular',
        href: '/dashboard/curriculum',
        icon: BookMarked,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'],
      },
      {
        name: 'Matrículas',
        href: '/dashboard/enrollments',
        icon: ClipboardList,
        roles: ['ADMINISTRATIVE', 'SECRETARY'],
      },
      {
        name: 'Notas',
        href: '/dashboard/grades',
        icon: Award,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT', 'STUDENT'],
      },
      {
        name: 'Asistencia',
        href: '/dashboard/attendance',
        icon: CalendarCheck,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT', 'STUDENT'],
      },
    ],
  },
  {
    title: 'Comunidad',
    items: [
      {
        name: 'Docentes',
        href: '/dashboard/teachers',
        icon: ContactRound,
        roles: ['ADMINISTRATIVE', 'SECRETARY'],
      },
      {
        name: 'Padres',
        href: '/dashboard/parents',
        icon: UsersRound,
        roles: ['ADMINISTRATIVE', 'SECRETARY'],
      },
      {
        name: 'Comunicados',
        href: '/dashboard/announcements',
        icon: Megaphone,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT', 'STUDENT'],
      },
      {
        name: 'Alertas',
        href: '/dashboard/alerts',
        icon: Bell,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER', 'PARENT', 'STUDENT'],
      },
    ],
  },
  {
    title: 'Supervisión',
    items: [
      {
        name: 'Personal y Roles',
        href: '/dashboard/users',
        icon: ShieldCheck,
        roles: ['ADMINISTRATIVE'],
      },
      { name: 'Auditoría', href: '/dashboard/audit', icon: History, roles: ['ADMINISTRATIVE'] },
      {
        name: 'Reportes',
        href: '/dashboard/reports',
        icon: FileSpreadsheet,
        roles: ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'],
      },
    ],
  },
];

export const Barralateral: React.FC = () => {
  const autenticacion = gestionusoautenticacion();
  const actualusuario = autenticacion.obtenerusuarioactual();
  const actualrol = actualusuario?.role ?? '';
  const iniciales =
    `${actualusuario?.firstName?.[0] ?? ''}${actualusuario?.lastName?.[0] ?? ''}`.toUpperCase() ||
    'U';

  const roletiquetas: Record<string, string> = {
    ADMINISTRATIVE: 'Administración y Dirección',
    SECRETARY: 'Secretaría',
    TEACHER: 'Docente',
    PARENT: 'Familiar / Tutor',
    STUDENT: 'Estudiante',
  };

  return (
    <aside
      aria-label="Barra lateral"
      className="w-60 lg:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <span className="text-base font-bold text-white tracking-tight">SIGCE</span>
          <p className="text-[11px] text-slate-400 truncate">U.E. Comunidad Cristiana B</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Navegación principal" className="flex-1 px-2 py-4 space-y-5 overflow-y-auto">
        {navegacionsecciones.map((seccion) => {
          const visibleelementos = seccion.items.filter((elemento) =>
            elemento.roles.includes(actualrol),
          );
          if (visibleelementos.length === 0) return null;

          return (
            <div key={seccion.title} className="space-y-0.5">
              <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {seccion.title}
              </div>

              {visibleelementos.map((elemento) => {
                const Icono = elemento.icon;
                return (
                  <NavLink
                    key={elemento.href}
                    to={elemento.href}
                    end={elemento.href === '/dashboard'}
                    className={({ isActive: estaactivo }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                        estaactivo
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <Icono className="w-4 h-4 shrink-0" />
                    <span className="truncate">{elemento.name}</span>
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
            {iniciales}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {actualusuario?.firstName} {actualusuario?.lastName}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {roletiquetas[actualrol] || actualrol}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void autenticacion.cerrarsesion()}
            aria-label="Cerrar sesión"
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
