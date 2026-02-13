import { useEffect, useState } from 'react';
import { Bell, ChevronDown, CircleHelp, Moon, Sun } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { xProFlowLogoDark, xProFlowLogoLight } from './logoAssets';
import { getUserInitials, useUser } from '../../context/UserContext';
import { xProFlowLogoDark } from './logoAssets';

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
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(themeMode === 'dark' ? 'theme-dark' : 'theme-light');
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between border-b border-slate-200 bg-slate-50/95 px-3 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-2">
        <img
          src={themeMode === 'dark' ? xProFlowLogoLight : xProFlowLogoDark}
          alt="XProFlow"
          className="h-6 w-auto shrink-0"
        />
        {title ? <h1 className="truncate text-sm font-semibold text-slate-700">{title}</h1> : null}
      </div>

      <div className="flex items-center gap-0">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {themeMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label="Help"
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <CircleHelp className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Open user menu"
          className="ml-1 inline-flex items-center gap-1 rounded-lg border border-transparent px-1.5 py-1 text-left transition hover:border-slate-200 hover:bg-white"
        >
          <Avatar
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            fallback={getUserInitials(user.name)}
            className="h-6 w-6 rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
          />
          <span className="hidden text-xs font-medium text-slate-700 lg:inline">{user.name}</span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
