import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  ListFilter,
  Loader2,
  Plus,
  Search,
  User,
  Users,
  X,
} from 'lucide-react';
import type {
  gestionasistencia,
  asistenciaregistro,
  asistenciaestado,
} from '../application/gestionasistencia';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import { Planillaasistenciacurso } from '../components/planillaasistenciacurso';
import { Boton } from '../../../components/ui/boton';

const estadoconfiguracion: Record<
  asistenciaestado,
  { label: string; badgeClass: string; dotClass: string; letra: string; color: string }
> = {
  PRESENT: {
    label: 'Presente',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500',
    letra: 'P',
    color: 'text-emerald-700 bg-emerald-100',
  },
  ABSENT: {
    label: 'Ausente',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    dotClass: 'bg-rose-500',
    letra: 'A',
    color: 'text-rose-700 bg-rose-100',
  },
  LATE: {
    label: 'Atrasado',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotClass: 'bg-amber-500',
    letra: 'T',
    color: 'text-amber-700 bg-amber-100',
  },
  JUSTIFIED: {
    label: 'Justificado',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    dotClass: 'bg-blue-500',
    letra: 'J',
    color: 'text-blue-700 bg-blue-100',
  },
};

const constantemeses = [
  { id: '2026-02', label: 'Febrero 2026', from: '2026-02-01', to: '2026-02-28' },
  { id: '2026-03', label: 'Marzo 2026', from: '2026-03-01', to: '2026-03-31' },
  { id: '2026-04', label: 'Abril 2026', from: '2026-04-01', to: '2026-04-30' },
  { id: '2026-05', label: 'Mayo 2026', from: '2026-05-01', to: '2026-05-31' },
];

function escaparCsv(valor: string | number | null | undefined): string {
  if (valor == null) return '""';
  const str = String(valor).replaceAll('"', '""');
  const seguro = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${seguro}"`;
}

function descargarArchivoCsv(nombreArchivo: string, contenido: string) {
  const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}

