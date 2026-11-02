import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Download, FileSpreadsheet, FileText, GraduationCap, Printer, Users } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import {
  asistenciaresumen,
  promediocalificacion,
  promediovalores,
} from '../application/datosdeinformes';
import type {
  informecurso,
  informecalificacionregistro,
  informeconsultas,
  informeestudiante,
} from '../application/consultasdeinformes';
import { BoletinCurricular } from '../components/boletincurricular';
import { LibretaIndividual } from '../components/libretaindividual';
import { anodegestion } from '../presentation/datosinstitucionales';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import { materiacorrespondealgrado } from '../../../lib/materiaspornivel';
import { gradomaximoprimaria, gradomaximosecundaria } from '@academic/academic-domain';

type informetipo =
  | 'CENTRALIZER'
  | 'REPORT_CARD'
  | 'PROMOTION_LIST'
  | 'ATTENDANCE_SUMMARY'
  | 'ENROLLMENT_SUMMARY'
  | 'ACADEMIC_HISTORY';

const informes = [
  { id: 'CENTRALIZER', label: 'Centralizador', icon: FileSpreadsheet },
  { id: 'REPORT_CARD', label: 'Libreta individual', icon: FileText },
  { id: 'PROMOTION_LIST', label: 'Boletín curricular', icon: FileText },
  { id: 'ATTENDANCE_SUMMARY', label: 'Asistencia', icon: Calendar },
  { id: 'ENROLLMENT_SUMMARY', label: 'Matrícula', icon: Users },
  { id: 'ACADEMIC_HISTORY', label: 'Historial académico', icon: GraduationCap },
] as const;

function cursoinscripcion(estudiante: informeestudiante, curso: informecurso | undefined) {
  return estudiante.enrollments.find(
    (inscripcion) =>
      inscripcion.status === 'ACTIVE' &&
      inscripcion.course.id === curso?.id &&
      inscripcion.academicYear.id === curso.academicYearId,
  );
}

function csvcelda(valor: string | number | null): string {
  const texto = String(valor ?? '');
  // Prevent spreadsheet formulas in imported names, course labels and RUDE values.
  const seguro = /^[\s]*[=+@-]/.test(texto) ? `'${texto}` : texto;
  return `"${seguro.replaceAll('"', '""')}"`;
}

