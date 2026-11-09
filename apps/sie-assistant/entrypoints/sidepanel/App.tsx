import { useEffect, useMemo, useRef, useState } from 'react';
import { apiForPortal, isDemoPortal, loadCourseOptions, loadGrades, loadOptions, login, sendSummary } from '../../src/api';
import type { SigceSession } from '../../src/api';
import type { GradePlan, PlanFilters, PortalRequest, PortalResponse, SavedMessage, SummaryEntry } from '../../src/types';

const localApi = 'http://localhost:3000/api/v1';
const deployedApi = 'https://api.sigce.lat/api/v1';

const demoPlan: GradePlan = {
  course: { id: 'demo-course', name: 'Primaria - Segundo B' },
  subject: { id: 'demo-subject', name: 'Matemática', code: 'MAT' },
  period: { number: 1, name: 'Primer trimestre' },
  fingerprint: 'DEMO_DATOS_FICTICIOS',
  grades: [
    { gradeId: 'demo-1', studentId: 'demo-1', rude: 'DEMO-0001', firstName: 'Ana', lastName: 'Pérez López', value: 85 },
    { gradeId: 'demo-2', studentId: 'demo-2', rude: 'DEMO-0002', firstName: 'Luis', lastName: 'Rojas Vargas', value: 78 },
    { gradeId: 'demo-3', studentId: 'demo-3', rude: 'DEMO-0003', firstName: 'María', lastName: 'Mamani Quispe', value: 91 },
  ],
};

type CourseOptions = Awaited<ReturnType<typeof loadCourseOptions>>;
type BaseOptions = Awaited<ReturnType<typeof loadOptions>>;

