import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  Clock,
  Download,
  Edit3,
  PlusCircle,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
  ChevronRight,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type { consultasauditoria, auditoriaregistroregistro } from '../application/consultasauditoria';

type categoriaaccion = 'ALL' | 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC';

const etiquetasentidad: Record<string, string> = {
  Student: 'Estudiante', Parent: 'Familiar', Teacher: 'Docente', Enrollment: 'Matrícula',
  Grade: 'Calificación', Attendance: 'Asistencia', ClassSchedule: 'Horario', TeacherSubject: 'Asignación de materia',
  Course: 'Curso', Subject: 'Materia', Assignment: 'Tarea o evaluación', Announcement: 'Comunicado',
  Alert: 'Alerta', User: 'Cuenta de usuario', SieSynchronization: 'Sincronización SIE',
  SieSynchronizationItem: 'Registro de sincronización SIE', StudentDocumentReference: 'Documento del estudiante',
};

const etiquetascampo: Record<string, string> = {
  firstName: 'Nombres', lastName: 'Apellidos', email: 'Correo', ci: 'C.I.', rude: 'RUDE',
  birthDate: 'Fecha de nacimiento', gender: 'Sexo', phone: 'Teléfono', address: 'Dirección',
  specialty: 'Materia principal', itemNumber: 'Número de ítem', name: 'Nombre', title: 'Título',
  description: 'Descripción', value: 'Calificación', status: 'Estado', date: 'Fecha',
  relationship: 'Vínculo familiar', isActive: 'Cuenta activa', isRead: 'Leída',
  documentType: 'Tipo de documento', reference: 'Referencia', notes: 'Observaciones',
  startTime: 'Hora de inicio', endTime: 'Hora de conclusión', dayOfWeek: 'Día',
  weeklyPeriods: 'Sesiones por semana', reason: 'Motivo', justification: 'Justificación',
};

const etiquetasvalor: Record<string, string> = {
  ADMINISTRATIVE: 'Administración', SECRETARY: 'Secretaría', TEACHER: 'Docente',
  PARENT: 'Padre, madre o tutor', STUDENT: 'Estudiante', ACTIVE: 'Activa', INACTIVE: 'Inactiva',
  TRANSFERRED: 'Trasladada', GRADUATED: 'Promovida', WITHDRAWN: 'Retirada', PRESENT: 'Presente',
  ABSENT: 'Ausente', LATE: 'Atraso', JUSTIFIED: 'Justificada', OPEN: 'Abierta',
  IN_PROGRESS: 'En atención', RESOLVED: 'Resuelta', VERIFIED: 'Verificada', FAILED: 'Fallida',
  DISCREPANCY: 'Con diferencia', CREATE: 'Creación', INSERT: 'Creación', UPDATE: 'Actualización',
  PATCH: 'Actualización', DELETE: 'Eliminación', REMOVE: 'Eliminación', SYNC: 'Sincronización',
};

function categoriaDeAccion(accion: string): Exclude<categoriaaccion, 'ALL'> | null {
  const normalizada = accion.toUpperCase();
  if (normalizada.includes('CREATE') || normalizada.includes('INSERT')) return 'CREATE';
  if (normalizada.includes('UPDATE') || normalizada.includes('PATCH') || normalizada.includes('EDIT')) return 'UPDATE';
  if (normalizada.includes('DELETE') || normalizada.includes('REMOVE')) return 'DELETE';
  if (normalizada.includes('SYNC')) return 'SYNC';
  return null;
}

function etiquetaaccion(accion: string): string {
  const categoria = categoriaDeAccion(accion);
  if (categoria) return etiquetasvalor[categoria];
  return accion.replace(/[_-]+/g, ' ').toLowerCase().replace(/^./, (letra) => letra.toUpperCase());
}

function etiquetaentidad(entidad: string): string {
  return etiquetasentidad[entidad] ?? entidad.replace(/[_-]+/g, ' ').replace(/^./, (letra) => letra.toUpperCase());
}

function etiquetaCampo(campo: string): string {
  return etiquetascampo[campo] ?? campo.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, (letra) => letra.toUpperCase());
}

