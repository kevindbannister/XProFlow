export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'xproflow-theme-mode';

export const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedMode === 'light' || savedMode === 'dark') {
    return savedMode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyThemeMode = (themeMode: ThemeMode, persist = true) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-dark', 'light', 'dark');

  if (themeMode === 'dark') {
    root.classList.add('theme-dark', 'dark');
  } else {
    root.classList.add('theme-light', 'light');
  }

  if (persist && typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }
};
