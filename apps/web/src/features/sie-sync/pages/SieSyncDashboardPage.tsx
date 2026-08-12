import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { getSocket } from '../../../lib/socket';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Server,
  Globe2,
} from 'lucide-react';

interface GradeComparisonItem {
  id: string;
  studentName: string;
  studentRude: string;
  subject: string;
  localGrade: number;
  sieGrade: number | null;
  status: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'VERIFIED' | 'FAILED';
  isMatched: boolean;
}

export const SieSyncDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<string>('EN ESPERA');
  const [items, setItems] = useState<GradeComparisonItem[]>([
    {
      id: '1',
      studentName: 'Juan Pérez García',
      studentRude: '807300012024001',
      subject: 'Matemática',
      localGrade: 85,
      sieGrade: 85,
      status: 'VERIFIED',
      isMatched: true,
    },
    {
      id: '2',
      studentName: 'María Rodríguez Flores',
      studentRude: '807300012024002',
      subject: 'Lenguaje y Comunicación',
      localGrade: 78,
      sieGrade: 78,
      status: 'VERIFIED',
      isMatched: true,
    },
    {
      id: '3',
      studentName: 'Carlos Mamani Choque',
      studentRude: '807300012024003',
      subject: 'Ciencias Sociales: Historia',
      localGrade: 90,
      sieGrade: 85,
      status: 'FAILED',
      isMatched: false,
    },
  ]);

  // Escucha de WebSockets en tiempo real
  useEffect(() => {
    const socket = getSocket();

    socket.on('sie.sync.progress', (data: { status: string }) => {
      console.log('⚡ Evento WebSocket [sie.sync.progress]:', data);
      setSyncStatus(data.status);
    });

    socket.on('sie.sync.verified', (data: { studentRude: string; sieValue: number; status: 'PENDING' | 'QUEUED' | 'PROCESSING' | 'VERIFIED' | 'FAILED'; isMatched: boolean }) => {
      console.log('⚡ Evento WebSocket [sie.sync.verified]:', data);
      setItems((prev) =>
        prev.map((item) =>
          item.studentRude === data.studentRude
            ? {
                ...item,
                sieGrade: data.sieValue,
                status: data.status,
                isMatched: data.isMatched,
              }
            : item,
        ),
      );
    });

    return () => {
      socket.off('sie.sync.progress');
      socket.off('sie.sync.verified');
    };
  }, []);

  const triggerMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/sie-sync/trigger', {
        syncType: 'GRADES',
      });
      return response.data;
    },
    onSuccess: () => {
      setSyncStatus('QUEUED');
      queryClient.invalidateQueries({ queryKey: ['sie-sync'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <RefreshCw className="w-6 h-6 text-indigo-400" />
            Interoperabilidad y Sincronización SIE
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verificación y auditoría bidireccional entre la base académica local y el portal SIE (RPA Puppeteer).
          </p>
        </div>

        <button
          onClick={() => triggerMutation.mutate()}
          disabled={triggerMutation.isPending}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{triggerMutation.isPending ? 'Encolando en BullMQ...' : 'Ejecutar Sincronización RPA'}</span>
        </button>
      </div>

      {/* Status Bar */}
      <div className="glass-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border-indigo-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-300">
            Worker RPA: <strong className="text-emerald-400">Activo (BullMQ + Puppeteer)</strong> — Estado:{' '}
            <span className="text-indigo-400 font-mono font-semibold">{syncStatus}</span>
          </span>
        </div>
        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verificados: 2
          </span>
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Inconsistencias: 1
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" /> En cola: 0
          </span>
        </div>
      </div>

      {/* Dual Panel: Sistema Local vs SIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo: Sistema Local */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5 text-white font-semibold text-base">
              <Server className="w-5 h-5 text-indigo-400" />
              <h2>Sistema Académico Interno</h2>
            </div>
            <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
              PostgreSQL (Local)
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`local-${item.id}`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.studentName}</p>
                  <p className="text-xs text-slate-400">
                    {item.subject} • <span className="font-mono text-slate-500">RUDE: {item.studentRude}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-indigo-400 font-mono">
                    {item.localGrade} pts
                  </span>
                  <p className="text-[10px] text-slate-500">Nota Local</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Portal SIE */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5 text-white font-semibold text-base">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              <h2>Sistema de Información Educativa (SIE)</h2>
            </div>
            <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Verificado vía RPA
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`sie-${item.id}`}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  item.isMatched
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.isMatched ? (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.isMatched ? 'Sincronización Correcta' : 'Discrepancia Detectada'}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      Estado: {item.status}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg font-bold font-mono ${
                      item.isMatched ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {item.sieGrade !== null ? `${item.sieGrade} pts` : '---'}
                  </span>
                  <p className="text-[10px] text-slate-500">Valor SIE</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