function formatearFechaBolivia(fechaIso: string): string {
  const [año, mes, dia] = fechaIso.split('T')[0].split('-');
  return `${dia}/${mes}/${año}`;
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const AsistenciaPagina = ({
  management: gestion,
  currentRole: actualrol,
}: {
  management: gestionasistencia;
  currentRole?: string;
}) => {
  // Views
  const [modovista, establecermodovista] = useState<'lista' | 'matriz' | 'individual'>('matriz');

  // Form
  const [mostrarformulario, establecermostrarformulario] = useState(false);

  // Common filters
  const [buscar, establecerbuscar] = useState('');
  const [cursofiltro, establecercursofiltro] = useState('');
  const [estadofiltro, establecerestadofiltro] = useState('');
  const [desdefiltro, establecerdesdefiltro] = useState('');
  const [hastafiltro, establecerhastafiltro] = useState('');
  const [pagina, establecerpagina] = useState(0);

  // Matriz state
  const [matrizcursoid, establecermatrizcursoid] = useState('');
  const [matrizmesid, establecermatrizmesid] = useState('2026-05');

  // Individual report state
  const [individualestudianteid, establecerindividualestudianteid] = useState('');
  const [individualmesid, establecerindividualmesid] = useState('ALL');
  const [busquedaestudianteindividual, establecerbusquedaestudianteindividual] = useState('');

  const puedeeditar = ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'].includes(actualrol ?? '');

  // Base queries
  const cursosconsulta = useQuery({
    queryKey: ['courses', 'attendance'],
    queryFn: () => gestion.listarcursos(),
  });
  const cursos = cursosconsulta.data ?? [];

  // Default course
  useMemo(() => {
    if (cursos.length > 0 && !matrizcursoid) {
      const pred = cursos.find((c) => c.name.includes('6º de Secundaria')) || cursos[0];
      establecermatrizcursoid(pred.id);
    }
  }, [cursos, matrizcursoid]);

  // List query
  const asistenciaconsulta = useQuery({
    queryKey: ['attendance', cursofiltro, desdefiltro, hastafiltro, pagina],
    queryFn: () =>
      gestion.listarasistencia({
        courseId: cursofiltro || undefined,
        from: desdefiltro || undefined,
        to: hastafiltro || undefined,
        offset: pagina * 200,
      }),
    enabled: modovista === 'lista',
  });

  const registros = asistenciaconsulta.data?.data ?? [];
  const presentecantidad = registros.filter((r) => r.status === 'PRESENT').length;
  const ausentecantidad = registros.filter((r) => r.status === 'ABSENT').length;
  const tardiocantidad = registros.filter(
    (r) => r.status === 'LATE' || r.status === 'JUSTIFIED',
  ).length;

  const filtradoregistros = registros.filter((r) => {
    if (estadofiltro && r.status !== estadofiltro) return false;
    if (!buscar.trim()) return true;
    const termino = buscar.toLowerCase();
    return (
      r.student.firstName.toLowerCase().includes(termino) ||
      r.student.lastName.toLowerCase().includes(termino) ||
      r.course.name.toLowerCase().includes(termino)
    );
  });

  // Matriz Queries
  const mesSeleccionado = constantemeses.find((m) => m.id === matrizmesid) || constantemeses[3];

  const estudiantesMatrizConsulta = useQuery({
    queryKey: ['attendance', 'matrix-students', matrizcursoid],
    queryFn: () => gestion.listarestudiantes(matrizcursoid),
    enabled: modovista === 'matriz' && Boolean(matrizcursoid),
  });
  const estudiantesMatriz = estudiantesMatrizConsulta.data ?? [];

  const asistenciaMatrizConsulta = useQuery({
    queryKey: ['attendance', 'matrix-data', matrizcursoid, matrizmesid],
    queryFn: () =>
      gestion.listartodaasistencia({
        courseId: matrizcursoid,
        from: mesSeleccionado.from,
        to: mesSeleccionado.to,
      }),
    enabled: modovista === 'matriz' && Boolean(matrizcursoid),
  });
  const datosMatriz = asistenciaMatrizConsulta.data ?? [];

  // Generate school days of the selected month
  const diasMatriz = useMemo(() => {
    const [añoStr, mesStr] = mesSeleccionado.id.split('-');
    const año = Number(añoStr);
    const mes = Number(mesStr) - 1;
    const ultimoDia = new Date(año, mes + 1, 0).getDate();
    const dias: Array<{ fechaIso: string; numero: number; diaSemana: string; esHabil: boolean }> =
      [];

    for (let d = 1; d <= ultimoDia; d++) {
      const fecha = new Date(año, mes, d);
      const dow = fecha.getDay();
      const esHabil = dow >= 1 && dow <= 5;
      const fechaIso = `${añoStr}-${String(mesStr).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (esHabil) {
        dias.push({
          fechaIso,
          numero: d,
          diaSemana: DIAS_SEMANA[dow],
          esHabil,
        });
      }
    }
    return dias;
  }, [mesSeleccionado]);

  // Fast map for matrix lookup: Map<"studentId_date", registro>
  const matrizMapa = useMemo(() => {
    const mapa = new Map<string, asistenciaregistro>();
    for (const r of datosMatriz) {
      const fechaClave = r.date.split('T')[0];
      mapa.set(`${r.studentId}_${fechaClave}`, r);
    }
    return mapa;
  }, [datosMatriz]);

  // Export Matrix to CSV
  const exportarMatrizCsv = () => {
    const cursoActual = cursos.find((c) => c.id === matrizcursoid);
    const nombreCurso = cursoActual ? cursoetiqueta(cursoActual.name) : 'Curso';

    const encabezados = [
      'Nº',
      'RUDE',
      'Apellidos y Nombres',
      ...diasMatriz.map((d) => `${String(d.numero).padStart(2, '0')}/${mesSeleccionado.id.split('-')[1]} (${d.diaSemana})`),
      'Presentes',
      'Atrasos',
      'Justificados',
      'Faltas',
      '% Asistencia',
    ];

    const filas = estudiantesMatriz.map((est, idx) => {
      let p = 0;
      let t = 0;
      let j = 0;
      let a = 0;

      const celdasDias = diasMatriz.map((d) => {
        const reg = matrizMapa.get(`${est.id}_${d.fechaIso}`);
        if (!reg) return '-';
        if (reg.status === 'PRESENT') {
          p++;
          return 'P';
        }
        if (reg.status === 'LATE') {
          t++;
          return 'T';
        }
        if (reg.status === 'JUSTIFIED') {
          j++;
          return 'J';
        }
        if (reg.status === 'ABSENT') {
          a++;
          return 'A';
        }
        return '-';
      });

      const totalValidos = p + t + j + a;
      const pct = totalValidos > 0 ? (((p + t + j) / totalValidos) * 100).toFixed(1) + '%' : '0%';

      return [
        idx + 1,
        est.rude || '',
        `${est.lastName} ${est.firstName}`,
        ...celdasDias,
        p,
        t,
        j,
        a,
        pct,
      ].map(escaparCsv).join(',');
    });

    const csvCompleto = [
      escaparCsv(`PLANILLA MENSUAL DE ASISTENCIA — ${nombreCurso.toUpperCase()}`),
      escaparCsv(`Periodo: ${mesSeleccionado.label} | Total Estudiantes: ${estudiantesMatriz.length}`),
      '',
      encabezados.map(escaparCsv).join(','),
      ...filas,
      '',
      escaparCsv('Leyenda: P = Presente | T = Atrasado | J = Justificado | A = Ausente/Falta'),
    ].join('\r\n');

    descargarArchivoCsv(`Asistencia_${nombreCurso.replaceAll(' ', '_')}_${mesSeleccionado.id}.csv`, csvCompleto);
  };

  // Individual Student Queries
  const todosEstudiantesConsulta = useQuery({
    queryKey: ['attendance', 'all-students-lookup'],
    queryFn: () => gestion.listarestudiantes(),
    enabled: modovista === 'individual',
  });
  const todosEstudiantes = todosEstudiantesConsulta.data ?? [];

  const estudiantesFiltradosIndividual = useMemo(() => {
    if (!busquedaestudianteindividual.trim()) return [];
    const q = busquedaestudianteindividual.toLowerCase().trim();
    return todosEstudiantes
      .filter((e) => {
        const nom = `${e.firstName} ${e.lastName}`.toLowerCase();
        const ape = `${e.lastName} ${e.firstName}`.toLowerCase();
        const rude = e.rude?.toLowerCase() ?? '';
        return nom.includes(q) || ape.includes(q) || rude.includes(q);
      })
      .slice(0, 10);
  }, [todosEstudiantes, busquedaestudianteindividual]);

  const estudianteActualIndividual = todosEstudiantes.find((e) => e.id === individualestudianteid);

  // Date range for individual report
  const rangoIndividual = useMemo(() => {
    if (individualmesid === 'ALL') {
      return { from: '2026-02-01', to: '2026-05-31' };
    }
    const m = constantemeses.find((item) => item.id === individualmesid);
    return m ? { from: m.from, to: m.to } : { from: '2026-02-01', to: '2026-05-31' };
  }, [individualmesid]);

  const asistenciaIndividualConsulta = useQuery({
    queryKey: ['attendance', 'individual-data', individualestudianteid, individualmesid],
    queryFn: () =>
      gestion.listartodaasistencia({
        studentId: individualestudianteid,
        from: rangoIndividual.from,
        to: rangoIndividual.to,
      }),
    enabled: modovista === 'individual' && Boolean(individualestudianteid),
  });
  const registrosIndividual = useMemo(() => {
    const items = [...(asistenciaIndividualConsulta.data ?? [])];
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items;
  }, [asistenciaIndividualConsulta.data]);

  // Metrics for individual report
  const metricasIndividual = useMemo(() => {
    const total = registrosIndividual.length;
    const presentes = registrosIndividual.filter((r) => r.status === 'PRESENT').length;
    const atrasos = registrosIndividual.filter((r) => r.status === 'LATE').length;
    const justificados = registrosIndividual.filter((r) => r.status === 'JUSTIFIED').length;
    const ausentes = registrosIndividual.filter((r) => r.status === 'ABSENT').length;
    const asistenciaEfectiva = total > 0 ? (((presentes + atrasos + justificados) / total) * 100).toFixed(1) : '0';
    return { total, presentes, atrasos, justificados, ausentes, pct: asistenciaEfectiva };
  }, [registrosIndividual]);

  // Export Individual Report CSV
  const exportarIndividualCsv = () => {
    if (!estudianteActualIndividual) return;

    const filas = registrosIndividual.map((r, idx) => {
      const fechaStr = r.date.split('T')[0];
      const fechaObj = new Date(r.date);
      const diaSem = DIAS_SEMANA[fechaObj.getDay()] || '';
      const estadoConfig = estadoconfiguracion[r.status] || { label: r.status };

      return [
        idx + 1,
        formatearFechaBolivia(fechaStr),
        diaSem,
        cursoetiqueta(r.course.name),
        estadoConfig.label,
        r.justification || '',
      ].map(escaparCsv).join(',');
    });

    const csvCompleto = [
      escaparCsv('COLEGIO COMUNIDAD CRISTIANA — SISTEMA DE GESTIÓN ACADÉMICA SIGCE'),
      escaparCsv('INFORME DETALLADO DE ASISTENCIA INDIVIDUAL'),
      '',
      [escaparCsv('Estudiante:'), escaparCsv(`${estudianteActualIndividual.lastName} ${estudianteActualIndividual.firstName}`)].join(','),
      [escaparCsv('Código RUDE:'), escaparCsv(estudianteActualIndividual.rude || 'No asignado')].join(','),
      [escaparCsv('Periodo Evaluado:'), escaparCsv(individualmesid === 'ALL' ? 'Gestión 2026 (Todo el trimestre)' : constantemeses.find((m) => m.id === individualmesid)?.label || '')].join(','),
      [escaparCsv('Total Clases:'), escaparCsv(metricasIndividual.total)].join(','),
      [escaparCsv('Asistencia Efectiva:'), escaparCsv(`${metricasIndividual.pct}%`)].join(','),
      [escaparCsv('Presentes:'), escaparCsv(metricasIndividual.presentes)].join(','),
      [escaparCsv('Atrasos:'), escaparCsv(metricasIndividual.atrasos)].join(','),
      [escaparCsv('Faltas Justificadas:'), escaparCsv(metricasIndividual.justificados)].join(','),
      [escaparCsv('Inasistencias:'), escaparCsv(metricasIndividual.ausentes)].join(','),
      '',
      ['Nº', 'Fecha', 'Día', 'Curso', 'Estado', 'Justificación / Motivo'].map(escaparCsv).join(','),
      ...filas,
    ].join('\r\n');

    descargarArchivoCsv(
      `Informe_Asistencia_${estudianteActualIndividual.lastName.replaceAll(' ', '_')}_${estudianteActualIndividual.firstName.replaceAll(' ', '_')}.csv`,
      csvCompleto,
    );
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean with View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asistencia Escolar</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Registro, planilla tipo Excel por fechas y reportes individuales
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => establecermodovista('matriz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                modovista === 'matriz'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Matriz Excel
            </button>
            <button
              type="button"
              onClick={() => establecermodovista('individual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                modovista === 'individual'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Informe Alumno
            </button>
            <button
              type="button"
              onClick={() => establecermodovista('lista')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                modovista === 'lista'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Partes Diarios
            </button>
          </div>

          {puedeeditar && (
            <Boton
              size="sm"
              onClick={() => establecermostrarformulario((anterior) => !anterior)}
              className="gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {mostrarformulario ? 'Cerrar' : 'Tomar Asistencia'}
            </Boton>
          )}
        </div>
      </div>

      {/* Taking attendance daily form modal */}
      {mostrarformulario && puedeeditar && (
        <Planillaasistenciacurso management={gestion} courses={cursos} />
      )}

      {/* ========================================================================= */}
      {/* VISTA 1: MATRIZ EXCEL POR FECHAS                                           */}
      {/* ========================================================================= */}
      {modovista === 'matriz' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Curso:
                  </label>
                  <select
                    value={matrizcursoid}
                    onChange={(e) => establecermatrizcursoid(e.target.value)}
                    className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cursoetiqueta(c.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Mes:
                  </label>
                  <select
                    value={matrizmesid}
                    onChange={(e) => establecermatrizmesid(e.target.value)}
                    className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {constantemeses.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {estudiantesMatriz.length} estudiantes · {diasMatriz.length} días hábiles
                </span>
              </div>

              <Boton
                size="sm"
                variant="outline"
                onClick={exportarMatrizCsv}
                disabled={estudiantesMatriz.length === 0}
                className="gap-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Exportar Matriz a CSV (Excel)
              </Boton>
            </div>
          </div>

          {/* Quick Legend */}
          <div className="flex flex-wrap items-center gap-4 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
              Leyenda:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                P
              </span>
              <span className="text-slate-600">Presente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-rose-100 text-rose-800 border border-rose-300">
                A
              </span>
              <span className="text-slate-600">Ausente / Falta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-amber-100 text-amber-800 border border-amber-300">
                T
              </span>
              <span className="text-slate-600">Tardanza / Atraso</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-blue-100 text-blue-800 border border-blue-300">
                J
              </span>
              <span className="text-slate-600">Justificado</span>
            </div>
          </div>

          {/* Excel Matrix Table */}
          {asistenciaMatrizConsulta.isLoading || estudiantesMatrizConsulta.isLoading ? (
            <div className="h-80 flex items-center justify-center bg-white rounded-xl border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              <span className="ml-3 text-sm text-slate-500">Cargando planilla de asistencia...</span>
            </div>
          ) : estudiantesMatriz.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No hay estudiantes en este curso</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto max-h-[580px]">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-900 text-white select-none">
                    <tr>
                      <th className="py-2.5 px-2 text-center font-semibold w-10 border-r border-slate-800">
                        #
                      </th>
                      <th className="py-2.5 px-3 text-left font-semibold min-w-44 border-r border-slate-800">
                        Estudiante
                      </th>
                      {diasMatriz.map((dia) => (
                        <th
                          key={dia.fechaIso}
                          className="py-1.5 px-1 text-center font-medium w-9 border-r border-slate-800"
                        >
                          <div className="text-[11px] font-bold font-mono">{dia.numero}</div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-400">
                            {dia.diaSemana}
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-center font-semibold bg-emerald-950 text-emerald-300 border-r border-slate-800">
                        P
                      </th>
                      <th className="py-2.5 px-2 text-center font-semibold bg-rose-950 text-rose-300 border-r border-slate-800">
                        A
                      </th>
                      <th className="py-2.5 px-2 text-center font-semibold bg-amber-950 text-amber-300 border-r border-slate-800">
                        T
                      </th>
                      <th className="py-2.5 px-2 text-center font-semibold bg-blue-950 text-blue-300 border-r border-slate-800">
                        J
                      </th>
                      <th className="py-2.5 px-3 text-center font-bold bg-slate-800 text-white min-w-16">
                        % Asist.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {estudiantesMatriz.map((est, idx) => {
                      let p = 0;
                      let t = 0;
                      let j = 0;
                      let a = 0;

                      return (
                        <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-2 text-center font-mono text-slate-400 border-r border-slate-100 bg-slate-50/50">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-100 bg-slate-50/30">
                            <div className="font-semibold text-slate-900 truncate">
                              {est.lastName} {est.firstName}
                            </div>
                            {est.rude && (
                              <div className="text-[10px] font-mono text-slate-400">{est.rude}</div>
                            )}
                          </td>

                          {diasMatriz.map((dia) => {
                            const reg = matrizMapa.get(`${est.id}_${dia.fechaIso}`);
                            if (reg?.status === 'PRESENT') p++;
                            else if (reg?.status === 'LATE') t++;
                            else if (reg?.status === 'JUSTIFIED') j++;
                            else if (reg?.status === 'ABSENT') a++;

                            const cfg = reg ? estadoconfiguracion[reg.status] : null;

                            return (
                              <td
                                key={dia.fechaIso}
                                title={
                                  reg
                                    ? `${dia.fechaIso}: ${cfg?.label}${reg.justification ? ` (${reg.justification})` : ''}`
                                    : `${dia.fechaIso}: Sin registro`
                                }
                                className="py-1 px-0.5 text-center border-r border-slate-100 align-middle"
                              >
                                {cfg ? (
                                  <span
                                    className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold font-mono ${cfg.color}`}
                                  >
                                    {cfg.letra}
                                  </span>
                                ) : (
                                  <span className="text-slate-300 text-[10px]">—</span>
                                )}
                              </td>
                            );
                          })}

                          {/* Summary numbers */}
                          <td className="py-2 px-2 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40 border-r border-slate-100">
                            {p}
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-rose-700 bg-rose-50/40 border-r border-slate-100">
                            {a}
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-amber-700 bg-amber-50/40 border-r border-slate-100">
                            {t}
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-blue-700 bg-blue-50/40 border-r border-slate-100">
                            {j}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold">
                            {p + t + j + a > 0 ? (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                  (p + t + j) / (p + t + j + a) >= 0.9
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : (p + t + j) / (p + t + j + a) >= 0.8
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {(((p + t + j) / (p + t + j + a)) * 100).toFixed(0)}%
                              </span>
                            ) : (
                              '0%'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: INFORME INDIVIDUAL POR ESTUDIANTE                                   */}
      {/* ========================================================================= */}
      {modovista === 'individual' && (
        <div className="space-y-4">
          {/* Student Search and Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Search student autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Buscar Estudiante:
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={busquedaestudianteindividual}
                    onChange={(e) => establecerbusquedaestudianteindividual(e.target.value)}
                    placeholder="Escribe el nombre, apellido o RUDE..."
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                {estudiantesFiltradosIndividual.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100">
                    {estudiantesFiltradosIndividual.map((est) => (
                      <button
                        key={est.id}
                        type="button"
                        onClick={() => {
                          establecerindividualestudianteid(est.id);
                          establecerbusquedaestudianteindividual(
                            `${est.lastName} ${est.firstName}`,
                          );
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {est.lastName} {est.firstName}
                          </div>
                          {est.rude && (
                            <div className="text-xs font-mono text-slate-400">RUDE: {est.rude}</div>
                          )}
                        </div>
                        <span className="text-xs text-indigo-600 font-semibold">Seleccionar</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Month selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Periodo a Evaluar:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={individualmesid}
                    onChange={(e) => establecerindividualmesid(e.target.value)}
                    className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="ALL">Todo el Trimestre (Feb - May 2026)</option>
                    {constantemeses.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <Boton
                    size="sm"
                    variant="outline"
                    onClick={exportarIndividualCsv}
                    disabled={!estudianteActualIndividual || registrosIndividual.length === 0}
                    className="gap-1.5 h-10 px-3 text-xs text-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    CSV Detallado
                  </Boton>
                </div>
              </div>
            </div>

            {/* Selected student pill */}
            {estudianteActualIndividual && (
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/80 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-600 text-white font-mono">
                    {estudianteActualIndividual.rude || 'RUDE'}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {estudianteActualIndividual.lastName} {estudianteActualIndividual.firstName}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-indigo-700">
                  {metricasIndividual.total} partes registrados en el periodo
                </span>
              </div>
            )}
          </div>

          {/* Student Metrics */}
          {estudianteActualIndividual && (
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Clases</span>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {metricasIndividual.total}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Asistencia</span>
                <p className="text-xl font-bold font-mono text-emerald-600 mt-1">
                  {metricasIndividual.pct}%
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Presentes</span>
                <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
                  {metricasIndividual.presentes}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Atrasos</span>
                <p className="text-xl font-bold font-mono text-amber-600 mt-1">
                  {metricasIndividual.atrasos}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Justificadas</span>
                <p className="text-xl font-bold font-mono text-blue-600 mt-1">
                  {metricasIndividual.justificados}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Faltas</span>
                <p className="text-xl font-bold font-mono text-rose-600 mt-1">
                  {metricasIndividual.ausentes}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Student Log Table */}
          {asistenciaIndividualConsulta.isLoading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : !estudianteActualIndividual ? (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
              <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Selecciona un estudiante</p>
              <p className="text-xs text-slate-400 mt-1">
                Escribe en el buscador para ver su historial detallado y descargar su informe CSV.
              </p>
            </div>
          ) : registrosIndividual.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Sin registros para este periodo</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs">
                    <th className="py-2.5 px-4 text-left font-semibold w-12">#</th>
                    <th className="py-2.5 px-4 text-left font-semibold">Fecha</th>
                    <th className="py-2.5 px-4 text-left font-semibold">Día</th>
                    <th className="py-2.5 px-4 text-left font-semibold">Curso</th>
                    <th className="py-2.5 px-4 text-center font-semibold">Estado</th>
                    <th className="py-2.5 px-4 text-left font-semibold">Justificación / Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {registrosIndividual.map((r, idx) => {
                    const cfg = estadoconfiguracion[r.status] || {
                      label: r.status,
                      badgeClass: 'bg-slate-100 text-slate-700',
                      dotClass: 'bg-slate-400',
                    };
                    const d = new Date(r.date);
                    const diaNombre = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][d.getDay()];

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                          {formatearFechaBolivia(r.date)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{diaNombre}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-700">
                          {cursoetiqueta(r.course.name)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">
                          {r.justification ? (
                            <span className="italic font-medium text-slate-800">
                              {r.justification}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: PARTES DIARIOS / LISTA                                            */}
      {/* ========================================================================= */}
      {modovista === 'lista' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Partes', value: registros.length, color: 'text-slate-900' },
              { label: 'Presentes', value: presentecantidad, color: 'text-emerald-600' },
              { label: 'Inasistencias', value: ausentecantidad, color: 'text-rose-600' },
              { label: 'Atrasos/Justif.', value: tardiocantidad, color: 'text-amber-600' },
            ].map((elemento) => (
              <div key={elemento.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {elemento.label}
                </span>
                <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${elemento.color}`}>
                  {elemento.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search - Single row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={buscar}
                onChange={(e) => establecerbuscar(e.target.value)}
                aria-label="Buscar asistencia por estudiante o curso"
                placeholder="Buscar por estudiante o curso..."
                className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              {buscar && (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => establecerbuscar('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              aria-label="Filtrar asistencia por curso y paralelo"
              value={cursofiltro}
              onChange={(evento) => {
                establecercursofiltro(evento.target.value);
                establecerpagina(0);
              }}
              className="h-10 max-w-72 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Todos los cursos</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {cursoetiqueta(curso.name)}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrar asistencia por estado"
              value={estadofiltro}
              onChange={(evento) => establecerestadofiltro(evento.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Todos los estados</option>
              {(Object.keys(estadoconfiguracion) as asistenciaestado[]).map((clave) => (
                <option key={clave} value={clave}>
                  {estadoconfiguracion[clave].label}
                </option>
              ))}
            </select>
            <label className="text-xs text-slate-600">
              Desde{' '}
              <input
                type="date"
                value={desdefiltro}
                onChange={(evento) => {
                  establecerdesdefiltro(evento.target.value);
                  establecerpagina(0);
                }}
                className="ml-1 h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm"
              />
            </label>
            <label className="text-xs text-slate-600">
              Hasta{' '}
              <input
                type="date"
                value={hastafiltro}
                onChange={(evento) => {
                  establecerhastafiltro(evento.target.value);
                  establecerpagina(0);
                }}
                className="ml-1 h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm"
              />
            </label>
            <span className="text-sm text-slate-500">{filtradoregistros.length} partes</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {asistenciaconsulta.isLoading ? (
              <div role="status" className="flex items-center justify-center p-16 text-slate-500 gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Cargando asistencia...</span>
              </div>
            ) : asistenciaconsulta.isError ? (
              <div role="alert" className="p-12 text-center text-sm text-rose-600">
                No se pudieron cargar los registros.
              </div>
            ) : filtradoregistros.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-medium text-slate-700">Sin registros de asistencia</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="py-3 px-4">Estudiante</th>
                      <th className="py-3 px-4">Curso</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Justificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtradoregistros.map((r) => {
                      const cfg = estadoconfiguracion[r.status] || {
                        label: r.status,
                        badgeClass: 'bg-slate-100 text-slate-700',
                        dotClass: 'bg-slate-400',
                      };
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {r.student.lastName} {r.student.firstName}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {cursoetiqueta(r.course.name)}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {formatearFechaBolivia(r.date)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {r.justification || <span className="text-slate-300">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
