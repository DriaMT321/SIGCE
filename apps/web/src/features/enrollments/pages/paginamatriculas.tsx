import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SelectHTMLAttributes } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ClipboardList, Loader2, Plus, Search, X } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type {
  gestioninscripcion,
  inscripcionestado,
  inscripcionestudianteopcion,
} from '../application/gestionmatricula';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';

const inscripcionformularioesquema = z.object({
  studentId: z.string().uuid('Selecciona un estudiante'),
  courseId: z.string().uuid('Selecciona un curso'),
  academicYearId: z.string().uuid('Selecciona una gestión'),
  remarks: z.string().max(300).optional(),
});

const estadoesquema = z.enum(['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED', 'WITHDRAWN']);
type inscripcionformulariodatos = z.infer<typeof inscripcionformularioesquema>;

function nombrecursoagrupado(nombre: string, paralelo: string): string {
  const sufijo = new RegExp(`(?:\\s+|-)${paralelo}$`, 'i');
  return cursoetiqueta(nombre).replace(sufijo, '').trim();
}

const estadoconfiguracion: Record<
  inscripcionestado,
  { label: string; badgeClass: string; dotClass: string }
> = {
  ACTIVE: {
    label: 'Activa',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  INACTIVE: {
    label: 'Inactiva',
    badgeClass: 'bg-slate-100 text-slate-600',
    dotClass: 'bg-slate-400',
  },
  TRANSFERRED: {
    label: 'Trasladada',
    badgeClass: 'bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500',
  },
  GRADUATED: {
    label: 'Graduada',
    badgeClass: 'bg-purple-50 text-purple-700',
    dotClass: 'bg-purple-500',
  },
  WITHDRAWN: {
    label: 'Retirada',
    badgeClass: 'bg-rose-50 text-rose-700',
    dotClass: 'bg-rose-500',
  },
};

export function InscripcionesPagina({
  management: gestion,
  currentRole: actualrol,
}: {
  management: gestioninscripcion;
  currentRole?: string;
}) {
  const clientedeconsultas = useQueryClient();
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [estudianteBuscador, establecerEstudianteBuscador] = useState('');
  const [estudianteSeleccionado, establecerEstudianteSeleccionado] = useState<inscripcionestudianteopcion | null>(null);
  const [mostrarResultadosEstudiante, establecerMostrarResultadosEstudiante] = useState(false);
  const [buscar, establecerbuscar] = useState('');
  const [cursofiltro, establecercursofiltro] = useState('');
  const [paralelofiltro, establecerparalelofiltro] = useState('');
  const [seleccionados, establecerseleccionados] = useState<string[]>([]);
  const [estadoseleccionado, establecerestadoseleccionado] = useState<inscripcionestado>('ACTIVE');
  const [resultadomasivo, establecerresultadomasivo] = useState<string | null>(null);

  const puedegestionar = ['ADMINISTRATIVE', 'SECRETARY'].includes(actualrol ?? '');
  const inscripcionesconsulta = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => gestion.listarinscripciones(),
  });
  const estudiantesconsulta = useQuery({
    queryKey: ['students'],
    queryFn: () => gestion.listarestudiantes(),
    enabled: puedegestionar,
  });
  const cursosconsulta = useQuery({
    queryKey: ['courses'],
    queryFn: () => gestion.listarcursos(),
    enabled: puedegestionar,
  });
  const gestionesconsulta = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => gestion.listaracademicogestiones(),
    enabled: puedegestionar,
  });

  const formulario = useForm<inscripcionformulariodatos>({
    resolver: zodResolver(inscripcionformularioesquema),
    defaultValues: { studentId: '', courseId: '', academicYearId: '', remarks: '' },
  });

  const crearmutacion = useMutation({
    mutationFn: (entrada: inscripcionformulariodatos) => gestion.crearinscripcion(entrada),
    onSuccess: () => {
      formulario.reset();
      establecermostrarformulario(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const actualizarmutacion = useMutation({
    mutationFn: ({ id, status: estado }: { id: string; status: inscripcionestado }) =>
      gestion.actualizarestado(id, estado),
    onSuccess: () => void clientedeconsultas.invalidateQueries({ queryKey: ['enrollments'] }),
  });
  const actualizarmasivamutacion = useMutation({
    mutationFn: ({ ids, status: estado }: { ids: string[]; status: inscripcionestado }) =>
      gestion.actualizarestadomultiple(ids, estado),
    onMutate: () => establecerresultadomasivo(null),
    onSuccess: (resultado) => {
      establecerseleccionados([]);
      const partes = [
        resultado.updatedCount > 0
          ? `${resultado.updatedCount} ${resultado.updatedCount === 1 ? 'matrícula actualizada' : 'matrículas actualizadas'} a ${estadoconfiguracion[estadoseleccionado].label.toLowerCase()}.`
          : '',
        resultado.unchangedCount > 0
          ? `${resultado.unchangedCount} ${resultado.unchangedCount === 1 ? 'ya estaba' : 'ya estaban'} en ese estado.`
          : '',
      ].filter(Boolean);
      establecerresultadomasivo(partes.join(' ') || 'La selección ya tenía el estado indicado.');
      void clientedeconsultas.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error: unknown) => {
      establecerresultadomasivo(
        `La operación completa fue rechazada; no se aplicaron cambios parciales. ${error instanceof Error ? error.message : 'No se pudo actualizar la selección.'}`,
      );
      void clientedeconsultas.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const estudiantesFiltrados = (estudiantesconsulta.data ?? []).filter((est) => {
    if (!estudianteBuscador.trim()) return false;
    const q = estudianteBuscador.toLowerCase().trim();
    const nombreCompleto = `${est.firstName} ${est.lastName}`.toLowerCase();
    const apellidosNombres = `${est.lastName} ${est.firstName}`.toLowerCase();
    const rude = est.rude?.toLowerCase() ?? '';
    return nombreCompleto.includes(q) || apellidosNombres.includes(q) || rude.includes(q);
  }).slice(0, 10);

  const seleccionarEstudiante = (est: inscripcionestudianteopcion) => {
    establecerEstudianteSeleccionado(est);
    establecerEstudianteBuscador('');
    establecerMostrarResultadosEstudiante(false);
    formulario.setValue('studentId', est.id);

    const ultimaInscripcion = inscripciones.find((ins) => ins.student.id === est.id);
    if (ultimaInscripcion) {
      formulario.setValue('courseId', ultimaInscripcion.course.id);
    }

    const gestionActiva = gestionesconsulta.data?.find((g) => g.year === 2026) || gestionesconsulta.data?.[0];
    if (gestionActiva) {
      formulario.setValue('academicYearId', gestionActiva.id);
    }
  };

  const inscripciones = inscripcionesconsulta.data ?? [];
  const filtradoinscripciones = inscripciones.filter((elemento) => {
    if (cursofiltro && nombrecursoagrupado(elemento.course.name, elemento.course.section) !== cursofiltro) return false;
    if (paralelofiltro && elemento.course.section !== paralelofiltro) return false;
    if (!buscar.trim()) return true;
    const termino = buscar.toLowerCase();
    return (
      elemento.student.firstName.toLowerCase().includes(termino) ||
      elemento.student.lastName.toLowerCase().includes(termino) ||
      elemento.student.rude.includes(termino) ||
      elemento.course.name.toLowerCase().includes(termino)
    );
  });
  const cursosdisponibles = [...new Set(
    inscripciones.map((elemento) => nombrecursoagrupado(elemento.course.name, elemento.course.section)),
  )].sort((a, b) => a.localeCompare(b, 'es'));
  const paralelosdisponibles = [...new Set(
    inscripciones
      .filter((elemento) => !cursofiltro || nombrecursoagrupado(elemento.course.name, elemento.course.section) === cursofiltro)
      .map((elemento) => elemento.course.section),
  )].sort((a, b) => a.localeCompare(b, 'es'));
  const idsfiltrados = filtradoinscripciones.map((elemento) => elemento.id);
  const todosseleccionados = idsfiltrados.length > 0 && idsfiltrados.every((id) => seleccionados.includes(id));
  const exportarseleccion = () => {
    const escapar = (valor: string) => `"${(/^[=+\-@\t\r]/.test(valor) ? "'" : '') + valor.replaceAll('"', '""')}"`;
    const filas = inscripciones.filter((elemento) => seleccionados.includes(elemento.id));
    const csv = [
      ['RUDE', 'Estudiante', 'Curso', 'Paralelo', 'Gestión', 'Estado'].join(','),
      ...filas.map((elemento) => [
        elemento.student.rude,
        `${elemento.student.lastName} ${elemento.student.firstName}`,
        cursoetiqueta(elemento.course.name),
        elemento.course.section,
        elemento.academicYear.name,
        estadoconfiguracion[estadoesquema.parse(elemento.status)].label,
      ].map(escapar).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'matriculas-seleccionadas.csv';
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Matrículas</h1>
          <p className="text-sm text-slate-500 mt-0.5">{inscripciones.length} inscripciones</p>
        </div>

        {puedegestionar && (
          <button
            type="button"
            onClick={() => establecermostrarformulario((anterior) => !anterior)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mostrarformulario ? 'Cerrar' : 'Registrar Matrícula'}
          </button>
        )}
      </div>

      {/* Form - Simplified */}
      {mostrarformulario && puedegestionar && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Matrícula</h2>

          <form
            onSubmit={formulario.handleSubmit((datos) => crearmutacion.mutate(datos))}
            className="space-y-4"
          >
            {(estudiantesconsulta.isError ||
              cursosconsulta.isError ||
              gestionesconsulta.isError) && (
              <p role="alert" className="text-sm text-rose-700">
                No se pudieron cargar los datos necesarios para registrar la matrícula.
              </p>
            )}
            {crearmutacion.isError && (
              <p role="alert" className="text-sm text-rose-700">
                {crearmutacion.error.message || 'No se pudo registrar la matrícula.'}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {estudianteSeleccionado ? (
                <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-lg bg-indigo-50/80 border border-indigo-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-600 text-white font-mono">
                        {estudianteSeleccionado.rude || 'RUDE'}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {estudianteSeleccionado.lastName} {estudianteSeleccionado.firstName}
                      </span>
                    </div>
                    {inscripciones.find((ins) => ins.student.id === estudianteSeleccionado.id) && (
                      <p className="text-xs text-indigo-700 mt-1">
                        Curso asignado sugerido:{' '}
                        <strong>
                          {cursoetiqueta(
                            inscripciones.find((ins) => ins.student.id === estudianteSeleccionado.id)!.course.name,
                          )}
                        </strong>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      establecerEstudianteSeleccionado(null);
                      formulario.setValue('studentId', '');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline ml-2 cursor-pointer"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <div className="relative sm:col-span-2">
                  <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                    <span>Buscar Estudiante (Nombre o RUDE)</span>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={estudianteBuscador}
                        onChange={(e) => {
                          establecerEstudianteBuscador(e.target.value);
                          establecerMostrarResultadosEstudiante(true);
                        }}
                        onFocus={() => establecerMostrarResultadosEstudiante(true)}
                        placeholder="Escribe apellido, nombre o RUDE para autocompletar..."
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      />
                    </div>
                  </label>
                  {mostrarResultadosEstudiante && estudiantesFiltrados.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {estudiantesFiltrados.map((est) => {
                        const inscripcionPrevia = inscripciones.find((ins) => ins.student.id === est.id);
                        return (
                          <button
                            key={est.id}
                            type="button"
                            onClick={() => seleccionarEstudiante(est)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="text-sm font-medium text-slate-800">
                                {est.lastName} {est.firstName}
                              </div>
                              {est.rude && <div className="text-xs font-mono text-slate-400">RUDE: {est.rude}</div>}
                            </div>
                            {inscripcionPrevia && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                {cursoetiqueta(inscripcionPrevia.course.name)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {formulario.formState.errors.studentId && (
                    <span className="text-xs text-rose-600 block mt-1">
                      {formulario.formState.errors.studentId.message}
                    </span>
                  )}
                </div>
              )}

              <SeleccionarCampo
                label="Curso"
                error={formulario.formState.errors.courseId?.message}
                {...formulario.register('courseId')}
              >
                <option value="">Seleccione curso...</option>
                <optgroup label="Inicial">
                  {(cursosconsulta.data ?? [])
                    .filter((c) => c.gradeLevel && c.gradeLevel <= 2)
                    .map((elemento) => (
                      <option key={elemento.id} value={elemento.id}>
                        {cursoetiqueta(elemento.name)} ({elemento.section || 'U'})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Primaria">
                  {(cursosconsulta.data ?? [])
                    .filter((c) => c.gradeLevel && c.gradeLevel >= 3 && c.gradeLevel <= 8)
                    .map((elemento) => (
                      <option key={elemento.id} value={elemento.id}>
                        {cursoetiqueta(elemento.name)} ({elemento.section || 'U'})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Secundaria">
                  {(cursosconsulta.data ?? [])
                    .filter((c) => !c.gradeLevel || c.gradeLevel >= 9)
                    .map((elemento) => (
                      <option key={elemento.id} value={elemento.id}>
                        {cursoetiqueta(elemento.name)} ({elemento.section || 'U'})
                      </option>
                    ))}
                </optgroup>
              </SeleccionarCampo>

              <SeleccionarCampo
                label="Gestión"
                error={formulario.formState.errors.academicYearId?.message}
                {...formulario.register('academicYearId')}
              >
                <option value="">Seleccione...</option>
                {(gestionesconsulta.data ?? []).map((elemento) => (
                  <option key={elemento.id} value={elemento.id}>
                    {elemento.name}
                  </option>
                ))}
              </SeleccionarCampo>

              <label className="grid gap-1.5 text-sm font-medium text-slate-700 sm:col-span-2 lg:col-span-4">
                <span>Observaciones</span>
                <input
                  {...formulario.register('remarks')}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="Opcional (ej: Alumno nuevo, pase de colegio, etc.)"
                />
              </label>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                <Boton
                  disabled={crearmutacion.isPending}
                  type="submit"
                  className="h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2"
                >
                  {crearmutacion.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </Boton>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search - Single row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={buscar}
            onChange={(e) => { establecerbuscar(e.target.value); establecerseleccionados([]); }}
            aria-label="Buscar matrículas por estudiante, RUDE o curso"
            placeholder="Buscar por estudiante, RUDE o curso..."
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
        <select aria-label="Filtrar matrículas por curso y nivel" value={cursofiltro} onChange={(evento) => { establecercursofiltro(evento.target.value); establecerparalelofiltro(''); establecerseleccionados([]); establecerresultadomasivo(null); }} className="h-10 max-w-72 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="">Todos los cursos</option>
          {cursosdisponibles.map((curso) => <option key={curso} value={curso}>{curso}</option>)}
        </select>
        <select aria-label="Filtrar por paralelo del curso seleccionado" value={paralelofiltro} onChange={(evento) => { establecerparalelofiltro(evento.target.value); establecerseleccionados([]); establecerresultadomasivo(null); }} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="">Todos los paralelos</option>
          {paralelosdisponibles.map((seccion) => <option key={seccion} value={seccion}>Paralelo {seccion}</option>)}
        </select>
        {seleccionados.length > 0 && <Boton type="button" variant="outline" size="sm" onClick={exportarseleccion}>Exportar {seleccionados.length} seleccionadas</Boton>}
        <span className="text-sm text-slate-500">{filtradoinscripciones.length} matrículas</span>
      </div>

      {seleccionados.length > 0 && puedegestionar && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <span className="text-sm font-medium text-slate-800">{seleccionados.length} seleccionadas</span>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Nuevo estado
            <select
              value={estadoseleccionado}
              onChange={(evento) => establecerestadoseleccionado(estadoesquema.parse(evento.target.value))}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800"
            >
              {Object.entries(estadoconfiguracion).map(([estado, configuracion]) => (
                <option key={estado} value={estado}>{configuracion.label}</option>
              ))}
            </select>
          </label>
          <Boton
            type="button"
            size="sm"
            disabled={actualizarmasivamutacion.isPending}
            onClick={() => actualizarmasivamutacion.mutate({ ids: seleccionados, status: estadoseleccionado })}
          >
            {actualizarmasivamutacion.isPending ? 'Actualizando…' : 'Actualizar seleccionadas'}
          </Boton>
          <button type="button" className="text-sm text-slate-500 underline underline-offset-2" onClick={() => establecerseleccionados([])}>
            Quitar selección
          </button>
        </div>
      )}
      {resultadomasivo && (
        <p role="status" className="text-sm text-slate-600">{resultadomasivo}</p>
      )}

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {inscripcionesconsulta.isLoading ? (
          <div role="status" className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando matrículas...</span>
          </div>
        ) : inscripcionesconsulta.isError ? (
          <div role="alert" className="p-12 text-center text-sm text-rose-600">
            No se pudieron cargar las matrículas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {actualizarmutacion.isError && (
              <p role="alert" className="m-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {actualizarmutacion.error.message || 'No se pudo actualizar el estado.'}
              </p>
            )}
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <th className="pl-4"><input type="checkbox" aria-label="Seleccionar todas las matrículas filtradas" checked={todosseleccionados} onChange={(evento) => establecerseleccionados(evento.target.checked ? idsfiltrados : [])} /></th>
                  <th className="py-3 pl-5 pr-3">Estudiante</th>
                  <th className="px-3 py-3">Curso</th>
                  <th className="px-3 py-3">Gestión</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="py-3 pl-3 pr-5 text-right">Actualizar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradoinscripciones.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-700">No hay matrículas</p>
                        <p className="text-sm text-slate-400">Registre una nueva matrícula.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtradoinscripciones.map((elemento) => {
                    const analizadoestado = estadoesquema.parse(elemento.status);
                    const configuracion = estadoconfiguracion[analizadoestado];
                    const iniciales =
                      `${elemento.student.firstName[0] ?? ''}${elemento.student.lastName[0] ?? ''}`.toUpperCase();

                    return (
                      <tr key={elemento.id} className="hover:bg-slate-50 transition-colors">
                        <td className="pl-4"><input type="checkbox" aria-label={`Seleccionar matrícula de ${elemento.student.firstName} ${elemento.student.lastName}`} checked={seleccionados.includes(elemento.id)} onChange={(evento) => establecerseleccionados((actual) => evento.target.checked ? [...actual, elemento.id] : actual.filter((id) => id !== elemento.id))} /></td>
                        <td className="py-3 pl-5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                              {iniciales}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {elemento.student.firstName} {elemento.student.lastName}
                              </p>
                              <span className="text-xs text-slate-400 font-mono">
                                RUDE: {elemento.student.rude}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {cursoetiqueta(elemento.course.name)}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-slate-600 font-mono text-xs">
                          {elemento.academicYear.name}
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${configuracion.badgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${configuracion.dotClass}`}
                            />
                            {configuracion.label}
                          </span>
                        </td>

                        <td className="py-3 pl-3 pr-5 text-right">
                          {puedegestionar && (
                            <select
                              value={elemento.status}
                              disabled={actualizarmutacion.isPending}
                              aria-label={`Cambiar estado de matrícula de ${elemento.student.firstName} ${elemento.student.lastName}`}
                              onChange={(evento) =>
                                actualizarmutacion.mutate({
                                  id: elemento.id,
                                  status: estadoesquema.parse(evento.target.value),
                                })
                              }
                              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            >
                              <option value="ACTIVE">Activa</option>
                              <option value="INACTIVE">Inactiva</option>
                              <option value="TRANSFERRED">Trasladada</option>
                              <option value="GRADUATED">Graduada</option>
                              <option value="WITHDRAWN">Retirada</option>
                            </select>
                          )}
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
    </div>
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
