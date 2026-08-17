import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { getSocket } from '../../../lib/socket';
import {
  sieSyncStatusEventSchema,
  sieSyncTriggerResponseSchema,
} from '../schemas/sie-sync.schema';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Server,
  Globe2,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

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

    socket.on('sie.sync.progress', (rawData: unknown) => {
      const data = sieSyncStatusEventSchema.parse(rawData);
      console.log('[sie.sync.progress]:', data);
      setSyncStatus(data.status);
    });

    socket.on('sie.sync.verified', (rawData: unknown) => {
      const data = sieSyncStatusEventSchema.parse(rawData);
      console.log('[sie.sync.verified]:', data);
      setItems((prev) =>
        prev.map((item) =>
          item.studentRude === data.studentRude
            ? {
                ...item,
                sieGrade: data.sieValue ?? null,
                status: data.status === 'CANCELLED' ? 'FAILED' : data.status,
                isMatched: data.isMatched ?? false,
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
      return sieSyncTriggerResponseSchema.parse(response.data);
    },
    onSuccess: () => {
      setSyncStatus('QUEUED');
      queryClient.invalidateQueries({ queryKey: ['sie-sync'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <RefreshCw className="w-6 h-6 text-[#F37022]" />
            Interoperabilidad y Sincronización SIE
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Verificación y auditoría bidireccional entre la base académica local y el portal SIE (RPA Puppeteer).
          </p>
        </div>

        <Button
          type="button"
          onClick={() => triggerMutation.mutate()}
          disabled={triggerMutation.isPending}
          className="space-x-2 bg-gradient-to-r from-[#B91329] via-[#F37022] to-[#B91329] text-white shadow-md shadow-[#B91329]/25 hover:brightness-105 hover:shadow-lg hover:shadow-[#B91329]/30 transition-all cursor-pointer font-semibold"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{triggerMutation.isPending ? 'Encolando en BullMQ...' : 'Ejecutar Sincronización RPA'}</span>
        </Button>
      </div>

      {/* Status Bar */}
      <div className="glass-card p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-slate-200 shadow-xs bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-700 font-medium">
            Worker RPA: <strong className="text-emerald-700">Activo (BullMQ + Puppeteer)</strong> — Estado:{' '}
            <span className="text-[#B91329] font-mono font-bold bg-[#fff5eb] px-2 py-0.5 rounded border border-orange-200">{syncStatus}</span>
          </span>
        </div>
        <div className="flex items-center space-x-6 text-xs text-slate-600 font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verificados: 2
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <AlertTriangle className="w-4 h-4 text-[#F37022]" /> Inconsistencias: 1
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-4 h-4 text-[#F37022]" /> En cola: 0
          </span>
        </div>
      </div>

      {/* Dual Panel: Sistema Local vs SIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo: Sistema Local */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200 shadow-xs bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-base">
              <div className="p-1.5 rounded-lg bg-[#fff9e5] text-[#F37022]">
                <Server className="w-4 h-4" />
              </div>
              <h2>Sistema Académico Interno</h2>
            </div>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
              PostgreSQL (Local)
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`local-${item.id}`}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-amber-300 hover:shadow-xs transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.studentName}</p>
                  <p className="text-xs text-slate-500">
                    {item.subject} • <span className="font-mono text-slate-400">RUDE: {item.studentRude}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#F37022] font-mono">
                    {item.localGrade} pts
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Nota Local</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Portal SIE */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 border border-slate-200 shadow-xs bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-base">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Globe2 className="w-4 h-4" />
              </div>
              <h2>Sistema de Información Educativa (SIE)</h2>
            </div>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Verificado vía RPA
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`sie-${item.id}`}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  item.isMatched
                    ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-amber-50/60 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.isMatched ? (
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-amber-100/80 border border-amber-200 flex items-center justify-center text-[#F37022]">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.isMatched ? 'Sincronización Correcta' : 'Discrepancia Detectada'}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Estado: {item.status}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg font-bold font-mono ${
                      item.isMatched ? 'text-emerald-700' : 'text-[#B91329]'
                    }`}
                  >
                    {item.sieGrade !== null ? `${item.sieGrade} pts` : '---'}
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Valor SIE</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


