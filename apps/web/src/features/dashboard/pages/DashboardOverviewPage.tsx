import React from 'react';
import {
  Users,
  Award,
  CalendarCheck,
  RefreshCw,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          Panel de Control Académico
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Resumen general de gestión académica, estado de sincronización SIE y métricas institucionales.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Estudiantes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-display">420</p>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% matriculados activos
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Docentes</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-display">28</p>
          <p className="text-xs text-slate-400">Asignaciones completadas</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Asistencia Promedio</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-display">94.8%</p>
          <p className="text-xs text-emerald-400">Gestión 2026</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Sincronizaciones SIE</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white font-display">98.5%</p>
          <p className="text-xs text-indigo-300">Tasa de coincidencia RPA</p>
        </div>
      </div>

      {/* Quick Access / Architectural summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Arquitectura Base del Sistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <p className="font-semibold text-indigo-300">Backend Modular Clean Architecture</p>
              <p className="text-slate-400">NestJS + PostgreSQL 16 + Prisma ORM + JWT/RBAC.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <p className="font-semibold text-violet-300">Worker RPA Asíncrono</p>
              <p className="text-slate-400">BullMQ + Redis 7 + Puppeteer en proceso independiente.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <p className="font-semibold text-emerald-300">Comunicación Tiempo Real</p>
              <p className="text-slate-400">Socket.IO Gateway para progreso de sincronización.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <p className="font-semibold text-amber-300">Auditoría Estricta</p>
              <p className="text-slate-400">Entidad AuditLog registrando cambios en notas y SIE.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Estado de Servicios
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">PostgreSQL 16</span>
              <span className="text-emerald-400 font-semibold">Conectado (Docker)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Redis 7 (BullMQ)</span>
              <span className="text-emerald-400 font-semibold">Conectado (Docker)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300">Puppeteer Chromium</span>
              <span className="text-emerald-400 font-semibold">Instalado y Operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
