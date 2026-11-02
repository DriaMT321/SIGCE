import type { FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Boton } from '../../../components/ui/boton';
import type {
  alertaregla,
  alertareglaentrada,
  alertareglaclave,
  gestionalertas,
} from '../application/gestionalertas';

function ReglaEditor({
  rule: regla,
  saving: guardando,
  onSave: onguardar,
}: {
  rule: alertaregla;
  saving: boolean;
  onSave: (clave: alertareglaclave, entrada: alertareglaentrada) => void;
}) {
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const valores = new FormData(evento.currentTarget);
    const entrada: alertareglaentrada = {
      enabled: valores.get('enabled') === 'on',
      severity: String(valores.get('severity')) as alertaregla['severity'],
      ...(regla.key === 'LOW_GRADE'
        ? { gradeThreshold: Number(valores.get('gradeThreshold')) }
        : {
            absenceThreshold: Number(valores.get('absenceThreshold')),
            absenceWindowDays: Number(valores.get('absenceWindowDays')),
          }),
    };
    onguardar(regla.key, entrada);
  }

  return (
    <form onSubmit={enviar} className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {regla.key === 'LOW_GRADE' ? 'Calificación bajo el umbral' : regla.key === 'REPEATED_LATENESS' ? 'Atrasos reiterados' : 'Inasistencias reiteradas'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {regla.key === 'LOW_GRADE'
              ? 'Se activa cuando una nota queda por debajo del valor configurado.'
              : regla.key === 'REPEATED_LATENESS'
                ? 'Cuenta los atrasos registrados en cursos de la gestión activa.'
                : 'Cuenta faltas no justificadas en cursos de la gestión activa.'}
          </p>
        </div>
        <label className="flex min-h-10 items-center gap-2 text-sm text-slate-700">
          <input
            name="enabled"
            type="checkbox"
            defaultChecked={regla.enabled}
            className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-700"
          />
          Activa
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {regla.key === 'LOW_GRADE' ? (
          <label className="text-xs font-medium text-slate-700">
            Nota mínima
            <input
              name="gradeThreshold"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              defaultValue={regla.gradeThreshold ?? 51}
              className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
            />
          </label>
        ) : (
          <>
            <label className="text-xs font-medium text-slate-700">
              {regla.key === 'REPEATED_LATENESS' ? 'Número de atrasos' : 'Número de faltas'}
              <input
                name="absenceThreshold"
                type="number"
                min="1"
                max="30"
                step="1"
                required
                defaultValue={regla.absenceThreshold ?? 3}
                className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-slate-700">
              Ventana en días
              <input
                name="absenceWindowDays"
                type="number"
                min="1"
                max="365"
                step="1"
                required
                defaultValue={regla.absenceWindowDays ?? 7}
                className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
              />
            </label>
          </>
        )}
        <label className="text-xs font-medium text-slate-700">
          Prioridad
          <select
            name="severity"
            defaultValue={regla.severity}
            className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="INFO">Informativa</option>
            <option value="WARNING">Advertencia</option>
            <option value="DANGER">Urgente</option>
            <option value="SUCCESS">Confirmación</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <Boton type="submit" size="sm" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar regla'}
        </Boton>
      </div>
    </form>
  );
}

export function AlertaReglasPanel({ management: gestion }: { management: gestionalertas }) {
  const clientedeconsultas = useQueryClient();
  const reglasconsulta = useQuery({
    queryKey: ['alert-rules'],
    queryFn: () => gestion.listarreglas(),
  });
  const guardarregla = useMutation({
    mutationFn: ({
      key: clave,
      input: entrada,
    }: {
      key: alertaregla['key'];
      input: alertareglaentrada;
    }) => gestion.actualizarregla(clave, entrada),
    onSuccess: () => void clientedeconsultas.invalidateQueries({ queryKey: ['alert-rules'] }),
  });
  const evaluarexistente = useMutation({
    mutationFn: () => gestion.evaluarexistentealertas(),
    onSuccess: () => void clientedeconsultas.invalidateQueries({ queryKey: ['alerts'] }),
  });

  return (
    <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <summary className="min-h-10 cursor-pointer content-center text-sm font-semibold text-slate-800">
        Configurar alertas tempranas
      </summary>
      <p className="mb-4 mt-2 text-xs leading-5 text-slate-600">
        Guarda las reglas y evalúa los registros existentes para aplicar los cambios a toda la
        gestión activa.
      </p>
      {reglasconsulta.isLoading ? (
        <p className="py-4 text-sm text-slate-600">Cargando reglas…</p>
      ) : reglasconsulta.isError ? (
        <p role="alert" className="py-4 text-sm text-rose-700">
          No se pudieron cargar las reglas.
        </p>
      ) : (
        <div className="space-y-3">
          {(reglasconsulta.data ?? []).map((regla) => (
            <ReglaEditor
              key={regla.key + regla.updatedAt}
              rule={regla}
              saving={guardarregla.isPending}
              onSave={(clave, entrada) => guardarregla.mutate({ key: clave, input: entrada })}
            />
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <p className="max-w-xl text-xs leading-5 text-slate-600">
              La evaluación revisa notas, inasistencias y atrasos ya registrados de estudiantes activos.
            </p>
            <Boton
              type="button"
              size="sm"
              variant="outline"
              disabled={evaluarexistente.isPending || reglasconsulta.isLoading}
              onClick={() => evaluarexistente.mutate()}
            >
              {evaluarexistente.isPending ? 'Evaluando…' : 'Evaluar registros existentes'}
            </Boton>
          </div>
        </div>
      )}
      {guardarregla.isError && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          No se pudo guardar la regla. Revise los límites y vuelva a intentarlo.
        </p>
      )}
      {guardarregla.isSuccess && (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          Regla guardada.
        </p>
      )}
      {evaluarexistente.isError && (
        <p role="alert" className="mt-3 text-sm text-rose-700">
          No se pudo completar la evaluación general.
        </p>
      )}
      {evaluarexistente.isSuccess && (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          Evaluados: {evaluarexistente.data.evaluated}. Fallos: {evaluarexistente.data.failed}.
        </p>
      )}
    </details>
  );
}
