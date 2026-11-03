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

function sincronizardom(tema: sigcetema) {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', tema);
  if (tema === 'executive') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function aplicartema(tema: sigcetema) {
  if (typeof window === 'undefined') return;
  sincronizardom(tema);
  localStorage.setItem(constantealmacenamientoclave, tema);
  oyentes.forEach((oyente) => oyente());
}

if (typeof window !== 'undefined') {
  sincronizardom(obtenerinicialtema());
  window.addEventListener('storage', (evento) => {
    if (evento.key === constantealmacenamientoclave) {
      sincronizardom(obtenerinicialtema());
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
    isDark: tema === 'executive',
  };
}
