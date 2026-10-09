import { useState, useMemo, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  List,
  Loader2,
  Lock,
  LockOpen,
  Plus,
  Save,
  Search,
  Users,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { academicApi, Grade, Student, Course, Subject, Period } from '../../../lib/academic-api';
import { authService } from '../../auth/services/auth.service';

const gradeFormSchema = z.object({
  enrollmentId: z.string().uuid('Selecciona una matrícula'),
  studentId: z.string().uuid('Selecciona un estudiante'),
  subjectId: z.string().uuid('Selecciona una materia'),
  periodId: z.string().uuid('Selecciona un periodo'),
  value: z.coerce.number().min(0, 'Mínimo 0').max(100, 'Máximo 100'),
  remarks: z.string().optional(),
  reason: z.string().optional(),
});
type GradeFormData = z.infer<typeof gradeFormSchema>;

function getLey070Scale(value: number): { label: string; badgeClass: string } {
  if (value >= 85) return { label: 'Desarrollo Pleno', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (value >= 69) return { label: 'Desarrollo Óptimo', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (value >= 51) return { label: 'Desarrollo Aceptable', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'En Desarrollo', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
}

export const GradesPage = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'ROSTER' | 'LIST'>('ROSTER');
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [search, setSearch] = useState('');

  // Course Roster State (BP-12 Planilla Grupal)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [rosterGrades, setRosterGrades] = useState<Record<string, number>>({});
  const [rosterRemarks, setRosterRemarks] = useState<Record<string, string>>({});
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [bulkFeedback, setBulkFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentUser = authService.getCurrentUser();
  const canEdit = ['ADMIN', 'DIRECTOR', 'SECRETARY', 'TEACHER'].includes(currentUser?.role ?? '');
  const isPrivileged = ['ADMIN', 'DIRECTOR'].includes(currentUser?.role ?? '');

  const gradesQuery = useQuery({ queryKey: ['grades'], queryFn: () => academicApi.listGrades() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses() });
  const subjectsQuery = useQuery({ queryKey: ['subjects'], queryFn: () => academicApi.listSubjects() });
  const periodsQuery = useQuery({ queryKey: ['periods'], queryFn: () => academicApi.listPeriods() });

  const courses: Course[] = useMemo(() => coursesQuery.data?.data ?? [], [coursesQuery.data]);
  const subjects: Subject[] = useMemo(() => subjectsQuery.data ?? [], [subjectsQuery.data]);
  const periods: Period[] = useMemo(() => periodsQuery.data ?? [], [periodsQuery.data]);
  const students: Student[] = useMemo(() => studentsQuery.data?.data ?? [], [studentsQuery.data]);
  const grades: Grade[] = useMemo(() => gradesQuery.data?.data ?? [], [gradesQuery.data]);

  // Set default filters for Roster
  useMemo(() => {
    if (!selectedCourseId && courses.length > 0) setSelectedCourseId(courses[0].id);
    if (!selectedSubjectId && subjects.length > 0) setSelectedSubjectId(subjects[0].id);
    if (!selectedPeriodId && periods.length > 0) setSelectedPeriodId(periods[0].id);
  }, [courses, subjects, periods, selectedCourseId, selectedSubjectId, selectedPeriodId]);

  const activePeriod = useMemo(() => periods.find((p) => p.id === selectedPeriodId), [periods, selectedPeriodId]);
  const activeCourse = useMemo(() => courses.find((c) => c.id === selectedCourseId), [courses, selectedCourseId]);

  // Students enrolled in selected course
  const enrolledStudents = useMemo(() => {
    if (!selectedCourseId) return [];
    return students.filter((st) =>
      st.enrollments?.some((en) => en.course?.id === selectedCourseId && en.status === 'ACTIVE'),
    );
  }, [students, selectedCourseId]);

  // Populate roster with existing grades when selection changes
  useMemo(() => {
    if (!selectedCourseId || !selectedSubjectId || !selectedPeriodId) return;
    const initialValues: Record<string, number> = {};
    const initialRemarks: Record<string, string> = {};

    enrolledStudents.forEach((st) => {
      const match = grades.find(
        (g) => g.studentId === st.id && g.subjectId === selectedSubjectId && g.periodId === selectedPeriodId,
      );
      if (match) {
        initialValues[st.id] = match.value;
        if (match.remarks) initialRemarks[st.id] = match.remarks;
      }
    });
    setRosterGrades(initialValues);
    setRosterRemarks(initialRemarks);
  }, [selectedCourseId, selectedSubjectId, selectedPeriodId, enrolledStudents, grades]);

  // Single form
  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: { enrollmentId: '', studentId: '', subjectId: '', periodId: '', value: 0, remarks: '', reason: '' },
  });

  const createSingleMutation = useMutation({
    mutationFn: academicApi.createGrade,
    onSuccess: () => {
      form.reset();
      setShowSingleForm(false);
      void queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });

  // Bulk save mutation (RF-20)
  const bulkSaveMutation = useMutation({
    mutationFn: async () => {
      setBulkFeedback(null);
      if (activePeriod?.isClosed && !isPrivileged) {
        throw new Error('El período de evaluación se encuentra cerrado. Modificaciones ordinarias no permitidas.');
      }
      if (activePeriod?.isClosed && isPrivileged && !correctionReason.trim()) {
        throw new Error('Debe especificar obligatoriamente el motivo de autorización para asentar notas en un período cerrado.');
      }

      const gradesToSubmit = enrolledStudents
        .map((st) => {
          const activeEnrollment = st.enrollments?.find((e) => e.course?.id === selectedCourseId);
          if (!activeEnrollment) return null;
          const val = rosterGrades[st.id];
          if (val === undefined || isNaN(val)) return null;

          return {
            studentId: st.id,
            enrollmentId: activeEnrollment.id,
            value: Number(val),
            remarks: rosterRemarks[st.id] || correctionReason,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (gradesToSubmit.length === 0) {
        throw new Error('No hay calificaciones ingresadas para guardar.');
      }

      return academicApi.createBulkGrades({
        courseId: selectedCourseId,
        subjectId: selectedSubjectId,
        periodId: selectedPeriodId,
        grades: gradesToSubmit,
        reason: correctionReason || undefined,
      });
    },
    onSuccess: (data) => {
      setBulkFeedback({
        type: 'success',
        message: `Planilla guardada exitosamente: ${data.data.count} notas asentadas con trazabilidad.`,
      });
      void queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (err: unknown) => {
      setBulkFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al guardar la planilla de calificaciones.',
      });
    },
  });

  // Toggle period closure mutation (RF-18, RF-22)
  const togglePeriodClosureMutation = useMutation({
    mutationFn: async (period: Period) => {
      return academicApi.updatePeriod(period.id, { isClosed: !period.isClosed });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['periods'] });
    },
  });

  const filteredGrades = grades.filter((g) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      g.student.firstName.toLowerCase().includes(term) ||
      g.student.lastName.toLowerCase().includes(term) ||
      g.subject.name.toLowerCase().includes(term) ||
      g.period.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gestión de Calificaciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {grades.length} notas registradas · Escala Ministerial Ley 070 (0–100 pts)
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('ROSTER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'ROSTER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Planilla por Curso (Carga Grupal)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista de Calificaciones
            </button>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={() => setShowSingleForm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              {showSingleForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showSingleForm ? 'Cerrar' : 'Nota Individual'}
            </button>
          )}
        </div>
      </div>

      {/* Ley 070 Scale Reference */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Desarrollo Pleno', range: '85-100 pts', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
          { label: 'Desarrollo Óptimo', range: '69-84 pts', color: 'bg-blue-50 text-blue-800 border-blue-200' },
          { label: 'Desarrollo Aceptable', range: '51-68 pts', color: 'bg-amber-50 text-amber-800 border-amber-200' },
          { label: 'En Desarrollo', range: '1-50 pts', color: 'bg-rose-50 text-rose-800 border-rose-200' },
        ].map((item) => (
          <div key={item.label} className={`p-2.5 rounded-lg border ${item.color}`}>
            <span className="text-xs font-semibold">{item.label}</span>
            <p className="text-xs font-bold font-mono mt-0.5">{item.range}</p>
          </div>
        ))}
      </div>

      {/* Single Grade Form Modal */}
      {showSingleForm && canEdit && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Asentar Calificación Individual</h2>
          <form onSubmit={form.handleSubmit((data) => createSingleMutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField label="Estudiante" error={form.formState.errors.studentId?.message} {...form.register('studentId')}>
                <option value="">Seleccione estudiante...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.lastName}, {s.firstName} ({s.rude})
                  </option>
                ))}
              </SelectField>

              <SelectField label="Matrícula" error={form.formState.errors.enrollmentId?.message} {...form.register('enrollmentId')}>
                <option value="">Seleccione matrícula...</option>
                {students
                  .find((s) => s.id === form.watch('studentId'))
                  ?.enrollments?.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.course.name} - {e.academicYear.year}
                    </option>
                  ))}
              </SelectField>

              <SelectField label="Asignatura" error={form.formState.errors.subjectId?.message} {...form.register('subjectId')}>
                <option value="">Seleccione materia...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </SelectField>

              <SelectField label="Periodo" error={form.formState.errors.periodId?.message} {...form.register('periodId')}>
                <option value="">Seleccione periodo...</option>
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isClosed ? '(CERRADO)' : '(ABIERTO)'}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Calificación (0 - 100)" error={form.formState.errors.value?.message}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...form.register('value')}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-mono font-bold"
                />
              </Field>

              <Field label="Observación">
                <input
                  type="text"
                  placeholder="Opcional..."
                  {...form.register('remarks')}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </Field>

              <Field label="Motivo de Autorización (si está cerrado)">
                <input
                  type="text"
                  placeholder="Requerido si el periodo está cerrado..."
                  {...form.register('reason')}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSingleForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={createSingleMutation.isPending}>
                {createSingleMutation.isPending ? 'Guardando...' : 'Asentar Nota'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW MODE: ROSTER / PLANILLA DE CURSO (BP-12, RF-20) */}
      {viewMode === 'ROSTER' && (
        <div className="space-y-4">
          {/* Roster Selectors and Period Control */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Curso / Paralelo:</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-800"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.shift === 'MORNING' ? 'Mañana' : 'Tarde'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Materia / Asignatura:</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-800"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Periodo de Evaluación:</label>
                  <select
                    value={selectedPeriodId}
                    onChange={(e) => setSelectedPeriodId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-800"
                  >
                    {periods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.isClosed ? '🔒 CERRADO' : '🟢 ABIERTO'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Period Status & Admin Toggle (RF-18, RF-22) */}
              <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {activePeriod && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    activePeriod.isClosed
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {activePeriod.isClosed ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
                    {activePeriod.isClosed ? 'Periodo Cerrado' : 'Periodo Abierto'}
                  </div>
                )}

                {isPrivileged && activePeriod && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => togglePeriodClosureMutation.mutate(activePeriod)}
                    disabled={togglePeriodClosureMutation.isPending}
                    className="text-xs gap-1"
                  >
                    {activePeriod.isClosed ? 'Reabrir Periodo' : 'Cerrar Periodo'}
                  </Button>
                )}
              </div>
            </div>

            {/* Warning if period is closed */}
            {activePeriod?.isClosed && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    El período {activePeriod.name} está cerrado (RN-07). Solo Dirección puede asentar correcciones justificadas (RN-08).
                  </span>
                </div>
                {isPrivileged && (
                  <input
                    type="text"
                    placeholder="Motivo de autorización formal (Obligatorio)..."
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    className="h-8 rounded border border-amber-300 bg-white px-2.5 text-xs text-slate-800 w-full sm:w-72 font-medium"
                  />
                )}
              </div>
            )}

            {/* Feedback message */}
            {bulkFeedback && (
              <div className={`mt-3 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                bulkFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {bulkFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{bulkFeedback.message}</span>
              </div>
            )}
          </div>

          {/* Roster Table (BP-12) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Nómina de Estudiantes ({enrolledStudents.length} matriculados en {activeCourse?.name || 'curso'})
                </span>
              </div>

              {canEdit && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => bulkSaveMutation.mutate()}
                  disabled={bulkSaveMutation.isPending || (activePeriod?.isClosed && !isPrivileged)}
                  className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {bulkSaveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {bulkSaveMutation.isPending ? 'Guardando Planilla...' : 'Guardar Calificaciones del Curso'}
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 pl-4 pr-2 w-12 text-center">N°</th>
                    <th className="px-3 py-3 w-36">RUDE</th>
                    <th className="px-3 py-3">Estudiante</th>
                    <th className="px-3 py-3 w-28 text-center">Nota (0–100)</th>
                    <th className="px-3 py-3 w-40 text-center">Escala Ley 070</th>
                    <th className="px-3 py-3 pr-4">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {enrolledStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                        No hay estudiantes con matrícula activa en este curso.
                      </td>
                    </tr>
                  ) : (
                    enrolledStudents.map((st, idx) => {
                      const currentVal = rosterGrades[st.id] ?? 0;
                      const scale = getLey070Scale(currentVal);
                      const isPassing = currentVal >= 51;

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 pl-4 pr-2 text-center text-xs font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-slate-600">
                            {st.rude}
                          </td>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold text-slate-900">
                              {st.lastName}, {st.firstName}
                            </p>
                            <span className="text-xs text-slate-400">CI: {st.ci}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={rosterGrades[st.id] !== undefined ? rosterGrades[st.id] : ''}
                              disabled={!canEdit || (activePeriod?.isClosed && !isPrivileged)}
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : Math.max(0, Math.min(100, Number(e.target.value)));
                                setRosterGrades((prev) => ({ ...prev, [st.id]: val }));
                              }}
                              className={`w-20 h-9 rounded-lg border text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                                isPassing ? 'border-slate-300 text-slate-900 bg-white' : 'border-rose-300 text-rose-700 bg-rose-50/30'
                              } disabled:bg-slate-100 disabled:text-slate-400`}
                            />
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${scale.badgeClass}`}>
                              {scale.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 pr-4">
                            <input
                              type="text"
                              placeholder="Opcional..."
                              value={rosterRemarks[st.id] || ''}
                              disabled={!canEdit || (activePeriod?.isClosed && !isPrivileged)}
                              onChange={(e) => {
                                const txt = e.target.value;
                                setRosterRemarks((prev) => ({ ...prev, [st.id]: txt }));
                              }}
                              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:outline-none focus:border-slate-400 disabled:bg-slate-100"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: LIST / HISTORIAL DE NOTAS */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por estudiante o materia..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Mostrando {filteredGrades.length} de {grades.length} notas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Materia</th>
                  <th className="px-3 py-3">Periodo</th>
                  <th className="px-3 py-3 text-center">Nota</th>
                  <th className="px-3 py-3 text-center">Escala Ley 070</th>
                  <th className="py-3 pl-3 pr-5 text-right">Actualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      No se encontraron calificaciones registradas.
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((grade) => {
                    const scale = getLey070Scale(grade.value);
                    const isPassing = grade.value >= 51;
                    return (
                      <tr key={grade.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-5 pr-3">
                          <p className="font-medium text-slate-900">
                            {grade.student.lastName}, {grade.student.firstName}
                          </p>
                          <span className="font-mono text-xs text-slate-400">{grade.student.rude}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {grade.subject.name}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600 font-mono text-xs">
                          {grade.period.name}
                        </td>
                        <td className="px-3 py-3 text-center font-mono">
                          <span className={`text-base font-bold tabular-nums ${isPassing ? 'text-slate-900' : 'text-rose-600'}`}>
                            {grade.value}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${scale.badgeClass}`}>
                            {scale.label}
                          </span>
                        </td>
                        <td className="py-3 pl-3 pr-5 text-right font-mono text-slate-400 text-xs">
                          {new Date(grade.updatedAt).toLocaleDateString('es-BO')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}

const SelectField = ({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => (
  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
    <span>{label}</span>
    <select
      {...props}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      {children}
    </select>
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>
);
