import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Search, Users, X } from 'lucide-react';
import type { gestionasistencia } from '../application/gestionasistencia';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import { Planillaasistenciacurso } from '../components/planillaasistenciacurso';

const estadoconfiguracion: Record<string, { label: string; badgeClass: string; dotClass: string }> =
  {
    PRESENT: {
      label: 'Presente',
      badgeClass: 'bg-emerald-50 text-emerald-700',
      dotClass: 'bg-emerald-500',
    },
    ABSENT: {
      label: 'Ausente',
      badgeClass: 'bg-rose-50 text-rose-700',
      dotClass: 'bg-rose-500',
    },
    LATE: {
      label: 'Atrasado',
      badgeClass: 'bg-amber-50 text-amber-700',
      dotClass: 'bg-amber-500',
    },
    JUSTIFIED: {
      label: 'Justificado',
      badgeClass: 'bg-blue-50 text-blue-700',
      dotClass: 'bg-blue-500',
    },
  };

export const AsistenciaPagina = ({
  management: gestion,
  currentRole: actualrol,
}: {
  management: gestionasistencia;
  currentRole?: string;
}) => {
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [buscar, establecerbuscar] = useState('');
  const [cursofiltro, establecercursofiltro] = useState('');
  const [estadofiltro, establecerestadofiltro] = useState('');
  const [desdefiltro, establecerdesdefiltro] = useState('');
  const [hastafiltro, establecerhastafiltro] = useState('');
  const [pagina, establecerpagina] = useState(0);

  const puedeeditar = ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'].includes(actualrol ?? '');
  const asistenciaconsulta = useQuery({
    queryKey: ['attendance', cursofiltro, desdefiltro, hastafiltro, pagina],
    queryFn: () =>
      gestion.listarasistencia({
        courseId: cursofiltro || undefined,
        from: desdefiltro || undefined,
        to: hastafiltro || undefined,
        offset: pagina * 200,
      }),
  });
  const cursosconsulta = useQuery({
    queryKey: ['courses', 'attendance'],
    queryFn: () => gestion.listarcursos(),
  });

  const registros = asistenciaconsulta.data?.data ?? [];
  const totalregistros = asistenciaconsulta.data?.total ?? 0;
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

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Asistencia</h1>
          <p className="text-sm text-slate-500 mt-0.5">{registros.length} partes registrados</p>
        </div>

        {puedeeditar && (
          <button
            type="button"
            onClick={() => establecermostrarformulario((anterior) => !anterior)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mostrarformulario ? 'Cerrar' : 'Tomar asistencia'}
          </button>
        )}
      </div>

      {/* Summary Cards - Clean */}
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

      {mostrarformulario &&
        puedeeditar &&
        (cursosconsulta.isError ? (
          <p role="alert" className="text-sm text-rose-700">
            No se pudieron cargar los cursos.
          </p>
        ) : (
          <Planillaasistenciacurso management={gestion} courses={cursosconsulta.data ?? []} />
        ))}

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
          {(cursosconsulta.data ?? []).map((curso) => (
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
          {Object.entries(estadoconfiguracion).map(([clave, configuracion]) => (
            <option key={clave} value={clave}>
              {configuracion.label}
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

      {/* Table - Clean */}
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="py-3 pl-5 pr-3">Fecha</th>
                  <th className="px-3 py-3">Estudiante</th>
                  <th className="px-3 py-3">Curso</th>
                  <th className="px-3 py-3 text-center">Estado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradoregistros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-700">No hay registros</p>
                        <p className="text-sm text-slate-400">
                          Registre un nuevo parte de asistencia.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtradoregistros.map((registrar) => {
                    const configuracion = estadoconfiguracion[registrar.status] ?? {
                      label: registrar.status,
                      badgeClass: 'bg-slate-100 text-slate-600',
                      dotClass: 'bg-slate-400',
                    };
                    const iniciales =
                      `${registrar.student.firstName[0] ?? ''}${registrar.student.lastName[0] ?? ''}`.toUpperCase();

                    return (
                      <tr key={registrar.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pl-5 pr-3 font-mono text-slate-700">
                          {new Date(registrar.date).toLocaleDateString('es-BO', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            timeZone: 'UTC',
                          })}
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                              {iniciales}
                            </div>
                            <span className="font-medium text-slate-900">
                              {registrar.student.firstName} {registrar.student.lastName}
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {cursoetiqueta(registrar.course.name)}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${configuracion.badgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${configuracion.dotClass}`}
                            />
                            {configuracion.label}
                          </span>
                        </td>

                        <td className="py-3 pl-3 pr-5 text-right text-slate-500 text-xs">
                          {registrar.justification || <span className="text-slate-300">—</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalregistros > 200 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <button
            type="button"
            disabled={pagina === 0}
            onClick={() => establecerpagina((actual) => actual - 1)}
            className="rounded border border-slate-200 px-3 py-1 disabled:opacity-40"
          >
            Anterior
          </button>
          <span>
            Página {pagina + 1} de {Math.ceil(totalregistros / 200)}
          </span>
          <button
            type="button"
            disabled={(pagina + 1) * 200 >= totalregistros}
            onClick={() => establecerpagina((actual) => actual + 1)}
            className="rounded border border-slate-200 px-3 py-1 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
