export default defineContentScript({
  matches: [
    'https://sigce.lat/*',
    'https://*.sigce.lat/*',
    'http://localhost:5173/*',
    'https://*.vercel.app/*',
  ],
  runAt: 'document_idle',
  main() {
    function sincronizarSesion() {
      try {
        const raw = localStorage.getItem('sigce_extension_session');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && parsed.accessToken) {
            void chrome.storage.local.set({ sigceSession: parsed });
            return parsed;
          }
        }
        void chrome.storage.local.remove('sigceSession');
      } catch {}
      return null;
    }

    sincronizarSesion();

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
      if (event.key === 'sigce_extension_session') {
        sincronizarSesion();
      }
    });

    chrome.runtime.onMessage.addListener((raw, sender, respond) => {
      if (sender.id !== chrome.runtime.id || !raw || typeof raw !== 'object') return;
      const message = raw as { kind?: string };
      if (message.kind === 'SIGCE_GET_WEB_SESSION') {
        const sesion = sincronizarSesion();
        respond({ ok: Boolean(sesion), session: sesion });
        return;
      }
    });
  },
});
