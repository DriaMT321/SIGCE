import { fillVisibleGrade, inspectPortal } from '../src/portal';
import type { PortalRequest, PortalResponse, SavedMessage } from '../src/types';

export default defineContentScript({
  matches: ['https://academico.sie.gob.bo/*', 'http://localhost:4174/*'],
  runAt: 'document_idle',
  main() {
    let observer: MutationObserver | null = null;
    let pendingRude = '';
    let trustedSaveClicked = false;

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
      const current = new Map<Element, string>();
      for (const node of document.querySelectorAll('#toast,[role="status"],[role="alert"]')) {
        current.set(node, node.textContent?.trim() ?? '');
      }
      observer = new MutationObserver(() => {
        for (const node of document.querySelectorAll('#toast,[role="status"],[role="alert"]')) {
          const message = node.textContent?.trim() ?? '';
          if (!message || message === current.get(node)) continue;
          current.set(node, message);
          if (!trustedSaveClicked) continue;
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
        respond({ ok: true });
        return;
      }
      if (request.kind === 'SIGCE_INSPECT') {
        respond(inspectPortal(request.expectedCourse));
        return;
      }
      if (request.kind === 'SIGCE_FILL') {
        observeManualSave(request.grade.gradeId, request.grade.rude);
        void fillVisibleGrade(request).then((result: PortalResponse) => {
          if (!result.ok || result.status !== 'FILLED') stopObserving();
          respond(result);
        });
        return true;
      }
    });
  },
});
