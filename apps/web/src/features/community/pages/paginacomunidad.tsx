import React, { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  GraduationCap,
  Loader2,
  Plus,
  Search,
  UsersRound,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  Link2,
  Check,
  Unlink,
  KeyRound,
} from 'lucide-react';
import { academicoapi } from '../../../lib/apiacademica';
import { Boton } from '../../../components/ui/boton';
import { Entrada } from '../../../components/ui/entrada';
import type {
  gestioncomunidad,
  crearfamiliarentrada,
  creardocenteentrada,
  familiaractualizarentrada,
  docenteactualizarentrada,
  docenteasignacion,
} from '../application/gestioncomunidad';
import { Editordocenteasignaciones } from '../components/editordocenteasignaciones';

const docenteformularioesquema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La clave debe tener al menos 6 caracteres'),
  ci: z.string().min(1, 'La cédula es requerida'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  specialty: z.string().min(1, 'Selecciona la materia principal'),
  phone: z.string().optional(),
  itemNumber: z.string().optional(),
});

const familiarformularioesquema = z.object({
  email: z.string().email('Correo electrónico no válido'),
  password: z.string().min(6, 'La clave debe tener al menos 6 caracteres'),
  ci: z.string().min(1, 'La cédula es requerida'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

type docenteformulariodatos = z.infer<typeof docenteformularioesquema>;
type familiarformulariodatos = z.infer<typeof familiarformularioesquema>;

interface editardocenteestado {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  phone: string;
  itemNumber: string;
  teacherAssignments: docenteasignacion[];
}

interface editarfamiliarestado {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  occupation: string;
}

interface eliminarelementoestado {
  type: 'teacher' | 'parent';
  id: string;
  name: string;
}

interface vincularfamiliarestado {
  id: string;
  name: string;
  students: Array<{
    id: string;
    rude: string;
    firstName: string;
    lastName: string;
    relationship: string;
  }>;
}

type tiporelacionfamiliar = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'TUTOR' | 'OTHER';

export function ComunidadPagina({
  mode: modo,
  management: gestion,
  currentRole: actualrol,
}: {
  mode: 'teachers' | 'parents';
  management: gestioncomunidad;
  currentRole?: string;
}) {
  const clientedeconsultas = useQueryClient();
  const [mostrarformulario, establecermostrarformulario] = useState(false);
  const [buscar, establecerbuscar] = useState('');

  // Modals state for Edit and Delete
  const [ediciondocente, establecerediciondocente] = useState<editardocenteestado | null>(null);
  const [edicionfamiliar, estableceredicionfamiliar] = useState<editarfamiliarestado | null>(null);
  const [restablecerfamiliar, establecerrestablecerfamiliar] = useState<{
    userId: string;
    name: string;
    ci: string;
  } | null>(null);
  const [nuevacontrasena, establecernuevacontrasena] = useState('');
  const [confirmarcontrasena, establecerconfirmarcontrasena] = useState('');
  const [restablecererror, establecerrestablecererror] = useState<string | null>(null);
  const [restablecerexito, establecerrestablecerexito] = useState<string | null>(null);

  const restablecercontrasenamutacion = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      return academicoapi.restablecerusuariocontrasena(userId, password);
    },
    onSuccess: () => {
      establecerrestablecerexito(
        `La contraseña de ${restablecerfamiliar?.name} (CI: ${restablecerfamiliar?.ci}) se actualizó con éxito.`,
      );
      establecerrestablecerfamiliar(null);
      establecernuevacontrasena('');
      establecerconfirmarcontrasena('');
      establecerrestablecererror(null);
    },
    onError: (error: unknown) => {
      establecerrestablecererror(
        error instanceof Error ? error.message : 'No se pudo restablecer la contraseña.',
      );
    },
  });

  const [familiarparavincular, establecerfamiliarparavincular] =
    useState<vincularfamiliarestado | null>(null);
  const [estudianteparavincular, establecerestudianteparavincular] = useState('');
  const [relacionparavincular, establecerrelacionparavincular] =
    useState<tiporelacionfamiliar>('TUTOR');
  const [relacionesvinculadas, establecerrelacionesvinculadas] = useState<
    Record<string, tiporelacionfamiliar>
  >({});
  const [estudianteparadesvincular, establecerestudianteparadesvincular] = useState('');
  const [buscarestudianteparavincular, establecerbuscarestudianteparavincular] = useState('');
  const [eliminacionelemento, establecereliminacionelemento] =
    useState<eliminarelementoestado | null>(null);

  const puedegestionar = actualrol === 'ADMINISTRATIVE';
  const puedeleer =
    modo === 'teachers'
      ? ['ADMINISTRATIVE', 'SECRETARY', 'TEACHER'].includes(actualrol ?? '')
      : ['ADMINISTRATIVE', 'SECRETARY'].includes(actualrol ?? '');

  const docentesconsulta = useQuery({
    queryKey: ['teachers', buscar],
    queryFn: () => gestion.listardocentes(buscar),
    enabled: modo === 'teachers' && puedeleer,
  });
  const materiasconsulta = useQuery({
    queryKey: ['subjects'],
    queryFn: () => gestion.listarmaterias(),
    enabled: modo === 'teachers' && puedegestionar,
  });
  const materias = materiasconsulta.data ?? [];

  const familiaresconsulta = useQuery({
    queryKey: ['parents', buscar],
    queryFn: () => gestion.listarfamiliares(buscar, 300),
    enabled: modo === 'parents' && puedeleer,
  });
  const estudiantesparavinculo = useQuery({
    queryKey: ['students', 'parent-link-options'],
    queryFn: () => gestion.listarestudiantes(undefined, 1000),
    enabled: modo === 'parents' && puedegestionar && familiarparavincular !== null,
  });

  const docenteformulario = useForm<docenteformulariodatos>({
    resolver: zodResolver(docenteformularioesquema),
    defaultValues: {
      email: '',
      password: '',
      ci: '',
      firstName: '',
      lastName: '',
      specialty: '',
      phone: '',
      itemNumber: '',
    },
  });

  const familiarformulario = useForm<familiarformulariodatos>({
    resolver: zodResolver(familiarformularioesquema),
    defaultValues: {
      email: '',
      password: '',
      ci: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      occupation: '',
    },
  });

  const creardocente = useMutation({
    mutationFn: (entrada: creardocenteentrada) => gestion.creardocente(entrada),
    onSuccess: () => {
      docenteformulario.reset();
      establecermostrarformulario(false);
      void clientedeconsultas.invalidateQueries({ queryKey: ['teachers'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const crearfamiliar = useMutation({
    mutationFn: (entrada: crearfamiliarentrada) => gestion.crearfamiliar(entrada),
    onSuccess: (familiar) => {
      familiarformulario.reset();
      establecermostrarformulario(false);
      establecerfamiliarparavincular({
        id: familiar.id,
        name: `${familiar.firstName} ${familiar.lastName}`,
        students: familiar.students,
      });
      establecerestudianteparavincular('');
      establecerbuscarestudianteparavincular('');
      establecerrelacionparavincular('TUTOR');
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const actualizardocentemutacion = useMutation({
    mutationFn: ({ id, data: datos }: { id: string; data: docenteactualizarentrada }) =>
      gestion.actualizardocente(id, datos),
    onSuccess: () => {
      establecerediciondocente(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['teachers'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const eliminardocentemutacion = useMutation({
    mutationFn: (id: string) => gestion.eliminardocente(id),
    onSuccess: () => {
      establecereliminacionelemento(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['teachers'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const actualizarfamiliarmutacion = useMutation({
    mutationFn: ({ id, data: datos }: { id: string; data: familiaractualizarentrada }) =>
      gestion.actualizarfamiliar(id, datos),
    onSuccess: () => {
      estableceredicionfamiliar(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const eliminarfamiliarmutacion = useMutation({
    mutationFn: (id: string) => gestion.eliminarfamiliar(id),
    onSuccess: () => {
      establecereliminacionelemento(null);
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const vincularfamiliaramutacion = useMutation({
    mutationFn: () => {
      if (!familiarparavincular || !estudianteparavincular) {
        throw new Error('Selecciona un estudiante para continuar.');
      }
      return gestion.vincularestudiantefamiliar(estudianteparavincular, {
        parentId: familiarparavincular.id,
        relationship: relacionparavincular,
      });
    },
    onSuccess: () => {
      const nuevo = (estudiantesparavinculo.data ?? []).find(
        (estudiante) => estudiante.id === estudianteparavincular,
      );
      if (nuevo) {
        establecerfamiliarparavincular((actual) =>
          actual && !actual.students.some((item) => item.id === nuevo.id)
            ? {
                ...actual,
                students: [
                  ...actual.students,
                  {
                    id: nuevo.id,
                    rude: nuevo.rude,
                    firstName: nuevo.firstName,
                    lastName: nuevo.lastName,
                    relationship: relacionparavincular,
                  },
                ],
              }
            : actual,
        );
        establecerrelacionesvinculadas((actual) => ({
          ...actual,
          [nuevo.id]: relacionparavincular,
        }));
      }
      establecerestudianteparavincular('');
      establecerbuscarestudianteparavincular('');
      establecerestudianteparadesvincular('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const actualizarestudiantevinculadomutacion = useMutation({
    mutationFn: ({
      parentId,
      studentId,
      relationship,
    }: {
      parentId: string;
      studentId: string;
      relationship: tiporelacionfamiliar;
    }) => gestion.actualizarvinculofamiliar(parentId, studentId, relationship),
    onSuccess: (familiar) => {
      establecerfamiliarparavincular((actual) =>
        actual ? { ...actual, students: familiar.students } : actual,
      );
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const desvincularestudiantemutacion = useMutation({
    mutationFn: ({ parentId, studentId }: { parentId: string; studentId: string }) =>
      gestion.eliminarvinculofamiliar(parentId, studentId),
    onSuccess: (familiar) => {
      establecerfamiliarparavincular((actual) =>
        actual ? { ...actual, students: familiar.students } : actual,
      );
      establecerestudianteparadesvincular('');
      void clientedeconsultas.invalidateQueries({ queryKey: ['parents'] });
      void clientedeconsultas.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const titulo = modo === 'teachers' ? 'Docentes' : 'Padres y Tutores';
  const escarga = modo === 'teachers' ? docentesconsulta.isLoading : familiaresconsulta.isLoading;
  const eserror = modo === 'teachers' ? docentesconsulta.isError : familiaresconsulta.isError;
  const datoscantidad =
    modo === 'teachers'
      ? (docentesconsulta.data?.total ?? docentesconsulta.data?.data?.length ?? 0)
      : (familiaresconsulta.data?.total ?? familiaresconsulta.data?.data?.length ?? 0);

  const manejarconfirmareliminar = () => {
    if (!eliminacionelemento) return;
    if (eliminacionelemento.type === 'teacher') {
      eliminardocentemutacion.mutate(eliminacionelemento.id);
    } else {
      eliminarfamiliarmutacion.mutate(eliminacionelemento.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header - Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{titulo}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{datoscantidad} registros activos</p>
        </div>

        {puedegestionar && (
          <Boton
            onClick={() => establecermostrarformulario((anterior) => !anterior)}
            className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
          >
            {mostrarformulario ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Nuevo</span>
              </>
            )}
          </Boton>
        )}
      </div>

      {/* Form - Create Teacher */}
      {mostrarformulario && puedegestionar && modo === 'teachers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Docente</h2>

          <form
            onSubmit={docenteformulario.handleSubmit((datos) => creardocente.mutate(datos))}
            className="space-y-4"
          >
            {creardocente.isError && (
              <p role="alert" className="text-sm text-rose-700">
                {creardocente.error.message || 'No se pudo registrar al docente.'}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Campo
                label="Correo personal"
                error={docenteformulario.formState.errors.email?.message}
              >
                <Entrada
                  type="email"
                  {...docenteformulario.register('email')}
                  placeholder="nombre@correo.com"
                />
              </Campo>

              <Campo
                label="Contraseña"
                error={docenteformulario.formState.errors.password?.message}
              >
                <Entrada
                  type="password"
                  {...docenteformulario.register('password')}
                  placeholder="••••••••"
                />
              </Campo>

              <Campo label="C.I." error={docenteformulario.formState.errors.ci?.message}>
                <Entrada {...docenteformulario.register('ci')} placeholder="6849204" />
              </Campo>

              <Campo label="Nombres" error={docenteformulario.formState.errors.firstName?.message}>
                <Entrada {...docenteformulario.register('firstName')} placeholder="Carlos" />
              </Campo>

              <Campo label="Apellidos" error={docenteformulario.formState.errors.lastName?.message}>
                <Entrada {...docenteformulario.register('lastName')} placeholder="Mamani Flores" />
              </Campo>

              <Campo
                label="Materia principal"
                error={docenteformulario.formState.errors.specialty?.message}
              >
                <select
                  {...docenteformulario.register('specialty')}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                >
                  <option value="">Selecciona una materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.name}>
                      {materia.name}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Teléfono" error={docenteformulario.formState.errors.phone?.message}>
                <Entrada {...docenteformulario.register('phone')} placeholder="Ej. 70000000" />
              </Campo>

              <Campo
                label="Número de Ítem"
                error={docenteformulario.formState.errors.itemNumber?.message}
              >
                <Entrada {...docenteformulario.register('itemNumber')} placeholder="IT-4029" />
              </Campo>
            </div>
            <p className="text-xs text-slate-600">
              Usa un correo al que el docente tenga acceso. La materia principal se puede cambiar
              después; las asignaciones por curso se gestionan en Horarios.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Boton
                type="button"
                variant="outline"
                onClick={() => establecermostrarformulario(false)}
              >
                Cancelar
              </Boton>
              <Boton
                type="submit"
                disabled={creardocente.isPending}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                {creardocente.isPending ? 'Guardando...' : 'Crear Docente'}
              </Boton>
            </div>
          </form>
        </div>
      )}

      {/* Form - Create Parent */}
      {mostrarformulario && puedegestionar && modo === 'parents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Registrar Padre / Tutor</h2>

          <form
            onSubmit={familiarformulario.handleSubmit((datos) => crearfamiliar.mutate(datos))}
            className="space-y-4"
          >
            {crearfamiliar.isError && (
              <p role="alert" className="text-sm text-rose-700">
                {crearfamiliar.error.message || 'No se pudo registrar al familiar.'}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Campo label="Correo" error={familiarformulario.formState.errors.email?.message}>
                <Entrada
                  type="email"
                  {...familiarformulario.register('email')}
                  placeholder="familiar@correo.com"
                />
              </Campo>

              <Campo
                label="Contraseña"
                error={familiarformulario.formState.errors.password?.message}
              >
                <Entrada
                  type="password"
                  {...familiarformulario.register('password')}
                  placeholder="••••••••"
                />
              </Campo>

              <Campo label="C.I." error={familiarformulario.formState.errors.ci?.message}>
                <Entrada {...familiarformulario.register('ci')} placeholder="5938102" />
              </Campo>

              <Campo label="Nombres" error={familiarformulario.formState.errors.firstName?.message}>
                <Entrada {...familiarformulario.register('firstName')} placeholder="María" />
              </Campo>

              <Campo
                label="Apellidos"
                error={familiarformulario.formState.errors.lastName?.message}
              >
                <Entrada {...familiarformulario.register('lastName')} placeholder="Quispe Choque" />
              </Campo>

              <Campo label="Teléfono" error={familiarformulario.formState.errors.phone?.message}>
                <Entrada {...familiarformulario.register('phone')} placeholder="79876543" />
              </Campo>

              <Campo label="Dirección" error={familiarformulario.formState.errors.address?.message}>
                <Entrada
                  {...familiarformulario.register('address')}
                  placeholder="Av. Blanco Galindo Km 4"
                />
              </Campo>

              <Campo
                label="Ocupación"
                error={familiarformulario.formState.errors.occupation?.message}
              >
                <Entrada {...familiarformulario.register('occupation')} placeholder="Comerciante" />
              </Campo>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Boton
                type="button"
                variant="outline"
                onClick={() => establecermostrarformulario(false)}
              >
                Cancelar
              </Boton>
              <Boton
                type="submit"
                disabled={crearfamiliar.isPending}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                {crearfamiliar.isPending ? 'Guardando...' : 'Crear Familiar'}
              </Boton>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Entrada
          value={buscar}
          onChange={(e) => establecerbuscar(e.target.value)}
          placeholder={`Buscar ${modo === 'teachers' ? 'docente' : 'familiar'}...`}
          className="pl-9 h-9 text-sm"
        />
        {buscar && (
          <button
            onClick={() => establecerbuscar('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {restablecerexito && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{restablecerexito}</span>
          </div>
          <button
            type="button"
            onClick={() => establecerrestablecerexito(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {escarga ? (
          <div role="status" className="flex items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Cargando...</span>
          </div>
        ) : eserror ? (
          <div role="alert" className="p-12 text-center text-sm text-rose-600">
            No se pudo obtener la información.
          </div>
        ) : modo === 'teachers' ? (
          <DocenteTabla
            data={docentesconsulta.data?.data ?? []}
            canManage={puedegestionar}
            onEdit={(docente) =>
              establecerediciondocente({
                id: docente.id,
                firstName: docente.firstName,
                lastName: docente.lastName,
                specialty: docente.specialty,
                phone: docente.phone || '',
                itemNumber: docente.itemNumber || '',
                teacherAssignments: docente.teacherAssignments,
              })
            }
            onDelete={(docente) =>
              establecereliminacionelemento({
                type: 'teacher',
                id: docente.id,
                name: `${docente.firstName} ${docente.lastName}`,
              })
            }
          />
        ) : (
          <FamiliarTabla
            data={familiaresconsulta.data?.data ?? []}
            canManage={puedegestionar}
            onEdit={(familiar) =>
              estableceredicionfamiliar({
                id: familiar.id,
                firstName: familiar.firstName,
                lastName: familiar.lastName,
                phone: familiar.phone,
                address: familiar.address || '',
                occupation: familiar.occupation || '',
              })
            }
            onDelete={(familiar) =>
              establecereliminacionelemento({
                type: 'parent',
                id: familiar.id,
                name: `${familiar.firstName} ${familiar.lastName}`,
              })
            }
            onResetPassword={(familiar) => {
              establecerrestablecerexito(null);
              establecerrestablecererror(null);
              establecernuevacontrasena('');
              establecerconfirmarcontrasena('');
              establecerrestablecerfamiliar({
                userId: familiar.userId,
                name: `${familiar.firstName} ${familiar.lastName}`,
                ci: familiar.ci,
              });
            }}
            onLink={(familiar) => {
              establecerfamiliarparavincular({
                id: familiar.id,
                name: `${familiar.firstName} ${familiar.lastName}`,
                students: familiar.students,
              });
              establecerestudianteparavincular('');
              establecerbuscarestudianteparavincular('');
              establecerrelacionparavincular('TUTOR');
              establecerrelacionesvinculadas(
                Object.fromEntries(
                  familiar.students.map((estudiante) => [
                    estudiante.id,
                    estudiante.relationship as tiporelacionfamiliar,
                  ]),
                ),
              );
              establecerestudianteparadesvincular('');
              vincularfamiliaramutacion.reset();
              actualizarestudiantevinculadomutacion.reset();
              desvincularestudiantemutacion.reset();
            }}
          />
        )}
      </div>

      {familiarparavincular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-vincular-estudiante"
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 id="titulo-vincular-estudiante" className="font-bold text-slate-900">
                  Estudiantes vinculados
                </h2>
                <p className="mt-1 text-sm text-slate-500">Familiar: {familiarparavincular.name}</p>
              </div>
              <button
                type="button"
                onClick={() => establecerfamiliarparavincular(null)}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Vínculos actuales ({familiarparavincular.students.length})
              </h3>
              {actualizarestudiantevinculadomutacion.isError && (
                <p role="alert" className="mt-2 text-sm text-rose-700">
                  {actualizarestudiantevinculadomutacion.error.message ||
                    'No se pudo actualizar el parentesco.'}
                </p>
              )}
              {desvincularestudiantemutacion.isError && (
                <p role="alert" className="mt-2 text-sm text-rose-700">
                  {desvincularestudiantemutacion.error.message || 'No se pudo quitar el vínculo.'}
                </p>
              )}
              {familiarparavincular.students.length ? (
                <ul className="mt-2 max-h-56 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
                  {familiarparavincular.students.map((estudiante) => (
                    <li
                      key={estudiante.id}
                      className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {estudiante.firstName} {estudiante.lastName}
                        </p>
                        <p className="text-xs text-slate-500">RUDE {estudiante.rude}</p>
                      </div>
                      <label className="text-xs font-medium text-slate-600">
                        Parentesco
                        <select
                          value={
                            relacionesvinculadas[estudiante.id] ??
                            (estudiante.relationship as tiporelacionfamiliar)
                          }
                          onChange={(evento) =>
                            establecerrelacionesvinculadas((actual) => ({
                              ...actual,
                              [estudiante.id]: evento.target.value as tiporelacionfamiliar,
                            }))
                          }
                          className="ml-2 h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800"
                        >
                          <option value="FATHER">Padre</option>
                          <option value="MOTHER">Madre</option>
                          <option value="GUARDIAN">Apoderado</option>
                          <option value="TUTOR">Tutor</option>
                          <option value="OTHER">Otro familiar</option>
                        </select>
                      </label>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          disabled={
                            actualizarestudiantevinculadomutacion.isPending ||
                            (relacionesvinculadas[estudiante.id] ?? estudiante.relationship) ===
                              estudiante.relationship
                          }
                          onClick={() =>
                            actualizarestudiantevinculadomutacion.mutate({
                              parentId: familiarparavincular.id,
                              studentId: estudiante.id,
                              relationship:
                                relacionesvinculadas[estudiante.id] ??
                                (estudiante.relationship as tiporelacionfamiliar),
                            })
                          }
                          className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Guardar parentesco"
                          aria-label={`Guardar parentesco de ${estudiante.firstName} ${estudiante.lastName}`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        {estudianteparadesvincular === estudiante.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                desvincularestudiantemutacion.mutate({
                                  parentId: familiarparavincular.id,
                                  studentId: estudiante.id,
                                })
                              }
                              disabled={desvincularestudiantemutacion.isPending}
                              className="rounded px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => establecerestudianteparadesvincular('')}
                              className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => establecerestudianteparadesvincular(estudiante.id)}
                            className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                            title="Quitar vínculo"
                            aria-label={`Quitar vínculo con ${estudiante.firstName} ${estudiante.lastName}`}
                          >
                            <Unlink className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                  Este familiar todavía no tiene estudiantes vinculados.
                </p>
              )}
            </div>
            <form
              className="mt-4 space-y-4"
              onSubmit={(evento) => {
                evento.preventDefault();
                vincularfamiliaramutacion.mutate();
              }}
            >
              {vincularfamiliaramutacion.isError && (
                <p role="alert" className="text-sm text-rose-700">
                  {vincularfamiliaramutacion.error.message || 'No se pudo vincular al estudiante.'}
                </p>
              )}
              {estudiantesparavinculo.isError && (
                <p role="alert" className="text-sm text-rose-700">
                  No se pudo cargar la lista de estudiantes.
                </p>
              )}
              <h3 className="text-sm font-semibold text-slate-800">Añadir estudiante</h3>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Buscar estudiante por nombre, apellido o RUDE
                <Entrada
                  value={buscarestudianteparavincular}
                  onChange={(evento) => establecerbuscarestudianteparavincular(evento.target.value)}
                  placeholder="Escribe al menos parte del nombre o RUDE"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Estudiante
                <select
                  required
                  value={estudianteparavincular}
                  onChange={(evento) => establecerestudianteparavincular(evento.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="">Selecciona un estudiante</option>
                  {(estudiantesparavinculo.data ?? [])
                    .filter(
                      (estudiante) =>
                        !familiarparavincular.students.some(
                          (vinculado) => vinculado.id === estudiante.id,
                        ),
                    )
                    .filter((estudiante) => {
                      const termino = buscarestudianteparavincular.trim().toLocaleLowerCase('es');
                      return (
                        !termino ||
                        `${estudiante.firstName} ${estudiante.lastName} ${estudiante.rude}`
                          .toLocaleLowerCase('es')
                          .includes(termino)
                      );
                    })
                    .map((estudiante) => (
                      <option key={estudiante.id} value={estudiante.id}>
                        {estudiante.lastName}, {estudiante.firstName} · RUDE {estudiante.rude}
                      </option>
                    ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Relación
                <select
                  value={relacionparavincular}
                  onChange={(evento) =>
                    establecerrelacionparavincular(
                      evento.target.value as typeof relacionparavincular,
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="FATHER">Padre</option>
                  <option value="MOTHER">Madre</option>
                  <option value="GUARDIAN">Apoderado</option>
                  <option value="TUTOR">Tutor</option>
                  <option value="OTHER">Otro familiar</option>
                </select>
              </label>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => establecerfamiliarparavincular(null)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  disabled={vincularfamiliaramutacion.isPending || !estudianteparavincular}
                  className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                  {vincularfamiliaramutacion.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  Añadir vínculo
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR DOCENTE */}
      {ediciondocente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-xs sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-docente"
            className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 sm:p-6"
          >
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6">
              <div>
                <h3 id="titulo-editar-docente" className="font-bold text-slate-900">
                  Editar docente
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {ediciondocente.firstName} {ediciondocente.lastName} · administra sus materias por
                  curso
                </p>
              </div>
              <button
                type="button"
                onClick={() => establecerediciondocente(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Cerrar edición de docente"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                actualizardocentemutacion.mutate({
                  id: ediciondocente.id,
                  data: {
                    firstName: ediciondocente.firstName,
                    lastName: ediciondocente.lastName,
                    specialty: ediciondocente.specialty,
                    phone: ediciondocente.phone,
                    itemNumber: ediciondocente.itemNumber,
                  },
                });
              }}
              className="space-y-4 pt-4"
            >
              {actualizardocentemutacion.isError && (
                <p role="alert" className="text-sm text-rose-700">
                  {actualizardocentemutacion.error.message || 'No se pudo actualizar al docente.'}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombres *
                  </label>
                  <Entrada
                    value={ediciondocente.firstName}
                    onChange={(e) =>
                      establecerediciondocente({ ...ediciondocente, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Apellidos *
                  </label>
                  <Entrada
                    value={ediciondocente.lastName}
                    onChange={(e) =>
                      establecerediciondocente({ ...ediciondocente, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Materia principal *
                </label>
                <select
                  value={ediciondocente.specialty}
                  onChange={(e) =>
                    establecerediciondocente({ ...ediciondocente, specialty: e.target.value })
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  required
                >
                  <option value="">Selecciona una materia</option>
                  {!materias.some((materia) => materia.name === ediciondocente.specialty) &&
                    ediciondocente.specialty && (
                      <option value={ediciondocente.specialty}>
                        Actual: {ediciondocente.specialty}
                      </option>
                    )}
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.name}>
                      {materia.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono
                  </label>
                  <Entrada
                    value={ediciondocente.phone}
                    onChange={(e) =>
                      establecerediciondocente({ ...ediciondocente, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nº de Ítem
                  </label>
                  <Entrada
                    value={ediciondocente.itemNumber}
                    onChange={(e) =>
                      establecerediciondocente({ ...ediciondocente, itemNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => establecerediciondocente(null)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  disabled={actualizardocentemutacion.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {actualizardocentemutacion.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Boton>
              </div>
            </form>

            <Editordocenteasignaciones
              teacherId={ediciondocente.id}
              assignments={ediciondocente.teacherAssignments}
              subjects={materias}
              management={gestion}
              onAssignmentsChanged={(courseId, assignments) => {
                establecerediciondocente((actual) =>
                  actual && actual.id === ediciondocente.id
                    ? {
                        ...actual,
                        teacherAssignments: [
                          ...actual.teacherAssignments.filter((item) => item.courseId !== courseId),
                          ...assignments,
                        ],
                      }
                    : actual,
                );
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL: EDITAR FAMILIAR */}
      {edicionfamiliar && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Editar Familiar / Tutor</h3>
              <button
                type="button"
                onClick={() => estableceredicionfamiliar(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                actualizarfamiliarmutacion.mutate({
                  id: edicionfamiliar.id,
                  data: {
                    firstName: edicionfamiliar.firstName,
                    lastName: edicionfamiliar.lastName,
                    phone: edicionfamiliar.phone,
                    address: edicionfamiliar.address,
                    occupation: edicionfamiliar.occupation,
                  },
                });
              }}
              className="space-y-4 pt-4"
            >
              {actualizarfamiliarmutacion.isError && (
                <p role="alert" className="text-sm text-rose-700">
                  {actualizarfamiliarmutacion.error.message || 'No se pudo actualizar al familiar.'}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombres *
                  </label>
                  <Entrada
                    value={edicionfamiliar.firstName}
                    onChange={(e) =>
                      estableceredicionfamiliar({ ...edicionfamiliar, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Apellidos *
                  </label>
                  <Entrada
                    value={edicionfamiliar.lastName}
                    onChange={(e) =>
                      estableceredicionfamiliar({ ...edicionfamiliar, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teléfono *
                </label>
                <Entrada
                  value={edicionfamiliar.phone}
                  onChange={(e) =>
                    estableceredicionfamiliar({ ...edicionfamiliar, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dirección
                  </label>
                  <Entrada
                    value={edicionfamiliar.address}
                    onChange={(e) =>
                      estableceredicionfamiliar({ ...edicionfamiliar, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ocupación
                  </label>
                  <Entrada
                    value={edicionfamiliar.occupation}
                    onChange={(e) =>
                      estableceredicionfamiliar({ ...edicionfamiliar, occupation: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => estableceredicionfamiliar(null)}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  disabled={actualizarfamiliarmutacion.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {actualizarfamiliarmutacion.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR BAJA LÓGICA (SOFT DELETE) */}
            {restablecerfamiliar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-restablecer-clave"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 id="titulo-restablecer-clave" className="font-bold text-slate-900">
                  Cambiar contraseña de acceso
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Familiar: {restablecerfamiliar.name} (CI: {restablecerfamiliar.ci})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  establecerrestablecerfamiliar(null);
                  establecernuevacontrasena('');
                  establecerconfirmarcontrasena('');
                  establecerrestablecererror(null);
                }}
                aria-label="Cerrar"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {restablecererror && (
              <p role="alert" className="mt-4 text-xs font-semibold text-rose-700">
                {restablecererror}
              </p>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (nuevacontrasena.length < 8) {
                  establecerrestablecererror('La contraseña debe tener al menos 8 caracteres.');
                  return;
                }
                if (nuevacontrasena !== confirmarcontrasena) {
                  establecerrestablecererror('Las contraseñas no coinciden.');
                  return;
                }
                restablecercontrasenamutacion.mutate({
                  userId: restablecerfamiliar.userId,
                  password: nuevacontrasena,
                });
              }}
              className="mt-4 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nueva contraseña
                </label>
                <Entrada
                  type="password"
                  value={nuevacontrasena}
                  onChange={(e) => establecernuevacontrasena(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Confirmar contraseña
                </label>
                <Entrada
                  type="password"
                  value={confirmarcontrasena}
                  onChange={(e) => establecerconfirmarcontrasena(e.target.value)}
                  placeholder="Repita la contraseña"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Boton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    establecerrestablecerfamiliar(null);
                    establecernuevacontrasena('');
                    establecerconfirmarcontrasena('');
                    establecerrestablecererror(null);
                  }}
                >
                  Cancelar
                </Boton>
                <Boton
                  type="submit"
                  disabled={restablecercontrasenamutacion.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  {restablecercontrasenamutacion.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Actualizar contraseña</span>
                    </>
                  )}
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {eliminacionelemento && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              ¿Eliminar {eliminacionelemento.type === 'teacher' ? 'Docente' : 'Familiar'}?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Está a punto de dar de baja a{' '}
              <strong className="text-slate-900">{eliminacionelemento.name}</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-xs text-amber-800 leading-relaxed">
              El registro quedará archivado y la cuenta
              de usuario vinculada será desactivada automáticamente, preservando la integridad del
              historial académico.
            </div>

            {(eliminacionelemento.type === 'teacher'
              ? eliminardocentemutacion.isError
              : eliminarfamiliarmutacion.isError) && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {(eliminacionelemento.type === 'teacher'
                  ? eliminardocentemutacion.error
                  : eliminarfamiliarmutacion.error
                )?.message || 'No se pudo dar de baja el registro.'}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-5">
              <Boton
                type="button"
                variant="outline"
                onClick={() => establecereliminacionelemento(null)}
                disabled={eliminardocentemutacion.isPending || eliminarfamiliarmutacion.isPending}
              >
                Cancelar
              </Boton>
              <Boton
                type="button"
                onClick={manejarconfirmareliminar}
                disabled={eliminardocentemutacion.isPending || eliminarfamiliarmutacion.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {eliminardocentemutacion.isPending || eliminarfamiliarmutacion.isPending ? (
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
    </div>
  );
}

function DocenteTabla({
  data: datos,
  canManage: puedegestionar,
  onEdit: oneditar,
  onDelete: oneliminar,
}: {
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    itemNumber: string | null;
    specialty: string;
    teacherAssignments: docenteasignacion[];
    email: string;
    phone?: string | null;
  }>;
  canManage: boolean;
  onEdit: (docente: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    phone?: string | null;
    itemNumber?: string | null;
    teacherAssignments: docenteasignacion[];
  }) => void;
  onDelete: (docente: { id: string; firstName: string; lastName: string }) => void;
}) {
  if (datos.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-medium text-slate-700">No se encontraron docentes</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <th className="py-3 pl-5 pr-3">Docente</th>
            <th className="px-3 py-3">Ítem</th>
            <th className="px-3 py-3">Materia principal</th>
            <th className="px-3 py-3">Carga en la gestión activa</th>
            <th className="px-3 py-3">Correo</th>
            {puedegestionar && <th className="py-3 pl-3 pr-5 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {datos.map((elemento) => {
            const iniciales =
              `${elemento.firstName[0] ?? ''}${elemento.lastName[0] ?? ''}`.toUpperCase();
            const materiasdistintas = Array.from(
              new Map(
                elemento.teacherAssignments.map((asignacion) => [
                  asignacion.subjectId,
                  asignacion.subjectName,
                ]),
              ).values(),
            );
            const cursosdistintos = new Set(
              elemento.teacherAssignments.map((asignacion) => asignacion.courseId),
            ).size;
            return (
              <tr key={elemento.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                      {iniciales}
                    </div>
                    <span className="font-medium text-slate-900">
                      {elemento.firstName} {elemento.lastName}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3 font-mono text-slate-700">
                  {elemento.itemNumber || <span className="text-slate-400">—</span>}
                </td>

                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {elemento.specialty === 'MAESTRA/O' || elemento.specialty === 'Maestro'
                      ? 'Por asignar'
                      : elemento.specialty}
                  </span>
                </td>

                <td className="px-3 py-3">
                  {elemento.teacherAssignments.length > 0 ? (
                    <div className="max-w-md">
                      <p className="text-xs font-semibold text-slate-800">
                        {elemento.teacherAssignments.length} vínculos materia–curso
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {materiasdistintas.length} materias distintas · {cursosdistintos} cursos
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {materiasdistintas.slice(0, 4).map((materia) => (
                          <span
                            key={materia}
                            className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                          >
                            {materia}
                          </span>
                        ))}
                        {materiasdistintas.length > 4 && (
                          <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            +{materiasdistintas.length - 4} materias
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Sin materias en la gestión activa
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 font-mono text-slate-600 text-xs">{elemento.email}</td>

                {puedegestionar && (
                  <td className="py-3 pl-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => oneditar(elemento)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar datos y materias asignadas"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => oneliminar(elemento)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar docente (Baja lógica)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FamiliarTabla({
  data: datos,
  canManage: puedegestionar,
  onEdit: oneditar,
  onDelete: oneliminar,
  onResetPassword,
  onLink: onvincular,
}: {
  data: Array<{
    id: string;
    userId?: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    address?: string | null;
    occupation?: string | null;
    students: Array<{
      id: string;
      rude: string;
      firstName: string;
      lastName: string;
      relationship: string;
    }>;
  }>;
  canManage: boolean;
  onEdit: (familiar: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    address?: string | null;
    occupation?: string | null;
  }) => void;
  onDelete: (familiar: { id: string; firstName: string; lastName: string }) => void;
  onResetPassword?: (familiar: { userId: string; firstName: string; lastName: string; ci: string }) => void;
  onLink: (familiar: {
    id: string;
    firstName: string;
    lastName: string;
    students: Array<{
      id: string;
      rude: string;
      firstName: string;
      lastName: string;
      relationship: string;
    }>;
  }) => void;
}) {
  if (datos.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <UsersRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-medium text-slate-700">No se encontraron familiares</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <th className="py-3 pl-5 pr-3">Familiar</th>
            <th className="px-3 py-3">C.I.</th>
            <th className="px-3 py-3">Teléfono</th>
            <th className="px-3 py-3">Estudiantes</th>
            {puedegestionar && <th className="py-3 pl-3 pr-5 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {datos.map((elemento) => {
            const iniciales =
              `${elemento.firstName[0] ?? ''}${elemento.lastName[0] ?? ''}`.toUpperCase();
            return (
              <tr key={elemento.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center">
                      {iniciales}
                    </div>
                    <span className="font-medium text-slate-900">
                      {elemento.firstName} {elemento.lastName}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3 font-mono text-slate-700">{elemento.ci}</td>

                <td className="px-3 py-3 font-mono text-slate-600 text-xs">{elemento.phone}</td>

                <td className="px-3 py-3">
                  {elemento.students && elemento.students.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {elemento.students.map((estado) => (
                        <span
                          key={estado.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                          title={`${etiquetaparentesco(estado.relationship)} · RUDE ${estado.rude}`}
                        >
                          {estado.firstName} {estado.lastName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">Sin estudiantes</span>
                  )}
                </td>

                {puedegestionar && (
                  <td className="py-3 pl-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onResetPassword && elemento.userId && (
                        <button
                          type="button"
                          onClick={() =>
                            onResetPassword({
                              userId: elemento.userId!,
                              firstName: elemento.firstName,
                              lastName: elemento.lastName,
                              ci: elemento.ci,
                            })
                          }
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Restablecer / Cambiar contraseña de acceso"
                          aria-label={`Cambiar contraseña de ${elemento.firstName} ${elemento.lastName}`}
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onvincular(elemento)}
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        title="Vincular estudiante"
                        aria-label={`Vincular estudiante a ${elemento.firstName} ${elemento.lastName}`}
                      >
                        <Link2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => oneditar(elemento)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar familiar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => oneliminar(elemento)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar familiar (Baja lógica)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function etiquetaparentesco(valor: string): string {
  const etiquetas: Record<string, string> = {
    FATHER: 'Padre',
    MOTHER: 'Madre',
    GUARDIAN: 'Apoderado',
    TUTOR: 'Tutor',
    OTHER: 'Otro familiar',
  };
  return etiquetas[valor] ?? 'Familiar';
}

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
