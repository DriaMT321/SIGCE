import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AlertCircle,
  ContactRound,
  GraduationCap,
  KeyRound,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import { Insignia } from '../../../components/ui/insignia';
import {
  escontrasenavalida,
  gestionusuario,
  mensajedecontrasenainvalida,
} from '../application/gestionusuarios';

const usuarioformularioesquema = z
  .object({
    email: z.string().email('Ingrese un correo electrónico válido'),
    password: z.string().refine(escontrasenavalida, {
      message: mensajedecontrasenainvalida,
    }),
    firstName: z.string().min(1, 'El nombre es obligatorio'),
    lastName: z.string().min(1, 'El apellido es obligatorio'),
    role: z.enum(['SECRETARY', 'TEACHER', 'PARENT'], {
      errorMap: () => ({ message: 'Seleccione un rol válido' }),
    }),
    ci: z.string().optional(),
    phone: z.string().optional(),
    specialty: z.string().optional(),
    itemNumber: z.string().optional(),
    address: z.string().optional(),
    occupation: z.string().optional(),
  })
  .superRefine((entrada, contexto) => {
    if (entrada.role === 'TEACHER') {
      if (!entrada.ci?.trim()) {
        contexto.addIssue({ code: 'custom', path: ['ci'], message: 'La cédula es obligatoria' });
      }
      if (!entrada.specialty?.trim()) {
        contexto.addIssue({
          code: 'custom',
          path: ['specialty'],
          message: 'La especialidad es obligatoria',
        });
      }
    }
    if (entrada.role === 'PARENT') {
      if (!entrada.ci?.trim()) {
        contexto.addIssue({ code: 'custom', path: ['ci'], message: 'La cédula es obligatoria' });
      }
      if (!entrada.phone?.trim()) {
        contexto.addIssue({
          code: 'custom',
          path: ['phone'],
          message: 'El teléfono es obligatorio',
        });
      }
    }
  });

type usuarioformulariodatos = z.infer<typeof usuarioformularioesquema>;

const constanterolpestanas = [
  { id: 'ALL', label: 'Todos los Roles' },
  { id: 'ADMINISTRATIVE', label: 'Administración y Dirección' },
  { id: 'SECRETARY', label: 'Secretaría' },
  { id: 'TEACHER', label: 'Docentes' },
  { id: 'PARENT', label: 'Padres / Tutores' },
  { id: 'STUDENT', label: 'Estudiantes' },
];

