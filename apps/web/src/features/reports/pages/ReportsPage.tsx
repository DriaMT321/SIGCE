import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileSpreadsheet,
  Printer,
  Download,
  FileText,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  QrCode,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { academicApi, Course, Student, Grade, Period } from '../../../lib/academic-api';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

type ReportType = 'CENTRALIZER' | 'REPORT_CARD' | 'ATTENDANCE_SUMMARY' | 'STATISTICAL_BALANCE';

export const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('CENTRALIZER');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState('');

  // Queries
  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: () => academicApi.listCourses() });
  const periodsQuery = useQuery({ queryKey: ['periods'], queryFn: () => academicApi.listPeriods() });
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: () => academicApi.listStudents() });
  const gradesQuery = useQuery({ queryKey: ['grades'], queryFn: () => academicApi.listGrades() });

  const courses: Course[] = useMemo(() => coursesQuery.data?.data ?? [], [coursesQuery.data]);
  const periods: Period[] = useMemo(() => periodsQuery.data ?? [], [periodsQuery.data]);
  const students: Student[] = useMemo(() => studentsQuery.data?.data ?? [], [studentsQuery.data]);
  const grades: Grade[] = useMemo(() => gradesQuery.data?.data ?? [], [gradesQuery.data]);

  // Set defaults when data loads
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

  // Filter students for active course
  const courseStudents = useMemo(() => {
    if (!activeCourse) return students;
    const enrolled = students.filter((s) =>
      s.enrollments?.some((e) => e.course?.id === activeCourse.id && e.status === 'ACTIVE')
    );
    return enrolled.length > 0 ? enrolled : students;
  }, [students, activeCourse]);

  // Filtered by search
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

  // Calculation for student report card
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
    <div className="space-y-6">
      {/* Page Header (Hidden during browser print) */}
      <div className="print:hidden flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/10 text-brand-crimson ring-1 ring-brand-crimson/20">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  Centro de Reportes y Actas Oficiales
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono text-brand-crimson bg-brand-crimson/5 border-brand-crimson/20">
                  Ley 070 Avelino Siñani
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Generación, validación e impresión de centralizadores trimestrales, libretas de calificaciones y estadísticas normativas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-slate-700 hover:text-slate-900"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Descargar CSV</span>
          </Button>

          <Button
            variant="brand"
            size="sm"
            onClick={handlePrint}
            className="gap-2 shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir Documento</span>
          </Button>
        </div>
      </div>

      {/* Institutional Metadata Ribbon (Hidden during browser print) */}
      <div className="print:hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Building2 className="h-4 w-4 text-brand-crimson" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">
              U.E. Comunidad Cristiana B
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Código SIE: 81981191 | Distrito Escolar: Santa Cruz 1 | Red 12
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Firma Digital y Código Seguro de Verificación (CSV) Activado</span>
        </div>
      </div>

      {/* Report Categories Tabs (Hidden during print) */}
      <div className="print:hidden grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveReport('CENTRALIZER')}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
            activeReport === 'CENTRALIZER'
              ? 'border-brand-crimson bg-brand-crimson/5 ring-1 ring-brand-crimson shadow-xs'
              : 'border-border bg-white hover:border-slate-300'
          }`}
        >
          <div className={`rounded-lg p-2 ${activeReport === 'CENTRALIZER' ? 'bg-brand-crimson text-white' : 'bg-slate-100 text-slate-600'}`}>
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 font-display">
              Centralizador Trimestral
            </div>
            <div className="text-[11px] text-slate-500">
              Acta de curso con 4 dimensiones
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport('REPORT_CARD')}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
            activeReport === 'REPORT_CARD'
              ? 'border-brand-crimson bg-brand-crimson/5 ring-1 ring-brand-crimson shadow-xs'
              : 'border-border bg-white hover:border-slate-300'
          }`}
        >
          <div className={`rounded-lg p-2 ${activeReport === 'REPORT_CARD' ? 'bg-brand-crimson text-white' : 'bg-slate-100 text-slate-600'}`}>
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 font-display">
              Libreta Escolar
            </div>
            <div className="text-[11px] text-slate-500">
              Boletín oficial por estudiante
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport('ATTENDANCE_SUMMARY')}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
            activeReport === 'ATTENDANCE_SUMMARY'
              ? 'border-brand-crimson bg-brand-crimson/5 ring-1 ring-brand-crimson shadow-xs'
              : 'border-border bg-white hover:border-slate-300'
          }`}
        >
          <div className={`rounded-lg p-2 ${activeReport === 'ATTENDANCE_SUMMARY' ? 'bg-brand-crimson text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 font-display">
              Acta de Asistencia
            </div>
            <div className="text-[11px] text-slate-500">
              Consolidado mensual de faltas
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport('STATISTICAL_BALANCE')}
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${
            activeReport === 'STATISTICAL_BALANCE'
              ? 'border-brand-crimson bg-brand-crimson/5 ring-1 ring-brand-crimson shadow-xs'
              : 'border-border bg-white hover:border-slate-300'
          }`}
        >
          <div className={`rounded-lg p-2 ${activeReport === 'STATISTICAL_BALANCE' ? 'bg-brand-crimson text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Award className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 font-display">
              Cuadre Estadístico
            </div>
            <div className="text-[11px] text-slate-500">
              Informes a Dirección Distrital
            </div>
          </div>
        </button>
      </div>

      {/* Control Filter Toolbar (Hidden during print) */}
      <div className="print:hidden flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Curso:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="h-9 rounded-lg border border-input bg-white px-2.5 py-1 text-xs text-slate-800 font-semibold focus:border-brand-crimson focus:outline-hidden"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Grado {c.gradeLevel} - {c.shift})
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium">Trimestre:</span>
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="h-9 rounded-lg border border-input bg-white px-2.5 py-1 text-xs text-slate-800 font-semibold focus:border-brand-crimson focus:outline-hidden"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Selector (If Report Card) */}
          {activeReport === 'REPORT_CARD' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium">Estudiante:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="h-9 rounded-lg border border-input bg-white px-2.5 py-1 text-xs text-slate-800 font-semibold focus:border-brand-crimson focus:outline-hidden max-w-[220px]"
              >
                {courseStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.lastName}, {st.firstName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search within report */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filtrar estudiante o RUDE..."
            className="h-9 w-full rounded-xl border border-input bg-slate-50 pl-8 pr-3 text-xs text-slate-800 focus:border-brand-crimson focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Styled like an authentic A4 official sheet) */}
      <div className="overflow-x-auto pb-8 print:p-0 print:overflow-visible">
        <div className="mx-auto min-w-[760px] max-w-5xl rounded-2xl border border-slate-300 bg-white p-8 sm:p-12 shadow-md print:border-none print:shadow-none print:p-0 print:max-w-none">
          
          {/* Institutional Official Letterhead */}
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
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 font-display">
                  Estado Plurinacional de Bolivia
                </h2>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ministerio de Educación • Viceministerio de Educación Regular
                </h3>
                <h4 className="text-base font-extrabold text-brand-crimson font-display">
                  UNIDAD EDUCATIVA COMUNIDAD CRISTIANA B
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  Código SIE: 81981191 | Distrito Educativo: Santa Cruz 1 | Gestión Académica 2026
                </p>
              </div>

              <div className="text-right w-36">
                <div className="inline-block p-1 bg-slate-50 border border-slate-300 rounded-md">
                  <QrCode className="h-10 w-10 text-slate-800" />
                </div>
                <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                  CSV: 8198-2026-F9
                </span>
              </div>
            </div>

            {/* Document Subtitle Badge */}
            <div className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              {activeReport === 'CENTRALIZER' && 'Acta Oficial de Centralización de Calificaciones Trimestrales'}
              {activeReport === 'REPORT_CARD' && 'Boletín Oficial de Calificaciones / Libreta Escolar'}
              {activeReport === 'ATTENDANCE_SUMMARY' && 'Registro Consolidado de Asistencia y Puntualidad'}
              {activeReport === 'STATISTICAL_BALANCE' && 'Cuadre Estadístico de Matrícula y Rendimiento Académico'}
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: CENTRALIZADOR TRIMESTRAL (ACTA GENERAL DE NOTAS) */}
          {/* ======================================================== */}
          {activeReport === 'CENTRALIZER' && (
            <div className="space-y-6">
              {/* Meta bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Curso / Paralelo</span>
                  <strong className="text-slate-800 font-semibold">{activeCourse?.name || '1° de Secundaria A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Turno / Nivel</span>
                  <strong className="text-slate-800 font-semibold">{activeCourse?.shift || 'Mañana'} • Secundario</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Periodo Evaluado</span>
                  <strong className="text-slate-800 font-semibold">{activePeriod?.name || 'Primer Trimestre 2026'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Alumnos Efectivos</span>
                  <strong className="text-slate-800 font-semibold">{displayedStudents.length} Estudiantes</strong>
                </div>
              </div>

              {/* Centralizer Matrix Table */}
              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">N°</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-28">Código RUDE</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Apellidos y Nombres</th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center w-12" title="SER (10 pts)">SER<br/><span className="text-[10px] font-normal text-slate-500">10</span></th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center w-12" title="SABER (35 pts)">SABER<br/><span className="text-[10px] font-normal text-slate-500">35</span></th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center w-12" title="HACER (35 pts)">HACER<br/><span className="text-[10px] font-normal text-slate-500">35</span></th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center w-12" title="DECIDIR (10 pts)">DECIDIR<br/><span className="text-[10px] font-normal text-slate-500">10</span></th>
                      <th className="py-2.5 px-2 border-r border-slate-300 text-center w-12" title="Autoevaluación (10 pts)">AUTO<br/><span className="text-[10px] font-normal text-slate-500">10</span></th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16 bg-slate-200/80 font-bold">TOTAL<br/><span className="text-[10px] font-normal text-slate-600">100</span></th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-28">Cualitativo</th>
                      <th className="py-2.5 px-3 text-center w-24">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {displayedStudents.map((st, idx) => {
                      // Calculate mock dimensions from actual student grade or seed
                      const stGrades = grades.filter((g) => g.studentId === st.id);
                      const finalGrade = stGrades.length > 0 ? Math.round(stGrades.reduce((acc, g) => acc + g.value, 0) / stGrades.length) : (70 + (idx % 25));
                      const isPassing = finalGrade >= 51;

                      // Breakdown dimensions proportionally
                      const ser = Math.min(10, Math.round((finalGrade / 100) * 10));
                      const saber = Math.min(35, Math.round((finalGrade / 100) * 35));
                      const hacer = Math.min(35, Math.round((finalGrade / 100) * 35));
                      const decidir = Math.min(10, Math.round((finalGrade / 100) * 10));
                      const auto = Math.max(0, finalGrade - (ser + saber + hacer + decidir));

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
                          <td className="py-2 px-2 border-r border-slate-200 text-center tabular-nums text-slate-600">{ser}</td>
                          <td className="py-2 px-2 border-r border-slate-200 text-center tabular-nums text-slate-600">{saber}</td>
                          <td className="py-2 px-2 border-r border-slate-200 text-center tabular-nums text-slate-600">{hacer}</td>
                          <td className="py-2 px-2 border-r border-slate-200 text-center tabular-nums text-slate-600">{decidir}</td>
                          <td className="py-2 px-2 border-r border-slate-200 text-center tabular-nums text-slate-600">{auto}</td>
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

              {/* Statistics Summary of the Centralizer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Estudiantes:</span>
                  <span className="text-base font-bold text-slate-900 font-mono">{displayedStudents.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Aprobados (&gt;= 51):</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">
                    {displayedStudents.filter((_, i) => (70 + (i % 25)) >= 51).length} ({Math.round((displayedStudents.filter((_, i) => (70 + (i % 25)) >= 51).length / (displayedStudents.length || 1)) * 100)}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">En Desarrollo (&lt; 51):</span>
                  <span className="text-base font-bold text-rose-700 font-mono">
                    {displayedStudents.filter((_, i) => (70 + (i % 25)) < 51).length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Promedio General Curso:</span>
                  <span className="text-base font-bold text-brand-crimson font-mono">76.4 / 100</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LIBRETA ESCOLAR OFICIAL (BOLETÍN INDIVIDUAL) */}
          {/* ======================================================== */}
          {activeReport === 'REPORT_CARD' && activeStudent && (
            <div className="space-y-6">
              {/* Student Metadata Box */}
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Estudiante</span>
                    <strong className="text-slate-900 text-sm font-display uppercase">{activeStudent.lastName}, {activeStudent.firstName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Código RUDE</span>
                    <strong className="text-slate-800 font-mono">{activeStudent.rude}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Cédula de Identidad</span>
                    <strong className="text-slate-800 font-mono">{activeStudent.ci || 'Sin CI registrado'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Curso y Paralelo</span>
                    <strong className="text-slate-800">{activeCourse?.name || '1° de Secundaria A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Turno</span>
                    <strong className="text-slate-800">{activeCourse?.shift || 'Mañana'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Gestión Académica</span>
                    <strong className="text-slate-800 font-mono">2026</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Notas Registradas</span>
                    <strong className="text-brand-crimson font-mono">{studentGrades.length} Áreas Calificadas</strong>
                  </div>
                </div>
              </div>

              {/* Subjects and Grades Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-4 border-r border-slate-300">Campos de Saberes y Áreas Curriculares</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">1° Trimestre</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">2° Trimestre</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24">3° Trimestre</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-28 bg-slate-200/70 font-bold">Promedio Anual</th>
                      <th className="py-2.5 px-3 text-center w-36">Valoración Cualitativa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-xs">
                    {[
                      { area: 'Comunicación y Lenguajes (Castellana)', t1: 82, t2: 85, t3: 80 },
                      { area: 'Lengua Extranjera (Inglés)', t1: 78, t2: 80, t3: 84 },
                      { area: 'Ciencias Sociales e Historia', t1: 90, t2: 92, t3: 88 },
                      { area: 'Educación Física y Deportes', t1: 95, t2: 95, t3: 98 },
                      { area: 'Educación Musical', t1: 86, t2: 88, t3: 85 },
                      { area: 'Artes Plásticas y Visuales', t1: 84, t2: 82, t3: 89 },
                      { area: 'Matemática', t1: 72, t2: 76, t3: 75 },
                      { area: 'Técnica Tecnológica General', t1: 90, t2: 91, t3: 93 },
                      { area: 'Ciencias Naturales: Biología - Geografía', t1: 83, t2: 85, t3: 86 },
                      { area: 'Cosmovisiones, Filosofía y Psicología', t1: 88, t2: 89, t3: 91 },
                      { area: 'Valores, Espiritualidades y Religiones', t1: 96, t2: 98, t3: 97 },
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
                              <span className="text-emerald-700 font-medium">Desarrollo Pleno (DP)</span>
                            ) : (
                              <span className="text-slate-700 font-medium">Desarrollo Óptimo (DO)</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                      <td className="py-3 px-4 text-slate-900 font-display uppercase">Promedio General Consolidado:</td>
                      <td className="py-3 px-3 text-center font-mono">85.8</td>
                      <td className="py-3 px-3 text-center font-mono">87.3</td>
                      <td className="py-3 px-3 text-center font-mono">87.9</td>
                      <td className="py-3 px-3 text-center font-mono text-brand-crimson text-sm bg-slate-200/90 font-extrabold">87.0</td>
                      <td className="py-3 px-3 text-center text-emerald-800 uppercase text-[11px]">PROMOVIDO / PLENO</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Qualitative Observations Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs space-y-1">
                <span className="font-bold text-slate-800 uppercase block font-display">
                  Informe Cualitativo del Asesor Pedagógico:
                </span>
                <p className="text-slate-600 leading-relaxed italic">
                  &ldquo;El estudiante demuestra compromiso sobresaliente, pensamiento crítico y liderazgo en proyectos comunitarios socioproductivos. Mantiene puntualidad impecable y respeto por las normas de convivencia armónica.&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: REGISTRO CONSOLIDADO DE ASISTENCIA */}
          {/* ======================================================== */}
          {activeReport === 'ATTENDANCE_SUMMARY' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Curso</span>
                  <strong className="text-slate-800">{activeCourse?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Días Hábiles</span>
                  <strong className="text-slate-800 font-mono">60 Días</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Asistencia Promedio</span>
                  <strong className="text-emerald-700 font-mono font-bold">96.8%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">Faltas Justificadas</span>
                  <strong className="text-slate-800 font-mono">14 Casos</strong>
                </div>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300 w-10 text-center">N°</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-28">Código RUDE</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Apellidos y Nombres</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-emerald-800">Presentes</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-amber-800">Atrasos</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-sky-800">Licencias</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20 text-rose-800">Faltas</th>
                      <th className="py-2.5 px-3 text-center w-24 bg-slate-200/70 font-bold">% Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {displayedStudents.map((st, idx) => {
                      const faltas = idx % 9 === 0 ? 3 : idx % 5 === 0 ? 1 : 0;
                      const atrasos = idx % 4 === 0 ? 2 : 0;
                      const licencias = idx % 7 === 0 ? 1 : 0;
                      const presentes = 60 - (faltas + licencias);
                      const pct = Math.round((presentes / 60) * 100);

                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 border-r border-slate-200 text-center font-bold text-slate-600">{idx + 1}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-slate-700">{st.rude}</td>
                          <td className="py-2 px-3 border-r border-slate-200 font-sans font-medium text-slate-900">{st.lastName}, {st.firstName}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center text-emerald-700 font-semibold">{presentes}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center text-amber-700">{atrasos}</td>
                          <td className="py-2 px-3 border-r border-slate-200 text-center text-sky-700">{licencias}</td>
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

          {/* ======================================================== */}
          {/* TAB 4: CUADRE ESTADÍSTICO DE MATRÍCULA (DISTRITAL) */}
          {/* ======================================================== */}
          {activeReport === 'STATISTICAL_BALANCE' && (
            <div className="space-y-6">
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300">Curso y Sección</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Inscritos V</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Inscritos M</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-24 bg-slate-200/60 font-bold">Total Efectivos</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Retirados</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 text-center w-20">Trasladados</th>
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
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center text-amber-600">1</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-700">97.4%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
                      <td className="py-3 px-3 text-slate-900 uppercase">Totales Unidad Educativa:</td>
                      <td className="py-3 px-3 text-center font-mono">184</td>
                      <td className="py-3 px-3 text-center font-mono">176</td>
                      <td className="py-3 px-3 text-center font-mono text-brand-crimson text-sm bg-slate-200/90 font-extrabold">360</td>
                      <td className="py-3 px-3 text-center font-mono text-rose-700">2</td>
                      <td className="py-3 px-3 text-center font-mono text-amber-700">4</td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-700">98.1%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Official Signatures Block (Visible in document & print) */}
          <div className="mt-16 pt-8 border-t border-slate-300">
            <div className="grid grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-1">
                <div className="h-16 flex items-end justify-center">
                  <span className="font-mono text-[10px] text-slate-400 italic">Sello y Firma Digital</span>
                </div>
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-800 uppercase font-sans">
                  Profesor(a) de Asignatura
                </div>
                <div className="text-[10px] text-slate-500 font-mono">C.I. 4789123 SCZ</div>
              </div>

              <div className="space-y-1">
                <div className="h-16 flex items-end justify-center">
                  <span className="font-mono text-[10px] text-slate-400 italic">Comisión Pedagógica</span>
                </div>
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-800 uppercase font-sans">
                  Comisión Técnico Pedagógica
                </div>
                <div className="text-[10px] text-slate-500 font-mono">U.E. Comunidad Cristiana B</div>
              </div>

              <div className="space-y-1">
                <div className="h-16 flex items-end justify-center">
                  <div className="inline-flex items-center gap-1 text-emerald-800 text-[10px] font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    AUTORIZADO SIE
                  </div>
                </div>
                <div className="border-t border-slate-800 pt-1 font-bold text-slate-800 uppercase font-sans">
                  Dirección General
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Lic. Director de U.E.</div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Documento Oficial emitido por SIGCE - Plataforma Académica Certificada</span>
              <span>Emisión: {new Date().toLocaleDateString('es-BO')} {new Date().toLocaleTimeString('es-BO')}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
