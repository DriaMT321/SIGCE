import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  GraduationCap,
  User,
  BookOpen,
  MapPin,
  Sparkles,
  Filter,
  Printer,
  Users,
} from 'lucide-react';
import { academicApi, ClassScheduleItem } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

const DAYS = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
];

const PERIODS = [
  { index: 1, start: '08:00', end: '08:45', label: '1º Período' },
  { index: 2, start: '08:45', end: '09:30', label: '2º Período' },
  { index: 'break1', isBreak: true, start: '09:30', end: '09:50', label: 'Recreo Matinal (20 min)' },
  { index: 3, start: '09:50', end: '10:35', label: '3º Período' },
  { index: 4, start: '10:35', end: '11:20', label: '4º Período' },
  { index: 'break2', isBreak: true, start: '11:20', end: '11:35', label: 'Recreo Breve (15 min)' },
  { index: 5, start: '11:35', end: '12:20', label: '5º Período' },
  { index: 6, start: '12:20', end: '13:05', label: '6º Período' },
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

  // 1. Fetch personal schedule if user is student or parent
  const { data: myScheduleData, isLoading: loadingMySchedule } = useQuery({
    queryKey: ['schedules', 'my-schedule'],
    queryFn: () => academicApi.getMySchedule(),
    enabled: isParentOrStudent,
  });

  // 2. Fetch courses (only for administrative and teaching staff)
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => academicApi.listCourses(),
    enabled: !isParentOrStudent,
  });
  const courses = coursesData?.data ?? [];

  // Set default selected course when loaded
  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      const defaultCourse = courses.find((c) => c.gradeLevel === 11) || courses[0];
      setSelectedCourseId(defaultCourse.id);
    }
  }, [courses, selectedCourseId]);

  // 3. Fetch teachers (only for administrative and teaching staff)
  const { data: teachersData } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => academicApi.listTeachers(),
    enabled: !isParentOrStudent,
  });
  const teachers = teachersData?.data ?? [];

  // Set default selected teacher when loaded
  React.useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers, selectedTeacherId]);

  // 4. Fetch Course Schedule for admin view
  const { data: courseScheduleData, isLoading: loadingCourse } = useQuery({
    queryKey: ['schedules', 'course', selectedCourseId],
    queryFn: () => academicApi.getCourseSchedule(selectedCourseId),
    enabled: !isParentOrStudent && viewMode === 'course' && !!selectedCourseId,
  });

  // 5. Fetch Teacher Schedule for admin view
  const { data: teacherScheduleData, isLoading: loadingTeacher } = useQuery({
    queryKey: ['schedules', 'teacher', selectedTeacherId],
    queryFn: () => academicApi.getTeacherSchedule(selectedTeacherId),
    enabled: !isParentOrStudent && viewMode === 'teacher' && !!selectedTeacherId,
  });

  // Determine active schedules and contextual info
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

  // Create cell lookup: `${day}_${periodIndex}` -> scheduleItem
  const scheduleMatrix = new Map<string, ClassScheduleItem>();
  for (const s of activeSchedules) {
    scheduleMatrix.set(`${s.dayOfWeek}_${s.periodIndex}`, s);
  }

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  // Group courses by level for admin dropdown
  const inicialCourses = courses.filter((c) => c.gradeLevel <= 4);
  const primariaCourses = courses.filter((c) => c.gradeLevel >= 5 && c.gradeLevel <= 10);
  const secundariaCourses = courses.filter((c) => c.gradeLevel >= 11);

  const isLoading = isParentOrStudent
    ? loadingMySchedule
    : viewMode === 'course'
      ? loadingCourse
      : loadingTeacher;

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>
                {isParentOrStudent
                  ? myData?.type === 'parent'
                    ? 'Horario Escolar Oficial — Familiares'
                    : 'Horario Escolar Oficial — Estudiante'
                  : 'Carga Horaria y Pedagógica'}
              </span>
            </span>
            <Badge variant="outline" className="font-mono text-slate-700 bg-white">
              Turno Mañana (08:00 - 13:05)
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            {isParentOrStudent
              ? `Horario de Clases — ${activeCourse?.name || 'Gestión 2026'}`
              : 'Horarios Oficiales de Clases'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {isParentOrStudent
              ? 'Malla horaria semanal asignada para el período lectivo oficial 2026.'
              : 'Malla semanal sincronizada entre los 16 cursos oficiales y los 34 docentes de la institución.'}
          </p>
        </div>

        {/* Action / Mode Selector */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="gap-1.5 text-xs font-semibold text-slate-700 border-slate-200 bg-white hover:bg-slate-50 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Imprimir Horario
          </Button>

          {!isParentOrStudent && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <Button
                size="sm"
                variant={viewMode === 'course' ? 'default' : 'ghost'}
                onClick={() => setViewMode('course')}
                className={`gap-1.5 text-xs font-semibold rounded-lg ${
                  viewMode === 'course' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                Por Curso (16)
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'teacher' ? 'default' : 'ghost'}
                onClick={() => setViewMode('teacher')}
                className={`gap-1.5 text-xs font-semibold rounded-lg ${
                  viewMode === 'teacher' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                Por Docente (34)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Student / Parent Context Toolbar */}
      {isParentOrStudent ? (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeCourse && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Curso: {activeCourse.name}</span>
              </div>
            )}

            {activeStudent && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-900 border border-brand-200 rounded-xl text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-brand-700" />
                <span>
                  Estudiante: {activeStudent.firstName} {activeStudent.lastName}
                </span>
              </div>
            )}

            {activeStudent?.rude && (
              <Badge variant="outline" className="font-mono text-xs text-slate-700 bg-white">
                RUDE: {activeStudent.rude}
              </Badge>
            )}

            {myData?.type === 'parent' && children.length > 1 && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hijos:</span>
                {children.map((child, idx) => (
                  <Button
                    key={child.student.id}
                    size="sm"
                    variant={selectedChildIndex === idx ? 'default' : 'outline'}
                    onClick={() => setSelectedChildIndex(idx)}
                    className="text-xs font-semibold h-8"
                  >
                    <Users className="w-3 h-3" />
                    {child.student.firstName}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 self-end md:self-center font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            6 períodos pedagógicos diarios / 30 por semana
          </div>
        </div>
      ) : (
        /* Staff Admin Toolbar */
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {viewMode === 'course' ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-brand-600" />
                Seleccionar Curso:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="flex-1 max-w-md h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <optgroup label="Nivel Inicial (4 Cursos)">
                  {inicialCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.enrollmentCount} estudiantes)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Nivel Primaria (6 Cursos)">
                  {primariaCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.enrollmentCount} estudiantes)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Nivel Secundaria (6 Cursos)">
                  {secundariaCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.enrollmentCount} estudiantes)
                    </option>
                  ))}
                </optgroup>
              </select>

              {activeCourse && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-900 text-amber-400 text-xs py-1 px-2.5">
                    Capacidad: {activeCourse.enrollmentCount} / {activeCourse.maxCapacity}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-slate-600">
                    Aula Oficial
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-brand-600" />
                Seleccionar Docente:
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="flex-1 max-w-md h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.lastName} {t.firstName} — {t.specialty}
                  </option>
                ))}
              </select>

              {selectedTeacher && (
                <Badge className="bg-slate-900 text-white text-xs py-1 px-2.5">
                  Ítem: {selectedTeacher.itemNumber || 'N/A'}
                </Badge>
              )}
            </div>
          )}

          <div className="text-xs text-slate-500 flex items-center gap-2 self-end md:self-center font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            6 períodos pedagógicos / 30 sesiones por curso
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="animate-spin w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Cargando horario oficial...</p>
        </div>
      ) : activeSchedules.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No hay horarios registrados</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {myData?.message || 'Actualmente no se han programado sesiones lectivas para el curso asignado.'}
          </p>
        </div>
      ) : (
        /* Timetable Grid */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-900 text-white text-xs">
                  <th className="py-3 px-4 text-left font-bold w-36 uppercase tracking-wider border-r border-slate-800">
                    Período / Hora
                  </th>
                  {DAYS.map((d) => (
                    <th
                      key={d.key}
                      className="py-3 px-4 text-center font-bold uppercase tracking-wider border-r border-slate-800 last:border-r-0"
                    >
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {PERIODS.map((period, idx) => {
                  if (period.isBreak) {
                    return (
                      <tr key={`break-${idx}`} className="bg-amber-50/70 border-y border-amber-200/70">
                        <td className="py-2 px-4 font-mono font-bold text-amber-800 border-r border-amber-200/70">
                          {period.start} - {period.end}
                        </td>
                        <td colSpan={5} className="py-2 px-4 text-center font-semibold text-amber-900 tracking-wide">
                          {period.label}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={`period-${period.index}`} className="hover:bg-slate-50/50 transition-colors">
                      {/* Period header */}
                      <td className="py-3 px-4 border-r border-slate-200 bg-slate-50/60">
                        <div className="font-bold text-slate-900">{period.label}</div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {period.start} - {period.end}
                        </div>
                      </td>

                      {/* Day Cells */}
                      {DAYS.map((day) => {
                        const session = scheduleMatrix.get(`${day.key}_${period.index}`);
                        if (!session) {
                          return (
                            <td
                              key={day.key}
                              className="py-3 px-3 text-center border-r border-slate-200 last:border-r-0 bg-slate-50/30"
                            >
                              <span className="text-slate-300 italic text-[11px]">— Libre —</span>
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
                              className={`p-2.5 rounded-xl border ${color.bg} ${color.border} shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-full min-h-[72px]`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span
                                    className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/80 border ${color.border} ${color.text}`}
                                  >
                                    {session.subject?.code}
                                  </span>
                                  {session.classroom && (
                                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                                      <MapPin className="w-2.5 h-2.5" />
                                      {session.classroom}
                                    </span>
                                  )}
                                </div>
                                <div className={`font-bold leading-tight line-clamp-2 ${color.text}`}>
                                  {session.subject?.name}
                                </div>
                              </div>

                              <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px] text-slate-600">
                                {isParentOrStudent || viewMode === 'course' ? (
                                  <span className="font-medium truncate flex items-center gap-1">
                                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                                    Prof. {session.teacher?.lastName}
                                  </span>
                                ) : (
                                  <span className="font-medium truncate flex items-center gap-1 text-slate-900 font-semibold">
                                    <GraduationCap className="w-3 h-3 text-slate-500 shrink-0" />
                                    {session.course?.name}
                                  </span>
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

      {/* Footer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Asignaturas Programadas</div>
            <div className="text-lg font-bold text-slate-900">
              {isParentOrStudent || viewMode === 'course'
                ? `${new Set(activeSchedules.map((s) => s.subjectId)).size} Materias Oficiales`
                : `${new Set(activeSchedules.map((s) => s.courseId)).size} Cursos Asignados`}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Carga Semanal Total</div>
            <div className="text-lg font-bold text-slate-900">
              {activeSchedules.length} Períodos ({activeSchedules.length * 45} min/sem)
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Normativa Curricular</div>
            <div className="text-lg font-bold text-slate-900">R.M. 1040/2022 Aprobada</div>
          </div>
        </div>
      </div>
    </div>
  );
};
