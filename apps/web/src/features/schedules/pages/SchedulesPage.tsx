import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  GraduationCap,
  User,
  BookOpen,
  Printer,
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { academicApi, ClassScheduleItem } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
import { Button } from '../../../components/ui/button';

const DAYS = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
];

const PERIODS = [
  { index: 1, start: '08:00', end: '08:45', label: '1º' },
  { index: 2, start: '08:45', end: '09:30', label: '2º' },
  { index: 'break1', isBreak: true, start: '09:30', end: '09:50', label: 'Recreo' },
  { index: 3, start: '09:50', end: '10:35', label: '3º' },
  { index: 4, start: '10:35', end: '11:20', label: '4º' },
  { index: 'break2', isBreak: true, start: '11:20', end: '11:35', label: 'Recreo' },
  { index: 5, start: '11:35', end: '12:20', label: '5º' },
  { index: 6, start: '12:20', end: '13:05', label: '6º' },
];

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  MAT: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  LC: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  LO: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  LEX: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  CSO: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CNA: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  BIO: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  FIS: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  QUI: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  APV: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  EMU: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  EFD: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  CFS: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  VER: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  TTG: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  DII: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

export const SchedulesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = authService.getCurrentUser();
  const currentRole = currentUser?.role ?? '';
  const isParentOrStudent = currentRole === 'PARENT';
  const canManage = ['ADMIN', 'DIRECTOR', 'SECRETARY'].includes(currentRole);

  const [viewMode, setViewMode] = useState<'course' | 'teacher'>('course');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);

  // Modales
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [autoResult, setAutoResult] = useState<{
    totalSlots: number;
    distribution: Array<{ subjectName: string; code: string; teacherName: string; periods: number }>;
  } | null>(null);

  // Formulario manual
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [slotDay, setSlotDay] = useState<string>('LUNES');
  const [slotPeriodIndex, setSlotPeriodIndex] = useState<number>(1);
  const [slotSubjectId, setSlotSubjectId] = useState<string>('');
  const [slotTeacherId, setSlotTeacherId] = useState<string>('');
  const [slotClassroom, setSlotClassroom] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Queries
  const { data: myScheduleData, isLoading: loadingMySchedule } = useQuery({
    queryKey: ['schedules', 'my-schedule'],
    queryFn: () => academicApi.getMySchedule(),
    enabled: isParentOrStudent,
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicApi.listCourses(),
    enabled: !isParentOrStudent,
  });
  const courses = coursesData?.data ?? [];

  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      const defaultCourse = courses.find((c) => c.gradeLevel === 11) || courses[0];
      setSelectedCourseId(defaultCourse.id);
    }
  }, [courses, selectedCourseId]);

  const { data: teachersData } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => academicApi.listTeachers(),
    enabled: !isParentOrStudent,
  });
  const teachers = teachersData?.data ?? [];

  React.useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers, selectedTeacherId]);

  const { data: subjectsData } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => academicApi.listSubjects(),
    enabled: canManage,
  });
  const allSubjects = subjectsData ?? [];

  const { data: courseScheduleData, isLoading: loadingCourse } = useQuery({
    queryKey: ['schedules', 'course', selectedCourseId],
    queryFn: () => academicApi.getCourseSchedule(selectedCourseId),
    enabled: !isParentOrStudent && viewMode === 'course' && !!selectedCourseId,
  });

  const { data: teacherScheduleData, isLoading: loadingTeacher } = useQuery({
    queryKey: ['schedules', 'teacher', selectedTeacherId],
    queryFn: () => academicApi.getTeacherSchedule(selectedTeacherId),
    enabled: !isParentOrStudent && viewMode === 'teacher' && !!selectedTeacherId,
  });

  // Mutations
  const upsertMutation = useMutation({
    mutationFn: academicApi.upsertSchedule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsManualModalOpen(false);
      setEditingSessionId(null);
      setManualError(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar horario';
      setManualError(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: academicApi.deleteSchedule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsManualModalOpen(false);
      setEditingSessionId(null);
      setManualError(null);
    },
  });

  const generateAutoMutation = useMutation({
    mutationFn: (courseId: string) => academicApi.generateAutoSchedule(courseId),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setAutoResult(res.data);
    },
  });

  const myData = myScheduleData?.data;
  const children = myData?.children ?? [];
  const currentChild = children[selectedChildIndex] || children[0];

  const activeCourse = isParentOrStudent
    ? (currentChild?.course || myData?.course)
    : courses.find((c) => c.id === selectedCourseId);

  const activeSchedules: ClassScheduleItem[] = isParentOrStudent
    ? (currentChild?.schedules || myData?.schedules || [])
    : viewMode === 'course'
      ? courseScheduleData?.data?.schedules ?? []
      : teacherScheduleData?.data?.schedules ?? [];

  const activeStudent = isParentOrStudent
    ? (currentChild?.student || myData?.student)
    : null;

  const scheduleMatrix = new Map<string, ClassScheduleItem>();
  for (const s of activeSchedules) {
    scheduleMatrix.set(`${s.dayOfWeek}_${s.periodIndex}`, s);
  }

  const inicialCourses = courses.filter((c) => c.gradeLevel <= 4);
  const primariaCourses = courses.filter((c) => c.gradeLevel >= 5 && c.gradeLevel <= 10);
  const secundariaCourses = courses.filter((c) => c.gradeLevel >= 11);

  const isLoading = isParentOrStudent
    ? loadingMySchedule
    : viewMode === 'course'
      ? loadingCourse
      : loadingTeacher;

  // Abrir modal manual para celda específica
  const handleOpenSlot = (dayKey: string, periodIndex: number, session?: ClassScheduleItem) => {
    if (!canManage || viewMode !== 'course' || !selectedCourseId) return;

    setSlotDay(dayKey);
    setSlotPeriodIndex(periodIndex);
    setManualError(null);

    if (session) {
      setEditingSessionId(session.id);
      setSlotSubjectId(session.subjectId);
      setSlotTeacherId(session.teacherId);
      setSlotClassroom(session.classroom || `Aula ${activeCourse?.name || ''}`);
    } else {
      setEditingSessionId(null);
      setSlotSubjectId(allSubjects[0]?.id || '');
      setSlotTeacherId(teachers[0]?.id || '');
      setSlotClassroom(`Aula ${activeCourse?.name || ''}`);
    }

    setIsManualModalOpen(true);
  };

  const handleSaveManualSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !slotSubjectId || !slotTeacherId) {
      setManualError('Selecciona la materia y el docente');
      return;
    }

    const periodConfig = PERIODS.find((p) => p.index === slotPeriodIndex);
    const startTime = periodConfig && !periodConfig.isBreak ? periodConfig.start : '08:00';
    const endTime = periodConfig && !periodConfig.isBreak ? periodConfig.end : '08:45';

    upsertMutation.mutate({
      courseId: selectedCourseId,
      subjectId: slotSubjectId,
      teacherId: slotTeacherId,
      dayOfWeek: slotDay,
      periodIndex: slotPeriodIndex,
      startTime,
      endTime,
      classroom: slotClassroom.trim() || undefined,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isParentOrStudent
              ? `Horario — ${activeCourse?.name || 'Gestión 2026'}`
              : 'Horarios de Clases'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isParentOrStudent
              ? 'Malla horaria semanal'
              : 'Malla semanal por curso o docente con edición y generación automatizada'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManage && viewMode === 'course' && selectedCourseId && (
            <>
              <Button
                size="sm"
                onClick={() => {
                  setAutoResult(null);
                  setIsAutoModalOpen(true);
                }}
                className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generar Automático
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenSlot('LUNES', 1)}
                className="gap-1.5 text-xs text-slate-700"
              >
                <Plus className="w-4 h-4" />
                Asignar Manual
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="gap-1.5 text-xs text-slate-700"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>

          {!isParentOrStudent && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <Button
                size="sm"
                variant={viewMode === 'course' ? 'default' : 'ghost'}
                onClick={() => setViewMode('course')}
                className={`gap-1.5 text-xs ${viewMode === 'course' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <GraduationCap className="w-4 h-4" />
                Por Curso
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setViewMode('teacher')}
                className={`gap-1.5 text-xs ${viewMode === 'teacher' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <User className="w-4 h-4" />
                Por Docente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Context Toolbar */}
      {isParentOrStudent ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeCourse && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-sm font-medium">
                <GraduationCap className="w-4 h-4" />
                {activeCourse.name}
              </span>
            )}

            {activeStudent && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
                <User className="w-4 h-4" />
                {activeStudent.firstName} {activeStudent.lastName}
              </span>
            )}

            {myData?.type === 'parent' && children.length > 1 && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-xs font-medium text-slate-500">Hijos:</span>
                {children.map((child, idx) => (
                  <Button
                    key={child.student.id}
                    size="sm"
                    variant={selectedChildIndex === idx ? 'default' : 'outline'}
                    onClick={() => setSelectedChildIndex(idx)}
                    className="text-xs h-8"
                  >
                    {child.student.firstName}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {viewMode === 'course' ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-sm font-medium text-slate-700 shrink-0">Curso:</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="flex-1 max-w-md h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <optgroup label="Inicial">
                    {inicialCourses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Primaria">
                    {primariaCourses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Secundaria">
                    {secundariaCourses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {canManage && (
                <span className="text-xs text-slate-500 hidden sm:inline font-mono">
                  * Haz clic en cualquier celda para editar o asignar manualmente
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="text-sm font-medium text-slate-700 shrink-0">Docente:</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="flex-1 max-w-md h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.lastName} {t.firstName} — {t.specialty}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Grid Table */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs">
                  <th className="py-3 px-4 text-left font-semibold w-28 border-r border-slate-800">
                    Hora
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d.key}
                      className="py-3 px-4 text-center font-semibold border-r border-slate-800 last:border-r-0"
                    >
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {PERIODS.map((period, idx) => {
                  if (period.isBreak) {
                    return (
                      <tr key={`break-${idx}`} className="bg-amber-50/70">
                        <td className="py-2 px-4 font-mono text-xs text-amber-800 border-r border-amber-200 font-semibold">
                          {period.start} - {period.end}
                        </td>
                        <td colSpan={5} className="py-2 px-4 text-center text-xs font-bold uppercase tracking-wider text-amber-800">
                          {period.label}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={`period-${period.index}`} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 border-r border-slate-200 bg-slate-50/70">
                        <div className="font-semibold text-slate-900">{period.label}</div>
                        <div className="font-mono text-xs text-slate-500">
                          {period.start} - {period.end}
                        </div>
                      </td>

                      {DAYS.map((day) => {
                        const session = scheduleMatrix.get(`${day.key}_${period.index}`);

                        if (!session) {
                          return (
                            <td
                              key={day.key}
                              onClick={() => handleOpenSlot(day.key, Number(period.index))}
                              className={`py-3 px-3 text-center border-r border-slate-200 last:border-r-0 bg-slate-50/30 transition-colors ${
                                canManage && viewMode === 'course'
                                  ? 'cursor-pointer hover:bg-slate-100/90 group'
                                  : ''
                              }`}
                            >
                              {canManage && viewMode === 'course' ? (
                                <div className="text-slate-300 group-hover:text-slate-600 flex items-center justify-center gap-1 text-xs font-medium">
                                  <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <span className="opacity-40 group-hover:opacity-100 transition-opacity">—</span>
                                </div>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>
                          );
                        }

                        const color =
                          SUBJECT_COLORS[session.subject?.code || ''] || {
                            bg: 'bg-slate-100',
                            text: 'text-slate-800',
                            border: 'border-slate-200',
                          };

                        return (
                          <td
                            key={day.key}
                            onClick={() => handleOpenSlot(day.key, Number(period.index), session)}
                            className={`p-2 border-r border-slate-200 last:border-r-0 align-top transition-all ${
                              canManage && viewMode === 'course' ? 'cursor-pointer hover:opacity-95' : ''
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg border ${color.bg} ${color.border} min-h-[64px] relative group shadow-2xs`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/90 border ${color.border} ${color.text}`}
                                >
                                  {session.subject?.code}
                                </span>
                                {session.classroom && (
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {session.classroom}
                                  </span>
                                )}
                              </div>
                              <div className={`font-semibold text-xs leading-tight ${color.text}`}>
                                {session.subject?.name}
                              </div>
                              <div className="mt-1.5 pt-1 border-t border-black/5 text-[11px] text-slate-600 flex items-center justify-between">
                                {isParentOrStudent || viewMode === 'course' ? (
                                  <span>Prof. {session.teacher?.lastName}</span>
                                ) : (
                                  <span>{session.course?.name}</span>
                                )}

                                {canManage && viewMode === 'course' && (
                                  <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Asignaturas Programadas</span>
            <p className="text-lg font-bold text-slate-900">
              {isParentOrStudent || viewMode === 'course'
                ? `${new Set(activeSchedules.map((s) => s.subjectId)).size} materias`
                : `${new Set(activeSchedules.map((s) => s.courseId)).size} cursos`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Carga Semanal Cubierta</span>
            <p className="text-lg font-bold text-slate-900">
              {activeSchedules.length} / 30 períodos
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Marco Normativo</span>
            <p className="text-lg font-bold text-slate-900">Ley 070 / R.M. 1040</p>
          </div>
        </div>
      </div>

      {/* Modal: Edición Manual de Horario */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {editingSessionId ? 'Editar Período de Horario' : 'Asignar Nuevo Período'}
                  </h3>
                  <p className="text-xs text-slate-500">{activeCourse?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualSlot} className="p-5 space-y-4">
              {manualError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Día de la Semana</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {DAYS.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Período / Hora</label>
                  <select
                    value={slotPeriodIndex}
                    onChange={(e) => setSlotPeriodIndex(Number(e.target.value))}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {PERIODS.filter((p) => !p.isBreak).map((p) => (
                      <option key={p.index} value={p.index}>
                        {p.label} ({p.start} - {p.end})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asignatura / Materia *</label>
                <select
                  required
                  value={slotSubjectId}
                  onChange={(e) => setSlotSubjectId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Selecciona materia...</option>
                  {allSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Docente Asignado *</label>
                <select
                  required
                  value={slotTeacherId}
                  onChange={(e) => setSlotTeacherId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Selecciona docente...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.lastName} {t.firstName} — {t.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aula / Salón</label>
                <input
                  type="text"
                  value={slotClassroom}
                  onChange={(e) => setSlotClassroom(e.target.value)}
                  placeholder="Ej. Aula 102, Lab de Computación, Cancha"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {editingSessionId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm('¿Deseas quitar esta materia de este período?')) {
                        deleteMutation.mutate(editingSessionId);
                      }
                    }}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Quitar
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsManualModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={upsertMutation.isPending}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    {upsertMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Sesión'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generación Automática con Algoritmo */}
      {isAutoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Generador Automático de Horarios</h3>
                  <p className="text-xs text-slate-500">Algoritmo de optimización curricular ministerial</p>
                </div>
              </div>
              <button
                onClick={() => setIsAutoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
                <p className="font-bold text-slate-900">¿Cómo funciona el algoritmo?</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>
                    <strong>Carga Horaria Ministerial:</strong> Distribuye 30 periodos semanales (6 por día, lunes a viernes).
                  </li>
                  <li>
                    <strong>Troncales:</strong> 5 periodos para Matemáticas y Lenguaje; 4 para Ciencias Naturales y Sociales.
                  </li>
                  <li>
                    <strong>Complementarias:</strong> 2 periodos para Ed. Física, Música, Artes, Valores y Técnica.
                  </li>
                  <li>
                    <strong>Anti-Colisión Docente:</strong> Verifica que el profesor no tenga otra clase simultánea en otro curso.
                  </li>
                  <li>
                    <strong>Bloques Pedagógicos:</strong> Limita a un máximo de 2 periodos diarios por asignatura para evitar fatiga escolar.
                  </li>
                </ul>
              </div>

              {autoResult ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>¡Horario Generado con Éxito!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Se asignaron los {autoResult.totalSlots} periodos semanales sin ninguna colisión de docentes ni huecos en la malla.
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {autoResult.distribution.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-white/80 px-2.5 py-1 rounded border border-emerald-100">
                        <span className="font-medium text-slate-800">{d.subjectName} ({d.code})</span>
                        <span className="font-mono text-emerald-800">{d.periods}h/sem · {d.teacherName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Curso destino: <span className="text-indigo-600 font-bold">{activeCourse?.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Al ejecutar, se reemplazará la malla horaria actual de este curso con la nueva distribución óptima calculada.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsAutoModalOpen(false)}>
                  {autoResult ? 'Cerrar' : 'Cancelar'}
                </Button>
                {!autoResult && (
                  <Button
                    type="button"
                    disabled={generateAutoMutation.isPending || !selectedCourseId}
                    onClick={() => generateAutoMutation.mutate(selectedCourseId)}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {generateAutoMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Optimizando algoritmo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        Ejecutar Algoritmo
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