function valorlegible(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return 'Sin dato';
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (typeof valor === 'number') return String(valor);
  if (Array.isArray(valor)) return `${valor.length} elemento${valor.length === 1 ? '' : 's'}`;
  if (typeof valor === 'object') return 'Información relacionada';
  const texto = String(valor);
  if (etiquetasvalor[texto]) return etiquetasvalor[texto];
  if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(texto)) {
    const fecha = new Date(texto);
    if (!Number.isNaN(fecha.getTime())) return fecha.toLocaleString('es-BO');
  }
  return texto;
}

function camposlegibles(valor: unknown): Array<{ campo: string; valor: string }> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    return valor === null || valor === undefined ? [] : [{ campo: 'Detalle', valor: valorlegible(valor) }];
  }
  const campos = Object.entries(valor as Record<string, unknown>)
    .filter(([campo]) => !/(^id$|Id$|password|token|secret|hash|credential|correlation|createdAt|updatedAt|deletedAt)/i.test(campo))
    .map(([campo, contenido]) => ({ campo: etiquetaCampo(campo), valor: valorlegible(contenido) }));
  return campos;
}

function resumen(registro: auditoriaregistroregistro): string {
  const valor = registro.newValue ?? registro.previousValue;
  const campos = camposlegibles(valor).slice(0, 2);
  if (!campos.length) return `${etiquetaentidad(registro.entity)} registrada.`;
  return campos.map((campo) => `${campo.campo}: ${campo.valor}`).join(' · ');
}

