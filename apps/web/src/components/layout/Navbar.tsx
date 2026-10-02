import React from 'react';
import { authService } from '../../features/auth/services/auth.service';
import { LogOut, Bell, Palette } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export const Navbar: React.FC = () => {
  const user = authService.getCurrentUser();
  const { isInstitutional, toggleTheme } = useTheme();
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Page context */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-medium text-slate-900">Gestión 2026</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isInstitutional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'}
          className={`p-2 rounded-lg transition-colors ${
            isInstitutional
              ? 'text-brand-600 hover:bg-brand-50'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          title="Notificaciones"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user?.firstName}
          </span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => authService.logout()}
          title="Cerrar sesión"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