function descargarcsv(nombrearchivo: string, filas: (string | number | null)[][]) {
  const csv = `\uFEFF${filas.map((fila) => fila.map(csvcelda).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombrearchivo;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

const celdaclase = 'border border-slate-300 px-3 py-2 text-left';
const esultimocurso = (nivel: number | undefined) =>
  nivel === gradomaximoprimaria || nivel === gradomaximosecundaria;

export const InformesPagina: React.FC<{ queries: informeconsultas }> = ({ queries: consultas }) => {
  const [activoinforme, estableceractivoinforme] = useState<informetipo>('CENTRALIZER');
  const [seleccionadocursoid, establecerseleccionadocursoid] = useState('');
  const [seleccionadoperiodoid, establecerseleccionadoperiodoid] = useState('');
  const [seleccionadoestudianteid, establecerseleccionadoestudianteid] = useState('');
  const [filtroconsulta, establecerfiltroconsulta] = useState('');
  const [tamanopapelgeneral, establecertamanopapelgeneral] = useState<'legal' | 'letter'>('legal');
  const esreportegeneral = ['CENTRALIZER', 'ATTENDANCE_SUMMARY', 'ENROLLMENT_SUMMARY'].includes(
    activoinforme,
  );

  const cursosconsulta = useQuery({
    queryKey: ['reports', 'courses'],
    queryFn: () => consultas.listarcursos(),
  });
  const estudiantesconsulta = useQuery({
    queryKey: ['reports', 'students'],
    queryFn: () => consultas.listarestudiantes(),
  });
  const periodosconsulta = useQuery({
    queryKey: ['reports', 'periods'],
    queryFn: () => consultas.listarperiodos(),
    enabled:
      activoinforme === 'CENTRALIZER' ||
      activoinforme === 'REPORT_CARD' ||
      activoinforme === 'PROMOTION_LIST',
  });
  const materiasconsulta = useQuery({
    queryKey: ['reports', 'subjects'],
    queryFn: () => consultas.listarmaterias(),
    enabled: activoinforme === 'PROMOTION_LIST' || activoinforme === 'REPORT_CARD',
  });

  const cursos = useMemo(() => cursosconsulta.data ?? [], [cursosconsulta.data]);
  const estudiantes = useMemo(() => estudiantesconsulta.data ?? [], [estudiantesconsulta.data]);
  const periodos = useMemo(() => periodosconsulta.data ?? [], [periodosconsulta.data]);
  const activocurso = cursos.find((curso) => curso.id === seleccionadocursoid) ?? cursos[0];
  const cursoperiodos = periodos
    .filter((periodo) => periodo.academicYearId === activocurso?.academicYearId)
    .sort((a, b) => a.number - b.number);
  const activoperiodo =
    cursoperiodos.find((periodo) => periodo.id === seleccionadoperiodoid) ?? cursoperiodos[0];
  const cursoestudiantes = estudiantes.filter((estudiante) =>
    cursoinscripcion(estudiante, activocurso),
  );
  const activoestudiante =
    cursoestudiantes.find((estudiante) => estudiante.id === seleccionadoestudianteid) ??
    cursoestudiantes[0];
  const mostradoestudiantes = cursoestudiantes.filter((estudiante) => {
    const consulta = filtroconsulta.trim().toLocaleLowerCase('es');
    return (
      !consulta ||
      `${estudiante.lastName} ${estudiante.firstName} ${estudiante.rude}`
        .toLocaleLowerCase('es')
        .includes(consulta)
    );
  });

  const calificacionesconsulta = useQuery({
    queryKey: [
      'reports',
      'grades',
      activoinforme,
      activocurso?.id,
      activoperiodo?.id,
      activoestudiante?.id,
    ],
    queryFn: () =>
      consultas.listarcalificaciones(
        activoinforme === 'CENTRALIZER'
          ? { periodId: activoperiodo!.id }
          : activoinforme === 'PROMOTION_LIST'
            ? { courseId: activocurso!.id }
            : {
                studentId: activoestudiante!.id,
                enrollmentId: cursoinscripcion(activoestudiante!, activocurso!)?.id,
              },
      ),
    enabled:
      activoinforme === 'CENTRALIZER'
        ? Boolean(activoperiodo && activocurso)
        : activoinforme === 'PROMOTION_LIST'
          ? Boolean(activocurso)
          : activoinforme === 'REPORT_CARD' &&
            Boolean(activoestudiante && cursoinscripcion(activoestudiante, activocurso)),
  });
  const asistenciaconsulta = useQuery({
    queryKey: ['reports', 'attendance', activocurso?.id],
    queryFn: () => consultas.listarasistencia(activocurso!.id),
    enabled: activoinforme === 'ATTENDANCE_SUMMARY' && Boolean(activocurso),
  });
  const historialconsulta = useQuery({
    queryKey: ['reports', 'academic-history', activoestudiante?.id],
    queryFn: () =>
      consultas.listarcalificaciones({
        studentId: activoestudiante!.id,
      }),
    enabled: activoinforme === 'ACADEMIC_HISTORY' && Boolean(activoestudiante),
  });

  const calificaciones = useMemo(
    () => calificacionesconsulta.data ?? [],
    [calificacionesconsulta.data],
  );
  const asistencia = useMemo(() => asistenciaconsulta.data ?? [], [asistenciaconsulta.data]);
  const calificacionesparaestudiante = (
    estudiante: informeestudiante,
  ): informecalificacionregistro[] => {
    const inscripcionid = cursoinscripcion(estudiante, activocurso)?.id;
    return calificaciones.filter(
      (calificacion) =>
        calificacion.enrollmentId === inscripcionid &&
        (activoinforme !== 'CENTRALIZER' || calificacion.periodId === activoperiodo?.id),
    );
  };
  const tarjetacalificaciones = activoestudiante
    ? calificacionesparaestudiante(activoestudiante)
    : [];
  const materiasboletinmapa = new Map(
    (materiasconsulta.data ?? [])
      .filter(
        (materia) =>
          Boolean(activocurso) && materiacorrespondealgrado(materia.code, activocurso!.gradeLevel),
      )
      .map((materia) => [materia.id, materia]),
  );
  calificaciones.forEach((calificacion) => {
    const materiaactual = materiasboletinmapa.get(calificacion.subjectId);
    materiasboletinmapa.set(calificacion.subjectId, {
      id: calificacion.subjectId,
      name: calificacion.subject.name,
      code: materiaactual?.code ?? calificacion.subjectId,
      area: calificacion.subject.area ?? materiaactual?.area,
    });
  });
  const materiasboletin = [...materiasboletinmapa.values()].sort(
    (a, b) =>
      (a.area ?? '').localeCompare(b.area ?? '', 'es') || a.name.localeCompare(b.name, 'es'),
  );
  const cursoasistencia = asistencia.filter((registrar) => registrar.courseId === activocurso?.id);
  const asistenciatotales = asistenciaresumen(cursoasistencia);
  const inscripcionfilas = cursos.map((curso) => {
    const inscrito = estudiantes.filter((estudiante) => cursoinscripcion(estudiante, curso));
    return {
      course: curso,
      male: inscrito.filter((estudiante) => estudiante.gender === 'MALE').length,
      female: inscrito.filter((estudiante) => estudiante.gender === 'FEMALE').length,
      unspecified: inscrito.filter((estudiante) => estudiante.gender === 'UNSPECIFIED').length,
      total: inscrito.length,
    };
  });

  const carga =
    cursosconsulta.isPending ||
    estudiantesconsulta.isPending ||
    ((activoinforme === 'CENTRALIZER' ||
      activoinforme === 'REPORT_CARD' ||
      activoinforme === 'PROMOTION_LIST') &&
      periodosconsulta.isPending) ||
    ((activoinforme === 'PROMOTION_LIST' || activoinforme === 'REPORT_CARD') &&
      materiasconsulta.isPending) ||
    ((activoinforme === 'CENTRALIZER' ||
      activoinforme === 'REPORT_CARD' ||
      activoinforme === 'PROMOTION_LIST') &&
      Boolean(activoperiodo || activoestudiante) &&
      calificacionesconsulta.isPending) ||
    (activoinforme === 'PROMOTION_LIST' &&
      Boolean(activocurso) &&
      calificacionesconsulta.isPending) ||
    (activoinforme === 'ATTENDANCE_SUMMARY' &&
      Boolean(activocurso) &&
      asistenciaconsulta.isPending) ||
    (activoinforme === 'ACADEMIC_HISTORY' &&
      Boolean(activoestudiante) &&
      historialconsulta.isPending);
  const fallido =
    cursosconsulta.isError ||
    estudiantesconsulta.isError ||
    ((activoinforme === 'CENTRALIZER' ||
      activoinforme === 'REPORT_CARD' ||
      activoinforme === 'PROMOTION_LIST') &&
      periodosconsulta.isError) ||
    ((activoinforme === 'PROMOTION_LIST' || activoinforme === 'REPORT_CARD') &&
      materiasconsulta.isError) ||
    ((activoinforme === 'CENTRALIZER' ||
      activoinforme === 'REPORT_CARD' ||
      activoinforme === 'PROMOTION_LIST') &&
      calificacionesconsulta.isError) ||
    (activoinforme === 'ATTENDANCE_SUMMARY' && asistenciaconsulta.isError) ||
    (activoinforme === 'ACADEMIC_HISTORY' && historialconsulta.isError);
  const tieneinformedatos =
    activoinforme === 'CENTRALIZER'
      ? mostradoestudiantes.length > 0 && calificaciones.length > 0
      : activoinforme === 'REPORT_CARD'
        ? Boolean(activoestudiante && cursoperiodos.length > 0 && materiasboletin.length > 0)
        : activoinforme === 'PROMOTION_LIST'
          ? cursoestudiantes.length > 0 && cursoperiodos.length > 0 && materiasboletin.length > 0
          : activoinforme === 'ATTENDANCE_SUMMARY'
            ? Boolean(activocurso)
            : activoinforme === 'ACADEMIC_HISTORY'
              ? Boolean(activoestudiante && (historialconsulta.data?.length ?? 0) > 0)
              : inscripcionfilas.some((fila) => fila.total > 0);
  const puedeexportacion = !carga && !fallido && tieneinformedatos;
  const centralizadorcorto = activoinforme === 'CENTRALIZER' && mostradoestudiantes.length <= 24;
  const tamanoletraimpresion = centralizadorcorto
    ? tamanopapelgeneral === 'legal'
      ? '12pt'
      : '10pt'
    : tamanopapelgeneral === 'legal'
      ? '10pt'
      : '9pt';
  const espacioceldaimpresion = centralizadorcorto
    ? tamanopapelgeneral === 'legal'
      ? '5pt 6pt'
      : '3pt 4pt'
    : tamanopapelgeneral === 'legal'
      ? '3pt 4pt'
      : '2pt 3pt';

  const exportacioncsv = () => {
    if (!puedeexportacion) return;
    const titulo =
      activoinforme === 'PROMOTION_LIST'
        ? esultimocurso(activocurso?.gradeLevel)
          ? 'boletin_de_promocion'
          : 'boletin_de_calificaciones'
        : (informes.find((informe) => informe.id === activoinforme)?.label ?? 'reporte');
    const filas: (string | number | null)[][] = [];
    if (activoinforme === 'CENTRALIZER') {
      filas.push([
        'RUDE',
        'Estudiante',
        'Curso',
        'Periodo',
        'Notas registradas',
        'Promedio de notas registradas',
      ]);
      mostradoestudiantes.forEach((estudiante) => {
        const valores = calificacionesparaestudiante(estudiante);
        filas.push([
          estudiante.rude,
          `${estudiante.lastName}, ${estudiante.firstName}`,
          activocurso?.name ?? '',
          activoperiodo?.name ?? '',
          valores.length,
          promediocalificacion(valores),
        ]);
      });
    } else if (activoinforme === 'REPORT_CARD') {
      filas.push(['RUDE', 'Estudiante', 'Materia', 'Periodo', 'Nota registrada']);
      tarjetacalificaciones.forEach((calificacion) =>
        filas.push([
          activoestudiante?.rude ?? '',
          `${activoestudiante?.lastName ?? ''}, ${activoestudiante?.firstName ?? ''}`,
          calificacion.subject.name,
          calificacion.period.name,
          calificacion.value,
        ]),
      );
    } else if (activoinforme === 'ACADEMIC_HISTORY') {
      filas.push(['RUDE', 'Estudiante', 'Materia', 'Periodo', 'Nota']);
      (historialconsulta.data ?? []).forEach((g) =>
        filas.push([
          activoestudiante?.rude ?? '',
          `${activoestudiante?.lastName ?? ''}, ${activoestudiante?.firstName ?? ''}`,
          g.subject.name,
          g.period.name,
          g.value,
        ]),
      );
    } else if (activoinforme === 'PROMOTION_LIST') {
      const inscripcionescurso = cursoestudiantes
        .map((estudiante) => ({
          estudiante,
          inscripcion: cursoinscripcion(estudiante, activocurso),
        }))
        .filter((registro) => Boolean(registro.inscripcion));
      const encabezados = ['N.º', 'RUDE', 'Estudiante', 'Sexo', 'Fecha de nacimiento'];
      materiasboletin.forEach((materia) => {
        cursoperiodos.forEach((periodo) => encabezados.push(`${materia.name} T${periodo.number}`));
        encabezados.push(`${materia.name} promedio registrado`);
      });
      encabezados.push('Promedio general registrado', 'Resultado / observación');
      filas.push(encabezados);
      inscripcionescurso.forEach(({ estudiante, inscripcion }, indice) => {
        const calificacionesestudiante = calificaciones.filter(
          (calificacion) => calificacion.enrollmentId === inscripcion!.id,
        );
        const valores: (string | number | null)[] = [
          indice + 1,
          estudiante.rude,
          `${estudiante.lastName} ${estudiante.firstName}`,
          estudiante.gender,
          estudiante.birthDate,
        ];
        const promediosmaterias: number[] = [];
        materiasboletin.forEach((materia) => {
          const registrosmateria = calificacionesestudiante.filter(
            (calificacion) => calificacion.subjectId === materia.id,
          );
          cursoperiodos.forEach((periodo) => {
            valores.push(
              registrosmateria.find((calificacion) => calificacion.periodId === periodo.id)
                ?.value ?? null,
            );
          });
          const promedio = promediocalificacion(registrosmateria);
          valores.push(promedio);
          if (promedio !== null) promediosmaterias.push(promedio);
        });
        valores.push(promediovalores(promediosmaterias), '');
        filas.push(valores);
      });
    } else if (activoinforme === 'ATTENDANCE_SUMMARY') {
      filas.push([
        'RUDE',
        'Estudiante',
        'Presentes',
        'Atrasos',
        'Ausentes',
        'Justificados',
        'Registros',
        'Asistencia registrada (%)',
      ]);
      mostradoestudiantes.forEach((estudiante) => {
        const resumen = asistenciaresumen(
          cursoasistencia.filter((registrar) => registrar.studentId === estudiante.id),
        );
        filas.push([
          estudiante.rude,
          `${estudiante.lastName}, ${estudiante.firstName}`,
          resumen.present,
          resumen.late,
          resumen.absent,
          resumen.justified,
          resumen.total,
          resumen.rate,
        ]);
      });
    } else {
      filas.push([
        'Curso',
        'Gestión',
        'Mujeres',
        'Varones',
        'Género no especificado',
        'Matrículas activas registradas',
      ]);
      inscripcionfilas.forEach(
        ({ course: curso, female: femenino, male: masculino, unspecified: sinsexo, total }) =>
          filas.push([curso.name, curso.academicYear.name, femenino, masculino, sinsexo, total]),
      );
    }
    descargarcsv(
      `${titulo.toLowerCase().replaceAll(' ', '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
      filas,
    );
  };

  return (
    <div className="reports-page space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reportes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Borradores elaborados con los registros disponibles en SIGCE.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(esreportegeneral || activoinforme === 'REPORT_CARD') && (
            <label className="flex items-center gap-2 text-xs text-slate-600">
              Papel
              <select
                value={tamanopapelgeneral}
                onChange={(evento) =>
                  establecertamanopapelgeneral(evento.target.value as typeof tamanopapelgeneral)
                }
                className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
              >
                <option value="legal">
                  Oficio {activoinforme === 'REPORT_CARD' ? 'horizontal' : 'vertical'}
                </option>
                <option value="letter">
                  Carta {activoinforme === 'REPORT_CARD' ? 'horizontal' : 'vertical'}
                </option>
              </select>
            </label>
          )}
          <Boton
            variant="outline"
            size="sm"
            onClick={exportacioncsv}
            disabled={!puedeexportacion}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> CSV
          </Boton>
          <Boton
            size="sm"
            onClick={() => window.print()}
            disabled={!puedeexportacion}
            className="gap-2"
          >
            <Printer className="h-4 w-4" /> Imprimir
          </Boton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {informes.map(({ id, label: etiqueta, icon: Icono }) => (
          <button
            key={id}
            type="button"
            onClick={() => estableceractivoinforme(id)}
            className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm ${activoinforme === id ? 'border-brand-600 bg-brand-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            <Icono className="h-4 w-4 shrink-0" aria-hidden="true" /> {etiqueta}
          </button>
        ))}
      </div>

      {activoinforme !== 'ENROLLMENT_SUMMARY' && (
        <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <label className="flex items-center gap-2">
            Curso
            <select
              aria-label="Curso"
              value={activocurso?.id ?? ''}
              onChange={(evento) => establecerseleccionadocursoid(evento.target.value)}
              className="rounded-md border border-slate-300 bg-white p-2"
            >
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {cursoetiqueta(curso.name)} ({curso.academicYear.name})
                </option>
              ))}
            </select>
          </label>
          {activoinforme === 'CENTRALIZER' && (
            <label className="flex items-center gap-2">
              Periodo
              <select
                aria-label="Periodo"
                value={activoperiodo?.id ?? ''}
                onChange={(evento) => establecerseleccionadoperiodoid(evento.target.value)}
                className="rounded-md border border-slate-300 bg-white p-2"
              >
                {cursoperiodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {(activoinforme === 'REPORT_CARD' || activoinforme === 'ACADEMIC_HISTORY') && (
            <label className="flex items-center gap-2">
              Estudiante
              <select
                aria-label="Estudiante"
                value={activoestudiante?.id ?? ''}
                onChange={(evento) => establecerseleccionadoestudianteid(evento.target.value)}
                className="max-w-64 rounded-md border border-slate-300 bg-white p-2"
              >
                {cursoestudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.lastName}, {estudiante.firstName}
                  </option>
                ))}
              </select>
            </label>
          )}
          {activoinforme !== 'REPORT_CARD' && activoinforme !== 'ACADEMIC_HISTORY' && (
            <input
              aria-label="Filtrar estudiante"
              value={filtroconsulta}
              onChange={(evento) => establecerfiltroconsulta(evento.target.value)}
              placeholder="Buscar estudiante o RUDE"
              className="rounded-md border border-slate-300 p-2"
            />
          )}
        </div>
      )}

      {esreportegeneral && (
        <style>{`
          @page { size: ${tamanopapelgeneral} portrait; margin: 8mm; }
          @media print {
            #reporte-sigce {
              width: 100% !important;
              max-width: none !important;
              break-inside: avoid-page !important;
            }
            #reporte-sigce table {
              width: 100% !important;
              font-size: ${tamanoletraimpresion} !important;
            }
            #reporte-sigce th, #reporte-sigce td {
              padding: ${espacioceldaimpresion} !important;
              line-height: 1.15 !important;
              overflow-wrap: anywhere !important;
            }
            #reporte-sigce h2 { font-size: 14pt !important; }
            #reporte-sigce .overflow-x-auto { overflow: visible !important; }
            #reporte-sigce > div:last-child { margin-top: 12pt !important; }
          }
        `}</style>
      )}
      <section
        id="reporte-sigce"
        className={`rounded-xl border border-slate-300 bg-white p-5 sm:p-8 ${activoinforme === 'REPORT_CARD' ? 'reporte-con-libreta' : ''}`}
      >
        <div className="mb-5 border-b border-slate-300 pb-4">
          {activoinforme !== 'REPORT_CARD' && activoinforme !== 'PROMOTION_LIST' && (
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img src="/logo-sf.png" alt="" className="h-11 w-11 object-contain" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-900">
                    Colegio Comunidad Cristiana
                  </p>
                  <p className="text-xs text-slate-600">
                    Santa Cruz de la Sierra · Gestión{' '}
                    {activocurso
                      ? anodegestion(activocurso.academicYear.name)
                      : new Date().getFullYear()}
                  </p>
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Documento de consulta
              </p>
            </div>
          )}
          <h2 className="text-base font-bold text-slate-900">
            {activoinforme === 'PROMOTION_LIST'
              ? esultimocurso(activocurso?.gradeLevel)
                ? 'Boletín de promoción'
                : 'Boletín de calificaciones'
              : informes.find((informe) => informe.id === activoinforme)?.label}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Consulta interna. Los valores mostrados provienen de registros disponibles; este
            documento no acredita un cierre ni una validación oficial.
          </p>
          {activocurso && activoinforme !== 'ENROLLMENT_SUMMARY' && (
            <p className="mt-2 text-sm text-slate-700">
              {cursoetiqueta(activocurso.name)} · {activocurso.academicYear.name}
              {activoinforme === 'CENTRALIZER' && activoperiodo ? ` · ${activoperiodo.name}` : ''}
            </p>
          )}
        </div>

        {carga ? (
          <p className="text-sm text-slate-500">Cargando todos los registros del reporte…</p>
        ) : fallido ? (
          <p role="alert" className="text-sm text-rose-700">
            No se pudo cargar el reporte completo. Revise la conexión o sus permisos e intente de
            nuevo.
          </p>
        ) : !activocurso && activoinforme !== 'ENROLLMENT_SUMMARY' ? (
          <p className="text-sm text-slate-500">No hay cursos registrados.</p>
        ) : activoinforme === 'PROMOTION_LIST' && cursoperiodos.length === 0 ? (
          <p className="text-sm text-slate-500">No hay trimestres configurados para este curso.</p>
        ) : activoinforme === 'PROMOTION_LIST' ? (
          <BoletinCurricular
            curso={activocurso}
            estudiantes={mostradoestudiantes}
            materias={materiasboletin}
            periodos={cursoperiodos}
            calificaciones={calificaciones}
          />
        ) : activoinforme === 'CENTRALIZER' && !activoperiodo ? (
          <p className="text-sm text-slate-500">
            No hay periodos registrados para la gestión del curso.
          </p>
        ) : activoinforme === 'REPORT_CARD' && cursoperiodos.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay trimestres configurados para la gestión del curso.
          </p>
        ) : activoinforme === 'CENTRALIZER' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Promedio calculado solo con las notas registradas en este periodo. Una celda vacía
              indica que no hay nota; no se infiere promoción.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-100 font-semibold text-slate-900">
                  <tr>
                    <th className={celdaclase}>RUDE</th>
                    <th className={celdaclase}>Estudiante</th>
                    <th className={celdaclase}>Notas</th>
                    <th className={celdaclase}>Promedio registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {mostradoestudiantes.map((estudiante) => {
                    const valores = calificacionesparaestudiante(estudiante);
                    return (
                      <tr key={estudiante.id}>
                        <td className={celdaclase}>{estudiante.rude}</td>
                        <td className={celdaclase}>
                          {estudiante.lastName}, {estudiante.firstName}
                        </td>
                        <td className={celdaclase}>{valores.length || 'Sin notas'}</td>
                        <td className={celdaclase}>{promediocalificacion(valores) ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {mostradoestudiantes.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay estudiantes matriculados que coincidan con el filtro.
              </p>
            )}
          </div>
        ) : activoinforme === 'REPORT_CARD' ? (
          <div className="space-y-3">
            {!activoestudiante ? (
              <p className="text-sm text-slate-500">No hay estudiantes matriculados en el curso.</p>
            ) : (
              <LibretaIndividual
                curso={activocurso}
                estudiante={activoestudiante}
                materias={materiasboletin}
                periodos={cursoperiodos}
                calificaciones={tarjetacalificaciones}
                tamanopapel={tamanopapelgeneral}
              />
            )}
          </div>
        ) : activoinforme === 'ATTENDANCE_SUMMARY' ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              {asistenciatotales.total} registros de asistencia ·{' '}
              {asistenciatotales.rate === null
                ? 'Sin tasa calculable'
                : `${asistenciatotales.rate}% de asistencia registrada`}
            </p>
            <p className="text-xs text-slate-500">
              La tasa cuenta presentes y atrasos sobre los registros existentes. No equivale a
              porcentaje de días hábiles del calendario.
            </p>
            {cursoasistencia.length === 0 && (
              <p className="text-xs font-medium text-slate-700">
                Aún no hay asistencias registradas en este curso. Los ceros indican falta de
                registros, no ausencias del estudiante.
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-100 font-semibold text-slate-900">
                  <tr>
                    <th className={celdaclase}>RUDE</th>
                    <th className={celdaclase}>Estudiante</th>
                    <th className={celdaclase}>Presentes</th>
                    <th className={celdaclase}>Atrasos</th>
                    <th className={celdaclase}>Ausentes</th>
                    <th className={celdaclase}>Justificados</th>
                    <th className={celdaclase}>Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  {mostradoestudiantes.map((estudiante) => {
                    const resumen = asistenciaresumen(
                      cursoasistencia.filter((registrar) => registrar.studentId === estudiante.id),
                    );
                    return (
                      <tr key={estudiante.id}>
                        <td className={celdaclase}>{estudiante.rude}</td>
                        <td className={celdaclase}>
                          {estudiante.lastName}, {estudiante.firstName}
                        </td>
                        <td className={celdaclase}>{resumen.present}</td>
                        <td className={celdaclase}>{resumen.late}</td>
                        <td className={celdaclase}>{resumen.absent}</td>
                        <td className={celdaclase}>{resumen.justified}</td>
                        <td className={celdaclase}>
                          {resumen.rate === null ? '—' : `${resumen.rate}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {mostradoestudiantes.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay estudiantes matriculados que coincidan con el filtro.
              </p>
            )}
          </div>
        ) : activoinforme === 'ACADEMIC_HISTORY' ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activoestudiante
                      ? `${activoestudiante.lastName}, ${activoestudiante.firstName}`
                      : 'Seleccione un estudiante'}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>
                      <strong>RUDE:</strong>{' '}
                      <code className="font-mono">{activoestudiante?.rude ?? '—'}</code>
                    </span>
                    <span>
                      <strong>Fecha Nac.:</strong> {activoestudiante?.birthDate ?? '—'}
                    </span>
                    <span>
                      <strong>Género:</strong>{' '}
                      {activoestudiante?.gender === 'MALE'
                        ? 'Masculino'
                        : activoestudiante?.gender === 'FEMALE'
                          ? 'Femenino'
                          : 'No especificado'}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Documento oficial de trayectoria escolar (RF-34)</span>
                </div>
              </div>
            </div>

            {/* Trajectory across academic years */}
            <div className="space-y-6">
              {(() => {
                const notasEstudiante = historialconsulta.data ?? [];
                if (!activoestudiante) {
                  return (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Selecciona un estudiante para consultar su historial académico consolidado.
                    </p>
                  );
                }
                if (notasEstudiante.length === 0) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      No se registran calificaciones históricas para este estudiante.
                    </div>
                  );
                }

                // Group grades by subject & calculate averages
                const materiasMap = new Map<
                  string,
                  { name: string; area?: string | null; notas: number[] }
                >();
                notasEstudiante.forEach((g) => {
                  const actual = materiasMap.get(g.subjectId) ?? {
                    name: g.subject.name,
                    area: g.subject.area,
                    notas: [],
                  };
                  actual.notas.push(g.value);
                  materiasMap.set(g.subjectId, actual);
                });

                const filasMaterias = [...materiasMap.entries()].map(([id, m]) => {
                  const promedio = Math.round(
                    m.notas.reduce((a, b) => a + b, 0) / m.notas.length,
                  );
                  return {
                    id,
                    name: m.name,
                    area: m.area,
                    notas: m.notas,
                    promedio,
                    aprobado: promedio >= 51,
                  };
                });

                const promedioGeneral =
                  filasMaterias.length > 0
                    ? Math.round(
                        filasMaterias.reduce((a, b) => a + b.promedio, 0) /
                          filasMaterias.length,
                      )
                    : 0;
                const materiasAprobadas = filasMaterias.filter((m) => m.aprobado).length;
                const esPromovido =
                  promedioGeneral >= 51 && materiasAprobadas === filasMaterias.length;

                return (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-xs sm:text-sm">
                        <thead className="bg-slate-100 font-semibold text-slate-900">
                          <tr>
                            <th className={celdaclase}>Asignatura</th>
                            <th className={celdaclase}>Área Curricular</th>
                            <th className={`${celdaclase} text-center`}>Notas Registradas</th>
                            <th className={`${celdaclase} text-center`}>Promedio Final</th>
                            <th className={`${celdaclase} text-center`}>Escala Ley 070</th>
                            <th className={`${celdaclase} text-center`}>Condición</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filasMaterias.map((m) => {
                            const escala =
                              m.promedio >= 85
                                ? 'Desarrollo Pleno'
                                : m.promedio >= 69
                                  ? 'Desarrollo Óptimo'
                                  : m.promedio >= 51
                                    ? 'Desarrollo Aceptable'
                                    : 'En Desarrollo';

                            return (
                              <tr key={m.id} className="hover:bg-slate-50/50">
                                <td className={`${celdaclase} font-medium text-slate-900`}>
                                  {m.name}
                                </td>
                                <td className={celdaclase}>{m.area || 'Campo General'}</td>
                                <td className={`${celdaclase} text-center font-mono`}>
                                  {m.notas.join(' · ')}
                                </td>
                                <td
                                  className={`${celdaclase} text-center font-mono font-bold ${m.aprobado ? 'text-slate-900' : 'text-rose-600'}`}
                                >
                                  {m.promedio}
                                </td>
                                <td className={`${celdaclase} text-center`}>
                                  <span
                                    className={`inline-block rounded px-2 py-0.5 text-[11px] font-medium ${m.aprobado ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                                  >
                                    {escala}
                                  </span>
                                </td>
                                <td
                                  className={`${celdaclase} text-center font-semibold ${m.aprobado ? 'text-emerald-700' : 'text-rose-600'}`}
                                >
                                  {m.aprobado ? 'Aprobado' : 'Reprobado'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-3">
                      <div>
                        <span className="block text-slate-500">Promedio Consolidado</span>
                        <strong className="font-mono text-base font-bold text-slate-900">
                          {promedioGeneral} / 100
                        </strong>
                      </div>
                      <div>
                        <span className="block text-slate-500">Materias Aprobadas</span>
                        <strong className="text-base font-bold text-slate-900">
                          {materiasAprobadas} de {filasMaterias.length}
                        </strong>
                      </div>
                      <div>
                        <span className="block text-slate-500">Condición Académica</span>
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-bold ${esPromovido ? 'text-emerald-700' : 'text-rose-700'}`}
                        >
                          {esPromovido ? 'PROMOVIDO / REGULAR' : 'EN SEGUIMIENTO / RETENIDO'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-8 grid gap-6 border-t border-slate-300 pt-4 text-xs text-slate-600 sm:grid-cols-2">
              <p>
                Historial académico emitido por SIGCE el {new Date().toLocaleDateString('es-BO')}.
                Certifica la trayectoria escolar registrada en el sistema.
              </p>
              <p className="border-t border-slate-500 pt-2 text-center sm:mt-7">
                Firma y sello de Dirección Académica
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Matrículas activas que figuran en los expedientes consultados. No se calcula promoción
              ni retiro.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-100 font-semibold text-slate-900">
                  <tr>
                    <th className={celdaclase}>Curso</th>
                    <th className={celdaclase}>Gestión</th>
                    <th className={celdaclase}>Mujeres</th>
                    <th className={celdaclase}>Varones</th>
                    <th className={celdaclase}>No especificado</th>
                    <th className={celdaclase}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inscripcionfilas.map(
                    ({
                      course: curso,
                      female: femenino,
                      male: masculino,
                      unspecified: sinsexo,
                      total,
                    }) => (
                      <tr key={curso.id}>
                        <td className={celdaclase}>{cursoetiqueta(curso.name)}</td>
                        <td className={celdaclase}>{curso.academicYear.name}</td>
                        <td className={celdaclase}>{femenino}</td>
                        <td className={celdaclase}>{masculino}</td>
                        <td className={celdaclase}>{sinsexo}</td>
                        <td className={celdaclase}>{total}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            {inscripcionfilas.length === 0 && (
              <p className="text-sm text-slate-500">No hay cursos registrados.</p>
            )}
          </div>
        )}
        {['CENTRALIZER', 'ATTENDANCE_SUMMARY', 'ENROLLMENT_SUMMARY'].includes(activoinforme) &&
          !carga &&
          !fallido && (
            <div className="mt-8 grid gap-6 border-t border-slate-300 pt-4 text-xs text-slate-600 sm:grid-cols-2">
              <p>
                Emitido por SIGCE el {new Date().toLocaleDateString('es-BO')}. Datos sujetos a
                revisión institucional.
              </p>
              <p className="border-t border-slate-500 pt-2 text-center sm:mt-7">
                Firma y sello de dirección
              </p>
            </div>
          )}
      </section>
    </div>
  );
};
