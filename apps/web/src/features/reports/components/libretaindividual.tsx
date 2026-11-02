import { Fragment, useMemo, useState } from 'react';
import {
  gradomaximoprimaria,
  gradomaximosecundaria,
  obtenierniveleducativoregular,
} from '@academic/academic-domain';
import { promediovalores } from '../application/datosdeinformes';
import {
  anodegestion,
  usardatosinstitucionales,
  type datosinstitucionales,
} from '../presentation/datosinstitucionales';
import { cursoetiqueta } from '../../../lib/cursoetiqueta';
import type {
  informecalificacionregistro,
  informecurso,
  informeestudiante,
  informemateria,
  informeperiodo,
} from '../application/consultasdeinformes';

interface libretaindividualprops {
  curso: informecurso;
  estudiante: informeestudiante;
  materias: informemateria[];
  periodos: informeperiodo[];
  calificaciones: informecalificacionregistro[];
  tamanopapel: 'legal' | 'letter';
}

const periodoslibreta = (periodos: informeperiodo[]) =>
  [...periodos]
    .filter((periodo) => periodo.number >= 1 && periodo.number <= 3)
    .sort((a, b) => a.number - b.number);

const trimestres = [1, 2, 3] as const;

function literalanual(valor: number | null) {
  if (valor === null) return '—';
  if (valor <= 50) return 'En desarrollo (ED)';
  if (valor <= 68) return 'Desarrollo aceptable (DA)';
  if (valor <= 84) return 'Desarrollo óptimo (DO)';
  return 'Desarrollo pleno (DP)';
}

