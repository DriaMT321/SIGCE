import { useState, useEffect } from 'react';

export type SigceTheme = 'institutional' | 'executive';

const STORAGE_KEY = 'sigce_theme';

export function getInitialTheme(): SigceTheme {
  if (typeof window === 'undefined') return 'institutional';
  const saved = localStorage.getItem(STORAGE_KEY) as SigceTheme | null;
  return saved === 'executive' ? 'executive' : 'institutional'; // 'institutional' by default
}

export function applyTheme(theme: SigceTheme) {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<SigceTheme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: SigceTheme = theme === 'institutional' ? 'executive' : 'institutional';
    setTheme(nextTheme);
  };

  return { theme, setTheme, toggleTheme, isInstitutional: theme === 'institutional' };
}
