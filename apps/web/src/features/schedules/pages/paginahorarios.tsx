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
import { gestionhorario, type clasehorarioregistro } from '../application/gestionhorarios';
import {
  obtenerfranjasperiodosdiarios,
  obtenerminutosperiodopedagogico,
  obtenierniveleducativoregular,
  type turnoacademico,
  diaslectivospasemana,
} from '@academic/academic-domain';
import { Boton } from '../../../components/ui/boton';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import { materiacorrespondealgrado } from '../../../lib/materiaspornivel';

const constantedias = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
];

type horarioperiodofila = {
  index: number | string;
  start: string;
  end: string;
  label: string;
  isBreak: boolean;
};

function esacademicoturno(turno: string | undefined): turno is turnoacademico {
  return turno === 'MORNING' || turno === 'AFTERNOON' || turno === 'EVENING';
}

function crearhorarioperiodofilas(
  nivelacademico: number,
  turno: turnoacademico,
): horarioperiodofila[] {
  const bloques = obtenerfranjasperiodosdiarios(nivelacademico, turno);
  const filas: horarioperiodofila[] = [];
  let anteriorfin: string | undefined;

  for (const bloque of bloques) {
    if (anteriorfin && anteriorfin !== bloque.horainicio) {
      filas.push({
        index: `break-${bloque.indiceperiodo}`,
        start: anteriorfin,
        end: bloque.horainicio,
        label: 'Recreo',
        isBreak: true,
      });
    }
    filas.push({
      index: bloque.indiceperiodo,
      start: bloque.horainicio,
      end: bloque.horafin,
      label: `${bloque.indiceperiodo}º`,
      isBreak: false,
    });
    anteriorfin = bloque.horafin;
  }

  return filas;
}

