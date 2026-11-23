import type { GradePlan, PlanFilters, SummaryEntry } from './types';

const localApi = 'http://localhost:3000/api/v1';
const officialApi = 'https://api.sigce.lat/api/v1';

export interface SigceSession {
  accessToken: string;
  user: { id: string; firstName: string; lastName: string; role: string };
  apiBase: string;
}

function isHostedDemoOrigin(origin: string): boolean {
  return (
    origin === 'http://localhost:5173' ||
    origin === 'https://sigce.lat' ||
    origin.endsWith('.sigce.lat') ||
    origin.endsWith('.vercel.app')
  );
}

export function isDemoPortal(portalUrl: string): boolean {
  try {
    const url = new URL(portalUrl);
    if (url.origin === 'http://localhost:4174' && url.pathname === '/demo') return true;
    return isHostedDemoOrigin(url.origin) && url.pathname.startsWith('/sie-demo');
  } catch {
    return false;
  }
}

export function isReferencePortal(portalUrl: string): boolean {
  try {
    const url = new URL(portalUrl);
    return url.origin === 'http://localhost:4174' && !isDemoPortal(portalUrl);
  } catch {
    return false;
  }
}

export function isSigceWeb(portalUrl: string): boolean {
  try {
    const url = new URL(portalUrl);
    return isHostedDemoOrigin(url.origin) && !url.pathname.startsWith('/sie-demo');
  } catch {
    return false;
  }
}

export function apiForPortal(portalUrl: string): string {
  try {
    const url = new URL(portalUrl);
    if (url.origin === 'http://localhost:4174' || (url.origin === 'http://localhost:5173' && url.pathname.startsWith('/sie-demo'))) {
      return localApi;
    }
    if (url.origin === 'https://academico.sie.gob.bo') return officialApi;
    if (isHostedDemoOrigin(url.origin)) return officialApi;
    if (url.origin === 'http://localhost:5173') return localApi;
  } catch {}
  throw new Error('Abre el SIE oficial (academico.sie.gob.bo) o la réplica autorizada para usar el asistente.');
}

async function jsonResponse<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : `SIGCE respondió ${response.status}`;
    throw new Error(message);
  }
  return payload as T;
}

export async function request<T>(session: SigceSession, path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${session.apiBase}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
    credentials: 'omit',
  });
  if (response.status === 401) {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      void chrome.storage.local.remove('sigceSession');
    }
    throw new Error('La sesión de SIGCE venció. Inicia sesión nuevamente en sigce.lat.');
  }
  return jsonResponse<T>(response);
}

export async function loadOptions(session: SigceSession): Promise<{
  years: Array<{ id: string; name: string; isActive: boolean }>;
  courses: Array<{ id: string; name: string; academicYearId: string }>;
}> {
  const [years, courses] = await Promise.all([
    request<{ data: Array<{ id: string; name: string; isActive: boolean }> }>(
      session,
      '/academic-years',
    ),
    request<{ data: Array<{ id: string; name: string; academicYearId: string }> }>(
      session,
      '/courses?limit=100&offset=0',
    ),
  ]);
  return { years: years.data, courses: courses.data };
}

export async function loadCourseOptions(session: SigceSession, yearId: string, courseId: string): Promise<{
  periods: Array<{ id: string; name: string; number: number; isClosed: boolean }>;
  subjects: Array<{ id: string; name: string; code: string }>;
}> {
  const [periods, subjects] = await Promise.all([
    request<{ data: Array<{ id: string; name: string; number: number; isClosed: boolean }> }>(
      session,
      `/periods?academicYearId=${encodeURIComponent(yearId)}`,
    ),
    request<{ data: Array<{ id: string; name: string; code: string }> }>(
      session,
      `/subjects?courseId=${encodeURIComponent(courseId)}`,
    ),
  ]);
  return { periods: periods.data, subjects: subjects.data };
}

export async function loadGrades(session: SigceSession, filters: PlanFilters): Promise<GradePlan> {
  const query = new URLSearchParams({
    academicYearId: filters.academicYearId,
    courseId: filters.courseId,
    subjectId: filters.subjectId,
    periodNumber: String(filters.periodNumber),
  });
  const response = await request<{ data: GradePlan }>(
    session,
    `/sie-sync/assistant/grades?${query.toString()}`,
  );
  return response.data;
}

export async function sendSummary(
  session: SigceSession,
  filters: PlanFilters,
  fingerprint: string,
  entries: SummaryEntry[],
  operationId: string,
): Promise<void> {
  await request(session, '/sie-sync/assistant/summary', {
    method: 'POST',
    body: JSON.stringify({ ...filters, fingerprint, entries, operationId }),
  });
}
