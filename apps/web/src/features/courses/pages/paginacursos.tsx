import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { obtenierniveleducativoregular, gradomaximoregular } from '@academic/academic-domain';
import { BookOpen, Calendar, Loader2, Plus, Search, Users, X } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type { cursocatalogo } from '../application/catalogodecursos';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';

const cursoformularioesquema = z.object({
  academicYearId: z.string().uuid('Selecciona una gestión'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  gradeLevel: z.coerce.number().int().min(1).max(gradomaximoregular),
  section: z.string().min(1, 'La sección es obligatoria'),
  shift: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  maxCapacity: z.coerce.number().int().min(1).max(100),
});

type cursoformulariodatos = z.infer<typeof cursoformularioesquema>;

export const CursosPagina = ({
  catalog: catalogo,
  currentRole: actualrol,
}: {
  catalog: cursocatalogo;
  currentRole?: string;
}) => {
  const clientedeconsultas = useQueryClient();
  const [buscar, establecerbuscar] = useState('');
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [mostrarcreargestion, establecermostrarcreargestion] = useState(false);
  const [gestionano, establecergestionano] = useState(new Date().getFullYear());
  const [gestionnombre, establecergestionnombre] = useState(`Gestión ${new Date().getFullYear()}`);
  const [gestionfechainicio, establecergestionfechainicio] = useState(`${new Date().getFullYear()}-02-01`);
  const [gestionfechafin, establecergestionfechafin] = useState(`${new Date().getFullYear()}-11-30`);
  const [gestionerror, establecergestionerror] = useState<string | null>(null);

  const puedegestionar = ['ADMINISTRATIVE', 'SECRETARY'].includes(actualrol ?? '');
  const cursosconsulta = useQuery({
    queryKey: ['courses', buscar],
    queryFn: () => catalogo.listarcursos(buscar),
  });
  const gestionesconsulta = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => catalogo.listaracademicogestiones(),
  });

  const creargestionmutacion = useMutation({
    mutationFn: async () => {
      establecergestionerror(null);
      return catalogo.crearacademicogestion({
        year: Number(gestionano),
        name: gestionnombre.trim(),
        startDate: gestionfechainicio,
        endDate: gestionfechafin,
        isActive: true,
      });
    },
    onSuccess: () => {
      establecermostrarcreargestion(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['academic-years'] });
    },
    onError: (error: unknown) => {
      establecergestionerror(
        error instanceof Error ? error.message : 'Error al crear la gestión académica.',
      );
    },
  });

  const formulario = useForm<cursoformulariodatos>({
    resolver: zodResolver(cursoformularioesquema),
    defaultValues: {
      academicYearId: '',
      name: '',
      gradeLevel: 1,
      section: 'A',
      shift: 'MORNING',
      maxCapacity: 35,
    },
  });

  const crearmutacion = useMutation({
    mutationFn: (entrada: cursoformulariodatos) => catalogo.registrarcurso(entrada),
    onSuccess: () => {
      formulario.reset();
      establecermostrarformulario(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const [nivelfiltro, establecernivelfiltro] = useState<
    'ALL' | 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA'
  >('ALL');

  const cursos = (cursosconsulta.data?.data ?? []).filter((c) => {
    const nivel = obtenierniveleducativoregular(c.gradeLevel);
    if (nivelfiltro === 'INICIAL') return nivel === 'INITIAL';
    if (nivelfiltro === 'PRIMARIA') return nivel === 'PRIMARY';
    if (nivelfiltro === 'SECUNDARIA') return nivel === 'SECONDARY';
    return true;
  });
  const totalcantidad = (cursosconsulta.data?.data ?? []).length;
  const totalestudiantes = (cursosconsulta.data?.data ?? []).reduce(
    (acc, curriculo) => acc + (curriculo.enrollmentCount ?? 0),
    0,
  );

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cursos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {totalcantidad} cursos · {totalestudiantes} matriculados
          </p>
        </div>

        {puedegestionar && (
          <div className="flex items-center gap-2">
            <Boton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => establecermostrarcreargestion(true)}
              className="gap-1.5"
              title="Registrar una nueva gestión académica (RF-13)"
            >
              <Calendar className="w-4 h-4" />
              Nueva Gestión
            </Boton>
            <button
              type="button"
              onClick={() => establecermostrarformulario((anterior) => !anterior)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {mostrarformulario ? 'Cerrar' : 'Nuevo Curso'}
            </button>
          </div>
        )}
      </div>

      {/* Form - Simplified */}
      {mostrarformulario && puedegestionar && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Curso</h2>

          <form
            onSubmit={formulario.handleSubmit((datos) => crearmutacion.mutate(datos))}
            className="space-y-4"
          >
            {crearmutacion.isError && (
              <p role="alert" className="text-sm text-rose-700">
                {crearmutacion.error.message || 'No se pudo registrar el curso.'}
              </p>
            )}
            {gestionesconsulta.isError && (
              <p role="alert" className="text-sm text-rose-700">
                No se pudieron cargar las gestiones académicas.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Campo label="Gestión" error={formulario.formState.errors.academicYearId?.message}>
                <select
                  {...formulario.register('academicYearId')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Seleccione...</option>
                  {gestionesconsulta.data?.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} ({y.year})
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Nombre" error={formulario.formState.errors.name?.message}>
                <Entrada {...formulario.register('name')} placeholder="Ej. 1º de Secundaria" />
              </Campo>

              <Campo
                label={`Grado (1-${gradomaximoregular})`}
                error={formulario.formState.errors.gradeLevel?.message}
              >
                <Entrada
                  type="number"
                  {...formulario.register('gradeLevel')}
                  className="font-mono"
                />
              </Campo>

              <Campo label="Sección" error={formulario.formState.errors.section?.message}>
                <Entrada
                  {...formulario.register('section')}
                  placeholder="A"
                  className="font-mono uppercase"
                />
              </Campo>

              <Campo label="Turno" error={formulario.formState.errors.shift?.message}>
                <select
                  {...formulario.register('shift')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="MORNING">Mañana</option>
                  <option value="AFTERNOON">Tarde</option>
                  <option value="EVENING">Noche</option>
                </select>
              </Campo>

              <Campo label="Capacidad" error={formulario.formState.errors.maxCapacity?.message}>
                <Entrada
                  type="number"
                  {...formulario.register('maxCapacity')}
                  className="font-mono"
                />
              </Campo>
            </div>

            <div className="flex justify-end pt-2">
              <Boton
                disabled={crearmutacion.isPending}
                type="submit"
                className="h-10 px-5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2"
              >
                {crearmutacion.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar
              </Boton>
            </div>
          </form>
        </div>
      )}

      {/* Filters - Single row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {[
            { id: 'ALL', label: `Todos (${totalcantidad})` },
            { id: 'INICIAL', label: 'Inicial' },
            { id: 'PRIMARIA', label: 'Primaria' },
            { id: 'SECUNDARIA', label: 'Secundaria' },
          ].map((pestana) => (
            <button
              key={pestana.id}
              onClick={() =>
                establecernivelfiltro(pestana.id as 'ALL' | 'INICIAL' | 'PRIMARIA' | 'SECUNDARIA')
              }
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                nivelfiltro === pestana.id
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pestana.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Entrada
            value={buscar}
            onChange={(evento) => establecerbuscar(evento.target.value)}
            placeholder="Buscar curso..."
            className="pl-9 h-10 text-sm"
          />
          {buscar && (
            <button
              type="button"
              onClick={() => establecerbuscar('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Course Grid - Clean cards */}
      {cursosconsulta.isLoading ? (
        <div role="status" className="flex items-center justify-center p-16 text-slate-500 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando cursos...</span>
        </div>
      ) : cursosconsulta.isError ? (
        <div role="alert" className="p-12 text-center text-sm text-rose-600">
          No se pudieron cargar los cursos.
        </div>
      ) : cursos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-700">No hay cursos con estos filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => {
            const cantidad = curso.enrollmentCount ?? 0;
            const capacidad = curso.maxCapacity || 35;
            const porcentaje = Math.min(100, Math.round((cantidad / capacidad) * 100));
            const escompleto = cantidad >= capacidad;

            const nivel = obtenierniveleducativoregular(curso.gradeLevel);
            const niveletiqueta =
              nivel === 'INITIAL'
                ? 'Inicial'
                : nivel === 'PRIMARY'
                  ? 'Primaria'
                  : nivel === 'SECONDARY'
                    ? 'Secundaria'
                    : 'Grado por normalizar';

            return (
              <div
                key={curso.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 mb-1.5">
                      {niveletiqueta} · Grado {curso.gradeLevel}
                    </span>
                    <h2 className="font-semibold text-slate-900">{cursoetiqueta(curso.name)}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {curso.shift === 'MORNING'
                        ? 'Mañana'
                        : curso.shift === 'AFTERNOON'
                          ? 'Tarde'
                          : 'Noche'}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm font-mono shrink-0">
                    {curso.section}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Ocupación
                    </span>
                    <span className="font-mono font-medium text-slate-900">
                      {cantidad} / {capacidad}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        escompleto
                          ? 'bg-rose-500'
                          : porcentaje > 85
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100 text-slate-500">
                  <span>Paralelo {curso.section}</span>
                  <span
                    className={`font-medium ${escompleto ? 'text-rose-600' : 'text-emerald-600'}`}
                  >
                    {escompleto ? 'Completo' : `${capacidad - cantidad} plazas`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Nueva Gestión Académica (RF-13) */}
      {mostrarcreargestion && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-crear-gestion"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="titulo-crear-gestion" className="text-base font-bold text-slate-900">
                Nueva Gestión Académica (RF-13)
              </h2>
              <button
                type="button"
                onClick={() => establecermostrarcreargestion(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                creargestionmutacion.mutate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Año Calendario
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    required
                    value={gestionano}
                    onChange={(e) => {
                      const an = Number(e.target.value);
                      establecergestionano(an);
                      establecergestionnombre(`Gestión ${an}`);
                    }}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nombre Identificador
                  </label>
                  <input
                    type="text"
                    required
                    value={gestionnombre}
                    onChange={(e) => establecergestionnombre(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    required
                    value={gestionfechainicio}
                    onChange={(e) => establecergestionfechainicio(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fecha de Conclusión
                  </label>
                  <input
                    type="date"
                    required
                    value={gestionfechafin}
                    onChange={(e) => establecergestionfechafin(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              {gestionerror && (
                <p role="alert" className="text-xs text-rose-700">
                  {gestionerror}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => establecermostrarcreargestion(false)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  size="sm"
                  disabled={creargestionmutacion.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {creargestionmutacion.isPending ? 'Creando…' : 'Crear Gestión'}
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
