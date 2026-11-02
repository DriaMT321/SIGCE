import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type { sieestudiantecomparacionresultado } from '../application/esquemasincronizacionsie';

interface tablaresultadosauditoriasiepropiedades {
  resultados: sieestudiantecomparacionresultado[];
  ejecutando: boolean;
  rudecopiado: string | null;
  alcopiarrude: (rude: string) => void;
  alverdetalle: (estudiante: sieestudiantecomparacionresultado) => void;
}

export function Tablaresultadosauditoriasie({
  resultados,
  ejecutando,
  rudecopiado,
  alcopiarrude,
  alverdetalle,
}: tablaresultadosauditoriasiepropiedades) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Resultados de la comparación de calificaciones SIE</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
              <th scope="col" className="py-3 pl-5 pr-3">
                Estudiante
              </th>
              <th scope="col" className="px-3 py-3">
                Curso
              </th>
              <th scope="col" className="px-3 py-3 text-center">
                SIE
              </th>
              <th scope="col" className="px-3 py-3 text-center">
                SIGCE
              </th>
              <th scope="col" className="px-3 py-3 text-center">
                Diferencia
              </th>
              <th scope="col" className="px-3 py-3 text-center">
                Estado
              </th>
              <th scope="col" className="py-3 pl-3 pr-5 text-right">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resultados.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  {ejecutando ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
                      <p className="font-medium text-slate-800">Ejecutando auditoría...</p>
                      <p className="text-sm text-slate-400">Verificando notas del portal SIE.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <GraduationCap className="h-8 w-8 text-slate-300" aria-hidden="true" />
                      <p className="font-medium text-slate-700">No hay registros</p>
                      <p className="text-sm text-slate-400">
                        Inicie una auditoría para cotejar notas.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              resultados.map((estudiante) => {
                const diferencia =
                  Math.round((estudiante.sieAverage - estudiante.sigceAverage) * 10) / 10;

                return (
                  <tr key={estudiante.rude} className="transition-colors hover:bg-slate-50">
                    <td className="py-3 pl-5 pr-3">
                      <div className="font-semibold text-slate-900">{estudiante.studentName}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-slate-500">
                        <span>RUDE: {estudiante.rude}</span>
                        <button
                          type="button"
                          onClick={() => alcopiarrude(estudiante.rude)}
                          className="text-slate-400 hover:text-slate-600"
                          title="Copiar RUDE"
                          aria-label={`Copiar RUDE ${estudiante.rude}`}
                        >
                          {rudecopiado === estudiante.rude ? (
                            <Check className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                          ) : (
                            <Copy className="h-3 w-3" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-block max-w-[200px] truncate rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {estudiante.courseName}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-semibold text-slate-900">
                      {estudiante.sieAverage > 0 ? estudiante.sieAverage : '—'}
                    </td>
                    <td className="px-3 py-3 text-center font-mono font-semibold text-slate-900">
                      {estudiante.sigceAverage > 0 ? estudiante.sigceAverage : '—'}
                    </td>
                    <td className="px-3 py-3 text-center font-mono">
                      {estudiante.sieAverage > 0 && estudiante.sigceAverage > 0 ? (
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${
                            diferencia === 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : diferencia > 0
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {diferencia > 0 ? `+${diferencia}` : diferencia}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {estudiante.overallMatch ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          Coincide
                        </span>
                      ) : estudiante.totalDiscrepancies > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          {estudiante.totalDiscrepancies} discrepancias
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          Registrado
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-3 pr-5 text-right">
                      <Boton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => alverdetalle(estudiante)}
                        className="h-7 px-2.5 text-xs"
                      >
                        <BookOpen className="mr-1 h-3 w-3" aria-hidden="true" />
                        Ver
                      </Boton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
