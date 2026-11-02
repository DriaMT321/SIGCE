import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import type {
  asistenciaestado,
  asistenciacursoopcion,
  gestionasistencia,
  registroasistenciaentrada,
} from '../application/gestionasistencia';

const etiquetas: Record<asistenciaestado, string> = {
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  LATE: 'Atrasado',
  JUSTIFIED: 'Justificado',
};

function fechaactual(): string {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

export function Planillaasistenciacurso({
  management: gestion,
  courses: cursos,
}: {
  management: gestionasistencia;
  courses: asistenciacursoopcion[];
}) {
  const clientedeconsultas = useQueryClient();
  const [cursoid, establecercursoid] = useState('');
  const [fecha, establecerfecha] = useState(fechaactual);
  const [estados, establecerestados] = useState<Record<string, asistenciaestado>>({});
  const [motivos, establecermotivos] = useState<Record<string, string>>({});
  const [guardados, establecerguardados] = useState<string[]>([]);
  const [resultado, establecerresultado] = useState<{
    guardados: string[];
    fallidos: Array<{ studentId: string; message: string }>;
  } | null>(null);

  const estudiantes = useQuery({
    queryKey: ['attendance-sheet-students', cursoid],
    queryFn: () => gestion.listarestudiantes(cursoid),
    enabled: Boolean(cursoid),
  });
  const asistencias = useQuery({
    queryKey: ['attendance-sheet-existing', cursoid, fecha],
    queryFn: () => gestion.listarasistenciacursofecha(cursoid, fecha),
    enabled: Boolean(cursoid && fecha),
  });
  const existentes = new Map(
    (asistencias.data ?? []).map((registro) => [registro.studentId, registro]),
  );
  const estudiantescurso = estudiantes.data ?? [];
  const pendientes = estudiantescurso.filter(
    (estudiante) => !existentes.has(estudiante.id) && !guardados.includes(estudiante.id),
  );

  const guardar = useMutation({
    mutationFn: (entradas: registroasistenciaentrada[]) =>
      gestion.registrarasistenciascurso(entradas),
    onSuccess: (respuesta) => {
      establecerguardados((actuales) => [...new Set([...actuales, ...respuesta.guardados])]);
      establecerresultado(respuesta);
      void clientedeconsultas.invalidateQueries({ queryKey: ['attendance'] });
      void clientedeconsultas.invalidateQueries({
        queryKey: ['attendance-sheet-existing', cursoid, fecha],
      });
    },
  });

  const limpiarseleccion = () => {
    establecerestados({});
    establecermotivos({});
    establecerguardados([]);
    establecerresultado(null);
    guardar.reset();
  };

  const enviar = () => {
    const entradas = pendientes.map((estudiante) => ({
      studentId: estudiante.id,
      courseId: cursoid,
      date: fecha,
      status: estados[estudiante.id] ?? 'PRESENT',
      justification: motivos[estudiante.id],
    }));
    guardar.mutate(entradas);
  };

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
      aria-labelledby="titulo-planilla-asistencia"
    >
      <div>
        <h2 id="titulo-planilla-asistencia" className="font-semibold text-slate-900">
          Tomar asistencia por curso
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Todos comienzan como presentes. Cambia únicamente las excepciones y guarda la lista.
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Curso
          <select
            value={cursoid}
            disabled={guardar.isPending}
            onChange={(evento) => {
              limpiarseleccion();
              establecercursoid(evento.target.value);
            }}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="">Selecciona un curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {cursoetiqueta(curso.name)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Fecha
          <input
            type="date"
            value={fecha}
            disabled={guardar.isPending}
            onChange={(evento) => {
              limpiarseleccion();
              establecerfecha(evento.target.value);
            }}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
          />
        </label>
      </div>

      {cursoid && fecha && (estudiantes.isLoading || asistencias.isLoading) && (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando la lista y los registros existentes…
        </p>
      )}
      {cursoid && (estudiantes.isError || asistencias.isError) && (
        <div role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
          No se pudo cargar la lista completa o comprobar los registros existentes. Vuelve a
          intentarlo antes de guardar.
          <button
            type="button"
            onClick={() => {
              void estudiantes.refetch();
              void asistencias.refetch();
            }}
            className="ml-2 font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}
      {cursoid &&
        fecha &&
        estudiantes.isSuccess &&
        asistencias.isSuccess &&
        !asistencias.isFetching && (
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-sm text-slate-600">
              <span>
                {estudiantescurso.length} estudiantes · {pendientes.length} pendientes
              </span>
              <span>Los registros guardados se conservan sin cambios.</span>
            </div>
            {estudiantescurso.length === 0 ? (
              <p className="py-6 text-sm text-slate-600">
                No hay estudiantes activos en este curso o no tienes asignación para consultarlo.
              </p>
            ) : (
              <div className="mt-2 max-h-96 overflow-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th className="p-3">Estudiante</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Motivo de justificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {estudiantescurso.map((estudiante) => {
                      const existente = existentes.get(estudiante.id);
                      const bloqueado = Boolean(existente || guardados.includes(estudiante.id));
                      const estado = existente?.status ?? estados[estudiante.id] ?? 'PRESENT';
                      const nombre = `${estudiante.firstName} ${estudiante.lastName}`;
                      return (
                        <tr key={estudiante.id}>
                          <th scope="row" className="p-3 font-medium text-slate-900">
                            {nombre}
                            {bloqueado && (
                              <span className="ml-2 text-xs font-normal text-slate-500">
                                Ya registrado
                              </span>
                            )}
                          </th>
                          <td className="p-3">
                            <select
                              aria-label={`Asistencia de ${nombre}`}
                              value={estado}
                              disabled={bloqueado || guardar.isPending}
                              onChange={(evento) =>
                                establecerestados((actuales) => ({
                                  ...actuales,
                                  [estudiante.id]: evento.target.value as asistenciaestado,
                                }))
                              }
                              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 disabled:bg-slate-50"
                            >
                              {Object.entries(etiquetas).map(([valor, etiqueta]) => (
                                <option key={valor} value={valor}>
                                  {etiqueta}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3">
                            {estado === 'JUSTIFIED' ? (
                              <input
                                aria-label={`Motivo de ${nombre}`}
                                value={existente?.justification ?? motivos[estudiante.id] ?? ''}
                                onChange={(evento) =>
                                  establecermotivos((actuales) => ({
                                    ...actuales,
                                    [estudiante.id]: evento.target.value,
                                  }))
                                }
                                disabled={bloqueado || guardar.isPending}
                                maxLength={500}
                                placeholder="Indica el motivo"
                                className="h-9 w-full rounded-md border border-slate-300 px-2 disabled:bg-slate-50"
                              />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {guardar.isError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {guardar.error.message}
              </p>
            )}
            {resultado && (
              <div
                role={resultado.fallidos.length ? 'alert' : 'status'}
                className={`mt-3 rounded-lg p-3 text-sm ${resultado.fallidos.length ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'}`}
              >
                <p>
                  Se guardaron {resultado.guardados.length} registros.{' '}
                  {resultado.fallidos.length > 0 &&
                    `${resultado.fallidos.length} no se pudieron guardar; puedes revisar y reintentar los pendientes.`}
                </p>
                {resultado.fallidos.length > 0 && (
                  <ul className="mt-2 list-disc pl-5">
                    {resultado.fallidos.map((fallo) => {
                      const estudiante = estudiantescurso.find(
                        (item) => item.id === fallo.studentId,
                      );
                      return (
                        <li key={fallo.studentId}>
                          {estudiante
                            ? `${estudiante.firstName} ${estudiante.lastName}`
                            : 'Estudiante'}
                          : {fallo.message}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Boton
                type="button"
                disabled={!pendientes.length || guardar.isPending || asistencias.isFetching}
                onClick={enviar}
              >
                {guardar.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Guardar{' '}
                {pendientes.length} pendientes
              </Boton>
            </div>
          </>
        )}
    </section>
  );
}
