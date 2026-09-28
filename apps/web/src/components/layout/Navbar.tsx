import React from 'react';
import { authService } from '../../features/auth/services/auth.service';
import { LogOut, Bell, Shield, Calendar, Palette } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTheme } from '../../lib/theme';

export const Navbar: React.FC = () => {
  const user = authService.getCurrentUser();
  const { isInstitutional, toggleTheme } = useTheme();
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador del Sistema',
    DIRECTOR: 'Dirección Académica',
    SECRETARY: 'Secretaría General',
    TEACHER: 'Docente Titular',
    PARENT: 'Padre / Tutor de Familia',
  };

  return (
    <header className="h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Academic Status and Role */}
      <div className="flex items-center gap-3">
        <Badge variant="brand" className="font-medium gap-1.5 py-1">
          <Shield className="w-3.5 h-3.5 text-brand-700" />
          <span>{roleLabels[user?.role ?? ''] ?? user?.role ?? 'Usuario'}</span>
        </Badge>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium pl-2 border-l border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Gestión Académica 2026</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-semibold">1er Trimestre</span>
        </div>
      </div>

      {/* Right: Theme Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Color Palette Switcher (Official School Colors vs Executive) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={
            isInstitutional
              ? 'Identidad U.E. Comunidad Cristiana B activa (#b91329 / #f37022 / #ffc54c). Clic para cambiar a Modo Ejecutivo.'
              : 'Modo Ejecutivo activo. Clic para activar Colores Oficiales del Colegio.'
          }
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            isInstitutional
              ? 'border-brand-crimson/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 text-brand-crimson shadow-xs'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Palette className={`w-3.5 h-3.5 ${isInstitutional ? 'text-brand-crimson' : 'text-slate-500'}`} />
          <span className="hidden sm:inline text-[11px] font-medium">
            {isInstitutional ? 'Identidad Colegio' : 'Tema Ejecutivo'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isInstitutional
                ? 'bg-gradient-to-r from-[#ffc54c] via-[#f37022] to-[#b91329]'
                : 'bg-slate-400'
            }`}
          />
        </button>

        <button
          type="button"
          title="Notificaciones y avisos"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Identity Chip */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold font-mono shadow-2xs border border-slate-800">
            {initials}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-500 font-mono leading-tight">{user?.email}</p>
          </div>
        </div>

        {/* Logout Action */}
        <button
          type="button"
          onClick={() => authService.logout()}
          title="Cerrar sesión segura"
          className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer ml-1"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
