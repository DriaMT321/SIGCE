import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookOpenCheck, FileCheck2, Loader2, ShieldCheck } from 'lucide-react';
import { Boton } from '../../../components/ui/boton';
import type { gestionasistentesie } from '../application/gestionasistentesie';

export function Paneldesincronizacionsie({ gestion }: { gestion: gestionasistentesie }) {
  const [gestionId, setGestionId] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [periodoNumero, setPeriodoNumero] = useState('');
  const gestiones = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => gestion.listargestiones(),
  });
  const gestionSeleccionada =
    gestionId || gestiones.data?.find((g) => g.isActive)?.id || '';
  const periodos = useQuery({
    queryKey: ['periods', gestionSeleccionada],
    queryFn: () => gestion.listarperiodos(gestionSeleccionada),
    enabled: Boolean(gestionSeleccionada),
  });
  const cursos = useQuery({ queryKey: ['courses'], queryFn: () => gestion.listarcursos() });
  const materias = useQuery({
    queryKey: ['subjects', cursoId],
    queryFn: () => gestion.listarmaterias(cursoId),
    enabled: Boolean(cursoId),
  });
  const preparar = useMutation({
    mutationFn: () =>
      gestion.prepararnotas({
        academicYearId: gestionSeleccionada,
        courseId: cursoId,
        subjectId: materiaId,
        periodNumber: Number(periodoNumero),
      }),
  });
  const cursosVisibles = (cursos.data ?? []).filter(
    (curso) => curso.academicYearId === gestionSeleccionada,
  );
  const periodosCerrados = (periodos.data ?? []).filter((periodo) => periodo.isClosed);

  return <main className="space-y-5 pb-10">
    <header className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800">SIGCE · SIE</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Carga asistida de calificaciones</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">Prepara las notas cerradas de SIGCE para el curso abierto en el SIE. La responsable inicia sesión allí, revisa las filas y guarda los cambios.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900"><ShieldCheck className="h-4 w-4" /> Uso supervisado</span>
      </div>
    </header>

    <section aria-label="Pasos de carga" className="grid gap-3 md:grid-cols-3">
      {[
        ['1', 'Comprueba las notas', 'Consulta aquí el curso, la materia y el trimestre cerrado.'],
        ['2', 'Abre el SIE', 'Inicia sesión en Chrome y abre la tabla del mismo curso.'],
        ['3', 'Usa el complemento', 'Selecciona los mismos datos, rellena, revisa y guarda desde el SIE.'],
      ].map(([numero, titulo, texto]) => <div key={numero} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-sm font-bold text-amber-900">{numero}</span>
        <h2 className="mt-3 font-semibold text-slate-900">{titulo}</h2><p className="mt-1 text-sm text-slate-600">{texto}</p>
      </div>)}
    </section>

    <section aria-labelledby="notas-listas" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3"><BookOpenCheck className="mt-0.5 h-5 w-5 text-amber-800" aria-hidden="true" />
        <div><h2 id="notas-listas" className="text-lg font-semibold text-slate-900">Notas disponibles</h2>
          <p className="mt-1 text-sm text-slate-600">Se incluyen solo notas publicadas de un trimestre cerrado.</p></div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Gestión
          <select value={gestionSeleccionada} onChange={(e) => { setGestionId(e.target.value); setCursoId(''); setMateriaId(''); setPeriodoNumero(''); preparar.reset(); }} disabled={preparar.isPending} className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal text-slate-900">
            <option value="">Selecciona una gestión</option>{(gestiones.data ?? []).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Curso
          <select value={cursoId} onChange={(e) => { setCursoId(e.target.value); setMateriaId(''); preparar.reset(); }} disabled={!gestionSeleccionada || preparar.isPending} className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal text-slate-900 disabled:bg-slate-50">
            <option value="">Selecciona un curso</option>{cursosVisibles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Materia
          <select value={materiaId} onChange={(e) => { setMateriaId(e.target.value); preparar.reset(); }} disabled={!cursoId || preparar.isPending} className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal text-slate-900 disabled:bg-slate-50">
            <option value="">Selecciona una materia</option>{(materias.data ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Trimestre cerrado
          <select value={periodoNumero} onChange={(e) => { setPeriodoNumero(e.target.value); preparar.reset(); }} disabled={!gestionSeleccionada || preparar.isPending} className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal text-slate-900 disabled:bg-slate-50">
            <option value="">Selecciona un trimestre</option>{periodosCerrados.map((p) => <option key={p.id} value={p.number}>{p.name}</option>)}
          </select>
        </label>
      </div>
      {(gestiones.isError || cursos.isError || materias.isError || periodos.isError) && <p role="alert" className="mt-4 text-sm text-rose-700">No se pudieron cargar las opciones. Recarga esta página.</p>}
      <Boton type="button" className="mt-5" disabled={!gestionSeleccionada || !cursoId || !materiaId || !periodoNumero || preparar.isPending} onClick={() => preparar.mutate()}>
        {preparar.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />} Revisar notas listas
      </Boton>
      {preparar.isError && <p role="alert" className="mt-3 text-sm text-rose-700">{preparar.error instanceof Error ? preparar.error.message : 'No se pudieron preparar las notas.'}</p>}
      {preparar.data && <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4" aria-live="polite">
        <h3 className="font-semibold text-slate-900">{preparar.data.course.name} · {preparar.data.subject.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{preparar.data.period.name} · {preparar.data.grades.length} calificaciones listas</p>
        {preparar.data.grades.length === 0 ? <p className="mt-3 text-sm text-slate-700">No hay notas publicadas en esta selección.</p> :
          <div className="mt-4 max-h-80 overflow-auto rounded-lg border border-slate-200 bg-white"><table className="w-full min-w-[520px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600"><tr><th className="px-3 py-2">Estudiante</th><th className="px-3 py-2">RUDE</th><th className="px-3 py-2 text-right">Nota</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{preparar.data.grades.map((n) => <tr key={n.gradeId}><td className="px-3 py-2 text-slate-900">{n.lastName}, {n.firstName}</td><td className="px-3 py-2 font-mono text-slate-700">{n.rude}</td><td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">{n.value}</td></tr>)}</tbody>
          </table></div>}
      </div>}
    </section>
    <p className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-700">En la tabla abierta del SIE, abre el complemento de Chrome. El registro de SIGCE distingue las filas rellenadas de las que la responsable confirmó después de guardarlas.</p>
  </main>;
}
