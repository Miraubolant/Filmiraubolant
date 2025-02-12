import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useTheme() {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    // Appliquer le thème initial
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Détecter les préférences système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);

  return { theme, setTheme };
}