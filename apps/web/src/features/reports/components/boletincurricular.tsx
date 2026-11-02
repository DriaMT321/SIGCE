import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  gradomaximoprimaria,
  gradomaximosecundaria,
  obtenierniveleducativoregular,
} from '@academic/academic-domain';
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
import { promediocalificacion, promediovalores } from '../application/datosdeinformes';

interface boletincurricularprops {
  curso: informecurso;
  estudiantes: informeestudiante[];
  materias: informemateria[];
  periodos: informeperiodo[];
  calificaciones: informecalificacionregistro[];
}

const periodosboletin = (periodos: informeperiodo[]) =>
  [...periodos]
    .filter((periodo) => periodo.number >= 1 && periodo.number <= 3)
    .sort((a, b) => a.number - b.number);

const inscripcionactiva = (estudiante: informeestudiante, curso: informecurso) =>
  estudiante.enrollments.find(
    (inscripcion) =>
      inscripcion.status === 'ACTIVE' &&
      inscripcion.course.id === curso.id &&
      inscripcion.academicYear.id === curso.academicYearId,
  );

function formatearfecha(valor: string) {
  const fecha = new Date(`${valor.slice(0, 10)}T00:00:00`);
  return Number.isNaN(fecha.getTime())
    ? '—'
    : fecha.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const celdaboletin = 'border border-slate-500 px-1 py-1 text-center align-middle';

export function BoletinCurricular({
  curso,
  estudiantes,
  materias: catalogomaterias,
  periodos,
  calificaciones,
}: boletincurricularprops) {
  const [datos, establecerdatos] = usardatosinstitucionales();
  const hojaref = useRef<HTMLElement>(null);
  const [incluirRude, establecerincluirRude] = useState(true);
  const [tamanopapel, establecertamanopapel] = useState<'legal' | 'letter' | 'a3'>('legal');
  const periodoscurso = useMemo(() => periodosboletin(periodos), [periodos]);
  const alumnado = useMemo(
    () =>
      estudiantes
        .filter((estudiante) => inscripcionactiva(estudiante, curso))
        .sort((a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, 'es'),
        ),
    [curso, estudiantes],
  );
  const notas = useMemo(
    () =>
      calificaciones.filter((nota) =>
        periodoscurso.some((periodo) => periodo.id === nota.periodId),
      ),
    [calificaciones, periodoscurso],
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
        area: nota.subject.area?.trim() || 'Área curricular',
      });
    }
    return [...porId.values()].sort(
      (a, b) => a.area.localeCompare(b.area, 'es') || a.nombre.localeCompare(b.nombre, 'es'),
    );
  }, [catalogomaterias, notas]);
  const gruposmaterias = useMemo(() => {
    const grupos = new Map<string, typeof materias>();
    for (const materia of materias) {
      grupos.set(materia.area, [...(grupos.get(materia.area) ?? []), materia]);
    }
    return [...grupos.entries()];
  }, [materias]);

  const esUltimoCurso =
    curso.gradeLevel === gradomaximoprimaria || curso.gradeLevel === gradomaximosecundaria;
  const nivel = obtenierniveleducativoregular(curso.gradeLevel);
  const nombrenivel =
    nivel === 'PRIMARY'
      ? 'PRIMARIA COMUNITARIA VOCACIONAL'
      : nivel === 'SECONDARY'
        ? 'SECUNDARIA COMUNITARIA PRODUCTIVA'
        : 'EDUCACIÓN INICIAL';
  const titulo = esUltimoCurso ? 'BOLETÍN DE PROMOCIÓN' : 'BOLETÍN DE CALIFICACIONES';
  const nombreshorizonte = periodoscurso.length > 0 ? periodoscurso : [];
  const notaDe = (inscripcionId: string, materiaId: string, periodoId: string) =>
    notas.find(
      (nota) =>
        nota.enrollmentId === inscripcionId &&
        nota.subjectId === materiaId &&
        nota.periodId === periodoId,
    )?.value;

  const editar = (campo: keyof datosinstitucionales, valor: string) =>
    establecerdatos((actuales) => ({ ...actuales, [campo]: valor }));

  useEffect(() => {
    const ajustar = () => {
      const hoja = hojaref.current;
      const papel = hoja?.querySelector<HTMLElement>('.boletin-papel');
      if (!hoja || !papel) return;
      const ancho = tamanopapel === 'a3' ? 1530 : tamanopapel === 'legal' ? 1280 : 995;
      const alto = tamanopapel === 'a3' ? 1000 : 760;
      const escala = Math.min(
        1,
        ancho / Math.max(papel.scrollWidth, 1),
        alto / Math.max(papel.scrollHeight, 1),
      );
      hoja.style.setProperty('--boletin-escala', String(escala));
    };
    const limpiar = () => hojaref.current?.style.removeProperty('--boletin-escala');
    window.addEventListener('beforeprint', ajustar);
    window.addEventListener('afterprint', limpiar);
    return () => {
      window.removeEventListener('beforeprint', ajustar);
      window.removeEventListener('afterprint', limpiar);
    };
  }, [tamanopapel]);

  return (
    <>
      <style>{`
        .soloimpresion { display: none; }
        @page { size: ${tamanopapel === 'a3' ? 'A3' : tamanopapel} landscape; margin: 5mm; }
        @media print {
          body * { visibility: hidden !important; }
          #boletin-curricular, #boletin-curricular * { visibility: visible !important; }
          #boletin-curricular {
            position: absolute !important; inset: 0 auto auto 0 !important;
            width: 100% !important; max-width: none !important; min-width: 0 !important;
            margin: 0 !important; padding: 0 !important; border: 0 !important;
            border-radius: 0 !important; overflow: visible !important; box-shadow: none !important;
            zoom: var(--boletin-escala, 1) !important;
            break-inside: avoid-page !important;
          }
          .boletin-configuracion { display: none !important; }
          .boletin-papel { overflow: visible !important; padding: 0 !important; }
          .boletin-tabla { width: 100% !important; table-layout: fixed !important; font-size: ${tamanopapel === 'letter' ? '7.5pt' : '8pt'} !important; }
          .boletin-tabla { min-width: 0 !important; }
          .boletin-tabla-completa { display: ${tamanopapel === 'a3' ? 'table' : 'none'} !important; }
          .boletin-tabla-compacta { display: ${tamanopapel === 'a3' ? 'none' : 'table'} !important; }
          .boletin-cabecera, .boletin-metadata { min-width: 0 !important; }
          .boletin-tabla th, .boletin-tabla td { min-width: 0 !important; padding: 1pt !important; line-height: 1.1 !important; overflow-wrap: anywhere !important; }
          .boletin-tabla-compacta th, .boletin-tabla-compacta td { padding: 3pt 0.5pt !important; }
          .boletin-tabla-compacta td { overflow-wrap: normal !important; }
          .boletin-valores { font-size: 7pt !important; white-space: nowrap !important; letter-spacing: -0.08pt; }
          .boletin-tabla col.boletin-col-numero { width: 2% !important; }
          .boletin-tabla col.boletin-col-nombre { width: 15% !important; }
          .boletin-tabla col.boletin-col-rude { width: 9% !important; }
          .boletin-tabla col.boletin-col-sexo { width: 2% !important; }
          .boletin-tabla col.boletin-col-fecha { width: 5% !important; }
          .boletin-tabla col.boletin-col-promedio { width: 3% !important; }
          .boletin-tabla col.boletin-col-resultado { width: 3% !important; }
          .boletin-tabla-compacta col.boletin-col-nombre { width: 17% !important; }
          .boletin-tabla-compacta col.boletin-col-rude { width: 8% !important; }
          .boletin-tabla-compacta col.boletin-col-promedio { width: 4% !important; }
          .boletin-tabla-compacta col.boletin-col-resultado { width: 4% !important; }
          .boletin-tabla tbody tr { break-inside: avoid !important; }
          .boletin-cabecera { margin-bottom: 5pt !important; }
          .no-print { display: none !important; }
          .soloimpresion { display: block !important; }
          .boletin-watermark {
            position: fixed !important; inset: 0 !important; width: 100vw !important;
            height: 100vh !important; display: grid !important;
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      <section
        ref={hojaref}
        id="boletin-curricular"
        className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-xl border border-slate-300 bg-white p-4 text-slate-950 sm:p-6"
      >
        <div
          aria-hidden="true"
          className="boletin-watermark pointer-events-none absolute inset-0 z-10 hidden grid-cols-[repeat(9,max-content)] grid-rows-[repeat(22,1fr)] content-between justify-between overflow-hidden px-2 py-1 text-[7px] font-medium text-slate-500 opacity-[0.12] [print-color-adjust:exact]"
        >
          {Array.from({ length: 198 }, (_, indice) => (
            <span key={indice} className="whitespace-nowrap">
              NO VÁLIDO PARA TRÁMITES
            </span>
          ))}
        </div>

        <div className="boletin-papel relative z-0 overflow-x-auto">
          <header className="boletin-cabecera relative grid min-w-[900px] grid-cols-[1fr_2fr_1fr] items-center gap-3 pb-3">
            <div className="flex items-center gap-2">
              <img src="/logo-sf.png" alt="" className="h-10 w-8 object-contain" />
              <div>
                <p className="text-[10px] font-bold uppercase sm:text-xs">
                  Colegio Comunidad Cristiana
                </p>
                <p className="text-[8px] text-slate-600">Santa Cruz de la Sierra - Bolivia</p>
                <p className="text-[8px] text-slate-600">Planilla curricular por curso</p>
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-serif text-lg font-bold sm:text-2xl">{titulo}</h2>
              <p className="font-serif text-xs font-semibold sm:text-sm">{nombrenivel}</p>
              <p className="mt-1 text-[10px] font-semibold">
                GESTIÓN {anodegestion(curso.academicYear.name)}
              </p>
            </div>
            <div className="justify-self-end border border-slate-500 px-4 py-2 text-center">
              <p className="text-xs font-bold">VISTA PREVIA</p>
              <p className="text-[9px]">Planilla generada por SIGCE</p>
            </div>
          </header>

          <div className="boletin-metadata grid min-w-[900px] grid-cols-4 gap-x-4 gap-y-2 border-y border-slate-400 py-2 text-[9px]">
            <p>
              <b>DEPARTAMENTO:</b> Santa Cruz
            </p>
            <label className="no-print flex items-center gap-1">
              <b>DISTRITO:</b>
              <input
                value={datos.distrito}
                onChange={(e) => editar('distrito', e.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <label className="no-print flex items-center gap-1">
              <b>CÓDIGO SIE:</b>
              <input
                value={datos.codigoSie}
                onChange={(e) => editar('codigoSie', e.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <p>
              <b>GESTIÓN:</b> {anodegestion(curso.academicYear.name)}
            </p>
            <p>
              <b>NIVEL:</b> {nombrenivel}
            </p>
            <p>
              <b>CURSO:</b> {cursoetiqueta(curso.name)}
            </p>
            <p>
              <b>PARALELO:</b> {curso.section}
            </p>
            <p>
              <b>TURNO:</b>{' '}
              {curso.shift === 'MORNING'
                ? 'Mañana'
                : curso.shift === 'AFTERNOON'
                  ? 'Tarde'
                  : curso.shift === 'EVENING'
                    ? 'Noche'
                    : curso.shift}
            </p>
            <p>
              <b>UNIDAD EDUCATIVA:</b> Colegio Comunidad Cristiana
            </p>
            <label className="no-print flex items-center gap-1">
              <b>DIRECTOR/A:</b>
              <input
                value={datos.director}
                onChange={(e) => editar('director', e.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <label className="no-print flex items-center gap-1">
              <b>DIRECCIÓN:</b>
              <input
                value={datos.direccion}
                onChange={(e) => editar('direccion', e.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <label className="no-print flex items-center gap-1">
              <b>TELÉFONO:</b>
              <input
                value={datos.telefono}
                onChange={(e) => editar('telefono', e.target.value)}
                placeholder="Configurar"
                className="min-w-0 border-b border-dashed border-slate-400 bg-transparent outline-none"
              />
            </label>
            <p className="soloimpresion">
              <b>DISTRITO:</b> {datos.distrito || '________________'}
            </p>
            <p className="soloimpresion">
              <b>CÓDIGO SIE:</b> {datos.codigoSie || '________________'}
            </p>
            <p className="soloimpresion">
              <b>DIRECTOR/A:</b> {datos.director || '________________'}
            </p>
            <p className="soloimpresion">
              <b>DIRECCIÓN:</b> {datos.direccion || '________________'}
            </p>
            <p className="soloimpresion">
              <b>TELÉFONO:</b> {datos.telefono || '________________'}
            </p>
          </div>

          <div className="boletin-configuracion no-print flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={incluirRude}
                onChange={(evento) => establecerincluirRude(evento.target.checked)}
              />
              Incluir RUDE
            </label>
            <label className="inline-flex items-center gap-2">
              Papel
              <select
                value={tamanopapel}
                onChange={(evento) =>
                  establecertamanopapel(evento.target.value as typeof tamanopapel)
                }
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-900"
              >
                <option value="legal">Oficio horizontal</option>
                <option value="letter">Carta horizontal</option>
                <option value="a3">A3 horizontal (tabla completa)</option>
              </select>
            </label>
            <p>
              Imprime sin encabezados ni pies del navegador. En carta y oficio, cada materia muestra
              T1 · T2 · T3 · promedio en una celda.
            </p>
          </div>

          {nombreshorizonte.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-600">
              No hay trimestres configurados para esta gestión.
            </p>
          ) : materias.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-600">
              No hay calificaciones registradas para formar las columnas de materias.
            </p>
          ) : (
            <>
              <table className="boletin-tabla boletin-tabla-completa min-w-[1200px] border-collapse text-[8px]">
                <colgroup>
                  <col className="boletin-col-numero" />
                  <col className="boletin-col-nombre" />
                  {incluirRude && <col className="boletin-col-rude" />}
                  <col className="boletin-col-sexo" />
                  <col className="boletin-col-fecha" />
                  {materias.flatMap((materia) =>
                    Array.from({ length: nombreshorizonte.length + 1 }, (_, indice) => (
                      <col key={`${materia.id}-${indice}`} />
                    )),
                  )}
                  <col className="boletin-col-promedio" />
                  <col className="boletin-col-resultado" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-100">
                    <th rowSpan={3} className={celdaboletin}>
                      N.º
                    </th>
                    <th rowSpan={3} className={`${celdaboletin} min-w-40`}>
                      Apellidos y nombres
                    </th>
                    {incluirRude && (
                      <th rowSpan={3} className={celdaboletin}>
                        RUDE
                      </th>
                    )}
                    <th rowSpan={3} className={celdaboletin}>
                      Sexo
                    </th>
                    <th rowSpan={3} className={celdaboletin}>
                      Fecha nac.
                    </th>
                    {gruposmaterias.map(([area, grupo]) => (
                      <th
                        key={area}
                        colSpan={grupo.length * (nombreshorizonte.length + 1)}
                        className={celdaboletin}
                      >
                        {area}
                      </th>
                    ))}
                    <th rowSpan={3} className={celdaboletin}>
                      Prom. general
                    </th>
                    <th rowSpan={3} className={celdaboletin}>
                      {esUltimoCurso ? 'Resultado' : 'Observación'}
                    </th>
                  </tr>
                  <tr className="bg-slate-50">
                    {materias.map((materia) => (
                      <th
                        key={materia.id}
                        colSpan={nombreshorizonte.length + 1}
                        className={`${celdaboletin} min-w-24`}
                      >
                        {materia.nombre}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-slate-50">
                    {materias.map((materia) => (
                      <Fragment key={materia.id}>
                        {nombreshorizonte.map((periodo) => (
                          <th key={`${materia.id}-${periodo.id}`} className={celdaboletin}>
                            T{periodo.number}
                          </th>
                        ))}
                        <th key={`${materia.id}-prom`} className={celdaboletin}>
                          Prom.
                        </th>
                      </Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alumnado.map((estudiante, indice) => {
                    const inscripcion = inscripcionactiva(estudiante, curso);
                    if (!inscripcion) return null;
                    const notasEstudiante = notas.filter(
                      (nota) => nota.enrollmentId === inscripcion.id,
                    );
                    const promedios = materias.map((materia) => {
                      const calificacionesMateria = notasEstudiante.filter(
                        (nota) => nota.subjectId === materia.id,
                      );
                      return promediocalificacion(calificacionesMateria);
                    });
                    return (
                      <tr key={estudiante.id} className={indice % 2 ? 'bg-slate-50' : 'bg-white'}>
                        <td className={celdaboletin}>{indice + 1}</td>
                        <td className={`${celdaboletin} text-left`}>
                          {estudiante.lastName} {estudiante.firstName}
                        </td>
                        {incluirRude && <td className={celdaboletin}>{estudiante.rude}</td>}
                        <td className={celdaboletin}>
                          {estudiante.gender === 'FEMALE'
                            ? 'F'
                            : estudiante.gender === 'MALE'
                              ? 'M'
                              : '—'}
                        </td>
                        <td className={celdaboletin}>{formatearfecha(estudiante.birthDate)}</td>
                        {materias.map((materia, indiceMateria) => {
                          const valores = nombreshorizonte.map((periodo) =>
                            notaDe(inscripcion.id, materia.id, periodo.id),
                          );
                          const promedio = promedios[indiceMateria];
                          return (
                            <Fragment key={materia.id}>
                              {valores.map((valor, indicePeriodo) => (
                                <td
                                  key={`${materia.id}-${nombreshorizonte[indicePeriodo].id}`}
                                  className={celdaboletin}
                                >
                                  {valor ?? '—'}
                                </td>
                              ))}
                              <td
                                key={`${materia.id}-prom`}
                                className={`${celdaboletin} font-semibold`}
                              >
                                {promedio ?? '—'}
                              </td>
                            </Fragment>
                          );
                        })}
                        <td className={`${celdaboletin} font-semibold`}>
                          {promediovalores(
                            promedios.filter((valor): valor is number => valor !== null),
                          ) ?? '—'}
                        </td>
                        <td className={celdaboletin}>&nbsp;</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table className="boletin-tabla boletin-tabla-compacta hidden w-full border-collapse text-[8px]">
                <colgroup>
                  <col className="boletin-col-numero" />
                  <col className="boletin-col-nombre" />
                  {incluirRude && <col className="boletin-col-rude" />}
                  <col className="boletin-col-sexo" />
                  <col className="boletin-col-fecha" />
                  {materias.map((materia) => (
                    <col key={materia.id} />
                  ))}
                  <col className="boletin-col-promedio" />
                  <col className="boletin-col-resultado" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-100">
                    <th className={celdaboletin}>N.º</th>
                    <th className={celdaboletin}>Apellidos y nombres</th>
                    {incluirRude && <th className={celdaboletin}>RUDE</th>}
                    <th className={celdaboletin}>Sexo</th>
                    <th className={celdaboletin}>Fecha nac.</th>
                    {materias.map((materia) => (
                      <th key={materia.id} className={celdaboletin} title={materia.nombre}>
                        {materia.nombre}
                        <span className="block font-normal">T1·T2·T3·P</span>
                      </th>
                    ))}
                    <th className={celdaboletin}>Prom. gral.</th>
                    <th className={celdaboletin}>{esUltimoCurso ? 'Resultado' : 'Observ.'}</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnado.map((estudiante, indice) => {
                    const inscripcion = inscripcionactiva(estudiante, curso);
                    if (!inscripcion) return null;
                    const notasEstudiante = notas.filter(
                      (nota) => nota.enrollmentId === inscripcion.id,
                    );
                    const promedios = materias.map((materia) =>
                      promediocalificacion(
                        notasEstudiante.filter((nota) => nota.subjectId === materia.id),
                      ),
                    );
                    return (
                      <tr key={estudiante.id} className={indice % 2 ? 'bg-slate-50' : 'bg-white'}>
                        <td className={celdaboletin}>{indice + 1}</td>
                        <td className={`${celdaboletin} text-left`}>
                          {estudiante.lastName} {estudiante.firstName}
                        </td>
                        {incluirRude && <td className={celdaboletin}>{estudiante.rude}</td>}
                        <td className={celdaboletin}>
                          {estudiante.gender === 'FEMALE'
                            ? 'F'
                            : estudiante.gender === 'MALE'
                              ? 'M'
                              : '—'}
                        </td>
                        <td className={celdaboletin}>{formatearfecha(estudiante.birthDate)}</td>
                        {materias.map((materia, indiceMateria) => {
                          const valores = [1, 2, 3].map((trimestre) => {
                            const periodo = nombreshorizonte.find(
                              (item) => item.number === trimestre,
                            );
                            return periodo ? notaDe(inscripcion.id, materia.id, periodo.id) : null;
                          });
                          const promedio = promedios[indiceMateria];
                          return (
                            <td
                              key={materia.id}
                              className={celdaboletin}
                              aria-label={`${materia.nombre}: primer trimestre ${valores[0] ?? 'sin nota'}, segundo trimestre ${valores[1] ?? 'sin nota'}, tercer trimestre ${valores[2] ?? 'sin nota'}, promedio ${promedio ?? 'sin nota'}`}
                            >
                              <div className="boletin-valores text-center tabular-nums">
                                {valores[0] ?? '—'}·{valores[1] ?? '—'}·{valores[2] ?? '—'}·
                                <strong>{promedio ?? '—'}</strong>
                              </div>
                            </td>
                          );
                        })}
                        <td className={`${celdaboletin} font-semibold`}>
                          {promediovalores(
                            promedios.filter((valor): valor is number => valor !== null),
                          ) ?? '—'}
                        </td>
                        <td className={celdaboletin}>&nbsp;</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          <div className="flex items-center justify-between gap-3 py-2 text-[8px]">
            <p>
              T1, T2, T3: trimestres. Prom.: promedio de las notas registradas. No se determina
              automáticamente la promoción.
            </p>
            <p className="shrink-0">
              {alumnado.length} estudiantes · {cursoetiqueta(curso.name)} ·{' '}
              {anodegestion(curso.academicYear.name)}
            </p>
          </div>

          <footer className="grid grid-cols-3 gap-8 pt-10 text-center text-[8px]">
            {[
              'FIRMA Y SELLO DEL/DE LA DOCENTE',
              'FIRMA Y SELLO DE DIRECCIÓN',
              'FIRMA Y SELLO DE DIRECCIÓN DISTRITAL',
            ].map((leyenda) => (
              <div key={leyenda} className="border-t border-slate-800 pt-1 font-semibold">
                {leyenda}
              </div>
            ))}
          </footer>
          <p className="mt-4 text-right text-[7px] text-slate-600">
            Documento de consulta generado el {new Date().toLocaleDateString('es-BO')}. No válido
            para trámites.
          </p>
        </div>
      </section>
    </>
  );
}
