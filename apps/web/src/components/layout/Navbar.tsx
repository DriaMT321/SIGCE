import React from 'react';
import { authService } from '../../features/auth/services/auth.service';
import { LogOut, User, Bell, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const user = authService.getCurrentUser();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Shield className="w-3.5 h-3.5 mr-1" />
          {user?.role || 'ADMIN'}
        </span>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Gestión Académica 2026
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          title="Notificaciones"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => authService.logout()}
          title="Cerrar sesión"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
