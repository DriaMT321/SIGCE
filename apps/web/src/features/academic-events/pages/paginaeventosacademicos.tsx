import { useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  School,
  Trash2,
  X,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type {
  cursoeventoopcion,
  eventoacademico,
  gestioneventosacademicos,
  tipoeventoacademico,
} from '../application/gestioneventosacademicos';

const zonabolivia = 'America/La_Paz';
const diasdelasemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const tiposevento = ['ACTIVIDAD', 'REUNION', 'ACTO_ESCOLAR', 'SUSPENSION_CLASES', 'OTRO'] as const;

const etiquetasdetipo: Record<tipoeventoacademico, string> = {
  ACTIVIDAD: 'Actividad académica',
  REUNION: 'Reunión',
  ACTO_ESCOLAR: 'Acto escolar',
  SUSPENSION_CLASES: 'Suspensión de clases',
  OTRO: 'Otro evento',
};

const coloresportipo: Record<tipoeventoacademico, string> = {
  ACTIVIDAD: 'bg-amber-50 text-amber-900 border-amber-200',
  REUNION: 'bg-sky-50 text-sky-900 border-sky-200',
  ACTO_ESCOLAR: 'bg-violet-50 text-violet-900 border-violet-200',
  SUSPENSION_CLASES: 'bg-rose-50 text-rose-900 border-rose-200',
  OTRO: 'bg-slate-100 text-slate-800 border-slate-200',
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
    startDate: hoy,
    startTime: '09:00',
    endDate: hoy,
    endTime: '10:00',
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
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      <span>{etiqueta}</span>
      {children}
      {error ? <span className="text-xs font-normal text-rose-700">{error}</span> : null}
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

function mescalendario(anio: number, mes: number) {
  const primero = new Date(Date.UTC(anio, mes, 1));
  const dias = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const desplazamiento = (primero.getUTCDay() + 6) % 7;
  const celdas: Array<{ dia: number; clave: string } | null> = Array(desplazamiento).fill(null);
  for (let dia = 1; dia <= dias; dia += 1) {
    celdas.push({
      dia,
      clave: `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
    });
  }
  while (celdas.length % 7 !== 0) celdas.push(null);
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
  const [mesvisible, establecerMesVisible] = useState(() => {
    const hoy = partesfecha(new Date());
    return { anio: Number(hoy.anio), mes: Number(hoy.mes) - 1 };
  });
  const [diaseleccionado, establecerDiaSeleccionado] = useState(() => clavededia(new Date()));
  const [filtroTipo, establecerFiltroTipo] = useState<string>('TODOS');
  const [mostrarFormulario, establecerMostrarFormulario] = useState(false);
  const [eventoEditado, establecerEventoEditado] = useState<eventoacademico | null>(null);
  const [cancelacionPendiente, establecerCancelacionPendiente] = useState<string | null>(null);
  const [mensajedeexito, establecerMensajeDeExito] = useState('');

  const rango = useMemo(() => {
    const inicio = `${mesvisible.anio}-${String(mesvisible.mes + 1).padStart(2, '0')}-01`;
    const mesposterior = new Date(Date.UTC(mesvisible.anio, mesvisible.mes + 1, 1));
    const fin = `${mesposterior.getUTCFullYear()}-${String(mesposterior.getUTCMonth() + 1).padStart(2, '0')}-01`;
    return {
      desde: new Date(`${inicio}T00:00:00-04:00`).toISOString(),
      hasta: new Date(`${fin}T00:00:00-04:00`).toISOString(),
    };
  }, [mesvisible]);

  const eventosconsulta = useQuery({
    queryKey: ['academic-events', mesvisible.anio, mesvisible.mes],
    queryFn: () => gestion.listar(rango.desde, rango.hasta),
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
      const comun = {
        title: datos.title,
        type: datos.type,
        description: datos.description,
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
      establecerMensajeDeExito(eventoEditado ? 'La actividad se actualizó.' : 'La actividad quedó programada.');
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
      establecerMensajeDeExito('La actividad se canceló.');
      void clienteconsultas.invalidateQueries({ queryKey: ['academic-events'] });
    },
  });

  const eventos = eventosconsulta.data ?? [];
  const eventosfiltrados = useMemo(
    () => (filtroTipo === 'TODOS' ? eventos : eventos.filter((evento) => evento.type === filtroTipo)),
    [eventos, filtroTipo],
  );
  const eventosdeldia = useMemo(
    () =>
      eventosfiltrados.filter(
        (evento) =>
          clavededia(new Date(evento.startsAt)) <= diaseleccionado &&
          clavededia(new Date(evento.endsAt)) >= diaseleccionado,
      ),
    [eventosfiltrados, diaseleccionado],
  );
  const celdas = useMemo(() => mescalendario(mesvisible.anio, mesvisible.mes), [mesvisible]);
  const nombreMes = new Intl.DateTimeFormat('es-BO', {
    month: 'long',
    year: 'numeric',
    timeZone: zonabolivia,
  }).format(new Date(Date.UTC(mesvisible.anio, mesvisible.mes, 15, 12)));
  const fechadeldia = new Intl.DateTimeFormat('es-BO', {
    dateStyle: 'full',
    timeZone: zonabolivia,
  }).format(new Date(`${diaseleccionado}T12:00:00-04:00`));
  const proximoseventos = eventos.filter(
    (evento) => evento.status === 'PROGRAMADO' && new Date(evento.endsAt).getTime() >= Date.now(),
  ).length;
  const eventosinstitucionales = eventos.filter((evento) => !evento.targetCourseId).length;
  const hoy = clavededia(new Date());

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
    establecerEventoEditado(evento);
    establecerMensajeDeExito('');
    formulario.reset({
      title: evento.title,
      type: evento.type,
      description: evento.description ?? '',
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

  const errorapi = mutacionguardar.error ?? mutacioncancelar.error;

  return (
    <main className="mx-auto max-w-[1500px] space-y-6 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Calendario académico</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Programa actividades, reuniones y actos escolares. Las actividades por curso solo se muestran a su comunidad.
          </p>
        </div>
        {puedeprogramar ? <Boton onClick={abrirNuevo} className="shrink-0"><Plus aria-hidden="true" /> Programar actividad</Boton> : null}
      </header>

      {mensajedeexito ? (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> {mensajedeexito}
        </div>
      ) : null}
      {errorapi instanceof Error ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorapi.message}</div>
      ) : null}

      {mostrarFormulario ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="titulo-formulario-evento">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 id="titulo-formulario-evento" className="text-lg font-semibold text-slate-950">
                {eventoEditado ? 'Editar actividad' : 'Programar actividad'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">Las horas se interpretan según el horario de Bolivia.</p>
            </div>
            <Boton type="button" variant="ghost" size="icon" aria-label="Cerrar formulario" onClick={() => establecerMostrarFormulario(false)}>
              <X aria-hidden="true" />
            </Boton>
          </div>

          <form className="grid gap-4" onSubmit={guardarFormulario} noValidate>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <CampoFormulario etiqueta="Nombre de la actividad" error={formulario.formState.errors.title?.message}>
                <Entrada placeholder="Ej. Feria de ciencias" {...formulario.register('title')} />
              </CampoFormulario>
              <CampoFormulario etiqueta="Tipo" error={formulario.formState.errors.type?.message}>
                <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30" {...formulario.register('type')}>
                  {tiposevento.map((tipo) => <option key={tipo} value={tipo}>{etiquetasdetipo[tipo]}</option>)}
                </select>
              </CampoFormulario>
              <CampoFormulario etiqueta="Público" error={formulario.formState.errors.courseId?.message}>
                <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30" disabled={cursosconsulta.isLoading} {...formulario.register('courseId')}>
                  {!esdocente ? <option value="">Toda la unidad educativa</option> : <option value="">Selecciona un curso</option>}
                  {(cursosconsulta.data ?? []).map((curso) => <option key={curso.id} value={curso.id}>{nombrecurso(curso)}</option>)}
                </select>
              </CampoFormulario>
              <CampoFormulario etiqueta="Fecha de inicio" error={formulario.formState.errors.startDate?.message}>
                <Entrada type="date" {...formulario.register('startDate')} />
              </CampoFormulario>
              <CampoFormulario etiqueta="Hora de inicio" error={formulario.formState.errors.startTime?.message}>
                <Entrada type="time" disabled={formulario.watch('allDay')} {...formulario.register('startTime')} />
              </CampoFormulario>
              <CampoFormulario etiqueta="Fecha de finalización" error={formulario.formState.errors.endDate?.message}>
                <Entrada type="date" {...formulario.register('endDate')} />
              </CampoFormulario>
              <CampoFormulario etiqueta="Hora de finalización" error={formulario.formState.errors.endTime?.message}>
                <Entrada type="time" disabled={formulario.watch('allDay')} {...formulario.register('endTime')} />
              </CampoFormulario>
              <CampoFormulario etiqueta="Lugar (opcional)" error={formulario.formState.errors.location?.message}>
                <Entrada placeholder="Ej. Patio central" {...formulario.register('location')} />
              </CampoFormulario>
              {eventoEditado ? (
                <CampoFormulario etiqueta="Estado">
                  <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30" {...formulario.register('status')}>
                    <option value="PROGRAMADO">Programado</option>
                    <option value="REALIZADO">Realizado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </CampoFormulario>
              ) : null}
            </div>

            <label className="flex w-fit items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-800 focus:ring-brand-700" {...formulario.register('allDay')} />
              Actividad de todo el día
            </label>
            <CampoFormulario etiqueta="Descripción (opcional)" error={formulario.formState.errors.description?.message}>
              <textarea rows={3} maxLength={2000} placeholder="Agrega indicaciones o información útil para las familias y el personal." className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30" {...formulario.register('description')} />
            </CampoFormulario>

            {esdocente && !cursosconsulta.isLoading && (cursosconsulta.data?.length ?? 0) === 0 ? (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">No tienes cursos asignados para programar actividades.</p>
            ) : null}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <Boton type="button" variant="ghost" onClick={() => establecerMostrarFormulario(false)}>Volver al calendario</Boton>
              <Boton type="submit" disabled={mutacionguardar.isPending || (esdocente && (cursosconsulta.data?.length ?? 0) === 0)}>
                {mutacionguardar.isPending ? <RefreshCw className="animate-spin" aria-hidden="true" /> : <Check aria-hidden="true" />}
                {mutacionguardar.isPending ? 'Guardando…' : eventoEditado ? 'Guardar cambios' : 'Programar'}
              </Boton>
            </div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-900">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold capitalize text-slate-950">{nombreMes}</h2>
              <p className="text-xs text-slate-600">{proximoseventos} próximos · {eventosinstitucionales} institucionales</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Filtrar por tipo de actividad" className="h-9 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700/30" value={filtroTipo} onChange={(evento) => establecerFiltroTipo(evento.target.value)}>
              <option value="TODOS">Todos los tipos</option>
              {tiposevento.map((tipo) => <option key={tipo} value={tipo}>{etiquetasdetipo[tipo]}</option>)}
            </select>
            <Boton type="button" variant="outline" size="sm" onClick={irAhoy}>Hoy</Boton>
            <div className="flex items-center rounded-lg border border-slate-200">
              <Boton type="button" variant="ghost" size="icon" aria-label="Mes anterior" onClick={() => cambiarMes(-1)}><ArrowLeft aria-hidden="true" /></Boton>
              <Boton type="button" variant="ghost" size="icon" aria-label="Mes siguiente" onClick={() => cambiarMes(1)}><ArrowRight aria-hidden="true" /></Boton>
            </div>
          </div>
        </div>
        {eventosconsulta.isError ? (
          <div role="alert" className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <p>No se pudo cargar el calendario. Revisa tu conexión e inténtalo de nuevo.</p>
            <Boton className="mt-3" variant="outline" size="sm" onClick={() => void eventosconsulta.refetch()}>Reintentar</Boton>
          </div>
        ) : eventosconsulta.isLoading ? (
          <div className="grid animate-pulse grid-cols-7 gap-px bg-slate-100 p-px" aria-label="Cargando calendario">
            {Array.from({ length: 35 }, (_, indice) => <div key={indice} className="min-h-20 bg-white sm:min-h-28" />)}
          </div>
        ) : (
          <div className="grid min-h-[520px] grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
            <div className="min-w-0">
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">
                {diasdelasemana.map((dia) => (
                  <div key={dia} className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-600 sm:px-3 sm:py-3 sm:text-xs">{dia}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {celdas.map((celda, indice) => {
                  if (!celda) return <div key={`vacio-${indice}`} className="min-h-[68px] border-b border-r border-slate-100 bg-slate-50/30 sm:min-h-[112px]" />;
                  const actividades = eventosdelacelda(celda.clave);
                  const seleccionado = diaseleccionado === celda.clave;
                  const eshoy = hoy === celda.clave;
                  return (
                    <button
                      key={celda.clave}
                      type="button"
                      aria-pressed={seleccionado}
                      aria-label={`${celda.dia}, ${actividades.length} actividades`}
                      onClick={() => establecerDiaSeleccionado(celda.clave)}
                      className={`min-h-[68px] border-b border-r border-slate-100 p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-700 sm:min-h-[112px] sm:p-2.5 ${seleccionado ? 'bg-amber-50/70' : 'bg-white hover:bg-slate-50'}`}
                    >
                      <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${eshoy ? 'bg-slate-900 text-white' : seleccionado ? 'text-amber-950' : 'text-slate-700'}`}>
                        {celda.dia}
                      </span>
                      <span className="mt-1.5 hidden space-y-1 sm:block">
                        {actividades.slice(0, 2).map((actividad) => (
                          <span key={actividad.id} className={`block truncate rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${coloresportipo[actividad.type]}`}>
                            {actividad.title}
                          </span>
                        ))}
                        {actividades.length > 2 ? <span className="block px-1 text-[10px] text-slate-600">+{actividades.length - 2} más</span> : null}
                      </span>
                      {actividades.length > 0 ? (
                        <span className="mt-1 flex items-center gap-1 sm:hidden">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-800" />
                          <span className="text-[10px] font-medium text-slate-600">{actividades.length}</span>
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-3 text-[11px] text-slate-600">
                {(['ACTIVIDAD', 'REUNION', 'ACTO_ESCOLAR', 'SUSPENSION_CLASES'] as const).map((tipo) => (
                  <span key={tipo} className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${tipo === 'ACTIVIDAD' ? 'bg-amber-500' : tipo === 'REUNION' ? 'bg-sky-500' : tipo === 'ACTO_ESCOLAR' ? 'bg-violet-500' : 'bg-rose-500'}`} />
                    {etiquetasdetipo[tipo]}
                  </span>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-slate-50/50 p-4 sm:p-5 xl:border-l xl:border-t-0">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Agenda del día</p>
                  <h3 className="mt-1 text-base font-semibold capitalize leading-6 text-slate-950">{fechadeldia}</h3>
                </div>
                {puedeprogramar ? (
                  <Boton type="button" variant="outline" size="sm" onClick={abrirNuevo} aria-label="Programar actividad para el día seleccionado">
                    <Plus aria-hidden="true" /> Agregar
                  </Boton>
                ) : null}
              </div>

              {eventosdeldia.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
                  <CalendarDays className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-slate-800">No hay actividades para este día</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {puedeprogramar ? 'Puedes programar una actividad desde aquí.' : 'Las actividades de tus cursos y de la unidad aparecerán aquí.'}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {eventosdeldia.map((evento) => {
                    const puedeEditarEvento = puedeEditar(evento);
                    const inicioeneldia = clavededia(new Date(evento.startsAt)) === diaseleccionado;
                    const fineneldia = clavededia(new Date(evento.endsAt)) === diaseleccionado;
                    const horario = evento.allDay
                      ? 'Todo el día'
                      : inicioeneldia && fineneldia
                        ? `${formatohora(evento.startsAt)} – ${formatohora(evento.endsAt)}`
                        : inicioeneldia
                          ? `Desde ${formatohora(evento.startsAt)}`
                          : fineneldia
                            ? `Hasta ${formatohora(evento.endsAt)}`
                            : 'Actividad de varios días';
                    return (
                      <li key={evento.id} className="rounded-xl border border-slate-200 bg-white p-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${coloresportipo[evento.type]}`}>
                              {etiquetasdetipo[evento.type]}
                            </span>
                            <h4 className="mt-2 break-words text-sm font-semibold text-slate-950">{evento.title}</h4>
                          </div>
                          {puedeEditarEvento ? (
                            <div className="flex shrink-0 items-center gap-1">
                              <Boton type="button" variant="ghost" size="icon" aria-label={`Editar ${evento.title}`} onClick={() => abrirEdicion(evento)}>
                                <Pencil aria-hidden="true" />
                              </Boton>
                              {evento.status !== 'CANCELADO' ? (
                                <Boton type="button" variant="ghost" size="icon" aria-label={`Cancelar ${evento.title}`} onClick={() => establecerCancelacionPendiente(evento.id)}>
                                  <Trash2 className="text-rose-700" aria-hidden="true" />
                                </Boton>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{horario}</span>
                          {evento.location ? <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{evento.location}</span> : null}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${evento.status === 'CANCELADO' ? 'bg-rose-100 text-rose-800' : evento.status === 'REALIZADO' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                            {estadoetiqueta(evento)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                            {evento.targetCourse ? <><School className="h-3 w-3" aria-hidden="true" />{evento.targetCourse.name}</> : 'Toda la unidad educativa'}
                          </span>
                        </div>
                        {evento.description ? <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">{evento.description}</p> : null}
                        {cancelacionPendiente === evento.id ? (
                          <div className="mt-3 rounded-lg bg-rose-50 p-3" role="group" aria-label="Confirmar cancelación">
                            <p className="text-xs font-medium text-rose-900">¿Cancelar esta actividad?</p>
                            <div className="mt-2 flex gap-2">
                              <Boton type="button" variant="destructive" size="sm" disabled={mutacioncancelar.isPending} onClick={() => mutacioncancelar.mutate(evento.id)}>Confirmar cancelación</Boton>
                              <Boton type="button" variant="ghost" size="sm" onClick={() => establecerCancelacionPendiente(null)}>Volver</Boton>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
