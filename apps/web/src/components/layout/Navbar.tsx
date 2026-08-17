import React from 'react';
import { authService } from '../../features/auth/services/auth.service';
import { LogOut, User, Bell, Shield, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const user = authService.getCurrentUser();

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#fff5eb] text-[#B91329] border border-orange-200 shadow-2xs">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-[#F37022]" />
          Rol: {user?.role || 'ADMIN'}
        </span>
        <span className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#F37022]" />
          Gestión Académica 2026
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          title="Notificaciones"
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F37022] rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F8C311] via-[#F37022] to-[#B91329] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#B91329]/25">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-slate-800">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => authService.logout()}
          title="Cerrar sesión"
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};


