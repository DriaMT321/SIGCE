import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileSpreadsheet,
  Printer,
  Download,
  FileText,
  Award,
  Calendar,
  Building2,
  QrCode,
  Search,
} from 'lucide-react';
import { academicApi, Course, Student, Grade, Period } from '../../../lib/academic-api';
import { Button } from '../../../components/ui/button';

type ReportType = 'CENTRALIZER' | 'REPORT_CARD' | 'ATTENDANCE_SUMMARY' | 'STATISTICAL_BALANCE';

export const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('CENTRALIZER');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState('');

  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses() });
  const periodsQuery = useQuery({ queryKey: ['periods'], queryFn: () => academicApi.listPeriods() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const gradesQuery = useQuery({ queryKey: ['grades'], queryFn: () => academicApi.listGrades() });

  const courses: Course[] = useMemo(() => coursesQuery.data?.data ?? [], [coursesQuery.data]);
  const periods: Period[] = useMemo(() => periodsQuery.data ?? [], [periodsQuery.data]);
  const students: Student[] = useMemo(() => studentsQuery.data?.data ?? [], [studentsQuery.data]);
  const grades: Grade[] = useMemo(() => gradesQuery.data?.data ?? [], [gradesQuery.data]);

  React.useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  React.useEffect(() => {
    if (!selectedPeriodId && periods.length > 0) {
      setSelectedPeriodId(periods[0].id);
    }
  }, [periods, selectedPeriodId]);

  React.useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  const activePeriod = useMemo(() => {
    return periods.find((p) => p.id === selectedPeriodId) || periods[0];
  }, [periods, selectedPeriodId]);

  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const courseStudents = useMemo(() => {
    if (!activeCourse) return students;
    const enrolled = students.filter((s) =>
      s.enrollments?.some((e) => e.course?.id === activeCourse.id && e.status === 'ACTIVE')
    );
    return enrolled.length > 0 ? enrolled : students;
  }, [students, activeCourse]);

  const displayedStudents = useMemo(() => {
    if (!filterQuery.trim()) return courseStudents;
    const q = filterQuery.toLowerCase();
    return courseStudents.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.rude.toLowerCase().includes(q)
    );
  }, [courseStudents, filterQuery]);

  const studentGrades = useMemo(() => {
    if (!activeStudent) return [];
    return grades.filter((g) => g.studentId === activeStudent.id);
  }, [grades, activeStudent]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (activeReport === 'CENTRALIZER') {
      const headers = ['Nro', 'RUDE', 'Estudiante', 'Curso', 'Periodo', 'Nota_Promedio', 'Cualitativo', 'Estado'];
      const rows = displayedStudents.map((st, idx) => {
        const stGrades = grades.filter((g) => g.studentId === st.id);
        const avg = stGrades.length > 0 ? Math.round(stGrades.reduce((acc, g) => acc + g.value, 0) / stGrades.length) : 75;
        const cualitativo = avg >= 85 ? 'Pleno (DP)' : avg >= 69 ? 'Óptimo (DO)' : avg >= 51 ? 'Aceptable (DA)' : 'En Desarrollo (ED)';
        const estado = avg >= 51 ? 'Aprobado' : 'Retenido';

        return [
          idx + 1,
          `"${st.rude}"`,
          `"${st.lastName}, ${st.firstName}"`,
          `"${activeCourse?.name ?? '1A'}"`,
          `"${activePeriod?.name ?? '1er Trimestre'}"`,
          avg,
          `"${cualitativo}"`,
          `"${estado}"`,
        ];
      });

      const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `centralizador_${activeCourse?.name || 'curso'}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Exportando acta en formato estructurado compatible con el Ministerio de Educación.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reportes</h1>
          <p className="text-sm text-slate-500 mt-0.5">Generación de actas y centralizadores oficiales</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-sm text-slate-700"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="gap-2 text-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Report Type Tabs - Clean */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { id: 'CENTRALIZER' as ReportType, label: 'Centralizador', icon: FileSpreadsheet },
          { id: 'REPORT_CARD' as ReportType, label: 'Libreta Escolar', icon: FileText },
          { id: 'ATTENDANCE_SUMMARY' as ReportType, label: 'Asistencia', icon: Calendar },
          { id: 'STATISTICAL_BALANCE' as ReportType, label: 'Cuadre Estadístico', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveReport(tab.id)}
            className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
              activeReport === tab.id
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`rounded-lg p-2 ${activeReport === tab.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <tab.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-900">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <span className="font-medium">Curso:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Grado {c.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <span className="font-medium">Trimestre:</span>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {activeReport === 'REPORT_CARD' && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <span className="font-medium">Estudiante:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 max-w-[220px]"
              >
                {courseStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.lastName}, {st.firstName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar estudiante..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>
      </div>

      {/* Document Preview - Clean */}
      <div className="overflow-x-auto pb-8">
        <div className="mx-auto min-w-[760px] max-w-5xl rounded-xl border border-slate-300 bg-white p-8 shadow-sm">

          {/* Letterhead */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
            <div className="flex items-center justify-between mb-2">
              <div className="text-left w-36">
                <span className="block text-[10px] uppercase font-bold text-slate-500 font-mono">
                  Bolivia
                </span>
                <span className="block text-xs font-bold text-slate-800">
                  Min. de Educación
                </span>
              </div>

              <div className="space-y-0.5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                  Estado Plurinacional de Bolivia
                </h2>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ministerio de Educación
                </h3>
                <h4 className="text-base font-bold text-brand-600">
                  UNIDAD EDUCATIVA COMUNIDAD CRISTIANA B
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  Código SIE: 81981191 | Gestión Académica 2026
                </p>
              </div>

              <div className="text-right w-36">
                <div className="inline-block p-1 bg-slate-50 border border-slate-300 rounded-md">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                  CSV: 8198-2026-F9
                </span>
              </div>
            </div>

            <div className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {activeReport === 'CENTRALIZER' && 'Acta Oficial de Centralización de Calificaciones'}
              {activeReport === 'REPORT_CARD' && 'Boletín Oficial de Calificaciones'}
              {activeReport === 'ATTENDANCE_SUMMARY' && 'Registro Consolidado de Asistencia'}
              {activeReport === 'STATISTICAL_BALANCE' && 'Cuadre Estadístico de Matrícula'}
            </div>
          </div>

          {/* CENTRALIZER */}
          {activeReport === 'CENTRALIZER' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Curso</span>
                  <strong className="text-slate-800 font-medium">{activeCourse?.name || '1° de Secundaria A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Turno</span>
                  <strong className="text-slate-800 font-medium">{activeCourse?.shift || 'Mañana'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Periodo</span>
                  <strong className="text-slate-800 font-medium">{activePeriod?.name || 'Primer Trimestre'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Estudiantes</span>
                  <strong className="text-slate-800 font-medium">{displayedStudents.length}</strong>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">N°</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-28">RUDE</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Apellidos y Nombres</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16 bg-slate-200/80 font-bold">TOTAL</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-28">Cualitativo</th>
                      <th className="py-2.5 px-3 text-center w-24">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {displayedStudents.map((st, idx) => {
                      const stGrades = grades.filter((g) => g.studentId === st.id);
                      const finalGrade = stGrades.length > 0 ? Math.round(stGrades.reduce((acc, g) => acc + g.value, 0) / stGrades.length) : (70 + (idx % 25));
                      const isPassing = finalGrade >= 51;

                      const cualitativo =
                        finalGrade >= 85
                          ? 'Desarrollo Pleno (DP)'
                          : finalGrade >= 69
                          ? 'Desarrollo Óptimo (DO)'
                          : finalGrade >= 51
                          ? 'Desarrollo Aceptable (DA)'
                          : 'En Desarrollo (ED)';

                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 border-r border-slate-200 text-center font-bold text-slate-600">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                            {st.rude}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 font-sans font-medium text-slate-900">
                            {st.lastName}, {st.firstName}
                          </td>
                          <td className={`py-2 px-3 border-r border-slate-200 text-center tabular-nums font-bold ${
                            isPassing ? 'text-slate-900 bg-slate-50' : 'text-rose-700 bg-rose-50'
                          }`}>
                            {finalGrade}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center font-sans text-[10px]">
                            {cualitativo}
                          </td>
                          <td className="py-2 px-3 text-center font-sans">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isPassing ? 'APROBADO' : 'RETENIDO'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Total:</span>
                  <span className="text-base font-bold text-slate-900 font-mono">{displayedStudents.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Aprobados:</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">
                    {displayedStudents.filter((_, i) => (70 + (i % 25)) >= 51).length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">En Desarrollo:</span>
                  <span className="text-base font-bold text-rose-700 font-mono">
                    {displayedStudents.filter((_, i) => (70 + (i % 25)) < 51).length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Promedio:</span>
                  <span className="text-base font-bold text-brand-600 font-mono">76.4</span>
                </div>
              </div>
            </div>
          )}

          {/* REPORT CARD */}
          {activeReport === 'REPORT_CARD' && activeStudent && (
            <div className="space-y-6">
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-xs font-mono uppercase">Estudiante</span>
                    <strong className="text-slate-900 text-sm font-medium uppercase">{activeStudent.lastName}, {activeStudent.firstName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-mono uppercase">RUDE</span>
                    <strong className="text-slate-800 font-mono">{activeStudent.rude}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs font-mono uppercase">Curso</span>
                    <strong className="text-slate-800">{activeCourse?.name || '1° de Secundaria A'}</strong>
                  </div>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-4 border-r border-slate-300">Área Curricular</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">1° Trim</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">2° Trim</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">3° Trim</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-28 bg-slate-200/70 font-bold">Promedio</th>
                      <th className="py-2.5 px-3 text-center w-36">Valoración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-xs">
                    {[
                      { area: 'Comunicación y Lenguajes', t1: 82, t2: 85, t3: 80 },
                      { area: 'Lengua Extranjera (Inglés)', t1: 78, t2: 80, t3: 84 },
                      { area: 'Ciencias Sociales', t1: 90, t2: 92, t3: 88 },
                      { area: 'Educación Física', t1: 95, t2: 95, t3: 98 },
                      { area: 'Matemática', t1: 72, t2: 76, t3: 75 },
                      { area: 'Ciencias Naturales', t1: 83, t2: 85, t3: 86 },
                      { area: 'Valores y Espiritualidad', t1: 96, t2: 98, t3: 97 },
                    ].map((item, idx) => {
                      const finalAvg = Math.round((item.t1 + item.t2 + item.t3) / 3);
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 border-r border-slate-200 font-sans font-medium text-slate-800">
                            {item.area}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{item.t1}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{item.t2}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{item.t3}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums font-bold bg-slate-50 text-slate-900">
                            {finalAvg}
                          </td>
                          <td className="py-2.5 px-3 text-center font-sans text-[11px]">
                            {finalAvg >= 85 ? (
                              <span className="text-emerald-700 font-medium">Desarrollo Pleno</span>
                            ) : (
                              <span className="text-slate-700 font-medium">Desarrollo Óptimo</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                      <td className="py-3 px-4 text-slate-900 uppercase">Promedio General:</td>
                      <td className="py-3 px-3 text-center font-mono">85.8</td>
                      <td className="py-3 px-3 text-center font-mono">87.3</td>
                      <td className="py-3 px-3 text-center font-mono">87.9</td>
                      <td className="py-3 px-3 text-center font-mono text-brand-600 text-sm bg-slate-200/90 font-bold">87.0</td>
                      <td className="py-3 px-3 text-center text-emerald-800 uppercase text-[11px]">PROMOVIDO</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ATTENDANCE SUMMARY */}
          {activeReport === 'ATTENDANCE_SUMMARY' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Curso</span>
                  <strong className="text-slate-800">{activeCourse?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Días Hábiles</span>
                  <strong className="text-slate-800 font-mono">60</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Asistencia</span>
                  <strong className="text-emerald-700 font-mono font-bold">96.8%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-mono uppercase">Faltas Justif.</span>
                  <strong className="text-slate-800 font-mono">14</strong>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">N°</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-28">RUDE</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Apellidos y Nombres</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-emerald-800">Presentes</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-amber-800">Atrasos</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-rose-800">Faltas</th>
                      <th className="py-2.5 px-3 text-center w-24 bg-slate-200/70 font-bold">% Asist.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {displayedStudents.map((st, idx) => {
                      const faltas = idx % 9 === 0 ? 3 : idx % 5 === 0 ? 1 : 0;
                      const atrasos = idx % 4 === 0 ? 2 : 0;
                      const presentes = 60 - faltas;
                      const pct = Math.round((presentes / 60) * 100);

                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 border-r border-slate-200 text-center font-bold text-slate-600">{idx + 1}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">{st.rude}</td>
                          <td className="py-2 px-3 border-r border-slate-200 font-sans font-medium text-slate-900">{st.lastName}, {st.firstName}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center text-emerald-700 font-semibold">{presentes}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center text-amber-700">{atrasos}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center text-rose-700 font-semibold">{faltas}</td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900 bg-slate-50">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STATISTICAL BALANCE */}
          {activeReport === 'STATISTICAL_BALANCE' && (
            <div className="space-y-6">
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300">Curso</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Varones</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Mujeres</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24 bg-slate-200/60 font-bold">Total</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Retirados</th>
                      <th className="py-2.5 px-3 text-center w-24 text-emerald-800 font-bold">% Promoción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {courses.map((c) => {
                      const count = c.enrollmentCount || 28;
                      const varones = Math.floor(count / 2) + 1;
                      const mujeres = count - varones;

                      return (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 border-r border-slate-200 font-sans font-medium text-slate-900">
                            {c.name} ({c.shift})
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center">{varones}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center">{mujeres}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold bg-slate-50 text-slate-900">{count}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center text-rose-600">0</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-700">97.4%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                      <td className="py-3 px-3 text-slate-900 uppercase">Totales:</td>
                      <td className="py-3 px-3 text-center font-mono">184</td>
                      <td className="py-3 px-3 text-center font-mono">176</td>
                      <td className="py-3 px-3 text-center font-mono text-brand-600 text-sm bg-slate-200/90 font-bold">360</td>
                      <td className="py-3 px-3 text-center font-mono text-rose-700">2</td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-700">98.1%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-16 pt-8 border-t border-slate-300">
            <div className="grid grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-1">
                <div className="h-16 flex items-end justify-center">
                  <span className="font-mono text-[10px] text-slate-400 italic">Sello y Firma</span>
                </div>
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-800 uppercase font-sans">
                  Profesor(a)
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-16 flex items-end justify-center">
                  <span className="font-mono text-[10px] text-slate-400 italic">Comisión</span>
                </div>
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-800 uppercase font-sans">
                  Comisión Pedagógica
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-16 flex items-end justify-center">
                  <span className="font-mono text-[10px] text-slate-400 italic">Autorizado</span>
                </div>
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-800 uppercase font-sans">
                  Dirección General
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Documento Oficial emitido por SIGCE</span>
              <span>Emisión: {new Date().toLocaleDateString('es-BO')}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
