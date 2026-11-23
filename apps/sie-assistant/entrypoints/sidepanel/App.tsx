import { useEffect, useMemo, useRef, useState } from 'react';
import {
  apiForPortal,
  isDemoPortal,
  isReferencePortal,
  isSigceWeb,
  loadCourseOptions,
  loadGrades,
  loadOptions,
  sendSummary,
} from '../../src/api';
import type { SigceSession } from '../../src/api';
import type {
  GradePlan,
  PlanFilters,
  PortalRequest,
  PortalResponse,
  SavedMessage,
  SummaryEntry,
} from '../../src/types';
import {
  type GradeBackup,
  createGradeBackupFromPlan,
  deleteGradeBackup,
  downloadBackupCsv,
  downloadBackupJson,
  is6toSecundaria,
  listGradeBackups,
  restorePlanFromBackup,
  saveGradeBackup,
} from '../../src/backup';

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

const demoPlan6to: GradePlan = {
  course: { id: 'demo-6sec', name: 'Secundaria - Sexto A' },
  subject: { id: 'demo-subject', name: 'Matemática', code: 'MAT' },
  period: { number: 1, name: 'Primer trimestre' },
  fingerprint: 'DEMO_6TO_SECUNDARIA_BACHILLERATO',
  grades: [
    { gradeId: 'demo-1', studentId: 'demo-1', rude: 'DEMO-0001', firstName: 'Ana', lastName: 'Pérez López', value: 85 },
    { gradeId: 'demo-2', studentId: 'demo-2', rude: 'DEMO-0002', firstName: 'Luis', lastName: 'Rojas Vargas', value: 78 },
    { gradeId: 'demo-3', studentId: 'demo-3', rude: 'DEMO-0003', firstName: 'María', lastName: 'Mamani Quispe', value: 91 },
  ],
};

type CourseOptions = Awaited<ReturnType<typeof loadCourseOptions>>;
type BaseOptions = Awaited<ReturnType<typeof loadOptions>>;

