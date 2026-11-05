import { useEffect, useState, useMemo, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Globe,
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
import { Boton } from '../../../components/ui/boton';
import {
  gestioncalificacion,
  type calificacionperiodoopcion,
  type calificacionregistro,
  type calificacionestudianteopcion,
  type calificacioncierrevistaprevia,
} from '../application/gestioncalificaciones';
import { CalificacionCorreccionesPanel } from '../components/panelcorreccionescalificaciones';
import { cursoetiqueta, turnoetiqueta } from '../../../lib/cursoetiqueta';
import { materiacorrespondealgrado } from '../../../lib/materiaspornivel';
import { cargarcalificacionesplanilla, interpretarcalificacion, prepararcalificacionesplanilla } from '../application/planillacalificaciones';

const calificacionformularioesquema = z.object({
  enrollmentId: z.string().uuid('Selecciona una matrícula'),
  studentId: z.string().uuid('Selecciona un estudiante'),
  subjectId: z.string().uuid('Selecciona una materia'),
  periodId: z.string().uuid('Selecciona un periodo'),
  value: z.coerce.number().min(0, 'Mínimo 0').max(100, 'Máximo 100'),
  remarks: z.string().optional(),
});
type calificacionformulariodatos = z.infer<typeof calificacionformularioesquema>;

function obtenerley070escala(valor: number): { label: string; badgeClass: string } {
  if (valor >= 85)
    return {
      label: 'Desarrollo Pleno',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  if (valor >= 69)
    return { label: 'Desarrollo Óptimo', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (valor >= 51)
    return {
      label: 'Desarrollo Aceptable',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  return { label: 'En Desarrollo', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
}

interface calificacionespaginapropiedades {
  management: gestioncalificacion;
  currentRole?: string;
}

export const CalificacionesPagina = ({
  management: gestion,
  currentRole: actualrol,
}: calificacionespaginapropiedades) => {
  const clientedeconsultas = useQueryClient();
  const [vistamodo, establecervistamodo] = useState<'ROSTER' | 'LIST'>('ROSTER');
  const [mostrarunicoformulario, establecermostrarunicoformulario] = useState(false);
  const [buscar, establecerbuscar] = useState('');
  const [listacursoid, establecerlistacursoid] = useState('');
  const [listamateriaid, establecerlistamateriaid] = useState('');
  const [listaperiodoid, establecerlistaperiodoid] = useState('');
  const [listapagina, establecerlistapagina] = useState(0);
  const [busquedaestudiante, establecerbusquedaestudiante] = useState('');
  const [filtrocursoindividual, establecerfiltrocursoindividual] = useState('');
  const [cierrevistaprevia, establecercierrevistaprevia] = useState<calificacioncierrevistaprevia | null>(null);

  // Course Roster State (BP-12 Planilla Grupal)
  const [seleccionadocursoid, establecerseleccionadocursoid] = useState<string>('');
  const [seleccionadomateriaid, establecerseleccionadomateriaid] = useState<string>('');
  const [seleccionadoperiodoid, establecerseleccionadoperiodoid] = useState<string>('');
  const [listacalificaciones, establecerlistacalificaciones] = useState<Record<string, string>>({});
  const [listaobservaciones, establecerlistaobservaciones] = useState<Record<string, string>>({});
  const [retroalimentacionmasiva, establecermasivoretroalimentacion] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [periodocierreerror, establecerperiodocierreerror] = useState<string | null>(null);
  const [mostrarcrearperiodo, establecermostrarcrearperiodo] = useState(false);
  const [nuevoperiodonombre, establecernuevoperiodonombre] = useState('');
  const [nuevoperiodonumero, establecernuevoperiodonumero] = useState(1);
  const [nuevoperiodofechainicio, establecernuevoperiodofechainicio] = useState('');
  const [nuevoperiodofechafin, establecernuevoperiodofechafin] = useState('');
  const [crearperiodoerror, establecercrearperiodoerror] = useState<string | null>(null);

  const puedeeditar = ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'].includes(actualrol ?? '');
  const esprivilegiado = actualrol === 'ADMINISTRATIVE';
  const puedesolicitudcorrecciones = ['ADMINISTRATIVE', 'TEACHER'].includes(actualrol ?? '');

  const calificacionesconsulta = useQuery({
    queryKey: ['grades', 'roster', seleccionadocursoid, seleccionadomateriaid, seleccionadoperiodoid],
    queryFn: () => cargarcalificacionesplanilla(gestion, {
      courseId: seleccionadocursoid,
      subjectId: seleccionadomateriaid,
      periodId: seleccionadoperiodoid,
    }),
    enabled: Boolean(seleccionadocursoid && seleccionadomateriaid && seleccionadoperiodoid),
    refetchOnWindowFocus: false,
  });
  const listaconsulta = useQuery({
    queryKey: ['grades', 'list', buscar, listacursoid, listamateriaid, listaperiodoid, listapagina],
    queryFn: () => gestion.buscarcalificaciones({
      search: buscar.trim() || undefined,
      courseId: listacursoid || undefined,
      subjectId: listamateriaid || undefined,
      periodId: listaperiodoid || undefined,
      offset: listapagina * 200,
    }),
    enabled: vistamodo === 'LIST',
  });
  const estudiantesconsulta = useQuery({
    queryKey: ['grade-students'],
    queryFn: () => gestion.listarestudiantes(),
    refetchOnWindowFocus: false,
  });
  const cursosconsulta = useQuery({
    queryKey: ['courses'],
    queryFn: () => gestion.listarcursos(),
  });
  const materiasconsulta = useQuery({
    queryKey: ['subjects'],
    queryFn: () => gestion.listarmaterias(),
  });
  const materiascursoconsulta = useQuery({
    queryKey: ['grade-subjects', seleccionadocursoid],
    queryFn: () => gestion.listarmaterias(seleccionadocursoid),
    enabled: actualrol === 'TEACHER' && Boolean(seleccionadocursoid),
  });
  const periodosconsulta = useQuery({
    queryKey: ['periods'],
    queryFn: () => gestion.listarperiodos(),
  });

  const cursos = useMemo(() => cursosconsulta.data ?? [], [cursosconsulta.data]);
  const materias = useMemo(() => materiasconsulta.data ?? [], [materiasconsulta.data]);
  const periodos: calificacionperiodoopcion[] = useMemo(
    () => periodosconsulta.data ?? [],
    [periodosconsulta.data],
  );
  const estudiantes: calificacionestudianteopcion[] = useMemo(
    () => estudiantesconsulta.data ?? [],
    [estudiantesconsulta.data],
  );
  const calificaciones: calificacionregistro[] = useMemo(
    () => calificacionesconsulta.data ?? [],
    [calificacionesconsulta.data],
  );

  // Set default filters for Roster
  useEffect(() => {
    if (!seleccionadocursoid && cursos.length > 0) establecerseleccionadocursoid(cursos[0].id);
    if (!seleccionadoperiodoid && periodos.length > 0)
      establecerseleccionadoperiodoid(periodos[0].id);
  }, [
    cursos,
    materias,
    periodos,
    seleccionadocursoid,
    seleccionadomateriaid,
    seleccionadoperiodoid,
  ]);

  const activoperiodo = useMemo(
    () => periodos.find((p) => p.id === seleccionadoperiodoid),
    [periodos, seleccionadoperiodoid],
  );
  const activocurso = useMemo(
    () => cursos.find((c) => c.id === seleccionadocursoid),
    [cursos, seleccionadocursoid],
  );
  const materiasdelcurso = (actualrol === 'TEACHER' ? materiascursoconsulta.data ?? [] : materias).filter((materia) =>
    activocurso && materiacorrespondealgrado(materia.code, activocurso.gradeLevel),
  );
  useEffect(() => {
    if (actualrol === 'TEACHER' && materiascursoconsulta.isPending) return;
    if (!materiasdelcurso.some((materia) => materia.id === seleccionadomateriaid)) {
      establecerseleccionadomateriaid(materiasdelcurso[0]?.id ?? '');
    }
  }, [actualrol, materiascursoconsulta.isPending, materiasdelcurso, seleccionadomateriaid]);

  // Students enrolled in selected course
  const inscritoestudiantes = useMemo(() => {
    if (!seleccionadocursoid) return [];
    return estudiantes.filter((estado) =>
      estado.enrollments?.some(
        (en) => en.course?.id === seleccionadocursoid && en.status === 'ACTIVE' &&
          en.academicYear.id === activoperiodo?.academicYearId,
      ),
    );
  }, [activoperiodo?.academicYearId, estudiantes, seleccionadocursoid]);

  const calificacionesdelcurso = useMemo(() => {
    if (!seleccionadomateriaid || !seleccionadoperiodoid) return [];
    return calificaciones.filter(
      (g) => g.subjectId === seleccionadomateriaid && g.periodId === seleccionadoperiodoid,
    );
  }, [calificaciones, seleccionadomateriaid, seleccionadoperiodoid]);

  const estadopublicacion = useMemo(() => {
    if (calificacionesdelcurso.length === 0) {
      return { todas: false, alguna: false, total: 0, fecha: null };
    }
    const publicadas = calificacionesdelcurso.filter((c) => Boolean(c.publishedAt));
    return {
      todas: publicadas.length > 0 && publicadas.length === calificacionesdelcurso.length,
      alguna: publicadas.length > 0,
      total: publicadas.length,
      fecha: publicadas[0]?.publishedAt ?? null,
    };
  }, [calificacionesdelcurso]);

  // Populate roster with existing grades when selection changes
  useEffect(() => {
    if (!seleccionadocursoid || !seleccionadomateriaid || !seleccionadoperiodoid) return;
    if (!calificacionesconsulta.isSuccess || !estudiantesconsulta.isSuccess) return;
    const inicialvalores: Record<string, string> = {};
    const inicialobservaciones: Record<string, string> = {};

    inscritoestudiantes.forEach((estado) => {
      const coincidencia = calificaciones.find(
        (g) =>
          g.studentId === estado.id &&
          g.subjectId === seleccionadomateriaid &&
          g.periodId === seleccionadoperiodoid,
      );
      if (coincidencia) {
        inicialvalores[estado.id] = String(coincidencia.value);
        if (coincidencia.remarks) inicialobservaciones[estado.id] = coincidencia.remarks;
      }
    });
    establecerlistacalificaciones(inicialvalores);
    establecerlistaobservaciones(inicialobservaciones);
  }, [
    seleccionadocursoid,
    seleccionadomateriaid,
    seleccionadoperiodoid,
    inscritoestudiantes,
    calificaciones,
    calificacionesconsulta.isSuccess,
    estudiantesconsulta.isSuccess,
  ]);

  // Single form
  const formulario = useForm<calificacionformulariodatos>({
    resolver: zodResolver(calificacionformularioesquema),
    defaultValues: {
      enrollmentId: '',
      studentId: '',
      subjectId: '',
      periodId: '',
      value: 0,
      remarks: '',
    },
  });
  const unicoestudianteid = formulario.watch('studentId');
  const unicoperiodoid = formulario.watch('periodId');
  const inscripcionesindividuales = useMemo(() => {
    const gestionid = periodos.find((periodo) => periodo.id === unicoperiodoid)?.academicYearId;
    if (!gestionid) return [];
    return estudiantes.flatMap((estudiante) => {
      const inscripcion = (estudiante.enrollments ?? []).find(
        (elemento) => elemento.status === 'ACTIVE' && elemento.academicYear?.id === gestionid,
      );
      return inscripcion ? [{ estudiante, inscripcion }] : [];
    });
  }, [estudiantes, periodos, unicoperiodoid]);
  const cursosindividuales = useMemo(
    () => [...new Set(inscripcionesindividuales.map(({ inscripcion }) => inscripcion.course.name))].sort(),
    [inscripcionesindividuales],
  );
  const opcionesestudianteindividual = useMemo(() => {
    const termino = busquedaestudiante.trim().toLocaleLowerCase();
    return inscripcionesindividuales.filter(({ estudiante, inscripcion }) => {
      if (filtrocursoindividual && inscripcion.course.name !== filtrocursoindividual) return false;
      if (!termino) return true;
      return `${estudiante.firstName} ${estudiante.lastName} ${estudiante.rude}`
        .toLocaleLowerCase()
        .includes(termino);
    });
  }, [busquedaestudiante, filtrocursoindividual, inscripcionesindividuales]);
  const unicoinscripcion = estudiantes
    .find((estudiante) => estudiante.id === unicoestudianteid)
    ?.enrollments?.find((inscripcion) =>
      inscripcion.status === 'ACTIVE' &&
      inscripcion.academicYear?.id === periodos.find((periodo) => periodo.id === unicoperiodoid)?.academicYearId,
    );
  const materiasindividualesconsulta = useQuery({
    queryKey: ['grade-subjects', unicoinscripcion?.course.id],
    queryFn: () => gestion.listarmaterias(unicoinscripcion!.course.id),
    enabled: actualrol === 'TEACHER' && Boolean(unicoinscripcion?.course.id),
  });
  const materiasunicas = (actualrol === 'TEACHER' ? materiasindividualesconsulta.data ?? [] : materias).filter((materia) =>
    unicoinscripcion && materiacorrespondealgrado(materia.code, unicoinscripcion.course.gradeLevel),
  );
  useEffect(() => {
    formulario.setValue('enrollmentId', unicoinscripcion?.id ?? '');
  }, [formulario, unicoinscripcion?.id]);
  useEffect(() => {
    if (actualrol === 'TEACHER' && materiasindividualesconsulta.isPending) return;
    const materiaid = formulario.getValues('subjectId');
    if (materiaid && !materiasunicas.some((materia) => materia.id === materiaid)) {
      formulario.setValue('subjectId', '');
    }
  }, [actualrol, formulario, materiasindividualesconsulta.isPending, materiasunicas]);

  const crearunicomutacion = useMutation({
    mutationFn: (entrada: calificacionformulariodatos) => gestion.crearcalificacion(entrada),
    onSuccess: () => {
      formulario.reset();
      establecerbusquedaestudiante('');
      establecerfiltrocursoindividual('');
      establecermostrarunicoformulario(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['grades'] });
    },
  });

  // Bulk save mutation (RF-20)
  const masivoguardarmutacion = useMutation({
    mutationFn: async () => {
      establecermasivoretroalimentacion(null);
      if (activoperiodo?.isClosed) {
        throw new Error('El período está cerrado. Registre una solicitud formal de corrección.');
      }
      if (!calificacionesconsulta.isSuccess || !estudiantesconsulta.isSuccess) {
        throw new Error('Espera a que se cargue la planilla completa antes de guardar.');
      }
      const calificacionesaenviar = prepararcalificacionesplanilla({
        estudiantes: inscritoestudiantes,
        registradas: calificaciones,
        valores: listacalificaciones,
        observaciones: listaobservaciones,
        courseId: seleccionadocursoid,
        academicYearId: activoperiodo?.academicYearId ?? '',
      });

      if (calificacionesaenviar.length === 0) {
        throw new Error('No hay calificaciones nuevas o modificadas para guardar.');
      }

      return gestion.crearmasivocalificaciones({
        courseId: seleccionadocursoid,
        subjectId: seleccionadomateriaid,
        periodId: seleccionadoperiodoid,
        grades: calificacionesaenviar,
      });
    },
    onSuccess: (datos) => {
      establecermasivoretroalimentacion({
        type: 'success',
        message: `Planilla guardada exitosamente: ${datos.count} notas asentadas con trazabilidad.`,
      });
      void clientedeconsultas.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error: unknown) => {
      establecermasivoretroalimentacion({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Error al guardar la planilla de calificaciones.',
      });
    },
  });

  // Toggle period closure mutation (RF-18, RF-22)
  const alternarperiodocierremutacion = useMutation({
    mutationFn: async (entrada: {
      period: calificacionperiodoopcion;
      close: boolean;
      expectedGradeCount?: number;
    }) => {
      return gestion.actualizarperiodo({
        id: entrada.period.id,
        isClosed: entrada.close,
        expectedGradeCount: entrada.expectedGradeCount,
      });
    },
    onSuccess: () => {
      establecerperiodocierreerror(null);
      establecercierrevistaprevia(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['periods'] });
    },
    onError: (error: unknown) => {
      establecerperiodocierreerror(
        error instanceof Error ? error.message : 'No se pudo actualizar el período.',
      );
    },
  });

  // Grade publication mutation (RF-24)
  const publicarmutacion = useMutation({
    mutationFn: async () => {
      establecermasivoretroalimentacion(null);
      return gestion.publicarcalificaciones({
        courseId: seleccionadocursoid,
        subjectId: seleccionadomateriaid,
        periodId: seleccionadoperiodoid,
      });
    },
    onSuccess: (datos) => {
      establecermasivoretroalimentacion({
        type: 'success',
        message: `Calificaciones publicadas exitosamente: ${datos.publishedCount} notas ahora visibles para familias y estudiantes.`,
      });
      void clientedeconsultas.invalidateQueries({ queryKey: ['grades'] });
    },
    onError: (error: unknown) => {
      establecermasivoretroalimentacion({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Error al publicar calificaciones.',
      });
    },
  });

  // Create evaluation period mutation (RF-18)
  const crearperiodomutacion = useMutation({
    mutationFn: async () => {
      establecercrearperiodoerror(null);
      const gestionid = activoperiodo?.academicYearId ?? periodos[0]?.academicYearId;
      if (!gestionid) {
        throw new Error('No hay una gestión académica asociada.');
      }
      if (!nuevoperiodonombre.trim()) {
        throw new Error('El nombre del período es requerido.');
      }
      return gestion.crearperiodo({
        academicYearId: gestionid,
        name: nuevoperiodonombre.trim(),
        number: Number(nuevoperiodonumero),
        startDate: nuevoperiodofechainicio || new Date().toISOString().split('T')[0],
        endDate: nuevoperiodofechafin || new Date().toISOString().split('T')[0],
      });
    },
    onSuccess: (nuevo) => {
      establecermostrarcrearperiodo(false);
      establecernuevoperiodonombre('');
      establecerseleccionadoperiodoid(nuevo.id);
      void clientedeconsultas.invalidateQueries({ queryKey: ['periods'] });
    },
    onError: (error: unknown) => {
      establecercrearperiodoerror(
        error instanceof Error ? error.message : 'Error al crear período.',
      );
    },
  });

  const manejarperiodocierrealternar = async (periodo: calificacionperiodoopcion) => {
    establecerperiodocierreerror(null);
    if (periodo.isClosed) {
      alternarperiodocierremutacion.mutate({ period: periodo, close: false });
      return;
    }
    try {
      const vistaprevia = await gestion.obtenerperiodocierrevistaprevia(periodo.id);
      establecercierrevistaprevia(vistaprevia);
    } catch (error: unknown) {
      establecerperiodocierreerror(
        error instanceof Error ? error.message : 'No se pudo obtener el resumen del período.',
      );
    }
  };

  const filtradocalificaciones = calificaciones.filter((g) => {
    if (!buscar.trim()) return true;
    const termino = buscar.toLowerCase();
    return (
      g.student.firstName.toLowerCase().includes(termino) ||
      g.student.lastName.toLowerCase().includes(termino) ||
      g.subject.name.toLowerCase().includes(termino) ||
      g.period.name.toLowerCase().includes(termino)
    );
  });
  const unicoformularioperiodo = periodos.find(
    (periodo) => periodo.id === formulario.watch('periodId'),
  );
  const listadatos = listaconsulta.data?.data ?? [];
  const listatotal = listaconsulta.data?.total ?? 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gestión de Calificaciones</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {calificaciones.length} notas registradas · Escala Ministerial Ley 070 (0–100 pts)
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => establecervistamodo('ROSTER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                vistamodo === 'ROSTER'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Planilla por Curso (Carga Grupal)
            </button>
            <button
              type="button"
              onClick={() => establecervistamodo('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                vistamodo === 'LIST'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista de Calificaciones
            </button>
          </div>

          {puedeeditar && (
            <button
              type="button"
              onClick={() => establecermostrarunicoformulario((anterior) => !anterior)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              {mostrarunicoformulario ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {mostrarunicoformulario ? 'Cerrar' : 'Nota Individual'}
            </button>
          )}
        </div>
      </div>

      {/* Ley 070 Scale Reference */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          {
            label: 'Desarrollo Pleno',
            range: '85-100 pts',
            color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          },
          {
            label: 'Desarrollo Óptimo',
            range: '69-84 pts',
            color: 'bg-blue-50 text-blue-800 border-blue-200',
          },
          {
            label: 'Desarrollo Aceptable',
            range: '51-68 pts',
            color: 'bg-amber-50 text-amber-800 border-amber-200',
          },
          {
            label: 'En Desarrollo',
            range: '1-50 pts',
            color: 'bg-rose-50 text-rose-800 border-rose-200',
          },
        ].map((elemento) => (
          <div key={elemento.label} className={`p-2.5 rounded-lg border ${elemento.color}`}>
            <span className="text-xs font-semibold">{elemento.label}</span>
            <p className="text-xs font-bold font-mono mt-0.5">{elemento.range}</p>
          </div>
        ))}
      </div>

      <CalificacionCorreccionesPanel
        management={gestion}
        grades={filtradocalificaciones}
        periods={periodos}
        canRequest={puedesolicitudcorrecciones}
        canApprove={esprivilegiado}
      />

      {/* Single Grade Form Modal */}
      {mostrarunicoformulario && puedeeditar && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Asentar Calificación Individual
          </h2>
          <form
            onSubmit={formulario.handleSubmit((datos) => crearunicomutacion.mutate(datos))}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SeleccionarCampo
                label="Período"
                error={formulario.formState.errors.periodId?.message}
                {...formulario.register('periodId')}
              >
                <option value="">Seleccione período...</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.name} {periodo.isClosed ? '(CERRADO)' : '(ABIERTO)'}
                  </option>
                ))}
              </SeleccionarCampo>

              <Campo label="Buscar estudiante">
                <input
                  type="search"
                  value={busquedaestudiante}
                  onChange={(evento) => establecerbusquedaestudiante(evento.target.value)}
                  placeholder="Nombre, apellido o RUDE"
                  autoComplete="off"
                  disabled={!unicoperiodoid}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </Campo>

              <Campo label="Filtrar por curso (opcional)">
                <select
                  value={filtrocursoindividual}
                  onChange={(evento) => establecerfiltrocursoindividual(evento.target.value)}
                  disabled={!unicoperiodoid}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="">Todos los cursos</option>
                  {cursosindividuales.map((curso) => (
                    <option key={curso} value={curso}>{cursoetiqueta(curso)}</option>
                  ))}
                </select>
              </Campo>

              <Campo label="Estudiante" error={formulario.formState.errors.studentId?.message}>
                <select
                  value={unicoestudianteid}
                  onChange={(evento) => formulario.setValue('studentId', evento.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })}
                  disabled={!unicoperiodoid}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="">Seleccione estudiante...</option>
                  {opcionesestudianteindividual.map(({ estudiante, inscripcion }) => (
                    <option key={estudiante.id} value={estudiante.id}>
                      {estudiante.lastName}, {estudiante.firstName} · RUDE {estudiante.rude} · {cursoetiqueta(inscripcion.course.name)}
                    </option>
                  ))}
                </select>
                {!unicoperiodoid && <span className="text-xs text-slate-500">Primero selecciona el período.</span>}
                {unicoperiodoid && opcionesestudianteindividual.length === 0 && (
                  <span className="text-xs text-slate-500">No hay matrículas activas para esos filtros.</span>
                )}
              </Campo>

              <div className="text-sm text-slate-700">
                <span className="font-medium">Matrícula activa</span>
                <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  {unicoinscripcion ? `${cursoetiqueta(unicoinscripcion.course.name)} · ${unicoinscripcion.academicYear.year}` : 'Selecciona estudiante y período para identificar su matrícula.'}
                </p>
                {formulario.formState.errors.enrollmentId && <p className="mt-1 text-xs text-rose-700">El estudiante no tiene matrícula activa en la gestión del período.</p>}
              </div>

              <SeleccionarCampo
                label="Asignatura"
                error={formulario.formState.errors.subjectId?.message}
                {...formulario.register('subjectId')}
              >
                <option value="">Seleccione materia...</option>
                {materiasunicas.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </SeleccionarCampo>

            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Campo
                label="Calificación (0 - 100)"
                error={formulario.formState.errors.value?.message}
              >
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...formulario.register('value')}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm font-mono font-bold"
                />
              </Campo>

              <Campo label="Observación">
                <input
                  type="text"
                  placeholder="Opcional..."
                  {...formulario.register('remarks')}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </Campo>
            </div>

            {unicoformularioperiodo?.isClosed && (
              <p
                role="alert"
                className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"
              >
                Este período está cerrado. Registre una solicitud formal con motivo y respaldo.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Boton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => establecermostrarunicoformulario(false)}
              >
                Cancelar
              </Boton>
              <Boton
                type="submit"
                size="sm"
                disabled={crearunicomutacion.isPending || unicoformularioperiodo?.isClosed}
              >
                {crearunicomutacion.isPending ? 'Guardando...' : 'Asentar Nota'}
              </Boton>
            </div>
          </form>
        </div>
      )}

      {/* VIEW MODE: ROSTER / PLANILLA DE CURSO (BP-12, RF-20) */}
      {vistamodo === 'ROSTER' && (
        <div className="space-y-4">
          {/* Roster Selectors and Period Control */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Curso / Paralelo:
                  </label>
                  <select
                    value={seleccionadocursoid}
                    onChange={(e) => establecerseleccionadocursoid(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-800"
                  >
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {cursoetiqueta(c.name)} ({turnoetiqueta(c.shift)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Materia / Asignatura:
                  </label>
                  <select
                    value={seleccionadomateriaid}
                    onChange={(e) => establecerseleccionadomateriaid(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-800"
                  >
                    {materiasdelcurso.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Periodo de Evaluación:
                  </label>
                  <select
                    value={seleccionadoperiodoid}
                    onChange={(e) => establecerseleccionadoperiodoid(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-800"
                  >
                    {periodos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.isClosed ? '(Cerrado)' : '(Abierto)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Period Status, Admin Toggle & Publication status (RF-18, RF-22, RF-24) */}
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {activoperiodo && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      activoperiodo.isClosed
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {activoperiodo.isClosed ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <LockOpen className="w-3.5 h-3.5" />
                    )}
                    {activoperiodo.isClosed ? 'Periodo Cerrado' : 'Periodo Abierto'}
                  </div>
                )}

                {/* RF-24 Publication indicator */}
                {activoperiodo && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      estadopublicacion.todas
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : estadopublicacion.alguna
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                    title={
                      estadopublicacion.todas
                        ? 'Todas las calificaciones registradas están publicadas para consulta de familias'
                        : estadopublicacion.alguna
                          ? 'Algunas calificaciones están publicadas y otras en borrador'
                          : 'Las calificaciones están sin publicar y no son visibles a familias'
                    }
                  >
                    {estadopublicacion.todas ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    {estadopublicacion.todas
                      ? 'Publicado a Familias'
                      : estadopublicacion.alguna
                        ? `Parcial (${estadopublicacion.total}/${calificacionesdelcurso.length})`
                        : 'Sin Publicar'}
                  </div>
                )}

                {esprivilegiado && activoperiodo && (
                  <Boton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void manejarperiodocierrealternar(activoperiodo)}
                    disabled={alternarperiodocierremutacion.isPending}
                    className="text-xs gap-1"
                  >
                    {activoperiodo.isClosed ? 'Reabrir Periodo' : 'Cerrar Periodo'}
                  </Boton>
                )}

                {esprivilegiado && (
                  <Boton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => establecermostrarcrearperiodo(true)}
                    className="text-xs gap-1 border-brand-300 text-brand-800 hover:bg-brand-50"
                    title="Crear un nuevo período de evaluación (RF-18)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nuevo Periodo
                  </Boton>
                )}
              </div>
            </div>
            {periodocierreerror && (
              <p role="alert" className="mt-2 text-xs text-rose-700">
                {periodocierreerror}
              </p>
            )}

            {/* Warning if period is closed */}
            {activoperiodo?.isClosed && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    El período {activoperiodo.name} está cerrado (RN-07). Los cambios requieren una
                    solicitud con motivo y respaldo, aprobada por Dirección.
                  </span>
                </div>
              </div>
            )}

            {/* Feedback message */}
            {retroalimentacionmasiva && (
              <div
                className={`mt-3 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  retroalimentacionmasiva.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {retroalimentacionmasiva.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{retroalimentacionmasiva.message}</span>
              </div>
            )}
          </div>

          {/* Roster Table (BP-12) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="text-sm font-semibold text-slate-900">
                    Nómina de Estudiantes ({inscritoestudiantes.length} matriculados en{' '}
                    {activocurso ? cursoetiqueta(activocurso.name) : 'curso'})
                  </span>
                  <p className="text-xs text-slate-500">Una celda vacía no modifica ni elimina una nota guardada.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {puedeeditar && (
                  <Boton
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => publicarmutacion.mutate()}
                    disabled={publicarmutacion.isPending || calificacionesconsulta.isFetching || !calificacionesconsulta.isSuccess || calificacionesdelcurso.length === 0}
                    className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                    title="Publicar notas para que las familias y estudiantes puedan consultarlas (RF-24)"
                  >
                    {publicarmutacion.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    ) : (
                      <Globe className="w-4 h-4 text-emerald-600" />
                    )}
                    {publicarmutacion.isPending ? 'Publicando...' : 'Publicar Calificaciones'}
                  </Boton>
                )}

                {puedeeditar && (
                  <Boton
                    type="button"
                    size="sm"
                    onClick={() => masivoguardarmutacion.mutate()}
                    disabled={masivoguardarmutacion.isPending || activoperiodo?.isClosed || calificacionesconsulta.isFetching || !calificacionesconsulta.isSuccess || !estudiantesconsulta.isSuccess}
                    className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    {masivoguardarmutacion.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {masivoguardarmutacion.isPending
                      ? 'Guardando Planilla...'
                      : 'Guardar Calificaciones del Curso'}
                  </Boton>
                )}
              </div>
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
                    <th className="px-3 py-3 w-28 text-center">Visibilidad</th>
                    <th className="px-3 py-3 pr-4">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {estudiantesconsulta.isError || calificacionesconsulta.isError ? (
                    <tr>
                      <td colSpan={7} role="alert" className="text-center py-10 text-rose-700 text-sm">
                        No se pudo cargar la planilla completa. Recarga la página para volver a intentarlo.
                      </td>
                    </tr>
                  ) : estudiantesconsulta.isPending || calificacionesconsulta.isPending || calificacionesconsulta.isFetching ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 text-sm">
                        {seleccionadomateriaid ? 'Cargando la planilla completa…' : 'Selecciona un curso, materia y período.'}
                      </td>
                    </tr>
                  ) : inscritoestudiantes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                        No hay estudiantes con matrícula activa en este curso.
                      </td>
                    </tr>
                  ) : (
                    inscritoestudiantes.map((estado, indice) => {
                      const actualvalor = listacalificaciones[estado.id] ?? '';
                      const calificacion = interpretarcalificacion(actualvalor);
                      const escala = calificacion.tipo === 'valida' ? obtenerley070escala(calificacion.valor) : null;
                      const espasando = calificacion.tipo === 'valida' && calificacion.valor >= 51;

                      return (
                        <tr key={estado.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 pl-4 pr-2 text-center text-xs font-mono text-slate-400">
                            {indice + 1}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-slate-600">
                            {estado.rude}
                          </td>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold text-slate-900">
                              {estado.lastName}, {estado.firstName}
                            </p>
                            <span className="text-xs text-slate-400">CI: {estado.ci}</span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="text"
                              inputMode="decimal"
                              aria-label={`Nota de ${estado.firstName} ${estado.lastName}`}
                              aria-invalid={calificacion.tipo === 'invalida'}
                              aria-describedby={calificacion.tipo === 'invalida' ? `error-nota-${estado.id}` : undefined}
                              value={actualvalor}
                              disabled={!puedeeditar || activoperiodo?.isClosed}
                              onChange={(e) => {
                                const valor = e.target.value;
                                establecerlistacalificaciones((anterior) => ({
                                  ...anterior,
                                  [estado.id]: valor,
                                }));
                              }}
                              className={`w-20 h-9 rounded-lg border text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                                calificacion.tipo === 'vacia' || espasando
                                  ? 'border-slate-300 text-slate-900 bg-white'
                                  : 'border-rose-300 text-rose-700 bg-rose-50/30'
                              } disabled:bg-slate-100 disabled:text-slate-400`}
                            />
                            {calificacion.tipo === 'invalida' && (
                              <p id={`error-nota-${estado.id}`} className="mt-1 text-xs text-rose-700">
                                Ingresa una nota entre 0 y 100.
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {escala ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${escala.badgeClass}`}>
                                {escala.label}
                              </span>
                            ) : <span className="text-xs text-slate-400">—</span>}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {(() => {
                              const coincidencia = calificaciones.find(
                                (g) =>
                                  g.studentId === estado.id &&
                                  g.subjectId === seleccionadomateriaid &&
                                  g.periodId === seleccionadoperiodoid,
                              );
                              if (coincidencia?.publishedAt) {
                                return (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    title="Calificación publicada para familias y estudiantes (RF-24)"
                                  >
                                    <Eye className="w-3 h-3 text-emerald-600" />
                                    Publicado
                                  </span>
                                );
                              }
                              if (coincidencia) {
                                return (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200"
                                    title="Calificación guardada internamente; aún no visible a la familia"
                                  >
                                    <EyeOff className="w-3 h-3 text-amber-600" />
                                    Borrador
                                  </span>
                                );
                              }
                              return (
                                <span className="text-slate-400 text-xs italic">
                                  Sin registrar
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2.5 pr-4">
                            <input
                              type="text"
                              placeholder="Opcional..."
                              value={listaobservaciones[estado.id] || ''}
                              disabled={!puedeeditar || activoperiodo?.isClosed}
                              onChange={(e) => {
                                const texto = e.target.value;
                                establecerlistaobservaciones((anterior) => ({
                                  ...anterior,
                                  [estado.id]: texto,
                                }));
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
      {vistamodo === 'LIST' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por estudiante o materia..."
                value={buscar}
                onChange={(e) => { establecerbuscar(e.target.value); establecerlistapagina(0); }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
            <select aria-label="Filtrar por curso y paralelo" value={listacursoid} onChange={(evento) => { establecerlistacursoid(evento.target.value); establecerlistapagina(0); }} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm">
              <option value="">Todos los cursos y paralelos</option>
              {cursos.map((curso) => <option key={curso.id} value={curso.id}>{cursoetiqueta(curso.name)}</option>)}
            </select>
            <select aria-label="Filtrar por materia" value={listamateriaid} onChange={(evento) => { establecerlistamateriaid(evento.target.value); establecerlistapagina(0); }} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm">
              <option value="">Todas las materias</option>
              {materias.map((materia) => <option key={materia.id} value={materia.id}>{materia.name}</option>)}
            </select>
            <select aria-label="Filtrar por período" value={listaperiodoid} onChange={(evento) => { establecerlistaperiodoid(evento.target.value); establecerlistapagina(0); }} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm">
              <option value="">Todos los períodos</option>
              {periodos.map((periodo) => <option key={periodo.id} value={periodo.id}>{periodo.name}</option>)}
            </select>
            <span className="text-xs text-slate-500 font-mono">
              Mostrando {listadatos.length} de {listatotal} notas
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
                {listaconsulta.isPending ? (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-500">Cargando calificaciones…</td></tr>
                ) : listaconsulta.isError ? (
                  <tr><td colSpan={6} className="py-10 text-center text-rose-700">No se pudo consultar la lista.</td></tr>
                ) : listadatos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      No se encontraron calificaciones registradas.
                    </td>
                  </tr>
                ) : (
                  listadatos.map((calificacion) => {
                    const escala = obtenerley070escala(calificacion.value);
                    const espasando = calificacion.value >= 51;
                    return (
                      <tr key={calificacion.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-5 pr-3">
                          <p className="font-medium text-slate-900">
                            {calificacion.student.lastName}, {calificacion.student.firstName}
                          </p>
                          <span className="font-mono text-xs text-slate-400">
                            {calificacion.student.rude}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {calificacion.subject.name}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600 font-mono text-xs">
                          {calificacion.period.name}
                        </td>
                        <td className="px-3 py-3 text-center font-mono">
                          <span
                            className={`text-base font-bold tabular-nums ${espasando ? 'text-slate-900' : 'text-rose-600'}`}
                          >
                            {calificacion.value}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${escala.badgeClass}`}
                          >
                            {escala.label}
                          </span>
                        </td>
                        <td className="py-3 pl-3 pr-5 text-right font-mono text-slate-400 text-xs">
                          {new Date(calificacion.updatedAt).toLocaleDateString('es-BO')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {listatotal > 200 && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-3 text-sm">
              <button type="button" disabled={listapagina === 0} onClick={() => establecerlistapagina((pagina) => pagina - 1)} className="rounded border border-slate-200 px-3 py-1 disabled:opacity-40">Anterior</button>
              <span>Página {listapagina + 1} de {Math.ceil(listatotal / 200)}</span>
              <button type="button" disabled={(listapagina + 1) * 200 >= listatotal} onClick={() => establecerlistapagina((pagina) => pagina + 1)} className="rounded border border-slate-200 px-3 py-1 disabled:opacity-40">Siguiente</button>
            </div>
          )}
        </div>
      )}
      {cierrevistaprevia && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="grade-period-close-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 id="grade-period-close-title" className="text-lg font-semibold text-slate-900">Cerrar {cierrevistaprevia.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Se registraron {cierrevistaprevia.gradeCount} calificaciones de {cierrevistaprevia.studentCount} estudiantes. Al cerrar el período, las nuevas correcciones requerirán revisión de Dirección.</p>
            {periodocierreerror && <p role="alert" className="mt-3 text-sm text-rose-700">{periodocierreerror}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Boton type="button" variant="outline" onClick={() => establecercierrevistaprevia(null)} disabled={alternarperiodocierremutacion.isPending}>Cancelar</Boton>
              <Boton type="button" disabled={alternarperiodocierremutacion.isPending} onClick={() => {
                const periodo = periodos.find((item) => item.id === cierrevistaprevia.id);
                if (periodo) alternarperiodocierremutacion.mutate({ period: periodo, close: true, expectedGradeCount: cierrevistaprevia.gradeCount });
              }}>{alternarperiodocierremutacion.isPending ? 'Cerrando…' : 'Confirmar cierre'}</Boton>
            </div>
          </section>
        </div>
      )}
      {mostrarcrearperiodo && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-crear-periodo"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="titulo-crear-periodo" className="text-base font-bold text-slate-900">
                Nuevo Período de Evaluación (RF-18)
              </h2>
              <button
                type="button"
                onClick={() => establecermostrarcrearperiodo(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                crearperiodomutacion.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre del Período
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1er Trimestre"
                  value={nuevoperiodonombre}
                  onChange={(e) => establecernuevoperiodonombre(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Número correlativo (1..10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={nuevoperiodonumero}
                  onChange={(e) => establecernuevoperiodonumero(Number(e.target.value))}
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    required
                    value={nuevoperiodofechainicio}
                    onChange={(e) => establecernuevoperiodofechainicio(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    required
                    value={nuevoperiodofechafin}
                    onChange={(e) => establecernuevoperiodofechafin(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              {crearperiodoerror && (
                <p role="alert" className="text-xs text-rose-700">
                  {crearperiodoerror}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => establecermostrarcrearperiodo(false)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  size="sm"
                  disabled={crearperiodomutacion.isPending}
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {crearperiodomutacion.isPending ? 'Creando…' : 'Crear Período'}
                </Boton>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

function Campo({
  label: etiqueta,
  error,
  children: hijos,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{etiqueta}</span>
      {hijos}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}

const SeleccionarCampo = ({
  label: etiqueta,
  error,
  children: hijos,
  ...propiedades
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => (
  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
    <span>{etiqueta}</span>
    <select
      {...propiedades}
      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
    >
      {hijos}
    </select>
    {error && <span className="text-xs text-rose-600">{error}</span>}
  </label>
);
