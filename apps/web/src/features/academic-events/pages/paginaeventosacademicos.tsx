import { useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  School,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  Sparkles,
  AlertCircle,
  Tag,
  Building2,
  CalendarRange,
  BookOpen,
  FileCheck2,
  UserCheck,
  Filter,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import { academicoapi } from '../../../lib/apiacademica';
import type {
  cursoeventoopcion,
  eventoacademico,
  gestioneventosacademicos,
  tipoeventoacademico,
} from '../application/gestioneventosacademicos';

const zonabolivia = 'America/La_Paz';
const diasdelasemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const tiposevento = ['ACTIVIDAD', 'REUNION', 'ACTO_ESCOLAR', 'SUSPENSION_CLASES', 'OTRO'] as const;

export type AudienciaEvento = 'TODOS' | 'PROFESORES' | 'PADRES' | 'ESTUDIANTES';
export type PlazoFiltro = 'MES' | 'HOY' | 'SEMANA' | 'PROXIMOS_30' | 'FECHA_ESPECIFICA' | 'TODO';

export function obtenerAudiencia(desc?: string | null, targetCourseId?: string | null, tipo?: string): AudienciaEvento {
  if (desc?.includes('[AUDIENCIA:PROFESORES]')) return 'PROFESORES';
  if (desc?.includes('[AUDIENCIA:PADRES]')) return 'PADRES';
  if (desc?.includes('[AUDIENCIA:ESTUDIANTES]')) return 'ESTUDIANTES';
  if (targetCourseId) return 'ESTUDIANTES';
  if (tipo === 'REUNION') return 'PADRES';
  return 'TODOS';
}

export function limpiarDescripcion(desc?: string | null): string {
  if (!desc) return '';
  return desc.replace(/\[AUDIENCIA:[A-Z]+\]\s*/g, '').trim();
}

interface TipoEventoConfig {
  label: string;
  badge: string;
  dotColor: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  accentBar: string;
}

const configportipo: Record<tipoeventoacademico, TipoEventoConfig> = {
  ACTIVIDAD: {
    label: 'Actividad Académica',
    badge: 'Académico',
    dotColor: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    accentBar: 'border-l-emerald-500',
  },
  REUNION: {
    label: 'Reunión Institucional',
    badge: 'Reunión',
    dotColor: 'bg-brand-600',
    bgLight: 'bg-brand-50',
    textColor: 'text-brand-800',
    borderColor: 'border-brand-200',
    accentBar: 'border-l-brand-600',
  },
  ACTO_ESCOLAR: {
    label: 'Acto Cívico / Cultural',
    badge: 'Acto Cívico',
    dotColor: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    accentBar: 'border-l-amber-500',
  },
  SUSPENSION_CLASES: {
    label: 'Suspensión de Clases',
    badge: 'Suspensión',
    dotColor: 'bg-rose-500',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200',
    accentBar: 'border-l-rose-500',
  },
  OTRO: {
    label: 'Otro Evento',
    badge: 'General',
    dotColor: 'bg-slate-400',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-200',
    accentBar: 'border-l-slate-400',
  },
};

function partesfecha(fecha: Date) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: zonabolivia,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? '';
  return {
    anio: valor('year'),
    mes: valor('month'),
    dia: valor('day'),
    hora: valor('hour'),
    minuto: valor('minute'),
  };
}

function clavededia(fecha: Date) {
  const { anio, mes, dia } = partesfecha(fecha);
  return `${anio}-${mes}-${dia}`;
}

function isoBolivia(dia: string, hora: string, tododia = false, finjornada = false) {
  const horaefectiva = tododia ? (finjornada ? '23:59' : '00:00') : hora || '00:00';
  const fecha = new Date(`${dia}T${horaefectiva}:00-04:00`);
  return Number.isFinite(fecha.getTime()) ? fecha.toISOString() : '';
}

function nombrecurso(curso: cursoeventoopcion) {
  const turno = curso.shift === 'MORNING' ? 'Mañana' : curso.shift === 'AFTERNOON' ? 'Tarde' : 'Noche';
  return `${curso.name} · ${turno}`;
}

function crearvaloresiniciales() {
  const hoy = clavededia(new Date());
  return {
    title: '',
    type: 'ACTIVIDAD' as tipoeventoacademico,
    description: '',
    audience: 'TODOS' as AudienciaEvento,
    startDate: hoy,
    startTime: '08:00',
    endDate: hoy,
    endTime: '09:30',
    allDay: false,
    location: '',
    courseId: '',
    status: 'PROGRAMADO' as const,
  };
}

const esquemaformulario = z
  .object({
    title: z.string().trim().min(3, 'Escribe un título de al menos 3 caracteres.').max(120),
    type: z.enum(tiposevento),
    description: z.string().max(2000, 'La descripción admite hasta 2000 caracteres.'),
    audience: z.enum(['TODOS', 'PROFESORES', 'PADRES', 'ESTUDIANTES']).default('TODOS'),
    startDate: z.string().min(1, 'Selecciona el día de inicio.'),
    startTime: z.string(),
    endDate: z.string().min(1, 'Selecciona el día de finalización.'),
    endTime: z.string(),
    allDay: z.boolean(),
    location: z.string().max(160, 'El lugar admite hasta 160 caracteres.'),
    courseId: z.string(),
    status: z.enum(['PROGRAMADO', 'CANCELADO', 'REALIZADO']),
  })
  .superRefine((datos, contexto) => {
    if (!datos.allDay && !datos.startTime) {
      contexto.addIssue({ code: 'custom', path: ['startTime'], message: 'Indica la hora de inicio.' });
    }
    if (!datos.allDay && !datos.endTime) {
      contexto.addIssue({ code: 'custom', path: ['endTime'], message: 'Indica la hora de finalización.' });
    }
    const inicio = new Date(isoBolivia(datos.startDate, datos.startTime, datos.allDay));
    const fin = new Date(isoBolivia(datos.endDate, datos.endTime, datos.allDay, true));
    if (!Number.isFinite(inicio.getTime()) || !Number.isFinite(fin.getTime())) {
      contexto.addIssue({ code: 'custom', path: ['startDate'], message: 'Revisa las fechas seleccionadas.' });
    } else if (fin.getTime() <= inicio.getTime()) {
      contexto.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'La finalización debe ser posterior al inicio.',
      });
    }
  });

type valoresformulario = z.infer<typeof esquemaformulario>;