/* Compact inline SVG icons (zero external dependencies, CSP-safe) */
function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconShieldCheck({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconRefresh({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function IconLogOut({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconArrowRight({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconAlert({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconSparkles({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />
    </svg>
  );
}

function IconSearch({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconDownload({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconFileText({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconGraduationCap({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconHistory({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconExternalLink({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function App() {
  const [tabId, setTabId] = useState<number | null>(null);
  const [portalUrl, setPortalUrl] = useState('');
  const [portalError, setPortalError] = useState('');
  const [apiBase, setApiBase] = useState(deployedApi);
  const [manualApiOverride, setManualApiOverride] = useState(false);
  const [allowLocalOnOfficial, setAllowLocalOnOfficial] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const [session, setSession] = useState<SigceSession | null>(null);
  const [workReady, setWorkReady] = useState(false);
  const [readyToast, setReadyToast] = useState(false);
  const [baseOptions, setBaseOptions] = useState<BaseOptions | null>(null);
  const [courseOptions, setCourseOptions] = useState<CourseOptions | null>(null);
  const [filters, setFilters] = useState<PlanFilters>({ academicYearId: '', courseId: '', subjectId: '', periodNumber: 0 });
  const [plan, setPlan] = useState<GradePlan | null>(null);
  const [lastBackup, setLastBackup] = useState<GradeBackup | null>(null);
  const [savedBackups, setSavedBackups] = useState<GradeBackup[]>([]);
  const [showBackupsModal, setShowBackupsModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [inspection, setInspection] = useState<PortalResponse | null>(null);
  const [fillResult, setFillResult] = useState<PortalResponse | null>(null);
  const [saveObserved, setSaveObserved] = useState('');
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [alias, setAlias] = useState('');
  const [busy, setBusy] = useState(false);
  const [refreshingTab, setRefreshingTab] = useState(false);
  const [error, setError] = useState('');
  const [summarySent, setSummarySent] = useState(false);
  const advancing = useRef(false);
  const operationIds = useRef(new Map<string, string>());

  const demo = portalUrl ? isDemoPortal(portalUrl) : false;
  const reference = portalUrl ? isReferencePortal(portalUrl) : false;
  const sigceTab = portalUrl ? isSigceWeb(portalUrl) : false;
  const current = plan?.grades[index];
  const courses = useMemo(
    () => (baseOptions?.courses ?? []).filter((course) => course.academicYearId === filters.academicYearId),
    [baseOptions, filters.academicYearId],
  );
  const periods = useMemo(() => (courseOptions?.periods ?? []).filter((period) => period.isClosed), [courseOptions]);
  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === filters.courseId),
    [courses, filters.courseId],
  );
  const es6toSecundariaSeleccionado = selectedCourse ? is6toSecundaria(selectedCourse.name) : false;
  const isAuthorized = session ? ['ADMINISTRATIVE', 'SECRETARY'].includes(session.user.role) : false;

  const activeStep: 1 | 2 | 3 = plan ? 3 : workReady && (demo || (Boolean(session) && isAuthorized)) ? 2 : 1;

  async function detectWebSession(): Promise<SigceSession | null> {
    try {
      const stored = await chrome.storage.local.get('sigceSession');
      const saved = stored.sigceSession as SigceSession | undefined;
      if (saved?.accessToken && saved?.user) {
        return saved;
      }

      // Consultar todas las pestañas abiertas en Chrome sin restricciones de filtro
      const allTabs = await chrome.tabs.query({});
      const sigceTabs = allTabs.filter((tab) => {
        if (!tab.id || !tab.url) return false;
        try {
          const u = new URL(tab.url);
          const host = u.hostname.toLowerCase();
          return (
            host === 'sigce.lat' ||
            host.endsWith('.sigce.lat') ||
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host.endsWith('.vercel.app')
          );
        } catch {
          return false;
        }
      });

      for (const tab of sigceTabs) {
        if (!tab.id) continue;

        // 1. Intentar mensaje en tiempo de ejecución (si el content script está presente)
        try {
          const res = (await chrome.tabs.sendMessage(tab.id, {
            kind: 'SIGCE_GET_WEB_SESSION',
          })) as { ok?: boolean; session?: SigceSession };
          if (res?.ok && res.session?.accessToken && res.session?.user) {
            await chrome.storage.local.set({ sigceSession: res.session });
            return res.session;
          }
        } catch { }

        // 2. Ejecutar script en la pestaña para recuperar sesión viva por cookie o localStorage
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: async () => {
              // A. Verificar si ya está en localStorage
              try {
                const raw = localStorage.getItem('sigce_extension_session');
                if (raw) {
                  const parsed = JSON.parse(raw);
                  if (parsed && typeof parsed === 'object' && parsed.accessToken && parsed.user) {
                    return parsed;
                  }
                }
              } catch { }

              // B. Leer usuario de sessionStorage si existe
              let localUser = null;
              try {
                const rawUser = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
                if (rawUser) localUser = JSON.parse(rawUser);
              } catch { }

              // C. Resolver URL de la API correspondiente a la pestaña
              const hostname = window.location.hostname;
              let apiBase = 'https://api.sigce.lat/api/v1';
              if (hostname === 'localhost' || hostname === '127.0.0.1') {
                apiBase = 'http://localhost:3000/api/v1';
              } else if (window.location.protocol === 'https:' && !hostname.includes('sigce.lat')) {
                const baseHost = hostname.replace(/^www\./, '');
                apiBase = 'https://api.' + baseHost + '/api/v1';
              }

              // D. Usar la cookie HttpOnly de la pestaña abierta para renovar el token Bearer
              try {
                const tabSessionId = sessionStorage.getItem('sigce_web_tab');
                const headers: Record<string, string> = {
                  'Content-Type': 'application/json',
                  'X-SIGCE-Web': '1',
                };
                if (tabSessionId) headers['X-SIGCE-Tab'] = tabSessionId;

                const res = await fetch(`${apiBase}/auth/web/refresh`, {
                  method: 'POST',
                  headers,
                  credentials: 'include',
                  body: '{}',
                });

                if (res.ok) {
                  const data = await res.json();
                  const accessToken = data?.data?.accessToken;
                  const finalUser = data?.data?.user || localUser;
                  if (accessToken && finalUser) {
                    const sessionData = {
                      accessToken,
                      user: finalUser,
                      apiBase,
                      timestamp: Date.now(),
                    };
                    try {
                      localStorage.setItem('sigce_extension_session', JSON.stringify(sessionData));
                    } catch { }
                    return sessionData;
                  }
                }
              } catch { }

              return null;
            },
          });

          const tabSession = results?.[0]?.result as SigceSession | null;
          if (tabSession?.accessToken && tabSession?.user) {
            await chrome.storage.local.set({ sigceSession: tabSession });
            return tabSession;
          }
        } catch { }
      }
    } catch { }
    return null;
  }

  async function checkAndSyncSession(manual = false) {
    if (manual) setCheckingSession(true);
    setError('');
    try {
      const found = await detectWebSession();
      if (found) {
        setSession(found);
        setApiBase(found.apiBase);
        if (manual) setReadyToast(true);
      } else if (manual) {
        const allTabs = await chrome.tabs.query({});
        const hasSigceTab = allTabs.some((t) => {
          if (!t.url) return false;
          try {
            const h = new URL(t.url).hostname.toLowerCase();
            return h === 'sigce.lat' || h.endsWith('.sigce.lat') || h === 'localhost' || h === '127.0.0.1';
          } catch {
            return false;
          }
        });

        if (!hasSigceTab) {
          setError('No tienes ninguna pestaña de sigce.lat abierta en Chrome. Abre sigce.lat en una pestaña y asegúrate de iniciar sesión.');
        } else {
          setError('Se detectó la pestaña de sigce.lat, pero no tiene una sesión activa iniciada. Inicia sesión con tu cuenta de Dirección o Secretaría en esa pestaña y vuelve a pulsar aquí.');
        }
      }
    } finally {
      if (manual) setCheckingSession(false);
    }
  }

  async function refreshTab(): Promise<boolean> {
    setRefreshingTab(true);
    try {
      const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!active?.id || !active.url) throw new Error('Abre primero el portal del SIE en Chrome.');
      const suggestedApi = apiForPortal(active.url);
      if (tabId !== null && (active.id !== tabId || active.url !== portalUrl)) {
        setPlan(null);
        setInspection(null);
        setFillResult(null);
        setEntries([]);
      }
      setTabId(active.id);
      setPortalUrl(active.url);
      setPortalError('');
      if (!session && !manualApiOverride) {
        setApiBase(suggestedApi);
      }
      return true;
    } catch (failure) {
      setTabId(null);
      setPortalUrl('');
      setPortalError(failure instanceof Error ? failure.message : 'No se pudo identificar la pestaña.');
      return false;
    } finally {
      setRefreshingTab(false);
    }
  }

  useEffect(() => {
    void refreshTab();
    void checkAndSyncSession();

    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes.sigceSession) {
        const next = changes.sigceSession.newValue as SigceSession | undefined;
        if (next?.accessToken) {
          setSession(next);
          setApiBase(next.apiBase);
        } else {
          setSession(null);
          setWorkReady(false);
        }
      }
    };
    chrome.storage.onChanged.addListener(storageListener);

    void listGradeBackups().then((backups) => {
      setSavedBackups(backups);
      if (backups.length > 0) {
        setLastBackup(backups[0] || null);
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
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
    if (!session || demo || reference) return;
    void loadOptions(session)
      .then((options) => {
        setBaseOptions(options);
        const activeYear = options.years.find((year) => year.isActive);
        if (activeYear) setFilters((currentFilters) => ({ ...currentFilters, academicYearId: activeYear.id }));
      })
      .catch((failure) => setError(failure instanceof Error ? failure.message : 'No se pudieron cargar las opciones.'));
  }, [session, demo, reference]);

  useEffect(() => {
    if (!session || !filters.academicYearId || !filters.courseId || demo || reference) return;
    void loadCourseOptions(session, filters.academicYearId, filters.courseId)
      .then((loaded) => {
        setCourseOptions(loaded);
        const closed = loaded.periods.filter((p) => p.isClosed);
        setFilters((prev) => ({
          ...prev,
          subjectId: prev.subjectId || (loaded.subjects.length === 1 ? (loaded.subjects[0]?.id ?? '') : ''),
          periodNumber: prev.periodNumber || (closed.length === 1 ? (closed[0]?.number ?? 0) : 0),
        }));
      })
      .catch((failure) => setError(failure instanceof Error ? failure.message : 'No se pudieron cargar las materias.'));
  }, [session, filters.academicYearId, filters.courseId, demo, reference]);

  async function withBusy(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'No se pudo completar la acción.');
    } finally {
      setBusy(false);
    }
  }

  async function sendToTab(request: PortalRequest): Promise<PortalResponse> {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!active?.id || active.id !== tabId || !active.url || active.url !== portalUrl) {
      throw new Error('La pestaña cambió. Vuelve a comprobar la pantalla antes de continuar.');
    }
    apiForPortal(active.url);
    try {
      return (await chrome.tabs.sendMessage(active.id, request)) as PortalResponse;
    } catch {
      throw new Error('No se pudo leer la pantalla. Recarga la pestaña del SIE y vuelve a comprobarla.');
    }
  }

  async function signOut() {
    await chrome.storage.local.remove('sigceSession');
    setSession(null);
    setWorkReady(false);
    setReadyToast(false);
    setBaseOptions(null);
    setCourseOptions(null);
    setPlan(null);
    setEntries([]);
    setInspection(null);
    setFillResult(null);
    setError('');
  }

  async function confirmAccessAndStart() {
    setError('');
    const ok = await refreshTab();
    if (!ok) return;
    if (!demo && session?.apiBase === localApi && !allowLocalOnOfficial) {
      setError('Marca la casilla de confirmación para usar SIGCE local con el portal oficial.');
      return;
    }
    setWorkReady(true);
    setReadyToast(true);
  }

  async function savePlanBackup(targetPlan: GradePlan) {
    const userLabel = session?.user ? `${session.user.firstName} ${session.user.lastName}` : (demo ? 'Demostración SIE' : undefined);
    const backup = createGradeBackupFromPlan(targetPlan, userLabel, demo ? 'DEMO' : 'SIGCE_PLAN');
    await saveGradeBackup(backup);
    setLastBackup(backup);
    const updated = await listGradeBackups();
    setSavedBackups(updated);
    return backup;
  }

  function handleRestoreBackup(b: GradeBackup) {
    const restored = restorePlanFromBackup(b);
    resetRun(restored);
    setLastBackup(b);
    setShowBackupsModal(false);
  }

  async function handleDeleteBackup(id: string) {
    const updated = await deleteGradeBackup(id);
    setSavedBackups(updated);
    if (lastBackup?.id === id) {
      setLastBackup(updated[0] || null);
    }
  }

  function resetRun(nextPlan: GradePlan) {
    setPlan(nextPlan);
    setIndex(0);
    setEntries([]);
    setInspection(null);
    setFillResult(null);
    setSaveObserved('');
    setSummarySent(false);
    setReadyToast(false);
  }

  async function preparePlan() {
    await withBusy(async () => {
      if (!session) throw new Error('Inicia sesión en SIGCE.');
      if (!filters.academicYearId || !filters.courseId || !filters.subjectId || !filters.periodNumber) {
        throw new Error('Selecciona gestión, curso, materia y trimestre cerrado.');
      }
      const loaded = await loadGrades(session, filters);
      resetRun(loaded);
      await savePlanBackup(loaded);
    });
  }

  async function activateDemoPlan(targetDemoPlan = demoPlan) {
    resetRun(targetDemoPlan);
    await savePlanBackup(targetDemoPlan);
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
      if (!plan || !grade || !inspection?.ok) throw new Error('Comprueba la pantalla antes de rellenar notas.');
      // Medida preventiva universal: asegurar el respaldo de cualquier curso antes de que el plugin actúe en el SIE
      if (!lastBackup || lastBackup.courseId !== plan.course.id || lastBackup.subjectId !== plan.subject.id) {
        await savePlanBackup(plan);
      }
      if (!demo) {
        if (!session) throw new Error('Inicia sesión en SIGCE.');
        if (session.apiBase === localApi && !allowLocalOnOfficial) {
          throw new Error('Confirma que los datos de SIGCE local corresponden al curso real antes de continuar.');
        }
        const currentPlan = await loadGrades(session, filters);
        if (currentPlan.fingerprint !== plan.fingerprint) {
          setInspection(null);
          throw new Error('Las notas cambiaron en SIGCE. Vuelve a cargar el lote antes de continuar.');
        }
      }
      setSaveObserved('');
      const result = await sendToTab({
        kind: 'SIGCE_FILL',
        grade,
        course: plan.course,
        subject: plan.subject,
        period: plan.period,
        subjectAlias: alias.trim() || undefined,
        allowOverwrite,
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

  const progressPct = plan && plan.grades.length > 0 ? Math.min(100, Math.round((index / plan.grades.length) * 100)) : 0;
  const confirmedCount = entries.filter((entry) => entry.result === 'CONFIRMED_BY_USER').length;
  const skippedCount = entries.filter((entry) => entry.result !== 'CONFIRMED_BY_USER').length;

  return (
    <div className="app">
      {/* CABECERA COMPACTA Y MODERNA */}
      <header className="hero">
        <div className="hero-top">
          <div className="brand">
            <span className="mark">S</span>
            <div className="brand-text">
              <strong>SIGCE</strong>
              <small>Asistente SIE</small>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="icon-btn-dark"
              onClick={() => setShowBackupsModal(true)}
              title={`Copias de seguridad (${savedBackups.length} respaldos guardados)`}
              aria-label="Ver copias de seguridad de notas"
            >
              <IconHistory size={13} />
            </button>
            {!demo && !reference && session && (
              <div className="user-chip" title={`${session.user.firstName} ${session.user.lastName}`}>
                <span>{session.user.firstName}</span>
                <button
                  type="button"
                  className="icon-btn-dark"
                  onClick={() => void signOut()}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <IconLogOut />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Estado de la pestaña en vivo */}
        <div className="portal-strip">
          <div className="portal-strip-info">
            <span className={`status-dot ${portalError ? 'offline' : 'online'}`} />
            <div style={{ minWidth: 0 }}>
              <span className="portal-strip-text">
                {portalError
                  ? 'Portal SIE no detectado'
                  : sigceTab
                    ? 'Pestaña activa: SIGCE Web'
                    : demo
                      ? 'Réplica de demostración'
                      : reference
                        ? 'Página de referencia'
                        : 'Portal SIE oficial conectado'}
              </span>
              <span className="portal-strip-sub">
                {portalError
                  ? 'Abre el SIE en Chrome y actualiza'
                  : sigceTab
                    ? 'Sesión vinculada · Abre la pestaña del SIE'
                    : demo
                      ? 'Modo pruebas locales (sin guardar en SIGCE)'
                      : reference
                        ? 'Vista de solo lectura'
                        : 'Listo para sincronizar calificaciones'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="icon-btn-dark"
            onClick={() => void refreshTab()}
            disabled={refreshingTab}
            title="Actualizar pestaña activa"
            aria-label="Actualizar pestaña activa"
          >
            <IconRefresh className={refreshingTab ? 'spin' : ''} />
          </button>
        </div>
      </header>

      {/* INDICADOR DE 3 PASOS */}
      {!portalError && !reference && (
        <nav className="stepper" aria-label="Progreso del asistente">
          <div className={`step-item ${activeStep > 1 ? 'done' : 'active'}`}>
            <span className="step-num">{activeStep > 1 ? <IconCheck size={11} /> : '1'}</span>
            <span>Acceso</span>
          </div>
          <div className={`step-item ${activeStep === 2 ? 'active' : activeStep > 2 ? 'done' : ''}`}>
            <span className="step-num">{activeStep > 2 ? <IconCheck size={11} /> : '2'}</span>
            <span>Curso</span>
          </div>
          <div className={`step-item ${activeStep === 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span>Notas</span>
          </div>
        </nav>
      )}

      {/* PESTAÑA NO COMPATIBLE */}
      {portalError && (
        <section className="card warning">
          <div className="eyebrow" style={{ color: '#b45309' }}>
            <IconAlert size={13} /> Pestaña requerida
          </div>
          <h2>Abre el portal del SIE</h2>
          <p>{portalError}</p>
          <div className="action-stack">
            <button type="button" className="btn success full" onClick={() => void refreshTab()} disabled={refreshingTab}>
              <IconCheck size={16} />
              <span>Ya ingresé al sistema · Comprobar pestaña</span>
            </button>
          </div>
        </section>
      )}

      {/* PÁGINA DE REFERENCIA */}
      {reference && (
        <section className="card">
          <div className="eyebrow">Vista de referencia</div>
          <h2>Página original intacta</h2>
          <p>Esta vista conserva el listado sin cambios. Para probar el llenado guiado, abre la réplica con estudiantes de ejemplo.</p>
          <a className="btn-link-anchor" href="http://localhost:4174/demo" target="_blank" rel="noreferrer">
            <IconSparkles />
            <span>Abrir prueba con 3 estudiantes</span>
          </a>
        </section>
      )}

      {/* PESTAÑA ACTIVA ES SIGCE WEB */}
      {sigceTab && (
        <section className="card info-banner">
          <div className="eyebrow" style={{ color: '#0284c7' }}>
            <IconSparkles size={13} /> Pestaña activa: SIGCE Web
          </div>
          <h2>Conectado a SIGCE</h2>
          <p>
            {session
              ? `Sesión vinculada correctamente como ${session.user.firstName} ${session.user.lastName} (${session.user.role === 'ADMINISTRATIVE' ? 'Dirección' : session.user.role === 'SECRETARY' ? 'Secretaría' : session.user.role}). Para transcribir calificaciones, cambia o abre la pestaña del portal SIE oficial.`
              : 'Inicia sesión en esta pestaña de SIGCE con tu cuenta institucional. El asistente detectará tus credenciales automáticamente sin pedirte contraseñas.'}
          </p>
          <div className="action-stack">
            <a
              className="btn success full"
              href="https://academico.sie.gob.bo"
              target="_blank"
              rel="noreferrer"
            >
              <IconExternalLink size={16} />
              <span>Abrir portal oficial del SIE (academico.sie.gob.bo)</span>
            </a>
            <a
              className="btn outline full"
              href="http://localhost:4174/demo"
              target="_blank"
              rel="noreferrer"
            >
              <IconSparkles size={16} />
              <span>Abrir réplica SIE de demostración</span>
            </a>
          </div>
        </section>
      )}

      {/* PASO 1: VINCULACIÓN CON SESIÓN DE SIGCE (SIN PEDIR CONTRASEÑA EN EL PLUGIN) */}
      {!portalError && !demo && !reference && !sigceTab && !session && (
        <section className="card">
          <div className="eyebrow">Paso 1 de 3 · Conexión SIGCE</div>
          <h2>Inicia sesión en SIGCE desde tu navegador</h2>
          <p>
            El asistente sincroniza las notas oficiales directamente desde SIGCE. Para usarlo, primero inicia sesión en la plataforma web con tu cuenta de Dirección o Secretaría.
          </p>

          <div className="session-prompt-box">
            <div className="session-prompt-status">
              <span className="session-dot pulse" />
              <span>Esperando sesión activa en el navegador...</span>
            </div>
            <p className="session-prompt-note">
              Por tu seguridad, el plugin no te pide usuario ni contraseña. Se vincula automáticamente en cuanto inicias sesión en la página.
            </p>
          </div>

          <div className="action-stack">
            <button
              type="button"
              className="btn primary full"
              onClick={() => {
                const targetUrl = apiBase === localApi ? 'http://localhost:5173' : 'https://sigce.lat';
                void chrome.tabs.create({ url: targetUrl });
              }}
            >
              <IconSparkles size={16} />
              <span>Abrir {apiBase === localApi ? 'SIGCE local' : 'sigce.lat'} para iniciar sesión</span>
            </button>

            <button
              type="button"
              className="btn outline full"
              onClick={() => void checkAndSyncSession(true)}
              disabled={busy || checkingSession}
            >
              <IconRefresh className={checkingSession ? 'spin' : ''} size={15} />
              <span>{checkingSession ? 'Buscando sesión activa...' : 'Detectar sesión activa ahora'}</span>
            </button>
          </div>

          <details className="subtle-details">
            <summary>
              <span>Servidor: {apiBase === deployedApi ? 'SIGCE desplegado (producción)' : 'SIGCE local (desarrollo)'}</span>
              <span>Cambiar</span>
            </summary>
            <div className="subtle-details-body">
              <label className="field">
                Origen de datos
                <select
                  value={apiBase}
                  onChange={(e) => {
                    setManualApiOverride(true);
                    setApiBase(e.target.value);
                  }}
                >
                  <option value={deployedApi}>SIGCE desplegado (producción · https://api.sigce.lat/api/v1)</option>
                  <option value={localApi}>SIGCE local (desarrollo · http://localhost:3000/api/v1)</option>
                </select>
              </label>
            </div>
          </details>
        </section>
      )}

      {/* ROL NO AUTORIZADO (DOCENTE, ESTUDIANTE O PADRE DE FAMILIA) */}
      {!portalError && !demo && !reference && !sigceTab && session && !isAuthorized && (
        <section className="card warning">
          <div className="eyebrow" style={{ color: '#b45309' }}>
            <IconAlert size={13} /> Rol no autorizado
          </div>
          <h2>Permiso insuficiente para el SIE</h2>
          <p>
            Has iniciado sesión como <strong>{session.user.firstName} {session.user.lastName}</strong> ({session.user.role}).
            El asistente SIE solo puede ser utilizado por cuentas con rol de Dirección o Secretaría de la institución.
          </p>
          <div className="action-stack">
            <button
              type="button"
              className="btn outline full"
              onClick={() => void signOut()}
            >
              <IconLogOut size={15} />
              <span>Desconectar e iniciar con otra cuenta</span>
            </button>
          </div>
        </section>
      )}

      {/* PASO 1B: CONFIRMACIÓN DE ACCESO EXITOSO AL SISTEMA PARA EMPEZAR A TRABAJAR */}
      {!portalError && !reference && !sigceTab && ((demo && tabId) || (session && isAuthorized)) && !workReady && !plan && (
        <section className="card success-hero">
          <div className="ready-icon-wrap">
            <IconShieldCheck size={30} />
          </div>
          <div className="ready-badge">
            <IconCheck size={13} />
            <span>{demo ? 'Modo demostración listo' : 'Acceso a SIGCE verificado'}</span>
          </div>
          <h2>¡Acceso exitoso al sistema!</h2>
          <p>
            {demo
              ? 'Cuando hayas iniciado sesión en la página de prueba y abierto el curso, pulsa el botón para empezar.'
              : `Bienvenida/o, ${session?.user.firstName} ${session?.user.lastName} (${session?.user.role === 'ADMINISTRATIVE' ? 'Dirección' : 'Secretaría'}). Tu sesión de SIGCE está vinculada automáticamente. Una vez que hayas ingresado también al portal SIE, confirma abajo para empezar a trabajar.`}
          </p>

          <div className="ready-checklist">
            <div className="ready-check-item">
              <span className="check-icon"><IconCheck size={15} /></span>
              <span>
                <strong>{demo ? 'Datos de prueba listos:' : 'Sesión SIGCE activa:'}</strong>{' '}
                {demo ? '3 estudiantes ficticios disponibles.' : session?.apiBase === localApi ? 'SIGCE local' : 'SIGCE desplegado (sigce.lat)'}
              </span>
            </div>
            <div className="ready-check-item">
              <span className="check-icon"><IconCheck size={15} /></span>
              <span>
                <strong>Portal en navegador:</strong>{' '}
                {demo ? 'Réplica local detectada.' : 'Ingresa al SIE con tus credenciales y abre la lista del curso.'}
              </span>
            </div>
          </div>

          {!demo && session?.apiBase === localApi && (
            <label className="check-box">
              <input
                type="checkbox"
                checked={allowLocalOnOfficial}
                onChange={(e) => setAllowLocalOnOfficial(e.target.checked)}
              />
              <span>Confirmo que este SIGCE local contiene las notas oficiales del curso que voy a completar.</span>
            </label>
          )}

          <div className="action-stack">
            <button
              type="button"
              className="btn success full"
              disabled={refreshingTab || (!demo && session?.apiBase === localApi && !allowLocalOnOfficial)}
              onClick={() => void confirmAccessAndStart()}
            >
              <IconCheck size={17} />
              <span>Acceso exitoso · Empezar a trabajar</span>
              <IconArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* BANNER DE CONFIRMACIÓN DE ACCESO EXITOSO */}
      {readyToast && workReady && !plan && (
        <div className="toast-ready" role="status">
          <div className="toast-ready-left">
            <IconCheck size={16} />
            <span>Acceso exitoso confirmado · ¡Listo para trabajar!</span>
          </div>
          <button
            type="button"
            className="btn ghost-link"
            style={{ padding: '0 4px', color: '#065f46' }}
            onClick={() => setReadyToast(false)}
            aria-label="Ocultar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {/* PASO 2: SELECCIONAR CURSO Y CARGAR NOTAS */}
      {!portalError && !reference && !sigceTab && workReady && ((demo && tabId) || (session && isAuthorized)) && !plan && (
        <section className="card">
          <div className="eyebrow">Paso 2 de 3 · Selección</div>
          <h2>{demo ? 'Cargar lote de demostración' : 'Elige el curso a completar'}</h2>

          {demo ? (
            <>
              <p>Se prepararán calificaciones ficticias para practicar el recorrido guiado en la réplica del SIE.</p>
              <div className="action-stack">
                <button type="button" className="btn primary full" onClick={() => void activateDemoPlan(demoPlan)}>
                  <IconSparkles />
                  <span>Cargar notas demo (Primaria 2do B)</span>
                </button>
                <button
                  type="button"
                  className="btn outline full"
                  style={{ borderColor: '#d97706', color: '#92400e', background: '#fffbeb' }}
                  onClick={() => void activateDemoPlan(demoPlan6to)}
                >
                  <IconGraduationCap size={16} />
                  <span>Cargar demo 6to de Secundaria (Bachilleres)</span>
                </button>
              </div>
            </>
          ) : (
            <div className="form-stack">
              <div className="form-grid-2">
                <label className="field">
                  Gestión
                  <select
                    value={filters.academicYearId}
                    onChange={(e) => {
                      setFilters({ academicYearId: e.target.value, courseId: '', subjectId: '', periodNumber: 0 });
                      setCourseOptions(null);
                    }}
                  >
                    <option value="">Selecciona</option>
                    {(baseOptions?.years ?? []).map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  Trimestre
                  <select
                    value={filters.periodNumber}
                    onChange={(e) => setFilters({ ...filters, periodNumber: Number(e.target.value) })}
                    disabled={!filters.courseId}
                  >
                    <option value="0">Selecciona</option>
                    {periods.map((period) => (
                      <option key={period.id} value={period.number}>
                        {period.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field">
                Curso
                <select
                  value={filters.courseId}
                  onChange={(e) => {
                    setFilters({ ...filters, courseId: e.target.value, subjectId: '', periodNumber: 0 });
                    setCourseOptions(null);
                  }}
                >
                  <option value="">Selecciona un curso</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="banner-preventivo">
                <div className="banner-preventivo-header">
                  <IconShieldCheck size={16} />
                  <span>Medida Preventiva Institucional · Respaldo de Todo Curso</span>
                </div>
                <p>
                  Por política de seguridad académica, se genera automáticamente una <strong>copia de seguridad preventiva</strong> de las calificaciones de {selectedCourse ? selectedCourse.name : 'cada curso'} antes de que el asistente actúe en el SIE. Si el portal ministerial sufre caídas o errores de conexión, tus notas quedan protegidas.
                </p>
                {es6toSecundariaSeleccionado && (
                  <div className="banner-6to-subtag">
                    <IconGraduationCap size={13} />
                    <span>6to de Secundaria detectado: Cierre de actas de bachilleres habilitado.</span>
                  </div>
                )}
              </div>

              <label className="field">
                Materia
                <select
                  value={filters.subjectId}
                  onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
                  disabled={!filters.courseId}
                >
                  <option value="">Selecciona una materia</option>
                  {(courseOptions?.subjects ?? []).map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="btn primary full"
                disabled={busy || !filters.academicYearId || !filters.courseId || !filters.subjectId || !filters.periodNumber}
                onClick={() => void preparePlan()}
              >
                {busy ? <IconRefresh className="spin" /> : <IconArrowRight />}
                <span>{busy ? 'Cargando notas...' : 'Preparar notas cerradas'}</span>
              </button>

              <div className="backup-quick-row">
                <button
                  type="button"
                  className="btn ghost-link"
                  onClick={() => setShowBackupsModal(true)}
                >
                  <IconHistory size={13} />
                  <span>Historial de copias de seguridad ({savedBackups.length})</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* PASO 3: LOTE PREPARADO + BARRA DE PROGRESO */}
      {plan && (
        <section className="card compact">
          <div className="batch-header">
            <div style={{ minWidth: 0 }}>
              <div className="eyebrow">Paso 3 de 3 · Lote activo</div>
              <h2>{plan.course.name}</h2>
              <div className="batch-meta">
                {plan.subject.name} · {plan.period.name}
              </div>
            </div>
            <button
              type="button"
              className="btn ghost-link"
              onClick={() => {
                setPlan(null);
                setEntries([]);
                setInspection(null);
                setFillResult(null);
                setSaveObserved('');
                setError('');
              }}
            >
              Cambiar
            </button>
          </div>

          {plan.grades.length > 0 && (
            <div className="progress-wrap">
              <div className="progress-labels">
                <span>
                  Progreso: {Math.min(index, plan.grades.length)} de {plan.grades.length}
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {!inspection?.ok && (
            <div className="action-stack">
              <button type="button" className="btn primary full" disabled={busy || !tabId} onClick={() => void inspect()}>
                {busy ? <IconRefresh className="spin" /> : <IconSearch />}
                <span>{busy ? 'Comprobando pantalla...' : 'Comprobar pantalla del SIE'}</span>
              </button>
            </div>
          )}

          {inspection && (
            <div className={`status-box ${inspection.ok ? 'good' : 'bad'}`}>
              {inspection.ok ? <IconCheck size={15} /> : <IconAlert size={15} />}
              <span>
                {inspection.status === 'READY'
                  ? `Tabla reconocida: ${inspection.studentCount} estudiantes en pantalla.`
                  : inspection.ok
                    ? 'Pantalla reconocida correctamente.'
                    : inspection.detail}
              </span>
            </div>
          )}

          {/* TARJETA DE COPIA DE SEGURIDAD PREVENTIVA DE NOTAS */}
          <div className="backup-card">
            <div className="backup-card-header">
              <div className="backup-card-title">
                <IconShieldCheck size={18} />
                <div>
                  <strong>Copia de Seguridad Preventiva Verificada</strong>
                  <span className="backup-card-sub">
                    {lastBackup?.timestampFormatted ? `Respaldo activo: ${lastBackup.timestampFormatted}` : 'Respaldo generado'} · {plan.grades.length} estudiantes asegurados
                  </span>
                </div>
              </div>
              <span className="badge-preventivo-pill">
                <IconCheck size={12} />
                {is6toSecundaria(plan.course.name) ? '6to Sec. Bachilleres' : 'Medida preventiva activa'}
              </span>
            </div>

            <p className="backup-card-help">
              Como medida preventiva obligatoria para todo curso, se resguardaron las notas antes de que el asistente actúe en el SIE. Si la plataforma ministerial falla, se congela o se pierde la sesión, puedes descargar las notas o restaurar el lote:
            </p>

            <div className="backup-card-actions">
              <button
                type="button"
                className="btn outline sm"
                onClick={() => lastBackup && downloadBackupCsv(lastBackup)}
                disabled={!lastBackup}
                title="Descargar tabla compatible con Excel con todas las notas y RUDEs"
              >
                <IconFileText size={14} />
                <span>Descargar Excel (CSV)</span>
              </button>
              <button
                type="button"
                className="btn outline sm"
                onClick={() => lastBackup && downloadBackupJson(lastBackup)}
                disabled={!lastBackup}
                title="Descargar archivo JSON con huella criptográfica de integridad SIGCE"
              >
                <IconDownload size={14} />
                <span>Descargar JSON</span>
              </button>
              <button
                type="button"
                className="btn ghost-link sm"
                onClick={() => setShowBackupsModal(true)}
              >
                <IconHistory size={14} />
                <span>Historial ({savedBackups.length})</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TARJETA DEL ESTUDIANTE ACTUAL */}
      {plan && current && inspection?.ok && (
        <section className="card">
          <div className="student-top">
            <span className="eyebrow" style={{ marginBottom: 0 }}>
              Estudiante {index + 1} de {plan.grades.length}
            </span>
            <span className="rude-pill">RUDE {current.rude}</span>
          </div>

          <h2 className="student-name">
            {current.lastName}, {current.firstName}
          </h2>

          <div className="grade-box">
            <div>
              <span className="grade-box-label">Calificación SIGCE</span>
              <span className="grade-box-sub">{plan.subject.name}</span>
            </div>
            <span className="grade-value">{current.value}</span>
          </div>

          {fillResult && 'detail' in fillResult && (
            <div className={`status-box ${fillResult.ok ? 'good' : 'bad'}`}>
              {fillResult.ok ? <IconCheck size={15} /> : <IconAlert size={15} />}
              <span>{fillResult.detail}</span>
            </div>
          )}

          {fillResult?.status === 'FILLED' && !saveObserved && (
            <div className="status-box info">
              <IconAlert size={15} />
              <span>
                Revisa la nota en {demo ? 'la página de prueba' : 'el SIE'} y pulsa <strong>Guardar</strong> allí para continuar.
              </span>
            </div>
          )}

          {fillResult?.status === 'FILLED' && saveObserved && (
            <div className="status-box good">
              <IconCheck size={15} />
              <span>{saveObserved}</span>
            </div>
          )}

          {!fillResult && (
            <div className="pre-action-reassurance">
              <IconShieldCheck size={14} />
              <span>Medida preventiva: Respaldo de notas guardado en el navegador antes de interactuar con el SIE.</span>
            </div>
          )}

          <div className="action-stack">
            {!fillResult && (
              <button type="button" className="btn primary full" disabled={busy} onClick={() => void fill()}>
                {busy ? <IconRefresh className="spin" /> : <IconArrowRight />}
                <span>{index === 0 ? 'Rellenar primera nota' : 'Rellenar nota en el SIE'}</span>
              </button>
            )}

            {fillResult?.status === 'ERROR' && (
              <button type="button" className="btn primary full" disabled={busy} onClick={() => void fill()}>
                <IconRefresh />
                <span>Reintentar esta nota</span>
              </button>
            )}

            {fillResult?.status === 'CONFLICT' && (
              <button type="button" className="btn danger full" disabled={busy} onClick={() => void fill(true)}>
                <IconAlert />
                <span>Reemplazar nota tras revisarla</span>
              </button>
            )}

            {lastBackup && (fillResult?.status === 'ERROR' || fillResult?.status === 'CONFLICT') && (
              <div className="backup-emergency-pill">
                <IconShieldCheck size={14} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  ¿Falla el portal SIE? Tu copia de seguridad está a salvo:
                </span>
                <button
                  type="button"
                  className="btn ghost-link"
                  style={{ textDecoration: 'underline', padding: 0, fontWeight: 700 }}
                  onClick={() => downloadBackupCsv(lastBackup)}
                >
                  Descargar CSV
                </button>
              </div>
            )}

            {fillResult?.status === 'FILLED' && (
              <button
                type="button"
                className="btn success full"
                disabled={!saveObserved || busy}
                onClick={() => void advance('CONFIRMED_BY_USER', 'La responsable confirmó el aviso de guardado en pantalla.')}
              >
                <IconCheck size={16} />
                <span>Confirmar guardado · Siguiente</span>
                <IconArrowRight size={14} />
              </button>
            )}

            {fillResult?.status === 'ALREADY_EQUAL' && (
              <button
                type="button"
                className="btn primary full"
                disabled={busy}
                onClick={() => void advance('SKIPPED', 'La nota ya se mostraba igual en la casilla visible.')}
              >
                <span>Ya coincide · Siguiente</span>
                <IconArrowRight />
              </button>
            )}

            <button
              type="button"
              className="btn ghost-link full"
              disabled={busy}
              onClick={() =>
                void advance(
                  fillResult?.status === 'ERROR' ? 'ERROR' : 'SKIPPED',
                  fillResult?.status === 'ERROR' ? fillResult.detail : 'Omitido por la responsable.',
                )
              }
            >
              Omitir este estudiante
            </button>
          </div>

          <details className="subtle-details">
            <summary>
              <span>¿La materia tiene otro nombre en el SIE?</span>
              <span>{alias.trim() ? 'Configurado' : 'Opcional'}</span>
            </summary>
            <div className="subtle-details-body">
              <label className="field">
                Alias de materia en SIE
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder={plan.subject.name}
                />
              </label>
            </div>
          </details>
        </section>
      )}

      {/* SIN NOTAS DISPONIBLES */}
      {plan && plan.grades.length === 0 && (
        <section className="card">
          <h2>Sin notas disponibles</h2>
          <p>Esta selección no tiene calificaciones publicadas para cargar en el trimestre elegido.</p>
          <div className="action-stack">
            <button type="button" className="btn full" onClick={() => setPlan(null)}>
              Elegir otra materia o curso
            </button>
          </div>
        </section>
      )}

      {/* RECORRIDO TERMINADO */}
      {plan && !current && plan.grades.length > 0 && (
        <section className="card success-hero">
          <div className="ready-icon-wrap">
            <IconCheck size={28} />
          </div>
          <div className="ready-badge">
            <IconCheck size={13} />
            <span>Lote completado</span>
          </div>
          <h2>¡Recorrido terminado!</h2>
          <p>Has revisado todos los estudiantes de {plan.course.name}.</p>

          <div className="summary-stats">
            <div className="stat-tile good">
              <strong>{confirmedCount}</strong>
              <span>Confirmadas</span>
            </div>
            <div className="stat-tile">
              <strong>{skippedCount}</strong>
              <span>Omitidas / Pend.</span>
            </div>
          </div>

          {!summarySent ? (
            <button type="button" className="btn success full" disabled={busy} onClick={() => void finish()}>
              <IconCheck size={16} />
              <span>{demo ? 'Cerrar demostración' : 'Finalizar recorrido'}</span>
            </button>
          ) : (
            <>
              <div className="status-box good" style={{ textAlign: 'left' }}>
                <IconCheck size={15} />
                <span>Cada fila quedó registrada en SIGCE. Una confirmación en pantalla no reemplaza la conciliación oficial del SIE.</span>
              </div>
              <div className="action-stack">
                <button
                  type="button"
                  className="btn primary full"
                  onClick={() => {
                    setPlan(null);
                    setEntries([]);
                    setInspection(null);
                    setFillResult(null);
                    setSummarySent(false);
                  }}
                >
                  Cargar otro curso o materia
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* ERROR GLOBAL */}
      {error && (
        <p role="alert" className="global-error">
          <IconAlert size={16} />
          <span>{error}</span>
        </p>
      )}

      {/* MODAL DE HISTORIAL DE COPIAS DE SEGURIDAD */}
      {showBackupsModal && (
        <div className="modal-backdrop" onClick={() => setShowBackupsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <IconShieldCheck size={20} />
                <div>
                  <h3>Copias de Seguridad de Calificaciones</h3>
                  <p>Respaldos automáticos ante caídas o fallos del portal SIE</p>
                </div>
              </div>
              <button
                type="button"
                className="btn ghost-link"
                style={{ fontSize: '18px', padding: '0 8px' }}
                onClick={() => setShowBackupsModal(false)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {savedBackups.length === 0 ? (
                <div className="modal-empty">
                  <IconAlert size={24} />
                  <p>No hay copias de seguridad guardadas todavía.</p>
                  <span>Se crean automáticamente cada vez que preparas las notas de un curso.</span>
                </div>
              ) : (
                <div className="backup-list">
                  {savedBackups.map((b) => (
                    <div key={b.id} className="backup-item">
                      <div className="backup-item-header">
                        <div>
                          <div className="backup-item-title-row">
                            <span className="backup-item-course">{b.courseName}</span>
                            {b.isSeniorYear && (
                              <span className="badge-6to-pill mini">
                                <IconGraduationCap size={11} />
                                6to Sec
                              </span>
                            )}
                          </div>
                          <span className="backup-item-subject">
                            {b.subjectName} · {b.periodName} · {b.totalStudents} estudiantes
                          </span>
                        </div>
                        <span className="backup-item-date">{b.timestampFormatted}</span>
                      </div>

                      <div className="backup-item-actions">
                        <button
                          type="button"
                          className="btn outline mini"
                          onClick={() => downloadBackupCsv(b)}
                          title="Descargar en formato Excel (CSV con BOM UTF-8)"
                        >
                          <IconFileText size={12} />
                          Excel (CSV)
                        </button>
                        <button
                          type="button"
                          className="btn outline mini"
                          onClick={() => downloadBackupJson(b)}
                          title="Descargar archivo JSON con huella criptográfica de integridad"
                        >
                          <IconDownload size={12} />
                          JSON
                        </button>
                        <button
                          type="button"
                          className="btn primary mini"
                          onClick={() => handleRestoreBackup(b)}
                          title="Cargar estas notas como el lote activo para completar en el SIE"
                        >
                          Restaurar lote
                        </button>
                        <button
                          type="button"
                          className="btn danger mini"
                          style={{ padding: '3px 6px' }}
                          onClick={() => void handleDeleteBackup(b.id)}
                          title="Eliminar este respaldo"
                        >
                          <IconTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn full"
                onClick={() => setShowBackupsModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>SIGCE rellena campos visibles · Tú revisas y decides qué guardar.</footer>
    </div>
  );
}