const constantemateriacolores: Record<string, { bg: string; text: string; border: string }> = {
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

interface horariospaginapropiedades {
  management: gestionhorario;
  currentRole?: string;
}

function normalizarespecialidad(valor: string): string {
  return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
}

export const HorariosPagina: React.FC<horariospaginapropiedades> = ({
  management: gestion,
  currentRole: actualrol = '',
}) => {
  const clientedeconsultas = useQueryClient();
  const esfamiliaroestudiante = actualrol === 'PARENT' || actualrol === 'STUDENT';
  const puedegestionar = ['ADMINISTRATIVE', 'SECRETARY'].includes(actualrol);

  const [vistamodo, establecervistamodo] = useState<'course' | 'teacher'>('course');
  const [seleccionadocursoid, establecerseleccionadocursoid] = useState<string>('');
  const [seleccionadodocenteid, establecerseleccionadodocenteid] = useState<string>('');
  const [asignaciondocenteid, establecerasignaciondocenteid] = useState<string>('');
  const [asignacionmateriaid, establecerasignacionmateriaid] = useState<string>('');
  const [asignacioncargasemanal, establecerasignacioncargasemanal] = useState<string>('');
  const [seleccionadohijoindice, establecerseleccionadohijoindice] = useState<number>(0);

  // Modales
  const [esmanualmodalabrir, estableceresmanualmodalabrir] = useState(false);
  const [esautomaticomodalabrir, estableceresautomaticomodalabrir] = useState(false);
  const [automaticoresultado, establecerautomaticoresultado] = useState<{
    totalSlots: number;
    distribution: Array<{
      subjectName: string;
      code: string;
      teacherName: string;
      periods: number;
    }>;
  } | null>(null);
  const [automaticoerror, establecerautomaticoerror] = useState<string | null>(null);

  // Formulario manual
  const [edicionsesionid, estableceredicionsesionid] = useState<string | null>(null);
  const [bloquedia, establecerbloquedia] = useState<string>('LUNES');
  const [bloqueperiodoindice, establecerbloqueperiodoindice] = useState<number>(1);
  const [bloquemateriaid, establecerbloquemateriaid] = useState<string>('');
  const [bloquedocenteid, establecerbloquedocenteid] = useState<string>('');
  const [bloqueaula, establecerbloqueaula] = useState<string>('');
  const [manualerror, establecermanualerror] = useState<string | null>(null);

  // Queries
  const { data: myhorariodatos, isLoading: cargamyhorario } = useQuery({
    queryKey: ['schedules', 'my-schedule'],
    queryFn: () => gestion.obtenermyhorario(),
    enabled: esfamiliaroestudiante,
  });

  const { data: cursosdatos } = useQuery({
    queryKey: ['courses'],
    queryFn: () => gestion.listarcursos(),
    enabled: !esfamiliaroestudiante,
  });
  const cursos = cursosdatos ?? [];

  React.useEffect(() => {
    if (cursos.length > 0 && !seleccionadocursoid) {
      const predeterminadocurso = cursos.find((c) => c.gradeLevel === 11) || cursos[0];
      establecerseleccionadocursoid(predeterminadocurso.id);
    }
  }, [cursos, seleccionadocursoid]);

  const { data: docentesdatos } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => gestion.listardocentes(),
    enabled: !esfamiliaroestudiante,
  });
  const docentes = docentesdatos ?? [];

  React.useEffect(() => {
    if (docentes.length > 0 && !seleccionadodocenteid) {
      establecerseleccionadodocenteid(docentes[0].id);
    }
  }, [docentes, seleccionadodocenteid]);

  const { data: materiasdatos } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => gestion.listarmaterias(),
    enabled: puedegestionar,
  });
  const todaslasmaterias = materiasdatos ?? [];

  const { data: cursohorariodatos, isLoading: cargacurso } = useQuery({
    queryKey: ['schedules', 'course', seleccionadocursoid],
    queryFn: () => gestion.obtenercursohorario(seleccionadocursoid),
    enabled: !esfamiliaroestudiante && vistamodo === 'course' && !!seleccionadocursoid,
  });

  const { data: docentehorariodatos, isLoading: cargadocente } = useQuery({
    queryKey: ['schedules', 'teacher', seleccionadodocenteid],
    queryFn: () => gestion.obtenerdocentehorario(seleccionadodocenteid),
    enabled: !esfamiliaroestudiante && vistamodo === 'teacher' && !!seleccionadodocenteid,
  });

  // Mutations
  const actualizarocrearmutacion = useMutation({
    mutationFn: (entrada: Parameters<gestionhorario['actualizarocrearhorario']>[0]) =>
      gestion.actualizarocrearhorario(entrada),
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['schedules'] });
      estableceresmanualmodalabrir(false);
      estableceredicionsesionid(null);
      establecermanualerror(null);
    },
    onError: (error: unknown) => {
      const mensaje = error instanceof Error ? error.message : 'Error al guardar horario';
      establecermanualerror(mensaje);
    },
  });

  const eliminarmutacion = useMutation({
    mutationFn: (id: string) => gestion.eliminarhorario(id),
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['schedules'] });
      estableceresmanualmodalabrir(false);
      estableceredicionsesionid(null);
      establecermanualerror(null);
    },
  });

  const generarautomaticomutacion = useMutation({
    mutationFn: (cursoid: string) => gestion.generarautomaticohorario(cursoid),
    onSuccess: (respuesta) => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['schedules'] });
      establecerautomaticoerror(null);
      establecerautomaticoresultado(respuesta);
    },
    onError: (error: unknown) => {
      establecerautomaticoerror(
        error instanceof Error ? error.message : 'No se pudo generar el horario.',
      );
    },
  });

  const asignarmateriasmutacion = useMutation({
    mutationFn: () => gestion.asignarmateriasdocente({
      courseId: seleccionadocursoid,
      teacherId: asignaciondocenteid,
      subjectIds: asignacionmateriaid ? [asignacionmateriaid] : [],
      weeklyPeriods: asignacioncargasemanal.trim() ? Number(asignacioncargasemanal) : null,
    }),
    onSuccess: () => {
      establecerasignacionmateriaid('');
      establecerasignaciondocenteid('');
      establecerasignacioncargasemanal('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['schedules', 'course', seleccionadocursoid] });
    },
  });

  const mydatos = myhorariodatos;
  const hijos = mydatos?.children ?? [];
  const actualhijo = hijos[seleccionadohijoindice] || hijos[0];

  const activocurso = esfamiliaroestudiante
    ? actualhijo?.course || mydatos?.course
    : cursos.find((c) => c.id === seleccionadocursoid);
  const materiasdelcurso = todaslasmaterias.filter((materia) =>
    activocurso && materiacorrespondealgrado(materia.code, activocurso.gradeLevel),
  );
  const materiasasignadascurso = Array.from(
    new Map(
      (cursohorariodatos?.teacherSubjects ?? []).map((asignacion) => [
        asignacion.subject.id,
        asignacion.subject,
      ]),
    ).values(),
  );
  const relacionmateriaconcurso = React.useMemo(
    () => cursohorariodatos?.teacherSubjects.filter(
      (asignacion) => asignacion.subject.id === asignacionmateriaid,
    ) ?? [],
    [cursohorariodatos?.teacherSubjects, asignacionmateriaid],
  );
  const docentesyarelacionados = React.useMemo(
    () => docentes.filter((docente) =>
      relacionmateriaconcurso.some((asignacion) => asignacion.teacher.id === docente.id),
    ),
    [docentes, relacionmateriaconcurso],
  );
  const materiaelegida = materiasdelcurso.find((materia) => materia.id === asignacionmateriaid);
  const cargasemanalentrada = asignacioncargasemanal.trim();
  const cargasemanalnum = cargasemanalentrada ? Number(cargasemanalentrada) : null;
  const cargasemanalvalida = cargasemanalnum === null ||
    (Number.isInteger(cargasemanalnum) && cargasemanalnum >= 1 && cargasemanalnum <= 30);
  const docentesporespecialidad = React.useMemo(
    () => materiaelegida
      ? docentes.filter((docente) => {
          const especialidad = normalizarespecialidad(docente.specialty);
          const materia = normalizarespecialidad(materiaelegida.name);
          return Boolean(especialidad && materia) &&
            (especialidad === materia || materia.includes(especialidad) || especialidad.includes(materia));
        })
      : [],
    [docentes, materiaelegida],
  );
  const docentescandidatosasignacion = React.useMemo(
    () => Array.from(new Map(
      [
        ...docentesyarelacionados,
        ...docentesporespecialidad,
        ...docentes,
      ].map((docente) => [docente.id, docente]),
    ).values()),
    [docentes, docentesporespecialidad, docentesyarelacionados],
  );

  React.useEffect(() => {
    if (!asignacionmateriaid) {
      establecerasignaciondocenteid('');
      return;
    }
    if (docentesyarelacionados.length === 1) {
      establecerasignaciondocenteid(docentesyarelacionados[0].id);
      return;
    }
    if (docentesyarelacionados.length > 1) {
      establecerasignaciondocenteid((actual) =>
        docentesyarelacionados.some((docente) => docente.id === actual) ? actual : '',
      );
      return;
    }
    if (docentesporespecialidad.length === 1) {
      establecerasignaciondocenteid(docentesporespecialidad[0].id);
      return;
    }
    establecerasignaciondocenteid((actual) =>
      docentescandidatosasignacion.some((docente) => docente.id === actual) ? actual : '',
    );
  }, [
    asignacionmateriaid,
    docentescandidatosasignacion,
    docentesporespecialidad,
    docentesyarelacionados,
  ]);

  React.useEffect(() => {
    const asignacionactual = relacionmateriaconcurso.find(
      (asignacion) => asignacion.teacher.id === asignaciondocenteid,
    );
    establecerasignacioncargasemanal(
      asignacionactual?.weeklyPeriods == null ? '' : String(asignacionactual.weeklyPeriods),
    );
  }, [asignaciondocenteid, relacionmateriaconcurso]);

  const docentesasignadosparabloque = docentes.filter((docente) =>
    (cursohorariodatos?.teacherSubjects ?? []).some(
      (asignacion) => asignacion.subject.id === bloquemateriaid && asignacion.teacher.id === docente.id,
    ),
  );

  React.useEffect(() => {
    if (edicionsesionid) return;
    if (docentesasignadosparabloque.length === 1) {
      establecerbloquedocenteid(docentesasignadosparabloque[0].id);
      return;
    }
    establecerbloquedocenteid((actual) =>
      docentesasignadosparabloque.some((docente) => docente.id === actual) ? actual : '',
    );
  }, [bloquemateriaid, docentesasignadosparabloque, edicionsesionid]);

  const activohorarios: clasehorarioregistro[] = esfamiliaroestudiante
    ? actualhijo?.schedules || mydatos?.schedules || []
    : vistamodo === 'course'
      ? (cursohorariodatos?.schedules ?? [])
      : (docentehorariodatos?.schedules ?? []);

  const activocalificacionnivel = activocurso?.gradeLevel ?? 3;
  const activoturno = esacademicoturno(activocurso?.shift) ? activocurso.shift : 'MORNING';
  const horarioperiodos = crearhorarioperiodofilas(activocalificacionnivel, activoturno);
  const diarioperiodocantidad = horarioperiodos.filter((periodo) => !periodo.isBreak).length;
  const diarioperiododuracion = obtenerminutosperiodopedagogico(
    activocalificacionnivel,
    activoturno,
  );
  const esdocentevista = !esfamiliaroestudiante && vistamodo === 'teacher';
  const docenteperiodocantidad = activohorarios.length
    ? Math.max(...activohorarios.map((horario) => horario.periodIndex))
    : 6;
  const mostrarperiodos: horarioperiodofila[] = esdocentevista
    ? Array.from({ length: docenteperiodocantidad }, (_, indice) => ({
        index: indice + 1,
        start: '',
        end: '',
        label: `${indice + 1}º`,
        isBreak: false,
      }))
    : horarioperiodos;
  const semanalcursocapacidad = diaslectivospasemana * diarioperiodocantidad;

  const activoestudiante = esfamiliaroestudiante ? actualhijo?.student || mydatos?.student : null;

  const horariomatriz = new Map<string, clasehorarioregistro>();
  for (const s of activohorarios) {
    horariomatriz.set(`${s.dayOfWeek}_${s.periodIndex}`, s);
  }

  const inicialcursos = cursos.filter(
    (c) => obtenierniveleducativoregular(c.gradeLevel) === 'INITIAL',
  );
  const primariacursos = cursos.filter(
    (c) => obtenierniveleducativoregular(c.gradeLevel) === 'PRIMARY',
  );
  const secundariacursos = cursos.filter(
    (c) => obtenierniveleducativoregular(c.gradeLevel) === 'SECONDARY',
  );

  const escarga = esfamiliaroestudiante
    ? cargamyhorario
    : vistamodo === 'course'
      ? cargacurso
      : cargadocente;

  // Abrir modal manual para celda específica
  const manejarabrirbloque = (
    diaclave: string,
    indiceperiodo: number,
    sesion?: clasehorarioregistro,
  ) => {
    if (!puedegestionar || vistamodo !== 'course' || !seleccionadocursoid) return;

    establecerbloquedia(diaclave);
    establecerbloqueperiodoindice(indiceperiodo);
    establecermanualerror(null);

    if (sesion) {
      estableceredicionsesionid(sesion.id);
      establecerbloquemateriaid(sesion.subjectId);
      establecerbloquedocenteid(sesion.teacherId);
      establecerbloqueaula(sesion.classroom || `Aula ${activocurso?.name || ''}`);
    } else {
      estableceredicionsesionid(null);
      const primeraasignacion = cursohorariodatos?.teacherSubjects[0];
      establecerbloquemateriaid(primeraasignacion?.subject.id || '');
      const docentesdelamateria = (cursohorariodatos?.teacherSubjects ?? [])
        .filter((asignacion) => asignacion.subject.id === primeraasignacion?.subject.id)
        .map((asignacion) => asignacion.teacher);
      establecerbloquedocenteid(docentesdelamateria.length === 1 ? docentesdelamateria[0].id : '');
      establecerbloqueaula(`Aula ${activocurso?.name || ''}`);
    }

    estableceresmanualmodalabrir(true);
  };

  const manejarguardarmanualbloque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seleccionadocursoid || !bloquemateriaid || !bloquedocenteid) {
      establecermanualerror('Selecciona la materia y el docente');
      return;
    }

    const periodoconfiguracion = horarioperiodos.find(
      (periodo) => periodo.index === bloqueperiodoindice && !periodo.isBreak,
    );
    if (!periodoconfiguracion) {
      establecermanualerror('El período seleccionado no corresponde al curso.');
      return;
    }

    actualizarocrearmutacion.mutate({
      courseId: seleccionadocursoid,
      subjectId: bloquemateriaid,
      teacherId: bloquedocenteid,
      dayOfWeek: bloquedia,
      periodIndex: bloqueperiodoindice,
      startTime: periodoconfiguracion.start,
      endTime: periodoconfiguracion.end,
      classroom: bloqueaula.trim() || undefined,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {esfamiliaroestudiante
              ? `Horario — ${cursoetiqueta(activocurso?.name || '') || 'Gestión 2026'}`
              : 'Horarios de Clases'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {esfamiliaroestudiante
              ? 'Malla horaria semanal'
              : 'Malla semanal por curso o docente con edición y generación automatizada'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {puedegestionar && vistamodo === 'course' && seleccionadocursoid && (
            <>
              <Boton
                size="sm"
                onClick={() => {
                  establecerautomaticoresultado(null);
                  establecerautomaticoerror(null);
                  estableceresautomaticomodalabrir(true);
                }}
                className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generar Automático
              </Boton>

              <Boton
                size="sm"
                variant="outline"
                onClick={() => manejarabrirbloque('LUNES', 1)}
                className="gap-1.5 text-xs text-slate-700"
              >
                <Plus className="w-4 h-4" />
                Asignar Manual
              </Boton>
            </>
          )}

          <Boton
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="gap-1.5 text-xs text-slate-700"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Boton>

          {!esfamiliaroestudiante && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <Boton
                size="sm"
                variant={vistamodo === 'course' ? 'default' : 'ghost'}
                onClick={() => establecervistamodo('course')}
                className={`gap-1.5 text-xs ${vistamodo === 'course' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <GraduationCap className="w-4 h-4" />
                Por Curso
              </Boton>
              <Boton
                size="sm"
                variant={vistamodo === 'teacher' ? 'default' : 'ghost'}
                onClick={() => establecervistamodo('teacher')}
                className={`gap-1.5 text-xs ${vistamodo === 'teacher' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                <User className="w-4 h-4" />
                Por Docente
              </Boton>
            </div>
          )}
        </div>
      </div>

      {/* Context Toolbar */}
      {esfamiliaroestudiante ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            {activocurso && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-sm font-medium">
                <GraduationCap className="w-4 h-4" />
                {cursoetiqueta(activocurso.name)}
              </span>
            )}

            {activoestudiante && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
                <User className="w-4 h-4" />
                {activoestudiante.firstName} {activoestudiante.lastName}
              </span>
            )}

            {mydatos?.type === 'parent' && hijos.length > 1 && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-xs font-medium text-slate-500">Hijos:</span>
                {hijos.map((hijo, indice) => (
                  <Boton
                    key={hijo.student.id}
                    size="sm"
                    variant={seleccionadohijoindice === indice ? 'default' : 'outline'}
                    onClick={() => establecerseleccionadohijoindice(indice)}
                    className="text-xs h-8"
                  >
                    {hijo.student.firstName}
                  </Boton>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {vistamodo === 'course' ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <label className="text-sm font-medium text-slate-700 shrink-0">Curso:</label>
                <select
                  value={seleccionadocursoid}
                  onChange={(e) => {
                    establecerseleccionadocursoid(e.target.value);
                    establecerasignacionmateriaid('');
                    establecerasignaciondocenteid('');
                    establecerasignacioncargasemanal('');
                  }}
                  className="flex-1 max-w-md h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <optgroup label="Inicial">
                    {inicialcursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cursoetiqueta(c.name)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Primaria">
                    {primariacursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cursoetiqueta(c.name)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Secundaria">
                    {secundariacursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cursoetiqueta(c.name)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {puedegestionar && (
                <span className="text-xs text-slate-500 hidden sm:inline font-mono">
                  * Haz clic en cualquier celda para editar o asignar manualmente
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="text-sm font-medium text-slate-700 shrink-0">Docente:</label>
              <select
                value={seleccionadodocenteid}
                onChange={(e) => establecerseleccionadodocenteid(e.target.value)}
                className="flex-1 max-w-md h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {docentes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.lastName} {t.firstName} — {t.specialty}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {puedegestionar && vistamodo === 'course' && seleccionadocursoid && (
        <section className="rounded-xl border border-slate-200 bg-white p-4" aria-label="Materias y docentes del curso">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Materias y docentes del curso</h2>
            <span className="text-xs text-slate-500">
              {cursohorariodatos?.teacherSubjects.length ?? 0} asignaciones
            </span>
          </div>
          {(cursohorariodatos?.teacherSubjects.length ?? 0) > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cursohorariodatos?.teacherSubjects.map((asignacion) => (
                <span key={asignacion.id} title={`${asignacion.subject.name} · ${asignacion.teacher.firstName} ${asignacion.teacher.lastName}`} className="max-w-full truncate rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {asignacion.subject.name} · {asignacion.teacher.firstName} {asignacion.teacher.lastName}
                  <span className="text-slate-500">
                    {asignacion.weeklyPeriods == null ? ' · carga automática' : ` · ${asignacion.weeklyPeriods}/sem`}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-amber-800">
              Asigna al menos una materia y un docente para generar el horario de este curso.
            </p>
          )}
          <div className="mt-4 grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,1fr)_minmax(16rem,1.4fr)_9rem_auto]">
            <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-700">
              Materia
              <select
                value={asignacionmateriaid}
                onChange={(evento) => {
                  establecerasignacionmateriaid(evento.target.value);
                  establecerasignaciondocenteid('');
                  establecerasignacioncargasemanal('');
                }}
                className="h-10 min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">Selecciona una materia</option>
                {materiasdelcurso.map((materia) => (
                  <option key={materia.id} value={materia.id}>{materia.name}</option>
                ))}
              </select>
            </label>
            <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-700">
              Docente asignado
              <select
                value={asignaciondocenteid}
                disabled={!asignacionmateriaid || docentescandidatosasignacion.length === 0}
                onChange={(evento) => establecerasignaciondocenteid(evento.target.value)}
                className="h-10 min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm disabled:bg-slate-100"
              >
                <option value="">Selecciona docente</option>
                {docentescandidatosasignacion.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.lastName} {docente.firstName} · {docente.specialty}
                    {docentesyarelacionados.some((candidato) => candidato.id === docente.id)
                      ? ' · ya asignado'
                      : docentesporespecialidad.some((candidato) => candidato.id === docente.id)
                        ? ' · sugerido por materia'
                        : ''}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid min-w-0 gap-1.5 text-xs font-medium text-slate-700">
              Sesiones por semana
              <input
                type="number"
                min={1}
                max={30}
                step={1}
                inputMode="numeric"
                value={asignacioncargasemanal}
                onChange={(evento) => establecerasignacioncargasemanal(evento.target.value)}
                placeholder="Automática"
                disabled={!asignacionmateriaid || !asignaciondocenteid}
                aria-label="Sesiones semanales que impartirá este docente en la materia"
                className="h-10 min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm disabled:bg-slate-100"
                aria-invalid={!cargasemanalvalida}
              />
            </label>
            <Boton
              type="button"
              disabled={asignarmateriasmutacion.isPending || !asignaciondocenteid || !asignacionmateriaid || !cargasemanalvalida}
              onClick={() => asignarmateriasmutacion.mutate()}
            >
              Guardar asignación
            </Boton>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Deja todas vacías para repartir la carga por materia entre sus docentes. Si configuras alguna, las sesiones restantes se distribuyen entre las asignaciones vacías; el total debe coincidir con las sesiones lectivas disponibles del curso.
          </p>
          {!cargasemanalvalida && (
            <p role="alert" className="mt-1 text-xs text-rose-700">
              Escribe un número entero entre 1 y 30 sesiones.
            </p>
          )}
          {asignacionmateriaid && docentesyarelacionados.length === 0 && docentesporespecialidad.length === 0 && (
            <p className="mt-2 text-xs text-amber-800">
              No hay una especialidad que coincida con esta materia. Puedes asignar cualquier docente disponible; la sugerencia no restringe la elección.
            </p>
          )}
          {asignarmateriasmutacion.isError && <p role="alert" className="mt-2 text-sm text-rose-700">{asignarmateriasmutacion.error.message}</p>}
          {asignarmateriasmutacion.isSuccess && <p role="status" className="mt-2 text-sm text-emerald-700">Asignación guardada. Ya puedes generar el horario.</p>}
        </section>
      )}

      {/* Grid Table */}
      {escarga ? (
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
                    {esdocentevista ? 'Período' : 'Hora'}
                  </th>
                  {constantedias.map((d) => (
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
                {mostrarperiodos.map((periodo, indice) => {
                  if (periodo.isBreak) {
                    return (
                      <tr key={`break-${indice}`} className="bg-amber-50/70">
                        <td className="py-2 px-4 font-mono text-xs text-amber-800 border-r border-amber-200 font-semibold">
                          {periodo.start} - {periodo.end}
                        </td>
                        <td
                          colSpan={5}
                          className="py-2 px-4 text-center text-xs font-bold uppercase tracking-wider text-amber-800"
                        >
                          {periodo.label}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={`period-${periodo.index}`} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 border-r border-slate-200 bg-slate-50/70">
                        <div className="font-semibold text-slate-900">{periodo.label}</div>
                        {periodo.start && periodo.end && (
                          <div className="font-mono text-xs text-slate-500">
                            {periodo.start} - {periodo.end}
                          </div>
                        )}
                      </td>

                      {constantedias.map((dia) => {
                        const sesion = horariomatriz.get(`${dia.key}_${periodo.index}`);

                        if (!sesion) {
                          return (
                            <td
                              key={dia.key}
                              onClick={() => manejarabrirbloque(dia.key, Number(periodo.index))}
                              className={`py-3 px-3 text-center border-r border-slate-200 last:border-r-0 bg-slate-50/30 transition-colors ${
                                puedegestionar && vistamodo === 'course'
                                  ? 'cursor-pointer hover:bg-slate-100/90 group'
                                  : ''
                              }`}
                            >
                              {puedegestionar && vistamodo === 'course' ? (
                                <div className="text-slate-300 group-hover:text-slate-600 flex items-center justify-center gap-1 text-xs font-medium">
                                  <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <span className="opacity-40 group-hover:opacity-100 transition-opacity">
                                    —
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>
                          );
                        }

                        const color = constantemateriacolores[sesion.subject?.code || ''] || {
                          bg: 'bg-slate-100',
                          text: 'text-slate-800',
                          border: 'border-slate-200',
                        };

                        return (
                          <td
                            key={dia.key}
                            onClick={() =>
                              manejarabrirbloque(dia.key, Number(periodo.index), sesion)
                            }
                            className={`p-2 border-r border-slate-200 last:border-r-0 align-top transition-all ${
                              puedegestionar && vistamodo === 'course'
                                ? 'cursor-pointer hover:opacity-95'
                                : ''
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg border ${color.bg} ${color.border} min-h-[64px] relative group shadow-2xs`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/90 border ${color.border} ${color.text}`}
                                >
                                  {sesion.subject?.code}
                                </span>
                                {sesion.classroom && (
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {sesion.classroom}
                                  </span>
                                )}
                              </div>
                              <div className={`font-semibold text-xs leading-tight ${color.text}`}>
                                {sesion.subject?.name}
                              </div>
                              {esdocentevista && (
                                <div className="mt-1 font-mono text-[10px] text-slate-500">
                                  {sesion.startTime} - {sesion.endTime}
                                </div>
                              )}
                              <div className="mt-1.5 pt-1 border-t border-black/5 text-[11px] text-slate-600 flex items-center justify-between">
                                {esfamiliaroestudiante || vistamodo === 'course' ? (
                                  <span>Prof. {sesion.teacher?.lastName}</span>
                                ) : (
                                  <span>{sesion.course?.name}</span>
                                )}

                                {puedegestionar && vistamodo === 'course' && (
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
              {esfamiliaroestudiante || vistamodo === 'course'
                ? `${new Set(activohorarios.map((s) => s.subjectId)).size} materias`
                : `${new Set(activohorarios.map((s) => s.courseId)).size} cursos`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">
              {esdocentevista ? 'Sesiones asignadas' : 'Carga semanal'}
            </span>
            <p className="text-lg font-bold text-slate-900">
              {esdocentevista
                ? `${activohorarios.length} períodos`
                : `${activohorarios.length} / ${semanalcursocapacidad} períodos`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Marco Normativo</span>
            <p className="text-lg font-bold text-slate-900">Ley 070 / R.M. 0001/2026</p>
          </div>
        </div>
      </div>

      {/* Modal: Edición Manual de Horario */}
      {esmanualmodalabrir && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {edicionsesionid ? 'Editar Período de Horario' : 'Asignar Nuevo Período'}
                  </h3>
                  <p className="text-xs text-slate-500">{activocurso?.name}</p>
                </div>
              </div>
              <button
                onClick={() => estableceresmanualmodalabrir(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={manejarguardarmanualbloque} className="p-5 space-y-4">
              {manualerror && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualerror}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Día de la Semana
                  </label>
                  <select
                    value={bloquedia}
                    onChange={(e) => establecerbloquedia(e.target.value)}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {constantedias.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Período / Hora
                  </label>
                  <select
                    value={bloqueperiodoindice}
                    onChange={(e) => establecerbloqueperiodoindice(Number(e.target.value))}
                    className="w-full h-10 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {horarioperiodos
                      .filter((periodo) => !periodo.isBreak)
                      .map((p) => (
                        <option key={p.index} value={p.index}>
                          {p.label} ({p.start} - {p.end})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asignatura / Materia *
                </label>
                <select
                  required
                  value={bloquemateriaid}
                  onChange={(e) => establecerbloquemateriaid(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Selecciona materia...</option>
                  {materiasasignadascurso.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Docente Asignado *
                </label>
                <select
                  required
                  value={bloquedocenteid}
                  onChange={(e) => establecerbloquedocenteid(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Selecciona docente...</option>
                  {docentesasignadosparabloque.map((docente) => (
                    <option key={docente.id} value={docente.id}>
                      {docente.lastName} {docente.firstName} — {docente.specialty}
                    </option>
                  ))}
                </select>
                {docentesasignadosparabloque.length === 0 && (
                  <p className="mt-1 text-xs text-amber-800">Primero asigna un docente a esta materia en “Materias y docentes del curso”.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aula / Salón
                </label>
                <input
                  type="text"
                  value={bloqueaula}
                  onChange={(e) => establecerbloqueaula(e.target.value)}
                  placeholder="Ej. Aula 102, Lab de Computación, Cancha"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {edicionsesionid ? (
                  <Boton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm('¿Deseas quitar esta materia de este período?')) {
                        eliminarmutacion.mutate(edicionsesionid);
                      }
                    }}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Quitar
                  </Boton>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Boton
                    type="button"
                    variant="outline"
                    onClick={() => estableceresmanualmodalabrir(false)}
                  >
                    Cancelar
                  </Boton>
                  <Boton
                    type="submit"
                    disabled={actualizarocrearmutacion.isPending}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    {actualizarocrearmutacion.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Sesión'
                    )}
                  </Boton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generación Automática con Algoritmo */}
      {esautomaticomodalabrir && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Generador Automático de Horarios</h3>
                  <p className="text-xs text-slate-500">
                    Algoritmo de optimización curricular ministerial
                  </p>
                </div>
              </div>
              <button
                onClick={() => estableceresautomaticomodalabrir(false)}
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
                    <strong>Distribución equilibrada:</strong> Reparte las sesiones entre las
                    asignaciones del curso y calcula los bloques según el grado y turno.
                  </li>
                  <li>
                    <strong>Anti-Colisión Docente:</strong> Verifica que el profesor no tenga otra
                    clase simultánea en otro curso.
                  </li>
                  <li>
                    <strong>Revisión:</strong> El horario generado es una propuesta; verifica la
                    carga curricular requerida antes de publicarlo.
                  </li>
                </ul>
              </div>

              {automaticoresultado ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>¡Horario Generado con Éxito!</span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    Se asignaron las {automaticoresultado.totalSlots} sesiones semanales sin
                    conflictos de docentes. Verifica el reparto por materia antes de publicar el
                    horario.
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {automaticoresultado.distribution.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[11px] bg-white/80 px-2.5 py-1 rounded border border-emerald-100"
                      >
                        <span className="font-medium text-slate-800">
                          {d.subjectName} ({d.code})
                        </span>
                        <span className="font-mono text-emerald-800">
                          {d.periods} períodos/sem · {d.teacherName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Curso destino:{' '}
                    <span className="text-indigo-600 font-bold">{activocurso?.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Se reemplazará la malla actual con {diarioperiodocantidad} períodos pedagógicos
                    diarios de {diarioperiododuracion} minutos, distribuidos de forma equilibrada
                    entre las asignaciones del curso. Revisa la carga curricular requerida antes de
                    usarla.
                  </p>
                </div>
              )}

              {automaticoerror && (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800"
                >
                  {automaticoerror}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => estableceresautomaticomodalabrir(false)}
                >
                  {automaticoresultado ? 'Cerrar' : 'Cancelar'}
                </Boton>
                {!automaticoresultado && (
                  <Boton
                    type="button"
                    disabled={generarautomaticomutacion.isPending || !seleccionadocursoid}
                    onClick={() => generarautomaticomutacion.mutate(seleccionadocursoid)}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {generarautomaticomutacion.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando horario...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        Generar horario
                      </>
                    )}
                  </Boton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
