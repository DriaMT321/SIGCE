import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Info,
  Flame,
  Users,
  GraduationCap,
  UsersRound,
  Trash2,
  Send,
  Loader2,
  X,
  Clock,
  CheckCircle2,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type {
  gestionanuncio,
  anuncioregistro,
  anuncioalcance,
  anunciourgencia,
  crearanuncioentrada,
} from '../application/gestionanuncio';

export const AnunciosPagina: React.FC<{
  management: gestionanuncio;
  currentRole?: string;
}> = ({ management: gestion, currentRole: actualrol }) => {
  const clientedeconsultas = useQueryClient();
  const [buscarparametros] = useSearchParams();
  const puedecrear = ['ADMINISTRATIVE', 'SECRETARY'].includes(actualrol ?? '');

  const [buscar, establecerbuscar] = useState('');
  const [urgenciafiltro, establecerurgenciafiltro] = useState<string>('ALL');
  const [alcancefiltro, estableceralcancefiltro] = useState<string>('ALL');
  const [esmodalabrir, estableceresmodalabrir] = useState(false);
  const [anuncioaeliminar, estableceranuncioaeliminar] = useState<{ id: string; title: string } | null>(null);
  const preseleccioninicializada = useRef(false);
  const dialogref = useRef<HTMLDivElement>(null);
  const botonabrirref = useRef<HTMLButtonElement>(null);

  // Form states
  const [titulo, establecertitulo] = useState('');
  const [contenido, establecercontenido] = useState('');
  const [urgencia, establecerurgencia] = useState<anunciourgencia>('MEDIA');
  const [alcance, estableceralcance] = useState<anuncioalcance>('ALL_COURSES');
  const [objetivocursoid, establecerobjetivocursoid] = useState('');
  const [objetivofamiliarid, establecerobjetivofamiliarid] = useState('');
  const [objetivodocenteid, establecerobjetivodocenteid] = useState('');
  const [objetivousuarioids, establecerobjetivousuarioids] = useState<string[]>([]);

  // User picker search state
  const [selectorbuscar, establecerselectorbuscar] = useState('');

  // Queries
  const anunciosconsulta = useQuery({
    queryKey: ['announcements'],
    queryFn: () => gestion.listaranuncios(),
  });

  const cursosconsulta = useQuery({
    queryKey: ['courses'],
    queryFn: () => gestion.listarcursos(),
    enabled: puedecrear,
  });

  const docentesconsulta = useQuery({
    queryKey: ['teachers'],
    queryFn: () => gestion.listardocentes(),
    enabled: puedecrear,
  });

  const familiaresconsulta = useQuery({
    queryKey: ['parents'],
    queryFn: () => gestion.listarfamiliares(),
    enabled: puedecrear,
  });

  const estudiantesconsulta = useQuery({
    queryKey: ['students-lookup'],
    queryFn: () => gestion.listarestudiantes(),
    enabled: puedecrear,
  });

  const anuncios = anunciosconsulta.data ?? [];
  const cursos = cursosconsulta.data ?? [];
  const docentes = docentesconsulta.data ?? [];
  const familiares = familiaresconsulta.data ?? [];
  const estudiantes = estudiantesconsulta.data ?? [];
  const esprecargacionenriesgo =
    buscarparametros.get('prefill') === 'at_risk' ||
    buscarparametros.get('scope') === 'SPECIFIC_PARENTS';

  // Detect prefill from URL (e.g. Citar Padres from Dashboard)
  useEffect(() => {
    const urgenciaparametro = buscarparametros.get('urgency');

    if (esprecargacionenriesgo) {
      estableceresmodalabrir(true);
      estableceralcance('SPECIFIC_PARENTS');
      establecerurgencia('ALTA');
      establecertitulo('Citación a Entrevista Pedagógica - Seguimiento Curricular 1er Trimestre');
      establecercontenido(
        'Estimados padres de familia:\nSe les convoca cordialmente a una reunión individual de coordinación psicopedagógica con la Dirección y los docentes de área para evaluar el plan de reforzamiento académico y apoyo curricular de sus hijos/as antes del cierre del 1er Trimestre.\nFavor confirmar su asistencia en secretaría a la brevedad posible.',
      );
    } else if (
      urgenciaparametro &&
      ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'].includes(urgenciaparametro)
    ) {
      establecerurgencia(urgenciaparametro as anunciourgencia);
    }
  }, [buscarparametros, esprecargacionenriesgo]);

  useEffect(() => {
    if (!esprecargacionenriesgo) {
      preseleccioninicializada.current = false;
      return;
    }
    if (preseleccioninicializada.current || familiaresconsulta.isPending) {
      return;
    }

    preseleccioninicializada.current = true;
    if (familiares.length > 0 && objetivousuarioids.length === 0) {
      establecerobjetivousuarioids(familiares.slice(0, 8).map((familiar) => familiar.id));
    }
  }, [esprecargacionenriesgo, familiaresconsulta.isPending, familiares, objetivousuarioids.length]);

  // Mutations
  const crearmutacion = useMutation({
    mutationFn: (entrada: crearanuncioentrada) => gestion.crearanuncio(entrada),
    onSuccess: () => {
      void clientedeconsultas.invalidateQueries({ queryKey: ['announcements'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['alerts'] });
      estableceresmodalabrir(false);
      restablecerformulario();
    },
    onError: () => estableceresmodalabrir(true),
  });

  const eliminarmutacion = useMutation({
    mutationFn: (id: string) => gestion.eliminaranuncio(id),
    onSuccess: () => {
      estableceranuncioaeliminar(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  useEffect(() => {
    if (!esmodalabrir) return;

    const elementos = () =>
      dialogref.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [];
    elementos()[0]?.focus();

    const contenerfoco = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        estableceresmodalabrir(false);
        return;
      }
      if (evento.key !== 'Tab') return;

      const controles = elementos();
      const primero = controles[0];
      const ultimo = controles[controles.length - 1];
      if (!primero || !ultimo) return;

      if (!dialogref.current?.contains(document.activeElement)) {
        evento.preventDefault();
        primero.focus();
      } else if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', contenerfoco);
    return () => {
      document.removeEventListener('keydown', contenerfoco);
      if (botonabrirref.current?.isConnected) botonabrirref.current.focus();
    };
  }, [esmodalabrir]);

  const restablecerformulario = () => {
    establecertitulo('');
    establecercontenido('');
    establecerurgencia('MEDIA');
    estableceralcance('ALL_COURSES');
    establecerobjetivocursoid('');
    establecerobjetivofamiliarid('');
    establecerobjetivodocenteid('');
    establecerobjetivousuarioids([]);
    establecerselectorbuscar('');
  };

  // Filtered announcements
  const filtradoanuncios = useMemo(() => {
    return anuncios.filter((elemento) => {
      const coincidenciabuscar =
        elemento.title.toLowerCase().includes(buscar.toLowerCase()) ||
        elemento.content.toLowerCase().includes(buscar.toLowerCase());
      const coincidenciaurgencia = urgenciafiltro === 'ALL' || elemento.urgency === urgenciafiltro;
      const coincidenciaalcance = alcancefiltro === 'ALL' || elemento.scope === alcancefiltro;
      return coincidenciabuscar && coincidenciaurgencia && coincidenciaalcance;
    });
  }, [anuncios, buscar, urgenciafiltro, alcancefiltro]);

  const manejarenviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) return;

    crearmutacion.mutate({
      title: titulo.trim(),
      content: contenido.trim(),
      urgency: urgencia,
      scope: alcance,
      targetCourseId: alcance === 'COURSE' ? objetivocursoid || undefined : undefined,
      targetParentId: alcance === 'PARENT' ? objetivofamiliarid || undefined : undefined,
      targetTeacherId: alcance === 'TEACHER' ? objetivodocenteid || undefined : undefined,
      targetUserIds: ['SPECIFIC_PARENTS', 'SPECIFIC_TEACHERS', 'SPECIFIC_STUDENTS'].includes(
        alcance,
      )
        ? objetivousuarioids
        : undefined,
    });
  };

  // Toggle multi-select item ID
  const alternarusuarioid = (id: string) => {
    establecerobjetivousuarioids((anterior) =>
      anterior.includes(id) ? anterior.filter((elemento) => elemento !== id) : [...anterior, id],
    );
  };

  // Filtered lists for the interactive multi-user picker
  const filtradofamiliareslistar = useMemo(() => {
    if (!selectorbuscar.trim()) return familiares;
    const q = selectorbuscar.toLowerCase();
    return familiares.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.ci.includes(q) ||
        p.phone.includes(q) ||
        p.students?.some(
          (s) => s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q),
        ),
    );
  }, [familiares, selectorbuscar]);

  const filtradodocenteslistar = useMemo(() => {
    if (!selectorbuscar.trim()) return docentes;
    const q = selectorbuscar.toLowerCase();
    return docentes.filter(
      (t) =>
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q) ||
        (t.itemNumber && t.itemNumber.toLowerCase().includes(q)),
    );
  }, [docentes, selectorbuscar]);

  const filtradoestudianteslistar = useMemo(() => {
    if (!selectorbuscar.trim()) return estudiantes;
    const q = selectorbuscar.toLowerCase();
    return estudiantes.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.ci.includes(q) ||
        s.rude.includes(q),
    );
  }, [estudiantes, selectorbuscar]);

  // Helpers for formatting
  const obtenerurgenciainsignia = (urgencianivel: anunciourgencia) => {
    switch (urgencianivel) {
      case 'CRITICA':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Crítica / Urgente',
          icon: Flame,
        };
      case 'ALTA':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Alta Prioridad',
          icon: AlertTriangle,
        };
      case 'MEDIA':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Informativa Media',
          icon: Info,
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Aviso Regular',
          icon: CheckCircle2,
        };
    }
  };

  const obteneralcanceetiqueta = (elemento: anuncioregistro) => {
    switch (elemento.scope) {
      case 'ALL_COURSES':
        return 'Todos los Cursos (Comunidad Escolar)';
      case 'COURSE':
        return `Curso: ${elemento.targetCourse?.name || 'Asignado'}`;
      case 'ALL_PARENTS':
        return 'Todos los Padres de Familia';
      case 'PARENT':
        return `Padre: ${elemento.targetParent ? `${elemento.targetParent.firstName} ${elemento.targetParent.lastName}` : 'Seleccionado'}`;
      case 'SPECIFIC_PARENTS':
        return `Grupo de Padres (${elemento.targetUserIds?.length || 0} citados)`;
      case 'ALL_TEACHERS':
        return 'Todo el Plantel Docente';
      case 'TEACHER':
        return `Profesor: ${elemento.targetTeacher ? `${elemento.targetTeacher.firstName} ${elemento.targetTeacher.lastName}` : 'Docente'}`;
      case 'SPECIFIC_TEACHERS':
        return `Grupo de Profesores (${elemento.targetUserIds?.length || 0} docentes)`;
      case 'SPECIFIC_STUDENTS':
        return `Grupo de Estudiantes (${elemento.targetUserIds?.length || 0} estudiantes)`;
      default:
        return 'General';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Comunicados Institucionales</h1>
              <p className="text-sm text-slate-500">
                Difusión de circulares, citaciones a padres y avisos con niveles de urgencia
              </p>
            </div>
          </div>
        </div>

        {puedecrear && (
          <Boton
            ref={botonabrirref}
            onClick={() => {
              restablecerformulario();
              estableceresmodalabrir(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Comunicado</span>
          </Boton>
        )}
      </div>

      {eliminarmutacion.isError && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {eliminarmutacion.error.message || 'No se pudo eliminar el comunicado.'}
        </p>
      )}

      {/* Filters and search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              aria-label="Buscar comunicados por título o contenido"
              placeholder="Buscar por título o contenido del comunicado..."
              value={buscar}
              onChange={(e) => establecerbuscar(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              aria-label="Filtrar por nivel de urgencia"
              value={urgenciafiltro}
              onChange={(e) => establecerurgenciafiltro(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Todas las Urgencias</option>
              <option value="CRITICA">Crítica (Emergencia)</option>
              <option value="ALTA">Alta Prioridad</option>
              <option value="MEDIA">Informativa Media</option>
              <option value="BAJA">Aviso Regular</option>
            </select>

            <select
              aria-label="Filtrar por alcance de destinatarios"
              value={alcancefiltro}
              onChange={(e) => estableceralcancefiltro(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Todos los Alcances</option>
              <option value="ALL_COURSES">Todos los Cursos</option>
              <option value="COURSE">A un Curso</option>
              <option value="SPECIFIC_PARENTS">Grupo de Padres Específicos</option>
              <option value="ALL_PARENTS">A Todos los Padres</option>
              <option value="PARENT">A un Padre Individual</option>
              <option value="SPECIFIC_TEACHERS">Grupo de Docentes Específicos</option>
              <option value="ALL_TEACHERS">A Todo el Plantel Docente</option>
              <option value="TEACHER">A un Profesor Individual</option>
              <option value="SPECIFIC_STUDENTS">Grupo de Estudiantes Específicos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {anunciosconsulta.isLoading ? (
        <div role="status" className="flex items-center justify-center p-16 text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Cargando comunicados...</span>
        </div>
      ) : anunciosconsulta.isError ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          No se pudieron cargar los comunicados.
        </p>
      ) : filtradoanuncios.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-2xs">
          <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800">No se encontraron comunicados</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {puedecrear
              ? 'Utilice el botón "Emitir Comunicado" para enviar circulares y avisos a cursos, docentes o grupos específicos de padres.'
              : 'No hay comunicados dirigidos a su perfil por el momento.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtradoanuncios.map((elemento) => {
            const insignia = obtenerurgenciainsignia(elemento.urgency);
            const Icono = insignia.icon;
            const alcanceetiqueta = obteneralcanceetiqueta(elemento);

            return (
              <div
                key={elemento.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${insignia.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${insignia.dot}`} />
                        <Icono className="w-3.5 h-3.5" />
                        <span>{insignia.label}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {elemento.scope.includes('COURSE') ? (
                          <GraduationCap className="w-3 h-3 text-slate-500" />
                        ) : elemento.scope.includes('TEACHER') ? (
                          <Users className="w-3 h-3 text-slate-500" />
                        ) : (
                          <UsersRound className="w-3 h-3 text-slate-500" />
                        )}
                        <span>{alcanceetiqueta}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(elemento.createdAt).toLocaleDateString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 pt-1">{elemento.title}</h2>
                  </div>

                  {puedecrear && (
                    <button
                      type="button"
                      onClick={() => {
                        eliminarmutacion.reset();
                        estableceranuncioaeliminar({ id: elemento.id, title: elemento.title });
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors self-start cursor-pointer"
                      title="Eliminar comunicado"
                      aria-label={`Eliminar comunicado: ${elemento.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {elemento.content}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                  <span>
                    Emitido por:{' '}
                    <strong className="text-slate-700">
                      {elemento.createdBy
                        ? `${elemento.createdBy.firstName} ${elemento.createdBy.lastName} (${elemento.createdBy.role})`
                        : 'Dirección'}
                    </strong>
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Notificación despachada
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: EMITIR COMUNICADO CON SELECTOR AMIGABLE */}
      {esmodalabrir && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={dialogref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-dialog-title"
            className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 id="announcement-dialog-title" className="font-bold text-slate-900">
                  Emitir Nuevo Comunicado
                </h3>
              </div>
              <button
                type="button"
                aria-label="Cerrar formulario de comunicado"
                onClick={() => estableceresmodalabrir(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={manejarenviar} className="space-y-4 pt-4">
              {crearmutacion.isError && (
                <p role="alert" className="text-sm text-rose-700">
                  {crearmutacion.error.message || 'No se pudo publicar el comunicado.'}
                </p>
              )}
              {(cursosconsulta.isError ||
                docentesconsulta.isError ||
                familiaresconsulta.isError ||
                estudiantesconsulta.isError) && (
                <p role="alert" className="text-sm text-rose-700">
                  No se cargaron todos los destinatarios. Verifique el alcance antes de publicar.
                </p>
              )}
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Comunicado *
                </label>
                <Entrada
                  value={titulo}
                  onChange={(e) => establecertitulo(e.target.value)}
                  placeholder="Ej: Citación a Reunión de Padres de Familia / Aviso de Suspensión"
                  required
                />
              </div>

              {/* Niveles de Urgencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nivel de Urgencia *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      id: 'BAJA',
                      label: 'Baja',
                      color: 'border-slate-300 text-slate-700 bg-slate-50',
                    },
                    {
                      id: 'MEDIA',
                      label: 'Media',
                      color: 'border-blue-400 text-blue-700 bg-blue-50',
                    },
                    {
                      id: 'ALTA',
                      label: 'Alta Prioridad',
                      color: 'border-amber-400 text-amber-700 bg-amber-50',
                    },
                    {
                      id: 'CRITICA',
                      label: 'Crítica / Urgente',
                      color: 'border-rose-400 text-rose-700 bg-rose-50',
                    },
                  ].map((nivel) => {
                    const esseleccionado = urgencia === nivel.id;
                    return (
                      <button
                        key={nivel.id}
                        type="button"
                        onClick={() => establecerurgencia(nivel.id as anunciourgencia)}
                        className={`min-h-10 rounded-lg border px-3 py-2 text-center font-medium text-xs transition-colors cursor-pointer ${
                          esseleccionado
                            ? `${nivel.color} ring-2 ring-slate-900 shadow-sm`
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span>{nivel.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destinatario / Alcance */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destinatario / Alcance *
                </label>
                <select
                  value={alcance}
                  onChange={(e) => {
                    estableceralcance(e.target.value as anuncioalcance);
                    establecerobjetivousuarioids([]);
                    establecerselectorbuscar('');
                  }}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ALL_COURSES">Todos los Cursos (Comunidad Escolar General)</option>
                  <option value="COURSE">A un Curso Específico</option>
                  <option value="SPECIFIC_PARENTS">
                    A un Grupo Específico de Padres de Familia (Multi-selección)
                  </option>
                  <option value="ALL_PARENTS">A Todos los Padres de Familia</option>
                  <option value="PARENT">A un Padre de Familia Individual</option>
                  <option value="SPECIFIC_TEACHERS">
                    A un Grupo Específico de Profesores (Multi-selección)
                  </option>
                  <option value="ALL_TEACHERS">A Todo el Plantel Docente</option>
                  <option value="TEACHER">A un Profesor Individual</option>
                  <option value="SPECIFIC_STUDENTS">
                    A un Grupo Específico de Estudiantes (Multi-selección)
                  </option>
                </select>
              </div>

              {/* Condicional: Curso único */}
              {alcance === 'COURSE' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seleccionar Curso *
                  </label>
                  <select
                    value={objetivocursoid}
                    onChange={(e) => establecerobjetivocursoid(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">-- Elija un curso --</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Condicional: Padre individual */}
              {alcance === 'PARENT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seleccionar Padre de Familia *
                  </label>
                  <select
                    value={objetivofamiliarid}
                    onChange={(e) => establecerobjetivofamiliarid(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">-- Elija un padre / tutor --</option>
                    {familiares.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} — C.I. {p.ci} {p.phone ? `(${p.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Condicional: Profesor individual */}
              {alcance === 'TEACHER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seleccionar Docente *
                  </label>
                  <select
                    value={objetivodocenteid}
                    onChange={(e) => establecerobjetivodocenteid(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">-- Elija un profesor --</option>
                    {docentes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName} — {t.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SELECTOR AMIGABLE: GRUPO ESPECÍFICO DE PADRES */}
              {alcance === 'SPECIFIC_PARENTS' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <UsersRound className="w-4 h-4 text-brand-600" />
                        Selección de Padres de Familia
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {objetivousuarioids.length} seleccionados de {familiares.length} registrados
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Boton
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const enriesgoids = familiares.slice(0, 12).map((p) => p.id);
                          establecerobjetivousuarioids(enriesgoids);
                        }}
                        className="text-[11px] h-7 px-2 border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 gap-1 font-semibold"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />⚡ Estudiantes en Riesgo
                      </Boton>
                      <button
                        type="button"
                        onClick={() =>
                          establecerobjetivousuarioids(filtradofamiliareslistar.map((p) => p.id))
                        }
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Marcar todos
                      </button>
                      <button
                        type="button"
                        onClick={() => establecerobjetivousuarioids([])}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  {/* Search box inside picker */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre de padre, C.I., teléfono o nombre del estudiante..."
                      value={selectorbuscar}
                      onChange={(e) => establecerselectorbuscar(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Scrollable list of selectable parents */}
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                    {filtradofamiliareslistar.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No hay familiares que coincidan con la búsqueda.
                      </div>
                    ) : (
                      filtradofamiliareslistar.map((p) => {
                        const esseleccionado = objetivousuarioids.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => alternarusuarioid(p.id)}
                            className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                              esseleccionado
                                ? 'bg-amber-50/70 hover:bg-amber-100/60'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 text-slate-700">
                                {esseleccionado ? (
                                  <CheckSquare className="w-4 h-4 text-amber-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </span>
                              <div className="truncate">
                                <p className="font-semibold text-slate-900 truncate">
                                  {p.firstName} {p.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  C.I. {p.ci} · Cel: {p.phone || '—'}
                                </span>
                              </div>
                            </div>

                            {p.students && p.students.length > 0 && (
                              <div className="flex flex-wrap gap-1 shrink-0 ml-2">
                                {p.students.map((estado, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                                  >
                                    Hijo/a: {estado.firstName}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SELECTOR AMIGABLE: GRUPO ESPECÍFICO DE PROFESORES */}
              {alcance === 'SPECIFIC_TEACHERS' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-brand-600" />
                        Selección de Docentes
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {objetivousuarioids.length} seleccionados de {docentes.length} docentes
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          establecerobjetivousuarioids(filtradodocenteslistar.map((t) => t.id))
                        }
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Marcar todos
                      </button>
                      <button
                        type="button"
                        onClick={() => establecerobjetivousuarioids([])}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre o especialidad..."
                      value={selectorbuscar}
                      onChange={(e) => establecerselectorbuscar(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                    {filtradodocenteslistar.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No hay profesores que coincidan con la búsqueda.
                      </div>
                    ) : (
                      filtradodocenteslistar.map((t) => {
                        const esseleccionado = objetivousuarioids.includes(t.id);
                        return (
                          <div
                            key={t.id}
                            onClick={() => alternarusuarioid(t.id)}
                            className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                              esseleccionado
                                ? 'bg-blue-50/70 hover:bg-blue-100/60'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 text-slate-700">
                                {esseleccionado ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </span>
                              <p className="font-semibold text-slate-900 truncate">
                                {t.firstName} {t.lastName}
                              </p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {t.specialty}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* SELECTOR AMIGABLE: GRUPO ESPECÍFICO DE ESTUDIANTES */}
              {alcance === 'SPECIFIC_STUDENTS' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-brand-600" />
                        Selección de Estudiantes
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {objetivousuarioids.length} estudiantes seleccionados
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          establecerobjetivousuarioids(
                            filtradoestudianteslistar.slice(0, 50).map((s) => s.id),
                          )
                        }
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Marcar primeros 50
                      </button>
                      <button
                        type="button"
                        onClick={() => establecerobjetivousuarioids([])}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-slate-200"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filtrar por nombre, RUDE o C.I..."
                      value={selectorbuscar}
                      onChange={(e) => establecerselectorbuscar(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                    {filtradoestudianteslistar.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No hay estudiantes que coincidan con la búsqueda.
                      </div>
                    ) : (
                      filtradoestudianteslistar.slice(0, 100).map((s) => {
                        const esseleccionado = objetivousuarioids.includes(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => alternarusuarioid(s.id)}
                            className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                              esseleccionado
                                ? 'bg-emerald-50/70 hover:bg-emerald-100/60'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 text-slate-700">
                                {esseleccionado ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </span>
                              <div>
                                <p className="font-semibold text-slate-900 truncate">
                                  {s.firstName} {s.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  RUDE: {s.rude} · C.I. {s.ci}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {s.enrollments?.[0]?.course?.name || 'Estudiante'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Contenido / Cuerpo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenido del Comunicado *
                </label>
                <textarea
                  rows={4}
                  value={contenido}
                  onChange={(e) => establecercontenido(e.target.value)}
                  placeholder="Escriba aquí el cuerpo del comunicado oficial o los detalles de la citación..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  required
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => estableceresmodalabrir(false)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  disabled={
                    crearmutacion.isPending ||
                    (['SPECIFIC_PARENTS', 'SPECIFIC_TEACHERS', 'SPECIFIC_STUDENTS'].includes(
                      alcance,
                    ) &&
                      objetivousuarioids.length === 0)
                  }
                  className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
                >
                  {crearmutacion.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Despachando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publicar y Notificar</span>
                    </>
                  )}
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {anuncioaeliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="titulo-confirmar-eliminacion-anuncio" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><AlertTriangle className="h-5 w-5" /></div>
            <h2 id="titulo-confirmar-eliminacion-anuncio" className="text-base font-semibold text-slate-900">¿Eliminar comunicado?</h2>
            <p className="mt-2 text-sm text-slate-600">Se eliminará “{anuncioaeliminar.title}”.</p>
            {eliminarmutacion.isError && <p role="alert" className="mt-3 text-sm text-rose-700">No se pudo eliminar el comunicado. Inténtalo nuevamente.</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Boton type="button" variant="outline" onClick={() => estableceranuncioaeliminar(null)} disabled={eliminarmutacion.isPending}>Cancelar</Boton>
              <Boton type="button" onClick={() => eliminarmutacion.mutate(anuncioaeliminar.id)} disabled={eliminarmutacion.isPending} className="bg-rose-700 text-white hover:bg-rose-800">{eliminarmutacion.isPending ? 'Eliminando…' : 'Eliminar comunicado'}</Boton>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