function fechacorta(valor: string) {
  const fecha = new Date(`${valor.slice(0, 10)}T00:00:00`);
  return Number.isNaN(fecha.getTime())
    ? '—'
    : fecha.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const celdalibreta = 'border border-slate-500 px-1.5 py-1.5 align-middle';

export function LibretaIndividual({
  curso,
  estudiante,
  materias: catalogomaterias,
  periodos,
  calificaciones,
  tamanopapel,
}: libretaindividualprops) {
  const [datosinstitucionales, establecerdatosinstitucionales] = usardatosinstitucionales();
  const [mostrarRude, establecerMostrarRude] = useState(true);
  const periodoscurso = useMemo(() => periodoslibreta(periodos), [periodos]);
  const inscripcion = estudiante.enrollments.find(
    (item) =>
      item.status === 'ACTIVE' &&
      item.course.id === curso.id &&
      item.academicYear.id === curso.academicYearId,
  );
  const notas = useMemo(
    () => calificaciones.filter((nota) => nota.enrollmentId === inscripcion?.id),
    [calificaciones, inscripcion?.id],
  );
  const materias = useMemo(() => {
    const porId = new Map<string, { id: string; nombre: string; area: string }>();
    for (const materia of catalogomaterias) {
      porId.set(materia.id, {
        id: materia.id,
        nombre: materia.name,
        area: materia.area?.trim() || 'Área curricular',
      });
    }
    for (const nota of notas) {
      porId.set(nota.subjectId, {
        id: nota.subjectId,
        nombre: nota.subject.name,
        area: nota.subject.area?.trim() || porId.get(nota.subjectId)?.area || 'Área curricular',
      });
    }
    return [...porId.values()].sort(
      (a, b) => a.area.localeCompare(b.area, 'es') || a.nombre.localeCompare(b.nombre, 'es'),
    );
  }, [catalogomaterias, notas]);
  const gruposmaterias = useMemo(() => {
    const grupos = new Map<string, typeof materias>();
    materias.forEach((materia) =>
      grupos.set(materia.area, [...(grupos.get(materia.area) ?? []), materia]),
    );
    return [...grupos.entries()];
  }, [materias]);

  const notaDe = (materiaid: string, periodoid: string) =>
    notas.find((nota) => nota.subjectId === materiaid && nota.periodId === periodoid)?.value ??
    null;
  const notaDelTrimestre = (materiaid: string, trimestre: number) => {
    const periodo = periodoscurso.find((item) => item.number === trimestre);
    return periodo ? notaDe(materiaid, periodo.id) : null;
  };
  const titulo = 'LIBRETA ESCOLAR ELECTRÓNICA';
  const nivel = obtenierniveleducativoregular(curso.gradeLevel);
  const nombrenivel =
    nivel === 'INITIAL'
      ? 'EDUCACIÓN INICIAL EN FAMILIA COMUNITARIA'
      : nivel === 'PRIMARY'
        ? 'EDUCACIÓN PRIMARIA COMUNITARIA VOCACIONAL'
        : 'EDUCACIÓN SECUNDARIA COMUNITARIA PRODUCTIVA';
  const esultimocurso =
    curso.gradeLevel === gradomaximoprimaria || curso.gradeLevel === gradomaximosecundaria;
  const cambiarDato = (campo: keyof datosinstitucionales, valor: string) =>
    establecerdatosinstitucionales((datos) => ({ ...datos, [campo]: valor }));

  return (
    <>
      <style>{`
        .libreta-solo-impresion { display: none; }
        @page { size: ${tamanopapel} landscape; margin: 8mm; }
        @media print {
          body * { visibility: hidden !important; }
          .reporte-con-libreta > div:first-child { display: none !important; }
          #libreta-individual, #libreta-individual * { visibility: visible !important; }
          #libreta-individual {
            position: absolute !important; inset: 0 auto auto 0 !important;
            width: 100% !important; max-width: none !important; min-width: 0 !important;
            margin: 0 !important; padding: 0 !important; border: 0 !important;
            border-radius: 0 !important; overflow: visible !important; box-shadow: none !important;
          }
          .libreta-papel { overflow: visible !important; padding: 0 !important; break-inside: avoid-page !important; }
          .libreta-no-imprimir { display: none !important; }
          .libreta-solo-impresion { display: block !important; }
          .libreta-tabla { width: 100% !important; min-width: 0 !important; table-layout: fixed !important; font-size: 9pt !important; }
          .libreta-tabla th, .libreta-tabla td { min-width: 0 !important; padding: 4pt !important; line-height: 1.15 !important; }
          .libreta-cabecera { min-width: 0 !important; }
          .libreta-firmas { break-inside: avoid; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <section
        id="libreta-individual"
        className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-xl border border-slate-300 bg-white p-4 text-slate-950 sm:p-6"
      >
        <div className="libreta-papel relative overflow-x-auto">
          <header className="libreta-cabecera grid min-w-[760px] grid-cols-[1fr_2fr_1.15fr] items-center gap-4 pb-4">
            <div className="flex items-center gap-2">
              <img src="/logo-sf.png" alt="" className="h-12 w-9 object-contain" />
              <div>
                <p className="text-[10px] font-bold uppercase sm:text-xs">
                  Colegio Comunidad Cristiana
                </p>
                <p className="text-[8px] text-slate-600">Estado Plurinacional de Bolivia</p>
                <p className="text-[8px] text-slate-600">Sistema de Gestión Académica</p>
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-serif text-lg font-bold sm:text-2xl">{titulo}</h2>
              <p className="font-serif text-xs font-semibold sm:text-sm">{nombrenivel}</p>
            </div>
            <div className="justify-self-end">
              <table className="border-collapse text-[7px] leading-tight">
                <caption className="mb-1 font-semibold">Rango de valoración</caption>
                <tbody>
                  {[
                    ['En desarrollo', 'ED', 'Hasta 50'],
                    ['Desarrollo aceptable', 'DA', '51–68'],
                    ['Desarrollo óptimo', 'DO', '69–84'],
                    ['Desarrollo pleno', 'DP', '85–100'],
                  ].map(([nivel, sigla, rango]) => (
                    <tr key={sigla}>
                      {[nivel, sigla, rango].map((valor) => (
                        <td key={valor} className="border border-slate-500 px-1 py-0.5">
                          {valor}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </header>

          <div className="grid min-w-[760px] grid-cols-2 gap-x-8 gap-y-2 border-y border-slate-500 py-2 text-[9px]">
            <p>
              <b>UNIDAD EDUCATIVA:</b> Colegio Comunidad Cristiana
            </p>
            <p>
              <b>DEPARTAMENTO:</b> Santa Cruz
            </p>
            <label className="libreta-no-imprimir flex items-center gap-1">
              <b>DISTRITO EDUCATIVO:</b>
              <input
                value={datosinstitucionales.distrito}
                onChange={(evento) => cambiarDato('distrito', evento.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <p className="libreta-solo-impresion">
              <b>DISTRITO EDUCATIVO:</b> {datosinstitucionales.distrito || '________________'}
            </p>
            <p>
              <b>DEPENDENCIA:</b> Particular
            </p>
            <p>
              <b>TURNO:</b>{' '}
              {curso.shift === 'MORNING'
                ? 'MAÑANA'
                : curso.shift === 'AFTERNOON'
                  ? 'TARDE'
                  : curso.shift === 'EVENING'
                    ? 'NOCHE'
                    : curso.shift}
            </p>
            <p>
              <b>GESTIÓN:</b> {anodegestion(curso.academicYear.name)}
            </p>
            <p>
              <b>IDIOMA:</b> CASTELLANO
            </p>
            <label className="libreta-no-imprimir flex items-center gap-1">
              <b>CÓDIGO SIE:</b>
              <input
                value={datosinstitucionales.codigoSie}
                onChange={(evento) => cambiarDato('codigoSie', evento.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <p className="libreta-solo-impresion">
              <b>CÓDIGO SIE:</b> {datosinstitucionales.codigoSie || '________________'}
            </p>
          </div>

          <div className="grid min-w-[760px] grid-cols-[1.15fr_2fr_1fr] gap-3 border-b border-slate-700 py-2 text-[9px]">
            <label className="libreta-no-imprimir flex items-center gap-1">
              <b>RUDE:</b>
              <input
                type="checkbox"
                checked={mostrarRude}
                onChange={(evento) => establecerMostrarRude(evento.target.checked)}
              />
              {mostrarRude ? estudiante.rude : 'Oculto'}
            </label>
            {mostrarRude && (
              <p className="libreta-solo-impresion">
                <b>CÓDIGO RUDE:</b> {estudiante.rude}
              </p>
            )}
            <p>
              <b>APELLIDOS Y NOMBRES:</b> {estudiante.lastName} {estudiante.firstName}
            </p>
            <p>
              <b>AÑO DE ESCOLARIDAD:</b> {cursoetiqueta(curso.name)}
            </p>
            <p>
              <b>FECHA DE NACIMIENTO:</b> {fechacorta(estudiante.birthDate)}
            </p>
          </div>

          <div className="libreta-no-imprimir flex items-center justify-between gap-3 py-2 text-xs text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={mostrarRude}
                onChange={(evento) => establecerMostrarRude(evento.target.checked)}
              />
              Mostrar RUDE en la impresión
            </label>
            <p>Seleccione el curso y estudiante arriba para cambiar la libreta.</p>
          </div>

          <table className="libreta-tabla min-w-[760px] w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={7}
                  className={`${celdalibreta} bg-slate-100 text-center font-semibold`}
                >
                  Evaluación (Ser, Saber, Hacer y Decidir)
                </th>
              </tr>
              <tr className="bg-slate-100 text-center font-semibold">
                <th rowSpan={3} className={`${celdalibreta} w-[23%]`}>
                  Campo o área general
                </th>
                <th rowSpan={3} className={`${celdalibreta} w-[29%]`}>
                  Área curricular / asignatura
                </th>
                <th colSpan={5} className={celdalibreta}>
                  Valoración cuantitativa
                </th>
              </tr>
              <tr className="bg-slate-50 text-center font-semibold">
                <th rowSpan={2} className={celdalibreta}>
                  1er. Trimestre
                </th>
                <th rowSpan={2} className={celdalibreta}>
                  2do. Trimestre
                </th>
                <th rowSpan={2} className={celdalibreta}>
                  3er. Trimestre
                </th>
                <th colSpan={2} className={celdalibreta}>
                  Promedio anual
                </th>
              </tr>
              <tr className="bg-slate-50 text-center font-semibold">
                <th className={celdalibreta}>Numeral</th>
                <th className={celdalibreta}>Literal</th>
              </tr>
            </thead>
            <tbody>
              {gruposmaterias.map(([area, grupo]) => (
                <Fragment key={area}>
                  {grupo.map((materia, indice) => {
                    const valores = trimestres.map((trimestre) =>
                      notaDelTrimestre(materia.id, trimestre),
                    );
                    const promedio = valores.every((valor): valor is number => valor !== null)
                      ? promediovalores(valores)
                      : null;
                    return (
                      <tr key={materia.id}>
                        {indice === 0 && (
                          <td rowSpan={grupo.length} className={`${celdalibreta} font-medium`}>
                            {area.toLocaleUpperCase('es')}
                          </td>
                        )}
                        <td className={celdalibreta}>{materia.nombre}</td>
                        {trimestres.map((trimestre) => (
                          <td key={trimestre} className={`${celdalibreta} text-center`}>
                            {notaDelTrimestre(materia.id, trimestre) ?? '—'}
                          </td>
                        ))}
                        <td className={`${celdalibreta} text-center font-semibold`}>
                          {promedio ?? '—'}
                        </td>
                        <td className={`${celdalibreta} text-center`}>{literalanual(promedio)}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
              {materias.length === 0 && (
                <tr>
                  <td colSpan={7} className={`${celdalibreta} text-center`}>
                    No hay áreas curriculares configuradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="py-2 text-[8px]">
            <b>{esultimocurso ? 'Informe de promoción:' : 'Observaciones:'}</b>
            <span className="ml-2 inline-block min-w-[60%] border-b border-slate-400">&nbsp;</span>
            <p className="mt-1 text-slate-600">
              El promedio anual se muestra cuando existen notas en los tres trimestres. La escala
              literal se toma del modelo de referencia y debe validarse con la institución. La
              situación final no se asigna automáticamente.
            </p>
          </div>

          <footer className="libreta-firmas grid grid-cols-3 gap-6 pt-12 text-center text-[8px]">
            {[
              'MAESTRA/MAESTRO - FIRMA',
              'UNIDAD EDUCATIVA - SELLO',
              'DIRECTORA/DIRECTOR - FIRMA',
            ].map((leyenda) => (
              <div key={leyenda} className="border-t border-slate-800 pt-1 font-semibold">
                {leyenda}
              </div>
            ))}
          </footer>

          <div className="mt-3 flex items-end justify-between gap-4 text-[7px] text-slate-600">
            <p className="max-w-[75%]">
              Documento de consulta generado por SIGCE. No reemplaza la libreta oficial ni es válido
              para trámites.
            </p>
            <p className="shrink-0">Impresión: {new Date().toLocaleDateString('es-BO')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
