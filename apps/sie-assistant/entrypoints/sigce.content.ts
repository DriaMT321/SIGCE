export default defineContentScript({
  matches: [
    'https://sigce.lat/*',
    'https://*.sigce.lat/*',
    'http://localhost:5173/*',
    'https://*.vercel.app/*',
  ],
  runAt: 'document_idle',
  main() {
    function resolverApiBase(): string {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api/v1';
      }
      if (window.location.protocol === 'https:' && !hostname.includes('sigce.lat')) {
        const baseHost = hostname.replace(/^www\./, '');
        return 'https://api.' + baseHost + '/api/v1';
      }
      return 'https://api.sigce.lat/api/v1';
    }

    async function sincronizarSesion(): Promise<any> {
      // 1. Verificar si ya existe en localStorage
      try {
        const raw = localStorage.getItem('sigce_extension_session');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && parsed.accessToken) {
            void chrome.storage.local.set({ sigceSession: parsed });
            return parsed;
          }
        }
      } catch { }

      // 2. Verificar si hay usuario en sessionStorage/localStorage (estándar en sigce.lat)
      let usuarioGuardado: any = null;
      try {
        const rawUser = sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');
        if (rawUser) usuarioGuardado = JSON.parse(rawUser);
      } catch { }

      // 3. Si no hay token en localStorage pero el usuario ha iniciado sesión en la pestaña,
      // renovar el token usando las cookies HttpOnly de la página web
      const apiBase = resolverApiBase();
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
          const user = data?.data?.user || usuarioGuardado;
          if (accessToken && user) {
            const nuevaSesion = {
              accessToken,
              user,
              apiBase,
              timestamp: Date.now(),
            };
            try {
              localStorage.setItem('sigce_extension_session', JSON.stringify(nuevaSesion));
            } catch { }
            void chrome.storage.local.set({ sigceSession: nuevaSesion });
            return nuevaSesion;
          }
        }
      } catch { }

      return null;
    }

    // Intentar sincronizar al cargar el script en la página
    void sincronizarSesion();

    window.addEventListener('sigce:extension_session_updated', (event: unknown) => {
      const customEvent = event as { detail?: { accessToken?: string } };
      if (customEvent?.detail?.accessToken) {
        void chrome.storage.local.set({ sigceSession: customEvent.detail });
      }
    });

    window.addEventListener('sigce:extension_session_cleared', () => {
      void chrome.storage.local.remove('sigceSession');
    });

    window.addEventListener('storage', (event) => {
      if (event.key === 'sigce_extension_session' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed?.accessToken) {
            void chrome.storage.local.set({ sigceSession: parsed });
          }
        } catch { }
      }
    });

    chrome.runtime.onMessage.addListener((raw, sender, respond) => {
      if (sender.id !== chrome.runtime.id || !raw || typeof raw !== 'object') return;
      const message = raw as { kind?: string };
      if (message.kind === 'SIGCE_GET_WEB_SESSION') {
        void sincronizarSesion().then((sesion) => {
          respond({ ok: Boolean(sesion), session: sesion });
        });
        return true; // Asíncrono
      }
    });
  },
});