export function App() {
  const [tabId, setTabId] = useState<number | null>(null);
  const [portalUrl, setPortalUrl] = useState('');
  const [portalError, setPortalError] = useState('');
  const [apiBase, setApiBase] = useState(localApi);
  const [allowLocalOnOfficial, setAllowLocalOnOfficial] = useState(false);
  const [role, setRole] = useState<'ADMINISTRATIVE' | 'SECRETARY'>('ADMINISTRATIVE');
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [session, setSession] = useState<SigceSession | null>(null);
  const [baseOptions, setBaseOptions] = useState<BaseOptions | null>(null);
  const [courseOptions, setCourseOptions] = useState<CourseOptions | null>(null);
  const [filters, setFilters] = useState<PlanFilters>({ academicYearId: '', courseId: '', subjectId: '', periodNumber: 0 });
  const [plan, setPlan] = useState<GradePlan | null>(null);
  const [index, setIndex] = useState(0);
  const [inspection, setInspection] = useState<PortalResponse | null>(null);
  const [fillResult, setFillResult] = useState<PortalResponse | null>(null);
  const [saveObserved, setSaveObserved] = useState('');
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [alias, setAlias] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [summarySent, setSummarySent] = useState(false);
  const advancing = useRef(false);
  const operationIds = useRef(new Map<string, string>());

  const demo = portalUrl ? isDemoPortal(portalUrl) : false;
  const current = plan?.grades[index];
  const courses = useMemo(() => (baseOptions?.courses ?? []).filter((course) => course.academicYearId === filters.academicYearId), [baseOptions, filters.academicYearId]);
  const periods = (courseOptions?.periods ?? []).filter((period) => period.isClosed);

  async function refreshTab() {
    try {
      const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!active?.id || !active.url) throw new Error('Abre primero la tabla del curso en Chrome.');
      apiForPortal(active.url);
      if (tabId !== null && (active.id !== tabId || active.url !== portalUrl)) {
        setPlan(null);
        setInspection(null);
        setFillResult(null);
        setEntries([]);
      }
      setTabId(active.id);
      setPortalUrl(active.url);
      setPortalError('');
    } catch (failure) {
      setTabId(null);
      setPortalUrl('');
      setPortalError(failure instanceof Error ? failure.message : 'No se pudo identificar la pestaña.');
    }
  }

  useEffect(() => {
    void refreshTab();
    void chrome.storage.session.get('sigceSession').then((stored) => {
      const saved = stored.sigceSession as SigceSession | undefined;
      if (saved?.accessToken && [localApi, deployedApi].includes(saved.apiBase)) {
        setSession(saved);
        setApiBase(saved.apiBase);
      }
    });
  }, []);

  useEffect(() => {
    const listener = (raw: unknown, sender: chrome.runtime.MessageSender) => {
      if (!raw || typeof raw !== 'object' || !('kind' in raw)) return;
      const message = raw as SavedMessage;
      if (sender.tab?.id === tabId && message.kind === 'SIGCE_SAVE_OBSERVED' && message.gradeId === current?.gradeId) {
        setSaveObserved(message.detail);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [current?.gradeId, tabId]);

  useEffect(() => {
    if (!session || demo) return;
    void loadOptions(session).then((options) => {
      setBaseOptions(options);
      const activeYear = options.years.find((year) => year.isActive);
      if (activeYear) setFilters((currentFilters) => ({ ...currentFilters, academicYearId: activeYear.id }));
    }).catch((failure) => setError(failure instanceof Error ? failure.message : 'No se pudieron cargar las opciones.'));
  }, [session, demo]);

  useEffect(() => {
    if (!session || !filters.academicYearId || !filters.courseId || demo) return;
    void loadCourseOptions(session, filters.academicYearId, filters.courseId)
      .then(setCourseOptions)
      .catch((failure) => setError(failure instanceof Error ? failure.message : 'No se pudieron cargar las materias.'));
  }, [session, filters.academicYearId, filters.courseId, demo]);

  async function withBusy(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'No se pudo completar la acción.'); }
    finally { setBusy(false); }
  }

  async function sendToTab(request: PortalRequest): Promise<PortalResponse> {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!active?.id || active.id !== tabId || !active.url || active.url !== portalUrl) {
      throw new Error('La pestaña cambió. Vuelve a comprobar el curso antes de continuar.');
    }
    apiForPortal(active.url);
    try {
      return await chrome.tabs.sendMessage(active.id, request) as PortalResponse;
    } catch {
      throw new Error('No se pudo leer la pantalla. Recarga la pestaña del SIE y vuelve a comprobarla.');
    }
  }

  async function signIn() {
    await withBusy(async () => {
      const next = await login(apiBase, role, identifier, secret);
      setSession(next);
      setSecret('');
      await chrome.storage.session.set({ sigceSession: next });
    });
  }

  async function signOut() {
    await chrome.storage.session.remove('sigceSession');
    setSession(null);
    setBaseOptions(null);
    setCourseOptions(null);
    setPlan(null);
    setEntries([]);
  }

  function resetRun(nextPlan: GradePlan) {
    setPlan(nextPlan);
    setIndex(0);
    setEntries([]);
    setInspection(null);
    setFillResult(null);
    setSaveObserved('');
    setSummarySent(false);
  }

  async function preparePlan() {
    await withBusy(async () => {
      if (!session) throw new Error('Inicia sesión en SIGCE.');
      if (!filters.academicYearId || !filters.courseId || !filters.subjectId || !filters.periodNumber) {
        throw new Error('Selecciona gestión, curso, materia y trimestre cerrado.');
      }
      resetRun(await loadGrades(session, filters));
    });
  }

  async function inspect() {
    await withBusy(async () => {
      const result = await sendToTab({ kind: 'SIGCE_INSPECT', expectedCourse: plan?.course.name });
      setInspection(result);
      if (!result.ok) throw new Error(result.detail);
    });
  }

  async function fill(allowOverwrite = false, grade = current) {
    await withBusy(async () => {
      if (!plan || !grade || !inspection?.ok) throw new Error('Comprueba el curso y prepara las notas.');
      if (!demo) {
        if (!session) throw new Error('Inicia sesión en SIGCE.');
        if (session.apiBase === localApi && !allowLocalOnOfficial) {
          throw new Error('Confirma que los datos de SIGCE local corresponden al curso real antes de continuar.');
        }
        const currentPlan = await loadGrades(session, filters);
        if (currentPlan.fingerprint !== plan.fingerprint) {
          setInspection(null);
          throw new Error('Las notas cambiaron en SIGCE. Vuelve a preparar el lote antes de escribir otra fila.');
        }
      }
      setSaveObserved('');
      const result = await sendToTab({
        kind: 'SIGCE_FILL', grade, course: plan.course,
        subject: plan.subject, period: plan.period,
        subjectAlias: alias.trim() || undefined, allowOverwrite,
      });
      setFillResult(result);
      if (!result.ok && result.status === 'ERROR') throw new Error(result.detail);
    });
  }

  async function advance(result: SummaryEntry['result'], reason?: string) {
    if (!current || advancing.current) return;
    advancing.current = true;
    setBusy(true);
    const next = plan?.grades[index + 1];
    const entry: SummaryEntry = { gradeId: current.gradeId, result, ...(reason ? { reason } : {}) };
    try {
      if (!demo) {
        if (!session || !plan) throw new Error('La sesión de SIGCE venció. Inicia sesión nuevamente.');
        const key = `${plan.fingerprint}:${entry.gradeId}:${entry.result}`;
        let operationId = operationIds.current.get(key);
        if (!operationId) {
          operationId = crypto.randomUUID();
          operationIds.current.set(key, operationId);
        }
        await sendSummary(session, filters, plan.fingerprint, [entry], operationId);
      }
      setEntries((previous) => [...previous.filter((item) => item.gradeId !== current.gradeId), entry]);
      setIndex((previous) => previous + 1);
      setFillResult(null);
      setSaveObserved('');
      await sendToTab({ kind: 'SIGCE_RESET' }).catch(() => undefined);
      if (next) await fill(false, next);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'No se pudo registrar la fila en SIGCE. Reinténtalo.');
    } finally {
      advancing.current = false;
      setBusy(false);
    }
  }

  async function finish() {
    await withBusy(async () => {
      if (!plan || index < plan.grades.length) throw new Error('Revisa todas las filas antes de cerrar el lote.');
      setSummarySent(true);
    });
  }

  return <div className="app">
    <header className="hero"><div className="brand"><span className="mark">S</span><span><strong>SIGCE</strong><small>Asistente de calificaciones</small></span></div><p>Completa las notas del curso abierto bajo revisión de la responsable.</p></header>

    {portalError ? <section className="card warning"><h2>Pantalla no disponible</h2><p>{portalError}</p><button onClick={() => void refreshTab()}>Comprobar pestaña</button></section> :
      <section className="card compact"><div className="eyebrow">Pestaña activa</div><strong>{demo ? 'Réplica local de demostración' : 'Portal SIE oficial'}</strong><p>{demo ? 'Datos sintéticos; este recorrido no se registra en SIGCE.' : 'Sesión abierta por la responsable en el navegador.'}</p><button className="link" onClick={() => void refreshTab()}>Actualizar pestaña</button></section>}

    {!demo && !session && <section className="card"><h2>Entrar a SIGCE</h2><p>Estas credenciales son de SIGCE. Inicia sesión en el SIE directamente en su página.</p>
      <label>Servidor SIGCE<select value={apiBase} onChange={(e) => setApiBase(e.target.value)}><option value={localApi}>SIGCE local</option><option value={deployedApi}>SIGCE desplegado</option></select></label>
      <label>Responsable<select value={role} onChange={(e) => setRole(e.target.value as typeof role)}><option value="ADMINISTRATIVE">Dirección</option><option value="SECRETARY">Secretaría</option></select></label>
      <label>Identificador<input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" /></label>
      <label>Clave SIGCE<input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoComplete="current-password" /></label>
      <button className="primary" disabled={busy || !identifier.trim() || !secret || !tabId} onClick={() => void signIn()}>Entrar</button>
    </section>}

    {!demo && session && <section className="card compact"><div className="row"><div><div className="eyebrow">Sesión SIGCE</div><strong>{session.user.firstName} {session.user.lastName}</strong></div><button className="link" onClick={() => void signOut()}>Salir</button></div><p>Origen: {session.apiBase === localApi ? 'SIGCE local' : 'SIGCE desplegado'}</p></section>}

    {!demo && session?.apiBase === localApi && <section className="card warning"><h2>Datos locales en el portal oficial</h2><p>Comprueba que este SIGCE local contiene las notas institucionales correctas. La réplica ficticia se usa solo en localhost:4174.</p><label className="check"><input type="checkbox" checked={allowLocalOnOfficial} onChange={(e) => setAllowLocalOnOfficial(e.target.checked)} />Confirmo que este SIGCE local corresponde al curso que voy a completar.</label></section>}

    {((demo && tabId) || session) && !plan && <section className="card"><h2>Preparar notas</h2>
      {demo ? <><p>Usa tres estudiantes ficticios de la réplica local.</p><button className="primary" onClick={() => resetRun(demoPlan)}>Cargar datos de demostración</button></> : <>
        <label>Gestión<select value={filters.academicYearId} onChange={(e) => { setFilters({ academicYearId: e.target.value, courseId: '', subjectId: '', periodNumber: 0 }); setCourseOptions(null); }}><option value="">Selecciona</option>{(baseOptions?.years ?? []).map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}</select></label>
        <label>Curso<select value={filters.courseId} onChange={(e) => { setFilters({ ...filters, courseId: e.target.value, subjectId: '', periodNumber: 0 }); setCourseOptions(null); }}><option value="">Selecciona</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}</select></label>
        <label>Materia<select value={filters.subjectId} onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}><option value="">Selecciona</option>{(courseOptions?.subjects ?? []).map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
        <label>Trimestre cerrado<select value={filters.periodNumber} onChange={(e) => setFilters({ ...filters, periodNumber: Number(e.target.value) })}><option value="0">Selecciona</option>{periods.map((period) => <option key={period.id} value={period.number}>{period.name}</option>)}</select></label>
        <button className="primary" disabled={busy || !filters.academicYearId || !filters.courseId || !filters.subjectId || !filters.periodNumber} onClick={() => void preparePlan()}>Cargar notas cerradas</button>
      </>}
    </section>}

    {plan && <section className="card"><div className="eyebrow">Lote preparado</div><h2>{plan.course.name}</h2><p>{plan.subject.name} · {plan.period.name} · {plan.grades.length} notas</p>
      <div className="row actions"><button disabled={busy || !tabId} onClick={() => void inspect()}>Comprobar pantalla</button><button className="link" onClick={() => { setPlan(null); setEntries([]); }}>Cambiar selección</button></div>
      {inspection && <p className={inspection.ok ? 'status good' : 'status bad'}>{inspection.status === 'READY' ? `Tabla reconocida: ${inspection.studentCount} estudiantes.` : inspection.ok ? 'Pantalla reconocida.' : inspection.detail}</p>}
    </section>}

    {plan && current && inspection?.ok && <section className="card"><div className="eyebrow">Estudiante {index + 1} de {plan.grades.length}</div><h2>{current.lastName}, {current.firstName}</h2><p>RUDE {current.rude}</p><div className="grade">{current.value}<span>nota SIGCE</span></div>
      <label>Alias de materia en SIE <span className="optional">si difiere</span><input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder={plan.subject.name} /></label>
      {!fillResult && <button className="primary" disabled={busy} onClick={() => void fill()}>{index === 0 ? 'Iniciar recorrido' : 'Reintentar esta nota'}</button>}
      {fillResult && 'detail' in fillResult && <p className={fillResult.ok ? 'status good' : 'status bad'}>{fillResult.detail}</p>}
      {fillResult?.status === 'CONFLICT' && <button className="danger" disabled={busy} onClick={() => void fill(true)}>Reemplazar esta nota tras revisarla</button>}
      {fillResult?.status === 'FILLED' && <><p className="hint">Revisa la nota y pulsa Guardar en el SIE. El asistente esperará el aviso de esa página.</p>{saveObserved && <p className="status good">{saveObserved}</p>}<button className="primary" disabled={!saveObserved || busy} onClick={() => void advance('CONFIRMED_BY_USER', 'La responsable confirmó el aviso de guardado en pantalla.')}>Confirmé el guardado · siguiente</button></>}
      {fillResult?.status === 'ALREADY_EQUAL' && <button onClick={() => void advance('SKIPPED', 'La nota ya se mostraba igual en la casilla visible.')}>Continuar sin cambios</button>}
      <button className="link" disabled={busy} onClick={() => void advance(fillResult?.status === 'ERROR' ? 'ERROR' : 'SKIPPED', fillResult?.status === 'ERROR' ? fillResult.detail : 'Omitido por la responsable.')}>Omitir esta fila</button>
    </section>}

    {plan && plan.grades.length === 0 && <section className="card"><h2>Sin notas disponibles</h2><p>Esta selección no tiene calificaciones publicadas para cargar.</p></section>}
    {plan && !current && plan.grades.length > 0 && <section className="card"><h2>Recorrido terminado</h2><p>{entries.filter((entry) => entry.result === 'CONFIRMED_BY_USER').length} confirmadas por la responsable · {entries.filter((entry) => entry.result !== 'CONFIRMED_BY_USER').length} pendientes u omitidas.</p>
      <button className="primary" disabled={busy || summarySent} onClick={() => void finish()}>{demo ? 'Cerrar demostración' : 'Cerrar recorrido'}</button>{summarySent && <p className="status good">Cada fila quedó registrada. Una confirmación en pantalla no equivale a una conciliación del SIE.</p>}
    </section>}

    {error && <p role="alert" className="global-error">{error}</p>}
    <footer>El asistente rellena campos visibles. La responsable decide qué guardar.</footer>
  </div>;
}
