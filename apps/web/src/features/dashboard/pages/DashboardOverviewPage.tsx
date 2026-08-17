import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  CalendarCheck,
  RefreshCw,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowRight,
  Database,
  Cpu,
  Radio,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff5eb] text-[#B91329] border border-orange-200 mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F37022]" />
            Panel General Académico
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Gestión Académica e Interoperabilidad SIE
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Monitoreo centralizado de estudiantes, calificaciones, asistencia y sincronización bidireccional mediante RPA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/sie-sync"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] shadow-md shadow-[#B91329]/25 hover:brightness-105 hover:shadow-lg hover:shadow-[#B91329]/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sincronización SIE</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Estudiantes */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estudiantes</span>
            <div className="p-2.5 rounded-xl bg-[#fff9e5] text-[#F37022] border border-amber-200/80 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">420</p>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> 100% matriculados activos
            </p>
          </div>
        </div>

        {/* Metric 2: Docentes */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Docentes</span>
            <div className="p-2.5 rounded-xl bg-[#fff5eb] text-[#B91329] border border-orange-200/80 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">28</p>
            <p className="text-xs text-[#F37022] mt-1 font-semibold">Asignaciones completadas</p>
          </div>
        </div>

        {/* Metric 3: Asistencia */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Asistencia Promedio</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">94.8%</p>
            <p className="text-xs text-emerald-600 mt-1 font-semibold">Gestión Académica 2026</p>
          </div>
        </div>

        {/* Metric 4: Sincronizaciones SIE */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sincronizaciones SIE</span>
            <div className="p-2.5 rounded-xl bg-[#fff5eb] text-[#B91329] border border-orange-200/80 shadow-2xs">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 font-display">98.5%</p>
            <p className="text-xs text-[#B91329] flex items-center gap-1.5 mt-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#F37022] animate-pulse" />
              Tasa de coincidencia RPA
            </p>
          </div>
        </div>
      </div>

      {/* Architecture & Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Architectural Foundation */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#fff5eb] text-[#B91329]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              Arquitectura del Sistema & Flujo de Datos
            </h2>
            <span className="text-[11px] font-bold bg-[#fff5eb] text-[#B91329] border border-orange-200 px-2.5 py-0.5 rounded-full shadow-2xs">
              DDD & Clean Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-white hover:border-[#F8C311] hover:shadow-xs transition-all group">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#F37022]" />
                <p className="font-bold text-slate-900 text-sm">Backend Modular (NestJS)</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                PostgreSQL 16 + Prisma ORM + JWT/RBAC con capas domain, application e infrastructure.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-white hover:border-[#F37022] hover:shadow-xs transition-all group">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#F37022]" />
                <p className="font-bold text-slate-900 text-sm">Worker RPA Asíncrono</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                BullMQ + Redis 7 + Puppeteer en proceso desacoplado para automatización e interoperabilidad SIE.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-white hover:border-emerald-400 hover:shadow-xs transition-all group">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <p className="font-bold text-slate-900 text-sm">WebSocket en Tiempo Real</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Gateway Socket.IO para emisión de eventos y progreso de sincronización en vivo.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:bg-white hover:border-[#B91329] hover:shadow-xs transition-all group">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B91329]" />
                <p className="font-bold text-slate-900 text-sm">Auditoría Inmutable</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Entidad AuditLog para trazabilidad de notas, asistencias, usuario e IP de origen.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Estado de Servicios */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#fff5eb] text-[#F37022]">
                <Clock className="w-5 h-5" />
              </div>
              Servicios en Vivo
            </h2>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white transition-colors">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800 font-semibold">PostgreSQL 16</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white transition-colors">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800 font-semibold">Redis 7 (BullMQ)</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white transition-colors">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800 font-semibold">Puppeteer RPA</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Operativo
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white transition-colors">
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800 font-semibold">Socket.IO Server</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Escuchando
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


