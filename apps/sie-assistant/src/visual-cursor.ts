import type { PortalStep, PortalStepObserver } from './portal';

const cursorMarkup = `<svg width="23" height="28" viewBox="0 0 23 28" aria-hidden="true"><path d="M2 2v20l5.3-5.2 3.6 8.2 4.1-1.8-3.6-8.1H20L2 2Z" fill="#4F46E5" stroke="#0F172A" stroke-width="2" stroke-linejoin="round"/></svg>`;

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(value, maximum));
}

export function createVisualCursor(): { show: PortalStepObserver; hide: () => void } {
  const host = document.createElement('div');
  host.id = 'sigce-assistant-visual-cursor';
  host.setAttribute('aria-hidden', 'true');
  Object.assign(host.style, { position: 'fixed', inset: '0', zIndex: '2147483647', pointerEvents: 'none' });
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    :host { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; opacity: 0; transition: opacity 160ms ease; }
    :host(.visible) { opacity: 1; }
    .target { position: fixed; box-sizing: border-box; border: 2px solid #4f46e5; border-radius: 8px; background: rgba(79,70,229,.1); box-shadow: 0 0 0 4px rgba(79,70,229,.18); transition: left 280ms ease, top 280ms ease, width 280ms ease, height 280ms ease; }
    .target[data-action="warning"] { border-color: #e11d48; background: rgba(225,29,72,.1); box-shadow: 0 0 0 4px rgba(225,29,72,.18); }
    .pointer { position: fixed; width: 23px; height: 28px; filter: drop-shadow(0 3px 4px rgba(15,23,42,.3)); transition: left 280ms ease, top 280ms ease; }
    .label { position: fixed; max-width: 240px; padding: 6px 10px; border-radius: 8px; background: #0f172a; color: #f8fafc; font: 600 12px/1.35 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 6px 16px rgba(15,23,42,.25); border: 1px solid rgba(255,255,255,.12); transition: left 280ms ease, top 280ms ease; }
    @media (prefers-reduced-motion: reduce) { :host, .target, .pointer, .label { transition: none; } }
  `;
  const target = document.createElement('div');
  target.className = 'target';
  const pointer = document.createElement('div');
  pointer.className = 'pointer';
  pointer.innerHTML = cursorMarkup;
  const label = document.createElement('div');
  label.className = 'label';
  shadow.append(style, target, pointer, label);
  document.documentElement.append(host);

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let hideTimer: number | undefined;

  const hide = () => {
    window.clearTimeout(hideTimer);
    host.classList.remove('visible');
  };

  const show = async (step: PortalStep) => {
    window.clearTimeout(hideTimer);
    if (!step.element.isConnected) return;
    step.element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    await wait(reducedMotion ? 0 : 40);
    const rect = step.element.getBoundingClientRect();
    if (!step.element.isConnected || rect.width === 0 || rect.height === 0) return;

    target.style.left = `${rect.left - 4}px`;
    target.style.top = `${rect.top - 4}px`;
    target.style.width = `${rect.width + 8}px`;
    target.style.height = `${rect.height + 8}px`;
    target.dataset.action = step.action;

    pointer.style.left = `${clamp(rect.left + Math.min(18, rect.width / 2), 4, window.innerWidth - 25)}px`;
    pointer.style.top = `${clamp(rect.top + Math.min(12, rect.height / 2), 4, window.innerHeight - 30)}px`;
    label.textContent = step.label;
    label.style.left = `${clamp(rect.left + 20, 8, Math.max(8, window.innerWidth - 230))}px`;
    label.style.top = `${rect.top > 44 ? rect.top - 42 : Math.min(rect.bottom + 8, window.innerHeight - 38)}px`;
    host.classList.add('visible');

    await wait(reducedMotion ? 80 : 540);
    if (step.action === 'done' || step.action === 'warning') {
      hideTimer = window.setTimeout(hide, 2300);
    }
  };

  return { show, hide };
}
