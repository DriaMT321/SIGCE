import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  CalendarRange,
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
        name: 'Carga asistida SIE',
        href: '/dashboard/sie-sync',
        icon: RefreshCw,
        roles: ['ADMINISTRATIVE', 'SECRETARY'],
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
        name: 'Calendario académico',
        href: '/dashboard/academic-events',
        icon: CalendarRange,
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
      className="w-60 lg:w-64 bg-[#090e1a] text-slate-300 flex flex-col flex-shrink-0 select-none border-r border-slate-800/80 shadow-xl"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 gap-3 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="relative">
          <img
            src="/logo-sf.png"
            alt="Logo Colegio Comunidad Cristiana"
            className="h-9 w-auto object-contain shrink-0 drop-shadow-md"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#090e1a]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-white tracking-tight">SIGCE</span>
            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-1 rounded">
              2026
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">U.E. Comunidad Cristiana B</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Navegación principal" className="flex-1 px-3 py-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {navegacionsecciones.map((seccion) => {
          const visibleelementos = seccion.items.filter((elemento) =>
            elemento.roles.includes(actualrol),
          );
          if (visibleelementos.length === 0) return null;

          return (
            <div key={seccion.title} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 tracking-wide">
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
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        estaactivo
                          ? 'bg-indigo-600/20 text-white font-semibold border-l-2 border-indigo-500 shadow-2xs'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`
                    }
                  >
                    <Icono className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                    <span className="truncate">{elemento.name}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
            {iniciales}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">
              {actualusuario?.firstName} {actualusuario?.lastName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {roletiquetas[actualrol] || actualrol}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void autenticacion.cerrarsesion()}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