function CampoFormulario({
  etiqueta,
  error,
  children,
}: {
  etiqueta: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{etiqueta}</span>
      {children}
      {error ? <span className="text-xs font-normal text-rose-600">{error}</span> : null}
    </label>
  );
}

function formatohora(fecha: string) {
  return new Intl.DateTimeFormat('es-BO', {
    timeZone: zonabolivia,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
}

interface CeldaCalendario {
  dia: number;
  clave: string;
  esMesActual: boolean;
  esFinDeSemana: boolean;
}

function generarCuadriculaCalendario(anio: number, mes: number): CeldaCalendario[] {
  const primero = new Date(Date.UTC(anio, mes, 1));
  const totalDiasMes = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const totalDiasMesAnterior = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  const desplazamientoInicio = (primero.getUTCDay() + 6) % 7;

  const celdas: CeldaCalendario[] = [];

  // Días del mes anterior para completar la semana inicial
  const mesAnteriorAnio = mes === 0 ? anio - 1 : anio;
  const mesAnteriorMes = mes === 0 ? 11 : mes - 1;
  for (let i = desplazamientoInicio - 1; i >= 0; i--) {
    const dia = totalDiasMesAnterior - i;
    const clave = `${mesAnteriorAnio}-${String(mesAnteriorMes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const diaSemana = (new Date(Date.UTC(mesAnteriorAnio, mesAnteriorMes, dia)).getUTCDay() + 6) % 7;
    celdas.push({
      dia,
      clave,
      esMesActual: false,
      esFinDeSemana: diaSemana >= 5,
    });
  }

  // Días del mes actual
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const clave = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const diaSemana = (new Date(Date.UTC(anio, mes, dia)).getUTCDay() + 6) % 7;
    celdas.push({
      dia,
      clave,
      esMesActual: true,
      esFinDeSemana: diaSemana >= 5,
    });
  }

  // Días del mes posterior para completar la cuadrícula (35 o 42 celdas)
  const mesSiguienteAnio = mes === 11 ? anio + 1 : anio;
  const mesSiguienteMes = mes === 11 ? 0 : mes + 1;
  let diaSiguiente = 1;
  while (celdas.length % 7 !== 0 || celdas.length < 35) {
    const clave = `${mesSiguienteAnio}-${String(mesSiguienteMes + 1).padStart(2, '0')}-${String(diaSiguiente).padStart(2, '0')}`;
    const diaSemana = (new Date(Date.UTC(mesSiguienteAnio, mesSiguienteMes, diaSiguiente)).getUTCDay() + 6) % 7;
    celdas.push({
      dia: diaSiguiente,
      clave,
      esMesActual: false,
      esFinDeSemana: diaSemana >= 5,
    });
    diaSiguiente++;
  }

  return celdas;
}

export function PaginaEventosAcademicos({
  gestion,
  currentRole,
  currentUserId,
}: {
  gestion: gestioneventosacademicos;
  currentRole?: string;
  currentUserId?: string;
}) {
  const clienteconsultas = useQueryClient();
  const rol = currentRole ?? '';
  const puedeprogramar = ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'].includes(rol);
  const esdocente = rol === 'TEACHER';
  const esadministrativo = rol === 'ADMINISTRATIVE' || rol === 'SECRETARY';
  // La vinculación con tareas y exámenes docentes es exclusiva para profesores, padres y estudiantes
  const puedeverTareas = !esadministrativo;

  const [mesvisible, establecerMesVisible] = useState(() => {
    const hoy = partesfecha(new Date());
    return { anio: Number(hoy.anio), mes: Number(hoy.mes) - 1 };
  });
  const [diaseleccionado, establecerDiaSeleccionado] = useState(() => clavededia(new Date()));
  const [filtroTipo, establecerFiltroTipo] = useState<string>('TODOS');
  const [filtroAudiencia, establecerFiltroAudiencia] = useState<AudienciaEvento>('TODOS');
  const [filtroPlazo, establecerFiltroPlazo] = useState<PlazoFiltro>('MES');
  const [fechaEspecificaFiltro, setFechaEspecificaFiltro] = useState<string>(() => clavededia(new Date()));
  const [mostrarFormulario, establecerMostrarFormulario] = useState(false);
  const [eventoEditado, establecerEventoEditado] = useState<eventoacademico | null>(null);
  const [cancelacionPendiente, establecerCancelacionPendiente] = useState<string | null>(null);
  const [mensajedeexito, establecerMensajeDeExito] = useState('');

  const rango = useMemo(() => {
    // Calculamos un margen para cubrir días del mes anterior y posterior visibles en la cuadrícula
    const inicio = `${mesvisible.anio}-${String(mesvisible.mes + 1).padStart(2, '0')}-01`;
    const mesposterior = new Date(Date.UTC(mesvisible.anio, mesvisible.mes + 1, 1));
    const fin = `${mesposterior.getUTCFullYear()}-${String(mesposterior.getUTCMonth() + 1).padStart(2, '0')}-01`;
    return {
      desde: new Date(`${inicio}T00:00:00-04:00`).toISOString(),
      hasta: new Date(`${fin}T23:59:59-04:00`).toISOString(),
    };
  }, [mesvisible]);

  const eventosconsulta = useQuery({
    queryKey: ['academic-events', mesvisible.anio, mesvisible.mes],
    queryFn: () => gestion.listar(rango.desde, rango.hasta),
  });

  const asignacionesconsulta = useQuery({
    queryKey: ['assignments-calendar'],
    queryFn: () => academicoapi.listarasignaciones(),
    enabled: puedeverTareas,
  });

  const cursosconsulta = useQuery({
    queryKey: ['academic-events-courses'],
    queryFn: () => gestion.listarcursos(),
    enabled: puedeprogramar,
  });

  const formulario = useForm<valoresformulario>({
    resolver: zodResolver(esquemaformulario),
    defaultValues: crearvaloresiniciales(),
  });

  const mutacionguardar = useMutation({
    mutationFn: async (datos: valoresformulario) => {
      if (esdocente && !datos.courseId) {
        formulario.setError('courseId', {
          type: 'manual',
          message: 'Elige uno de tus cursos asignados.',
        });
        throw new Error('Selecciona un curso asignado antes de guardar.');
      }
      const descConAudiencia =
        datos.audience !== 'TODOS'
          ? `[AUDIENCIA:${datos.audience}] ${datos.description}`.trim()
          : datos.description.trim();

      const comun = {
        title: datos.title,
        type: datos.type,
        description: descConAudiencia || undefined,
        startsAt: isoBolivia(datos.startDate, datos.startTime, datos.allDay),
        endsAt: isoBolivia(datos.endDate, datos.endTime, datos.allDay, true),
        allDay: datos.allDay,
        location: datos.location,
        targetCourseId: datos.courseId || null,
      };
      return eventoEditado
        ? gestion.actualizar(eventoEditado.id, { ...comun, status: datos.status })
        : gestion.crear(comun);
    },
    onSuccess: () => {
      establecerMensajeDeExito(
        eventoEditado ? 'La actividad se actualizó exitosamente.' : 'La actividad quedó programada en el calendario.',
      );
      establecerMostrarFormulario(false);
      establecerEventoEditado(null);
      formulario.reset(crearvaloresiniciales());
      void clienteconsultas.invalidateQueries({ queryKey: ['academic-events'] });
    },
  });

  const mutacioncancelar = useMutation({
    mutationFn: (id: string) => gestion.cancelar(id),
    onSuccess: () => {
      establecerCancelacionPendiente(null);
      establecerMensajeDeExito('La actividad fue cancelada.');
      void clienteconsultas.invalidateQueries({ queryKey: ['academic-events'] });
    },
  });

  const eventos = eventosconsulta.data ?? [];
  const asignaciones = asignacionesconsulta.data?.data ?? [];
  const hoy = clavededia(new Date());

  const eventosfiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      if (filtroTipo === 'TAREAS' || filtroTipo === 'EXAMENES') return false;
      if (filtroTipo !== 'TODOS' && evento.type !== filtroTipo) return false;

      if (filtroAudiencia !== 'TODOS') {
        const aud = obtenerAudiencia(evento.description, evento.targetCourseId, evento.type);
        if (aud !== 'TODOS' && aud !== filtroAudiencia) return false;
      }

      const fInicio = new Date(evento.startsAt);
      const hoyObj = new Date();
      if (filtroPlazo === 'HOY') {
        return clavededia(fInicio) === hoy || (clavededia(fInicio) <= hoy && clavededia(new Date(evento.endsAt)) >= hoy);
      }
      if (filtroPlazo === 'SEMANA') {
        const limite = new Date(hoyObj.getTime() + 7 * 24 * 60 * 60 * 1000);
        return fInicio >= new Date(hoyObj.getTime() - 24 * 60 * 60 * 1000) && fInicio <= limite;
      }
      if (filtroPlazo === 'PROXIMOS_30') {
        const limite = new Date(hoyObj.getTime() + 30 * 24 * 60 * 60 * 1000);
        return fInicio >= new Date(hoyObj.getTime() - 24 * 60 * 60 * 1000) && fInicio <= limite;
      }
      if (filtroPlazo === 'FECHA_ESPECIFICA') {
        const cInicio = clavededia(fInicio);
        const cFin = clavededia(new Date(evento.endsAt));
        return cInicio <= fechaEspecificaFiltro && cFin >= fechaEspecificaFiltro;
      }
      return true;
    });
  }, [eventos, filtroTipo, filtroAudiencia, filtroPlazo, fechaEspecificaFiltro, hoy]);

  const asignacionesfiltradas = useMemo(() => {
    if (!puedeverTareas) return [];
    return asignaciones.filter((asig) => {
      if (filtroAudiencia === 'PROFESORES') return false;
      if (filtroTipo === 'TAREAS' && asig.type === 'EXAMEN') return false;
      if (filtroTipo === 'EXAMENES' && asig.type !== 'EXAMEN') return false;
      if (filtroTipo !== 'TODOS' && filtroTipo !== 'TAREAS' && filtroTipo !== 'EXAMENES') return false;

      const fDue = new Date(asig.dueDate);
      const hoyObj = new Date();
      if (filtroPlazo === 'HOY') {
        return clavededia(fDue) === hoy;
      }
      if (filtroPlazo === 'SEMANA') {
        const limite = new Date(hoyObj.getTime() + 7 * 24 * 60 * 60 * 1000);
        return fDue >= new Date(hoyObj.getTime() - 24 * 60 * 60 * 1000) && fDue <= limite;
      }
      if (filtroPlazo === 'PROXIMOS_30') {
        const limite = new Date(hoyObj.getTime() + 30 * 24 * 60 * 60 * 1000);
        return fDue >= new Date(hoyObj.getTime() - 24 * 60 * 60 * 1000) && fDue <= limite;
      }
      if (filtroPlazo === 'FECHA_ESPECIFICA') {
        return clavededia(fDue) === fechaEspecificaFiltro;
      }
      if (filtroPlazo === 'MES') {
        const claveDue = clavededia(fDue);
        return claveDue.startsWith(`${mesvisible.anio}-${String(mesvisible.mes + 1).padStart(2, '0')}`);
      }
      return true;
    });
  }, [asignaciones, puedeverTareas, filtroAudiencia, filtroTipo, filtroPlazo, fechaEspecificaFiltro, hoy, mesvisible]);

  const eventosdeldia = useMemo(
    () =>
      eventosfiltrados.filter(
        (evento) =>
          clavededia(new Date(evento.startsAt)) <= diaseleccionado &&
          clavededia(new Date(evento.endsAt)) >= diaseleccionado,
      ),
    [eventosfiltrados, diaseleccionado],
  );

  const asignacionesdeldia = useMemo(
    () =>
      asignacionesfiltradas.filter(
        (asig) => clavededia(new Date(asig.dueDate)) === diaseleccionado,
      ),
    [asignacionesfiltradas, diaseleccionado],
  );

  const celdas = useMemo(() => generarCuadriculaCalendario(mesvisible.anio, mesvisible.mes), [mesvisible]);

  const nombreMes = new Intl.DateTimeFormat('es-BO', {
    month: 'long',
    timeZone: zonabolivia,
  }).format(new Date(Date.UTC(mesvisible.anio, mesvisible.mes, 15, 12)));

  const fechaSeleccionadaObj = useMemo(() => {
    return new Date(`${diaseleccionado}T12:00:00-04:00`);
  }, [diaseleccionado]);

  const diaSemanaTexto = new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    timeZone: zonabolivia,
  }).format(fechaSeleccionadaObj);

  const diaNumeroTexto = partesfecha(fechaSeleccionadaObj).dia;

  const mesAnioTexto = new Intl.DateTimeFormat('es-BO', {
    month: 'long',
    year: 'numeric',
    timeZone: zonabolivia,
  }).format(fechaSeleccionadaObj);

  const proximoseventos = eventos.filter(
    (evento) => evento.status === 'PROGRAMADO' && new Date(evento.endsAt).getTime() >= Date.now(),
  ).length;

  const eventosinstitucionales = eventos.filter((evento) => !evento.targetCourseId).length;

  function cambiarMes(delta: number) {
    const nuevo = new Date(Date.UTC(mesvisible.anio, mesvisible.mes + delta, 1));
    const nuevoDia = `${nuevo.getUTCFullYear()}-${String(nuevo.getUTCMonth() + 1).padStart(2, '0')}-01`;
    establecerMesVisible({ anio: nuevo.getUTCFullYear(), mes: nuevo.getUTCMonth() });
    establecerDiaSeleccionado(nuevoDia);
  }

  function irAhoy() {
    const partes = partesfecha(new Date());
    establecerMesVisible({ anio: Number(partes.anio), mes: Number(partes.mes) - 1 });
    establecerDiaSeleccionado(`${partes.anio}-${partes.mes}-${partes.dia}`);
  }

  function abrirNuevo() {
    establecerEventoEditado(null);
    establecerMensajeDeExito('');
    formulario.reset({ ...crearvaloresiniciales(), startDate: diaseleccionado, endDate: diaseleccionado });
    establecerMostrarFormulario(true);
    mutacionguardar.reset();
  }

  function abrirEdicion(evento: eventoacademico) {
    const inicio = partesfecha(new Date(evento.startsAt));
    const fin = partesfecha(new Date(evento.endsAt));
    const aud = obtenerAudiencia(evento.description, evento.targetCourseId, evento.type);
    const descLimpia = limpiarDescripcion(evento.description);
    establecerEventoEditado(evento);
    establecerMensajeDeExito('');
    formulario.reset({
      title: evento.title,
      type: evento.type,
      description: descLimpia,
      audience: aud,
      startDate: `${inicio.anio}-${inicio.mes}-${inicio.dia}`,
      startTime: `${inicio.hora}:${inicio.minuto}`,
      endDate: `${fin.anio}-${fin.mes}-${fin.dia}`,
      endTime: `${fin.hora}:${fin.minuto}`,
      allDay: evento.allDay,
      location: evento.location ?? '',
      courseId: evento.targetCourseId ?? '',
      status: evento.status,
    });
    establecerMostrarFormulario(true);
    mutacionguardar.reset();
  }

  const guardarFormulario = formulario.handleSubmit((datos) => {
    establecerMensajeDeExito('');
    mutacionguardar.mutate(datos);
  });

  function puedeEditar(evento: eventoacademico) {
    return esadministrativo || (esdocente && evento.createdById === currentUserId);
  }

  function eventosdelacelda(clave: string) {
    return eventosfiltrados.filter(
      (evento) =>
        clavededia(new Date(evento.startsAt)) <= clave &&
        clavededia(new Date(evento.endsAt)) >= clave,
    );
  }

  function estadoetiqueta(evento: eventoacademico) {
    if (evento.status === 'CANCELADO') return 'Cancelado';
    if (evento.status === 'REALIZADO') return 'Realizado';
    if (new Date(evento.endsAt).getTime() < Date.now()) return 'Finalizado';
    return 'Programado';
  }

  const conteoPorTipo = useMemo(() => {
    const conteos: Record<string, number> = {
      TODOS: eventos.length + (puedeverTareas ? asignaciones.length : 0),
      TAREAS: puedeverTareas ? asignaciones.filter((a) => a.type !== 'EXAMEN').length : 0,
      EXAMENES: puedeverTareas ? asignaciones.filter((a) => a.type === 'EXAMEN').length : 0,
    };
    for (const t of tiposevento) {
      conteos[t] = eventos.filter((e) => e.type === t).length;
    }
    return conteos;
  }, [eventos, asignaciones, puedeverTareas]);

  const errorapi = mutacionguardar.error ?? mutacioncancelar.error;

  return (
    <main className="mx-auto max-w-[1550px] space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. HERO HEADER ESTÉTICO */}
      <header className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-brand-500/30">
                <CalendarRange className="h-3.5 w-3.5" />
                Gestión Escolar 2026
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En tiempo real
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Calendario Académico e Institucional
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cronograma oficial de evaluaciones, feriados pedagógicos, reuniones de comunidad y tareas docentes bajo normativa del Ministerio de Educación.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {puedeprogramar && (
              <Boton
                onClick={abrirNuevo}
                className="h-10 px-4 bg-brand-700 hover:bg-brand-800 text-white font-semibold shadow-lg shadow-brand-700/25 gap-2 rounded-xl transition-all cursor-pointer"
              >
                <CalendarPlus className="h-4 w-4" />
                <span>Programar Actividad</span>
              </Boton>
            )}
          </div>
        </div>

        {/* TARJETAS RESUMEN EN EL HEADER */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-4">
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/5">
            <p className="text-[11px] font-medium text-slate-400">Total actividades</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {eventos.length + (puedeverTareas ? asignaciones.length : 0)}
            </p>
          </div>
          {puedeverTareas ? (
            <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/5">
              <p className="text-[11px] font-medium text-slate-400">Tareas y Exámenes</p>
              <p className="text-lg font-bold text-amber-300 mt-0.5">{asignaciones.length}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/5">
              <p className="text-[11px] font-medium text-slate-400">Próximos eventos</p>
              <p className="text-lg font-bold text-amber-300 mt-0.5">{proximoseventos}</p>
            </div>
          )}
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/5">
            <p className="text-[11px] font-medium text-slate-400">Institucionales</p>
            <p className="text-lg font-bold text-rose-300 mt-0.5">{eventosinstitucionales}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3 backdrop-blur-xs border border-white/5">
            <p className="text-[11px] font-medium text-slate-400">Por curso</p>
            <p className="text-lg font-bold text-emerald-300 mt-0.5">
              {(eventos.length - eventosinstitucionales) + (puedeverTareas ? asignaciones.length : 0)}
            </p>
          </div>
        </div>
      </header>

      {/* NOTIFICACIONES DE ACCIÓN */}
      {mensajedeexito ? (
        <div role="status" className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="font-medium">{mensajedeexito}</span>
          </div>
          <button
            type="button"
            onClick={() => establecerMensajeDeExito('')}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {errorapi instanceof Error ? (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-2xs">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorapi.message}</span>
        </div>
      ) : null}

      {/* 2A. BARRA DE FILTROS PERSONALIZADA: AUDIENCIA Y PLAZO */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mr-1">
            <Users className="w-4 h-4 text-brand-700" />
            <span>Audiencia:</span>
          </span>
          {[
            { id: 'TODOS', label: 'Toda la comunidad' },
            { id: 'ESTUDIANTES', label: 'Estudiantes', icon: GraduationCap },
            { id: 'PADRES', label: 'Padres de Familia', icon: Users },
            { id: 'PROFESORES', label: 'Profesores', icon: School },
          ].map((item) => {
            const activo = filtroAudiencia === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => establecerFiltroAudiencia(item.id as AudienciaEvento)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${activo
                    ? 'bg-brand-700 text-white shadow-xs font-bold ring-2 ring-brand-700/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mr-1">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Plazo:</span>
          </span>
          {[
            { id: 'MES', label: 'Este mes' },
            { id: 'HOY', label: 'Hoy' },
            { id: 'SEMANA', label: 'Próximos 7 días' },
            { id: 'PROXIMOS_30', label: '30 días' },
            { id: 'FECHA_ESPECIFICA', label: 'Fecha específica' },
            { id: 'TODO', label: 'Todo el año' },
          ].map((item) => {
            const activo = filtroPlazo === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  establecerFiltroPlazo(item.id as PlazoFiltro);
                  if (item.id === 'FECHA_ESPECIFICA') {
                    establecerDiaSeleccionado(fechaEspecificaFiltro);
                  }
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${activo
                    ? 'bg-slate-900 text-white shadow-xs font-bold ring-2 ring-slate-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
              >
                {item.label}
              </button>
            );
          })}

          {filtroPlazo === 'FECHA_ESPECIFICA' && (
            <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-xl px-2.5 py-1 text-xs text-brand-950 animate-in fade-in">
              <CalendarDays className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <label htmlFor="input-fecha-especifica" className="text-[11px] font-bold text-brand-900">
                Día:
              </label>
              <input
                id="input-fecha-especifica"
                type="date"
                value={fechaEspecificaFiltro}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  setFechaEspecificaFiltro(val);
                  establecerDiaSeleccionado(val);
                  const [y, m] = val.split('-').map(Number);
                  if (!isNaN(y) && !isNaN(m)) {
                    establecerMesVisible({ anio: y, mes: m - 1 });
                  }
                }}
                className="h-7 rounded-lg border border-brand-300 bg-white px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-700 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2B. BARRA DE FILTROS POR CATEGORÍA Y TAREAS VINCULADAS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => establecerFiltroTipo('TODOS')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${filtroTipo === 'TODOS'
            ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
        >
          <span>Todos los tipos</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${filtroTipo === 'TODOS' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
            {conteoPorTipo.TODOS ?? 0}
          </span>
        </button>

        {tiposevento.map((tipo) => {
          const cfg = configportipo[tipo];
          const activo = filtroTipo === tipo;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => establecerFiltroTipo(tipo)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${activo
                ? `${cfg.bgLight} ${cfg.textColor} border ${cfg.borderColor} ring-2 ring-brand-700/20 shadow-xs font-bold`
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${cfg.dotColor}`} />
              <span>{cfg.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${activo ? 'bg-white/60 text-slate-800' : 'bg-slate-100 text-slate-600'
                }`}>
                {conteoPorTipo[tipo] ?? 0}
              </span>
            </button>
          );
        })}

        {/* PILLS DE TAREAS Y EXÁMENES VINCULADOS: SOLO PARA PROFESORES, PADRES Y ESTUDIANTES */}
        {puedeverTareas && (
          <>
            <button
              type="button"
              onClick={() => establecerFiltroTipo('TAREAS')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${filtroTipo === 'TAREAS'
                ? 'bg-brand-700 text-white shadow-xs font-bold ring-2 ring-brand-700/30'
                : 'bg-white text-brand-800 border border-brand-200 hover:bg-brand-50'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tareas asignadas</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${filtroTipo === 'TAREAS' ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-800'
                }`}>
                {conteoPorTipo.TAREAS ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => establecerFiltroTipo('EXAMENES')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${filtroTipo === 'EXAMENES'
                ? 'bg-amber-600 text-white shadow-xs font-bold ring-2 ring-amber-500/30'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
                }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Exámenes y Evaluaciones</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${filtroTipo === 'EXAMENES' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                {conteoPorTipo.EXAMENES ?? 0}
              </span>
            </button>
          </>
        )}
      </div>

      {/* 3. MODAL MODERNO PARA CREAR O EDITAR EVENTO */}
      {mostrarFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-formulario-evento"
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
                  <CalendarPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="titulo-formulario-evento" className="text-base font-bold text-slate-900">
                    {eventoEditado ? 'Editar Actividad Académica' : 'Programar Nueva Actividad'}
                  </h2>
                  <p className="text-xs text-slate-500">Horario de Bolivia (GMT-4) · Conexión directa con la comunidad</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => establecerMostrarFormulario(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Cerrar ventana"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido del formulario */}
            <form onSubmit={guardarFormulario} noValidate className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <CampoFormulario etiqueta="Título de la Actividad *" error={formulario.formState.errors.title?.message}>
                    <Entrada
                      placeholder="Ej. Feria Científica, Reunión de Trimestre, Hora Cívica..."
                      className="h-10 text-sm"
                      {...formulario.register('title')}
                    />
                  </CampoFormulario>
                </div>

                <CampoFormulario etiqueta="Tipo de Evento *" error={formulario.formState.errors.type?.message}>
                  <select
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                    {...formulario.register('type')}
                  >
                    {tiposevento.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {configportipo[tipo].label}
                      </option>
                    ))}
                  </select>
                </CampoFormulario>

                <CampoFormulario etiqueta="Alcance por Curso" error={formulario.formState.errors.courseId?.message}>
                  <select
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                    disabled={cursosconsulta.isLoading}
                    {...formulario.register('courseId')}
                  >
                    {!esdocente ? (
                      <option value="">Toda la Unidad Educativa (General)</option>
                    ) : (
                      <option value="">Selecciona uno de tus cursos asignados</option>
                    )}
                    {(cursosconsulta.data ?? []).map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {nombrecurso(curso)}
                      </option>
                    ))}
                  </select>
                </CampoFormulario>

                <CampoFormulario etiqueta="Audiencia Destinataria *" error={formulario.formState.errors.audience?.message}>
                  <select
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                    {...formulario.register('audience')}
                  >
                    <option value="TODOS">Toda la Comunidad Educativa (General)</option>
                    <option value="ESTUDIANTES">Estudiantes y Cursos</option>
                    <option value="PADRES">Padres de Familia y Tutores</option>
                    <option value="PROFESORES">Profesores / Plantel Docente</option>
                  </select>
                </CampoFormulario>
              </div>

              {/* Título de todo el día switch */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="check-todo-dia" className="text-xs font-semibold text-slate-800 cursor-pointer block">
                    Actividad de Jornada Completa (Todo el día)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Oculta las horas específicas para feriados, tolerancia o celebraciones generales
                  </p>
                </div>
                <input
                  id="check-todo-dia"
                  type="checkbox"
                  className="h-5 w-5 rounded border-slate-300 text-brand-700 focus:ring-brand-700 cursor-pointer"
                  {...formulario.register('allDay')}
                />
              </div>

              {/* Fechas y Horas */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Inicio</span>
                  <div className="grid grid-cols-2 gap-2">
                    <CampoFormulario etiqueta="Fecha" error={formulario.formState.errors.startDate?.message}>
                      <Entrada type="date" className="h-9 text-xs" {...formulario.register('startDate')} />
                    </CampoFormulario>
                    <CampoFormulario etiqueta="Hora" error={formulario.formState.errors.startTime?.message}>
                      <Entrada
                        type="time"
                        className="h-9 text-xs"
                        disabled={formulario.watch('allDay')}
                        {...formulario.register('startTime')}
                      />
                    </CampoFormulario>
                  </div>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-200 p-3 bg-white">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Conclusión</span>
                  <div className="grid grid-cols-2 gap-2">
                    <CampoFormulario etiqueta="Fecha" error={formulario.formState.errors.endDate?.message}>
                      <Entrada type="date" className="h-9 text-xs" {...formulario.register('endDate')} />
                    </CampoFormulario>
                    <CampoFormulario etiqueta="Hora" error={formulario.formState.errors.endTime?.message}>
                      <Entrada
                        type="time"
                        className="h-9 text-xs"
                        disabled={formulario.watch('allDay')}
                        {...formulario.register('endTime')}
                      />
                    </CampoFormulario>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <CampoFormulario etiqueta="Lugar / Ubicación (Opcional)" error={formulario.formState.errors.location?.message}>
                  <Entrada
                    placeholder="Ej. Cancha polifuncional, Salón de actos, Aulas..."
                    className="h-10 text-sm"
                    {...formulario.register('location')}
                  />
                </CampoFormulario>

                {eventoEditado ? (
                  <CampoFormulario etiqueta="Estado de la Actividad">
                    <select
                      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                      {...formulario.register('status')}
                    >
                      <option value="PROGRAMADO">Programado</option>
                      <option value="REALIZADO">Realizado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </CampoFormulario>
                ) : (
                  <div className="flex items-center text-xs text-slate-500 pt-5">
                    <span className="inline-flex items-center gap-1.5 text-brand-800 bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      Quedará en estado &quot;Programado&quot; al guardar
                    </span>
                  </div>
                )}
              </div>

              <CampoFormulario etiqueta="Descripción e Indicaciones (Opcional)" error={formulario.formState.errors.description?.message}>
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder="Detalles sobre materiales requeridos, vestimenta, puntualidad, destinatarios, etc."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                  {...formulario.register('description')}
                />
              </CampoFormulario>

              {esdocente && !cursosconsulta.isLoading && (cursosconsulta.data?.length ?? 0) === 0 ? (
                <p className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900 border border-amber-200">
                  Nota: Como docente, necesitas tener al menos un curso asignado en la gestión activa para programar actividades.
                </p>
              ) : null}

              {/* Botones del modal */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => establecerMostrarFormulario(false)}
                  className="cursor-pointer"
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  disabled={mutacionguardar.isPending || (esdocente && (cursosconsulta.data?.length ?? 0) === 0)}
                  className="bg-brand-700 hover:bg-brand-800 text-white font-semibold cursor-pointer shadow-md shadow-brand-700/20"
                >
                  {mutacionguardar.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1.5" />
                      {eventoEditado ? 'Guardar Cambios' : 'Confirmar y Programar'}
                    </>
                  )}
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. SECCIÓN PRINCIPAL: CUADRÍCULA DE CALENDARIO + AGENDA DEL DÍA */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {/* Barra superior del calendario */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100 shadow-2xs">
              <CalendarDays className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold capitalize text-slate-900 tracking-tight">{nombreMes}</h2>
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-brand-100 font-mono">
                  {mesvisible.anio}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {eventos.length} actividades registradas · Horario oficial Bolivia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de navegación */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => cambiarMes(-1)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Mes anterior"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={irAhoy}
                className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => cambiarMes(1)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Mes siguiente"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {eventosconsulta.isError ? (
          <div role="alert" className="m-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-800">
            <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
            <p className="font-semibold text-rose-900">No se pudo cargar el calendario académico</p>
            <p className="text-xs text-rose-700 mt-1">Por favor verifica tu conexión a la red e intenta nuevamente.</p>
            <Boton className="mt-4 bg-rose-600 hover:bg-rose-700 text-white" size="sm" onClick={() => void eventosconsulta.refetch()}>
              Reintentar Carga
            </Boton>
          </div>
        ) : eventosconsulta.isLoading ? (
          <div className="p-8 text-center text-slate-500">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-700 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">Cargando cronograma académico...</p>
          </div>
        ) : (
          <div className="grid min-h-[580px] grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)] divide-y xl:divide-y-0 xl:divide-x divide-slate-100">
            {/* LADO IZQUIERDO: CUADRÍCULA DEL CALENDARIO */}
            <div className="min-w-0 flex flex-col justify-between">
              <div>
                {/* Cabecera de los 7 días de la semana */}
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70 text-center">
                  {diasdelasemana.map((dia, idx) => {
                    const esFin = idx >= 5;
                    return (
                      <div
                        key={dia}
                        className={`py-2.5 text-[11px] font-bold uppercase tracking-wider ${esFin ? 'text-brand-600 bg-brand-50/30' : 'text-slate-600'
                          }`}
                      >
                        {dia}
                      </div>
                    );
                  })}
                </div>

                {/* Cuadrícula interactiva */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                  {celdas.map((celda) => {
                    const actividades = eventosdelacelda(celda.clave);
                    const tareasCelda = asignacionesfiltradas.filter((a) => clavededia(new Date(a.dueDate)) === celda.clave);
                    const totalCelda = actividades.length + tareasCelda.length;
                    const seleccionado = diaseleccionado === celda.clave;
                    const eshoy = hoy === celda.clave;

                    return (
                      <button
                        key={celda.clave}
                        type="button"
                        onClick={() => establecerDiaSeleccionado(celda.clave)}
                        aria-pressed={seleccionado}
                        aria-label={`Día ${celda.dia}, ${totalCelda} actividades y tareas`}
                        className={`group relative min-h-[82px] sm:min-h-[118px] p-1.5 sm:p-2 text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${!celda.esMesActual
                          ? 'bg-slate-50/40 text-slate-400'
                          : celda.esFinDeSemana
                            ? 'bg-slate-50/25'
                            : 'bg-white'
                          } ${seleccionado
                            ? 'ring-2 ring-inset ring-brand-700 bg-brand-50/40 z-10 shadow-xs'
                            : 'hover:bg-slate-50/90'
                          }`}
                      >
                        {/* Indicador superior del número de día */}
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full text-xs font-bold transition-transform ${eshoy
                              ? 'bg-brand-700 text-white shadow-xs scale-105'
                              : seleccionado
                                ? 'bg-slate-900 text-white font-extrabold'
                                : celda.esMesActual
                                  ? 'text-slate-800 group-hover:text-brand-700'
                                  : 'text-slate-400'
                              }`}
                          >
                            {celda.dia}
                          </span>

                          {totalCelda > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400">
                              {totalCelda} {totalCelda === 1 ? 'act.' : 'acts.'}
                            </span>
                          )}
                        </div>

                        {/* Eventos y Tareas dentro de la celda (pantallas sm y mayores) */}
                        <div className="mt-1 space-y-1 w-full hidden sm:block">
                          {actividades.slice(0, 2).map((actividad) => {
                            const cfg = configportipo[actividad.type];
                            return (
                              <div
                                key={actividad.id}
                                className={`flex items-center gap-1 truncate rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-tight shadow-2xs ${cfg.bgLight} ${cfg.textColor} ${cfg.borderColor}`}
                              >
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dotColor}`} />
                                <span className="truncate">{actividad.title}</span>
                              </div>
                            );
                          })}

                          {actividades.length < 2 &&
                            tareasCelda.slice(0, 2 - actividades.length).map((tarea) => {
                              const esExamen = tarea.type === 'EXAMEN';
                              return (
                                <div
                                  key={tarea.id}
                                  className={`flex items-center gap-1 truncate rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-tight shadow-2xs ${esExamen
                                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                                      : 'bg-brand-50 text-brand-800 border-brand-200'
                                    }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${esExamen ? 'bg-amber-600' : 'bg-brand-600'
                                      }`}
                                  />
                                  <span className="truncate">
                                    {esExamen ? 'Examen: ' : 'Tarea: '}
                                    {tarea.title}
                                  </span>
                                </div>
                              );
                            })}

                          {totalCelda > 2 && (
                            <span className="block text-[10px] font-semibold text-brand-800 bg-brand-50 border border-brand-200 rounded px-1 text-center">
                              +{totalCelda - 2} más
                            </span>
                          )}
                        </div>

                        {/* Indicador compacto en móvil */}
                        {totalCelda > 0 && (
                          <div className="mt-1 flex items-center justify-center gap-1 sm:hidden">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-700" />
                            <span className="text-[10px] font-bold text-slate-700">{totalCelda}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Leyenda al pie de la cuadrícula */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 bg-slate-50/50">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {(['ACTIVIDAD', 'REUNION', 'ACTO_ESCOLAR', 'SUSPENSION_CLASES'] as const).map((tipo) => {
                    const cfg = configportipo[tipo];
                    return (
                      <span key={tipo} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                        <span className={`h-2 w-2 rounded-full ${cfg.dotColor}`} />
                        {cfg.label}
                      </span>
                    );
                  })}
                </div>
                <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                  Zona Horaria: America/La_Paz (UTC-4)
                </span>
              </div>
            </div>

            {/* LADO DERECHO: AGENDA DEL DÍA SELECCIONADO */}
            <aside className="bg-slate-50/40 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                {/* Ficha encabezado del día */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs mb-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-12 h-13 rounded-xl bg-gradient-to-b from-brand-50 to-amber-50 border border-brand-200 text-brand-950 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                          {nombreMes.slice(0, 3)}
                        </span>
                        <span className="text-xl font-extrabold leading-tight">
                          {diaNumeroTexto}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold uppercase tracking-wide text-brand-800">
                            {diaSemanaTexto}
                          </p>
                          {diaseleccionado === hoy && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Hoy
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold capitalize text-slate-900">
                          {mesAnioTexto}
                        </h3>
                      </div>
                    </div>

                    {puedeprogramar && (
                      <button
                        type="button"
                        onClick={abrirNuevo}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200 transition-colors cursor-pointer"
                        title="Programar para esta fecha"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Añadir</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                    Actividades de la jornada ({eventosdeldia.length + asignacionesdeldia.length})
                  </h4>
                  {(filtroTipo !== 'TODOS' || filtroAudiencia !== 'TODOS' || filtroPlazo !== 'MES') && (
                    <button
                      type="button"
                      onClick={() => {
                        establecerFiltroTipo('TODOS');
                        establecerFiltroAudiencia('TODOS');
                        establecerFiltroPlazo('MES');
                      }}
                      className="text-[11px] text-brand-700 hover:underline cursor-pointer"
                    >
                      Restablecer filtros
                    </button>
                  )}
                </div>

                {/* Lista de eventos y asignaciones del día */}
                {eventosdeldia.length === 0 && asignacionesdeldia.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-3">
                      <CalendarDays className="h-6 w-6 text-brand-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Sin actividades programadas</p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      {puedeprogramar
                        ? 'No hay eventos ni tareas docentes previstas para este día. Puedes crear un evento usando el botón de añadir.'
                        : 'No hay actividades escolares ni tareas programadas para esta fecha.'}
                    </p>
                    {puedeprogramar && (
                      <Boton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={abrirNuevo}
                        className="mt-4 gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Programar Actividad
                      </Boton>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                    {/* 1. Tareas y Evaluaciones de Profesores */}
                    {asignacionesdeldia.map((asig) => {
                      const esExamen = asig.type === 'EXAMEN';
                      const horaEntrega = asig.dueDate.includes('T') ? formatohora(asig.dueDate) : 'Fin de jornada';

                      return (
                        <li
                          key={`asig-${asig.id}`}
                          className={`rounded-2xl border bg-white p-4 shadow-2xs border-l-4 transition-all hover:shadow-xs ${esExamen
                              ? 'border-purple-200/90 border-l-purple-600'
                              : 'border-blue-200/90 border-l-blue-600'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${esExamen
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}
                                >
                                  {esExamen ? (
                                    <FileCheck2 className="h-3 w-3 text-purple-600" />
                                  ) : (
                                    <BookOpen className="h-3 w-3 text-blue-600" />
                                  )}
                                  {esExamen ? 'Examen / Evaluación' : 'Tarea Docente'}
                                </span>

                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                  Entrega
                                </span>

                                <span className="rounded-full bg-brand-50 border border-brand-200 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                                  Estudiantes
                                </span>
                              </div>

                              <h5 className="text-sm font-bold text-slate-900 break-words pt-1">
                                {asig.title}
                              </h5>
                            </div>

                            {asig.maxScore != null && (
                              <span className="shrink-0 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] font-bold text-emerald-700">
                                /{asig.maxScore} pts
                              </span>
                            )}
                          </div>

                          <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                            <div className="flex items-center gap-2">
                              <Clock3 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">Plazo límite: {horaEntrega}</span>
                            </div>

                            {asig.subject && (
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded text-[11px] border border-brand-200">
                                  {asig.subject.name}
                                </span>
                                {asig.course && (
                                  <span className="text-[11px] text-slate-600">
                                    · {asig.course.name}
                                  </span>
                                )}
                              </div>
                            )}

                            {asig.teacher && (
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="text-[11px] text-slate-600">
                                  Docente: {asig.teacher.firstName} {asig.teacher.lastName}
                                </span>
                              </div>
                            )}
                          </div>

                          {asig.description && (
                            <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 leading-relaxed border border-slate-100">
                              <p className="whitespace-pre-wrap break-words">{asig.description}</p>
                            </div>
                          )}
                        </li>
                      );
                    })}

                    {/* 2. Actividades y Eventos del Calendario */}
                    {eventosdeldia.map((evento) => {
                      const puedeEditarEvento = puedeEditar(evento);
                      const inicioeneldia = clavededia(new Date(evento.startsAt)) === diaseleccionado;
                      const fineneldia = clavededia(new Date(evento.endsAt)) === diaseleccionado;
                      const cfg = configportipo[evento.type];
                      const aud = obtenerAudiencia(evento.description, evento.targetCourseId, evento.type);
                      const descLimpia = limpiarDescripcion(evento.description);

                      const horario = evento.allDay
                        ? 'Jornada completa (Todo el día)'
                        : inicioeneldia && fineneldia
                          ? `${formatohora(evento.startsAt)} – ${formatohora(evento.endsAt)}`
                          : inicioeneldia
                            ? `Desde ${formatohora(evento.startsAt)}`
                            : fineneldia
                              ? `Hasta ${formatohora(evento.endsAt)}`
                              : 'Actividad de varios días';

                      return (
                        <li
                          key={evento.id}
                          className={`rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs border-l-4 ${cfg.accentBar} transition-all hover:shadow-xs`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bgLight} ${cfg.textColor} border ${cfg.borderColor}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
                                  {cfg.label}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${evento.status === 'CANCELADO'
                                    ? 'bg-rose-100 text-rose-800'
                                    : evento.status === 'REALIZADO'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-700'
                                    }`}
                                >
                                  {estadoetiqueta(evento)}
                                </span>

                                {aud !== 'TODOS' && (
                                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                    {aud === 'ESTUDIANTES' ? 'Estudiantes' : aud === 'PADRES' ? 'Padres de Familia' : 'Profesores'}
                                  </span>
                                )}
                              </div>
                              <h5 className="text-sm font-bold text-slate-900 break-words pt-1">
                                {evento.title}
                              </h5>
                            </div>

                            {puedeEditarEvento && (
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => abrirEdicion(evento)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-brand-700 hover:bg-brand-50 transition-colors cursor-pointer"
                                  title={`Editar ${evento.title}`}
                                  aria-label={`Editar ${evento.title}`}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                {evento.status !== 'CANCELADO' && (
                                  <button
                                    type="button"
                                    onClick={() => establecerCancelacionPendiente(evento.id)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title={`Cancelar ${evento.title}`}
                                    aria-label={`Cancelar ${evento.title}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                            <div className="flex items-center gap-2">
                              <Clock3 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">{horario}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {evento.targetCourse ? (
                                <>
                                  <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  <span className="font-medium text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded text-[11px] border border-brand-200">
                                    {evento.targetCourse.name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  <span className="text-[11px] text-slate-600">Toda la Unidad Educativa</span>
                                </>
                              )}
                            </div>

                            {evento.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="text-[11px] text-slate-600 truncate">{evento.location}</span>
                              </div>
                            )}
                          </div>

                          {descLimpia && (
                            <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 leading-relaxed border border-slate-100">
                              <p className="whitespace-pre-wrap break-words">{descLimpia}</p>
                            </div>
                          )}

                          {cancelacionPendiente === evento.id && (
                            <div className="mt-3 rounded-xl bg-rose-50 p-3 border border-rose-200" role="group" aria-label="Confirmar cancelación">
                              <p className="text-xs font-bold text-rose-900">¿Desea cancelar esta actividad?</p>
                              <p className="text-[11px] text-rose-700 mt-0.5">Quedará registrada como cancelada en el historial.</p>
                              <div className="mt-2.5 flex items-center gap-2">
                                <Boton
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  disabled={mutacioncancelar.isPending}
                                  onClick={() => mutacioncancelar.mutate(evento.id)}
                                  className="h-8 text-xs font-semibold cursor-pointer"
                                >
                                  {mutacioncancelar.isPending ? 'Cancelando...' : 'Confirmar Cancelación'}
                                </Boton>
                                <Boton
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => establecerCancelacionPendiente(null)}
                                  className="h-8 text-xs cursor-pointer"
                                >
                                  Volver
                                </Boton>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Pie de la agenda */}
              <div className="mt-6 border-t border-slate-200/80 pt-4 text-center">
                <p className="text-[11px] text-slate-400">
                  SIGCE · Sistema Institucional de Gestión y Control Educativo
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
