import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { authService } from '../../features/auth/services/auth.service';
import { useTheme } from '../../lib/theme';

export const DashboardLayout: React.FC = () => {
  const isAuth = authService.isAuthenticated();
  const { isInstitutional } = useTheme();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden flex-col">
      {/* Signature institutional gradient ribbon from school palette */}
      {isInstitutional && (
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#ffc54c] via-[#f37022] to-[#b91329] z-30" />
      )}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
