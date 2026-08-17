import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { authService } from '../../features/auth/services/auth.service';

export const DashboardLayout: React.FC = () => {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f8fafc] relative">
          {/* Subtle brand ambient light glows */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#F8C311]/08 via-[#F37022]/05 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#B91329]/05 via-[#F37022]/04 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