function celdacsv(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

function ListaDeCampos({ valor }: { valor: unknown }) {
  const campos = camposlegibles(valor);
  if (!campos.length) return <p className="text-sm text-slate-500">No hay detalles adicionales.</p>;
  return (
    <dl className="divide-y divide-slate-100">
      {campos.map((campo, indice) => (
        <div key={`${campo.campo}-${indice}`} className="grid grid-cols-[minmax(7rem,0.8fr)_2fr] gap-3 py-2 text-sm">
          <dt className="text-slate-500">{campo.campo}</dt>
          <dd className="break-words font-medium text-slate-800">{campo.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export const AuditoriaPagina: React.FC<{ queries: consultasauditoria }> = ({ queries: consultas }) => {
  const [buscar, establecerbuscar] = useState('');
  const [accionfiltro, estableceraccionfiltro] = useState<categoriaaccion>('ALL');
  const [entidadfiltro, establecerentidadfiltro] = useState('ALL');
  const [estudiantefiltro, establecerestudiantefiltro] = useState('ALL');
  const [seleccionado, establecerseleccionado] = useState<auditoriaregistroregistro | null>(null);

  const registrosconsulta = useQuery({
    queryKey: ['audit', estudiantefiltro],
    queryFn: () => consultas.listarauditoria(estudiantefiltro === 'ALL' ? undefined : estudiantefiltro),
    refetchInterval: 30_000,
  });
  const estudiantesconsulta = useQuery({
    queryKey: ['audit-student-options'],
    queryFn: () => consultas.listarestudianteopciones(),
  });
  const registros = registrosconsulta.data?.data ?? [];
  const entidades = useMemo(() => [...new Set(registros.map((registro) => registro.entity))].sort(), [registros]);
  const filtrados = registros.filter((registro) => {
    if (accionfiltro !== 'ALL' && categoriaDeAccion(registro.action) !== accionfiltro) return false;
    if (entidadfiltro !== 'ALL' && registro.entity !== entidadfiltro) return false;
    if (!buscar.trim()) return true;
    const termino = buscar.toLowerCase();
    return [
      etiquetaaccion(registro.action), etiquetaentidad(registro.entity), registro.entityId,
      registro.userId ?? '', registro.reason ?? '', resumen(registro),
    ].some((dato) => dato.toLowerCase().includes(termino));
  });

  const estadisticas = {
    total: registros.length,
    crear: registros.filter((registro) => categoriaDeAccion(registro.action) === 'CREATE').length,
    actualizar: registros.filter((registro) => categoriaDeAccion(registro.action) === 'UPDATE').length,
    eliminar: registros.filter((registro) => categoriaDeAccion(registro.action) === 'DELETE').length,
    sincronizar: registros.filter((registro) => categoriaDeAccion(registro.action) === 'SYNC').length,
  };

  const exportar = () => {
    const filas = [
      ['Fecha y hora', 'Movimiento', 'Sección', 'Identificador del registro', 'Realizado por', 'Motivo', 'Detalle'].map(celdacsv).join(','),
      ...filtrados.map((registro) => [
        new Date(registro.createdAt).toLocaleString('es-BO'),
        etiquetaaccion(registro.action),
        etiquetaentidad(registro.entity),
        registro.entityId,
        registro.userId ? 'Personal del sistema' : 'Sistema',
        registro.reason ?? '',
        resumen(registro),
      ].map(celdacsv).join(',')),
    ];
    const archivo = new Blob(['\uFEFF', filas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `historial-cambios-${new Date().toISOString().slice(0, 10)}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
  };

  const insignia = (accion: string) => {
    const categoria = categoriaDeAccion(accion);
    const apariencia = categoria === 'CREATE' ? 'bg-emerald-50 text-emerald-700'
      : categoria === 'UPDATE' ? 'bg-amber-50 text-amber-700'
        : categoria === 'DELETE' ? 'bg-rose-50 text-rose-700'
          : categoria === 'SYNC' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600';
    const Icono = categoria === 'CREATE' ? PlusCircle : categoria === 'UPDATE' ? Edit3 : categoria === 'DELETE' ? Trash2 : RefreshCw;
    return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${apariencia}`}><Icono className="h-3 w-3" />{etiquetaaccion(accion)}</span>;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Historial de cambios</h1>
          <p className="mt-0.5 text-sm text-slate-500">Consulta quién realizó cambios en la información académica y cuándo.</p>
        </div>
        <div className="flex gap-2">
          <Boton variant="outline" size="sm" onClick={() => registrosconsulta.refetch()} disabled={registrosconsulta.isFetching}>
            <RefreshCw className={`h-4 w-4 ${registrosconsulta.isFetching ? 'animate-spin' : ''}`} />Actualizar
          </Boton>
          <Boton size="sm" onClick={exportar} disabled={!filtrados.length}><Download className="h-4 w-4" />Descargar lista</Boton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ['Registros', estadisticas.total, 'text-slate-900'], ['Creaciones', estadisticas.crear, 'text-emerald-600'],
          ['Actualizaciones', estadisticas.actualizar, 'text-amber-600'], ['Eliminaciones', estadisticas.eliminar, 'text-rose-600'],
          ['Sincronizaciones', estadisticas.sincronizar, 'text-blue-600'],
        ].map(([etiqueta, cantidad, color]) => (
          <div key={String(etiqueta)} className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-xs font-medium text-slate-500">{etiqueta}</span>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{cantidad}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(14rem,1fr)_auto_auto_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={buscar} onChange={(evento) => establecerbuscar(evento.target.value)} placeholder="Buscar en el historial" className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
          {buscar && <button type="button" aria-label="Limpiar búsqueda" onClick={() => establecerbuscar('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="h-4 w-4" /></button>}
        </label>
        <select aria-label="Filtrar por estudiante" value={estudiantefiltro} onChange={(evento) => establecerestudiantefiltro(evento.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="ALL">Todos los estudiantes</option>
          {(estudiantesconsulta.data ?? []).map((estudiante) => <option key={estudiante.id} value={estudiante.id}>{estudiante.lastName}, {estudiante.firstName}</option>)}
        </select>
        <select aria-label="Filtrar por movimiento" value={accionfiltro} onChange={(evento) => estableceraccionfiltro(evento.target.value as categoriaaccion)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="ALL">Todos los movimientos</option><option value="CREATE">Creaciones</option><option value="UPDATE">Actualizaciones</option><option value="DELETE">Eliminaciones</option><option value="SYNC">Sincronizaciones</option>
        </select>
        <select aria-label="Filtrar por sección" value={entidadfiltro} onChange={(evento) => establecerentidadfiltro(evento.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="ALL">Todas las secciones</option>
          {entidades.map((entidad) => <option key={entidad} value={entidad}>{etiquetaentidad(entidad)}</option>)}
        </select>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {registrosconsulta.isLoading ? (
          <p role="status" className="p-12 text-center text-sm text-slate-500">Cargando historial…</p>
        ) : registrosconsulta.isError ? (
          <div role="alert" className="p-12 text-center"><AlertTriangle className="mx-auto mb-2 h-8 w-8 text-rose-500" /><p className="font-medium text-slate-900">No se pudo cargar el historial</p><p className="mt-1 text-sm text-slate-500">Vuelve a intentarlo.</p></div>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center text-slate-500"><Search className="mx-auto mb-2 h-8 w-8 text-slate-300" /><p className="font-medium text-slate-800">No hay cambios que coincidan</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Movimiento</th><th className="px-5 py-3">Sección</th><th className="px-5 py-3">Realizado por</th><th className="px-5 py-3">Detalle</th><th className="px-5 py-3" /></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((registro) => (
                  <tr key={registro.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4"><span className="flex items-center gap-2 text-xs text-slate-700"><Clock className="h-4 w-4 text-slate-400" />{new Date(registro.createdAt).toLocaleString('es-BO')}</span></td>
                    <td className="px-5 py-4">{insignia(registro.action)}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{etiquetaentidad(registro.entity)}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-2 text-slate-700"><User className="h-4 w-4 text-slate-400" />{registro.userId ? 'Personal del sistema' : 'Sistema'}</span></td>
                    <td className="max-w-sm px-5 py-4 text-xs text-slate-600">{registro.reason ? <span className="mr-2 font-medium text-amber-800">Motivo: {registro.reason}</span> : null}{resumen(registro)}</td>
                    <td className="px-5 py-4"><button type="button" onClick={() => establecerseleccionado(registro)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50" aria-label={`Ver detalle: ${etiquetaaccion(registro.action)} en ${etiquetaentidad(registro.entity)}`}>Ver detalle<ChevronRight className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-500">Mostrando <strong className="text-slate-800">{filtrados.length}</strong> de <strong className="text-slate-800">{registros.length}</strong> registros</div>
      </section>

      {seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) establecerseleccionado(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="titulo-detalle-cambio" className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div><h2 id="titulo-detalle-cambio" className="text-base font-bold text-slate-900">Detalle del cambio</h2><p className="mt-1 text-sm text-slate-600">{insignia(seleccionado.action)} <span className="ml-1">· {etiquetaentidad(seleccionado.entity)}</span></p></div>
              <button type="button" onClick={() => establecerseleccionado(null)} aria-label="Cerrar detalle" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[calc(90vh-9rem)] space-y-5 overflow-y-auto p-6">
              <dl className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3">
                <div><dt className="text-xs text-slate-500">Realizado por</dt><dd className="mt-1 font-medium text-slate-800">{seleccionado.userId ? 'Personal del sistema' : 'Sistema'}</dd></div>
                <div><dt className="text-xs text-slate-500">Fecha y hora</dt><dd className="mt-1 font-medium text-slate-800">{new Date(seleccionado.createdAt).toLocaleString('es-BO')}</dd></div>
                <div><dt className="text-xs text-slate-500">Sección</dt><dd className="mt-1 font-medium text-slate-800">{etiquetaentidad(seleccionado.entity)}</dd></div>
              </dl>
              {seleccionado.reason && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="text-sm font-semibold text-amber-900">Motivo registrado</h3><p className="mt-1 whitespace-pre-wrap text-sm text-amber-900">{seleccionado.reason}</p></div>}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4"><h3 className="mb-2 text-sm font-semibold text-rose-800">Antes</h3><ListaDeCampos valor={seleccionado.previousValue} /></div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4"><h3 className="mb-2 text-sm font-semibold text-emerald-800">Después</h3><ListaDeCampos valor={seleccionado.newValue} /></div>
              </div>
            </div>
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3"><Boton variant="outline" size="sm" onClick={() => establecerseleccionado(null)}>Cerrar</Boton></div>
          </section>
        </div>
      )}
    </div>
  );
};
