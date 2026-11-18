import { fillVisibleGrade, inspectPortal } from '../src/portal';
import { createVisualCursor } from '../src/visual-cursor';
import type { PortalRequest, PortalResponse, SavedMessage } from '../src/types';

export default defineContentScript({
  matches: [
    'https://academico.sie.gob.bo/*',
    'http://localhost:4174/*',
    'http://localhost:5173/sie-demo*',
    'https://sigce.lat/sie-demo*',
    'https://*.sigce.lat/sie-demo*',
    'https://*.vercel.app/sie-demo*',
  ],
  runAt: 'document_idle',
  main() {
    let observer: MutationObserver | null = null;
    let pendingRude = '';
    let trustedSaveClicked = false;
    let visualCursor: ReturnType<typeof createVisualCursor> | null = null;

    document.addEventListener('click', (event) => {
      if (!event.isTrusted || !pendingRude) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('button,input[type="submit"]');
      const dialog = button?.closest('[role="dialog"],.grade-modal');
      if (!button || !dialog) return;
      const label = `${button.textContent ?? ''} ${button.getAttribute('aria-label') ?? ''}`;
      if (!/guardar|registrar cambios/i.test(label)) return;
      const dialogRude = dialog.querySelector('#modal-code')?.textContent?.replace(/\s/g, '') ?? '';
      if (dialogRude !== pendingRude && !dialog.textContent?.includes(pendingRude)) return;
      trustedSaveClicked = true;
    }, true);

    function stopObserving() {
      observer?.disconnect();
      observer = null;
      pendingRude = '';
      trustedSaveClicked = false;
    }

    function observeManualSave(gradeId: string, rude: string) {
      stopObserving();
      pendingRude = rude.replace(/\s/g, '');
      observer = new MutationObserver((mutations) => {
        if (!trustedSaveClicked) return;
        const changed = new Set<Element>();
        for (const mutation of mutations) {
          const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
          const status = target?.closest('#toast,[role="status"],[role="alert"]');
          if (status) changed.add(status);
        }
        for (const node of changed) {
          const message = node.textContent?.trim() ?? '';
          if (!/guardad[oa]s?|registrad[oa]s?|actualizad[oa]s?/i.test(message)) continue;
          if (node.getClientRects().length === 0) continue;
          const event: SavedMessage = {
            kind: 'SIGCE_SAVE_OBSERVED',
            gradeId,
            detail: `La página mostró: ${message.slice(0, 180)}`,
          };
          void chrome.runtime.sendMessage(event).catch(() => undefined);
          stopObserving();
          return;
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    chrome.runtime.onMessage.addListener((raw, sender, respond) => {
      if (sender.id !== chrome.runtime.id || !raw || typeof raw !== 'object') return;
      const request = raw as PortalRequest;
      if (request.kind === 'SIGCE_RESET') {
        stopObserving();
        visualCursor?.hide();
        respond({ ok: true });
        return;
      }
      if (request.kind === 'SIGCE_INSPECT') {
        respond(inspectPortal(request.expectedCourse));
        return;
      }
      if (request.kind === 'SIGCE_FILL') {
        observeManualSave(request.grade.gradeId, request.grade.rude);
        visualCursor ??= createVisualCursor();
        void fillVisibleGrade(request, visualCursor.show).then((result: PortalResponse) => {
          if (!result.ok || result.status !== 'FILLED') {
            stopObserving();
            if (result.status === 'ERROR') visualCursor?.hide();
          }
          respond(result);
        });
        return true;
      }
    });
  },
});
