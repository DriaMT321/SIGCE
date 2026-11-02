import { useSyncExternalStore } from 'react';

export type sigcetema = 'institutional' | 'executive';

const constantealmacenamientoclave = 'sigce_theme';
const oyentes = new Set<() => void>();

export function obtenerinicialtema(): sigcetema {
  if (typeof window === 'undefined') return 'institutional';
  return localStorage.getItem(constantealmacenamientoclave) === 'executive'
    ? 'executive'
    : 'institutional';
}

export function aplicartema(tema: sigcetema) {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem(constantealmacenamientoclave, tema);
  oyentes.forEach((oyente) => oyente());
}

if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('data-theme', obtenerinicialtema());
  window.addEventListener('storage', (evento) => {
    if (evento.key === constantealmacenamientoclave) {
      document.documentElement.setAttribute('data-theme', obtenerinicialtema());
      oyentes.forEach((oyente) => oyente());
    }
  });
}

export function usotema() {
  const tema = useSyncExternalStore(
    (oyente) => {
      oyentes.add(oyente);
      return () => oyentes.delete(oyente);
    },
    obtenerinicialtema,
    () => 'institutional',
  );

  const alternartema = () => {
    const siguientetema: sigcetema = tema === 'institutional' ? 'executive' : 'institutional';
    aplicartema(siguientetema);
  };

  return {
    theme: tema,
    setTheme: aplicartema,
    toggleTheme: alternartema,
    isInstitutional: tema === 'institutional',
  };
}
