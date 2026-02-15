import { useEffect, useState } from 'react';
import { Bell, ChevronDown, CircleHelp, Moon, Sun } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { getUserInitials, useUser } from '../../context/UserContext';
import AppLogo from '../branding/AppLogo';

type TopbarProps = {
  title?: string;
};

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'xproflow-theme-mode';

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedMode === 'light' || savedMode === 'dark') {
    return savedMode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const Topbar = ({ title }: TopbarProps) => {
  const { user } = useUser();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'light', 'dark');

    if (themeMode === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else {
      root.classList.add('theme-light', 'light');
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="topbar-surface fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between border-b px-3 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-2">
        <AppLogo className="h-6 w-auto" />
        {title ? <h1 className="theme-text-secondary truncate text-sm font-semibold">{title}</h1> : null}
      </div>

      <div className="flex items-center gap-0">
        <button
          type="button"
          aria-label="Notifications"
          className="theme-text-muted rounded-lg p-1.5 transition hover:bg-slate-100/60 hover:text-slate-100"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          className="theme-text-muted rounded-lg p-1.5 transition hover:bg-slate-100/60 hover:text-slate-100"
        >
          {themeMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label="Help"
          className="theme-text-muted rounded-lg p-1.5 transition hover:bg-slate-100/60 hover:text-slate-100"
        >
          <CircleHelp className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Open user menu"
          className="ml-1 inline-flex items-center gap-1 rounded-lg border border-transparent px-1.5 py-1 text-left transition hover:border-slate-300/40 hover:bg-slate-100/40"
        >
          <Avatar
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            fallback={getUserInitials(user.name)}
            className="h-6 w-6 rounded-full bg-slate-200/70 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100"
          />
          <span className="theme-text-secondary hidden text-xs font-medium lg:inline">{user.name}</span>
          <ChevronDown className="theme-text-muted h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