export const UsuariosPagina = ({
  management: gestion,
  currentUser: actualusuario,
}: {
  management: gestionusuario;
  currentUser?: { id: string; role: string } | null;
}) => {
  const clientedeconsultas = useQueryClient();
  const [buscar, establecerbuscar] = useState('');
  const [rolfiltro, establecerrolfiltro] = useState('ALL');
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [errormensaje, establecererrormensaje] = useState<string | null>(null);
  const [errorestadousuario, establecererrorestadousuario] = useState<string | null>(null);
  const [restablecerobjetivo, establecerrestablecerobjetivo] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [restablecercontrasena, establecerrestablecercontrasena] = useState('');
  const [restablecercontrasenaconfirmacion, establecerrestablecercontrasenaconfirmacion] =
    useState('');
  const [restablecererror, establecerrestablecererror] = useState<string | null>(null);
  const [restablecerexito, establecerrestablecerexito] = useState<string | null>(null);

  const puedegestionar = actualusuario?.role === 'ADMINISTRATIVE';

  const usuariosconsulta = useQuery({
    queryKey: ['users', rolfiltro, buscar],
    queryFn: () =>
      gestion.listarusuarios({
        role: rolfiltro !== 'ALL' ? rolfiltro : undefined,
        search: buscar || undefined,
        limit: 100,
      }),
  });

  const formulario = useForm<usuarioformulariodatos>({
    resolver: zodResolver(usuarioformularioesquema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'TEACHER',
      ci: '',
      phone: '',
      specialty: '',
      itemNumber: '',
      address: '',
      occupation: '',
    },
  });

  const seleccionadorol = formulario.watch('role');

  const crearmutacion = useMutation({
    mutationFn: (entrada: usuarioformulariodatos) => gestion.crearusuario(entrada),
    onSuccess: () => {
      formulario.reset();
      establecermostrarformulario(false);
      establecererrormensaje(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['teachers'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
    },
    onError: (error: unknown) => {
      const mensaje = error instanceof Error ? error.message : 'No se pudo crear el usuario';
      establecererrormensaje(mensaje);
    },
  });

  const alternarestadomutacion = useMutation({
    mutationFn: ({ id, isActive: estaactivo }: { id: string; isActive: boolean }) =>
      gestion.establecerusuarioactivo(id, estaactivo),
    onSuccess: () => {
      establecererrorestadousuario(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      establecererrorestadousuario(
        error instanceof Error ? error.message : 'No se pudo cambiar el estado del usuario.',
      );
    },
  });

  const restablecercontrasenamutacion = useMutation({
    mutationFn: ({ id, password: contrasena }: { id: string; password: string; name: string }) =>
      gestion.restablecercontrasena(id, contrasena),
    onSuccess: (_resultado, variables) => {
      establecerrestablecerexito(
        `La contraseña de ${variables.name} se restableció. Entréguele la nueva clave por un canal institucional verificado.`,
      );
      establecerrestablecerobjetivo(null);
      establecerrestablecercontrasena('');
      establecerrestablecercontrasenaconfirmacion('');
      establecerrestablecererror(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      establecerrestablecererror(
        error instanceof Error ? error.message : 'No se pudo restablecer la contraseña.',
      );
    },
  });

  const usuarioslistar = usuariosconsulta.data?.data ?? [];
  const totalcantidad = usuariosconsulta.data?.total ?? usuarioslistar.length;

  const rolestilos: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
    ADMINISTRATIVE: {
      label: 'Administración y Dirección',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/90',
      dotClass: 'bg-amber-500',
    },
    SECRETARY: {
      label: 'Secretaría / Adm.',
      badgeClass: 'bg-blue-50 text-blue-900 border-blue-200/90',
      dotClass: 'bg-blue-500',
    },
    TEACHER: {
      label: 'Docente Titular',
      badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/90',
      dotClass: 'bg-emerald-500',
    },
    PARENT: {
      label: 'Padre / Tutor',
      badgeClass: 'bg-purple-50 text-purple-900 border-purple-200/90',
      dotClass: 'bg-purple-500',
    },
    STUDENT: {
      label: 'Estudiante',
      badgeClass: 'bg-cyan-50 text-cyan-900 border-cyan-200/90',
      dotClass: 'bg-cyan-500',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Institucional con Doble Bisel */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-doppelrand-inner flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                <span>Gestión de Personal y Cuentas</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                {totalcantidad} Usuarios registrados
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Control de Roles Institucionales
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Personal y Roles Institucionales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Alta y administración de perfiles autorizados: Administración y Dirección, Secretaría,
              Docentes y Padres de Familia con asignación de credenciales.
            </p>
          </div>

          {puedegestionar && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  establecermostrarformulario((anterior) => !anterior);
                  establecererrormensaje(null);
                }}
                className="haptic-press inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-medium text-xs shadow-md hover:bg-slate-900 transition-all cursor-pointer"
              >
                <span>{mostrarformulario ? 'Cerrar Ficha' : 'Nuevo Personal / Usuario'}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                  {mostrarformulario ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {restablecerexito && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{restablecerexito}</span>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => establecerrestablecerexito(null)}
            className="ml-auto text-emerald-700 hover:text-emerald-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {restablecerobjetivo && puedegestionar && (
        <section
          aria-labelledby="reset-password-title"
          className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2
                id="reset-password-title"
                className="flex items-center gap-2 text-sm font-bold text-slate-900"
              >
                <KeyRound className="h-4 w-4 text-amber-700" />
                Restablecer acceso
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Nueva clave para {restablecerobjetivo.name} ({restablecerobjetivo.email}). Las
                sesiones abiertas se cerrarán.
              </p>
            </div>
            <button
              type="button"
              aria-label="Cancelar restablecimiento"
              onClick={() => {
                establecerrestablecerobjetivo(null);
                establecerrestablecercontrasena('');
                establecerrestablecercontrasenaconfirmacion('');
                establecerrestablecererror(null);
              }}
              className="rounded-lg p-1 text-slate-500 hover:bg-white hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {restablecererror && (
            <p role="alert" className="mb-3 text-xs text-rose-700">
              {restablecererror}
            </p>
          )}
          <form
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            onSubmit={(evento) => {
              evento.preventDefault();
              if (!escontrasenavalida(restablecercontrasena)) {
                establecerrestablecererror(mensajedecontrasenainvalida);
                return;
              }
              if (restablecercontrasena !== restablecercontrasenaconfirmacion) {
                establecerrestablecererror('Las contraseñas no coinciden.');
                return;
              }
              establecerrestablecererror(null);
              restablecercontrasenamutacion.mutate({
                id: restablecerobjetivo.id,
                name: restablecerobjetivo.name,
                password: restablecercontrasena,
              });
            }}
          >
            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              Nueva contraseña
              <Entrada
                type="password"
                autoComplete="new-password"
                minLength={12}
                value={restablecercontrasena}
                onChange={(evento) => establecerrestablecercontrasena(evento.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
              Confirmar contraseña
              <Entrada
                type="password"
                autoComplete="new-password"
                minLength={12}
                value={restablecercontrasenaconfirmacion}
                onChange={(evento) =>
                  establecerrestablecercontrasenaconfirmacion(evento.target.value)
                }
                required
              />
            </label>
            <Boton
              type="submit"
              disabled={restablecercontrasenamutacion.isPending}
              className="h-10 gap-2 text-xs"
            >
              {restablecercontrasenamutacion.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              Guardar clave
            </Boton>
          </form>
          <p className="mt-3 text-[11px] text-slate-600">
            El cambio queda auditado y revoca las sesiones existentes. Comuníquese con la persona
            mediante un canal institucional verificado.
          </p>
        </section>
      )}

      {/* Formulario de Alta con Selección de Rol (Exceptuando Administrador) */}
      {mostrarformulario && puedegestionar && (
        <div className="p-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-subtle animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 shadow-doppelrand-inner space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-700" />
                  Alta de Nuevo Personal Institucional
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seleccione el rol correspondiente y complete los datos requeridos. La cuenta se
                  habilitará de forma inmediata.
                </p>
              </div>
              <Insignia variant="outline" className="font-mono text-[10px] text-slate-500">
                Rol Administrador Restringido
              </Insignia>
            </div>

            {errormensaje && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errormensaje}</span>
              </div>
            )}

            <form
              onSubmit={formulario.handleSubmit((datos) => crearmutacion.mutate(datos))}
              className="space-y-5"
            >
              {/* Selector de Rol */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Seleccionar Rol a Asignar *</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Administración y Dirección comparten un único perfil.
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'SECRETARY',
                      label: 'Secretaría',
                      desc: 'Gestión y Admisiones',
                      icon: ContactRound,
                    },
                    {
                      id: 'TEACHER',
                      label: 'Docente Titular',
                      desc: 'Aula y Registro Pedagógico',
                      icon: GraduationCap,
                    },
                    {
                      id: 'PARENT',
                      label: 'Padre / Tutor',
                      desc: 'Familiar y Apoderado',
                      icon: UsersRound,
                    },
                  ].map((elemento) => {
                    const esseleccionado = seleccionadorol === elemento.id;
                    const Icono = elemento.icon;
                    return (
                      <button
                        key={elemento.id}
                        type="button"
                        onClick={() =>
                          formulario.setValue('role', elemento.id as usuarioformulariodatos['role'])
                        }
                        className={`p-3 rounded-xl border text-left transition-all haptic-press cursor-pointer flex flex-col justify-between ${
                          esseleccionado
                            ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#f37022]/40'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <Icono
                            className={`w-4 h-4 ${esseleccionado ? 'text-amber-400' : 'text-slate-500'}`}
                          />
                          {esseleccionado && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{elemento.label}</p>
                          <p
                            className={`text-[10px] mt-0.5 leading-tight ${esseleccionado ? 'text-slate-300' : 'text-slate-400'}`}
                          >
                            {elemento.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campos Generales */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 border-t border-slate-100">
                <Campo label="Nombres *" error={formulario.formState.errors.firstName?.message}>
                  <Entrada
                    {...formulario.register('firstName')}
                    placeholder="Nombres completos"
                    className="text-xs rounded-xl"
                  />
                </Campo>

                <Campo label="Apellidos *" error={formulario.formState.errors.lastName?.message}>
                  <Entrada
                    {...formulario.register('lastName')}
                    placeholder="Apellidos paterno y materno"
                    className="text-xs rounded-xl"
                  />
                </Campo>

                <Campo
                  label="Correo Electrónico Institucional *"
                  error={formulario.formState.errors.email?.message}
                >
                  <Entrada
                    type="email"
                    {...formulario.register('email')}
                    placeholder="usuario@sigce.edu.bo"
                    className="text-xs rounded-xl"
                  />
                </Campo>

                <Campo
                  label="Cédula de Identidad (C.I.)"
                  error={formulario.formState.errors.ci?.message}
                >
                  <Entrada
                    {...formulario.register('ci')}
                    placeholder="Ej. 6840192"
                    className="text-xs rounded-xl font-mono"
                  />
                </Campo>

                <Campo
                  label="Contraseña Inicial *"
                  error={formulario.formState.errors.password?.message}
                >
                  <Entrada
                    type="password"
                    minLength={12}
                    {...formulario.register('password')}
                    placeholder="Mínimo 12 caracteres"
                    className="text-xs rounded-xl font-mono"
                  />
                </Campo>

                <Campo
                  label="Teléfono / Celular de Contacto"
                  error={formulario.formState.errors.phone?.message}
                >
                  <Entrada
                    {...formulario.register('phone')}
                    placeholder="Ej. 76401234"
                    className="text-xs rounded-xl font-mono"
                  />
                </Campo>

                {/* Campos Específicos para Docentes */}
                {seleccionadorol === 'TEACHER' && (
                  <>
                    <Campo
                      label="Especialidad o Área *"
                      error={formulario.formState.errors.specialty?.message}
                    >
                      <Entrada
                        {...formulario.register('specialty')}
                        placeholder="Ej. Matemáticas, Lenguaje, Primaria..."
                        className="text-xs rounded-xl"
                      />
                    </Campo>
                    <Campo
                      label="Nro. de Ítem Ministerial"
                      error={formulario.formState.errors.itemNumber?.message}
                    >
                      <Entrada
                        {...formulario.register('itemNumber')}
                        placeholder="Ej. 14"
                        className="text-xs rounded-xl font-mono"
                      />
                    </Campo>
                  </>
                )}

                {/* Campos Específicos para Padres */}
                {seleccionadorol === 'PARENT' && (
                  <>
                    <Campo
                      label="Dirección de Domicilio"
                      error={formulario.formState.errors.address?.message}
                    >
                      <Entrada
                        {...formulario.register('address')}
                        placeholder="Zona, calle o avenida"
                        className="text-xs rounded-xl"
                      />
                    </Campo>
                    <Campo
                      label="Ocupación o Profesión"
                      error={formulario.formState.errors.occupation?.message}
                    >
                      <Entrada
                        {...formulario.register('occupation')}
                        placeholder="Opcional"
                        className="text-xs rounded-xl"
                      />
                    </Campo>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => establecermostrarformulario(false)}
                  className="h-10 text-xs rounded-xl"
                >
                  Cancelar
                </Boton>
                <Boton
                  disabled={crearmutacion.isPending}
                  type="submit"
                  className="haptic-press h-10 px-6 bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold gap-2 rounded-xl shadow-xs"
                >
                  {crearmutacion.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Crear y Registrar Perfil</span>
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl p-3 shadow-doppelrand-inner flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Role Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
            {constanterolpestanas.map((pestana) => (
              <button
                type="button"
                key={pestana.id}
                onClick={() => establecerrolfiltro(pestana.id)}
                aria-pressed={rolfiltro === pestana.id}
                className={`haptic-press px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  rolfiltro === pestana.id
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pestana.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="pointer-eventos-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Entrada
              value={buscar}
              onChange={(e) => establecerbuscar(e.target.value)}
              aria-label="Buscar usuarios por nombre o correo"
              placeholder="Buscar por nombre o correo..."
              className="pl-9 pr-8 h-10 text-xs bg-slate-50/60 border-slate-200/90 rounded-xl focus:bg-white transition-all"
            />
            {buscar && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => establecerbuscar('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios Institucionales */}
      <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-subtle">
        <div className="bg-white rounded-xl shadow-doppelrand-inner overflow-hidden">
          {usuariosconsulta.isLoading ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center p-16 text-slate-500 gap-3"
            >
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span className="text-xs font-medium font-mono text-slate-600">
                Cargando directorio de personal y cuentas...
              </span>
            </div>
          ) : usuariosconsulta.isError ? (
            <div role="alert" className="p-12 text-center text-xs text-rose-600">
              No se pudo obtener la lista de usuarios desde el servidor.
            </div>
          ) : (
            <div className="overflow-x-auto">
              {errorestadousuario && (
                <div
                  role="alert"
                  className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"
                >
                  {errorestadousuario}
                </div>
              )}
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 pl-5 pr-3">Usuario / Personal</th>
                    <th className="px-3 py-3.5">Correo Electrónico</th>
                    <th className="px-3 py-3.5">Rol Institucional</th>
                    <th className="px-3 py-3.5">Estado</th>
                    <th className="py-3.5 pl-3 pr-5 text-right">Fecha de Alta</th>
                    {puedegestionar && <th className="py-3.5 px-4 text-right">Acceso</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarioslistar.length === 0 ? (
                    <tr>
                      <td
                        colSpan={puedegestionar ? 6 : 5}
                        className="py-16 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="font-bold text-slate-800 text-sm">
                            No se encontraron usuarios
                          </p>
                          <p className="text-xs text-slate-400">
                            Intente modificando el término de búsqueda o el rol seleccionado.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    usuarioslistar.map((usuario) => {
                      const iniciales =
                        `${usuario.firstName?.[0] ?? ''}${usuario.lastName?.[0] ?? ''}`.toUpperCase() ||
                        'U';
                      const configuracion = rolestilos[usuario.role] ?? {
                        label: usuario.role,
                        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                        dotClass: 'bg-slate-400',
                      };

                      return (
                        <tr key={usuario.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0 shadow-xs">
                                {iniciales}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">
                                  {usuario.firstName} {usuario.lastName}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {usuario.id.slice(0, 8)}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3.5 font-mono text-slate-600">{usuario.email}</td>

                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${configuracion.badgeClass}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${configuracion.dotClass}`}
                              />
                              {configuracion.label}
                            </span>
                          </td>

                          <td className="px-3 py-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (usuario.id === actualusuario?.id) return;
                                establecererrorestadousuario(null);
                                alternarestadomutacion.mutate({
                                  id: usuario.id,
                                  isActive: !usuario.isActive,
                                });
                              }}
                              disabled={
                                usuario.id === actualusuario?.id ||
                                !puedegestionar ||
                                alternarestadomutacion.isPending
                              }
                              aria-pressed={usuario.isActive}
                              aria-label={`${usuario.isActive ? 'Desactivar' : 'Activar'} la cuenta de ${usuario.firstName} ${usuario.lastName}`}
                              title={
                                usuario.id === actualusuario?.id
                                  ? 'No puedes desactivar tu propia cuenta'
                                  : 'Haga clic para cambiar estado'
                              }
                              className={`haptic-press inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer disabled:cursor-not-allowed ${
                                usuario.isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${usuario.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                              />
                              <span>{usuario.isActive ? 'Activo' : 'Inactivo'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 pl-3 pr-5 text-right font-mono text-slate-400 text-[11px]">
                            {new Date(usuario.createdAt).toLocaleDateString('es-BO')}
                          </td>
                          {puedegestionar && (
                            <td className="px-4 py-3.5 text-right">
                              <button
                                type="button"
                                disabled={
                                  !puedegestionar ||
                                  (usuario.role === 'ADMINISTRATIVE' &&
                                    (actualusuario?.role !== 'ADMINISTRATIVE' ||
                                      usuario.id === actualusuario.id)) ||
                                  (usuario.role === 'STUDENT' && usuario.passwordSetupRequired) ||
                                  restablecercontrasenamutacion.isPending
                                }
                                title={
                                  usuario.role === 'ADMINISTRATIVE' &&
                                  (actualusuario?.role !== 'ADMINISTRATIVE' ||
                                    usuario.id === actualusuario.id)
                                    ? 'Otro administrador debe restablecer esta cuenta'
                                    : usuario.role === 'STUDENT' && usuario.passwordSetupRequired
                                      ? 'Esta cuenta debe completar su activación antes de restablecer la clave'
                                      : 'Restablecer contraseña'
                                }
                                onClick={() => {
                                  establecerrestablecerexito(null);
                                  establecerrestablecererror(null);
                                  establecerrestablecercontrasena('');
                                  establecerrestablecercontrasenaconfirmacion('');
                                  establecerrestablecerobjetivo({
                                    id: usuario.id,
                                    name: `${usuario.firstName} ${usuario.lastName}`.trim(),
                                    email: usuario.email,
                                  });
                                }}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                                Restablecer
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
          )}
        </div>
      </div>
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
    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
      <span>{etiqueta}</span>
      {hijos}
      {error && <span className="text-[10px] font-normal text-rose-600">{error}</span>}
    </label>
  );
}
