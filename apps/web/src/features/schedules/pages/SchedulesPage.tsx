import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  GraduationCap,
  User,
  BookOpen,
  Printer,
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
  const currentUser = authService.getCurrentUser();
  const isParentOrStudent = currentUser?.role === 'PARENT';

  const [viewMode, setViewMode] = useState<'course' | 'teacher'>('course');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);

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

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
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
              : 'Malla semanal por curso o docente'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="gap-1.5 text-sm text-slate-700"
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
                className={`gap-1.5 text-sm ${viewMode === 'course' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <GraduationCap className="w-4 h-4" />
                Por Curso
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setViewMode('teacher')}
                className={`gap-1.5 text-sm ${viewMode === 'teacher' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <User className="w-4 h-4" />
                Por Docente
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Context Toolbar - Simplified */}
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
                    className="text-sm h-8"
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

      {/* Loading / Empty / Timetable */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <div className="animate-spin w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">Cargando horario...</p>
        </div>
      ) : activeSchedules.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No hay horarios registrados</h3>
          <p className="text-sm text-slate-500 mt-1">
            {myData?.message || 'No se han programado sesiones para este curso.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-900 text-white text-xs">
                  <th className="py-3 px-4 text-left font-semibold w-32 border-r border-slate-800">
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
                      <tr key={`break-${idx}`} className="bg-amber-50">
                        <td className="py-2 px-4 font-mono text-xs text-amber-700 border-r border-amber-200">
                          {period.start} - {period.end}
                        </td>
                        <td colSpan={5} className="py-2 px-4 text-center text-xs font-medium text-amber-700">
                          {period.label}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={`period-${period.index}`} className="hover:bg-slate-50">
                      <td className="py-3 px-4 border-r border-slate-200 bg-slate-50">
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
                              className="py-3 px-3 text-center border-r border-slate-200 last:border-r-0 bg-slate-50/50"
                            >
                              <span className="text-slate-300 text-xs">—</span>
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
                            className="p-2 border-r border-slate-200 last:border-r-0 align-top"
                          >
                            <div
                              className={`p-2 rounded-lg border ${color.bg} ${color.border} min-h-[60px]`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`font-mono text-[10px] font-semibold px-1 py-0.2 rounded bg-white/80 border ${color.border} ${color.text}`}
                                >
                                  {session.subject?.code}
                                </span>
                                {session.classroom && (
                                  <span className="text-[10px] text-slate-500">
                                    {session.classroom}
                                  </span>
                                )}
                              </div>
                              <div className={`font-medium text-xs leading-tight ${color.text}`}>
                                {session.subject?.name}
                              </div>
                              <div className="mt-1.5 pt-1 border-t border-black/5 text-[11px] text-slate-600">
                                {isParentOrStudent || viewMode === 'course' ? (
                                  <span>Prof. {session.teacher?.lastName}</span>
                                ) : (
                                  <span>{session.course?.name}</span>
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

      {/* Footer Stats - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Asignaturas</span>
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
            <span className="text-xs text-slate-500">Carga Semanal</span>
            <p className="text-lg font-bold text-slate-900">
              {activeSchedules.length} períodos
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Normativa</span>
            <p className="text-lg font-bold text-slate-900">R.M. 1040/2022</p>
          </div>
        </div>
      </div>
    </div>
  );
};
