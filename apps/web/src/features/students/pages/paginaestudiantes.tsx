import { useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  Loader2,
  Plus,
  Search,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  KeyRound,
  FileText,
  Pencil,
  History,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type { gestionestudiante } from '../application/gestionestudiantes';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';

const estudianteformularioesquema = z.object({
  rude: z.string().trim().min(1, 'El código RUDE es obligatorio').max(40, 'El RUDE admite hasta 40 caracteres'),
  ci: z.string().trim().min(1, 'La cédula de identidad es obligatoria').max(30, 'El C.I. admite hasta 30 caracteres'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']),
  phone: z.string().optional(),
  parentId: z.string().optional(),
  relationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN', 'TUTOR', 'OTHER']).optional(),
});

type estudianteformulariodatos = z.infer<typeof estudianteformularioesquema>;

export const EstudiantesPagina = ({
  management: gestion,
  currentRole: actualrol,
}: {
  management: gestionestudiante;
  currentRole?: string;
}) => {
  const clientedeconsultas = useQueryClient();
  const [buscar, establecerbuscar] = useState('');
  const [cursoid, establecercursoid] = useState('');
  const [pagina, establecerpagina] = useState(1);
  const [paginatamano, establecerpaginatamano] = useState(50);
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [identificadoresconsulta, estableceridentificadoresconsulta] = useState({ rude: '', ci: '' });
  const [verificandoduplicados, establecerverificandoduplicados] = useState(false);
  const [errorverificacionduplicados, establecererrorverificacionduplicados] = useState<string | null>(null);
  const [copiadorude, establecercopiadorude] = useState<string | null>(null);
  const [eliminacionestudiante, establecereliminacionestudiante] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [activacionaviso, estableceractivacionaviso] = useState<{
    token: string;
    expiresAt: string;
    studentName: string;
  } | null>(null);
  const [activacioncopiarretroalimentacion, estableceractivacioncopiarretroalimentacion] = useState<
    string | null
  >(null);
  const [activacionerror, estableceractivacionerror] = useState<string | null>(null);
  const [documentoestudiante, establecerdocumentoestudiante] = useState<{
    id: string;
    name: string;
    rude: string;
    ci: string;
  } | null>(null);
  const [documentotipo, establecerdocumentotipo] = useState<
    'BIRTH_CERTIFICATE' | 'IDENTITY_DOCUMENT' | 'RUDE_FORM' | 'OTHER'
  >('BIRTH_CERTIFICATE');
  const [documentoreferencia, establecerdocumentoreferencia] = useState('');
  const [documentonotas, establecerdocumentonotas] = useState('');
  const [documentoerror, establecerdocumentoerror] = useState<string | null>(null);
  const [estudianteparaeditarci, establecerestudianteparaeditarci] = useState<{
    id: string;
    name: string;
    ci: string;
  } | null>(null);
  const [cieditada, establecercieditada] = useState('');
  const [errorci, establecererrorci] = useState<string | null>(null);
  const [historialestudiante, establecerhistorialestudiante] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const puedegestionar = actualrol === 'ADMINISTRATIVE' || actualrol === 'SECRETARY';

  const cursosconsulta = useQuery({
    queryKey: ['courses', 'student-filter'],
    queryFn: () => gestion.listarcursos(),
    enabled: puedegestionar,
  });

  const estudiantesconsulta = useQuery({
    queryKey: ['students', buscar, cursoid, pagina, paginatamano],
    queryFn: () =>
      gestion.listarestudiantes({
        search: buscar,
        courseId: cursoid || undefined,
        limit: paginatamano,
        offset: (pagina - 1) * paginatamano,
      }),
  });

  const familiaresconsulta = useQuery({
    queryKey: ['parents', 'lookup-options'],
    queryFn: () => gestion.listarfamiliares(300),
    enabled: puedegestionar,
  });

  const documentoreferenciasconsulta = useQuery({
    queryKey: ['student-documents', documentoestudiante?.id],
    queryFn: () => gestion.listarestudiantedocumentoreferencias(documentoestudiante!.id),
    enabled: Boolean(documentoestudiante && puedegestionar),
  });

  const historialconsulta = useQuery({
    queryKey: ['student-audit', historialestudiante?.id],
    queryFn: () => gestion.listarestudiantehistorial(historialestudiante!.id),
    enabled: Boolean(historialestudiante && puedegestionar),
  });

  const formulario = useForm<estudianteformulariodatos>({
    resolver: zodResolver(estudianteformularioesquema),
    defaultValues: {
      rude: '',
      ci: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: 'UNSPECIFIED',
      phone: '',
      parentId: '',
      relationship: 'TUTOR',
    },
  });

  const watchedRude = formulario.watch('rude')?.trim();
  const watchedCi = formulario.watch('ci')?.trim();
  useEffect(() => {
    const espera = setTimeout(() => estableceridentificadoresconsulta({ rude: watchedRude, ci: watchedCi }), 300);
    return () => clearTimeout(espera);
  }, [watchedRude, watchedCi]);

  const coincidenciasconsulta = useQuery({
    queryKey: ['student-duplicates', identificadoresconsulta],
    queryFn: () => gestion.buscarcoincidencias(identificadoresconsulta),
    enabled: mostrarformulario && puedegestionar && Boolean(identificadoresconsulta.rude || identificadoresconsulta.ci),
    retry: false,
    gcTime: 0,
  });
  const coincidenciasactuales = identificadoresconsulta.rude === watchedRude && identificadoresconsulta.ci === watchedCi
    ? coincidenciasconsulta.data ?? []
    : [];

  const crearmutacion = useMutation({
    mutationFn: (entrada: estudianteformulariodatos) => gestion.registrarestudiante(entrada),
    onSuccess: (resultado) => {
      estableceractivacionerror(null);
      estableceractivacionaviso({
        token: resultado.activationToken,
        expiresAt: resultado.activationExpiresAt,
        studentName: `${resultado.student.firstName} ${resultado.student.lastName}`,
      });
      formulario.reset();
      establecermostrarformulario(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['students'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
    },
  });

  const actualizarcimutacion = useMutation({
    mutationFn: () => {
      if (!estudianteparaeditarci) throw new Error('Selecciona un estudiante.');
      return gestion.actualizarci(estudianteparaeditarci.id, cieditada);
    },
    onSuccess: () => {
      establecerestudianteparaeditarci(null);
      establecererrorci(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: unknown) => {
      establecererrorci(error instanceof Error ? error.message : 'No se pudo actualizar el C.I.');
    },
  });

  const reemisionactivacionmutacion = useMutation({
    mutationFn: ({ id }: { id: string; name: string }) => gestion.reemisionestudianteactivacion(id),
    onSuccess: (resultado, variables) => {
      estableceractivacionerror(null);
      estableceractivacionaviso({
        token: resultado.activationToken,
        expiresAt: resultado.activationExpiresAt,
        studentName: variables.name,
      });
    },
    onError: () =>
      estableceractivacionerror(
        'No se pudo emitir el código. Verifica que el estudiante tenga una cuenta activa e inténtalo nuevamente.',
      ),
  });

  const creardocumentoreferenciamutacion = useMutation({
    mutationFn: () => {
      if (!documentoestudiante) throw new Error('Seleccione un estudiante.');
      return gestion.crearestudiantedocumentoreferencia(documentoestudiante.id, {
        documentType: documentotipo,
        reference: documentoreferencia.trim(),
        notes: documentonotas.trim() || undefined,
      });
    },
    onSuccess: () => {
      establecerdocumentoreferencia('');
      establecerdocumentonotas('');
      establecerdocumentoerror(null);
      void clientedeconsultas.invalidateQueries({
        queryKey: ['student-documents', documentoestudiante?.id],
      });
    },
    onError: (error: unknown) => {
      establecerdocumentoerror(
        error instanceof Error ? error.message : 'No se pudo guardar la referencia.',
      );
    },
  });

  const eliminarmutacion = useMutation({
    mutationFn: (id: string) => gestion.eliminarestudiante(id),
    onSuccess: () => {
      establecereliminacionestudiante(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['students'] });
    },
  });

  useEffect(() => {
    if (!eliminacionestudiante || eliminarmutacion.isPending) return;
    const cerraraldetectarescape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') establecereliminacionestudiante(null);
    };
    window.addEventListener('keydown', cerraraldetectarescape);
    return () => window.removeEventListener('keydown', cerraraldetectarescape);
  }, [eliminacionestudiante, eliminarmutacion.isPending]);

  const manejarcopiarrude = (rude: string) => {
    navigator.clipboard.writeText(rude);
    establecercopiadorude(rude);
    setTimeout(() => establecercopiadorude(null), 2000);
  };

  const manejarcopiaractivacioncodigo = async () => {
    if (!activacionaviso) return;
    try {
      await navigator.clipboard.writeText(activacionaviso.token);
      estableceractivacioncopiarretroalimentacion('Código copiado. Entrégalo de forma segura.');
    } catch {
      estableceractivacioncopiarretroalimentacion(
        'No se pudo copiar. Selecciona el código para copiarlo manualmente.',
      );
    }
  };

  const manejarcopiaractivacionenlace = async () => {
    if (!activacionaviso) return;
    const enlace = new URL('/student/activate', window.location.origin);
    enlace.hash = new URLSearchParams({ codigo: activacionaviso.token }).toString();
    try {
      await navigator.clipboard.writeText(enlace.toString());
      estableceractivacioncopiarretroalimentacion('Enlace copiado. Compártelo solo con el estudiante o su tutor verificado.');
    } catch {
      estableceractivacioncopiarretroalimentacion('No se pudo copiar el enlace. Usa el código de activación.');
    }
  };

  const estudiantes = estudiantesconsulta.data?.data ?? [];
  const totalcantidad = estudiantesconsulta.data?.total ?? estudiantes.length;
  const totalpaginas = Math.max(1, Math.ceil(totalcantidad / paginatamano));

  return (
    <div className="space-y-5">
      {/* Header - Clean and minimal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Estudiantes</h1>
          <p className="text-sm text-slate-500 mt-0.5">{totalcantidad} registrados</p>
        </div>

        {puedegestionar && (
          <button
            type="button"
            onClick={() => establecermostrarformulario((anterior) => !anterior)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            {mostrarformulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {mostrarformulario ? 'Cerrar' : 'Nuevo Estudiante'}
          </button>
        )}
      </div>

      {activacionaviso && (
        <section
          aria-labelledby="activation-code-title"
          aria-live="polite"
          className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 id="activation-code-title" className="text-base font-semibold">
                Código para activar a {activacionaviso.studentName}
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                Vence el {new Date(activacionaviso.expiresAt).toLocaleString('es-BO')}.
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-700">
                Puedes entregar un enlace de activación al estudiante o a su tutor verificado.
                Se muestra una sola vez; si se pierde, emite uno nuevo.
              </p>
              <code
                className="mt-3 block select-all break-all rounded-lg border border-amber-300 bg-white p-3 font-mono text-sm"
                aria-label="Código de activación de un solo uso"
              >
                {activacionaviso.token}
              </code>
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col">
              <Boton
                type="button"
                variant="outline"
                onClick={() => void manejarcopiaractivacioncodigo()}
                className="gap-2 border-slate-400 bg-white"
              >
                <Copy aria-hidden="true" className="h-4 w-4" /> Copiar código
              </Boton>
              <Boton
                type="button"
                variant="outline"
                onClick={() => void manejarcopiaractivacionenlace()}
                className="gap-2 border-slate-400 bg-white"
              >
                <Copy aria-hidden="true" className="h-4 w-4" /> Copiar enlace
              </Boton>
              <Boton
                type="button"
                variant="outline"
                onClick={() => {
                  estableceractivacionaviso(null);
                  estableceractivacioncopiarretroalimentacion(null);
                }}
                className="border-slate-400 bg-white"
              >
                Cerrar
              </Boton>
            </div>
          </div>
          {activacioncopiarretroalimentacion && (
            <p role="status" className="mt-3 text-sm text-slate-800">
              {activacioncopiarretroalimentacion}
            </p>
          )}
        </section>
      )}
      {activacionerror && (
        <p
          role="alert"
          className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {activacionerror}
        </p>
      )}

      {/* Form - Simplified */}
      {mostrarformulario && puedegestionar && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Registrar Estudiante</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete los datos del alumno y, opcionalmente, vincúlelo a un familiar o tutor
                registrado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => establecermostrarformulario(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              title="Cerrar formulario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={formulario.handleSubmit(async (datos) => {
              establecererrorverificacionduplicados(null);
              establecerverificandoduplicados(true);
              const identificadores = { rude: datos.rude.trim(), ci: datos.ci.trim() };
              try {
                const coincidencias = await gestion.buscarcoincidencias(identificadores);
                clientedeconsultas.setQueryData(['student-duplicates', identificadores], coincidencias);
                estableceridentificadoresconsulta(identificadores);
                if (!coincidencias.length) crearmutacion.mutate(datos);
              } catch {
                establecererrorverificacionduplicados('No se pudo comprobar si el estudiante ya está registrado. Inténtalo de nuevo.');
              } finally {
                establecerverificandoduplicados(false);
              }
            })}
            className="space-y-5"
          >
            {coincidenciasactuales.length > 0 && (
              <div
                role="alert"
                className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong>Ya hay estudiantes con ese RUDE o C.I.:</strong>
                  <ul>
                    {coincidenciasactuales.map((estudiante) => (
                      <li key={estudiante.id}>
                        {estudiante.lastName}, {estudiante.firstName} · RUDE: {estudiante.rude} · C.I.: {estudiante.ci}
                        {estudiante.deletedAt || !estudiante.isActive ? ' (registro inactivo)' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {coincidenciasconsulta.isError && identificadoresconsulta.rude === watchedRude && identificadoresconsulta.ci === watchedCi && (
              <p role="status" className="text-sm text-rose-700">No se pudieron consultar las coincidencias. Se volverá a comprobar al guardar.</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Campo label="Código RUDE" error={formulario.formState.errors.rude?.message}>
                <Entrada
                  {...formulario.register('rude')}
                  placeholder="819811912026..."
                  className="font-mono text-sm"
                />
              </Campo>

              <Campo label="C.I." error={formulario.formState.errors.ci?.message}>
                <Entrada
                  {...formulario.register('ci')}
                  placeholder="6849204"
                  className="font-mono text-sm"
                />
                <span className="text-xs text-slate-500">Registra el número que figura en el documento de identidad del estudiante.</span>
              </Campo>

              <Campo label="Nombres" error={formulario.formState.errors.firstName?.message}>
                <Entrada {...formulario.register('firstName')} placeholder="Nombres del alumno" />
              </Campo>

              <Campo label="Apellidos" error={formulario.formState.errors.lastName?.message}>
                <Entrada {...formulario.register('lastName')} placeholder="Apellidos" />
              </Campo>

              <Campo
                label="Fecha de Nacimiento"
                error={formulario.formState.errors.birthDate?.message}
              >
                <Entrada type="date" {...formulario.register('birthDate')} />
              </Campo>

              <Campo label="Género" error={formulario.formState.errors.gender?.message}>
                <select
                  {...formulario.register('gender')}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                  <option value="UNSPECIFIED">No especificado</option>
                </select>
              </Campo>

              <Campo
                label="Teléfono de Contacto"
                error={formulario.formState.errors.phone?.message}
              >
                <Entrada {...formulario.register('phone')} placeholder="Opcional" />
              </Campo>
            </div>

            {/* Parent Association Section */}
            <div className="pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      Emparentar con Familiar / Tutor
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                      Opcional
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {familiaresconsulta.isLoading
                      ? 'Cargando familiares...'
                      : `${familiaresconsulta.data?.data?.length ?? 0} familiares disponibles`}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  <Campo
                    label="Familiar / Tutor Registrado"
                    error={formulario.formState.errors.parentId?.message}
                  >
                    <select
                      {...formulario.register('parentId')}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      <option value="">
                        -- Sin vincular (registrar sin familiar por ahora) --
                      </option>
                      {(familiaresconsulta.data?.data ?? []).map((familiar) => (
                        <option key={familiar.id} value={familiar.id}>
                          {familiar.lastName} {familiar.firstName} — C.I.: {familiar.ci}{' '}
                          {familiar.phone ? `(${familiar.phone})` : ''}
                        </option>
                      ))}
                    </select>
                  </Campo>

                  <Campo
                    label="Parentesco con el Estudiante"
                    error={formulario.formState.errors.relationship?.message}
                  >
                    <select
                      {...formulario.register('relationship')}
                      disabled={!formulario.watch('parentId')}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 disabled:bg-slate-100"
                    >
                      <option value="TUTOR">Tutor / Apoderado General</option>
                      <option value="FATHER">Padre</option>
                      <option value="MOTHER">Madre</option>
                      <option value="GUARDIAN">Tutor Legal / Apoderado</option>
                      <option value="OTHER">Otro Familiar</option>
                    </select>
                  </Campo>
                </div>

                <p className="text-xs text-slate-500">
                  Al asociar un familiar, este podrá consultar en tiempo real las calificaciones, el
                  horario y la asistencia de su hijo desde su cuenta de familiar.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Boton
                type="button"
                variant="outline"
                onClick={() => establecermostrarformulario(false)}
                className="h-10 text-sm"
              >
                Cancelar
              </Boton>
              <Boton
                disabled={crearmutacion.isPending || verificandoduplicados}
                type="submit"
                className="h-10 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium gap-2 px-6"
              >
                {crearmutacion.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar Estudiante
              </Boton>
            </div>

            {errorverificacionduplicados && <p role="alert" className="text-sm text-rose-700">{errorverificacionduplicados}</p>}

            {crearmutacion.isError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No se pudo registrar. Verifique que el RUDE o C.I. no existan.</span>
              </div>
            )}
          </form>
        </div>

      )}

      {/* Search and Filters - Single row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Entrada
            value={buscar}
            onChange={(evento) => {
              establecerbuscar(evento.target.value);
              establecerpagina(1);
            }}
            placeholder="Buscar por nombre, RUDE o cédula..."
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

        {puedegestionar && (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            Curso
            <select
              value={cursoid}
              onChange={(evento) => { establecercursoid(evento.target.value); establecerpagina(1); }}
              className="h-10 max-w-72 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Todos los cursos</option>
              {(cursosconsulta.data ?? []).map((curso) => (
                <option key={curso.id} value={curso.id}>{cursoetiqueta(curso.name)}</option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Mostrar:</span>
          <select
            value={paginatamano}
            onChange={(e) => {
              establecerpaginatamano(Number(e.target.value));
              establecerpagina(1);
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={1000}>Todos</option>
          </select>
        </div>
      </div>

      {/* Table - Clean */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {estudiantesconsulta.isLoading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando estudiantes...</span>
          </div>
        ) : estudiantesconsulta.isError ? (
          <div className="p-12 text-center text-sm text-rose-600">
            No se pudo conectar con el servidor.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    <th className="py-3 pl-5 pr-3">Estudiante</th>
                    <th className="px-3 py-3">RUDE</th>
                    <th className="px-3 py-3">C.I.</th>
                    <th className="px-3 py-3">Curso</th>
                    <th className="px-3 py-3">Familiar / Tutor</th>
                    <th className="px-3 py-3">Estado</th>
                    {puedegestionar && <th className="py-3 pl-3 pr-5 text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estudiantes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={puedegestionar ? 7 : 6}
                        className="py-16 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="font-medium text-slate-700">
                            No se encontraron estudiantes
                          </p>
                          <p className="text-sm text-slate-400">
                            Intente con otros términos de búsqueda.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    estudiantes.map((estudiante) => {
                      const iniciales =
                        `${estudiante.firstName[0] ?? ''}${estudiante.lastName[0] ?? ''}`.toUpperCase();
                      return (
                        <tr key={estudiante.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs">
                                {iniciales}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">
                                  {estudiante.firstName} {estudiante.lastName}
                                </p>
                                <span className="text-xs text-slate-400">
                                  {estudiante.gender === 'MALE'
                                    ? 'Varón'
                                    : estudiante.gender === 'FEMALE'
                                      ? 'Mujer'
                                      : 'No especificado'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-mono text-slate-700">{estudiante.rude}</span>
                              <button
                                type="button"
                                onClick={() => manejarcopiarrude(estudiante.rude)}
                                className="text-slate-400 hover:text-slate-600"
                                title="Copiar RUDE"
                              >
                                {copiadorude === estudiante.rude ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-3 font-mono text-slate-600">{estudiante.ci || '—'}</td>

                          <td className="px-3 py-3">
                            {estudiante.enrollments?.[0]?.course ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                {cursoetiqueta(estudiante.enrollments[0].course.name)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Sin matrícula</span>
                            )}
                          </td>

                          <td className="px-3 py-3">
                            {estudiante.parents && estudiante.parents.length > 0 ? (
                              <div>
                                <p className="font-medium text-slate-800 text-xs">
                                  {estudiante.parents[0].parent.lastName}{' '}
                                  {estudiante.parents[0].parent.firstName}
                                </p>
                                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                  {estudiante.parents[0].relationship === 'FATHER' ||
                                  estudiante.parents[0].relationship === 'PADRE'
                                    ? 'Padre'
                                    : estudiante.parents[0].relationship === 'MOTHER' ||
                                        estudiante.parents[0].relationship === 'MADRE'
                                      ? 'Madre'
                                      : estudiante.parents[0].relationship === 'GUARDIAN'
                                        ? 'Apoderado'
                                        : estudiante.parents[0].relationship === 'TUTOR'
                                          ? 'Tutor'
                                          : 'Familiar'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Sin vincular</span>
                            )}
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                estudiante.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${estudiante.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                              />
                              {estudiante.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                          {puedegestionar && (
                            <td className="py-3 pl-3 pr-5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  establecerestudianteparaeditarci({
                                    id: estudiante.id,
                                    name: `${estudiante.firstName} ${estudiante.lastName}`,
                                    ci: estudiante.ci,
                                  });
                                  establecercieditada(estudiante.ci);
                                  establecererrorci(null);
                                  actualizarcimutacion.reset();
                                }}
                                className="mr-1 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                aria-label={`Editar C.I. de ${estudiante.firstName} ${estudiante.lastName}`}
                                title="Editar C.I."
                              >
                                <Pencil aria-hidden="true" className="h-4 w-4" />
                                Editar C.I.
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  establecerdocumentoestudiante({
                                    id: estudiante.id,
                                    name: `${estudiante.firstName} ${estudiante.lastName}`,
                                    rude: estudiante.rude,
                                    ci: estudiante.ci,
                                  });
                                  establecerdocumentoerror(null);
                                }}
                                className="mr-1 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                aria-label={`Ver referencias documentales de ${estudiante.firstName} ${estudiante.lastName}`}
                              >
                                <FileText aria-hidden="true" className="h-4 w-4" />
                                Documentos
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  establecerhistorialestudiante({
                                    id: estudiante.id,
                                    name: `${estudiante.firstName} ${estudiante.lastName}`,
                                  });
                                }}
                                className="mr-1 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                aria-label={`Ver historial de cambios de ${estudiante.firstName} ${estudiante.lastName}`}
                                title="Historial de cambios y trazabilidad (RU-ADM-07)"
                              >
                                <History aria-hidden="true" className="h-4 w-4" />
                                Historial
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  reemisionactivacionmutacion.mutate({
                                    id: estudiante.id,
                                    name: `${estudiante.firstName} ${estudiante.lastName}`,
                                  })
                                }
                                disabled={reemisionactivacionmutacion.isPending}
                                className="mr-1 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
                                aria-label={`Emitir un nuevo código de activación para ${estudiante.firstName} ${estudiante.lastName}`}
                              >
                                <KeyRound aria-hidden="true" className="h-4 w-4" />
                                Activación
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  eliminarmutacion.reset();
                                  establecereliminacionestudiante({
                                    id: estudiante.id,
                                    name: `${estudiante.firstName} ${estudiante.lastName}`,
                                  });
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                aria-label={`Dar de baja al estudiante ${estudiante.firstName} ${estudiante.lastName}`}
                                title="Eliminar estudiante (Baja lógica)"
                              >
                                <Trash2 aria-hidden="true" className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 text-sm">
              <span className="text-slate-500">
                Mostrando{' '}
                <strong className="text-slate-900">
                  {totalcantidad === 0 ? 0 : (pagina - 1) * paginatamano + 1} -{' '}
                  {Math.min(pagina * paginatamano, totalcantidad)}
                </strong>{' '}
                de <strong className="text-slate-900">{totalcantidad}</strong>
              </span>

              {totalpaginas > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => establecerpagina((p) => Math.max(1, p - 1))}
                    disabled={pagina <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-sm font-mono font-medium text-slate-700">
                    {pagina} / {totalpaginas}
                  </span>

                  <button
                    type="button"
                    onClick={() => establecerpagina((p) => Math.min(totalpaginas, p + 1))}
                    disabled={pagina >= totalpaginas}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium disabled:opacity-40 hover:bg-slate-50"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL: CONFIRMAR BAJA LÓGICA (SOFT DELETE) */}
      {eliminacionestudiante && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-delete-title"
            className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 id="student-delete-title" className="text-base font-bold text-slate-900">
              ¿Eliminar Estudiante?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Está a punto de dar de baja al estudiante{' '}
              <strong className="text-slate-900">{eliminacionestudiante.name}</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-xs text-amber-800 leading-relaxed">
              <strong>Baja Lógica (Soft Delete):</strong> El registro quedará archivado y la cuenta
              de usuario vinculada será desactivada automáticamente, garantizando la preservación
              del historial de calificaciones y asistencias.
            </div>

            {eliminarmutacion.isError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                No se pudo dar de baja al estudiante. Inténtalo nuevamente.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-5">
              <Boton
                type="button"
                variant="outline"
                autoFocus
                onClick={() => {
                  eliminarmutacion.reset();
                  establecereliminacionestudiante(null);
                }}
                disabled={eliminarmutacion.isPending}
              >
                Cancelar
              </Boton>
              <Boton
                type="button"
                onClick={() => eliminarmutacion.mutate(eliminacionestudiante.id)}
                disabled={eliminarmutacion.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {eliminarmutacion.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Eliminando...
                  </>
                ) : (
                  'Confirmar Eliminación'
                )}
              </Boton>
            </div>
          </div>
        </div>
      )}
      {estudianteparaeditarci && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-ci-estudiante"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2 id="titulo-editar-ci-estudiante" className="text-base font-semibold text-slate-900">
              Editar cédula de identidad
            </h2>
            <p className="mt-1 text-sm text-slate-600">{estudianteparaeditarci.name}</p>
            <form
              className="mt-4 space-y-4"
              onSubmit={(evento) => {
                evento.preventDefault();
                if (!/^\d{7}$/.test(cieditada.trim())) {
                  establecererrorci('Ingresa los 7 dígitos del C.I.');
                  return;
                }
                actualizarcimutacion.mutate();
              }}
            >
              <label htmlFor="ci-estudiante-editar" className="grid gap-1.5 text-sm font-medium text-slate-700">
                C.I. (7 dígitos)
                <Entrada
                  id="ci-estudiante-editar"
                  value={cieditada}
                  onChange={(evento) => establecercieditada(evento.target.value.replace(/\D/g, '').slice(0, 7))}
                  inputMode="numeric"
                  maxLength={7}
                  aria-describedby={errorci ? 'error-editar-ci-estudiante' : undefined}
                  autoFocus
                />
              </label>
              {errorci && <p id="error-editar-ci-estudiante" role="alert" className="text-sm text-rose-700">{errorci}</p>}
              <div className="flex justify-end gap-2">
                <Boton type="button" variant="outline" onClick={() => establecerestudianteparaeditarci(null)} disabled={actualizarcimutacion.isPending}>
                  Cancelar
                </Boton>
                <Boton type="submit" disabled={actualizarcimutacion.isPending || cieditada.length !== 7}>
                  {actualizarcimutacion.isPending ? 'Guardando…' : 'Guardar C.I.'}
                </Boton>
              </div>
            </form>
          </section>
        </div>
      )}
      {documentoestudiante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-documents-title"
            className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="student-documents-title" className="text-base font-semibold text-slate-900">
                  Referencias documentales
                </h2>
                <p className="mt-1 text-sm text-slate-600">{documentoestudiante.name}</p>
                <p className="mt-1 text-xs text-slate-600">
                  RUDE: <span className="font-mono">{documentoestudiante.rude}</span> · C.I.: <span className="font-mono">{documentoestudiante.ci}</span>
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => establecerdocumentoestudiante(null)}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              className="mt-4 grid gap-3 sm:grid-cols-2"
              onSubmit={(evento) => {
                evento.preventDefault();
                creardocumentoreferenciamutacion.mutate();
              }}
            >
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Tipo de documento
                <select
                  value={documentotipo}
                  onChange={(evento) =>
                    establecerdocumentotipo(evento.target.value as typeof documentotipo)
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="BIRTH_CERTIFICATE">Certificado de nacimiento</option>
                  <option value="IDENTITY_DOCUMENT">Documento de identidad</option>
                  <option value="RUDE_FORM">Formulario RUDE</option>
                  <option value="OTHER">Otro</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Código o ubicación de referencia
                <input
                  id="referencia-documento-estudiante"
                  required
                  minLength={2}
                  maxLength={500}
                  value={documentoreferencia}
                  onChange={(evento) => establecerdocumentoreferencia(evento.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Código de archivo o ubicación institucional"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
                Observaciones
                <textarea
                  maxLength={500}
                  rows={2}
                  value={documentonotas}
                  onChange={(evento) => establecerdocumentonotas(evento.target.value)}
                  className="resize-y rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              {documentoerror && (
                <p role="alert" className="text-sm text-rose-700 sm:col-span-2">
                  {documentoerror}
                </p>
              )}
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => establecerdocumentoestudiante(null)}
                >
                  Cerrar
                </Boton>
                <Boton
                  type="submit"
                  disabled={
                    creardocumentoreferenciamutacion.isPending ||
                    documentoreferencia.trim().length < 2
                  }
                >
                  {creardocumentoreferenciamutacion.isPending
                    ? 'Guardando…'
                    : 'Registrar referencia'}
                </Boton>
              </div>
            </form>
            <div className="mt-5 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-slate-800">Referencias registradas</h3>
              <p className="mt-1 text-xs text-slate-500">Al registrar una nueva referencia del mismo tipo, pasa a ser la vigente. La anterior se conserva en el historial.</p>
              {documentoreferenciasconsulta.isLoading ? (
                <p className="mt-2 text-sm text-slate-500">Cargando…</p>
              ) : documentoreferenciasconsulta.isError ? (
                <p role="alert" className="mt-2 text-sm text-rose-700">
                  No se pudieron cargar las referencias.
                </p>
              ) : documentoreferenciasconsulta.data?.length ? (
                <ul className="mt-2 divide-y divide-slate-100">
                  {documentoreferenciasconsulta.data.map((referencia, indice, todas) => {
                    const esdemo = referencia.reference.startsWith('MUESTRA FICTICIA ');
                    const espendiente = referencia.reference === 'Pendiente de adjuntar copia digital';
                    const esvigente = todas.findIndex((item) => item.documentType === referencia.documentType) === indice;
                    const etiqueta = esdemo ? 'Muestra ficticia' : espendiente ? 'Pendiente' : esvigente ? 'Vigente' : 'Anterior';
                    const color = esdemo ? 'bg-violet-50 text-violet-800' : espendiente ? 'bg-amber-50 text-amber-800' : esvigente ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500';
                    return (
                      <li key={referencia.id} className="py-2 text-sm">
                        <p className="font-medium text-slate-800">
                          {{
                            BIRTH_CERTIFICATE: 'Certificado de nacimiento',
                            IDENTITY_DOCUMENT: 'Documento de identidad',
                            RUDE_FORM: 'Formulario RUDE',
                            OTHER: 'Otro',
                          }[referencia.documentType]}{' '}
                          — {referencia.reference}
                          <span className={`ml-2 rounded px-1.5 py-0.5 text-xs ${color}`}>
                            {etiqueta}
                          </span>
                          {esvigente && (
                            <button type="button" className="ml-2 text-xs font-medium text-brand-700 underline underline-offset-2" onClick={() => {
                              establecerdocumentotipo(referencia.documentType);
                              establecerdocumentoreferencia('');
                              establecerdocumentonotas('');
                              document.getElementById('referencia-documento-estudiante')?.focus();
                            }}>{espendiente ? 'Actualizar referencia' : 'Reemplazar referencia'}</button>
                          )}
                        </p>
                        {esdemo && <p className="mt-0.5 text-xs font-medium text-violet-800">Dato de prueba inventado. No es un certificado real ni una copia digital adjunta.</p>}
                        {referencia.notes && <p className="mt-0.5 text-xs text-slate-600">{referencia.notes}</p>}
                        <p className="mt-0.5 text-xs text-slate-400">
                          Registró {referencia.createdBy.firstName} {referencia.createdBy.lastName} ·{' '}
                          {new Date(referencia.createdAt).toLocaleString()}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No hay referencias registradas.</p>
              )}
            </div>
          </section>
        </div>
      )}
      {historialestudiante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-historial-estudiante"
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 id="titulo-historial-estudiante" className="text-base font-bold text-slate-900">
                  Historial de Cambios y Trazabilidad (RU-ADM-07)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{historialestudiante.name}</p>
              </div>
              <button
                type="button"
                onClick={() => establecerhistorialestudiante(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 py-4 space-y-3">
              {historialconsulta.isLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs">Cargando bitácora de auditoría...</span>
                </div>
              ) : (historialconsulta.data?.length ?? 0) === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No se registran cambios auditados para este estudiante.
                </p>
              ) : (
                historialconsulta.data?.map((registro) => {
                  const accionColor =
                    registro.action === 'CREATE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : registro.action === 'UPDATE'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <div
                      key={registro.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold border ${accionColor}`}
                          >
                            {registro.action}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {registro.entity}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono">
                          {new Date(registro.createdAt).toLocaleString('es-BO')}
                        </span>
                      </div>

                      {registro.reason && (
                        <p className="text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                          <strong>Motivo:</strong> {registro.reason}
                        </p>
                      )}

                      {(registro.previousValue != null || registro.newValue != null) && (
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                          {registro.previousValue != null && (
                            <div className="bg-rose-50/60 p-2 rounded border border-rose-100 text-rose-900 overflow-x-auto">
                              <span className="font-sans font-semibold block text-[10px] text-rose-700 mb-1">
                                Valor anterior:
                              </span>
                              <pre className="whitespace-pre-wrap break-all">
                                {typeof registro.previousValue === 'object'
                                  ? JSON.stringify(registro.previousValue, null, 2)
                                  : String(registro.previousValue)}
                              </pre>
                            </div>
                          )}
                          {registro.newValue != null && (
                            <div className="bg-emerald-50/60 p-2 rounded border border-emerald-100 text-emerald-900 overflow-x-auto">
                              <span className="font-sans font-semibold block text-[10px] text-emerald-700 mb-1">
                                Valor nuevo:
                              </span>
                              <pre className="whitespace-pre-wrap break-all">
                                {typeof registro.newValue === 'object'
                                  ? JSON.stringify(registro.newValue, null, 2)
                                  : String(registro.newValue)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Boton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => establecerhistorialestudiante(null)}
              >
                Cerrar
              </Boton>
            </div>
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
