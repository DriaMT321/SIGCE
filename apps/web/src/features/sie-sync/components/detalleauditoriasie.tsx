import { BookOpen, X } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type { sieestudiantecomparacionresultado } from '../application/esquemasincronizacionsie';

interface detalleauditoriasiepropiedades {
  estudiante: sieestudiantecomparacionresultado;
  alcerrar: () => void;
}

export function Detalleauditoriasie({ estudiante, alcerrar }: detalleauditoriasiepropiedades) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) alcerrar();
      }}
    >
      <section
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-auditoria-sie-titulo"
      >
        <header className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-600" aria-hidden="true" />
              <h2 id="detalle-auditoria-sie-titulo" className="text-base font-bold text-slate-900">
                {estudiante.studentName}
              </h2>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <span>
                RUDE: <strong className="font-mono text-slate-700">{estudiante.rude}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Curso: <strong className="text-slate-700">{estudiante.courseName}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar detalle"
            onClick={alcerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="my-4 grid grid-cols-3 gap-3">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-medium text-slate-400 block uppercase">Promedio SIE</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {estudiante.sieAverage}
            </span>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-medium text-slate-400 block uppercase">
              Promedio SIGCE
            </span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {estudiante.sigceAverage}
            </span>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-medium text-slate-400 block uppercase">
              Discrepancias
            </span>
            <span
              className={`text-xl font-bold font-mono ${estudiante.totalDiscrepancies > 0 ? 'text-rose-600' : 'text-emerald-600'}`}
            >
              {estudiante.totalDiscrepancies}
            </span>
          </article>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Comparación de calificaciones por materia</caption>
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <th scope="col" className="py-2.5 pl-3.5 pr-2">
                  Asignatura SIE
                </th>
                <th scope="col" className="px-2 py-2.5">
                  Materia SIGCE
                </th>
                <th scope="col" className="px-2 py-2.5 text-center">
                  Nota SIE
                </th>
                <th scope="col" className="px-2 py-2.5 text-center">
                  Nota SIGCE
                </th>
                <th scope="col" className="px-2 py-2.5 text-center">
                  Diferencia
                </th>
                <th scope="col" className="py-2.5 pl-2 pr-3.5 text-right">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {estudiante.comparisons.map((comparacion, indice) => {
                const diferenciacadena =
                  comparacion.diff !== undefined
                    ? comparacion.diff > 0
                      ? `+${comparacion.diff}`
                      : `${comparacion.diff}`
                    : '—';

                return (
                  <tr key={`${comparacion.sieSubject}-${indice}`} className="hover:bg-slate-50">
                    <td className="py-2.5 pl-3.5 pr-2 font-medium text-slate-800">
                      {comparacion.sieSubject}
                    </td>
                    <td className="px-2 py-2.5 text-slate-600">
                      {comparacion.sigceSubject || '—'}
                    </td>
                    <td className="px-2 py-2.5 text-center font-mono font-semibold text-slate-900">
                      {comparacion.sieGrade1T ?? '—'}
                    </td>
                    <td className="px-2 py-2.5 text-center font-mono font-semibold text-slate-900">
                      {comparacion.sigceGrade1T ?? '—'}
                    </td>
                    <td className="px-2 py-2.5 text-center font-mono">
                      {comparacion.diff !== undefined ? (
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                            comparacion.diff === 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : comparacion.diff > 0
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {diferenciacadena}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 pl-2 pr-3.5 text-right font-medium">
                      {comparacion.status === 'COINCIDE' ? (
                        <span className="text-emerald-700">Coincide</span>
                      ) : comparacion.status === 'DISCREPANCIA' ? (
                        <span className="text-rose-600">Discrepancia</span>
                      ) : (
                        <span className="text-slate-500">Solo en SIE</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="mt-5 flex justify-end">
          <Boton type="button" size="sm" onClick={alcerrar} className="bg-slate-900 text-white">
            Cerrar
          </Boton>
        </footer>
      </section>
    </div>
  );
}
